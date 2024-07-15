"use client";
import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useContext,
} from "react";

interface SavedBreakTimeProps {
  breakTime: number;
  setBreakTime: React.Dispatch<React.SetStateAction<number>>;
}

const SavedBreakTimeContext = createContext<SavedBreakTimeProps | undefined>(
  undefined
);

export const SavedBreakTimeProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [breakTime, setBreakTime] = useState<number>(() => {
    // Initialize breakTime from localStorage if it exists, otherwise default to 0
    const savedBreakTime = localStorage.getItem("breakTime");
    return savedBreakTime ? parseInt(savedBreakTime, 10) : 0;
  });

  useEffect(() => {
    // Save breakTime to localStorage whenever it changes
    localStorage.setItem("breakTime", breakTime.toString());
  }, [breakTime]);

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
