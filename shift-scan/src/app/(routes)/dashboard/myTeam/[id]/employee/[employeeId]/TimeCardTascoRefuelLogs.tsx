import { Buttons } from "@/components/(reusable)/buttons";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Inputs } from "@/components/(reusable)/inputs";
import { Texts } from "@/components/(reusable)/texts";
import { Titles } from "@/components/(reusable)/titles";
import { TascoRefuelLog, TascoRefuelLogData } from "@/lib/types";
import { useEffect, useState } from "react";

type TimeCardTruckingStateMileageLogsProps = {
  edit: boolean;
  setEdit: (edit: boolean) => void;
  manager: string;
  tascoRefuelLog: TascoRefuelLogData;
};

export default function TimeCardTascoRefuelLogs({
  edit,
  setEdit,
  manager,
  tascoRefuelLog,
}: TimeCardTruckingStateMileageLogsProps) {
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
      }))
    );

  const [editedTascoRefuelLogs, setEditedTascoRefuelLogs] =
    useState(allTascoLogs);

  useEffect(() => {
    setEditedTascoRefuelLogs(allTascoLogs);
  }, [tascoRefuelLog]);

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

              {editedTascoRefuelLogs.map((sheet) => (
                <Holds
                  key={sheet.id}
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
                          value={sheet.truckName}
                          disabled
                          className="w-full h-full border-none rounded-none  rounded-tl-md rounded-bl-md py-2 text-xs "
                        />
                      </Holds>
                      <Holds className="col-start-2 col-end-3 w-full h-full border-l-[3px] border-black">
                        <Inputs
                          value={sheet.gallonsRefueled}
                          disabled
                          className="w-full h-full border-none rounded-none  rounded-tr-md rounded-br-md py-2 text-xs text-center"
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
