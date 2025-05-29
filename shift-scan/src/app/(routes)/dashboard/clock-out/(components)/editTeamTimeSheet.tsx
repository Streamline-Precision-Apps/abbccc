"use client";
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";
import { Holds } from "@/components/(reusable)/holds";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useState, useMemo } from "react";
import { Grids } from "@/components/(reusable)/grids";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { format } from "date-fns";
import { useSession } from "next-auth/react";
import { NewTab } from "@/components/(reusable)/newTabs";
import { Titles } from "@/components/(reusable)/titles";
import { useTimesheetData } from "@/hooks/(ManagerHooks)/useTimesheetData";
import { useEmployeeData } from "@/hooks/(ManagerHooks)/useEmployeeData";
import {
  TimesheetHighlights,
  TimesheetFilter,
  TruckingMileageUpdate,
  TruckingEquipmentHaulLog,
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
import {
  updateTruckingHaulLogs,
  updateTimesheetHighlights,
  updateEquipmentLogs,
  updateTascoHaulLogs,
  updateTascoRefuelLogs,
  updateTruckingMaterialLogs,
  updateTruckingRefuelLogs,
  updateTruckingStateLogs,
  updateEquipmentRefuelLogs,
  updateTruckingMileage,
} from "@/actions/myTeamsActions";
import { TimesheetDataUnion } from "@/hooks/(ManagerHooks)/useTimesheetData";

// Add a type for material haul log changes
interface TruckingMaterialHaulLog {
  id: string;
  name: string;
  LocationOfMaterial: string;
  materialWeight?: number;
  lightWeight?: number;
  grossWeight?: number;
}
// Add a type for equipment log changes
interface EquipmentLogChange {
  id: string;
  startTime: Date;
  endTime: Date;
}
// Type guard for EquipmentLogChange
function isEquipmentLogChange(
  obj:
    | EquipmentLogChange
    | TruckingMaterialHaulLog
    | TimesheetHighlights
    | TruckingMileageUpdate
    | TruckingEquipmentHaulLog
    | {
        id: string;
        gallonsRefueled?: number | null;
        milesAtFueling?: number | null;
      }
    | { id: string; state?: string; stateLineMileage?: number }
    | {
        id: string;
        shiftType?: string;
        equipmentId?: string | null;
        materialType?: string;
        LoadQuantity?: number | null;
      }
    | { id: string; gallonsRefueled?: number | null }
): obj is EquipmentLogChange {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "id" in obj &&
    "startTime" in obj &&
    "endTime" in obj &&
    obj["startTime"] instanceof Date &&
    obj["endTime"] instanceof Date
  );
}

