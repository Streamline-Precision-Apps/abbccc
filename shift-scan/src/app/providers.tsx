"use client";
// this is the provider for the app, it wraps all the components
// this is so that all the components can access the context
import { ScanDataProvider } from "./context/JobSiteContext";
import { SavedCostCodeProvider } from "./context/CostCodeContext";
import { SessionProvider } from "next-auth/react";
import { SavedPayPeriodHoursProvider } from "./context/SavedPayPeriodHours";
import { SavedUserDataProvider } from "./context/UserContext";import { SavedUserDataProvider } from './context/UserContext';


export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
            <SavedUserDataProvider>      <SavedUserDataProvider>
        <SavedPayPeriodHoursProvider>
          <SavedCostCodeProvider>
            <ScanDataProvider>
              <SessionProvider>{children}</SessionProvider>
            </ScanDataProvider>
          </SavedCostCodeProvider>
        </SavedPayPeriodHoursProvider>
            </SavedUserDataProvider>
      </SavedUserDataProvider>
    </>
  );
}
