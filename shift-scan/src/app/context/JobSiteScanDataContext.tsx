// Saves any jobsite data scanned by the qr-scanner.

'use client'
import React, { createContext, useState, ReactNode, useContext } from 'react';

interface ScanDataContextProps {
    scanResult: ScanResult | null;
    setScanResult: (result: ScanResult | null) => void;
}

interface ScanResult {
    data: string;
}

const ScanDataContext = createContext<ScanDataContextProps | undefined>(undefined);

export const ScanDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [scanResult, setScanResult] = useState<ScanResult | null>(null);

return (
    <ScanDataContext.Provider value={{ scanResult, setScanResult }}>
        {children}
    </ScanDataContext.Provider>
    );
};

export const useScanData = () => {
    const context = useContext(ScanDataContext);
    if (context === undefined) {
    throw new Error('useScanData must be used within a ScanDataProvider');
}
    return context;
};