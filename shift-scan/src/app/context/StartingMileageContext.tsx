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
  const [startingMileage, setStartingMileageState] = useState<number | null>(() => {
    // Load initial state from localStorage if available
    if (typeof window !== "undefined") {
      const savedMileage = localStorage.getItem("startingMileage");
      return savedMileage ? parseFloat(savedMileage) : null;
    } else {
      return null;
    }
  });

  const setStartingMileage = (mileage: number | null) => {
    setStartingMileageState(mileage);
    // Save to localStorage
    if (typeof window !== "undefined") {
      if (mileage !== null) {
        localStorage.setItem("startingMileage", mileage.toString());
      } else {
        localStorage.removeItem("startingMileage");
      }
    }
  };

  return (
    <StartingMileage.Provider value={{ startingMileage, setStartingMileage }}>
      {children}
    </StartingMileage.Provider>
  );
};

export const useStartingMileage = () => {
  const context = useContext(StartingMileage);
  if (!context) {
    throw new Error(
      "useStartingMileage must be used within a StartingMileageProvider"
    );
  }
  return context;
};
