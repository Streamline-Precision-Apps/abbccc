"use client";
import { setPrevTimeSheet } from "@/actions/cookieActions";
import { usePathname } from "next/navigation";
import React, {
  createContext,
  useState,
  ReactNode,
  useContext,
  useEffect,
  useRef,
} from "react";
import { fetchWithOfflineCache } from "@/utils/offlineApi";
import { useServerAction } from "@/utils/serverActionWrapper";

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
    null,
  );
  const url = usePathname();
  const { execute: executeServerAction } = useServerAction();
  const initializationKey = useRef("");

  // Only execute once per URL - use URL as the key
  useEffect(() => {
    // Create a unique key based on URL
    const currentKey = `${url}`;
    
    // Skip if we've already processed this exact scenario
    if (initializationKey.current === currentKey) {
      return;
    }
    
    // Only run for specific routes
    const validRoutes = ["/clock", "/dashboard/equipment/log-new", "/dashboard/switch-jobs", "/break"];
    if (!validRoutes.includes(url)) {
      initializationKey.current = currentKey;
      return;
    }
    
    console.log("TimeSheetIdContext1");
    
    const savedTimeSheet = async () => {
      try {
        const data = await fetchWithOfflineCache("recentTimecard", () =>
          fetch("/api/getRecentTimecard").then((res) => res.json()),
        );
        if (data && data.id) {
          setTimeSheetData(data);
          // Execute server action separately to avoid dependency issues
          executeServerAction(
            "setPrevTimeSheet",
            setPrevTimeSheet,
            data.id as string,
          );
        } else {
          console.warn("No TimeSheet data received from the API.");
          setTimeSheetData(null);
        }
      } catch (error) {
        console.error("Error fetching recent timecard:", error);
        setTimeSheetData(null);
      } finally {
        // Mark this URL as processed
        initializationKey.current = currentKey;
      }
    };
    
    savedTimeSheet();
  }, [url]); // Only depend on URL changes

  // Removed redundant sync call - useOfflineSync hook handles auto-sync

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
      "useTimeSheetData must be used within a TimeSheetDataProvider",
    );
  }
  return context;
};
