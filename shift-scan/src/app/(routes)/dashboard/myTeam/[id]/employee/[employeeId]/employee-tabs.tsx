"use client";
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";
import { Holds } from "@/components/(reusable)/holds";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useState, useMemo } from "react";
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
import { TimesheetFilter, TimesheetHighlights } from "@/lib/types";
import { updateTimesheetHighlights } from "@/actions/timeSheetActions";

export type TimesheetUpdate = {
  id: string;
  startTime?: string | null;
  endTime?: string | null;
  jobsiteId?: string;
  costcode?: string;
};

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

  // Employee data
  const {
    employee,
    contacts,
    loading: loadingEmployee,
    error: errorEmployee,
  } = useEmployeeData(employeeId as string | undefined);

  // Timesheet data
  const {
    data: timesheetData,
    loading: loadingTimesheets,
    error: errorTimesheets,
    updateDate: fetchTimesheetsForDate,
    updateFilter: fetchTimesheetsForFilter,
  } = useTimesheetData(employeeId as string | undefined, date, timeSheetFilter);

  const loading = loadingEmployee || loadingTimesheets;

  // Handle date changes
  useEffect(() => {
    if (date && date !== today) {
      fetchTimesheetsForDate(date);
    }
  }, [date, fetchTimesheetsForDate, today]);

  // Handle filter changes
  useEffect(() => {
    fetchTimesheetsForFilter(timeSheetFilter);
  }, [timeSheetFilter]);

   // Handle save changes
  const onSaveChanges = useCallback(async (changes: TimesheetHighlights[] | TimesheetHighlights) => {
    try {
      const changesArray = Array.isArray(changes) ? changes : [changes];
      
      const serializedChanges = changesArray.map(timesheet => ({
        id: timesheet.id,
        startTime: timesheet.startTime ? new Date(timesheet.startTime).toISOString() : undefined,
        endTime: timesheet.endTime ? new Date(timesheet.endTime).toISOString() : undefined,
        jobsiteId: timesheet.jobsiteId,
        costcode: timesheet.costcode
      }));

      const validChanges = serializedChanges.filter(timesheet => 
        timesheet.id && timesheet.startTime !== undefined
      );

      if (validChanges.length === 0) return;

      const result = await updateTimesheetHighlights(validChanges);
      
      if (result.success) {
        // Force a complete refresh of the data
        await Promise.all([
          fetchTimesheetsForDate(date),
          fetchTimesheetsForFilter(timeSheetFilter)
        ]);
        setEdit(false);
      }
    } catch (error) {
      console.error("Failed to save changes:", error);
      throw error;
    }
  }, [date, fetchTimesheetsForDate, fetchTimesheetsForFilter, timeSheetFilter]);

  // Handle cancel edits remains the same
  const onCancelEdits = useCallback(() => {
    // Force a complete refresh of the data from the database
    fetchTimesheetsForDate(date);
    fetchTimesheetsForFilter(timeSheetFilter);
    setEdit(false);
  }, [date, fetchTimesheetsForDate, fetchTimesheetsForFilter, timeSheetFilter]);

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
                  error={errorTimesheets} // Added error prop
                />
              )}
            </Holds>
          </Grids>
        </Holds>
      </Grids>
    </Holds>
  );
}
