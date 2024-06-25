'use client'
import React, { createContext, useState, ReactNode, useContext } from 'react';


interface SavedPayPeriodHoursProps {
    payPeriodHours: string | null;
    setPayPeriodHours: (payPeriodHours: string | null) => void;
}

interface SavedPayPeriodHours {
    data: string;
}

const SavedPayPeriodHours = createContext<SavedPayPeriodHoursProps | undefined>(undefined);

export const SavedPayPeriodHoursProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // creates a state 
    const [payPeriodHours, setPayPeriodHours] = useState<string | null>(null);
    // when the provider is called it will return the value below
return (
    <SavedPayPeriodHours.Provider value={{ payPeriodHours, setPayPeriodHours }}>
        {children}
    </SavedPayPeriodHours.Provider>
    );
};
// this is used to get the value
export const useSavedPayPeriodHours = () => {
    const context = useContext(SavedPayPeriodHours);
    if (context === undefined) {
    throw new Error('SavedPayPeriodHours must be used within a SavedPayPeriodHoursProvider');
}
    return context;
};