"use client";
import { Buttons } from "@/components/(reusable)/buttons";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Inputs } from "@/components/(reusable)/inputs";
import { Texts } from "@/components/(reusable)/texts";
import { Titles } from "@/components/(reusable)/titles";
import { TascoRefuelLog, TascoRefuelLogData } from "@/lib/types";
import { useEffect, useState, useCallback } from "react";

type TimeCardTascoRefuelLogsProps = {
  edit: boolean;
  manager: string;
  tascoRefuelLog: TascoRefuelLogData;
  onDataChange: (data: typeof allTascoLogs) => void;
};

export default function TimeCardTascoRefuelLogs({
  edit,
  manager,
  tascoRefuelLog,
  onDataChange,
}: TimeCardTascoRefuelLogsProps) {
  const allTascoLogs = tascoRefuelLog
    .flatMap((item) => item.TascoLogs)
    .filter(
      (log): log is TascoRefuelLog =>
        log !== null && log?.id !== undefined && log?.RefuelLogs !== undefined
    )
    .flatMap((log) =>
      log.RefuelLogs.map((refuel) => ({
        ...refuel,
        truckName: log.Equipment?.name || "No Equipment found",
        tascoLogId: log.id, // Add reference to parent log
      }))
    );

  const [editedTascoRefuelLogs, setEditedTascoRefuelLogs] = useState(allTascoLogs);
  const [changesWereMade, setChangesWereMade] = useState(false);

  // Reset when edit mode is turned off or when new data comes in
  useEffect(() => {
    if (!edit) {
      setEditedTascoRefuelLogs(allTascoLogs);
      setChangesWereMade(false);
    }
  }, [edit, tascoRefuelLog]);

  const handleRefuelChange = useCallback(
    (id: string, tascoLogId: string, field: keyof typeof allTascoLogs[0], value: string | number) => {
      const updatedLogs = editedTascoRefuelLogs.map(log => {
        if (log.id === id && log.tascoLogId === tascoLogId) {
          return { 
            ...log, 
            [field]: field === 'gallonsRefueled' ? 
              (value ? Number(value) : null) : 
              value 
          };
        }
        return log;
      });

      setChangesWereMade(true);
      setEditedTascoRefuelLogs(updatedLogs);
      onDataChange(updatedLogs);
    },
    [editedTascoRefuelLogs, onDataChange]
  );

  const isEmptyData = editedTascoRefuelLogs.length === 0;

  return (
    <Holds className="w-full h-full">
      <Grids rows={"7"}>
        <Holds className="row-start-1 row-end-7 overflow-y-scroll no-scrollbar h-full w-full">
          {!isEmptyData ? (
            <>
              <Grids cols={"2"} className="w-full h-fit mb-1">
                <Holds className="col-start-1 col-end-2 w-full h-full pr-1">
                  <Titles position={"left"} size={"h6"}>
                    Equipment ID
                  </Titles>
                </Holds>
                <Holds className="col-start-2 col-end-3 w-full h-full pr-1">
                  <Titles position={"right"} size={"h6"}>
                    Gallon Usage
                  </Titles>
                </Holds>
              </Grids>

              {editedTascoRefuelLogs.map((log) => (
                <Holds
                  key={`${log.tascoLogId}-${log.id}`}
                  className="border-black border-[3px] rounded-lg bg-white mb-2"
                >
                  <Buttons
                    shadow={"none"}
                    background={"none"}
                    className="w-full h-full text-left"
                  >
                    <Grids cols={"2"} className="w-full h-full">
                      <Holds className="col-start-1 col-end-2 w-full h-full">
                        <Inputs
                          value={log.truckName}
                          disabled={true} // Equipment name should not be editable
                          className="w-full h-full border-none rounded-none rounded-tl-md rounded-bl-md py-2 text-xs"
                          readOnly
                        />
                      </Holds>
                      <Holds className="col-start-2 col-end-3 w-full h-full border-l-[3px] border-black">
                        <Inputs
                          type="number"
                          value={log.gallonsRefueled?.toString() || ""}
                          onChange={(e) => 
                            handleRefuelChange(
                              log.id,
                              log.tascoLogId,
                              'gallonsRefueled',
                              e.target.value
                            )
                          }
                          disabled={!edit}
                          className="w-full h-full border-none rounded-none rounded-tr-md rounded-br-md py-2 text-xs text-center"
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
                No Tasco Fueling Logs found
              </Texts>
            </Holds>
          )}
        </Holds>
      </Grids>
    </Holds>
  );
}