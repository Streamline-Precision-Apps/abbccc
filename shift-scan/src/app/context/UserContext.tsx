"use client";
import React, { createContext, useState, ReactNode, useContext } from "react";

// creates a prop to be passes to a context
interface SavedUserDataProps {
  savedUserData: string | null;
  setUserData: (userData: string | null) => void;
}
// creates a value to a savedUserData context
interface savedUserData {
  savedUserData: string;
}
// creates a context for the savedUserData we pass this through the export
const savedUserData = createContext<SavedUserDataProps | undefined>(undefined);

export const SavedUserDataProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  // creates a state for the savedUserData
  const [user, setUser] = useState<string | null>(null);
  // when the provider is called it will return the value below
  return (
    <savedUserData.Provider
      value={{ savedUserData: user, setUserData: setUser }}
    >
      {children}
    </savedUserData.Provider>
  );
};
// this is used to get the value of the savedUserData
export const useSavedUser = () => {
  const context = useContext(savedUserData);
  if (context === undefined) {
    throw new Error("useScanData must be used within a ScanDataProvider");
  }
  return context;
};
