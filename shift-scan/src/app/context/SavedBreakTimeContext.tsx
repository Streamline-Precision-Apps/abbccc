"use client";
import React, { createContext, useState, useContext, ReactNode, useEffect } from "react";

interface SavedBreakTimeProps {
  breakTime: number;
  setBreakTime: React.Dispatch<React.SetStateAction<number>>;
}

const SavedBreakTimeContext = createContext<SavedBreakTimeProps | undefined>(undefined);

export const SavedBreakTimeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [breakTime, setBreakTime] = useState<number>(0);

  return (
    <SavedBreakTimeContext.Provider value={{ breakTime, setBreakTime }}>
      {children}
    </SavedBreakTimeContext.Provider>
  );
};

export const useSavedBreakTime = () => {
  const context = useContext(SavedBreakTimeContext);
  if (context === undefined) {
    throw new Error("useSavedBreakTime must be used within a SavedBreakTimeProvider");
  }
  return context;
};
