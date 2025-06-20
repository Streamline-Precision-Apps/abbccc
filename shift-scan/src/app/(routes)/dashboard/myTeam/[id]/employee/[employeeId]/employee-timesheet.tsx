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
import { MaintenanceLogData } from "./TimeCardMechanicLogs";
import TimeSheetRenderer from "./timeSheetRenderer";
import { set } from "date-fns";
import { flattenMaterialLogs } from "./TimeCardTruckingMaterialLogs";
import { updateTruckingMaterialLogs } from "@/actions/myTeamsActions";
import { updateTruckingRefuelLogs } from "@/actions/myTeamsActions";
import { updateTruckingStateLogs } from "@/actions/myTeamsActions";
import { updateTascoHaulLogs } from "@/actions/myTeamsActions";
import { updateTascoRefuelLogs } from "@/actions/myTeamsActions";
import { updateEquipmentRefuelLogs } from "@/actions/myTeamsActions";
import { flattenEquipmentLogs, isEquipmentLogsData } from "@/lib/types";
import { flattenEquipmentRefuelLogs } from "@/lib/types";
import { useAllEquipment } from "@/hooks/useAllEquipment";

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
  | MaintenanceLogData
  | null;

export interface EmployeeTimeSheetsProps {
  data: EmployeeTimesheetData;
  date: string;
  setDate: (date: string) => void;
  edit: boolean;
  setEdit: (edit: boolean) => void;
  loading: boolean;
  manager: string;
  focusIds: string[];
  setFocusIds: (ids: string[]) => void;
  isReviewYourTeam?: boolean;
  timeSheetFilter: TimesheetFilter;
  setTimeSheetFilter: React.Dispatch<React.SetStateAction<TimesheetFilter>>;
  onSaveChanges: (
    changes:
      | TimesheetHighlights[]
      | TimesheetHighlights
      | TruckingMaterialHaulLog[]
      | TruckingMaterialHaulLogData
      | TruckingRefuelLogData
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
  ) => Promise<void>;
  onCancelEdits: () => void;
  fetchTimesheetsForDate: (date: string) => Promise<void>;
  fetchTimesheetsForFilter: (filter: TimesheetFilter) => Promise<void>;
  allEquipment: { id: string; qrId: string; name: string }[]; // <-- Add this
}

