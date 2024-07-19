import React, { createContext, useState, ReactNode, useContext, useEffect } from "react";

interface SavedTimeSheetData {
id: string;
}

interface SavedTimeSheetDataContextType {
savedTimeSheetData: SavedTimeSheetData | null;
setSavedTimeSheetData: (timesheetData: SavedTimeSheetData | null) => void;
}

const SavedTimeSheetDataContext = createContext<SavedTimeSheetDataContextType | undefined>(undefined);

export const SavedTimeSheetDataProvider: React.FC<{ children: ReactNode }> = ({
children,
}) => {
const [savedTimeSheetData, setSavedTimeSheetDataState] = useState<SavedTimeSheetData | null>(() => {
// Load initial state from localStorage if available
if (typeof window !== 'undefined') {
    const savedTimeSheetJSON = localStorage.getItem("savedTimeSheetData");
    return savedTimeSheetJSON ? JSON.parse(savedTimeSheetJSON) : null;
} else {
    return null;
}
});

const setSavedTimeSheetData = (timesheetData: SavedTimeSheetData | null) => {
setSavedTimeSheetDataState(timesheetData);
// Save to localStorage
if (typeof window !== 'undefined') {
    localStorage.setItem("savedtimeSheetData", JSON.stringify(timesheetData));
} else {
    localStorage.removeItem("savedtimeSheetData");
}
return null 
};

return (
<SavedTimeSheetDataContext.Provider value={{ savedTimeSheetData, setSavedTimeSheetData}}>
    {children}
</SavedTimeSheetDataContext.Provider>
);
};

export const useSavedTimeSheetData = () => {
const context = useContext(SavedTimeSheetDataContext);
if (!context) {
throw new Error("useSavedTimeSheetData must be used within a SavedTimeSheetDataProvider");
}
return context;
};