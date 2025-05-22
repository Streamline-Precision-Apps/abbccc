"use client";
import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";
import { Holds } from "@/components/(reusable)/holds";
import { Inputs } from "@/components/(reusable)/inputs";
import { useTranslations } from "next-intl";
import { Grids } from "@/components/(reusable)/grids";
import { Contents } from "@/components/(reusable)/contents";
import { Selects } from "@/components/(reusable)/selects";
import { Buttons } from "@/components/(reusable)/buttons";
import { Images } from "@/components/(reusable)/images";
import { Texts } from "@/components/(reusable)/texts";
import Spinner from "@/components/(animations)/spinner";
import {
  TimesheetFilter,
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
import TimeSheetRenderer from "./timeSheetRenderer";
import { set } from "date-fns";

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

export type EmployeeTimesheetData =
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

export const EmployeeTimeSheets = ({
  data,
  date,
  setDate,
  edit,
  setEdit,
  loading,
  manager,
  timeSheetFilter,
  setTimeSheetFilter,
  onSaveChanges: parentOnSaveChanges,
  onCancelEdits,
  fetchTimesheetsForDate,
  fetchTimesheetsForFilter,
}: EmployeeTimeSheetsProps) => {
  const t = useTranslations("MyTeam");
  // Fix: Ensure changes is always an array and never null
  const [changes, setChanges] = useState<
    | TimesheetHighlights[]
    | TruckingMaterialHaulLog[]
    | EquipmentLogChange[]
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
  >([]);
  // Two sources of truth: originalData and newData
  const [originalData, setOriginalData] = useState<typeof data | null>(
    data ? JSON.parse(JSON.stringify(data)) : null
  );
  const [newData, setNewData] = useState<typeof data | null>(
    data ? JSON.parse(JSON.stringify(data)) : null
  );
  const newDataRef = useRef(newData);
  const [isSaving, setIsSaving] = useState(false);

  // Track last loaded date and filter to know when to sync with parent data
  const [lastLoadedDate, setLastLoadedDate] = useState<string>(date);
  const [lastLoadedFilter, setLastLoadedFilter] =
    useState<TimesheetFilter>(timeSheetFilter);

  useEffect(() => {
    console.log("Data: ", data);
  }, [data]);

  useEffect(() => {
    console.log("newData: ", newData);
  }, [newData]);

  useEffect(() => {
    console.log("originalData: ", originalData);
  }, [originalData]);

  // Only sync local state with parent data if date or filter changes
  useEffect(() => {
    // When filter or date changes, always sync local state to the new data from props
    setOriginalData(data ? JSON.parse(JSON.stringify(data)) : null);
    setNewData(data ? JSON.parse(JSON.stringify(data)) : null);
    setLastLoadedDate(date);
    setLastLoadedFilter(timeSheetFilter);
  }, [date, timeSheetFilter, data]);

  // On initial load, if data arrives and local state is still null, set it
  useEffect(() => {
    if (data && originalData === null && newData === null) {
      setOriginalData(JSON.parse(JSON.stringify(data)));
      setNewData(JSON.parse(JSON.stringify(data)));
    }
  }, [data]);

  const handleDateChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    setDate(newDate);
    await fetchTimesheetsForDate(newDate);
  };

  const handleFilterChange = async (e: ChangeEvent<HTMLSelectElement>) => {
    const newFilter = e.target.value as TimesheetFilter;
    setTimeSheetFilter(newFilter);
    await fetchTimesheetsForFilter(newFilter);
  };

  // In EmployeeTimeSheets.tsx
  const handleSave = useCallback(async () => {
    try {
      setIsSaving(true);
      if (!Array.isArray(changes) || changes.length === 0) {
        console.log("No changes to save");
        return;
      }
      console.log("Saving changes:", changes);
      const result = await parentOnSaveChanges(changes);
      // After save, update both originalData and newData to the just-saved state using the latest newData
      setOriginalData(JSON.parse(JSON.stringify(newData)));
      setChanges([]); // Clear changes after save
      setEdit(false); // Exit edit mode after save
    } catch (error) {
      console.error("Error saving changes:", error);
    } finally {
      setIsSaving(false);
    }
  }, [changes, parentOnSaveChanges]);

  const handleCancel = () => {
    onCancelEdits();
    setChanges([]);
    // Only restore newData if originalData is not null
    if (originalData) {
      setNewData(JSON.parse(JSON.stringify(originalData)));
    }
  };

  const handleDataChange = (
    updatedData:
      | TimesheetHighlights[]
      | TimesheetHighlights
      | TruckingMaterialHaulLog[]
      | EquipmentLogChange[]
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
      | TruckingMileageData
  ) => {
    // Always ensure we're working with an array
    const changesArray = Array.isArray(updatedData)
      ? updatedData
      : [updatedData];
    // Create deep copies of the changes
    const newChanges = changesArray.map((item) =>
      JSON.parse(JSON.stringify(item))
    );
    setChanges(newChanges);
    setNewData((prevData) => {
      // Special handling for TruckingMileageData
      if (
        timeSheetFilter === "truckingMileage" &&
        Array.isArray(updatedData) &&
        updatedData.length > 0 &&
        "TruckingLogs" in updatedData[0]
      ) {
        return updatedData as typeof prevData;
      }
      // Default: just use the new changes
      return newChanges as typeof prevData;
    });
  };

  return (
    <Grids rows={"3"} gap={"3"} className="h-full w-full">
      <Holds
        background={"white"}
        className={"row-start-1 row-end-2 h-full w-full rounded-t-none"}
      >
        <Contents width={"section"} className="h-full pt-1 pb-5">
          <Grids rows={"3"} className="h-full w-full">
            <Holds className="row-start-1 row-end-1">
              <label htmlFor="date" className="text-xs">
                {t("SelectDate")}
              </label>
              <Inputs
                type="date"
                name="date"
                id="date"
                value={date}
                className="text-xs text-center border-[3px] py-2 border-black"
                onChange={handleDateChange}
                disabled={loading}
              />
            </Holds>
            <Holds className="row-start-2 row-end-3">
              <Selects
                onChange={handleFilterChange}
                value={timeSheetFilter}
                className="text-center text-xs py-2"
                disabled={loading}
              >
                <option value="timesheetHighlights">
                  Timesheet Highlights
                </option>
                <option value="truckingMileage">Trucking Mileage</option>
                <option value="truckingEquipmentHaulLogs">
                  Trucking Equipment Hauls
                </option>
                <option value="truckingMaterialHaulLogs">
                  Trucking Material Hauls
                </option>
                <option value="truckingRefuelLogs">Trucking Refuel Logs</option>
                <option value="truckingStateLogs">Trucking State Logs</option>
                <option value="tascoHaulLogs">TASCO Haul Logs</option>
                <option value="tascoRefuelLogs">TASCO Refuel Logs</option>
                <option value="equipmentLogs">Equipment Logs</option>
                <option value="equipmentRefuelLogs">
                  Equipment Refuel Logs
                </option>
              </Selects>
            </Holds>
            <Holds
              position={"row"}
              className="row-start-3 row-end-4 justify-between"
            >
              {edit ? (
                <>
                  <Buttons
                    background={"green"}
                    className="w-1/4"
                    onClick={handleSave}
                    disabled={
                      loading ||
                      !Array.isArray(changes) ||
                      changes.length === 0 ||
                      isSaving
                    }
                  >
                    {isSaving ? (
                      <Spinner size={24} />
                    ) : (
                      <Images
                        titleImg={"/formSave.svg"}
                        titleImgAlt={"Save"}
                        className="w-6 h-6 mx-auto"
                      />
                    )}
                  </Buttons>
                  <Buttons
                    background={"red"}
                    className="w-1/4"
                    onClick={handleCancel}
                    disabled={loading}
                  >
                    <Images
                      titleImg={"/formUndo.svg"}
                      titleImgAlt={"Cancel"}
                      className="w-6 h-6 mx-auto"
                    />
                  </Buttons>
                </>
              ) : (
                <Buttons
                  background={"orange"}
                  className="text-center text-base"
                  onClick={() => setEdit(true)}
                  disabled={loading}
                >
                  <Images
                    titleImg="/formEdit.svg"
                    titleImgAlt="Edit Icon"
                    className="w-6 h-6 mx-auto"
                  />
                </Buttons>
              )}
            </Holds>
          </Grids>
        </Contents>
      </Holds>

      <Holds
        background={"white"}
        className={"row-start-2 row-end-4 h-full w-full"}
      >
        <Contents width={"section"} className="pt-2 pb-5">
          {loading ? (
            <Holds className="w-full h-full flex items-center justify-center">
              <Spinner size={70} />
              <Texts size="p6" className="mt-2">
                {t("loadingTimesheetData")}
              </Texts>
            </Holds>
          ) : (
            <TimeSheetRenderer
              key={`${edit}-${JSON.stringify(newData)}`}
              filter={timeSheetFilter}
              data={newData}
              edit={edit}
              manager={manager}
              onDataChange={handleDataChange}
              date={date}
            />
          )}
        </Contents>
      </Holds>
    </Grids>
  );
};
