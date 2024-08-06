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
import { SavedTimeSheetDataProvider } from "./context/TimeSheetIdContext";
import { SavedInjuryReportDataProvider } from "./context/InjuryReportDataContext";
import { ScanDataEQProvider } from "./context/equipmentContext";
import {
  JobSiteProvider,
  EquipmentProvider,
  CostCodeProvider,
} from "./context/dbCodeContext";
import {
  RecentCostCodeProvider,
  RecentJobSiteProvider,
  RecentEquipmentProvider,
} from "./context/dbRecentCodesContext";
import { SavedDailyHoursProvider } from "./context/SavedDailyHours";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      {" "}
      <SavedDailyHoursProvider>
        <SavedBreakTimeProvider>
          <SavedUserDataProvider>
            <SavedPayPeriodHoursProvider>
              <SavedCostCodeProvider>
                <ScanDataProvider>
                  <ScanDataEQProvider>
                    <SavedClockInTimeProvider>
                      <SavedTimeSheetDataProvider>
                        <SavedInjuryReportDataProvider>
                          <SessionProvider>
                            {/* The provider Entitled DB provide the DB data for each entry */}
                            <EquipmentProvider>
                              <JobSiteProvider>
                                <CostCodeProvider>
                                  <RecentCostCodeProvider>
                                    <RecentJobSiteProvider>
                                      <RecentEquipmentProvider>
                                        {children}
                                      </RecentEquipmentProvider>
                                    </RecentJobSiteProvider>
                                  </RecentCostCodeProvider>
                                </CostCodeProvider>
                              </JobSiteProvider>
                            </EquipmentProvider>
                          </SessionProvider>
                        </SavedInjuryReportDataProvider>
                      </SavedTimeSheetDataProvider>
                    </SavedClockInTimeProvider>
                  </ScanDataEQProvider>
                </ScanDataProvider>
              </SavedCostCodeProvider>
            </SavedPayPeriodHoursProvider>
          </SavedUserDataProvider>
        </SavedBreakTimeProvider>
      </SavedDailyHoursProvider>
    </>
  );
}
