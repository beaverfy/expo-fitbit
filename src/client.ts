import { makeRedirectUri, useAuthRequest } from "expo-auth-session";
import { Configuration, StorageKeys } from "./types/client";
import ExpoFitbitError from "./utils/error";
import { discovery } from "./utils/constants";
import { useCallback, useEffect, useState } from "react";
import { Methods, OAuthResult, OAuthStorageValue, ProfileData } from "./types/api";
import { Routes } from "./utils/routes";
import { stringify } from "qs";
import { encode } from "base-64";
import { Logger } from "./utils/logger";

/**
 * #### ⚠️ NOT INTENDED FOR REGULAR USAGE
 * 
 * This class is built to be internal, only use this if you need advanced configuration or use `FitbitProvider` (read more: https://expo-fitbit.vercel.app/guides/getting-started#wrap-your-app-in-fitbitprovider)
 */
export class FitbitClient {
    public configuration: Configuration;
    public logger: Logger = new Logger(false);
    constructor(configuration: Configuration) {
        this.configuration = configuration;
        if (this.configuration.debugLogs === true) this.logger.setConsoleLog(
            this.configuration.debugLogs
        );
    }

    private buildRedirectURL() {
        if (!this.configuration.appScheme) throw new ExpoFitbitError("Looks like you forgot to add appScheme to your config")
        return makeRedirectUri({
            scheme: this.configuration.appScheme,
            path: "fitbit"
        });
    }

    private isTokenValid(created_at: number, expires_in: number) {
        const now = Date.now() / 1000;
        const expiry = created_at + expires_in;
        return now < expiry;
    }

    private async tryResurrect() {
        try {
            const accessTokens = this.configuration.storage.get(StorageKeys.OAuth) as OAuthStorageValue;
            const { expires_in, created_at, refresh_token } = accessTokens;
            if (this.isTokenValid(created_at, expires_in)) {
                this.logger.debug("Token still valid, resurrecting state");
                const profile = await this.fetchProfile(accessTokens);
                return {
                    oauth: accessTokens,
                    profile
                };
            } else {
                this.logger.debug("Token expired, trying to fetch a new token");
                const newOAuth = await this.refreshToken(refresh_token);
                const profile = await this.fetchProfile(newOAuth);
                return {
                    oauth: newOAuth,
                    profile
                };
            }
        } catch (e) {
            throw new ExpoFitbitError("Couldn't resurrect the old user's state: " + e);
        }
    }

    private async fetchProfile({ access_token, token_type }: {
        access_token: string;
        token_type: string;
    }): Promise<ProfileData> {
        const fetched = await fetch(Routes.Profile(), {
            headers: {
                'Authorization': `${token_type} ${access_token}`,
                'Accept': 'application/json'
            }
        });

        if (!fetched.ok) {
            const text = fetched.text();
            this.logger.error(`Couldn't fetch the user's profile: ` + text);
            throw new ExpoFitbitError(`Couldn't fetch the user's profile: ${text}`);
        } else {
            const jsonData = await fetched.json() as {
                user: {
                    avatar: string;
                    displayName: string;
                    avatar150: string;
                    avatar640: string;
                    encodedId: string;
                    firstName: string;
                    lastName: string;
                    country: string;
                }
            };

            return {
                email: jsonData.user.encodedId,
                family_name: jsonData.user.lastName,
                given_name: jsonData.user.firstName,
                id: jsonData.user.encodedId,
                locale: jsonData.user.country,
                name: jsonData.user.displayName,
                picture: jsonData.user.avatar,
                verified_email: false
            };
        }
    }

    /**
     * Requests to refresh the user's access tokens using the refresh token and updates the storage key
     */
    private async refreshToken(refresh_token: string): Promise<OAuthStorageValue> {
        const options: RequestInit = {
            method: Methods.Post,
            body: stringify({
                grant_type: 'refresh_token',
                refresh_token: refresh_token
            }),
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization":
                    'Basic ' +
                    encode(this.configuration.clientId + ':' + this.configuration.clientSecret),
                "Accept": 'application/json, text/plain, */*',
                "grant_type": "refresh_token"
            },
        };

        this.logger.debug(`Requesting a new access token with options: ${JSON.stringify(options)}`)
        const result = await fetch(Routes.Token(), options).then(r => r.json()) as OAuthResult;

        if (typeof result?.access_token == "string") {
            this.configuration.storage.set(StorageKeys.OAuth, JSON.stringify(result));
            return {
                ...result,
                created_at: Date.now()
            };
        } else throw new ExpoFitbitError("Couldn't get a new pair of access tokens: " + JSON.stringify(result));
    }

    useConfiguration() {
        const [userData, setUserData] = useState<ProfileData>();
        const [isLoading, setLoading] = useState(false);
        const [isLoggedIn, setIsLoggedIn] = useState(false);
        const [access_token, setAccessToken] = useState<string>();
        const [token_type, setTokenType] = useState<string>();
        const [request, response, promptAsync] = useAuthRequest(
            {
                clientId: this.configuration.clientId,
                scopes: this.configuration.scopes,
                redirectUri: this.buildRedirectURL()
            },
            discovery
        );

        const refreshProfile = useCallback(() => {
            (async () => {
                if (!access_token || token_type) {
                    const error = {
                        error: true,
                        message: "access_token and/or token_type is undefined (user not logged in)"
                    };

                    if (this.configuration.debugLogs) console.log(error);
                    return error;
                } else {
                    const val = await this.fetchProfile({
                        access_token: access_token as string,
                        token_type: token_type as string
                    });

                    setUserData(val);
                    const message = {
                        error: false,
                        message: "Fetched and updated user profile data"
                    };

                    if (this.configuration.debugLogs) console.log(message);
                    return message;
                }
            })();
        }, [access_token, token_type]);

        useEffect(() => {
            // Initial resurrect
            setLoading(true);
            this.logger.debug("Attempting to resurrect the old user");
            (async () => {
                try {
                    const resurrected = await this.tryResurrect();
                    setUserData(resurrected.profile);
                    setLoading(false);
                } catch (e) {
                    this.logger.error(`Couldn't resurrect, skipping: ${e}`)
                }
            })();
        }, []);

        useEffect(() => {
            if (response?.type === 'success') {
                setLoading(true);
                const { code } = response.params;
                (async () => {
                    if (!request?.codeVerifier) throw new ExpoFitbitError("request.codeVerifier is undefined");
                    const body = new URLSearchParams({
                        'client_id': this.configuration.clientId,
                        'code': code,
                        'code_verifier': request.codeVerifier,
                        'grant_type': 'authorization_code',
                        'redirect_uri': this.buildRedirectURL()
                    });

                    await fetch(`${discovery.tokenEndpoint}?${body.toString()}`, {
                        method: "POST",
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        },
                        body
                    }).then(async r => {
                        if (r.status == 200) {
                            const rslt = await r.json() as OAuthStorageValue;
                            this.configuration.storage.set(StorageKeys.OAuth, JSON.stringify({
                                ...rslt,
                                created_at: Date.now()
                            } as OAuthStorageValue));

                            this.fetchProfile({
                                access_token: rslt.access_token,
                                token_type: rslt.token_type
                            })
                                .then(val => {
                                    if (this.configuration.onLogin && typeof val == "object") this.configuration.onLogin(val);
                                    setIsLoggedIn(true);
                                    setUserData(val);
                                    setLoading(false);
                                });
                        }
                    })
                })();
            }
        }, [response]);

        return {
            userData,
            isLoading,
            isLoggedIn,
            refreshProfile,
            promptAsync
        }
    }
}