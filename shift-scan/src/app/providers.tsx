"use client";
// this is the provider for the app, it wraps all the components
// this is so that all the components can access the context
import { ScanDataProvider } from "./context/JobSiteScanDataContext";
import { SavedCostCodeProvider } from "./context/CostCodeContext";
import { SessionProvider } from "next-auth/react";
import { PayPeriodHoursProvider } from "./context/PayPeriodHoursContext";
import { TimeSheetDataProvider } from "./context/TimeSheetIdContext";
import { ScanDataEQProvider } from "./context/equipmentContext";
import { NotificationProvider } from "./context/NotificationContext";
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
import { TimeSheetCommentsProvider } from "./context/TimeSheetCommentsContext";
import { CommentDataProvider } from "./context/CommentContext";
import { EquipmentIdProvider } from "./context/operatorContext";
import { PermissionsProvider } from "./context/PermissionsContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PermissionsProvider>
        <TimeSheetCommentsProvider>
          <StartingMileageProvider>
            <CurrentViewProvider>
              <TruckScanDataProvider>
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
                                            <NotificationProvider>
                                              <CommentDataProvider>
                                                <EquipmentIdProvider>
                                                  {children}
                                                </EquipmentIdProvider>
                                              </CommentDataProvider>
                                            </NotificationProvider>
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
              </TruckScanDataProvider>
            </CurrentViewProvider>
          </StartingMileageProvider>
        </TimeSheetCommentsProvider>
      </PermissionsProvider>
    </>
  );
}
