import { Buttons } from "@/components/(reusable)/buttons";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Inputs } from "@/components/(reusable)/inputs";
import { Texts } from "@/components/(reusable)/texts";
import { Titles } from "@/components/(reusable)/titles";
import {
  TruckingRefuel,
  TruckingRefuelLog,
  TruckingRefuelLogData,
} from "@/lib/types";
import { useEffect, useState } from "react";

type TimeCardTruckingRefuelLogsProps = {
  edit: boolean;
  setEdit: (edit: boolean) => void;
  manager: string;
  truckingRefuelLogs: TruckingRefuelLogData;
};

export default function TimeCardTruckingRefuelLogs({
  edit,
  setEdit,
  manager,
  truckingRefuelLogs,
}: TimeCardTruckingRefuelLogsProps) {
  // Get all trucking logs with their refuel logs
  const allTruckingLogs = truckingRefuelLogs
    .flatMap((item) => item.TruckingLogs)
    .filter(
      (log): log is TruckingRefuelLog =>
        log !== null && log?.id !== undefined && log?.RefuelLogs !== undefined
    )
    .flatMap((log) =>
      log.RefuelLogs.map((refuel) => ({
        ...refuel,
        truckName: log.Equipment?.name,
      }))
    );

  const [editedRefuelLogs, setEditedRefuelLogs] = useState(allTruckingLogs);

  useEffect(() => {
    setEditedRefuelLogs(allTruckingLogs);
  }, [truckingRefuelLogs]);

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
                  key={rl.id} // Fixed key to use both IDs
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
                          value={rl.truckName || ""}
                          disabled={!edit}
                          placeholder="Truck ID"
                          className=" pl-1 py-2 w-full h-full text-xs border-none rounded-none rounded-tl-md rounded-bl-md"
                        />
                      </Holds>

                      <Holds className="w-full h-full col-start-3 col-end-4  border-black">
                        <Inputs
                          value={rl.gallonsRefueled?.toString() || ""}
                          disabled={!edit}
                          className=" py-2 w-full h-full text-xs border-none rounded-none text-center"
                        />
                      </Holds>
                      <Holds className="w-full h-full col-start-4 col-end-5 border-l-[3px] border-black">
                        <Inputs
                          value={rl.milesAtFueling?.toString() || ""}
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