export const EmployeeTimeSheets = ({
  data,
  date,
  setDate,
  edit,
  setEdit,
  loading,
  manager,
  focusIds,
  setFocusIds,
  isReviewYourTeam = false,
  timeSheetFilter,
  setTimeSheetFilter,
  onSaveChanges: parentOnSaveChanges,
  onCancelEdits,
  fetchTimesheetsForDate,
  fetchTimesheetsForFilter,
  allEquipment,
}: EmployeeTimeSheetsProps) => {
  const t = useTranslations("MyTeam");
  // Fix: Ensure changes is always an array and never null
  const [changes, setChanges] = useState<
    | TimesheetHighlights[]
    | TruckingMaterialHaulLog[]
    | TruckingMaterialHaulLogData
    | TruckingRefuelLogData
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
  useState<TimesheetFilter>(timeSheetFilter);

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
  }, [timeSheetFilter, data]);

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
    if (fetchTimesheetsForDate) {
      await fetchTimesheetsForDate(newDate);
    }
  };
  const handleFilterChange = async (e: ChangeEvent<HTMLSelectElement>) => {
    const newFilter = e.target.value as TimesheetFilter;
    setTimeSheetFilter(newFilter);
    if (fetchTimesheetsForFilter) {
      await fetchTimesheetsForFilter(newFilter);
    }
  };

  // In EmployeeTimeSheets.tsx
  const handleSave = useCallback(async () => {
    try {
      setIsSaving(true);
      if (timeSheetFilter === "truckingMaterialHaulLogs") {
        // changes is the full nested structure
        const flattened = flattenMaterialLogs(
          changes as TruckingMaterialHaulLogData
        );
        const updates = flattened.filter(
          (mat) =>
            mat &&
            mat.id &&
            (mat.name ||
              mat.LocationOfMaterial ||
              mat.materialWeight !== null ||
              mat.lightWeight !== null ||
              mat.grossWeight !== null)
        );
        if (updates.length === 0) {
          console.warn("No valid material logs to update.");
          return;
        }
        const result = await updateTruckingMaterialLogs(updates);
        console.log("Material log update result:", result);
        setOriginalData(JSON.parse(JSON.stringify(newData)));
        setChanges([]);
        setEdit(false);
        return;
      }
      if (timeSheetFilter === "truckingRefuelLogs") {
        // changes is the full nested structure
        const flattened = flattenRefuelLogs(changes as TruckingRefuelLogData);
        const updates = flattened.filter(
          (refuel) =>
            refuel &&
            refuel.id &&
            refuel.gallonsRefueled !== null &&
            refuel.gallonsRefueled !== undefined
        );
        if (updates.length === 0) {
          console.warn("No valid refuel logs to update.");
          return;
        }
        // Call the server action for refuel logs
        const result = await updateTruckingRefuelLogs(updates);
        console.log("Refuel log update result:", result);
        setOriginalData(JSON.parse(JSON.stringify(newData)));
        setChanges([]);
        setEdit(false);
        return;
      }
      if (timeSheetFilter === "truckingStateLogs") {
        const flattened = flattenStateMileageLogs(
          changes as TruckingStateLogData
        );
        const updates = flattened.filter(
          (mileage) =>
            mileage &&
            mileage.id &&
            mileage.state &&
            mileage.stateLineMileage !== null &&
            mileage.stateLineMileage !== undefined
        );
        if (updates.length === 0) {
          console.warn("No valid state mileage logs to update.");
          return;
        }
        const result = await updateTruckingStateLogs(updates);
        console.log("State mileage log update result:", result);
        setOriginalData(JSON.parse(JSON.stringify(newData)));
        setChanges([]);
        setEdit(false);
        return;
      }
      // Type guard for TascoHaulLogData
      const isTascoHaulLogData = (data: unknown): data is TascoHaulLogData => {
        return (
          Array.isArray(data) &&
          data.length > 0 &&
          typeof data[0] === "object" &&
          data[0] !== null &&
          "TascoLogs" in data[0]
        );
      };
      if (timeSheetFilter === "tascoHaulLogs") {
        if (!isTascoHaulLogData(changes)) {
          console.warn("Invalid changes type for tascoHaulLogs");
          return;
        }
        const flattened = flattenTascoHaulLogs(changes);
        const updates = flattened.filter(
          (log) =>
            log &&
            log.id &&
            log.shiftType &&
            log.materialType &&
            log.LoadQuantity !== null &&
            log.LoadQuantity !== undefined
        );
        if (updates.length === 0) {
          console.warn("No valid tasco haul logs to update.");
          return;
        }
        const result = await updateTascoHaulLogs(updates);
        console.log("Tasco haul log update result:", result);
        setOriginalData(JSON.parse(JSON.stringify(newData)));
        setChanges([]);
        setEdit(false);
        return;
      }
      const isTascoRefuelLogData = (
        data: unknown
      ): data is TascoRefuelLogData => {
        return (
          Array.isArray(data) &&
          data.length > 0 &&
          typeof data[0] === "object" &&
          data[0] !== null &&
          "TascoLogs" in data[0]
        );
      };
      if (timeSheetFilter === "tascoRefuelLogs") {
        if (!isTascoRefuelLogData(changes)) {
          console.warn("Invalid changes type for tascoRefuelLogs");
          return;
        }
        const flattened = flattenTascoRefuelLogs(changes);
        const updates = flattened.filter(
          (log) =>
            log &&
            log.id &&
            log.gallonsRefueled !== null &&
            log.gallonsRefueled !== undefined
        );
        if (updates.length === 0) {
          console.warn("No valid tasco refuel logs to update.");
          return;
        }
        const result = await updateTascoRefuelLogs(updates);
        console.log("Tasco refuel log update result:", result);
        setOriginalData(JSON.parse(JSON.stringify(newData)));
        setChanges([]);
        setEdit(false);
        return;
      }
      if (timeSheetFilter === "equipmentLogs") {
        if (!isEquipmentLogsData(changes)) {
          console.warn("Invalid changes type for equipmentLogs");
          return;
        }
        const flattened = flattenEquipmentLogs(changes);
        const updates = flattened.filter(
          (log) => log && log.id && log.startTime && log.endTime
        );
        if (updates.length === 0) {
          console.warn("No valid equipment logs to update.");
          return;
        }
        // Call the parent save handler with the flattened updates
        const result = await parentOnSaveChanges(updates);
        setOriginalData(JSON.parse(JSON.stringify(newData)));
        setChanges([]);
        setEdit(false);
        return;
      }
      if (timeSheetFilter === "equipmentRefuelLogs") {
        // changes is now a flat array from the UI
        const updates = (Array.isArray(changes) ? changes : []).map(
          (log: any) => ({
            id: log.id,
            gallonsRefueled: log.gallonsRefueled,
          })
        );
        if (updates.length === 0) {
          console.warn("No valid equipment refuel logs to update.");
          return;
        }
        const result = await updateEquipmentRefuelLogs(updates);
        console.log("Equipment refuel log update result:", result);
        setOriginalData(JSON.parse(JSON.stringify(newData)));
        setChanges([]);
        setEdit(false);
        return;
      }
      if (!Array.isArray(changes) || changes.length === 0) {
        console.log("No changes to save");
        return;
      }
      console.log("Saving changes:", changes);

      // Check if all items have properties matching TimesheetHighlights
      const isTimesheetHighlights =
        Array.isArray(changes) &&
        changes.every(
          (item) =>
            typeof item === "object" &&
            item !== null &&
            "id" in item &&
            "jobsiteId" in item &&
            "startTime" in item
        );

      if (isTimesheetHighlights) {
        // Handle as TimesheetHighlights
        const validatedTimesheets = changes.map((item) => {
          const timesheet = item as any;
          const result: any = {
            id: timesheet.id,
            jobsiteId: timesheet.jobsiteId,
            costcode: timesheet.costcode,
          };

          // Process startTime
          if (timesheet.startTime) {
            try {
              const startDate =
                timesheet.startTime instanceof Date
                  ? timesheet.startTime
                  : new Date(timesheet.startTime as string);

              if (!isNaN(startDate.getTime())) {
                result.startTime = startDate;
              }
            } catch (error) {
              console.warn(
                `Invalid startTime for timesheet ${timesheet.id}`,
                error
              );
            }
          }

          // Process endTime
          if (timesheet.endTime) {
            try {
              const endDate =
                timesheet.endTime instanceof Date
                  ? timesheet.endTime
                  : new Date(timesheet.endTime as string);

              if (!isNaN(endDate.getTime())) {
                result.endTime = endDate;
              }
            } catch (error) {
              console.warn(
                `Invalid endTime for timesheet ${timesheet.id}`,
                error
              );
            }
          }

          return result;
        });
        await parentOnSaveChanges(validatedTimesheets as TimesheetHighlights[]);
      } else {
        // For other types, pass through as-is
        await parentOnSaveChanges(changes);
      }

      // After save, update state
      if (newData) {
        setOriginalData(structuredClone(newData));
      }
      setChanges([]);
      // After save, update both originalData and newData to the just-saved state using the latest newData
      setOriginalData(JSON.parse(JSON.stringify(newData)));
      setChanges([]); // Clear changes after save
      setEdit(false); // Exit edit mode after save
    } catch (error) {
      console.error("Error saving changes:", error);

      // Add more descriptive error information for date-related issues
      if (error instanceof Error) {
        if (
          error.message.includes("Invalid time value") ||
          error.message.includes("Invalid Date")
        ) {
          console.error(
            "Detected invalid date format in the data. Please check all date values."
          );
        }
      }
    } finally {
      setIsSaving(false);
    }
  }, [changes, parentOnSaveChanges, timeSheetFilter, newData, setEdit]);

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
      | TruckingMaterialHaulLogData
      | TruckingRefuelLogData
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
    // For material logs, always set changes to the full nested structure
    if (timeSheetFilter === "truckingMaterialHaulLogs") {
      setChanges(updatedData as TruckingMaterialHaulLogData);
      setNewData(updatedData as TruckingMaterialHaulLogData);
      return;
    }
    // For refuel logs, always set changes to the full nested structure
    if (timeSheetFilter === "truckingRefuelLogs") {
      setChanges(updatedData as TruckingRefuelLogData);
      setNewData(updatedData as TruckingRefuelLogData);
      return;
    }
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

  // Helper type guard for string
  const isString = (val: unknown): val is string => typeof val === "string";

  // Helper to safely convert to number or null (no 'unknown' type)
  const toNumberOrNull = (
    val: string | number | null | undefined
  ): number | null => {
    if (typeof val === "number") return val;
    if (typeof val === "string") {
      const trimmed = val.trim();
      return trimmed === "" ? null : parseFloat(trimmed);
    }
    return null;
  };

  // Helper to flatten nested refuel logs for server submission
  const flattenRefuelLogs = (logs: TruckingRefuelLogData) => {
    const result: {
      id: string;
      gallonsRefueled?: number | null;
      milesAtFueling?: number | null;
    }[] = [];
    logs.forEach((item) => {
      (item.TruckingLogs ?? []).forEach((log) => {
        if (!log) return;
        (log.RefuelLogs ?? []).forEach((refuel) => {
          if (refuel && refuel.id) {
            const gallons = toNumberOrNull(refuel.gallonsRefueled);
            const miles = toNumberOrNull(refuel.milesAtFueling);
            result.push({
              id: refuel.id,
              gallonsRefueled: gallons,
              milesAtFueling: miles,
            });
          }
        });
      });
    });
    return result;
  };

  // Helper to flatten nested state mileage logs for server submission
  const flattenStateMileageLogs = (logs: TruckingStateLogData) => {
    const result: { id: string; state: string; stateLineMileage: number }[] =
      [];
    logs.forEach((item) => {
      (item.TruckingLogs ?? []).forEach((log) => {
        if (!log) return;
        (log.StateMileages ?? []).forEach((mileage) => {
          if (mileage && mileage.id) {
            result.push({
              id: mileage.id,
              state: mileage.state,
              stateLineMileage: mileage.stateLineMileage,
            });
          }
        });
      });
    });
    return result;
  };

  // Helper to flatten nested tasco haul logs for server submission
  const flattenTascoHaulLogs = (logs: TascoHaulLogData) => {
    const result: {
      id: string;
      shiftType: string;
      equipmentId: string | null;
      materialType: string;
      LoadQuantity: number;
    }[] = [];
    logs.forEach((item) => {
      (item.TascoLogs ?? []).forEach((log) => {
        if (log && log.id) {
          result.push({
            id: log.id,
            shiftType: log.shiftType,
            equipmentId:
              !log.equipmentId || log.equipmentId === ""
                ? null
                : log.equipmentId,
            materialType: log.materialType,
            LoadQuantity: log.LoadQuantity ?? 0,
          });
        }
      });
    });
    return result;
  };

  // Helper to flatten nested tasco refuel logs for server submission
  const flattenTascoRefuelLogs = (logs: TascoRefuelLogData) => {
    const result: { id: string; gallonsRefueled: number | null }[] = [];
    logs.forEach((item) => {
      (item.TascoLogs ?? []).forEach((log) => {
        (log.RefuelLogs ?? []).forEach((refuel) => {
          if (refuel && refuel.id) {
            result.push({
              id: refuel.id,
              gallonsRefueled:
                typeof refuel.gallonsRefueled === "number"
                  ? refuel.gallonsRefueled
                  : refuel.gallonsRefueled
                  ? Number(refuel.gallonsRefueled)
                  : null,
            });
          }
        });
      });
    });
    return result;
  };

  // In your save handler, before sending to the server:
  /**
   * Save all material logs, including all changes from all logs.
   * Flattens the entire nested structure and filters out empty/invalid logs.
   */
  const handleSaveMaterialLogs = async (
    nestedMaterialLogs: TruckingMaterialHaulLogData
  ) => {
    // Always flatten the entire nested structure, not just the changed logs
    const flattened = flattenMaterialLogs(nestedMaterialLogs);
    console.log("Flattened material logs:", flattened);
    // Only send updates for materials that actually exist (have an id and at least one field to update)
    const updates = flattened.filter(
      (mat) =>
        mat &&
        mat.id &&
        (mat.name ||
          mat.LocationOfMaterial ||
          mat.materialWeight !== null ||
          mat.lightWeight !== null ||
          mat.grossWeight !== null)
    );
    if (updates.length === 0) {
      console.warn("No valid material logs to update.");
      return;
    }
    const result = await updateTruckingMaterialLogs(updates);
    console.log("Material log update result:", result);
  };

  const handleSelectEntity = (id: string) => {
    if (focusIds.includes(id)) {
      setFocusIds(focusIds.filter((fid) => fid !== id));
    } else {
      setFocusIds([...focusIds, id]);
    }
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
                  {t("timesheetHighlights")}
                </option>
                <option value="truckingMileage">{t("truckingMileage")}</option>
                <option value="truckingEquipmentHaulLogs">
                  {t("truckingEquipmentHaulLogs")}
                </option>
                <option value="truckingMaterialHaulLogs">
                  {t("truckingMaterialHaulLogs")}
                </option>
                <option value="truckingRefuelLogs">
                  {t("truckingRefuelLogs")}
                </option>
                <option value="truckingStateLogs">
                  {t("truckingStateLogs")}
                </option>
                <option value="tascoHaulLogs">{t("tascoHaulLogs")}</option>
                <option value="tascoRefuelLogs">{t("tascoRefuelLogs")}</option>
                <option value="equipmentLogs">{t("equipmentLogs")}</option>
                <option value="equipmentRefuelLogs">
                  {t("equipmentRefuelLogs")}
                </option>{" "}
                <option value="mechanicLogs">{t("mechanicLogs")}</option>
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
                {t("LoadingTimesheetData")}
              </Texts>
            </Holds>
          ) : (
            <TimeSheetRenderer
              key={`${edit}-${JSON.stringify(newData)}`}
              filter={timeSheetFilter}
              data={newData}
              setData={setNewData}
              edit={edit}
              manager={manager}
              onDataChange={handleDataChange}
              date={date}
              focusIds={focusIds}
              setFocusIds={setFocusIds}
              handleSelectEntity={handleSelectEntity}
              isReviewYourTeam={isReviewYourTeam}
              allEquipment={allEquipment}
            />
          )}
        </Contents>
      </Holds>
    </Grids>
  );
};

// Type guard to check if an object has startTime and endTime properties
function hasTimestampProperties(obj: any): obj is {
  id: string;
  startTime: Date | string | null;
  endTime: Date | string | null;
  [key: string]: any;
} {
  return (
    obj &&
    typeof obj === "object" &&
    "id" in obj &&
    ("startTime" in obj || "endTime" in obj)
  );
}
