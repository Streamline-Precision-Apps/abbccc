"use client";
import { ChangeEvent, Dispatch, SetStateAction, useState } from "react";
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
import { TimesheetFilter, TimesheetHighlights } from "@/lib/types";
import TimeSheetRenderer from "./timeSheetRenderer";

interface EmployeeTimeSheetsProps {
  data: any;
  date: string;
  setDate: (date: string) => void;
  edit: boolean;
  setEdit: (edit: boolean) => void;
  loading: boolean;
  manager: string;
  timeSheetFilter: TimesheetFilter;
  setTimeSheetFilter: Dispatch<SetStateAction<TimesheetFilter>>;
  onSaveChanges: (changes: TimesheetHighlights[] | TimesheetHighlights) => Promise<void>;
  onCancelEdits: () => void;
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
  onSaveChanges,
  onCancelEdits,
}: EmployeeTimeSheetsProps) => {
  const t = useTranslations("MyTeam");
  const [changes, setChanges] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    setDate(e.target.value);
  };

  const handleFilterChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setTimeSheetFilter(e.target.value as TimesheetFilter);
  };

  const handleSave = async () => {
    if (!changes) return;
    setIsSaving(true);
    try {
      await onSaveChanges(changes);
      setChanges(null);
    } catch (error) {
      console.error("Failed to save changes:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    onCancelEdits();
    setChanges(null);
  };

  const handleDataChange = (updatedData: TimesheetHighlights[] | TimesheetHighlights) => {
    setChanges(Array.isArray(updatedData) ? updatedData : [updatedData]);
  };

  return (
    <Grids rows={"3"} gap={"3"} className="h-full w-full">
      <Holds background={"white"} className={"row-start-1 row-end-2 h-full w-full rounded-t-none"}>
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
                <option value="timesheetHighlights">Timesheet Highlights</option>
                <option value="truckingMileage">Trucking Mileage</option>
                <option value="truckingEquipmentHaulLogs">Trucking Equipment Hauls</option>
                <option value="truckingMaterialHaulLogs">Trucking Material Hauls</option>
                <option value="truckingRefuelLogs">Trucking Refuel Logs</option>
                <option value="truckingStateLogs">Trucking State Logs</option>
                <option value="tascoHaulLogs">TASCO Haul Logs</option>
                <option value="tascoRefuelLogs">TASCO Refuel Logs</option>
                <option value="equipmentLogs">Equipment Logs</option>
                <option value="equipmentRefuelLogs">Equipment Refuel Logs</option>
              </Selects>
            </Holds>
            <Holds position={"row"} className="row-start-3 row-end-4 justify-between">
              {edit ? (
                <>
                  <Buttons
                    background={"green"}
                    className="w-1/4"
                    onClick={handleSave}
                    disabled={loading || !changes || isSaving}
                  >
                    {isSaving ? (
                      <Spinner size={24} />
                    ) : (
                      <Images
                        titleImg={"/save-edit.svg"}
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
                      titleImg={"/undo-edit.svg"}
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

      <Holds background={"white"} className={"row-start-2 row-end-4 h-full w-full"}>
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
              filter={timeSheetFilter}
              data={data}
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