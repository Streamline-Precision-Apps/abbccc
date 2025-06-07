"use client";
import { Buttons } from "@/components/(reusable)/buttons";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Inputs } from "@/components/(reusable)/inputs";
import { Texts } from "@/components/(reusable)/texts";
import { Titles } from "@/components/(reusable)/titles";
import {
  EquipmentLogsData,
  EmployeeEquipmentLog,
  JobsiteData,
} from "@/lib/types";
import {
  differenceInHours,
  differenceInMinutes,
  format,
  parse,
} from "date-fns";
import { useTranslations } from "next-intl";
import { useEffect, useState, useCallback } from "react";

// Define a type that represents a valid equipment log with all required properties
type ValidEquipmentLog = EmployeeEquipmentLog & {
  Equipment: {
    id: string;
    name: string;
  };
  startTime: string;
  endTime: string;
  Jobsite: JobsiteData; // Add this line
};

type ProcessedEquipmentLog = {
  id: string;
  equipmentId: string;
  equipmentName: string;
  usageTime: string;
  startTime: string; // Display format (HH:mm)
  endTime: string; // Display format (HH:mm)
  jobsite: string;
  fullStartTime: string | null;
  fullEndTime: string | null;
  originalStart: Date; // Full DateTime for updates
  originalEnd: Date; // Full DateTime for updates
};

type EquipmentLogUpdate = {
  id: string;
  startTime?: Date;
  endTime?: Date;
};

// Add focusIds to props
type TimeCardEquipmentLogsProps = {
  edit: boolean;
  manager: string;
  equipmentLogs: EquipmentLogsData;
  onDataChange: (data: EquipmentLogUpdate[]) => void;
  focusIds: string[];
  setFocusIds: (ids: string[]) => void;
  isReviewYourTeam?: boolean;
};

