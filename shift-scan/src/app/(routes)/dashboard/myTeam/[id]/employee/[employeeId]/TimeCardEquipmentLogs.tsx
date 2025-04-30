import { Buttons } from "@/components/(reusable)/buttons";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Inputs } from "@/components/(reusable)/inputs";
import { Texts } from "@/components/(reusable)/texts";
import { Titles } from "@/components/(reusable)/titles";
import { EquipmentLogsData } from "@/lib/types";
import { useEffect, useState } from "react";

type TimeCardTruckingStateMileageLogsProps = {
  edit: boolean;
  setEdit: (edit: boolean) => void;
  manager: string;
  equipmentLogs: EquipmentLogsData;
};

export default function TimeCardEquipmentLogs({
  edit,
  setEdit,
  manager,
  equipmentLogs,
}: TimeCardTruckingStateMileageLogsProps) {
  const allEquipmentLogs = equipmentLogs
    .flatMap((log) => log.EmployeeEquipmentLogs)
    .filter((log) => log.Equipment !== null)
    .flatMap((log) => log.Equipment);
  const [editedEquipmentLogs, setEditedEquipmentLogs] =
    useState(allEquipmentLogs);

  useEffect(() => {
    setEditedEquipmentLogs(allEquipmentLogs);
  }, [equipmentLogs]);

  const isEmptyData = editedEquipmentLogs.length === 0;

  return (
    <Holds className="w-full h-full">
      <Grids rows={"7"}>
        <Holds className="row-start-1 row-end-7 overflow-y-scroll no-scrollbar h-full w-full">
          {!isEmptyData ? (
            <>
              <Grids cols={"5"} className="w-full h-fit">
                <Holds className="col-start-1 col-end-3 w-full h-full pr-1">
                  <Titles position={"left"} size={"h6"}>
                    Equipment ID
                  </Titles>
                </Holds>
                <Holds className="col-start-3 col-end-5 w-full h-full pr-1">
                  <Titles position={"center"} size={"h6"}>
                    Usage Time
                  </Titles>
                </Holds>
                <Holds className="col-start-5 col-end-6 w-full h-full pr-1">
                  <Titles position={"right"} size={"h6"}>
                    Refuel
                  </Titles>
                </Holds>
              </Grids>

              {editedEquipmentLogs.map((sheet) => (
                <Holds
                  key={sheet.id}
                  className="border-black border-[3px] rounded-lg bg-white mb-2"
                >
                  <Buttons
                    shadow={"none"}
                    background={"none"}
                    className="w-full h-full text-left"
                  >
                    <Grids cols={"5"} className="w-full h-full">
                      <Holds className="col-start-1 col-end-3 w-full h-full pr-1">
                        <Inputs
                          value={""}
                          disabled={true}
                          className="w-full h-full"
                        />
                      </Holds>
                      <Holds className="col-start-3 col-end-5 w-full h-full pr-1">
                        <Inputs
                          value={""}
                          disabled={true}
                          className="w-full h-full"
                        />
                      </Holds>
                      <Holds className="col-start-5 col-end-6 w-full h-full pr-1">
                        <Inputs
                          value={""}
                          disabled={true}
                          className="w-full h-full"
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
                No Equipment Logs found
              </Texts>
            </Holds>
          )}
        </Holds>
      </Grids>
    </Holds>
  );
}
