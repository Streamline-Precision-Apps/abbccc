import React, { createContext, useState, ReactNode, useContext, useEffect } from "react";

interface SavedUserData {
  id: string | null;
}

interface SavedUserDataContextType {
  savedUserData: SavedUserData | null;
  setSavedUserData: (userData: SavedUserData | null) => void;
}

const SavedUserDataContext = createContext<SavedUserDataContextType | undefined>(undefined);

export const SavedUserDataProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [savedUserData, setSavedUserDataState] = useState<SavedUserData | null>(() => {
    // Load initial state from localStorage if available
    if (typeof window !== 'undefined') {
      const savedUserJSON = localStorage.getItem("savedUserData");
      return savedUserJSON ? JSON.parse(savedUserJSON) : null;
    } else {
      return null;
    }
  });

  const setSavedUserData = (userData: SavedUserData | null) => {
    setSavedUserDataState(userData);
    // Save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem("savedUserData", JSON.stringify(userData));
    } else {
      localStorage.removeItem("savedUserData");
    }
    return null 
  };

  return (
    <SavedUserDataContext.Provider value={{ savedUserData, setSavedUserData }}>
      {children}
    </SavedUserDataContext.Provider>
  );
};

export const useSavedUserData = () => {
  const context = useContext(SavedUserDataContext);
  if (!context) {
    throw new Error("useSavedUserData must be used within a SavedUserDataProvider");
  }
  return context;
};