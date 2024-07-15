"use client";
import React, { createContext, useState, ReactNode, useContext } from "react";

interface SavedBreakTimeProps {
  breakTime: number | null;
  setBreakTime: (breakTime: number | null) => void;
}

interface SavedBreakTime {
  data: number;
}

const SavedBreakTime = createContext<SavedBreakTimeProps | undefined>(
  undefined
);

export const SavedBreakTimeProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  // creates a state
  const [breakTime, setBreakTime] = useState<number | null>(null);
  // when the provider is called it will return the value below
  return (
    <SavedBreakTime.Provider
      value={{ breakTime: breakTime, setBreakTime: setBreakTime }}
    >
      {children}
    </SavedBreakTime.Provider>
  );
};
// this is used to get the value
export const useSavedBreakTime = () => {
  const context = useContext(SavedBreakTime);
  if (context === undefined) {
    throw new Error(
      "SavedBreakTime must be used within a SavedBreakTimeProvider"
    );
  }
  return context;
};
