"use client";
import { Buttons } from "@/components/(reusable)/buttons";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Inputs } from "@/components/(reusable)/inputs";
import { Texts } from "@/components/(reusable)/texts";
import { Titles } from "@/components/(reusable)/titles";
import { TruckingStateLog, TruckingStateLogData } from "@/lib/types";
import { useEffect, useState, useCallback } from "react";

type TimeCardTruckingStateMileageLogsProps = {
  edit: boolean;
  manager: string;
  truckingStateLogs: TruckingStateLogData;
  onDataChange: (data: ProcessedStateMileage[]) => void;
};

type ProcessedStateMileage = {
  id: string;
  state: string;
  stateLineMileage: number;
  truckName: string;
  equipmentId: string;
  truckingLogId: string;
};

export default function TimeCardTruckingStateMileageLogs({
  edit,
  manager,
  truckingStateLogs,
  onDataChange,
}: TimeCardTruckingStateMileageLogsProps) {
  // Process the data to combine state mileages with their truck info
  const allStateMileages = truckingStateLogs
    .flatMap((item) => item.TruckingLogs)
    .filter(
      (log): log is TruckingStateLog =>
        log !== null &&
        log?.Equipment !== undefined &&
        log?.StateMileages !== undefined
    )
    .flatMap((log, logIndex) =>
      log.StateMileages.map((mileage, mileageIndex) => ({
        id: `${logIndex}-${mileageIndex}`, // Generate a unique ID
        state: mileage.state,
        stateLineMileage: mileage.stateLineMileage,
        truckName: log.Equipment.name,
        equipmentId: log.Equipment.id,
        truckingLogId: `${logIndex}`, // Use logIndex as a temporary ID
      }))
    );

  const [editedStateMileages, setEditedStateMileages] = useState<ProcessedStateMileage[]>(allStateMileages);
  const [changesWereMade, setChangesWereMade] = useState(false);

  // Reset when edit mode is turned off or when new data comes in
  useEffect(() => {
    if (!edit) {
      setEditedStateMileages(allStateMileages);
      setChangesWereMade(false);
    }
  }, [edit, truckingStateLogs]);

  const handleStateMileageChange = useCallback(
    (id: string, truckingLogId: string, field: keyof ProcessedStateMileage, value: string | number) => {
      const updated = editedStateMileages.map(item => {
        if (item.id === id && item.truckingLogId === truckingLogId) {
          return { 
            ...item, 
            [field]: field === 'stateLineMileage' ? 
              (value ? Number(value) : 0) : 
              value 
          };
        }
        return item;
      });

      setChangesWereMade(true);
      setEditedStateMileages(updated);
      onDataChange(updated);
    },
    [editedStateMileages, onDataChange]
  );

  const isEmptyData = editedStateMileages.length === 0;

  return (
    <Holds className="w-full h-full">
      <Grids rows={"7"}>
        <Holds className="row-start-1 row-end-7 overflow-y-scroll no-scrollbar h-full w-full">
          {!isEmptyData ? (
            <>
              <Grids cols={"4"} className="w-full h-fit mb-1">
                <Holds className="col-start-1 col-end-3 w-full h-full pr-1">
                  <Titles position={"left"} size={"h6"}>
                    Truck ID
                  </Titles>
                </Holds>
                <Holds className="col-start-3 col-end-4 w-full h-full">
                  <Titles position={"center"} size={"h6"}>
                    State
                  </Titles>
                </Holds>
                <Holds className="col-start-4 col-end-5 w-full h-full pr-1">
                  <Titles position={"right"} size={"h6"}>
                    Mileage
                  </Titles>
                </Holds>
              </Grids>

              {editedStateMileages.map((mileage) => (
                <Holds
                  key={`${mileage.truckingLogId}-${mileage.id}`}
                  className="border-black border-[3px] rounded-lg bg-white mb-2"
                >
                  <Buttons
                    shadow={"none"}
                    background={"none"}
                    className="w-full h-full text-left"
                  >
                    <Grids cols={"4"} className="w-full h-full">
                      <Holds className="col-start-1 col-end-3 w-full h-full border-r-[3px] border-black">
                        <Inputs
                          value={mileage.truckName}
                          disabled={true}
                          className="w-full h-full border-none rounded-none rounded-tl-md rounded-bl-md text-left text-xs"
                          readOnly
                        />
                      </Holds>
                      <Holds className="col-start-3 col-end-4 w-full h-full">
                        <Inputs
                          value={mileage.state}
                          onChange={(e) => 
                            handleStateMileageChange(
                              mileage.id,
                              mileage.truckingLogId,
                              'state',
                              e.target.value
                            )
                          }
                          disabled={!edit}
                          className="w-full h-full border-none rounded-none text-center text-xs"
                        />
                      </Holds>
                      <Holds className="col-start-4 col-end-5 w-full h-full border-l-[3px] border-black">
                        <Inputs
                          type="number"
                          value={mileage.stateLineMileage?.toString() || ""}
                          onChange={(e) => 
                            handleStateMileageChange(
                              mileage.id,
                              mileage.truckingLogId,
                              'stateLineMileage',
                              e.target.value
                            )
                          }
                          disabled={!edit}
                          className="w-full h-full py-2 border-none rounded-none rounded-tr-md rounded-br-md text-right text-xs"
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
                No state mileage data available
              </Texts>
            </Holds>
          )}
        </Holds>
      </Grids>
    </Holds>
  );
}