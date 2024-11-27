"use client";
// this is the provider for the app, it wraps all the components
// this is so that all the components can access the context
import { ScanDataProvider } from "./context/JobSiteScanDataContext";
import { SavedCostCodeProvider } from "./context/CostCodeContext";
import { SessionProvider } from "next-auth/react";
import { PayPeriodHoursProvider } from "./context/PayPeriodHoursContext";
import { SavedBreakTimeProvider } from "./context/BreakTimeContext";
import { TimeSheetDataProvider } from "./context/TimeSheetIdContext";
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
import { PayPeriodTimeSheetProvider } from "./context/PayPeriodTimeSheetsContext";
import React from "react";
import { EquipmentListProvider } from "./context/dbCompleteEquipmentList";
import { TruckScanDataProvider } from "./context/TruckScanDataContext";
import { CurrentViewProvider } from "./context/CurrentViewContext";
import { StartingMileageProvider } from "./context/StartingMileageContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      {" "}
      <StartingMileageProvider>
        <CurrentViewProvider>
          <TruckScanDataProvider>
            <SavedBreakTimeProvider>
              <PayPeriodHoursProvider>
                <SavedCostCodeProvider>
                  <ScanDataProvider>
                    <ScanDataEQProvider>
                      <TimeSheetDataProvider>
                        <SessionProvider>
                          <EquipmentProvider>
                            <EquipmentListProvider>
                              <JobSiteProvider>
                                <CostCodeProvider>
                                  <RecentCostCodeProvider>
                                    <RecentJobSiteProvider>
                                      <PayPeriodTimeSheetProvider>
                                        <RecentEquipmentProvider>
                                          {children}
                                        </RecentEquipmentProvider>
                                      </PayPeriodTimeSheetProvider>
                                    </RecentJobSiteProvider>
                                  </RecentCostCodeProvider>
                                </CostCodeProvider>
                              </JobSiteProvider>
                            </EquipmentListProvider>
                          </EquipmentProvider>
                        </SessionProvider>
                      </TimeSheetDataProvider>
                    </ScanDataEQProvider>
                  </ScanDataProvider>
                </SavedCostCodeProvider>
              </PayPeriodHoursProvider>
            </SavedBreakTimeProvider>
          </TruckScanDataProvider>
        </CurrentViewProvider>
      </StartingMileageProvider>
    </>
  );
}
