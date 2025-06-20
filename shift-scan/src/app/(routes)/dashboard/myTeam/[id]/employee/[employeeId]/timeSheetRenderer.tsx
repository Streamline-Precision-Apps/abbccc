"use client";
import { Holds } from "@/components/(reusable)/holds";
import { Texts } from "@/components/(reusable)/texts";
import { TimesheetFilter, JobsiteData, EquipmentData } from "@/lib/types";
import TimeCardEquipmentLogs from "./TimeCardEquipmentLogs";
import TimeCardEquipmentRefuelLogs from "./TimeCardEquipmentRefuelLogs";
import TimeCardHighlights from "./TimeCardHighlights";
import TimeCardMechanicLogs, {
  MaintenanceLogData,
} from "./TimeCardMechanicLogs";
import TimeCardTascoHaulLogs from "./TimeCardTascoHaulLogs";
import TimeCardTascoRefuelLogs from "./TimeCardTascoRefuelLogs";
import TimeCardTruckingHaulLogs from "./TimeCardTruckingHaulLogs";
import TimeCardTruckingMaterialLogs from "./TimeCardTruckingMaterialLogs";
import TimeCardTruckingMileage from "./TimeCardTruckingMileage";
import TimeCardTruckingRefuelLogs from "./TimeCardTruckingRefuelLogs";
import TimeCardTruckingStateMileageLogs from "./TimeCardTruckingStateMileage";
import { useEffect } from "react";
import {
  TimesheetHighlights,
  TruckingMileageData,
  TruckingEquipmentHaulLogData,
  TruckingMaterialHaulLogData,
  TruckingRefuelLogData,
  TruckingStateLogData,
  TascoHaulLogData,
  TascoRefuelLogData,
  EquipmentLogsData,
  EmployeeEquipmentLogWithRefuel,
} from "@/lib/types";
import { useTranslations } from "next-intl";

type ProcessedMaterialLog = {
  id: string;
  name: string;
  LocationOfMaterial: string;
  materialWeight: number | null;
  lightWeight: number | null;
  grossWeight: number | null;
  logId: string;
};

type ExtendedTruckingRefuel = import("@/lib/types").TruckingRefuel & {
  truckName: string;
  truckingLogId: string;
};

type ProcessedTascoHaulLog = {
  id: string;
  shiftType: string;
  equipmentId: string | null;
  materialType: string;
  LoadQuantity: number | null;
};

type FlattenedTascoRefuelLog = {
  id: string;
  gallonsRefueled: number | null;
  truckName: string;
  tascoLogId: string;
};

type ProcessedStateMileage = {
  id: string;
  state: string;
  stateLineMileage: number;
  truckName: string;
  equipmentId: string;
  truckingLogId: string;
};

type EquipmentRefuelLog = {
  id: string;
  equipmentId: string;
  equipmentName: string;
  gallonsRefueled: number | null;
  employeeEquipmentLogId: string;
};

type EquipmentLogUpdate = {
  id: string;
  startTime?: Date;
  endTime?: Date;
};

interface TimeSheetRendererProps {
  filter: TimesheetFilter;
  data:
    | TimesheetHighlights[]
    | TruckingMileageData
    | TruckingEquipmentHaulLogData
    | TruckingMaterialHaulLogData
    | TruckingRefuelLogData
    | TruckingStateLogData
    | TascoHaulLogData
    | TascoRefuelLogData
    | EquipmentLogsData
    | EmployeeEquipmentLogWithRefuel[]
    | MaintenanceLogData
    | null;
  setData?: (
    data:
      | TimesheetHighlights[]
      | TruckingMileageData
      | TruckingEquipmentHaulLogData
      | TruckingMaterialHaulLogData
      | TruckingRefuelLogData
      | TruckingStateLogData
      | TascoHaulLogData
      | TascoRefuelLogData
      | EquipmentLogsData
      | EmployeeEquipmentLogWithRefuel[]
  ) => void;
  edit: boolean;
  manager: string;
  onDataChange:
    | ((data: TimesheetHighlights[]) => void)
    | ((data: import("@/lib/types").TruckingMileageUpdate[]) => void)
    | ((data: import("@/lib/types").TruckingEquipmentHaulLogData) => void)
    | ((data: TruckingMaterialHaulLogData) => void)
    | ((data: TruckingRefuelLogData) => void)
    | ((data: TruckingStateLogData) => void)
    | ((data: ProcessedTascoHaulLog[]) => void)
    | ((data: FlattenedTascoRefuelLog[]) => void)
    | ((data: EquipmentLogUpdate[]) => void)
    | ((data: EquipmentRefuelLog[]) => void);
  date: string;
  focusIds: string[];
  setFocusIds: (ids: string[]) => void;
  handleSelectEntity: (id: string) => void;
  isReviewYourTeam?: boolean; // NEW: optional, defaults to false
  allEquipment: { id: string; qrId: string; name: string }[];
}

