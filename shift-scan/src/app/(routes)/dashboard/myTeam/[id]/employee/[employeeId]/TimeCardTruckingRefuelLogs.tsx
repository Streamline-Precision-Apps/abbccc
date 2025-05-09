"use client";
import { Buttons } from "@/components/(reusable)/buttons";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Inputs } from "@/components/(reusable)/inputs";
import { Texts } from "@/components/(reusable)/texts";
import { Titles } from "@/components/(reusable)/titles";
import { TruckingRefuel, TruckingRefuelLog, TruckingRefuelLogData } from "@/lib/types";
import { useEffect, useState, useCallback } from "react";

// Define a type that extends TruckingRefuel with our additional properties
type ExtendedTruckingRefuel = TruckingRefuel & {
  truckName: string;
  truckingLogId: string;
};

type TimeCardTruckingRefuelLogsProps = {
  edit: boolean;
  manager: string;
  truckingRefuelLogs: TruckingRefuelLogData;
  onDataChange: (data: ExtendedTruckingRefuel[]) => void;
};

export default function TimeCardTruckingRefuelLogs({
  edit,
  manager,
  truckingRefuelLogs,
  onDataChange,
}: TimeCardTruckingRefuelLogsProps) {
  // Get all trucking logs with their refuel logs
  const allTruckingLogs: ExtendedTruckingRefuel[] = truckingRefuelLogs
    .flatMap((item) => item.TruckingLogs)
    .filter(
      (log): log is TruckingRefuelLog =>
        log !== null && log?.id !== undefined && log?.RefuelLogs !== undefined
    )
    .flatMap((log) =>
      log.RefuelLogs.map((refuel) => ({
        ...refuel,
        truckName: log.Equipment?.name || "Unknown",
        truckingLogId: log.id,
      }))
    );

  const [editedRefuelLogs, setEditedRefuelLogs] = useState<ExtendedTruckingRefuel[]>(allTruckingLogs);
  const [changesWereMade, setChangesWereMade] = useState(false);

  // Reset when edit mode is turned off or when new data comes in
  useEffect(() => {
    if (!edit) {
      setEditedRefuelLogs(allTruckingLogs);
      setChangesWereMade(false);
    }
  }, [edit, truckingRefuelLogs]);

  const handleRefuelChange = useCallback(
    (id: string, truckingLogId: string, field: keyof ExtendedTruckingRefuel, value: string | number | null) => {
      const updatedLogs = editedRefuelLogs.map(log => {
        if (log.id === id && log.truckingLogId === truckingLogId) {
          return { 
            ...log, 
            [field]: field === 'gallonsRefueled' || field === 'milesAtFueling' 
              ? (value ? Number(value) : null) 
              : value 
          };
        }
        return log;
      });

      setChangesWereMade(true);
      setEditedRefuelLogs(updatedLogs);
      onDataChange(updatedLogs);
    },
    [editedRefuelLogs, onDataChange]
  );

  const isEmptyData = allTruckingLogs.length === 0;

  return (
    <Holds className="w-full h-full">
      <Grids rows={"7"}>
        <Holds className="row-start-1 row-end-7 overflow-y-scroll no-scrollbar h-full w-full">
          {!isEmptyData ? (
            <>
              <Grids cols={"4"} className="w-full h-fit pb-1">
                <Holds className="col-start-1 col-end-3 w-full h-full pr-1">
                  <Titles position={"left"} size={"h6"}>
                    Truck ID
                  </Titles>
                </Holds>
                <Holds className="col-start-3 col-end-4 w-full h-full pr-1">
                  <Titles position={"center"} size={"h6"}>
                    Gallons
                  </Titles>
                </Holds>
                <Holds className="col-start-4 col-end-5 w-full h-full pr-1">
                  <Titles position={"right"} size={"h6"}>
                    Mileage
                  </Titles>
                </Holds>
              </Grids>

              {editedRefuelLogs.map((rl) => (
                <Holds
                  key={`${rl.truckingLogId}-${rl.id}`}
                  className="border-black border-[3px] rounded-lg bg-white mb-2"
                >
                  <Buttons
                    shadow={"none"}
                    background={"none"}
                    className="w-full h-full text-left"
                  >
                    <Grids cols={"4"} className="w-full h-full">
                      <Holds className="w-full h-full col-start-1 col-end-3 border-r-[3px] border-black">
                        <Inputs
                          value={rl.truckName}
                          disabled={true}
                          placeholder="Truck ID"
                          className="pl-1 py-2 w-full h-full text-xs border-none rounded-none rounded-tl-md rounded-bl-md"
                          readOnly
                        />
                      </Holds>

                      <Holds className="w-full h-full col-start-3 col-end-4 border-black">
                        <Inputs
                          type="number"
                          value={rl.gallonsRefueled?.toString() || ""}
                          onChange={(e) => 
                            handleRefuelChange(
                              rl.id,
                              rl.truckingLogId,
                              'gallonsRefueled',
                              e.target.value
                            )
                          }
                          disabled={!edit}
                          className="py-2 w-full h-full text-xs border-none rounded-none text-center"
                        />
                      </Holds>
                      <Holds className="w-full h-full col-start-4 col-end-5 border-l-[3px] border-black">
                        <Inputs
                          type="number"
                          value={rl.milesAtFueling?.toString() || ""}
                          onChange={(e) => 
                            handleRefuelChange(
                              rl.id,
                              rl.truckingLogId,
                              'milesAtFueling',
                              e.target.value
                            )
                          }
                          disabled={!edit}
                          className="py-2 pr-1 w-full h-full text-xs text-right border-none rounded-none rounded-tr-md rounded-br-md"
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
                No Refuel data available
              </Texts>
            </Holds>
          )}
        </Holds>
      </Grids>
    </Holds>
  );
}