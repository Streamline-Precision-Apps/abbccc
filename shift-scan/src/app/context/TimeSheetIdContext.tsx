// Stores the id for the time sheet that is currently open (waiting to be submitted when you clock out).

"use client";
import { setPrevTimeSheet } from "@/actions/cookieActions";
import React, {
  createContext,
  useState,
  ReactNode,
  useContext,
  useEffect,
} from "react";

type TimeSheetData = {
  id: string;
};

type TimeSheetDataContextType = {
  savedTimeSheetData: TimeSheetData | null;
  setTimeSheetData: (timesheetData: TimeSheetData | null) => void;
};

const TimeSheetDataContext = createContext<
  TimeSheetDataContextType | undefined
>(undefined);

export const TimeSheetDataProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [savedTimeSheetData, setTimeSheetData] = useState<TimeSheetData | null>(
    null
  );

  useEffect(() => {
    const savedTimeSheet = async () => {
      try {
        setPrevTimeSheet(savedTimeSheetData?.id || "");
      } catch (error) {
        console.error(error);
      }
    };
    savedTimeSheet();
  }, [savedTimeSheetData?.id]);

  return (
    <TimeSheetDataContext.Provider
      value={{ savedTimeSheetData, setTimeSheetData }}
    >
      {children}
    </TimeSheetDataContext.Provider>
  );
};

export const useTimeSheetData = () => {
  const context = useContext(TimeSheetDataContext);
  if (!context) {
    throw new Error(
      "useTimeSheetData must be used within a TimeSheetDataProvider"
    );
  }
  return context;
};
