"use client";
import { Buttons } from "@/components/(reusable)/buttons";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Inputs } from "@/components/(reusable)/inputs";
import { Texts } from "@/components/(reusable)/texts";
import { Titles } from "@/components/(reusable)/titles";
import { EquipmentLogsData, EmployeeEquipmentLog, JobsiteData } from "@/lib/types";
import { differenceInHours, differenceInMinutes, format, parse } from "date-fns";
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
  startTime: string;
  endTime: string;
  jobsite: string;
  fullStartTime: string | null;
  fullEndTime: string | null;
  originalStart: Date;
  originalEnd: Date;
};

type TimeCardEquipmentLogsProps = {
  edit: boolean;
  manager: string;
  equipmentLogs: EquipmentLogsData;
  onDataChange: (data: ProcessedEquipmentLog[]) => void;
};

export default function TimeCardEquipmentLogs({
  edit,
  manager,
  equipmentLogs,
  onDataChange,
}: TimeCardEquipmentLogsProps) {
  const [editedEquipmentLogs, setEditedEquipmentLogs] = useState<ProcessedEquipmentLog[]>([]);

  const processLogs = useCallback((): ProcessedEquipmentLog[] => {
    return equipmentLogs
      .flatMap((log) => log.EmployeeEquipmentLogs)
      .filter((log): log is ValidEquipmentLog => {
        return (
          log !== null &&
          log.Equipment !== null &&
          typeof log.Equipment?.id === "string" &&
          typeof log.Equipment?.name === "string" &&
          typeof log.startTime === "string" &&
          typeof log.endTime === "string"
        );
      })
      .map((log) => {
        const start = parse(log.startTime ?? "", "yyyy-MM-dd HH:mm:ss", new Date());
        const end = parse(log.endTime ?? "", "yyyy-MM-dd HH:mm:ss", new Date());

        const durationMinutes = differenceInMinutes(end, start);
        const durationHours = differenceInHours(end, start);
        const remainingMinutes = durationMinutes % 60;

        return {
          id: log.id,
          equipmentId: log.Equipment!.id,
          equipmentName: log.Equipment!.name,
          usageTime: `${durationHours > 0 ? `${durationHours} hrs ` : ""}${remainingMinutes} min`,
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
    if (!edit) {
      setEditedEquipmentLogs(processedLogs);
    } else if (editedEquipmentLogs.length === 0) {
      setEditedEquipmentLogs(processedLogs);
    }
  }, [edit, equipmentLogs, processLogs, editedEquipmentLogs.length]);

  const handleTimeChange = useCallback(
    (id: string, field: "startTime" | "endTime", timeString: string) => {
      const updatedLogs = editedEquipmentLogs.map((log) => {
        if (log.id === id) {
          try {
            const datePart = format(log.originalStart, "yyyy-MM-dd");
            const newDateTime = parse(`${datePart} ${timeString}`, "yyyy-MM-dd HH:mm", new Date());

            const start = field === "startTime" ? newDateTime : log.originalStart;
            const end = field === "endTime" ? newDateTime : log.originalEnd;

            const durationMinutes = differenceInMinutes(end, start);
            const durationHours = differenceInHours(end, start);
            const remainingMinutes = durationMinutes % 60;

            return {
              ...log,
              [field]: timeString,
              usageTime: `${durationHours > 0 ? `${durationHours} hrs ` : ""}${remainingMinutes} min`,
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
      onDataChange(updatedLogs);
    },
    [editedEquipmentLogs, onDataChange]
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
                    Equipment ID
                  </Titles>
                </Holds>
                {!edit ? (
                  <Holds className="col-start-3 col-end-5 w-full h-full">
                    <Titles position={"center"} size={"h6"}>
                      Duration
                    </Titles>
                  </Holds>
                ) : (
                  <>
                    <Holds className="col-start-3 col-end-4 w-full h-full pr-1">
                      <Titles position={"center"} size={"h6"}>
                        Start
                      </Titles>
                    </Holds>
                    <Holds className="col-start-4 col-end-5 w-full h-full pr-1">
                      <Titles position={"center"} size={"h6"}>
                        End
                      </Titles>
                    </Holds>
                  </>
                )}
              </Grids>

              {editedEquipmentLogs.map((log) => (
                <Holds key={log.id} className="border-black border-[3px] rounded-lg bg-white mb-2">
                  <Buttons shadow={"none"} background={"none"} className="w-full h-full text-left">
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
                              value={log.startTime}
                              onChange={(e) => handleTimeChange(log.id, "startTime", e.target.value)}
                              disabled={!edit}
                              className="text-xs border-none h-full rounded-none justify-center text-center"
                            />
                          </Holds>
                          <Holds className="col-start-4 col-end-5 w-full h-full border-l-black border-l-[3px]">
                            <Inputs
                              type="time"
                              value={log.endTime}
                              onChange={(e) => handleTimeChange(log.id, "endTime", e.target.value)}
                              disabled={!edit}
                              className="text-xs border-none h-full rounded-none rounded-br-md rounded-tr-md justify-center text-center"
                            />
                          </Holds>
                        </>
                      )}
                    </Grids>
                  </Buttons>
                </Holds>
              ))}
            </>
          ) : (
            <Holds className="w-full h-full flex items-center justify-center">
              <Texts size="p6" className="text-gray-500 italic">
                No Equipment Logs found
              </Texts>
            </Holds>
          )}
        </Holds>
      </Grids>
    </Holds>
  );
}
