import { makeRedirectUri, useAuthRequest } from "expo-auth-session";
import { Configuration, StorageKeys } from "./types/client";
import ExpoFitbitError from "./utils/error";
import { discovery } from "./utils/constants";
import { useEffect, useState } from "react";
import { Methods, OAuthResult, ProfileData } from "./types/api";
import { Routes } from "./utils/routes";
import { stringify } from "qs";
import { encode } from "base-64";

export class FitbitClient {
    public configuration: Configuration;
    constructor(configuration: Configuration) {
        this.configuration = configuration;
    }

    private buildRedirectURL() {
        if (!this.configuration.appScheme) throw new ExpoFitbitError("Looks like you forgot to add appScheme to your config")
        return makeRedirectUri({
            scheme: this.configuration.appScheme,
            path: "fitbit"
        });
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
            verified_email: true
        };
    }

    private async refreshToken(refresh_token: string) {
        const result = await fetch(Routes.Token(), {
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
        }).then(r => r.json()) as OAuthResult;

        if (typeof result?.access_token == "string") {
            this.configuration.storage.set(StorageKeys.OAuth, JSON.stringify(result));
            return result;
        } else throw new ExpoFitbitError("Couldn't get a new pair of access tokens");
    }

    private useAuthentication() {
        const [userData, setUserData] = useState<ProfileData>();
        const [isLoading, setLoading] = useState(false);
        const [isLoggedIn, setIsLoggedIn] = useState(false);
        const [request, response, promptAsync] = useAuthRequest(
            {
                clientId: this.configuration.clientId,
                scopes: this.configuration.scopes,
                redirectUri: this.buildRedirectURL()
            },
            discovery
        );

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
                            const rslt = await r.json() as OAuthResult;
                            this.configuration.storage.set(StorageKeys.OAuth, JSON.stringify({
                                ...rslt,
                                expiryStart: new Date().toISOString()
                            }));

                            this.fetchProfile({
                                access_token: rslt.access_token,
                                token_type: rslt.token_type
                            })
                                .then(val => {
                                    if (this.configuration.onLogin) this.configuration.onLogin();
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
            isLoggedIn
        }
    }
}