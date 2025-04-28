"use client";
import { ChangeEvent, Dispatch, SetStateAction, useState } from "react";
import { Holds } from "@/components/(reusable)/holds";
import { Inputs } from "@/components/(reusable)/inputs";
import { useTranslations } from "next-intl";
import { Grids } from "@/components/(reusable)/grids";
import {
  EquipmentLogs,
  TascoHaulLogs,
  TascoRefuelLog,
  TimeSheet,
  TimesheetHighlights,
  TruckingEquipmentHaulLog,
  TruckingEquipmentHaulLogData,
  TruckingMaterialHaulLog,
  TruckingMaterialHaulLogData,
  TruckingMileage,
  TruckingMileageData,
  TruckingRefuelLog,
  TruckingStateLogs,
} from "@/lib/types";
import Spinner from "@/components/(animations)/spinner";
import { Contents } from "@/components/(reusable)/contents";
import { Selects } from "@/components/(reusable)/selects";
import { Buttons } from "@/components/(reusable)/buttons";
import { Images } from "@/components/(reusable)/images";
import { formatISO, parseISO } from "date-fns";
import { updateTimeSheets } from "@/actions/timeSheetActions";
import TimeCardHighlights from "./TimeCardHighlights";
import TimeCardTruckingMileage from "./TimeCardTruckingMileage";
import { Texts } from "@/components/(reusable)/texts";
import TimeCardTruckingHaulLogs from "./TimeCardTruckingHaulLogs";
import TimeCardTruckingMaterialLogs from "./TimeCardTruckingMaterialLogs";
import TimeCardTruckingRefuelLogs from "./TimeCardTruckingRefuelLogs";
import TimeCardTruckingStateMileageLogs from "./TimeCardTruckingStateMileage";
import TimeCardTascoHaulLogs from "./TimeCardTascoHaulLogs";
import TimeCardTascoRefuelLogs from "./TimeCardTascoRefuelLogs";
import TimeCardEquipmentLogs from "./TimeCardEquipmentLogs";

