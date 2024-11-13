// This will save the current view for the dashboard.

"use client";
import React, { createContext, useState, ReactNode, useContext } from "react";

type CurrentViewProps = {
  currentView: string | null;
  setCurrentView: (currentView: string | null) => void;
};

const CurrentView = createContext<CurrentViewProps | undefined>(
  undefined
);

export const CurrentViewProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  // creates a state
  const [currentView, setCurrentView] = useState<string | null>("");
  // when the provider is called it will return the value below
  return (
    <CurrentView.Provider value={{ currentView, setCurrentView }}>
      {children}
    </CurrentView.Provider>
  );
};
// this is used to get the value
export const useCurrentView = () => {
  const context = useContext(CurrentView);
  if (context === undefined) {
    throw new Error(
      "CurrentView must be used within a CurrentViewProvider"
    );
  }
  return context;
};
