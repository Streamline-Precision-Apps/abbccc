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
import { fetchWithOfflineCache } from "@/utils/offlineApi";
import { useServerAction } from "@/utils/serverActionWrapper";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";

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
  const online = useOnlineStatus();
  const { execute: executeServerAction, syncQueued } = useServerAction();

  useEffect(() => {
    const savedTimeSheet = async () => {
      try {
        if (
          url === "/clock" ||
          url === "/dashboard/equipment/log-new" ||
          url === "/dashboard/switch-jobs" ||
          url === "/break"
        ) {
          const data = await fetchWithOfflineCache("recentTimecard", () =>
            fetch("/api/getRecentTimecard").then((res) => res.json())
          );
          if (data && data.id) {
            setTimeSheetData(data);
            await executeServerAction(
              "setPrevTimeSheet",
              setPrevTimeSheet,
              data.id as string
            );
          } else {
            console.warn("No TimeSheet data received from the API.");
            setTimeSheetData(null);
          }
        }
      } catch (error) {
        console.error("Error fetching recent timecard:", error);
        setTimeSheetData(null);
      }
    };
    savedTimeSheet();
  }, [url, online, executeServerAction]);

  useEffect(() => {
    if (online) {
      syncQueued();
    }
  }, [online, syncQueued]);

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
