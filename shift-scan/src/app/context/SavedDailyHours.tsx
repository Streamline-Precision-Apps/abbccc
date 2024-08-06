'use client'
import React, { createContext, useState, ReactNode, useContext } from 'react';


interface SavedDailyHoursProps {
    dailyHours: string | null;
    setDailyHours: (dailyHours: string | null) => void;
}

interface SavedDailyHours {
    data: string;
}

const SavedDailyHours = createContext<SavedDailyHoursProps | undefined>(undefined);

export const SavedDailyHoursProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // creates a state 
    const [dailyHours, setDailyHours] = useState<string | null>(null);
    // when the provider is called it will return the value below
return (
    <SavedDailyHours.Provider value={{ dailyHours, setDailyHours }}>
        {children}
    </SavedDailyHours.Provider>
    );
};
// this is used to get the value
export const useSavedDailyHours = () => {
    const context = useContext(SavedDailyHours);
    if (context === undefined) {
    throw new Error('SavedDailyHours must be used within a SavedDailyHoursProvider');
}
    return context;
};