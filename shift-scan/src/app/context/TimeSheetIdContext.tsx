// Stores the id for the time sheet that is currently open (waiting to be submitted when you clock out).

import React, { createContext, useState, ReactNode, useContext, useEffect } from "react";

type TimeSheetData = {
id: string;
}

type TimeSheetDataContextType = {
savedTimeSheetData: TimeSheetData | null;
setTimeSheetData: (timesheetData: TimeSheetData | null) => void;
}

const TimeSheetDataContext = createContext<TimeSheetDataContextType | undefined>(undefined);

export const TimeSheetDataProvider: React.FC<{ children: ReactNode }> = ({
children,
}) => {
const [savedTimeSheetData, setTimeSheetDataState] = useState<TimeSheetData | null>(() => {
// Load initial state from localStorage if available
if (typeof window !== 'undefined') {
    const savedTimeSheetJSON = localStorage.getItem("savedTimeSheetData");
    return savedTimeSheetJSON ? JSON.parse(savedTimeSheetJSON) : null;
} else {
    return null;
}
});

const setTimeSheetData = (timesheetData: TimeSheetData | null) => {
setTimeSheetDataState(timesheetData);
// Save to localStorage
if (typeof window !== 'undefined') {
    localStorage.setItem("savedtimeSheetData", JSON.stringify(timesheetData));
} else {
    localStorage.removeItem("savedtimeSheetData");
}
return null 
};

return (
<TimeSheetDataContext.Provider value={{ savedTimeSheetData, setTimeSheetData}}>
    {children}
</TimeSheetDataContext.Provider>
);
};

export const useTimeSheetData = () => {
const context = useContext(TimeSheetDataContext);
if (!context) {
throw new Error("useTimeSheetData must be used within a TimeSheetDataProvider");
}
return context;
};