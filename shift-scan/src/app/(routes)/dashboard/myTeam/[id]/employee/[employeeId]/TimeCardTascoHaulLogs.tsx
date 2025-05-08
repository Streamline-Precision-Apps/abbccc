"use client";
import { Buttons } from "@/components/(reusable)/buttons";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Inputs } from "@/components/(reusable)/inputs";
import { Texts } from "@/components/(reusable)/texts";
import { Titles } from "@/components/(reusable)/titles";
import { TascoHaulLogData, TascoHaulLogs } from "@/lib/types";
import { useEffect, useState, useCallback } from "react";

type TimeCardTascoHaulLogsProps = {
  edit: boolean;
  manager: string;
  tascoHaulLogs: TascoHaulLogData;
  onDataChange: (data: typeof allTascoHaulLogs) => void;
};

export default function TimeCardTascoHaulLogs({
  edit,
  manager,
  tascoHaulLogs,
  onDataChange,
}: TimeCardTascoHaulLogsProps) {
  const allTascoHaulLogs = tascoHaulLogs
    .flatMap((log) => log.TascoLogs)
    .filter(
      (log): log is TascoHaulLogs => log !== null && log?.id !== undefined
    );

  const [editedTascoHaulLogs, setEditedTascoHaulLogs] = useState(allTascoHaulLogs);
  const [changesWereMade, setChangesWereMade] = useState(false);

  // Reset when edit mode is turned off or when new data comes in
  useEffect(() => {
    if (!edit) {
      setEditedTascoHaulLogs(allTascoHaulLogs);
      setChangesWereMade(false);
    }
  }, [edit, tascoHaulLogs]);

  const handleTascoHaulChange = useCallback(
    (id: string, field: keyof TascoHaulLogs, value: string | number) => {
      const updatedLogs = editedTascoHaulLogs.map(log => {
        if (log.id === id) {
          return { 
            ...log, 
            [field]: field === 'LoadQuantity' ? 
              (value ? Number(value) : null) : 
              value 
          };
        }
        return log;
      });

      setChangesWereMade(true);
      setEditedTascoHaulLogs(updatedLogs);
      onDataChange(updatedLogs);
    },
    [editedTascoHaulLogs, onDataChange]
  );

  const isEmptyData = editedTascoHaulLogs.length === 0;

  return (
    <Holds className="w-full h-full">
      <Grids rows={"7"}>
        <Holds className="row-start-1 row-end-8 overflow-y-scroll no-scrollbar h-full w-full">
          {!isEmptyData ? (
            <>
              <Grids cols={"2"} className="w-full h-fit mb-1">
                <Holds className="col-start-1 col-end-2 w-full h-full pr-1">
                  <Titles position={"left"} size={"h6"}>
                    Shift Type & Equipment ID
                  </Titles>
                </Holds>
                <Holds className="col-start-2 col-end-3 w-full h-full pr-1">
                  <Titles position={"right"} size={"h6"}>
                    Material & loads
                  </Titles>
                </Holds>
              </Grids>

              {editedTascoHaulLogs.map((log) => (
                <Holds
                  key={log.id}
                  className="border-black border-[3px] rounded-lg bg-white mb-2"
                >
                  <Buttons
                    shadow={"none"}
                    background={"none"}
                    className="size-full"
                  >
                    <Grids cols={"2"} rows={"2"} className="w-full h-full">
                      <Holds className="size-full col-start-1 col-end-2 row-start-1 row-end-2 border-b-[3px] border-r-[3px] border-black">
                        <Inputs
                          value={log.shiftType}
                          onChange={(e) => 
                            handleTascoHaulChange(
                              log.id,
                              'shiftType',
                              e.target.value
                            )
                          }
                          disabled={!edit}
                          className="size-full text-xs text-center border-none rounded-none rounded-tl-md py-2"
                        />
                      </Holds>
                      <Holds className="size-full col-start-1 col-end-2 row-start-2 row-end-3 border-r-[3px] border-black">
                        <Inputs
                          value={log.equipmentId || "N/A"}
                          onChange={(e) => 
                            handleTascoHaulChange(
                              log.id,
                              'equipmentId',
                              e.target.value
                            )
                          }
                          disabled={!edit}
                          className="size-full text-xs text-center border-none rounded-none rounded-bl-md py-2"
                        />
                      </Holds>
                      <Holds className="size-full col-start-2 col-end-3 row-start-1 row-end-2 border-b-[3px] border-black">
                        <Inputs
                          value={log.materialType}
                          onChange={(e) => 
                            handleTascoHaulChange(
                              log.id,
                              'materialType',
                              e.target.value
                            )
                          }
                          disabled={!edit}
                          className="size-full text-xs text-center border-none rounded-none rounded-tr-md py-2"
                        />
                      </Holds>
                      <Holds className="size-full col-start-2 col-end-3 row-start-2 row-end-3">
                        <Inputs
                          type="number"
                          value={log.LoadQuantity?.toString() || ""}
                          onChange={(e) => 
                            handleTascoHaulChange(
                              log.id,
                              'LoadQuantity',
                              e.target.value
                            )
                          }
                          disabled={!edit}
                          className="size-full text-xs text-center border-none rounded-none rounded-br-md py-2"
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
                No Tasco Hauling Logs found
              </Texts>
            </Holds>
          )}
        </Holds>
      </Grids>
    </Holds>
  );
}