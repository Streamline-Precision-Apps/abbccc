import { Buttons } from "@/components/(reusable)/buttons";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Inputs } from "@/components/(reusable)/inputs";
import { Texts } from "@/components/(reusable)/texts";
import { Titles } from "@/components/(reusable)/titles";
import { TruckingEquipmentHaulLog } from "@/lib/types";
import { useEffect, useState } from "react";

type TimeCardTruckingHaulLogsProps = {
  edit: boolean;
  setEdit: (edit: boolean) => void;
  manager: string;
  truckingEquipmentHaulLogs: TruckingEquipmentHaulLog[];
};

export default function TimeCardTruckingHaulLogs({
  edit,
  setEdit,
  manager,
  truckingEquipmentHaulLogs,
}: TimeCardTruckingHaulLogsProps) {
  const [editedTruckingHaulLogs, setEditedTruckingHaulLogs] = useState<
    TruckingEquipmentHaulLog[]
  >(truckingEquipmentHaulLogs);

  const isEmptyData =
    editedTruckingHaulLogs.length === 0 ||
    (editedTruckingHaulLogs.length === 1 &&
      !editedTruckingHaulLogs[0].Equipment?.name &&
      !editedTruckingHaulLogs[0].EquipmentHauled?.Equipment?.name &&
      !editedTruckingHaulLogs[0].EquipmentHauled?.Jobsite?.name);

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
                    Equipment
                  </Titles>
                </Holds>
                <Holds className="col-start-3 col-end-4 w-full h-full pr-1">
                  <Titles position={"right"} size={"h6"}>
                    Jobsite
                  </Titles>
                </Holds>
              </Grids>

              {editedTruckingHaulLogs.map((sheet) => (
                <Holds
                  key={sheet.id}
                  className="border-black border-[3px] rounded-lg bg-white mb-2"
                >
                  <Buttons
                    shadow={"none"}
                    background={"none"}
                    className="w-full h-full text-left"
                  >
                    <Grids cols={"3"} className="w-full h-full">
                      <Holds className="col-start-1 col-end-2 p-2">
                        <Inputs
                          type={"text"}
                          value={sheet.Equipment?.name || ""}
                          className="text-xs border-none h-full rounded-none justify-center"
                          disabled={!edit}
                          onChange={(e) => {
                            const newEquipment = {
                              ...sheet.Equipment,
                              name: e.target.value,
                            };
                            setEditedTruckingHaulLogs((prev) =>
                              prev.map((item) =>
                                item.id === sheet.id
                                  ? { ...item, Equipment: newEquipment }
                                  : item
                              )
                            );
                          }}
                        />
                      </Holds>
                      <Holds className="col-start-2 col-end-3 border-x-[3px] border-black h-full">
                        <Inputs
                          type={"text"}
                          value={sheet.EquipmentHauled?.Equipment?.name || ""}
                          className="text-xs border-none h-full rounded-none justify-center"
                          disabled={!edit}
                          onChange={(e) => {
                            const newEquipment = {
                              ...sheet.EquipmentHauled,
                              Equipment: {
                                ...sheet.EquipmentHauled?.Equipment,
                                name: e.target.value,
                              },
                            };
                            setEditedTruckingHaulLogs((prev) =>
                              prev.map((item) =>
                                item.id === sheet.id
                                  ? { ...item, EquipmentHauled: newEquipment }
                                  : item
                              )
                            );
                          }}
                        />
                      </Holds>
                      <Holds className="col-start-3 col-end-4 h-full">
                        <Inputs
                          type={"text"}
                          value={sheet.EquipmentHauled?.Jobsite?.name || ""}
                          className="text-xs border-none h-full rounded-none justify-center text-right"
                          disabled={!edit}
                          onChange={(e) => {
                            const newEquipment = {
                              ...sheet.EquipmentHauled,
                              Jobsite: {
                                ...sheet.EquipmentHauled?.Jobsite,
                                name: e.target.value,
                              },
                            };
                            setEditedTruckingHaulLogs((prev) =>
                              prev.map((item) =>
                                item.id === sheet.id
                                  ? { ...item, EquipmentHauled: newEquipment }
                                  : item
                              )
                            );
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
                No haul logs available
              </Texts>
            </Holds>
          )}
        </Holds>
      </Grids>
    </Holds>
  );
}
