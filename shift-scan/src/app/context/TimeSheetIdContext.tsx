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
          url === "/dashboard/equipment/log-new" ||
          url === "/dashboard/switch-jobs" ||
          url === "/break"
        ) {
          const prevTimeSheet = await fetch("/api/getRecentTimecard");

          // Check if the response is OK (status code 200-299)
          if (!prevTimeSheet.ok) {
            throw new Error(
              `Failed to fetch recent timecard: ${prevTimeSheet.statusText}`
            );
          }

          // Parse the response as JSON
          const data = await prevTimeSheet.json();

          // Check if the data is valid
          if (data && data.id) {
            setTimeSheetData(data);
            setPrevTimeSheet(data.id as string);
          } else {
            console.warn("No TimeSheet data received from the API.");
            setTimeSheetData(null); // Clear any previous data
          }
        }
      } catch (error) {
        console.error("Error fetching recent timecard:", error);
        setTimeSheetData(null); // Clear any previous data
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
