import React, { ReactNode } from 'react';
import { Configuration, FitbitProviderData } from '../types/client';
interface DataContextProps {
    children: ReactNode;
    configuration: Configuration;
}
export declare const FitbitProvider: React.FC<DataContextProps>;
export declare const useFitbitProvider: () => FitbitProviderData;
export {};
//# sourceMappingURL=provider.d.ts.map