export default function EmployeeTabs() {
  const { employeeId } = useParams();
  const { id } = useParams();
  const urls = useSearchParams();
  const rPath = urls.get("rPath");
  const timeCard = urls.get("timeCard");
  const router = useRouter();
  const t = useTranslations("MyTeam");
  const { data: session } = useSession();

  const manager = useMemo(
    () => `${session?.user?.firstName} ${session?.user?.lastName}`,
    [session]
  );
  const [activeTab, setActiveTab] = useState(1);
  const today = useMemo(() => format(new Date(), "yyyy-MM-dd"), []);
  const [date, setDate] = useState<string>(today);
  const [edit, setEdit] = useState(false);
  const [timeSheetFilter, setTimeSheetFilter] = useState<TimesheetFilter>(
    "timesheetHighlights"
  );

  const {
    employee,
    contacts,
    loading: loadingEmployee,
    error: errorEmployee,
  } = useEmployeeData(employeeId as string | undefined);

  const {
    data: timesheetData,
    setData: setTimesheetData,
    loading: loadingTimesheets,
    error: errorTimesheets,
    updateDate: fetchTimesheetsForDate,
    updateFilter: fetchTimesheetsForFilter,
  } = useTimesheetData(employeeId as string | undefined, date, timeSheetFilter);

  const loading = loadingEmployee || loadingTimesheets;

  useEffect(() => {
    if (date && date !== today) {
      fetchTimesheetsForDate(date);
    }
  }, [date, fetchTimesheetsForDate, today]);

  useEffect(() => {
    fetchTimesheetsForFilter(timeSheetFilter);
  }, [timeSheetFilter, fetchTimesheetsForFilter]);

  const onSaveChanges = useCallback(
    async (
      changes:
        | TimesheetHighlights[]
        | TimesheetHighlights
        | TruckingMileageUpdate[]
        | TruckingEquipmentHaulLog[]
        | TruckingMaterialHaulLog[]
        | {
            id: string;
            gallonsRefueled?: number | null;
            milesAtFueling?: number | null;
          }[]
        | { id: string; state?: string; stateLineMileage?: number }[]
        | {
            id: string;
            shiftType?: string;
            equipmentId?: string | null;
            materialType?: string;
            LoadQuantity?: number | null;
          }[]
        | { id: string; gallonsRefueled?: number | null }[]
        | EquipmentLogChange[]
    ) => {
      try {
        switch (timeSheetFilter) {
          case "timesheetHighlights":
            const timesheetChanges = changes as
              | TimesheetHighlights[]
              | TimesheetHighlights;
            const changesArray = Array.isArray(timesheetChanges)
              ? timesheetChanges
              : [timesheetChanges];

            const serializedChanges = changesArray.map((timesheet) => ({
              id: timesheet.id,
              startTime: timesheet.startTime
                ? new Date(timesheet.startTime).toISOString()
                : undefined,
              endTime: timesheet.endTime
                ? new Date(timesheet.endTime).toISOString()
                : undefined,
              jobsiteId: timesheet.jobsiteId,
              costcode: timesheet.costcode,
            }));

            const validChanges = serializedChanges.filter(
              (timesheet) => timesheet.id && timesheet.startTime !== undefined
            );

            if (validChanges.length === 0) return;

            const result = await updateTimesheetHighlights(validChanges);
            if (result?.success) {
              await Promise.all([
                fetchTimesheetsForDate(date),
                fetchTimesheetsForFilter(timeSheetFilter),
              ]);
              setEdit(false);
            }
            break;

          case "truckingMileage": {
            const mileageChanges = changes as TruckingMileageUpdate[];
            if (mileageChanges.length === 0) {
              console.warn("No valid mileage changes to save");
              return;
            }

            const formData = new FormData();
            mileageChanges.forEach((change, index) => {
              formData.append(`changes[${index}]`, JSON.stringify(change));
            });
            const result = await updateTruckingMileage(formData);

            if (result?.success) {
              await Promise.all([
                fetchTimesheetsForDate(date),
                fetchTimesheetsForFilter(timeSheetFilter),
              ]);
              setEdit(false);
            }
            break;
          }

          case "truckingEquipmentHaulLogs": {
            const haulLogChanges = changes as TruckingEquipmentHaulLog[];
            const updates = haulLogChanges.flatMap(
              (log) =>
                log.EquipmentHauled?.map((hauledItem) => ({
                  id: hauledItem.id,
                  equipmentId: hauledItem.Equipment?.id,
                  jobSiteId: hauledItem.JobSite?.id,
                })) || []
            );

            const haulingResult = await updateTruckingHaulLogs(updates);
            if (haulingResult?.success) {
              await Promise.all([
                fetchTimesheetsForDate(date),
                fetchTimesheetsForFilter(timeSheetFilter),
              ]);
              setEdit(false);
            }
            break;
          }

          case "truckingMaterialHaulLogs": {
            const materialChanges = changes as TruckingMaterialHaulLog[];
            if (materialChanges.length > 0) {
              const formattedChanges = materialChanges.map((change) => ({
                id: change.id,
                name: change.name,
                LocationOfMaterial: change.LocationOfMaterial,
                materialWeight: change.materialWeight,
                lightWeight: change.lightWeight,
                grossWeight: change.grossWeight,
              }));
              await updateTruckingMaterialLogs(formattedChanges);
            }
            break;
          }

          case "truckingRefuelLogs":
            if (
              changes &&
              Array.isArray(changes) &&
              changes.every(
                (change) =>
                  "id" in change &&
                  ("gallonsRefueled" in change || "milesAtFueling" in change)
              )
            ) {
              await updateTruckingRefuelLogs(
                changes as {
                  id: string;
                  gallonsRefueled?: number | null;
                  milesAtFueling?: number | null;
                }[]
              );
            } else {
              console.error("Invalid changes type");
            }
            break;

          case "truckingStateLogs":
            if (
              Array.isArray(changes) &&
              changes.every(
                (change) =>
                  "id" in change &&
                  ("state" in change || "stateLineMileage" in change)
              )
            ) {
              await updateTruckingStateLogs(changes);
            } else {
              console.error("Invalid changes type");
            }
            break;

          case "tascoHaulLogs":
            if (
              Array.isArray(changes) &&
              changes.every(
                (change) =>
                  "id" in change &&
                  "shiftType" in change &&
                  "equipmentId" in change &&
                  "materialType" in change &&
                  "LoadQuantity" in change
              )
            ) {
              await updateTascoHaulLogs(
                changes as {
                  id: string;
                  shiftType?: string | undefined;
                  equipmentId?: string | null | undefined;
                  materialType?: string | undefined;
                  LoadQuantity?: number | null | undefined;
                }[]
              );
            } else {
              console.error("Invalid changes type");
            }
            break;

          case "tascoRefuelLogs":
            if (
              Array.isArray(changes) &&
              changes.every(
                (change) =>
                  "id" in change &&
                  ("gallonsRefueled" in change ||
                    !("gallonsRefueled" in change))
              )
            ) {
              await updateTascoRefuelLogs(
                changes as { id: string; gallonsRefueled?: number | null }[]
              );
            } else {
              console.error("Invalid changes type");
            }
            break;

          case "equipmentLogs":
            if (Array.isArray(changes) && changes.every(isEquipmentLogChange)) {
              await updateEquipmentLogs(
                changes.map((change) => ({
                  id: change.id,
                  startTime: change.startTime,
                  endTime: change.endTime,
                }))
              );
            } else {
              console.error("Invalid changes type");
            }
            break;

          case "equipmentRefuelLogs":
            if (
              Array.isArray(changes) &&
              changes.every(
                (change) => "id" in change && "gallonsRefueled" in change
              )
            ) {
              updateEquipmentRefuelLogs(
                changes as { id: string; gallonsRefueled?: number | null }[]
              );
            } else {
              console.error("Invalid changes type");
            }
            break;
        }

        await Promise.all([
          fetchTimesheetsForDate(date),
          fetchTimesheetsForFilter(timeSheetFilter),
        ]);

        setEdit(false);
      } catch (error) {
        console.error("Failed to save changes:", error);
        setEdit(false);
        throw error;
      }
    },
    [
      date,
      timeSheetFilter,
      fetchTimesheetsForDate,
      fetchTimesheetsForFilter,
      setTimesheetData,
    ]
  );

  const onCancelEdits = useCallback(() => {
    fetchTimesheetsForDate(date);
    fetchTimesheetsForFilter(timeSheetFilter);
    setEdit(false);
  }, [date, fetchTimesheetsForDate, fetchTimesheetsForFilter, timeSheetFilter]);

  return (
    <Holds className="h-full w-full">
      <Grids rows={"7"} gap={"5"} className="h-full w-full">
        <Holds className="row-start-1 row-end-2 h-full w-full">
          <TitleBoxes
            onClick={() =>
              router.push(
                timeCard ? timeCard : `/dashboard/myTeam/${id}?rPath=${rPath}`
              )
            }
          >
            <Titles size={"h2"}>
              {loading
                ? "Loading..."
                : `${employee?.firstName} ${employee?.lastName}`}
            </Titles>
          </TitleBoxes>
        </Holds>

        <Holds
          className={`w-full h-full row-start-2 row-end-8 ${
            loading ? "animate-pulse" : ""
          }`}
        >
          <Grids rows={"12"} className="h-full w-full">
            <Holds
              position={"row"}
              className={"row-start-1 row-end-2 h-full gap-1"}
            >
              <NewTab
                onClick={() => setActiveTab(1)}
                isActive={activeTab === 1}
                isComplete={true}
                titleImage="/information.svg"
                titleImageAlt={""}
              >
                {t("ContactInfo")}
              </NewTab>
              <NewTab
                onClick={() => setActiveTab(2)}
                isActive={activeTab === 2}
                isComplete={true}
                titleImage="/form.svg"
                titleImageAlt={""}
              >
                {t("TimeCards")}
              </NewTab>
            </Holds>
            <Holds className="h-full w-full row-start-2 row-end-13">
              {activeTab === 1 && (
                <EmployeeInfo
                  employee={employee}
                  contacts={contacts}
                  loading={loading}
                />
              )}
              {activeTab === 2 && (
                <EmployeeTimeSheets
                  data={timesheetData}
                  date={date}
                  setDate={setDate}
                  edit={edit}
                  setEdit={setEdit}
                  loading={loading}
                  manager={manager}
                  timeSheetFilter={timeSheetFilter}
                  setTimeSheetFilter={setTimeSheetFilter}
                  onSaveChanges={onSaveChanges}
                  onCancelEdits={onCancelEdits}
                  fetchTimesheetsForDate={fetchTimesheetsForDate}
                  fetchTimesheetsForFilter={fetchTimesheetsForFilter}
                />
              )}
            </Holds>
          </Grids>
        </Holds>
      </Grids>
    </Holds>
  );
}

