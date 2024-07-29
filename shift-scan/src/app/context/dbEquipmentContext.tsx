'use client';

import React, { createContext, useState, ReactNode, useContext } from 'react';

interface Equipment {
    id: string;
    qr_id: string;
    name: string;
}

interface DbEquipmentContextProps {
    equipmentResults: Equipment[];
    setEquipmentResults: (equipmentResults: Equipment[]) => void;
}

const DbEquipmentContext = createContext<DbEquipmentContextProps | undefined>(undefined);

export const DbEquipmentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [equipmentResults, setEquipmentResults] = useState<Equipment[]>([]);

    return (
        <DbEquipmentContext.Provider value={{ equipmentResults, setEquipmentResults }}>
            {children}
        </DbEquipmentContext.Provider>
    );
};

export const useDBEquipment = () => {
    const context = useContext(DbEquipmentContext);
    if (context === undefined) {
        throw new Error('useDBEquipment must be used within a DbEquipmentProvider');
    }
    return context;
};