"use client";
import { Buttons } from "@/components/(reusable)/buttons";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Inputs } from "@/components/(reusable)/inputs";
import { Texts } from "@/components/(reusable)/texts";
import { Titles } from "@/components/(reusable)/titles";
import { EmployeeEquipmentLogWithRefuel } from "@/lib/types";
import { useEffect, useState, useCallback } from "react";

// Define the type for flattened refuel logs with equipment info
type EquipmentRefuelLog = {
  id: string;
  equipmentId: string;
  equipmentName: string;
  gallonsRefueled: number | null;
  employeeEquipmentLogId: string;
};

type TimeCardEquipmentRefuelLogsProps = {
  edit: boolean;
  manager: string;
  equipmentRefuelLogs: EmployeeEquipmentLogWithRefuel[] | null;
  onDataChange: (data: EquipmentRefuelLog[]) => void;
};

export default function TimeCardEquipmentRefuelLogs({
  edit,
  manager,
  equipmentRefuelLogs,
  onDataChange,
}: TimeCardEquipmentRefuelLogsProps) {
  // Flatten the logs to pair each RefuelLog with its Equipment
  const flattenRefuelLogs = useCallback(
    (logs: EmployeeEquipmentLogWithRefuel[]): EquipmentRefuelLog[] => {
      return logs.flatMap((log) =>
        log.RefuelLogs.map((refuel) => ({
          id: refuel.id,
          equipmentId: log.Equipment?.id || "",
          equipmentName: log.Equipment?.name || "",
          gallonsRefueled: refuel.gallonsRefueled,
          employeeEquipmentLogId: log.id,
        }))
      );
    },
    []
  );

  const [flattenedLogs, setFlattenedLogs] = useState<EquipmentRefuelLog[]>([]);
  const [changesWereMade, setChangesWereMade] = useState(false);

  // Reset when edit mode is turned off or when new data comes in
  useEffect(() => {
    if (equipmentRefuelLogs) {
      const filteredLogs = equipmentRefuelLogs.filter(
        (log) => log.RefuelLogs && log.RefuelLogs.length > 0
      );
      const newFlattenedLogs = flattenRefuelLogs(filteredLogs);
      
      if (!edit) {
        setFlattenedLogs(newFlattenedLogs);
        setChangesWereMade(false);
      } else if (!changesWereMade) {
        setFlattenedLogs(newFlattenedLogs);
      }
    } else {
      setFlattenedLogs([]);
    }
  }, [edit, equipmentRefuelLogs, flattenRefuelLogs, changesWereMade]);

  const handleRefuelChange = useCallback(
    (id: string, employeeEquipmentLogId: string, value: string) => {
      const updatedLogs = flattenedLogs.map(log => {
        if (log.id === id && log.employeeEquipmentLogId === employeeEquipmentLogId) {
          return {
            ...log,
            gallonsRefueled: value ? Number(value) : null
          };
        }
        return log;
      });

      setChangesWereMade(true);
      setFlattenedLogs(updatedLogs);
      onDataChange(updatedLogs);
    },
    [flattenedLogs, onDataChange]
  );

  const isEmptyData = flattenedLogs.length === 0;

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

                <Holds className="col-start-3 col-end-5 w-full h-full pr-1">
                  <Titles position={"center"} size={"h6"}>
                    Gallons Refueled
                  </Titles>
                </Holds>
              </Grids>

              {flattenedLogs.map((log) => (
                <Holds
                  key={`${log.employeeEquipmentLogId}-${log.id}`}
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
                          disabled={true}
                          className="text-xs border-none h-full rounded-none rounded-bl-md rounded-tl-md justify-center text-center pl-1"
                          readOnly
                        />
                      </Holds>

                      <Holds className="col-start-3 col-end-5 w-full h-full border-l-black border-l-[3px]">
                        <Inputs
                          type="number"
                          value={log.gallonsRefueled?.toString() || ""}
                          onChange={(e) => 
                            handleRefuelChange(
                              log.id,
                              log.employeeEquipmentLogId,
                              e.target.value
                            )
                          }
                          disabled={!edit}
                          className="text-xs border-none h-full rounded-none rounded-br-md rounded-tr-md justify-center text-center"
                        />
                      </Holds>
                    </Grids>
                  </Buttons>
                </Holds>
              ))}
            </>
          ) : (
            <Holds className="w-full h-full flex items-center justify-center">
              <Texts size="p6" className="text-gray-500 italic">
                No Equipment Refuel Logs Found
              </Texts>
            </Holds>
          )}
        </Holds>
      </Grids>
    </Holds>
  );
}