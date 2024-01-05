import React, { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction } from 'react';
import { Configuration, FitbitProviderData } from '../types/client';
import { FitbitClient } from '../client';

interface DataContextProps {
    children: ReactNode;
    configuration: Configuration;
}

const DataContext = createContext<FitbitProviderData | undefined>(undefined);

export const FitbitProvider: React.FC<DataContextProps> = ({ children, configuration }) => {
    const fitbitClient = new FitbitClient({
        ...configuration
    }).useConfiguration();

    const value: FitbitProviderData = fitbitClient;

    return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useFitbitProvider = (): FitbitProviderData => {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error('useModalContext must be used within a ModalProvider');
    }
    return context;
};
