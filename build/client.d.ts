import { Configuration } from "./types/client";
import { ProfileData } from "./types/api";
export declare class FitbitClient {
    configuration: Configuration;
    constructor(configuration: Configuration);
    private buildRedirectURL;
    private fetchProfile;
    private refreshToken;
    useConfiguration(): {
        userData: ProfileData | undefined;
        isLoading: boolean;
        isLoggedIn: boolean;
        refreshProfile: () => void;
        promptAsync: (options?: import("expo-auth-session").AuthRequestPromptOptions | undefined) => Promise<import("expo-auth-session").AuthSessionResult>;
    };
}
//# sourceMappingURL=client.d.ts.map