import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define types for CostCode context
type CostCode = {
id: number;
cost_code: string;
cost_code_description: string;
};

interface CostCodeContextType {
costcodeResults: CostCode[];
recentlyUsedCostCodes: CostCode[];
setCostcodeResults: React.Dispatch<React.SetStateAction<CostCode[]>>;
addRecentlyUsedCostCode: (code: CostCode) => void;
}

// Create context
const CostCodeContext = createContext<CostCodeContextType>({
costcodeResults: [],
recentlyUsedCostCodes: [],
setCostcodeResults: () => {},
addRecentlyUsedCostCode: () => {},
});

// Provider component
export const CostCodeProvider = ({ children }: { children: ReactNode }) => {
const [costcodeResults, setCostcodeResults] = useState<CostCode[]>([]);
const [recentlyUsedCostCodes, setRecentlyUsedCostCodes] = useState<CostCode[]>([]);

// Function to add a code to the recently used list
const addRecentlyUsedCostCode = (code: CostCode) => {
setRecentlyUsedCostCodes((prev) => {
    const updatedList = [code, ...prev.filter((c) => c.id !== code.id)];
    return updatedList.slice(0, 5); // Keep only the last 5 entries
});
};

return (
<CostCodeContext.Provider
    value={{ costcodeResults, setCostcodeResults, recentlyUsedCostCodes, addRecentlyUsedCostCode }}
>
    {children}
</CostCodeContext.Provider>
);
};

// Custom hook to use the CostCode context
export const useDBCostcode = () => useContext(CostCodeContext);