// In EmployeeTimesheetProps (or EmployeeTimesheetData type), allow null:
export type EmployeeTimesheetData = TimesheetDataUnion;

export interface EmployeeTimeSheetsProps {
  data: EmployeeTimesheetData;
  date: string;
  setDate: (date: string) => void;
  edit: boolean;
  setEdit: (edit: boolean) => void;
  loading: boolean;
  manager: string;
  timeSheetFilter: TimesheetFilter;
  setTimeSheetFilter: React.Dispatch<React.SetStateAction<TimesheetFilter>>;
  onSaveChanges: (
    changes:
      | TimesheetHighlights[]
      | TimesheetHighlights
      | TruckingMileageUpdate[]
      | TruckingEquipmentHaulLog[]
      | TruckingMaterialHaulLog[]
      | {
          id: string;
          gallonsRefueled?: number | null;
          milesAtFueling?: number | null;
        }[]
      | { id: string; state?: string; stateLineMileage?: number }[]
      | {
          id: string;
          shiftType?: string;
          equipmentId?: string | null;
          materialType?: string;
          LoadQuantity?: number | null;
        }[]
      | { id: string; gallonsRefueled?: number | null }[]
      | EquipmentLogChange[]
  ) => Promise<void>;
  onCancelEdits: () => void;
  fetchTimesheetsForDate: (date: string) => Promise<void>;
  fetchTimesheetsForFilter: (filter: TimesheetFilter) => Promise<void>;
}
