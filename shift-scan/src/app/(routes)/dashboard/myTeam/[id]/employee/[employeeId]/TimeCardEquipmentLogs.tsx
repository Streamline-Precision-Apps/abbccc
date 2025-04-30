import { Buttons } from "@/components/(reusable)/buttons";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Inputs } from "@/components/(reusable)/inputs";
import { Texts } from "@/components/(reusable)/texts";
import { Titles } from "@/components/(reusable)/titles";
import { EquipmentLogsData, ProcessedEquipmentLog } from "@/lib/types";
import { differenceInHours, differenceInMinutes, format } from "date-fns";
import { parse } from "date-fns/parse";
import { useEffect, useState } from "react";

type TimeCardTruckingStateMileageLogsProps = {
  edit: boolean;
  setEdit: (edit: boolean) => void;
  manager: string;
  equipmentLogs: EquipmentLogsData;
};

export default function TimeCardEquipmentLogs({
  edit,
  setEdit,
  manager,
  equipmentLogs,
}: TimeCardTruckingStateMileageLogsProps) {
  const [editedEquipmentLogs, setEditedEquipmentLogs] = useState<
    ProcessedEquipmentLog[]
  >([]);

  useEffect(() => {
    const processLogs = () => {
      const allEquipmentLogs = equipmentLogs
        .flatMap((log) => log.EmployeeEquipmentLogs)
        .filter(
          (log) => log.Equipment !== null && log.startTime && log.endTime
        );

      const processed = allEquipmentLogs
        .map((log) => {
          try {
            // Parse the datetime strings using date-fns
            const start = parse(
              log.startTime!,
              "yyyy-MM-dd HH:mm:ss",
              new Date()
            );
            const end = parse(log.endTime!, "yyyy-MM-dd HH:mm:ss", new Date());

            // Calculate duration using date-fns
            const durationMinutes = differenceInMinutes(end, start);
            const durationHours = differenceInHours(end, start);
            const remainingMinutes = durationMinutes % 60;

            // Format times for display
            const startTimeValue = format(start, "HH:mm");
            const endTimeValue = format(end, "HH:mm");

            return {
              id: log.id,
              equipmentId: log.Equipment!.id,
              equipmentName: log.Equipment!.name,
              usageTime: `${
                durationHours > 0 ? `${durationHours} hrs ` : ""
              }${remainingMinutes} min`,
              startTime: startTimeValue,
              endTime: endTimeValue,
              jobsite: log.Jobsite.name,
              fullStartTime: log.startTime!,
              fullEndTime: log.endTime!,
            };
          } catch (error) {
            console.error("Error processing log:", error);
            return null;
          }
        })
        .filter((log): log is ProcessedEquipmentLog => log !== null);

      setEditedEquipmentLogs(processed);
    };

    processLogs();
  }, [equipmentLogs]);

  const isEmptyData = editedEquipmentLogs.length === 0;

  return (
    <Holds className="w-full h-full">
      <Grids rows={"7"}>
        <Holds className="row-start-1 row-end-7 overflow-y-scroll no-scrollbar h-full w-full">
          {!isEmptyData ? (
            <>
              <Grids cols={"4"} className="w-full h-fit">
                <Holds className="col-start-1 col-end-3 w-full h-full ">
                  <Titles position={"center"} size={"h6"}>
                    Equipment ID
                  </Titles>
                </Holds>
                {!edit ? (
                  <>
                    <Holds className="col-start-3 col-end-5 w-full h-full ">
                      <Titles position={"center"} size={"h6"}>
                        Duration
                      </Titles>
                    </Holds>
                  </>
                ) : (
                  <>
                    <Holds className="col-start-3 col-end-4 w-full h-full pr-1 ">
                      <Titles position={"center"} size={"h6"}>
                        Start
                      </Titles>
                    </Holds>
                    <Holds className="col-start-4 col-end-5 w-full h-full pr-1 ">
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
                      <Holds className="col-start-1 col-end-3 w-full h-full ">
                        <Inputs
                          value={log.equipmentName}
                          disabled={!edit}
                          className="text-xs border-none h-full rounded-none rounded-bl-md rounded-tl-md  justify-center text-center pl-1"
                        />
                      </Holds>
                      {!edit ? (
                        <Holds className="col-start-3 col-end-5 w-full h-full border-l-black border-l-[3px] ">
                          <Inputs
                            value={log.usageTime}
                            disabled={!edit}
                            className="text-xs border-none h-full rounded-none rounded-br-md rounded-tr-md justify-center text-center"
                          />
                        </Holds>
                      ) : (
                        <>
                          <Holds className="col-start-3 col-end-4 w-full h-full border-l-black border-l-[3px]">
                            <Inputs
                              type="time"
                              value={log.startTime}
                              disabled={!edit}
                              className="text-xs border-none h-full rounded-none rounded-br-md rounded-tr-md justify-center text-center"
                            />
                          </Holds>
                          <Holds className="col-start-4 col-end-5 w-full h-full border-l-black border-l-[3px]">
                            <Inputs
                              type="time"
                              value={log.endTime}
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
