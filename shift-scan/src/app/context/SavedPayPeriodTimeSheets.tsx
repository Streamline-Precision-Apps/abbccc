'use client';
import { PayPeriodTimesheets } from '@/lib/types';
import React, { createContext, useState, ReactNode, useContext } from 'react';

interface SavedPayPeriodTimeSheetProps {
    payPeriodTimeSheet: PayPeriodTimesheets[] | null;
    setPayPeriodTimeSheets: (payPeriodTimeSheets: PayPeriodTimesheets[] | null) => void; // Corrected here
}

const SavedPayPeriodTimeSheet = createContext<SavedPayPeriodTimeSheetProps | undefined>(undefined);

export const SavedPayPeriodTimeSheetProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // creates a state
    const [payPeriodTimeSheet, setPayPeriodTimeSheet] = useState<PayPeriodTimesheets[] | null>(null);
    // when the provider is called it will return the value below
    return (
        <SavedPayPeriodTimeSheet.Provider value={{ payPeriodTimeSheet, setPayPeriodTimeSheets: setPayPeriodTimeSheet }}> {/* Corrected here */}
            {children}
        </SavedPayPeriodTimeSheet.Provider>
    );
};
// this is used to get the value
export const useSavedPayPeriodTimeSheet = () => {
    const context = useContext(SavedPayPeriodTimeSheet);
    if (context === undefined) {
        throw new Error('SavedPayPeriodTimeSheet must be used within a SavedPayPeriodTimeSheetProvider');
    }
    return context;
};
