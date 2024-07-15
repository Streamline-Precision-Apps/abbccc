"use client";
import React, { createContext, useState, ReactNode, useContext } from "react";

interface ClockInTimeProps {
  clockInTime: Date | null;
  setClockInTime: (clockInTime: Date | null) => void;
}

const SavedClockInTime = createContext<ClockInTimeProps | undefined>(undefined);

export const SavedClockInTimeProvider: React.FC<{
  children: ReactNode;
}> = ({ children }) => {
  // creates a state
  const [clockInTime, setClockInTime] = useState<Date | null>(null);
  // when the provider is called it will return the value below
  return (
    <SavedClockInTime.Provider
      value={{
        clockInTime: clockInTime,
        setClockInTime: setClockInTime,
      }}
    >
      {children}
    </SavedClockInTime.Provider>
  );
};
// this is used to get the value
export const useSavedClockInTime = () => {
  const context = useContext(SavedClockInTime);
  if (context === undefined) {
    throw new Error(
      "SavedClockInTime must be used within a SavedClockInTimeProvider"
    );
  }
  return context;
};
