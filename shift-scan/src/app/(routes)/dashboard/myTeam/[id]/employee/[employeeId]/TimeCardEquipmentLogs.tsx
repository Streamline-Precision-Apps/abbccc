import { Buttons } from "@/components/(reusable)/buttons";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Inputs } from "@/components/(reusable)/inputs";
import { Texts } from "@/components/(reusable)/texts";
import { Titles } from "@/components/(reusable)/titles";
import { EquipmentLogs } from "@/lib/types";
import { useState } from "react";

type TimeCardTruckingStateMileageLogsProps = {
  edit: boolean;
  setEdit: (edit: boolean) => void;
  manager: string;
  equipmentLogs: EquipmentLogs[];
};

export default function TimeCardEquipmentLogs({
  edit,
  setEdit,
  manager,
  equipmentLogs,
}: TimeCardTruckingStateMileageLogsProps) {
  const [editedEquipmentLogs, setEditedEquipmentLogs] =
    useState<EquipmentLogs[]>(equipmentLogs);

  const isEmptyData =
    editedEquipmentLogs.length === 0 ||
    (editedEquipmentLogs.length === 1 &&
      !editedEquipmentLogs[0].startTime &&
      !editedEquipmentLogs[0].endTime &&
      !editedEquipmentLogs[0].equipmentId &&
      !editedEquipmentLogs[0].jobsiteId &&
      !editedEquipmentLogs[0].id);

  return (
    <Holds className="w-full h-full">
      <Grids rows={"7"}>
        <Holds className="row-start-1 row-end-7 overflow-y-scroll no-scrollbar h-full w-full">
          {!isEmptyData ? (
            <>
              <Grids cols={"2"} className="w-full h-fit">
                <Holds className="col-start-1 col-end-2 w-full h-full pr-1">
                  <Titles position={"center"} size={"h6"}>
                    Material & Location
                  </Titles>
                </Holds>
                <Holds className="col-start-2 col-end-3 w-full h-full pr-1">
                  <Titles position={"right"} size={"h6"}>
                    Weight
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
                    <Grids cols={"3"} className="w-full h-full"></Grids>
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
