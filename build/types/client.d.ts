import { ProfileData } from "./api";
export interface ClientStorage {
    set: (key: string, value: string) => unknown;
    get: (key: string) => unknown;
}
export interface Configuration {
    clientId: string;
    clientSecret: string;
    appScheme: string;
    scopes: string[];
    storage: ClientStorage;
    debugLogs?: boolean;
    onLogin?: (user: ProfileData) => unknown;
}
export interface FitbitProviderData {
    userData: ProfileData | undefined;
    isLoading: boolean;
    isLoggedIn: boolean;
    promptAsync: () => void;
}
export declare enum StorageKeys {
    OAuth = "fitbit_oauth_data"
}
//# sourceMappingURL=client.d.ts.map