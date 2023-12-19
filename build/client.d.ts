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
    };
}
//# sourceMappingURL=client.d.ts.map