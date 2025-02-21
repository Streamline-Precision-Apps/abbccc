"use client";
import { setPrevTimeSheet } from "@/actions/cookieActions";
import { usePathname } from "next/navigation";
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
  const url = usePathname();

  useEffect(() => {
    const savedTimeSheet = async () => {
      try {
        if (
          url === "/clock" ||
          url === "/dashboard/log-new" ||
          url === "/dashboard/switch-jobs" ||
          url === "/break"
        ) {
          const prevTimeSheet = await fetch("/api/getRecentTimecard");
          const data = await prevTimeSheet.json();

          if (data) {
            setTimeSheetData(data);
            // Only attempt to setPrevTimeSheet if data.id exists
            if (data.id) {
              setPrevTimeSheet(data.id as string);
            } else {
              console.warn("TimeSheet data received without an id.");
            }
          } else {
            console.warn("No TimeSheet data received from the API.");
          }
        }
      } catch (error) {
        console.error(error);
      }
    };
    savedTimeSheet();
  }, [url]);

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
