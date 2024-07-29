'use client';

import React, { createContext, useState, ReactNode, useContext } from 'react';

interface CostCode {
    id: number;
    cost_code: string;
    cost_code_description: string;
}

interface DbcostcodeContextProps {
    costcodeResults: CostCode[];
    setCostcodeResults: (costcodeResults: CostCode[]) => void;
}

const DbcostcodeContext = createContext<DbcostcodeContextProps | undefined>(undefined);

export const DbcostcodeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [costcodeResults, setCostcodeResults] = useState<CostCode[]>([]);

    return (
        <DbcostcodeContext.Provider value={{ costcodeResults, setCostcodeResults }}>
            {children}
        </DbcostcodeContext.Provider>
    );
};

export const useDBCostcode = () => {
    const context = useContext(DbcostcodeContext);
    if (context === undefined) {
        throw new Error('useDBCostcode must be used within a DbcostcodeProvider');
    }
    return context;
};