"use client";
import { Holds } from "@/components/(reusable)/holds";
import { Texts } from "@/components/(reusable)/texts";
import { TimesheetFilter, JobsiteData, EquipmentData } from "@/lib/types";
import TimeCardEquipmentLogs from "./TimeCardEquipmentLogs";
import TimeCardEquipmentRefuelLogs from "./TimeCardEquipmentRefuelLogs";
import TimeCardHighlights from "./TimeCardHighlights";
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
  isReviewYourTeam = false, // default to false
}: TimeSheetRendererProps) {
  const t = useTranslations("MyTeam");
  const isEmptyData = !data || (Array.isArray(data) && data.length === 0);
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
        // Handle review mode data conversion
        if (isReviewYourTeam && Array.isArray(data)) {
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
          const formattedData: TruckingMileageData = validTimesheets.map(
            (ts) => ({
              TruckingLogs: ts.TruckingLogs.map((tl) => ({
                id: tl.id,
                timeSheetId: tl.timeSheetId || ts.id, // Use timesheet id if log id is not available
                equipmentId: tl.equipmentId || tl.Equipment?.id || null,
                startingMileage: tl.startingMileage,
                endingMileage: tl.endingMileage,
                Equipment: tl.Equipment,
              })),
            })
          );

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
      case "truckingEquipmentHaulLogs":
        return (
          <TimeCardTruckingHaulLogs
            truckingEquipmentHaulLogs={data as TruckingEquipmentHaulLogData}
            edit={edit}
            manager={manager}
            onDataChange={
              getTypedOnDataChange<TruckingEquipmentHaulLogData>(onDataChange)!
            }
            focusIds={focusIds}
            setFocusIds={setFocusIds}
            isReviewYourTeam={isReviewYourTeam}
          />
        );
      case "truckingMaterialHaulLogs":
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
      case "truckingRefuelLogs":
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
      case "truckingStateLogs":
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
      case "tascoHaulLogs": {
        // Handle review mode data conversion
        if (isReviewYourTeam && Array.isArray(data)) {
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

          // Type guard to check if object has TascoLogs
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
          const formattedData: TascoHaulLogData = [
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

          console.log("Converted TASCO haul logs data:", formattedData);

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
        // Handle review mode data conversion
        if (isReviewYourTeam && Array.isArray(data)) {
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
          const formattedData: TascoRefuelLogData = [
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

          console.log("Converted TASCO refuel logs data:", formattedData);

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
        // Handle review mode data conversion
        if (isReviewYourTeam && Array.isArray(data)) {
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

          const formattedData: EquipmentLogsData = [
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

          console.log("Converted equipment logs data:", formattedData);

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
      case "equipmentRefuelLogs":
        return (
          <TimeCardEquipmentRefuelLogs
            equipmentRefuelLogs={data as EmployeeEquipmentLogWithRefuel[]}
            edit={edit}
            manager={manager}
            onDataChange={
              getTypedOnDataChange<EquipmentRefuelLog[]>(onDataChange)!
            }
            focusIds={focusIds}
            setFocusIds={setFocusIds}
            isReviewYourTeam={isReviewYourTeam}
          />
        );
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
      default:
        return null;
    }
  };

  return (
    <Holds className="row-start-2 row-end-7 h-full w-full overflow-y-scroll no-scrollbar">
      {renderContent()}
    </Holds>
  );
}
