"use client";
import React, { createContext, useState, ReactNode, useContext } from "react";

// creates a prop to be passes to a context
interface SavedUserDataProps {
  savedUserData: savedUserData | null;
  setUserData: (userData: savedUserData | null) => void;
}
// creates a value to a savedUserData context
interface savedUserData {
  firstName: string | null;
  lastName: string | null;
  date: Date | null;
}
// creates a context for the savedUserData we pass this through the export
const savedUserData = createContext<SavedUserDataProps | undefined>(undefined);

export const SavedUserDataProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  // creates a state for the savedUserData
  const [user, setUser] = useState<savedUserData | null>(null);
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
