import { Buttons } from "@/components/(reusable)/buttons";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Inputs } from "@/components/(reusable)/inputs";
import { Texts } from "@/components/(reusable)/texts";
import { Titles } from "@/components/(reusable)/titles";
import {
  TascoHaulLogs,
  TruckingMaterialHaulLog,
  TruckingRefuelLog,
  TruckingStateLogs,
} from "@/lib/types";
import { useState } from "react";

type TimeCardTruckingStateMileageLogsProps = {
  edit: boolean;
  setEdit: (edit: boolean) => void;
  manager: string;
  tascoHaulLogs: TascoHaulLogs[];
};

export default function TimeCardTascoHaulLogs({
  edit,
  setEdit,
  manager,
  tascoHaulLogs,
}: TimeCardTruckingStateMileageLogsProps) {
  const [editedTascoHaulLogs, setEditedTascoHaulLogs] =
    useState<TascoHaulLogs[]>(tascoHaulLogs);

  const isEmptyData =
    editedTascoHaulLogs.length === 0 ||
    (editedTascoHaulLogs.length === 1 &&
      !editedTascoHaulLogs[0].LoadQuantity &&
      !editedTascoHaulLogs[0].TascoMaterialTypes &&
      !editedTascoHaulLogs[0].equipmentId);

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

              {editedTascoHaulLogs.map((sheet) => (
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
                No Tasco Hauling Logs found
              </Texts>
            </Holds>
          )}
        </Holds>
      </Grids>
    </Holds>
  );
}
