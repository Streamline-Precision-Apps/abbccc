"use client";
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";
import { Holds } from "@/components/(reusable)/holds";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from "react";
import { Grids } from "@/components/(reusable)/grids";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { EmployeeTimeSheets } from "./employee-timesheet";
import EmployeeInfo from "./employeeInfo";
import { format } from "date-fns";
import { useSession } from "next-auth/react";
import { NewTab } from "@/components/(reusable)/newTabs";
import { Titles } from "@/components/(reusable)/titles";
import { useTimesheetData } from "@/hooks/(ManagerHooks)/useTimesheetData";
import { useEmployeeData } from "@/hooks/(ManagerHooks)/useEmployeeData";
import {
  TimesheetHighlights,
  TruckingEquipmentHaulLogData,
  TruckingMileageData,
  TruckingRefuelLogData,
  TruckingStateLogData,
  TascoRefuelLogData,
  TascoHaulLogData,
  EquipmentLogsData,
  EmployeeEquipmentLogWithRefuel,
  TruckingMaterialHaulLogData,
} from "@/lib/types";

export default function EmployeeTabs() {
  const { employeeId } = useParams();
  const { id } = useParams();
  const urls = useSearchParams();
  const rPath = urls.get("rPath");
  const timeCard = urls.get("timeCard");
  const router = useRouter();
  const t = useTranslations("MyTeam");
  const { data: session } = useSession();
  const manager = `${session?.user?.firstName} ${session?.user?.lastName}`;
  const [activeTab, setActiveTab] = useState(1);
  const today = format(new Date(), "yyyy-MM-dd");
  const [date, setDate] = useState<string>(today);
  const [edit, setEdit] = useState(false);
  const [timeSheetFilter, setTimeSheetFilter] = useState("timesheetHighlights");

  // State to store the original timesheet data
  const [originalHighlightTimesheet, setOriginalHighlightTimesheet] = useState<
    TimesheetHighlights[] | null
  >(null);
  const [
    originalTruckingEquipmentHaulLogs,
    setOriginalTruckingEquipmentHaulLogs,
  ] = useState<TruckingEquipmentHaulLogData | null>(null);
  const [
    originalTruckingMaterialHaulLogs,
    setOriginalTruckingMaterialHaulLogs,
  ] = useState<TruckingMaterialHaulLogData | null>(null);
  const [originalTruckingMileage, setOriginalTruckingMileage] =
    useState<TruckingMileageData | null>(null);
  const [originalTruckingRefuelLogs, setOriginalTruckingRefuelLogs] =
    useState<TruckingRefuelLogData | null>(null);
  const [originalTruckingStateLogs, setOriginalTruckingStateLogs] =
    useState<TruckingStateLogData | null>(null);
  const [originalTascoRefuelLog, setOriginalTascoRefuelLog] =
    useState<TascoRefuelLogData | null>(null);
  const [originalTascoHaulLogs, setOriginalTascoHaulLogs] =
    useState<TascoHaulLogData | null>(null);
  const [originalEquipmentLogs, setOriginalEquipmentLogs] =
    useState<EquipmentLogsData | null>(null);
  const [originalEquipmentRefuelLogs, setOriginalEquipmentRefuelLogs] =
    useState<EmployeeEquipmentLogWithRefuel[] | null>(null);

  // Timesheet data useHook /(ManagerHooks)/useEmployeeData
  const {
    employee,
    contacts,
    loading: loadingEmployee,
    error: errorEmployee,
  } = useEmployeeData(employeeId as string | undefined);

  // Timesheet data useHook /(ManagerHooks)/useTimesheetData
  const {
    highlightTimesheet,
    truckingEquipmentHaulLogs,
    truckingMaterialHaulLogs,
    truckingMileage,
    truckingRefuelLogs,
    truckingStateLogs,
    tascoRefuelLog,
    tascoHaulLogs,
    equipmentLogs,
    equipmentRefuelLogs,
    loading: loadingTimesheets,
    error: errorTimesheets,
    updateDate: fetchTimesheetsForDate,
    updateFilter: fetchTimesheetsForFilter,
  } = useTimesheetData(
    employeeId as string | undefined,
    date,
    timeSheetFilter,
    (initialData) => {
      // Callback to store the initial data
      setOriginalHighlightTimesheet(initialData.highlightTimesheet);
      setOriginalTruckingEquipmentHaulLogs(
        initialData.truckingEquipmentHaulLogs
      );
      setOriginalTruckingMaterialHaulLogs(initialData.truckingMaterialHaulLogs);
      setOriginalTruckingMileage(initialData.truckingMileage);
      setOriginalTruckingRefuelLogs(initialData.truckingRefuelLogs);
      setOriginalTruckingStateLogs(initialData.truckingStateLogs);
      setOriginalTascoRefuelLog(initialData.tascoRefuelLog);
      setOriginalTascoHaulLogs(initialData.tascoHaulLogs);
      setOriginalEquipmentLogs(initialData.equipmentLogs);
      setOriginalEquipmentRefuelLogs(initialData.equipmentRefuelLogs);
    }
  );

  const loading = loadingEmployee || loadingTimesheets;

  useEffect(() => {
    fetchTimesheetsForDate(date);
  }, [date, fetchTimesheetsForDate]);

  useEffect(() => {
    fetchTimesheetsForFilter(timeSheetFilter);
  }, [timeSheetFilter, fetchTimesheetsForFilter]);

  // Function to revert the timesheet data
  const revertTimesheetData = useCallback(() => {
    // Reset the state variables to the original data
    // Ensure you only reset the data that corresponds to the currently active filter
    if (timeSheetFilter === "timesheetHighlights") {
      // Assuming your useTimesheetData hook updates these states
      // You might need to adjust based on how your hook manages state
      // One approach is to have the hook return setters as well, or refetch.
      // For simplicity here, we'll assume the hook updates the states directly.
      // A cleaner approach might involve the hook managing all the state.
      // Refetching is another valid strategy.
      fetchTimesheetsForDate(date); // Simplest way if your hook refetches on date change
      fetchTimesheetsForFilter(timeSheetFilter); // Ensure the filter is also applied
    } else if (timeSheetFilter === "truckingMileage") {
      fetchTimesheetsForDate(date);
      fetchTimesheetsForFilter(timeSheetFilter);
    }
    // ... repeat for other timeSheetFilter values
    setEdit(false);
  }, [date, timeSheetFilter, fetchTimesheetsForDate, fetchTimesheetsForFilter]);

  // Placeholder for save changes functionality (will be moved or passed down)
  const onSaveChanges = () => {
    console.log("Save changes clicked");
    setEdit(false);
  };

  // Placeholder for cancel edits functionality (will be moved or passed down)
  const onCancelEdits = () => {
    revertTimesheetData();
    setEdit(false);
  };

  return (
    <Holds className="h-full w-full">
      <Grids rows={"7"} gap={"5"} className="h-full w-full">
        <Holds
          background={"white"}
          className="row-start-1 row-end-2 h-full w-full"
        >
          <TitleBoxes
            onClick={() =>
              router.push(
                timeCard ? timeCard : `/dashboard/myTeam/${id}?rPath=${rPath}`
              )
            }
          >
            <Titles size={"h2"}>
              {loading
                ? "loading..."
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
                  highlightTimesheet={highlightTimesheet}
                  truckingEquipmentHaulLogs={truckingEquipmentHaulLogs}
                  truckingMaterialHaulLogs={truckingMaterialHaulLogs}
                  truckingMileage={truckingMileage}
                  truckingRefuelLogs={truckingRefuelLogs}
                  truckingStateLogs={truckingStateLogs}
                  tascoRefuelLog={tascoRefuelLog}
                  tascoHaulLogs={tascoHaulLogs}
                  equipmentLogs={equipmentLogs}
                  date={date}
                  setDate={setDate}
                  edit={edit}
                  setEdit={setEdit}
                  loading={loading}
                  manager={manager}
                  timeSheetFilter={timeSheetFilter}
                  setTimeSheetFilter={setTimeSheetFilter}
                  equipmentRefuelLogs={equipmentRefuelLogs}
                  onSaveChanges={onSaveChanges}
                  onCancelEdits={onCancelEdits}
                />
              )}
            </Holds>
          </Grids>
        </Holds>
      </Grids>
    </Holds>
  );
}