export default function TimeCardEquipmentLogs({
  edit,
  manager,
  equipmentLogs,
  onDataChange,
  focusIds,
  setFocusIds,
  isReviewYourTeam,
}: TimeCardEquipmentLogsProps) {
  const t = useTranslations("MyTeam.TimeCardEquipmentLogs");

  // Add state to store local input values to prevent losing focus while typing
  const [inputValues, setInputValues] = useState<
    Record<string, string | number | null>
  >({});

  // Create a unique key for each input field
  const getInputKey = (logId: string, fieldName: string) => {
    return `${logId}-${fieldName}`;
  };

  // Get the current value from local state or use the original value
  const getDisplayValue = (
    logId: string,
    fieldName: string,
    originalValue: any
  ) => {
    const key = getInputKey(logId, fieldName);
    return key in inputValues ? inputValues[key] : originalValue;
  };

  // Update local state without triggering parent update (and thus avoiding re-render)
  const handleLocalChange = (logId: string, fieldName: string, value: any) => {
    setInputValues((prev) => ({
      ...prev,
      [getInputKey(logId, fieldName)]: value,
    }));
  };

  // Update parent state only when field loses focus (onBlur)
  const handleBlur = (logId: string, field: string) => {
    const key = getInputKey(logId, field);

    if (key in inputValues) {
      const value = inputValues[key];
      // Find the log and update it with the local value
      const log = editedEquipmentLogs.find((l) => l.id === logId);
      if (log) {
        if (field === "startTime" || field === "endTime") {
          handleTimeChange(logId, field, value as string);
        }
      }

      // Clear from local state to avoid duplicate processing
      setInputValues((prev) => {
        const newState = { ...prev };
        delete newState[key];
        return newState;
      });
    }
  };

  const [editedEquipmentLogs, setEditedEquipmentLogs] = useState<
    ProcessedEquipmentLog[]
  >([]);

  const processLogs = useCallback((): ProcessedEquipmentLog[] => {
    return equipmentLogs
      .flatMap((log) => log.EmployeeEquipmentLogs)
      .filter((log): log is ValidEquipmentLog => {
        return (
          log !== null &&
          typeof log?.Equipment?.id === "string" &&
          typeof log?.Equipment?.name === "string" &&
          typeof log?.startTime === "string" &&
          typeof log?.endTime === "string"
        );
      })
      .map((log) => {
        // Parse as UTC and convert to local time
        const startUTC = new Date(log.startTime + "Z");
        const endUTC = new Date(log.endTime + "Z");
        const start = new Date(
          startUTC.getTime() +
            startUTC.getTimezoneOffset() * 60000 -
            new Date().getTimezoneOffset() * 60000
        );
        const end = new Date(
          endUTC.getTime() +
            endUTC.getTimezoneOffset() * 60000 -
            new Date().getTimezoneOffset() * 60000
        );

        const durationMinutes = differenceInMinutes(end, start);
        const durationHours = differenceInHours(end, start);
        const remainingMinutes = durationMinutes % 60;

        return {
          id: log.id,
          equipmentId: log.Equipment!.id,
          equipmentName: log.Equipment!.name,
          usageTime: `${
            durationHours > 0 ? `${durationHours} hrs ` : ""
          }${remainingMinutes} min`,
          startTime: format(start, "HH:mm"),
          endTime: format(end, "HH:mm"),
          jobsite: log.Jobsite?.name || "N/A",
          fullStartTime: log.startTime,
          fullEndTime: log.endTime,
          originalStart: start,
          originalEnd: end,
        };
      });
  }, [equipmentLogs]);

  useEffect(() => {
    const processedLogs = processLogs();
    setEditedEquipmentLogs(processedLogs);
    if (editedEquipmentLogs.length === 0) {
      setEditedEquipmentLogs(processedLogs);
    }
  }, [equipmentLogs, processLogs, editedEquipmentLogs.length]);

  // If you use local state, sync it here
  // setEditedEquipmentLogs(equipmentLogs ?? []);

  const handleTimeChange = useCallback(
    (id: string, field: "startTime" | "endTime", timeString: string) => {
      const updatedLogs = editedEquipmentLogs.map((log) => {
        if (log.id === id) {
          try {
            const datePart = format(log.originalStart, "yyyy-MM-dd");
            const newDateTime = parse(
              `${datePart} ${timeString}`,
              "yyyy-MM-dd HH:mm",
              new Date()
            );
            const start =
              field === "startTime" ? newDateTime : log.originalStart;
            const end = field === "endTime" ? newDateTime : log.originalEnd;
            const durationMinutes = differenceInMinutes(end, start);
            const durationHours = differenceInHours(end, start);
            const remainingMinutes = durationMinutes % 60;
            return {
              ...log,
              [field]: timeString,
              usageTime: `${
                durationHours > 0 ? `${durationHours} hrs ` : ""
              }${remainingMinutes} min`,
              originalStart: start,
              originalEnd: end,
            };
          } catch (error) {
            console.error("Error updating time:", error);
            return log;
          }
        }
        return log;
      });
      setEditedEquipmentLogs(updatedLogs);

      // Reconstruct the nested EquipmentLogsData structure with updated times
      const updatedNested = equipmentLogs.map((group) => ({
        ...group,
        EmployeeEquipmentLogs: group.EmployeeEquipmentLogs.map((log) => {
          const updated = updatedLogs.find((l) => l.id === log.id);
          if (updated) {
            return {
              ...log,
              startTime: updated.originalStart
                .toISOString()
                .replace("T", " ")
                .slice(0, 19),
              endTime: updated.originalEnd
                .toISOString()
                .replace("T", " ")
                .slice(0, 19),
            };
          }
          return log;
        }),
      }));
      // Cast to any to satisfy the onDataChange signature, which expects EquipmentLogUpdate[]
      onDataChange(updatedNested as any);
    },
    [editedEquipmentLogs, equipmentLogs, onDataChange]
  );

  const isEmptyData = editedEquipmentLogs.length === 0;

  return (
    <Holds className="w-full h-full">
      <Grids rows={"7"}>
        <Holds className="row-start-1 row-end-7 overflow-y-scroll no-scrollbar h-full w-full">
          {!isEmptyData ? (
            <>
              <Grids cols={"4"} className="w-full h-fit">
                <Holds className="col-start-1 col-end-3 w-full h-full">
                  <Titles position={"center"} size={"h6"}>
                    {t("EquipmentID")}
                  </Titles>
                </Holds>
                {!edit ? (
                  <Holds className="col-start-3 col-end-5 w-full h-full">
                    <Titles position={"center"} size={"h6"}>
                      {t("Duration")}
                    </Titles>
                  </Holds>
                ) : (
                  <>
                    <Holds className="col-start-3 col-end-4 w-full h-full pr-1">
                      <Titles position={"center"} size={"h6"}>
                        {t("Start")}
                      </Titles>
                    </Holds>
                    <Holds className="col-start-4 col-end-5 w-full h-full pr-1">
                      <Titles position={"center"} size={"h6"}>
                        {t("End")}
                      </Titles>
                    </Holds>
                  </>
                )}
              </Grids>

              {/* For each row, if isReviewYourTeam is true, wrap in a button that toggles the id in focusIds */}
              {editedEquipmentLogs.map((log) => {
                const isFocused = focusIds.includes(log.id);
                const handleToggleFocus = () => {
                  if (isFocused) {
                    setFocusIds(focusIds.filter((id) => id !== log.id));
                  } else {
                    setFocusIds([...focusIds, log.id]);
                  }
                };
                return (
                  <Holds
                    key={log.id}
                    className={`relative border-black border-[3px] rounded-lg mb-2 ${
                      isFocused ? "bg-orange-400" : "bg-white"
                    } ${isReviewYourTeam ? "cursor-pointer" : ""}`}
                    onClick={isReviewYourTeam ? handleToggleFocus : undefined}
                  >
                    {isReviewYourTeam && (
                      <div
                        className="absolute top-0 left-0 w-full h-full z-10 cursor-pointer"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleToggleFocus();
                        }}
                      />
                    )}
                    <Buttons
                      shadow={"none"}
                      background={"none"}
                      className="w-full h-full text-left"
                    >
                      <Grids cols={"4"} className="w-full h-full">
                        <Holds className="col-start-1 col-end-3 w-full h-full">
                          <Inputs
                            value={log.equipmentName}
                            disabled={true}
                            className="text-xs border-none h-full rounded-none rounded-bl-md rounded-tl-md justify-center text-center pl-1"
                            readOnly
                          />
                        </Holds>
                        {!edit ? (
                          <Holds className="col-start-3 col-end-5 w-full h-full border-l-black border-l-[3px]">
                            <Inputs
                              value={log.usageTime}
                              disabled={true}
                              className="text-xs border-none h-full rounded-none rounded-br-md rounded-tr-md justify-center text-center"
                              readOnly
                            />
                          </Holds>
                        ) : (
                          <>
                            <Holds className="col-start-3 col-end-4 w-full h-full border-l-black border-l-[3px]">
                              <Inputs
                                type="time"
                                value={getDisplayValue(
                                  log.id,
                                  "startTime",
                                  log.startTime
                                )}
                                onChange={(e) =>
                                  handleLocalChange(
                                    log.id,
                                    "startTime",
                                    e.target.value
                                  )
                                }
                                onBlur={() => handleBlur(log.id, "startTime")}
                                disabled={!edit}
                                className="text-xs border-none h-full rounded-none justify-center text-center"
                              />
                            </Holds>
                            <Holds className="col-start-4 col-end-5 w-full h-full border-l-black border-l-[3px]">
                              <Inputs
                                type="time"
                                value={getDisplayValue(
                                  log.id,
                                  "endTime",
                                  log.endTime
                                )}
                                onChange={(e) =>
                                  handleLocalChange(
                                    log.id,
                                    "endTime",
                                    e.target.value
                                  )
                                }
                                onBlur={() => handleBlur(log.id, "endTime")}
                                disabled={!edit}
                                className="text-xs border-none h-full rounded-none rounded-br-md rounded-tr-md justify-center text-center"
                              />
                            </Holds>
                          </>
                        )}
                      </Grids>
                    </Buttons>
                  </Holds>
                );
              })}
            </>
          ) : (
            <Holds className="w-full h-full flex items-center justify-center">
              <Texts size="p6" className="text-gray-500 italic">
                {t("NoEquipmentLogsAvailable")}
              </Texts>
            </Holds>
          )}
        </Holds>
      </Grids>
    </Holds>
  );
}
