"use client";
import { SavedCostCodeProvider } from "./context/CostCodeContext";
import { SessionProvider } from "next-auth/react";
import { PayPeriodHoursProvider } from "./context/PayPeriodHoursContext";
import { ScanDataEQProvider } from "./context/equipmentContext";
import { NotificationProvider } from "./context/NotificationContext";
import {
  JobSiteProvider,
  EquipmentProvider,
  CostCodeProvider,
} from "./context/dbCodeContext";
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
import { DashboardDataProvider } from "./(routes)/admins/_pages/sidebar/DashboardDataContext";
import { UserProfileProvider } from "./(routes)/admins/_pages/sidebar/UserImageContext";

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
                    <ScanDataEQProvider>
                      <SessionProvider>
                        <EquipmentProvider>
                          <EquipmentListProvider>
                            <JobSiteProvider>
                              <CostCodeProvider>
                                <PayPeriodTimeSheetProvider>
                                  <NotificationProvider>
                                    <CommentDataProvider>
                                      <EquipmentIdProvider>
                                        <DashboardDataProvider>
                                          <UserProfileProvider>
                                            {children}
                                          </UserProfileProvider>
                                        </DashboardDataProvider>
                                      </EquipmentIdProvider>
                                    </CommentDataProvider>
                                  </NotificationProvider>
                                </PayPeriodTimeSheetProvider>
                              </CostCodeProvider>
                            </JobSiteProvider>
                          </EquipmentListProvider>
                        </EquipmentProvider>
                      </SessionProvider>
                    </ScanDataEQProvider>
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
