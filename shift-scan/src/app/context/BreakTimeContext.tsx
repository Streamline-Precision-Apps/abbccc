// TODO: This may be helpful to show breaktime, but there is currently a bug. Come back to this.
// needs to be looked at for the reason its not working
"use client";
import React, { createContext, useState, useContext, ReactNode } from "react";

type SavedBreakTimeProps = {
  breakTime: number;
  setBreakTime: React.Dispatch<React.SetStateAction<number>>;
};

const SavedBreakTimeContext = createContext<SavedBreakTimeProps | undefined>(
  undefined
);

export const SavedBreakTimeProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
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
    throw new Error(
      "useSavedBreakTime must be used within a SavedBreakTimeProvider"
    );
  }
  return context;
};
