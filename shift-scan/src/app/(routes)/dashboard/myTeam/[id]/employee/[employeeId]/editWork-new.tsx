"use client";

import { Holds } from "@/components/(reusable)/holds";
import { Labels } from "@/components/(reusable)/labels";
import { Inputs } from "@/components/(reusable)/inputs";
import { TextAreas } from "@/components/(reusable)/textareas";
import { Images } from "@/components/(reusable)/images";
import { Grids } from "@/components/(reusable)/grids";
import { TimeSheet } from "@/lib/types";
import { Dispatch, SetStateAction, useState } from "react";
import { updateTimeSheets } from "@/actions/timeSheetActions";
import { Texts } from "@/components/(reusable)/texts";
import { Buttons } from "@/components/(reusable)/buttons";
import { formatTime } from "@/utils/formatDateAmPm";

export default function EditWorkNew({
  timesheet,
  edit,
  setEdit,
}: {
  timesheet: TimeSheet[];
  edit: boolean;
  setEdit: Dispatch<SetStateAction<boolean>>;
}) {
  const [editedTimesheet, setEditedTimesheet] =
    useState<TimeSheet[]>(timesheet);

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
        if (field === "startTime" || field === "endTime") {
          // Preserve the date part and update only the time part
          const originalDate = new Date(sheet[field] || Date.now()); // Use current date if no value exists
          const [hours, minutes] = value.split(":").map(Number); // Extract hours and minutes from the input value
          originalDate.setUTCHours(hours, minutes, 0, 0); // Update hours and minutes in UTC
          return { ...sheet, [field]: originalDate.toISOString() }; // Convert back to ISO string
        }
        return { ...sheet, [field]: value }; // For other fields, update as usual
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
    const updatedSheets = getUpdatedSheets(timesheet, editedTimesheet);

    if (updatedSheets.length > 0) {
      console.log("Updated Timesheets:", updatedSheets);
      // Add logic to persist changes to the backend
      await updateTimeSheets(updatedSheets);
      console.log("Timesheets updated successfully.");
    } else {
      console.log("No changes were made.");
    }

    setEdit(false);
  };

  // Cancel edits and reset state
  const onCancelEdits = () => {
    setEditedTimesheet([...timesheet]); // Reset editedTimesheet to the original timesheet
    setEdit(false);
  };

  return (
    <Holds>
      {/* Header for save/cancel/edit actions */}
      <Holds>
        {edit ? (
          <Holds position={"row"} className="justify-between">
            <Holds
              background={"green"}
              className="my-5 w-1/4 p-3"
              onClick={onSaveChanges}
            >
              <Images titleImg={"/save-edit.svg"} titleImgAlt={"Save"} />
            </Holds>
            <Holds
              background={"red"}
              className="my-5 w-1/4 p-3"
              onClick={onCancelEdits}
            >
              <Images titleImg={"/undo-edit.svg"} titleImgAlt={"Cancel"} />
            </Holds>
          </Holds>
        ) : (
          <Holds
            background={"orange"}
            className="my-5 w-1/4 p-3"
            onClick={() => setEdit(true)}
          >
            <Images titleImg={"/edit-form.svg"} titleImgAlt={"Edit"} />
          </Holds>
        )}
      </Holds>

      {/* Timesheet Editing Section */}
      <Holds>
        {editedTimesheet.map((sheet) => (
          <div
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
                      ? formatTime(new Date(sheet.startTime))
                      : ""}
                  </Texts>
                  <Texts size={"p4"}> - </Texts>
                  <Texts size={"p4"}>
                    {sheet.endTime ? formatTime(new Date(sheet.endTime)) : ""}
                  </Texts>
                  <Texts size={"p4"}>({sheet.workType})</Texts>
                </Holds>
              ) : (
                <Texts> Incomplete Sheet </Texts>
              )}
              {/* Title */}
            </Buttons>
            {visibleSheetId === sheet.id && (
              <div>
                <Holds>
                  <Labels size={"p6"} htmlFor="date">
                    Date of Shift
                  </Labels>
                  <Inputs
                    name="date"
                    type="date"
                    value={
                      sheet.date
                        ? new Date(sheet.date).toISOString().slice(0, 10)
                        : ""
                    }
                    onChange={(e) =>
                      handleInputChange(sheet.id, "date", e.target.value)
                    }
                    disabled={!edit}
                  />
                </Holds>

                <Grids rows={"5"} className="w-full h-full">
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
                            ? new Date(sheet.startTime)
                                .toISOString()
                                .slice(11, 16)
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
                          sheet.endTime
                            ? new Date(sheet.endTime)
                                .toISOString()
                                .slice(11, 16)
                            : ""
                        }
                        onChange={(e) =>
                          handleInputChange(sheet.id, "endTime", e.target.value)
                        }
                        disabled={!edit}
                      />
                    </Holds>
                  </Holds>

                  <Holds>
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
                  </Holds>

                  <Holds>
                    <Labels size={"p6"}>Comment</Labels>
                    <TextAreas
                      name="comment"
                      value={sheet.comment || ""}
                      onChange={(e) =>
                        handleInputChange(sheet.id, "comment", e.target.value)
                      }
                      disabled={!edit}
                    />
                  </Holds>

                  <Holds>
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
                  </Holds>
                </Grids>
              </div>
            )}
          </div>
        ))}
      </Holds>
    </Holds>
  );
}
