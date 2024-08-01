import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define types for Equipment context
type Equipment = {
id: string;
qr_id: string;
name: string;
};

interface EquipmentContextType {
equipmentResults: Equipment[];
recentlyUsedEquipment: Equipment[];
setEquipmentResults: React.Dispatch<React.SetStateAction<Equipment[]>>;
addRecentlyUsedEquipment: (equipment: Equipment) => void;
}

// Create context
const EquipmentContext = createContext<EquipmentContextType>({
equipmentResults: [],
recentlyUsedEquipment: [],
setEquipmentResults: () => {},
addRecentlyUsedEquipment: () => {},
});

// Provider component
export const EquipmentProvider = ({ children }: { children: ReactNode }) => {
const [equipmentResults, setEquipmentResults] = useState<Equipment[]>([]);
const [recentlyUsedEquipment, setRecentlyUsedEquipment] = useState<Equipment[]>([]);

// Function to add equipment to the recently used list
const addRecentlyUsedEquipment = (equipment: Equipment) => {
setRecentlyUsedEquipment((prev) => {
    const updatedList = [equipment, ...prev.filter((e) => e.id !== equipment.id)];
    return updatedList.slice(0, 5); // Keep only the last 5 entries
});
};

return (
<EquipmentContext.Provider
    value={{ equipmentResults, setEquipmentResults, recentlyUsedEquipment, addRecentlyUsedEquipment }}
>
    {children}
</EquipmentContext.Provider>
);
};

// Custom hook to use the Equipment context
export const useDBEquipment = () => useContext(EquipmentContext);