const getTypedOnDataChange = <T,>(
  handler: unknown
): ((data: T) => void) | undefined => {
  return typeof handler === "function"
    ? (handler as (data: T) => void)
    : undefined;
};

const renderValueOrNA = (value: any) => {
  if (value === null || value === undefined || value === "") {
    return "N/A";
  }
  return value;
};

export default function TimeSheetRenderer({
  filter,
  data,
  setData,
  edit,
  manager,
  onDataChange,
  date,
  focusIds,
  setFocusIds,
  handleSelectEntity,
  isReviewYourTeam = false,
  allEquipment,
}: TimeSheetRendererProps) {
  const t = useTranslations("MyTeam");
  const isEmptyData = !data || (Array.isArray(data) && data.length === 0);

  // Add comprehensive debug logging
  console.log("TimeSheetRenderer received:", {
    filter,
    isReviewYourTeam,
    isEmptyData,
    dataType: data ? (Array.isArray(data) ? "array" : "object") : "null",
    dataLength: Array.isArray(data)
      ? data.length
      : data
      ? Object.keys(data).length
      : 0,
    data,
  });

  // Debug incoming data when needed
  // useEffect(() => {
  //  console.log('TimeSheetRenderer received data:', {
  //    filter,
  //    isReviewYourTeam,
  //    dataType: data ? Array.isArray(data) ? 'array' : 'object' : 'null',
  //    dataLength: Array.isArray(data) ? data.length : data ? Object.keys(data).length : 0,
  //    data,
  //  });
  // }, [filter, data, isReviewYourTeam]);

  const renderContent = () => {
    if (isEmptyData) {
      return (
        <Holds className="w-full h-full flex items-center justify-center">
          <Texts size="p6" className="text-gray-500 italic">
            {`${t("NoDataFoundForCurrentDate")} `}
          </Texts>
        </Holds>
      );
    }
    switch (filter) {
      case "truckingMileage": {
        // Debug data in truckingMileage case
        console.log("truckingMileage case debug:", {
          isReviewYourTeam,
          isArray: Array.isArray(data),
          dataLength: Array.isArray(data) ? data.length : "not an array",
          data,
        });

        // Handle review mode data conversion
        if (isReviewYourTeam && Array.isArray(data)) {
          // Type guard for direct API format with TruckingLogs
          const hasDirectTruckingLogs = (
            item: any
          ): item is { TruckingLogs: any[] } => {
            return (
              item &&
              typeof item === "object" &&
              "TruckingLogs" in item &&
              Array.isArray(item.TruckingLogs)
            );
          };

          let formattedData: TruckingMileageData;

          // Check if data is already in [{TruckingLogs:[...]}] format from API
          if (data.length > 0 && hasDirectTruckingLogs(data[0])) {
            console.log("Found direct TruckingLogs format - using as-is");
            // TruckingLogs contains all the mileage info directly
            formattedData = data as TruckingMileageData;
          } else {
            // Original logic for EditTeamTimeSheet format
            interface ReviewTruckingLog {
              id: string;
              timeSheetId: string | null;
              equipmentId: string | null;
              startingMileage: number;
              endingMileage: number | null;
              Equipment: {
                id: string;
                name: string;
              };
            }

            interface ReviewTimesheet {
              id: string;
              TruckingLogs?: ReviewTruckingLog[];
            }

            // Type guard to check if object has TruckingLogs
            const hasTruckingLogs = (
              item: any
            ): item is ReviewTimesheet & {
              TruckingLogs: ReviewTruckingLog[];
            } => {
              return (
                item &&
                typeof item === "object" &&
                "id" in item &&
                "TruckingLogs" in item &&
                Array.isArray(item.TruckingLogs) &&
                item.TruckingLogs.length > 0
              );
            };

            // Convert data with proper type checking
            const validTimesheets = (data as any[]).filter(hasTruckingLogs);
            console.log("Valid timesheets after filter:", validTimesheets);

            formattedData = validTimesheets.map((ts) => ({
              TruckingLogs: ts.TruckingLogs.map((tl: any) => ({
                id: tl.id,
                timeSheetId: tl.timeSheetId || ts.id, // Use timesheet id if log id is not available
                equipmentId: tl.equipmentId || tl.Equipment?.id || null,
                startingMileage: tl.startingMileage,
                endingMileage: tl.endingMileage,
                Equipment: tl.Equipment,
              })),
            }));
          }

          console.log("Converted trucking mileage data:", formattedData);

          return (
            <TimeCardTruckingMileage
              truckingMileage={formattedData}
              edit={edit}
              manager={manager}
              onDataChange={
                getTypedOnDataChange<TruckingMileageData>(onDataChange)!
              }
              focusIds={focusIds}
              setFocusIds={setFocusIds}
              isReviewYourTeam={isReviewYourTeam}
            />
          );
        }

        // Regular format from EditTeamTimeSheet
        return (
          <TimeCardTruckingMileage
            truckingMileage={data as TruckingMileageData}
            edit={edit}
            manager={manager}
            onDataChange={
              getTypedOnDataChange<TruckingMileageData>(onDataChange)!
            }
            focusIds={focusIds}
            setFocusIds={setFocusIds}
            isReviewYourTeam={isReviewYourTeam}
          />
        );
      }
      case "truckingEquipmentHaulLogs": {
        // Debug data
        console.log("truckingEquipmentHaulLogs case debug:", {
          isReviewYourTeam,
          isArray: Array.isArray(data),
          dataLength: Array.isArray(data) ? data.length : "not an array",
          data,
        });

        // Handle review mode data conversion
        if (isReviewYourTeam && Array.isArray(data)) {
          // Type guard for direct API format with TruckingLogs
          const hasDirectTruckingLogs = (
            item: any
          ): item is { TruckingLogs: any[] } => {
            return (
              item &&
              typeof item === "object" &&
              "TruckingLogs" in item &&
              Array.isArray(item.TruckingLogs)
            );
          };

          if (data.length > 0 && hasDirectTruckingLogs(data[0])) {
            console.log(
              "Found direct TruckingLogs format for hauls - using as-is"
            );
            // Data is already in the expected format
            return (
              <TimeCardTruckingHaulLogs
                edit={edit}
                manager={manager}
                truckingEquipmentHaulLogs={data as TruckingEquipmentHaulLogData}
                onDataChange={
                  onDataChange as (data: TruckingEquipmentHaulLogData) => void
                }
                focusIds={focusIds}
                setFocusIds={setFocusIds}
                isReviewYourTeam={isReviewYourTeam}
                allEquipment={allEquipment}
              />
            );
          }
        }

        // Regular format from EditTeamTimeSheet
        return (
          <TimeCardTruckingHaulLogs
            edit={edit}
            manager={manager}
            truckingEquipmentHaulLogs={data as TruckingEquipmentHaulLogData}
            onDataChange={
              onDataChange as (data: TruckingEquipmentHaulLogData) => void
            }
            focusIds={focusIds}
            setFocusIds={setFocusIds}
            isReviewYourTeam={isReviewYourTeam}
            allEquipment={allEquipment}
          />
        );
      }
      case "truckingMaterialHaulLogs": {
        // Debug data
        console.log("truckingMaterialHaulLogs case debug:", {
          isReviewYourTeam,
          isArray: Array.isArray(data),
          dataLength: Array.isArray(data) ? data.length : "not an array",
        });

        // Handle review mode data conversion
        if (isReviewYourTeam && Array.isArray(data)) {
          // Type guard for direct API format with TruckingLogs
          const hasDirectTruckingLogs = (
            item: any
          ): item is { TruckingLogs: any[] } => {
            return (
              item &&
              typeof item === "object" &&
              "TruckingLogs" in item &&
              Array.isArray(item.TruckingLogs)
            );
          };

          if (data.length > 0 && hasDirectTruckingLogs(data[0])) {
            console.log(
              "Found direct TruckingLogs format for material hauls - using as-is"
            );
            // Data is already in the expected format
            return (
              <TimeCardTruckingMaterialLogs
                truckingMaterialHaulLogs={data as TruckingMaterialHaulLogData}
                edit={edit}
                manager={manager}
                onDataChange={
                  getTypedOnDataChange<TruckingMaterialHaulLogData>(
                    onDataChange
                  )!
                }
                focusIds={focusIds}
                setFocusIds={setFocusIds}
                isReviewYourTeam={isReviewYourTeam}
              />
            );
          }
        }

        // Regular format from EditTeamTimeSheet
        return (
          <TimeCardTruckingMaterialLogs
            truckingMaterialHaulLogs={data as TruckingMaterialHaulLogData}
            edit={edit}
            manager={manager}
            onDataChange={
              getTypedOnDataChange<TruckingMaterialHaulLogData>(onDataChange)!
            }
            focusIds={focusIds}
            setFocusIds={setFocusIds}
            isReviewYourTeam={isReviewYourTeam}
          />
        );
      }
      case "truckingRefuelLogs": {
        // Debug data
        console.log("truckingRefuelLogs case debug:", {
          isReviewYourTeam,
          isArray: Array.isArray(data),
          dataLength: Array.isArray(data) ? data.length : "not an array",
        });

        // Handle review mode data conversion
        if (isReviewYourTeam && Array.isArray(data)) {
          // Type guard for direct API format with TruckingLogs
          const hasDirectTruckingLogs = (
            item: any
          ): item is { TruckingLogs: any[] } => {
            return (
              item &&
              typeof item === "object" &&
              "TruckingLogs" in item &&
              Array.isArray(item.TruckingLogs)
            );
          };

          if (data.length > 0 && hasDirectTruckingLogs(data[0])) {
            console.log(
              "Found direct TruckingLogs format for refuel - using as-is"
            );
            // Data is already in the expected format
            return (
              <TimeCardTruckingRefuelLogs
                truckingRefuelLogs={data as TruckingRefuelLogData}
                edit={edit}
                manager={manager}
                onDataChange={
                  getTypedOnDataChange<TruckingRefuelLogData>(onDataChange)!
                }
                focusIds={focusIds}
                setFocusIds={setFocusIds}
                isReviewYourTeam={isReviewYourTeam}
              />
            );
          }
        }

        // Regular format from EditTeamTimeSheet
        return (
          <TimeCardTruckingRefuelLogs
            truckingRefuelLogs={data as TruckingRefuelLogData}
            edit={edit}
            manager={manager}
            onDataChange={
              getTypedOnDataChange<TruckingRefuelLogData>(onDataChange)!
            }
            focusIds={focusIds}
            setFocusIds={setFocusIds}
            isReviewYourTeam={isReviewYourTeam}
          />
        );
      }
      case "truckingStateLogs": {
        // Debug data
        console.log("truckingStateLogs case debug:", {
          isReviewYourTeam,
          isArray: Array.isArray(data),
          dataLength: Array.isArray(data) ? data.length : "not an array",
        });

        // Handle review mode data conversion
        if (isReviewYourTeam && Array.isArray(data)) {
          // Type guard for direct API format with TruckingLogs
          const hasDirectTruckingLogs = (
            item: any
          ): item is { TruckingLogs: any[] } => {
            return (
              item &&
              typeof item === "object" &&
              "TruckingLogs" in item &&
              Array.isArray(item.TruckingLogs)
            );
          };

          if (data.length > 0 && hasDirectTruckingLogs(data[0])) {
            console.log(
              "Found direct TruckingLogs format for state logs - using as-is"
            );
            // Data is already in the expected format
            return (
              <TimeCardTruckingStateMileageLogs
                truckingStateLogs={data as TruckingStateLogData}
                edit={edit}
                manager={manager}
                onDataChange={
                  getTypedOnDataChange<TruckingStateLogData>(onDataChange)!
                }
                focusIds={focusIds}
                setFocusIds={setFocusIds}
                isReviewYourTeam={isReviewYourTeam}
              />
            );
          }
        }

        // Regular format from EditTeamTimeSheet
        return (
          <TimeCardTruckingStateMileageLogs
            truckingStateLogs={data as TruckingStateLogData}
            edit={edit}
            manager={manager}
            onDataChange={
              getTypedOnDataChange<TruckingStateLogData>(onDataChange)!
            }
            focusIds={focusIds}
            setFocusIds={setFocusIds}
            isReviewYourTeam={isReviewYourTeam}
          />
        );
      }
      case "tascoHaulLogs": {
        // Debug TASCO haul logs data flow
        console.log("tascoHaulLogs case debug:", {
          isReviewYourTeam,
          isArray: Array.isArray(data),
          dataLength: Array.isArray(data) ? data.length : "not an array",
          data,
        });

        // Handle review mode data conversion
        if (isReviewYourTeam && Array.isArray(data)) {
          // NEW FIX: Handle direct API format from useTimesheetData with pendingOnly=true
          // This format is [{TascoLogs:[...]}] instead of [{id:string, TascoLogs:[...]}]

          // Type guard for ReviewYourTeam format (directly from API)
          const hasDirectTascoLogs = (
            item: any
          ): item is { TascoLogs: any[] } => {
            return (
              item &&
              typeof item === "object" &&
              "TascoLogs" in item &&
              Array.isArray(item.TascoLogs)
            );
          };

          let formattedData: TascoHaulLogData;

          // NEW LOGIC: Check if data is already in the [{TascoLogs:[...]}] format
          if (data.length > 0 && hasDirectTascoLogs(data[0])) {
            console.log("Found direct TascoLogs format - using as-is");
            // Already in correct format, use as is
            formattedData = data as TascoHaulLogData;
          } else {
            // Original logic for EditTeamTimesheet format
            interface ReviewTascoLog {
              id: string;
              timeSheetId: string;
              shiftType: string;
              equipmentId: string;
              laborType: string;
              materialType: string;
              LoadQuantity: number;
              Equipment?: {
                id: string;
                name: string;
              };
            }

            interface ReviewTimesheet {
              id: string;
              TascoLogs?: ReviewTascoLog[];
            }

            // Type guard for EditTeamTimeSheet format
            const hasTascoLogs = (
              item: any
            ): item is ReviewTimesheet & { TascoLogs: ReviewTascoLog[] } => {
              return (
                item &&
                typeof item === "object" &&
                "id" in item &&
                "TascoLogs" in item &&
                Array.isArray(item.TascoLogs) &&
                item.TascoLogs.length > 0
              );
            };

            // Convert data with proper type checking
            const validTimesheets = (data as any[]).filter(hasTascoLogs);
            console.log("Valid timesheets after filter:", validTimesheets);

            formattedData = [
              {
                TascoLogs: validTimesheets.flatMap((ts) =>
                  ts.TascoLogs.map((tl) => ({
                    id: tl.id,
                    timeSheetId: tl.timeSheetId,
                    shiftType: tl.shiftType || "ABCD Shift",
                    equipmentId: tl.equipmentId,
                    laborType: tl.laborType || "",
                    materialType: tl.materialType || "",
                    LoadQuantity: tl.LoadQuantity || 0,
                    Equipment: tl.Equipment || null,
                  }))
                ),
              },
            ];
          }

          console.log("Final TASCO haul logs data:", formattedData);

          return (
            <TimeCardTascoHaulLogs
              tascoHaulLogs={formattedData}
              edit={edit}
              manager={manager}
              onDataChange={
                getTypedOnDataChange<TascoHaulLogData>(onDataChange)!
              }
              focusIds={focusIds}
              setFocusIds={setFocusIds}
              isReviewYourTeam={isReviewYourTeam}
            />
          );
        }

        // Regular format from EditTeamTimeSheet
        return (
          <TimeCardTascoHaulLogs
            tascoHaulLogs={data as TascoHaulLogData}
            edit={edit}
            manager={manager}
            onDataChange={getTypedOnDataChange<TascoHaulLogData>(onDataChange)!}
            focusIds={focusIds}
            setFocusIds={setFocusIds}
            isReviewYourTeam={isReviewYourTeam}
          />
        );
      }
      case "tascoRefuelLogs": {
        // Debug data in tascoRefuelLogs case
        console.log("tascoRefuelLogs case debug:", {
          isReviewYourTeam,
          isArray: Array.isArray(data),
          dataLength: Array.isArray(data) ? data.length : "not an array",
          data,
        });

        // Handle review mode data conversion
        if (isReviewYourTeam && Array.isArray(data)) {
          // NEW FIX: Handle direct API format from useTimesheetData with pendingOnly=true
          // This format is [{TascoLogs:[...]}] instead of [{id:string, TascoLogs:[...]}]

          // Type guard for ReviewYourTeam format (directly from API)
          const hasDirectTascoLogs = (
            item: any
          ): item is { TascoLogs: any[] } => {
            return (
              item &&
              typeof item === "object" &&
              "TascoLogs" in item &&
              Array.isArray(item.TascoLogs)
            );
          };

          let formattedData: TascoRefuelLogData;
          // Check if data is already in [{TascoLogs:[...]}] format
          if (data.length > 0 && hasDirectTascoLogs(data[0])) {
            console.log(
              "Found direct TascoLogs format for refuel - using as-is"
            );
            // Original API data can be used directly after filtering for refuel logs
            formattedData = [
              {
                TascoLogs: (data[0].TascoLogs || [])
                  .filter(
                    (log: any) => log.RefuelLogs && log.RefuelLogs.length > 0
                  )
                  .map((tl: any) => ({
                    id: tl.id,
                    Equipment: tl.Equipment,
                    RefuelLogs: (tl.RefuelLogs || []).map((refuel: any) => ({
                      id: refuel.id,
                      tascoLogId: refuel.tascoLogId || tl.id,
                      gallonsRefueled: refuel.gallonsRefueled || 0,
                    })),
                  })),
              },
            ];
          } else {
            // Original logic for EditTeamTimesheet format
            interface ReviewRefuelLog {
              id: string;
              gallonsRefueled: number;
              tascoLogId: string;
            }

            interface ReviewTascoLog {
              id: string;
              Equipment: {
                id: string;
                name: string;
              } | null;
              RefuelLogs: ReviewRefuelLog[];
            }

            interface ReviewTimesheet {
              id: string;
              TascoLogs?: ReviewTascoLog[];
            }

            // Type guard to check if object has TascoLogs with RefuelLogs
            const hasTascoRefuelLogs = (
              item: any
            ): item is ReviewTimesheet & { TascoLogs: ReviewTascoLog[] } => {
              return (
                item &&
                typeof item === "object" &&
                "id" in item &&
                "TascoLogs" in item &&
                Array.isArray(item.TascoLogs) &&
                item.TascoLogs.length > 0 &&
                item.TascoLogs.some(
                  (log: ReviewTascoLog) =>
                    log.RefuelLogs &&
                    Array.isArray(log.RefuelLogs) &&
                    log.RefuelLogs.length > 0
                )
              );
            };

            // Convert data with proper type checking
            const validTimesheets = (data as any[]).filter(hasTascoRefuelLogs);
            formattedData = [
              {
                TascoLogs: validTimesheets.flatMap((ts) =>
                  ts.TascoLogs.filter(
                    (tl) => tl.RefuelLogs && tl.RefuelLogs.length > 0
                  ).map((tl) => ({
                    id: tl.id,
                    Equipment: tl.Equipment,
                    RefuelLogs: tl.RefuelLogs.map((refuel) => ({
                      id: refuel.id,
                      tascoLogId: refuel.tascoLogId || tl.id,
                      gallonsRefueled: refuel.gallonsRefueled || 0,
                    })),
                  }))
                ),
              },
            ];
          }

          console.log("Final TASCO refuel logs data:", formattedData);

          return (
            <TimeCardTascoRefuelLogs
              tascoRefuelLog={formattedData}
              edit={edit}
              manager={manager}
              onDataChange={
                getTypedOnDataChange<TascoRefuelLogData>(onDataChange)!
              }
              focusIds={focusIds}
              setFocusIds={setFocusIds}
              isReviewYourTeam={isReviewYourTeam}
            />
          );
        }

        // Regular format from EditTeamTimeSheet
        return (
          <TimeCardTascoRefuelLogs
            tascoRefuelLog={data as TascoRefuelLogData}
            edit={edit}
            manager={manager}
            onDataChange={
              getTypedOnDataChange<TascoRefuelLogData>(onDataChange)!
            }
            focusIds={focusIds}
            setFocusIds={setFocusIds}
            isReviewYourTeam={isReviewYourTeam}
          />
        );
      }
      case "equipmentLogs": {
        // Debug data in equipmentLogs case
        console.log("equipmentLogs case debug:", {
          isReviewYourTeam,
          isArray: Array.isArray(data),
          dataLength: Array.isArray(data) ? data.length : "not an array",
          data,
        });

        // Handle review mode data conversion
        if (isReviewYourTeam && Array.isArray(data)) {
          // Type guard for direct API format with EmployeeEquipmentLogs
          const hasDirectEmployeeEquipmentLogs = (
            item: any
          ): item is { EmployeeEquipmentLogs: any[] } => {
            return (
              item &&
              typeof item === "object" &&
              "EmployeeEquipmentLogs" in item &&
              Array.isArray(item.EmployeeEquipmentLogs)
            );
          };

          let formattedData: EquipmentLogsData;

          // Check if data is already in [{EmployeeEquipmentLogs:[...]}] format from API
          if (data.length > 0 && hasDirectEmployeeEquipmentLogs(data[0])) {
            console.log(
              "Found direct EmployeeEquipmentLogs format - using as-is"
            );
            formattedData = data as EquipmentLogsData;
          } else {
            // Original logic for EditTeamTimesheet format
            interface ReviewEquipmentLog {
              id: string;
              Equipment: EquipmentData;
              startTime: string;
              endTime: string;
              Jobsite: JobsiteData;
              employeeId: string; // Required field for EmployeeEquipmentLogData
            }

            interface ReviewTimesheet {
              id: string;
              EmployeeEquipmentLogs?: ReviewEquipmentLog[];
            }

            // Build formatted data from timesheet objects
            formattedData = [
              {
                EmployeeEquipmentLogs: (data as ReviewTimesheet[])
                  .filter(
                    (
                      ts
                    ): ts is ReviewTimesheet & {
                      EmployeeEquipmentLogs: ReviewEquipmentLog[];
                    } =>
                      ts.EmployeeEquipmentLogs != null &&
                      ts.EmployeeEquipmentLogs.length > 0
                  )
                  .flatMap((ts) => ts.EmployeeEquipmentLogs)
                  .map((log) => ({
                    id: log.id,
                    Equipment: log.Equipment,
                    startTime: log.startTime,
                    endTime: log.endTime,
                    Jobsite: log.Jobsite,
                    employeeId: log.employeeId,
                  })),
              },
            ];
          }

          console.log("Final equipment logs data:", formattedData);

          return (
            <TimeCardEquipmentLogs
              equipmentLogs={formattedData}
              edit={edit}
              manager={manager}
              onDataChange={
                getTypedOnDataChange<EquipmentLogUpdate[]>(onDataChange)!
              }
              focusIds={focusIds}
              setFocusIds={setFocusIds}
              isReviewYourTeam={isReviewYourTeam}
            />
          );
        }

        // Regular format from EditTeamTimeSheet
        return (
          <TimeCardEquipmentLogs
            equipmentLogs={data as EquipmentLogsData}
            edit={edit}
            manager={manager}
            onDataChange={
              getTypedOnDataChange<EquipmentLogUpdate[]>(onDataChange)!
            }
            focusIds={focusIds}
            setFocusIds={setFocusIds}
            isReviewYourTeam={isReviewYourTeam}
          />
        );
      }
      case "equipmentRefuelLogs": {
        // Type guard to check if an array is EquipmentRefuelLog[]
        const isEquipmentRefuelLogArray = (
          arr: unknown[]
        ): arr is EquipmentRefuelLog[] => {
          return (
            arr.length > 0 &&
            arr[0] !== null &&
            typeof arr[0] === "object" &&
            "equipmentId" in arr[0] &&
            "equipmentName" in arr[0] &&
            "gallonsRefueled" in arr[0] &&
            "employeeEquipmentLogId" in arr[0]
          );
        };
        let logs: EquipmentRefuelLog[] = [];
        if (Array.isArray(data)) {
          if (isEquipmentRefuelLogArray(data)) {
            logs = data;
          } else {
            logs = (data as any[]).flatMap((log) => {
              // Defensive: extract equipmentId and equipmentName from nested Equipment object if present
              const equipmentId = log.Equipment?.id || log.equipmentId || "";
              const equipmentName =
                log.Equipment?.name || log.equipmentName || "";
              if (log && Array.isArray(log.RefuelLogs)) {
                return log.RefuelLogs.map((refuel: any) => ({
                  id: refuel.id,
                  equipmentId,
                  equipmentName,
                  gallonsRefueled: refuel.gallonsRefueled ?? null,
                  employeeEquipmentLogId: log.id,
                }));
              } else if (
                log &&
                log.RefuelLogs &&
                typeof log.RefuelLogs === "object"
              ) {
                const refuel = log.RefuelLogs;
                return [
                  {
                    id: refuel.id,
                    equipmentId,
                    equipmentName,
                    gallonsRefueled: refuel.gallonsRefueled ?? null,
                    employeeEquipmentLogId: log.id,
                  },
                ];
              } else {
                return [
                  {
                    id: "",
                    equipmentId,
                    equipmentName,
                    gallonsRefueled: null,
                    employeeEquipmentLogId: log.id,
                  },
                ];
              }
            });
          }
        } else if (data && typeof data === "object") {
          const log = data as any;
          if (log && Array.isArray(log.RefuelLogs)) {
            logs = log.RefuelLogs.map((refuel: any) => ({
              id: refuel.id,
              equipmentId: refuel.equipmentId || log.equipmentId || "",
              equipmentName: refuel.equipmentName || log.equipmentName || "",
              gallonsRefueled: refuel.gallonsRefueled ?? null,
              employeeEquipmentLogId: log.id,
            }));
          } else if (
            log &&
            log.RefuelLogs &&
            typeof log.RefuelLogs === "object"
          ) {
            const refuel = log.RefuelLogs;
            logs = [
              {
                id: refuel.id,
                equipmentId: refuel.equipmentId || log.equipmentId || "",
                equipmentName: refuel.equipmentName || log.equipmentName || "",
                gallonsRefueled: refuel.gallonsRefueled ?? null,
                employeeEquipmentLogId: log.id,
              },
            ];
          } else {
            logs = [
              {
                id: "",
                equipmentId: log.equipmentId || "",
                equipmentName: log.equipmentName || "",
                gallonsRefueled: null,
                employeeEquipmentLogId: log.id,
              },
            ];
          }
        }
        return (
          <TimeCardEquipmentRefuelLogs
            edit={edit}
            manager={manager}
            equipmentRefuelLogs={logs}
            onDataChange={
              getTypedOnDataChange<EquipmentRefuelLog[]>(onDataChange)!
            }
            focusIds={focusIds}
            setFocusIds={setFocusIds}
            isReviewYourTeam={isReviewYourTeam}
          />
        );
      }
      case "timesheetHighlights":
        return (
          <TimeCardHighlights
            highlightTimesheet={(data as TimesheetHighlights[]).map((item) => ({
              ...item,
              startTime: renderValueOrNA(item.startTime),
              endTime: renderValueOrNA(item.endTime),
              costcode: renderValueOrNA(item.costcode),
              Jobsite: {
                ...item.Jobsite,
                name: renderValueOrNA(item.Jobsite?.name),
              },
            }))}
            edit={edit}
            manager={manager}
            onDataChange={
              getTypedOnDataChange<TimesheetHighlights[]>(onDataChange)!
            }
            date={date}
            focusIds={focusIds}
            setFocusIds={setFocusIds}
            isReviewYourTeam={isReviewYourTeam}
          />
        );
      case "mechanicLogs":
        return (
          <TimeCardMechanicLogs
            maintenanceLogs={data as MaintenanceLogData}
            edit={edit}
            manager={manager}
            onDataChange={
              getTypedOnDataChange<MaintenanceLogData>(onDataChange)!
            }
            focusIds={focusIds}
            setFocusIds={setFocusIds}
            isReviewYourTeam={isReviewYourTeam}
            allEquipment={allEquipment}
          />
        );
      default:
        return null;
    }
  };
  return (
    <Holds
      className={`${
        isReviewYourTeam ? "bg-orange-200" : "row-start-2 row-end-7"
      } h-full w-full overflow-y-auto no-scrollbar`}
      background={isReviewYourTeam ? null : "white"}
    >
      {renderContent()}
    </Holds>
  );
}
