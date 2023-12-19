export interface OAuthResult {
    access_token: string;
    expires_in: number;
    refresh_token: string;
    scope: string;
    token_type: string;
    user_id: string;
    expiryStart: string;
}
export interface ProfileData {
    email: string;
    family_name: string;
    given_name: string;
    id: string;
    locale: string;
    name: string;
    picture: string;
    verified_email: boolean;
}
export declare enum Methods {
    Get = "GET",
    Post = "POST"
}
//# sourceMappingURL=api.d.ts.map