"use client";

import { Holds } from "@/components/(reusable)/holds";
import { Labels } from "@/components/(reusable)/labels";
import { Inputs } from "@/components/(reusable)/inputs";
import { TextAreas } from "@/components/(reusable)/textareas";
import { Images } from "@/components/(reusable)/images";
import { Grids } from "@/components/(reusable)/grids";
import { TimeSheet } from "@/lib/types";
import { useState } from "react";
import { updateTimeSheets } from "@/actions/timeSheetActions";
import { Texts } from "@/components/(reusable)/texts";
import { Buttons } from "@/components/(reusable)/buttons";
import { formatTimeHHMM } from "@/utils/formatDateAmPm";
import { format, formatISO, parseISO } from "date-fns";
import { Contents } from "@/components/(reusable)/contents";

export default function EditWorkNew({
  timeSheet,
  edit,
  setEdit,
  manager,
}: {
  timeSheet: TimeSheet[];
  edit: boolean;
  setEdit: (edit: boolean) => void;
  manager: string;
}) {
  const [editedTimesheet, setEditedTimesheet] =
    useState<TimeSheet[]>(timeSheet);

  const [visibleSheetId, setVisibleSheetId] = useState<string | null>(null);

  const toggleVisibility = (id: string) => {
    setVisibleSheetId((prev) => (prev === id ? null : id));
  };
  // Handles input changes for each timesheet
  const handleInputChange = (
    id: string,
    field: keyof TimeSheet,
    value: string
  ) => {
    const updatedTimesheet = editedTimesheet.map((sheet) => {
      if (sheet.id === id) {
        if (field === "date") {
          return {
            ...sheet,
            [field]: value,
          };
        }
        if (field === "startTime" || field === "endTime") {
          // Parse the time as UTC and store as ISO string
          const datePart = new Date(sheet.submitDate);
          const [hours, minutes] = value.split(":").map(Number);
          // #Todo Fix this
          const date = format(
            new Date(new Date(datePart).setHours(hours, minutes, 0, 0)),
            "yyyy-MM-dd' 'HH:mm:ss"
          );
          console.log(date);
          return {
            ...sheet,
            [field]: date,
          };
        }
        return { ...sheet, [field]: value };
      }
      return sheet;
    });

    setEditedTimesheet(updatedTimesheet);
  };

  // Filters out updated timesheets by comparing original and edited states
  const getUpdatedSheets = (
    original: TimeSheet[],
    edited: TimeSheet[]
  ): TimeSheet[] => {
    return edited.filter((editedSheet) => {
      const originalSheet = original.find(
        (sheet) => sheet.id === editedSheet.id
      );

      if (!originalSheet) return false;

      return (
        editedSheet.date !== originalSheet.date ||
        editedSheet.startTime !== originalSheet.startTime ||
        editedSheet.endTime !== originalSheet.endTime ||
        editedSheet.workType !== originalSheet.workType ||
        editedSheet.comment !== originalSheet.comment ||
        editedSheet.location !== originalSheet.location
      );
    });
  };

  // Save changes
  const onSaveChanges = async () => {
    const updatedSheets = getUpdatedSheets(timeSheet, editedTimesheet);

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

  // Cancel edits and reset state
  const onCancelEdits = () => {
    setEditedTimesheet([...timeSheet]); // Reset editedTimesheet to the original timesheet
    setEdit(false);
  };

  return (
    <Holds className="w-full h-full">
      <Grids rows={"7"}>
        {/* Header for save/cancel/edit actions */}
        <Holds className="row-start-7 row-end-8 h-full  border-t-[1px] border-gray-100">
          {edit ? (
            <Holds position={"row"} className="justify-between my-auto ">
              <Holds
                background={"green"}
                className="w-1/4 ml-4 "
                onClick={onSaveChanges}
              >
                <Images
                  titleImg={"/save-edit.svg"}
                  titleImgAlt={"Save"}
                  size={"30"}
                />
              </Holds>
              <Holds
                background={"red"}
                className="w-1/4  mr-4"
                onClick={onCancelEdits}
              >
                <Images
                  titleImg={"/undo-edit.svg"}
                  titleImgAlt={"Cancel"}
                  size={"30"}
                />
              </Holds>
            </Holds>
          ) : (
            <Holds
              background={"orange"}
              className=" w-1/4 my-auto"
              onClick={() => setEdit(true)}
            >
              <Images
                titleImg={"/edit-form.svg"}
                titleImgAlt={"Edit"}
                size={"30"}
              />
            </Holds>
          )}
        </Holds>

        {/* Timesheet Editing Section */}
        <Holds className="row-start-1 row-end-7 overflow-y-scroll no-scrollbar h-full w-full p-3">
          {editedTimesheet.map((sheet) => (
            <Holds
              key={sheet.id}
              className="border mb-2 py-2 rounded-lg bg-white shadow-md"
            >
              <Buttons
                background={"none"}
                className="w-full h-full text-left font-semibold p-2  rounded"
                onClick={() => toggleVisibility(sheet.id)}
              >
                {sheet.startTime && sheet.endTime ? (
                  <Holds
                    position={"row"}
                    className="justify-center items-center gap-3"
                  >
                    <Texts size={"p4"}>
                      {sheet.startTime
                        ? formatTimeHHMM(new Date(sheet.startTime))
                        : ""}
                    </Texts>
                    <Texts className="text-xs"> - </Texts>
                    <Texts size={"p5"}>
                      {sheet.endTime
                        ? formatTimeHHMM(new Date(sheet.endTime))
                        : ""}
                    </Texts>
                    <Texts size={"p5"}>({sheet.workType})</Texts>
                  </Holds>
                ) : (
                  <Texts size={"p5"}> Incomplete Sheet </Texts>
                )}
                {/* Title */}
              </Buttons>
              {visibleSheetId === sheet.id && (
                <Holds>
                  <Contents width={"section"}>
                    <Holds position={"row"} className="gap-2">
                      <Holds>
                        <Labels size={"p6"} htmlFor="startTime">
                          Start Time
                        </Labels>
                        <Inputs
                          name="startTime"
                          type="time"
                          value={
                            sheet.startTime
                              ? format(sheet.startTime, "HH:mm")
                              : ""
                          }
                          onChange={(e) =>
                            handleInputChange(
                              sheet.id,
                              "startTime",
                              e.target.value
                            )
                          }
                          disabled={!edit}
                        />
                      </Holds>

                      <Holds>
                        <Labels size={"p6"} htmlFor="endTime">
                          End Time
                        </Labels>
                        <Inputs
                          name="endTime"
                          type="time"
                          value={
                            sheet.endTime ? format(sheet.endTime, "HH:mm") : ""
                          }
                          onChange={(e) =>
                            handleInputChange(
                              sheet.id,
                              "endTime",
                              e.target.value
                            )
                          }
                          disabled={!edit}
                        />
                      </Holds>
                    </Holds>

                    <Labels size={"p6"} htmlFor="workType">
                      Type of Labor
                    </Labels>
                    <Inputs
                      name="workType"
                      type="text"
                      value={sheet.workType || ""}
                      onChange={(e) =>
                        handleInputChange(sheet.id, "workType", e.target.value)
                      }
                      disabled={!edit}
                    />

                    <Labels size={"p6"}>Comment</Labels>
                    <TextAreas
                      name="comment"
                      value={sheet.comment || ""}
                      onChange={(e) =>
                        handleInputChange(sheet.id, "comment", e.target.value)
                      }
                      disabled={!edit}
                    />

                    <Labels size={"p6"}>Location of Shift</Labels>
                    <Inputs
                      name="location"
                      type="text"
                      value={sheet.location || ""}
                      onChange={(e) =>
                        handleInputChange(sheet.id, "location", e.target.value)
                      }
                      disabled={!edit}
                    />
                  </Contents>
                </Holds>
              )}
            </Holds>
          ))}
        </Holds>
      </Grids>
    </Holds>
  );
}
