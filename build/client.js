import { makeRedirectUri, useAuthRequest } from "expo-auth-session";
import { StorageKeys } from "./types/client";
import ExpoFitbitError from "./utils/error";
import { discovery } from "./utils/constants";
import { useCallback, useEffect, useState } from "react";
import { Methods } from "./types/api";
import { Routes } from "./utils/routes";
import { stringify } from "qs";
import { encode } from "base-64";
export class FitbitClient {
    configuration;
    constructor(configuration) {
        this.configuration = configuration;
    }
    buildRedirectURL() {
        if (!this.configuration.appScheme)
            throw new ExpoFitbitError("Looks like you forgot to add appScheme to your config");
        return makeRedirectUri({
            scheme: this.configuration.appScheme,
            path: "fitbit"
        });
    }
    async fetchProfile({ access_token, token_type }) {
        const fetched = await fetch(Routes.Profile(), {
            headers: {
                'Authorization': `${token_type} ${access_token}`,
                'Accept': 'application/json'
            }
        });
        const jsonData = await fetched.json();
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
    async refreshToken(refresh_token) {
        const result = await fetch(Routes.Token(), {
            method: Methods.Post,
            body: stringify({
                grant_type: 'refresh_token',
                refresh_token: refresh_token
            }),
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": 'Basic ' +
                    encode(this.configuration.clientId + ':' + this.configuration.clientSecret),
                "Accept": 'application/json, text/plain, */*',
                "grant_type": "refresh_token"
            },
        }).then(r => r.json());
        if (typeof result?.access_token == "string") {
            this.configuration.storage.set(StorageKeys.OAuth, JSON.stringify(result));
            return result;
        }
        else
            throw new ExpoFitbitError("Couldn't get a new pair of access tokens");
    }
    useConfiguration() {
        const [userData, setUserData] = useState();
        const [isLoading, setLoading] = useState(false);
        const [isLoggedIn, setIsLoggedIn] = useState(false);
        const [access_token, setAccessToken] = useState();
        const [token_type, setTokenType] = useState();
        const [request, response, promptAsync] = useAuthRequest({
            clientId: this.configuration.clientId,
            scopes: this.configuration.scopes,
            redirectUri: this.buildRedirectURL()
        }, discovery);
        const refreshProfile = useCallback(() => {
            (async () => {
                if (!access_token || token_type) {
                    const error = {
                        error: true,
                        message: "access_token and/or token_type is undefined (user not logged in)"
                    };
                    if (this.configuration.debugLogs)
                        console.log(error);
                    return error;
                }
                else {
                    const val = await this.fetchProfile({
                        access_token: access_token,
                        token_type: token_type
                    });
                    setUserData(val);
                    const message = {
                        error: false,
                        message: "Fetched and updated user profile data"
                    };
                    if (this.configuration.debugLogs)
                        console.log(message);
                    return message;
                }
            })();
        }, [access_token, token_type]);
        useEffect(() => {
            if (response?.type === 'success') {
                setLoading(true);
                const { code } = response.params;
                (async () => {
                    if (!request?.codeVerifier)
                        throw new ExpoFitbitError("request.codeVerifier is undefined");
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
                    }).then(async (r) => {
                        if (r.status == 200) {
                            const rslt = await r.json();
                            this.configuration.storage.set(StorageKeys.OAuth, JSON.stringify({
                                ...rslt,
                                expiryStart: new Date().toISOString()
                            }));
                            this.fetchProfile({
                                access_token: rslt.access_token,
                                token_type: rslt.token_type
                            })
                                .then(val => {
                                if (this.configuration.onLogin)
                                    this.configuration.onLogin(val);
                                setIsLoggedIn(true);
                                setUserData(val);
                                setLoading(false);
                            });
                        }
                    });
                })();
            }
        }, [response]);
        return {
            userData,
            isLoading,
            isLoggedIn,
            refreshProfile,
            promptAsync
        };
    }
}
//# sourceMappingURL=client.js.map