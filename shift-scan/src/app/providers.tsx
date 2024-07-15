"use client";
// this is the provider for the app, it wraps all the components
// this is so that all the components can access the context
import { ScanDataProvider } from "./context/JobSiteContext";
import { SavedCostCodeProvider } from "./context/CostCodeContext";
import { SessionProvider } from "next-auth/react";
import { SavedPayPeriodHoursProvider } from "./context/SavedPayPeriodHours";
import { SavedUserDataProvider } from "./context/UserContext";
import { SavedClockInTimeProvider } from "./context/ClockInTimeContext";
import { SavedBreakTimeProvider } from "./context/SavedBreakTimeContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      {" "}
      <SavedBreakTimeProvider>
        <SavedUserDataProvider>
          <SavedPayPeriodHoursProvider>
            <SavedCostCodeProvider>
              <ScanDataProvider>
                <SavedClockInTimeProvider>
                  <SessionProvider>{children}</SessionProvider>
                </SavedClockInTimeProvider>
              </ScanDataProvider>
            </SavedCostCodeProvider>
          </SavedPayPeriodHoursProvider>
        </SavedUserDataProvider>
      </SavedBreakTimeProvider>
    </>
  );
}
