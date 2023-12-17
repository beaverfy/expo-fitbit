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
    onLogin?: () => unknown;
}

export enum StorageKeys {
    OAuth = "fitbit_oauth_data",
}