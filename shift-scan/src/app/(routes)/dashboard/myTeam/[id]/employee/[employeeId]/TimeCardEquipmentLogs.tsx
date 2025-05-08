"use client";
import { Buttons } from "@/components/(reusable)/buttons";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Inputs } from "@/components/(reusable)/inputs";
import { Texts } from "@/components/(reusable)/texts";
import { Titles } from "@/components/(reusable)/titles";
import { EquipmentLogsData, ProcessedEquipmentLog } from "@/lib/types";
import { differenceInHours, differenceInMinutes, format, parse } from "date-fns";
import { useEffect, useState, useCallback } from "react";

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
  const [changesWereMade, setChangesWereMade] = useState(false);

  const processLogs = useCallback(() => {
    const allEquipmentLogs = equipmentLogs
      .flatMap((log) => log.EmployeeEquipmentLogs)
      .filter((log) => log.Equipment !== null && log.startTime && log.endTime);

    const processed = allEquipmentLogs
      .map((log) => {
        try {
          const start = parse(log.startTime!, "yyyy-MM-dd HH:mm:ss", new Date());
          const end = parse(log.endTime!, "yyyy-MM-dd HH:mm:ss", new Date());

          const durationMinutes = differenceInMinutes(end, start);
          const durationHours = differenceInHours(end, start);
          const remainingMinutes = durationMinutes % 60;

          const startTimeValue = format(start, "HH:mm");
          const endTimeValue = format(end, "HH:mm");

          return {
            id: log.id,
            equipmentId: log.Equipment!.id,
            equipmentName: log.Equipment!.name,
            usageTime: `${durationHours > 0 ? `${durationHours} hrs ` : ""}${remainingMinutes} min`,
            startTime: startTimeValue,
            endTime: endTimeValue,
            jobsite: log.Jobsite?.name || "N/A",
            fullStartTime: log.startTime!,
            fullEndTime: log.endTime!,
            originalStart: start,
            originalEnd: end,
          };
        } catch (error) {
          console.error("Error processing log:", error);
          return null;
        }
      })
      .filter((log): log is ProcessedEquipmentLog => log !== null);

    setEditedEquipmentLogs(processed);
  }, [equipmentLogs]);

  // Reset when edit mode is turned off or when new data comes in
  useEffect(() => {
    if (!edit) {
      processLogs();
      setChangesWereMade(false);
    }
  }, [edit, equipmentLogs, processLogs]);

  const handleTimeChange = useCallback(
    (id: string, field: 'startTime' | 'endTime', timeString: string) => {
      const updatedLogs = editedEquipmentLogs.map(log => {
        if (log.id === id) {
          try {
            // Parse the new time while keeping the original date
            const datePart = format(log.originalStart, "yyyy-MM-dd");
            const newDateTime = parse(`${datePart} ${timeString}`, "yyyy-MM-dd HH:mm", new Date());
            
            // Calculate new duration
            const start = field === 'startTime' ? newDateTime : log.originalStart;
            const end = field === 'endTime' ? newDateTime : log.originalEnd;
            
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

      setChangesWereMade(true);
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
                <Holds
                  key={log.id}
                  className="border-black border-[3px] rounded-lg bg-white mb-2"
                >
                  <Buttons
                    shadow={"none"}
                    background={"none"}
                    className="w-full h-full text-left"
                  >
                    <Grids cols={"4"} className="w-full h-full">
                      <Holds className="col-start-1 col-end-3 w-full h-full">
                        <Inputs
                          value={log.equipmentName}
                          disabled={true} // Equipment name should not be editable
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
                              onChange={(e) => handleTimeChange(log.id, 'startTime', e.target.value)}
                              disabled={!edit}
                              className="text-xs border-none h-full rounded-none justify-center text-center"
                            />
                          </Holds>
                          <Holds className="col-start-4 col-end-5 w-full h-full border-l-black border-l-[3px]">
                            <Inputs
                              type="time"
                              value={log.endTime}
                              onChange={(e) => handleTimeChange(log.id, 'endTime', e.target.value)}
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