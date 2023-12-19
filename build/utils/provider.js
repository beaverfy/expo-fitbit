import React, { createContext, useContext } from 'react';
import { FitbitClient } from '../client';
const DataContext = createContext(undefined);
export const FitbitProvider = ({ children, configuration }) => {
    const fitbitClient = new FitbitClient({
        ...configuration
    }).useConfiguration();
    const value = fitbitClient;
    return React.createElement(DataContext.Provider, { value: value }, children);
};
export const useFitbitProvider = () => {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error('useModalContext must be used within a ModalProvider');
    }
    return context;
};
//# sourceMappingURL=provider.js.map