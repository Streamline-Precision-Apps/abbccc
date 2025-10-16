"use client";
import { getCookie, setPrevTimeSheet } from "@/actions/cookieActions";
import {
  isSignInRedirect,
  safeServerAction,
  isAuthenticationError,
} from "@/utils/authErrorUtils";
import React, {
  createContext,
  useState,
  ReactNode,
  useContext,
  useEffect,
} from "react";

type TimeSheetData = {
  id: number;
};

type TimeSheetDataContextType = {
  savedTimeSheetData: TimeSheetData | null;
  setTimeSheetData: (timesheetData: TimeSheetData | null) => void;
  refetchTimesheet: () => Promise<void>;
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

  // Load from localStorage on mount
  useEffect(() => {
    const loadTimesheetData = async () => {
      const stored = localStorage.getItem("timesheetId");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed && typeof parsed.id === "number") {
            setTimeSheetData(parsed);
          }
        } catch {}
      } else if (!stored) {
        try {
          const timesheetId = await getCookie("timeSheetId");
          if (timesheetId) {
            setTimeSheetData({ id: parseInt(timesheetId, 10) });
          }
        } catch {}
      } else {
        refetchTimesheet();
      }
    };

    loadTimesheetData();
  }, []);

  // Save to localStorage whenever timesheet changes
  useEffect(() => {
    if (savedTimeSheetData) {
      localStorage.setItem("timesheetId", JSON.stringify(savedTimeSheetData));
      safeServerAction(setPrevTimeSheet, [savedTimeSheetData.id.toString()]);
    } else {
      localStorage.removeItem("timesheetId");
      safeServerAction(setPrevTimeSheet, [""]);
    }
  }, [savedTimeSheetData]);

  // Manual trigger to refetch timesheet data
  const refetchTimesheet = async () => {
    try {
      const prevTimeSheet = await fetch("/api/getRecentTimecard");
      if (!prevTimeSheet.ok) {
        throw new Error(
          `Failed to fetch recent timecard: ${prevTimeSheet.statusText}`,
        );
      }

      // Check if response is HTML (redirect to signin)
      if (isSignInRedirect(prevTimeSheet)) {
        // User is being redirected to sign-in, silently return
        return;
      }

      const data = await prevTimeSheet.json();
      if (data && data.id) {
        setTimeSheetData(data);
        await safeServerAction(setPrevTimeSheet, [data.id as string]);
      } else {
        setTimeSheetData(null);
        await safeServerAction(setPrevTimeSheet, [""]);
      }
    } catch (error) {
      // Silently handle authentication/redirect errors during sign-out
      if (isAuthenticationError(error)) {
        // User is likely being redirected to sign-in
        setTimeSheetData(null);
        return;
      }
      console.error("Error fetching recent timecard:", error);
      setTimeSheetData(null);
    }
  };

  return (
    <TimeSheetDataContext.Provider
      value={{ savedTimeSheetData, setTimeSheetData, refetchTimesheet }}
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
