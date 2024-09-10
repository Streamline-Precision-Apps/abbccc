import React, {
  createContext,
  useState,
  ReactNode,
  useContext,
  useEffect,
} from "react";

interface SavedInjuryReportData {
  contactedSupervisor: boolean;
  incidentDescription: string;
  signedForm: string;
}

interface SavedInjuryReportDataContextType {
  savedInjuryReportData: SavedInjuryReportData | null;
  setSavedInjuryReportData: (
    injuryReportData: SavedInjuryReportData | null
  ) => void;
}

const SavedInjuryReportDataContext = createContext<
  SavedInjuryReportDataContextType | undefined
>(undefined);

export const SavedInjuryReportDataProvider: React.FC<{
  children: ReactNode;
}> = ({ children }) => {
  const [savedInjuryReportData, setSavedInjuryReportDataState] =
    useState<SavedInjuryReportData | null>(() => {
      // Load initial state from localStorage if available
      if (typeof window !== "undefined") {
        const savedInjuryReportJSON =
          localStorage.getItem("savedTimeSheetData");
        return savedInjuryReportJSON ? JSON.parse(savedInjuryReportJSON) : null;
      } else {
        return null;
      }
    });

  const setSavedInjuryReportData = (
    injuryReportData: SavedInjuryReportData | null
  ) => {
    setSavedInjuryReportDataState(injuryReportData);
    // Save to localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem(
        "savedInjuryReportData",
        JSON.stringify(injuryReportData)
      );
    } else {
      localStorage.removeItem("savedInjuryReportData");
    }
    return null;
  };

  return (
    <SavedInjuryReportDataContext.Provider
      value={{
        savedInjuryReportData: savedInjuryReportData,
        setSavedInjuryReportData: setSavedInjuryReportData,
      }}
    >
      {children}
    </SavedInjuryReportDataContext.Provider>
  );
};

export const useSavedInjuryReportData = () => {
  const context = useContext(SavedInjuryReportDataContext);
  if (!context) {
    throw new Error(
      "useSavedInjuryReportData must be used within a SavedInjuryReportDataProvider"
    );
  }
  return context;
};