export const EmployeeTimeSheets = ({
  date,
  setDate,
  highlightTimesheet,
  edit,
  setEdit,
  loading,
  manager,
  timeSheetFilter,
  setTimeSheetFilter,
  truckingMileage,
  truckingEquipmentHaulLogs,
  truckingMaterialHaulLogs,
  truckingRefuelLogs,
  truckingStateLogs,
  tascoRefuelLog,
  tascoHaulLogs,
  equipmentLogs,
}: {
  date: string;
  setDate: (date: string) => void;
  truckingEquipmentHaulLogs: TruckingEquipmentHaulLogData | null;
  highlightTimesheet: TimesheetHighlights[];
  truckingMaterialHaulLogs: TruckingMaterialHaulLogData | null;
  truckingMileage: TruckingMileageData | null;
  truckingRefuelLogs: TruckingRefuelLog[];
  truckingStateLogs: TruckingStateLogs[];
  tascoRefuelLog: TascoRefuelLog[];
  tascoHaulLogs: TascoHaulLogs[];
  equipmentLogs: EquipmentLogs[];
  edit: boolean;
  setEdit: (edit: boolean) => void;
  loading: boolean;
  manager: string;
  timeSheetFilter: string;
  setTimeSheetFilter: Dispatch<SetStateAction<string>>;
}) => {
  const t = useTranslations("MyTeam");

  const [editedHighlightTimesheet, setEditedHighlightTimesheet] =
    useState<TimesheetHighlights[]>(highlightTimesheet);

  const getUpdatedSheets = (
    original: TimesheetHighlights[],
    edited: TimesheetHighlights[]
  ): TimesheetHighlights[] => {
    return edited.filter((editedSheet) => {
      const originalSheet = original.find(
        (sheet) => sheet.id === editedSheet.id
      );

      if (!originalSheet) return false;

      return (
        editedSheet.date !== originalSheet.date ||
        editedSheet.startTime !== originalSheet.startTime ||
        editedSheet.endTime !== originalSheet.endTime ||
        editedSheet.workType !== originalSheet.workType
      );
    });
  };

  const onSaveChanges = async () => {
    const updatedSheets = getUpdatedSheets(
      highlightTimesheet,
      editedHighlightTimesheet
    );

    if (updatedSheets.length > 0) {
      // Convert date and time to ISO format
      const isoFormattedSheets = updatedSheets.map((sheet) => {
        const startTime = sheet.startTime;
        const endTime = sheet.endTime;

        // Convert startTime to ISO
        if (startTime) {
          sheet.startTime = parseISO(formatISO(startTime)).toISOString();
        }

        // Convert endTime to ISO
        if (endTime) {
          sheet.endTime = parseISO(formatISO(endTime)).toISOString();
        }

        console.log(
          "Updated Timesheets (ISO):",
          sheet.startTime,
          sheet.endTime
        );
        return sheet;
      });

      // Persist changes to the backend
      await updateTimeSheets(isoFormattedSheets, manager);
    } else {
      console.log("No changes were made.");
    }

    setEdit(false);
  };

  const onCancelEdits = () => {
    setEditedHighlightTimesheet([...highlightTimesheet]); // Reset editedTimesheet to the original timesheet
    setEdit(false);
  };

  return (
    <>
      <Grids rows={"3"} gap={"3"} className="h-full w-full ">
        <Holds
          background={"white"}
          className={"row-start-1 row-end-2 h-full w-full rounded-t-none "}
        >
          <Contents width={"section"} className="h-full pt-1 pb-5">
            <Grids rows={"3"} className="h-full w-full">
              <Holds className="row-start-1 row-end-1 ">
                <label htmlFor="date" className="text-xs">
                  {t("SelectDate")}
                </label>
                <Inputs
                  type="date"
                  name="date"
                  id="date"
                  value={date} // Bind input value to state
                  className="text-xs text-center border-[3px] py-2 border-black "
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setDate(e.target.value)
                  }
                />
              </Holds>
              <Holds className="row-start-2 row-end-3">
                <Selects
                  onChange={(e) => setTimeSheetFilter(e.target.value)}
                  className="text-center text-xs py-2"
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
                  <option value="truckingRefuelLogs">
                    Trucking Refuel Logs
                  </option>
                  <option value="truckingStateLogs">Trucking State Logs</option>
                  <option value="tascoHaulLogs">TASCO Haul Logs</option>
                  <option value="tascoRefuelLogs">TASCO Refuel Logs</option>
                  <option value="equipmentLogs">Equipment Logs</option>
                </Selects>
              </Holds>
              <Holds
                position={"row"}
                className="row-start-3 row-end-4  justify-between "
              >
                {edit ? (
                  <>
                    {" "}
                    <Buttons
                      background={"green"}
                      className="w-1/4"
                      onClick={onSaveChanges}
                    >
                      <Images
                        titleImg={"/save-edit.svg"}
                        titleImgAlt={"Save"}
                        className="w-6 h-6 mx-auto"
                      />
                    </Buttons>
                    <Buttons
                      background={"red"}
                      className="w-1/4 "
                      onClick={onCancelEdits}
                    >
                      <Images
                        titleImg={"/undo-edit.svg"}
                        titleImgAlt={"Cancel"}
                        className="w-6 h-6 mx-auto "
                      />
                    </Buttons>
                  </>
                ) : (
                  <Buttons
                    background={"orange"}
                    className="text-center text-base "
                    onClick={() => setEdit(true)}
                  >
                    <Images
                      titleImg="/edit-form.svg"
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
              <Holds
                background={"white"}
                className="row-start-2 row-end-7 h-full justify-center items-center animate-pulse"
              >
                <Spinner size={70} />
              </Holds>
            ) : (
              <Holds className="row-start-2 row-end-7 h-full w-full overflow-y-scroll no-scrollbar">
                {timeSheetFilter === "timesheetHighlights" && (
                  <>
                    {highlightTimesheet.length > 0 ? (
                      <TimeCardHighlights
                        highlightTimesheet={highlightTimesheet}
                        edit={edit}
                        setEdit={setEdit}
                        manager={manager}
                      />
                    ) : (
                      <Holds className="row-start-2 row-end-7 h-full justify-center items-center">
                        <Texts size="p6" className="text-gray-500 italic">
                          No Timesheets data available
                        </Texts>
                      </Holds>
                    )}
                  </>
                )}
                {timeSheetFilter === "truckingMileage" && (
                  <>
                    {truckingMileage && truckingMileage.length > 0 ? (
                      <TimeCardTruckingMileage
                        truckingMileage={truckingMileage}
                        edit={edit}
                        setEdit={setEdit}
                        manager={manager}
                      />
                    ) : (
                      <Holds className="row-start-2 row-end-7 h-full justify-center items-center">
                        <Texts size="p6" className="text-gray-500 italic">
                          No trucking mileage data available
                        </Texts>
                      </Holds>
                    )}
                  </>
                )}
                {timeSheetFilter === "truckingEquipmentHaulLogs" && (
                  <>
                    {truckingEquipmentHaulLogs &&
                    truckingEquipmentHaulLogs.length > 0 ? (
                      <TimeCardTruckingHaulLogs
                        truckingEquipmentHaulLogs={truckingEquipmentHaulLogs}
                        edit={edit}
                        setEdit={setEdit}
                        manager={manager}
                      />
                    ) : (
                      <Holds className="row-start-2 row-end-7 h-full justify-center items-center">
                        <Texts size="p6" className="text-gray-500 italic">
                          No trucking equipment haul data available
                        </Texts>
                      </Holds>
                    )}
                  </>
                )}
                {timeSheetFilter === "truckingMaterialHaulLogs" && (
                  <>
                    {truckingMaterialHaulLogs &&
                    truckingMaterialHaulLogs.length > 0 ? (
                      <TimeCardTruckingMaterialLogs
                        truckingMaterialHaulLogs={truckingMaterialHaulLogs}
                        edit={edit}
                        setEdit={setEdit}
                        manager={manager}
                      />
                    ) : (
                      <Holds className="row-start-2 row-end-7 h-full justify-center items-center">
                        <Texts size="p6" className="text-gray-500 italic">
                          No trucking material haul data available
                        </Texts>
                      </Holds>
                    )}
                  </>
                )}
                {timeSheetFilter === "truckingRefuelLogs" && (
                  <>
                    {truckingRefuelLogs.length > 0 ? (
                      <TimeCardTruckingRefuelLogs
                        truckingRefuelLogs={truckingRefuelLogs}
                        edit={edit}
                        setEdit={setEdit}
                        manager={manager}
                      />
                    ) : (
                      <Holds className="row-start-2 row-end-7 h-full justify-center items-center">
                        <Texts size="p6" className="text-gray-500 italic">
                          No Refuel data available
                        </Texts>
                      </Holds>
                    )}
                  </>
                )}
                {timeSheetFilter === "truckingStateLogs" && (
                  <>
                    {truckingStateLogs.length > 0 ? (
                      <TimeCardTruckingStateMileageLogs
                        truckingStateLogs={truckingStateLogs}
                        edit={edit}
                        setEdit={setEdit}
                        manager={manager}
                      />
                    ) : (
                      <Holds className="row-start-2 row-end-7 h-full justify-center items-center">
                        <Texts size="p6" className="text-gray-500 italic">
                          No state mileage data available
                        </Texts>
                      </Holds>
                    )}
                  </>
                )}
                {timeSheetFilter === "tascoHaulLogs" && (
                  <>
                    {truckingStateLogs.length > 0 ? (
                      <TimeCardTascoHaulLogs
                        tascoHaulLogs={tascoHaulLogs}
                        edit={edit}
                        setEdit={setEdit}
                        manager={manager}
                      />
                    ) : (
                      <Holds className="row-start-2 row-end-7 h-full justify-center items-center">
                        <Texts size="p6" className="text-gray-500 italic">
                          No Tasco Hauling Logs
                        </Texts>
                      </Holds>
                    )}
                  </>
                )}
                {timeSheetFilter === "tascoRefuelLogs" && (
                  <>
                    {truckingStateLogs.length > 0 ? (
                      <TimeCardTascoRefuelLogs
                        tascoRefuelLog={tascoRefuelLog}
                        edit={edit}
                        setEdit={setEdit}
                        manager={manager}
                      />
                    ) : (
                      <Holds className="row-start-2 row-end-7 h-full justify-center items-center">
                        <Texts size="p6" className="text-gray-500 italic">
                          No Tasco Fueling Logs
                        </Texts>
                      </Holds>
                    )}
                  </>
                )}
                {timeSheetFilter === "equipmentLogs" && (
                  <>
                    {truckingStateLogs.length > 0 ? (
                      <TimeCardEquipmentLogs
                        equipmentLogs={equipmentLogs}
                        edit={edit}
                        setEdit={setEdit}
                        manager={manager}
                      />
                    ) : (
                      <Holds className="row-start-2 row-end-7 h-full justify-center items-center">
                        <Texts size="p6" className="text-gray-500 italic">
                          No Equipment Logs
                        </Texts>
                      </Holds>
                    )}
                  </>
                )}
              </Holds>
            )}
          </Contents>
        </Holds>
      </Grids>
    </>
  );
};
