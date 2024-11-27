// This will save the current view for the dashboard.

"use client";
import React, { createContext, useState, ReactNode, useContext } from "react";

type StartingMileageProps = {
  startingMileage: number | null;
  setStartingMileage: (startingMileage: number | null) => void;
};

const StartingMileage = createContext<StartingMileageProps | undefined>(
  undefined
);

export const StartingMileageProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  // creates a state
  const [startingMileage, setStartingMileage] = useState<number | null>(0);
  // when the provider is called it will return the value below
  return (
    <StartingMileage.Provider value={{ startingMileage, setStartingMileage }}>
      {children}
    </StartingMileage.Provider>
  );
};
// this is used to get the value
export const useStartingMileage = () => {
  const context = useContext(StartingMileage);
  if (context === undefined) {
    throw new Error(
      "StartingMileage must be used within a StartingMileageProvider"
    );
  }
  return context;
};
