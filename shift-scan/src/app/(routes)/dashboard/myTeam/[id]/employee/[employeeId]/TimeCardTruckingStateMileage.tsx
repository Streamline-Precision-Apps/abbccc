import { Buttons } from "@/components/(reusable)/buttons";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Inputs } from "@/components/(reusable)/inputs";
import { Texts } from "@/components/(reusable)/texts";
import { Titles } from "@/components/(reusable)/titles";
import { TruckingStateLog, TruckingStateLogData } from "@/lib/types";
import { useEffect, useState } from "react";

type TimeCardTruckingStateMileageLogsProps = {
  edit: boolean;
  setEdit: (edit: boolean) => void;
  manager: string;
  truckingStateLogs: TruckingStateLogData;
};

export default function TimeCardTruckingStateMileageLogs({
  edit,
  setEdit,
  manager,
  truckingStateLogs,
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
    .flatMap((log) =>
      log.StateMileages.map((mileage) => ({
        ...mileage,
        truckName: log.Equipment.name,
        equipmentId: log.Equipment.id,
      }))
    );

  const [displayedStateMileages, setDisplayedStateMileages] =
    useState(allStateMileages);

  useEffect(() => {
    setDisplayedStateMileages(allStateMileages);
  }, [truckingStateLogs]);

  const isEmptyData = displayedStateMileages.length === 0;

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

              {displayedStateMileages.map((sheet) => (
                <Holds
                  key={sheet.id}
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
                          value={sheet.truckName}
                          disabled={!edit}
                          className="w-full h-full border-none rounded-none rounded-tl-md rounded-bl-md  text-left text-xs"
                        />
                      </Holds>
                      <Holds className="col-start-3 col-end-4 w-full h-full ">
                        <Inputs
                          value={sheet.state}
                          disabled={!edit}
                          className="w-full h-full border-none rounded-none text-center text-xs"
                        />
                      </Holds>
                      <Holds className="col-start-4 col-end-5 w-full h-full border-l-[3px] border-black">
                        <Inputs
                          value={sheet.stateLineMileage?.toString() || ""}
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
