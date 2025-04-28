import { Buttons } from "@/components/(reusable)/buttons";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Inputs } from "@/components/(reusable)/inputs";
import { Texts } from "@/components/(reusable)/texts";
import { Titles } from "@/components/(reusable)/titles";
import {
  TruckingEquipmentHaulLog,
  TruckingEquipmentHaulLogData,
} from "@/lib/types";
import { useEffect, useState } from "react";

type TimeCardTruckingHaulLogsProps = {
  edit: boolean;
  setEdit: (edit: boolean) => void;
  manager: string;
  truckingEquipmentHaulLogs: TruckingEquipmentHaulLogData;
};

export default function TimeCardTruckingHaulLogs({
  edit,
  setEdit,
  manager,
  truckingEquipmentHaulLogs,
}: TimeCardTruckingHaulLogsProps) {
  // Extract all TruckingLogs with their EquipmentHauled items
  const allTruckingLogs = truckingEquipmentHaulLogs
    .flatMap((item) => item.TruckingLogs)
    .filter((log) => log?.id && log.EquipmentHauled?.length > 0);

  const [editedTruckingHaulLogs, setEditedTruckingHaulLogs] =
    useState<TruckingEquipmentHaulLog[]>(allTruckingLogs);

  useEffect(() => {
    setEditedTruckingHaulLogs(allTruckingLogs);
  }, [truckingEquipmentHaulLogs]);

  const isEmptyData = editedTruckingHaulLogs.length === 0;

  return (
    <Holds className="w-full h-full">
      <Grids rows={"7"}>
        <Holds className="row-start-1 row-end-7 overflow-y-scroll no-scrollbar h-full w-full">
          {!isEmptyData ? (
            <>
              <Grids cols={"3"} className="w-full h-fit">
                <Holds className="col-start-1 col-end-2 w-full h-full pl-1">
                  <Titles position={"left"} size={"h6"}>
                    Truck
                  </Titles>
                </Holds>
                <Holds className="col-start-2 col-end-3 w-full h-full pr-1">
                  <Titles position={"center"} size={"h6"}>
                    Hauled EQ
                  </Titles>
                </Holds>
                <Holds className="col-start-3 col-end-4 w-full h-full pr-1">
                  <Titles position={"right"} size={"h6"}>
                    Job Site
                  </Titles>
                </Holds>
              </Grids>

              {editedTruckingHaulLogs.flatMap((log) =>
                log.EquipmentHauled.map((hauledItem, index) => (
                  <Holds
                    key={`${log.id}-${index}`}
                    className="border-black border-[3px] rounded-lg bg-white mb-2"
                  >
                    <Buttons
                      shadow={"none"}
                      background={"none"}
                      className="w-full h-full text-left"
                    >
                      <Grids cols={"3"} className="w-full h-full">
                        <Holds className="col-start-1 col-end-2 ">
                          <Inputs
                            type={"text"}
                            value={log.Equipment?.name || ""}
                            className="text-xs border-none rounded-md h-full rounded-br-none rounded-tr-none p-3 text-left"
                            disabled={!edit}
                          />
                        </Holds>
                        <Holds className="col-start-2 col-end-3 border-x-[3px] border-black h-full">
                          <Inputs
                            type={"text"}
                            value={hauledItem.Equipment?.name || ""}
                            className="text-xs border-none h-full rounded-none justify-center text-center"
                            disabled={!edit}
                          />
                        </Holds>
                        <Holds className="col-start-3 col-end-4 h-full">
                          <Inputs
                            type={"text"}
                            value={hauledItem.JobSite?.name || ""}
                            className="text-xs border-none rounded-md h-full rounded-bl-none rounded-tl-none justify-center text-right"
                            disabled={!edit}
                          />
                        </Holds>
                      </Grids>
                    </Buttons>
                  </Holds>
                ))
              )}
            </>
          ) : (
            <Holds className="w-full h-full flex items-center justify-center">
              <Texts size="p6" className="text-gray-500 italic">
                No haul logs available
              </Texts>
            </Holds>
          )}
        </Holds>
      </Grids>
    </Holds>
  );
}
