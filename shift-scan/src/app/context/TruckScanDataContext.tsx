// This will save the current view for the dashboard.

"use client";
import React, { createContext, useState, ReactNode, useContext } from "react";

type TruckScanDataProps = {
  truckScanData: string | null;
  setTruckScanData: (truckScanData: string | null) => void;
};

const TruckScanData = createContext<TruckScanDataProps | undefined>(
  undefined
);

export const TruckScanDataProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  // creates a state
  const [truckScanData, setTruckScanData] = useState<string | null>("");
  // when the provider is called it will return the value below
  return (
    <TruckScanData.Provider value={{ truckScanData, setTruckScanData }}>
      {children}
    </TruckScanData.Provider>
  );
};
// this is used to get the value
export const useTruckScanData = () => {
  const context = useContext(TruckScanData);
  if (context === undefined) {
    throw new Error(
      "TruckScanData must be used within a TruckScanDataProvider"
    );
  }
  return context;
};
