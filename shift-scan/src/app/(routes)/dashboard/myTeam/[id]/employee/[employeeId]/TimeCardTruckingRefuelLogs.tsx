import { Buttons } from "@/components/(reusable)/buttons";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Inputs } from "@/components/(reusable)/inputs";
import { Texts } from "@/components/(reusable)/texts";
import { Titles } from "@/components/(reusable)/titles";
import { TruckingRefuelLog } from "@/lib/types";
import { useState } from "react";

type TimeCardTruckingRefuelLogsProps = {
  edit: boolean;
  setEdit: (edit: boolean) => void;
  manager: string;
  truckingRefuelLogs: TruckingRefuelLog[];
};

export default function TimeCardTruckingRefuelLogs({
  edit,
  setEdit,
  manager,
  truckingRefuelLogs,
}: TimeCardTruckingRefuelLogsProps) {
  const [editedTruckingHaulLogs, setEditedTruckingHaulLogs] =
    useState<TruckingRefuelLog[]>(truckingRefuelLogs);

  const isEmptyData =
    editedTruckingHaulLogs.length === 0 ||
    editedTruckingHaulLogs.every(
      (log) => !log.gallonsRefueled && !log.milesAtFueling && !log.truckingLogId
    );

  return (
    <Holds className="w-full h-full">
      <Grids rows={"7"}>
        <Holds className="row-start-1 row-end-7 overflow-y-scroll no-scrollbar h-full w-full">
          {!isEmptyData ? (
            <>
              <Grids cols={"4"} className="w-full h-fit">
                <Holds className="col-start-1 col-end-3 w-full h-full pr-1">
                  <Titles position={"center"} size={"h6"}>
                    Truck ID
                  </Titles>
                </Holds>
                <Holds className="col-start-3 col-end-4 w-full h-full pr-1">
                  <Titles position={"right"} size={"h6"}>
                    State
                  </Titles>
                </Holds>
                <Holds className="col-start-4 col-end-5 w-full h-full pr-1">
                  <Titles position={"right"} size={"h6"}>
                    Mileage
                  </Titles>
                </Holds>
              </Grids>

              {editedTruckingHaulLogs.map((sheet) => (
                <Holds
                  key={sheet.truckingLogId}
                  className="border-black border-[3px] rounded-lg bg-white mb-2"
                >
                  <Buttons
                    shadow={"none"}
                    background={"none"}
                    className="w-full h-full text-left"
                  >
                    <Grids cols={"3"} className="w-full h-full">
                      <Holds>
                        <Inputs
                          value={sheet.Equipment?.name}
                          onChange={(e) => {
                            const newTruckingHaulLogs =
                              editedTruckingHaulLogs.map((log) => {
                                if (log.id === sheet.id) {
                                  return {
                                    ...log,
                                    Equipment: {
                                      ...log.Equipment,
                                      name: e.target.value,
                                    },
                                  };
                                }
                                return log;
                              });
                            setEditedTruckingHaulLogs(newTruckingHaulLogs);
                          }}
                          disabled={!edit}
                          placeholder="Material"
                          className="w-full h-full"
                        />
                      </Holds>

                      <Holds>
                        <Inputs
                          value={sheet.gallonsRefueled}
                          onChange={(e) => {
                            const newTruckingHaulLogs =
                              editedTruckingHaulLogs.map((log) => {
                                if (log.id === sheet.id) {
                                  return {
                                    ...log,
                                    gallonsRefueled: Number(e.target.value),
                                  };
                                }
                                return log;
                              });
                            setEditedTruckingHaulLogs(newTruckingHaulLogs);
                          }}
                          disabled={!edit}
                          placeholder="Material"
                          className="w-full h-full"
                        />
                      </Holds>
                      <Holds>
                        <Inputs
                          value={sheet.milesAtFueling}
                          onChange={(e) => {
                            const newTruckingHaulLogs =
                              editedTruckingHaulLogs.map((log) => {
                                if (log.id === sheet.id) {
                                  return {
                                    ...log,
                                    milesAtFueling: Number(e.target.value),
                                  };
                                }
                                return log;
                              });
                            setEditedTruckingHaulLogs(newTruckingHaulLogs);
                          }}
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
