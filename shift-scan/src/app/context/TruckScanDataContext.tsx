"use client";
import React, { createContext, useState, ReactNode, useContext } from "react";

type TruckScanDataProps = {
  truckScanData: string | null;
  setTruckScanData: (truckScanData: string | null) => void;
};

const TruckScanData = createContext<TruckScanDataProps | undefined>(undefined);

export const TruckScanDataProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [truckScanData, setTruckScanDataState] = useState<string | null>(() => {
    // Load initial state from localStorage if available
    if (typeof window !== "undefined") {
      const savedData = localStorage.getItem("truckScanData");
      return savedData ? savedData : null;
    } else {
      return null;
    }
  });

  const setTruckScanData = (data: string | null) => {
    setTruckScanDataState(data);
    // Save to localStorage
    if (typeof window !== "undefined") {
      if (data) {
        localStorage.setItem("truckScanData", data);
      } else {
        localStorage.removeItem("truckScanData");
      }
    }
  };

  return (
    <TruckScanData.Provider value={{ truckScanData, setTruckScanData }}>
      {children}
    </TruckScanData.Provider>
  );
};

export const useTruckScanData = () => {
  const context = useContext(TruckScanData);
  if (!context) {
    throw new Error(
      "useTruckScanData must be used within a TruckScanDataProvider"
    );
  }
  return context;
};
