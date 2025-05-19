"use client";
import { Buttons } from "@/components/(reusable)/buttons";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Inputs } from "@/components/(reusable)/inputs";
import { Texts } from "@/components/(reusable)/texts";
import { Titles } from "@/components/(reusable)/titles";
import {
  TruckingMileage,
  TruckingMileageData,
  TruckingMileageUpdate,
} from "@/lib/types";
import { useTranslations } from "next-intl";
import { useEffect, useState, useCallback } from "react";

interface TimeCardTruckingMileageProps {
  edit: boolean;
  manager: string;
  truckingMileage: TruckingMileageData;
  onDataChange: (data: TruckingMileageUpdate[]) => void; // Change this line
}

export default function TimeCardTruckingMileage({
  edit,
  manager,
  truckingMileage,
  onDataChange,
}: TimeCardTruckingMileageProps) {
  const allTruckingLogs = truckingMileage
    .flatMap((item) => item.TruckingLogs)
    .filter((log) => log !== null && log.id);
  const t = useTranslations("MyTeam.TimeCardTruckingMileage");
  const [editedTruckingLogs, setEditedTruckingLogs] =
    useState<TruckingMileage[]>(allTruckingLogs);
  const [changesWereMade, setChangesWereMade] = useState(false);

  // Reset when edit mode is turned off or when new data comes in
  useEffect(() => {
    setEditedTruckingLogs(allTruckingLogs);
    setChangesWereMade(false);
  }, [truckingMileage]);

  const handleMileageChange = useCallback(
    (id: string, field: keyof TruckingMileage, value: string | number) => {
      const updatedLogs = editedTruckingLogs.map((item) =>
        item.id === id
          ? {
              ...item,
              [field]: typeof value === "string" ? Number(value) : value,
            }
          : item
      );

      setChangesWereMade(true);
      setEditedTruckingLogs(updatedLogs);

      // Find the complete log that was changed
      const changedLog = updatedLogs.find((log) => log.id === id);
      if (changedLog) {
        onDataChange([
          {
            id: changedLog.id,
            startingMileage: changedLog.startingMileage,
            endingMileage: changedLog.endingMileage,
          },
        ]);
      }
    },
    [editedTruckingLogs, onDataChange]
  );

  const isEmptyData = allTruckingLogs.length === 0;

  return (
    <Holds className="w-full h-full">
      <Grids rows={"7"}>
        <Holds className="row-start-1 row-end-8 overflow-y-scroll no-scrollbar h-full w-full">
          {isEmptyData ? (
            <Holds className="w-full h-full flex items-center justify-center">
              <Texts size="p6" className="text-gray-500 italic">
                {t("NoTruckingMileageDataAvailable")}
              </Texts>
            </Holds>
          ) : (
            <>
              <Grids cols={"4"} className="w-full h-fit">
                <Holds className="col-start-1 col-end-3 w-full h-full pl-1">
                  <Titles position={"left"} size={"h6"}>
                    {t("TruckID")}
                  </Titles>
                </Holds>
                <Holds className="col-start-3 col-end-4 w-full h-full pr-1">
                  <Titles position={"center"} size={"h6"}>
                    {t("Start")}
                  </Titles>
                </Holds>
                <Holds className="col-start-4 col-end-5 w-full h-full pr-1">
                  <Titles position={"right"} size={"h6"}>
                    {t("End")}
                  </Titles>
                </Holds>
              </Grids>

              {editedTruckingLogs.map((sheet) => (
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
                      <Holds className="col-start-1 col-end-3 h-full w-full">
                        <Inputs
                          type={"text"}
                          value={sheet.Equipment?.name || ""}
                          className="text-xs border-none h-full w-full p-2.5 rounded-md rounded-tr-none rounded-br-none justify-center"
                          disabled={true} // Equipment name should not be editable
                          readOnly
                        />
                      </Holds>
                      <Holds className="col-start-3 col-end-4 border-x-[3px] border-black h-full">
                        <Holds className="h-full justify-center">
                          <Inputs
                            type={"number"}
                            value={sheet.startingMileage}
                            className="text-xs border-none h-full rounded-none justify-center p-2.5"
                            disabled={!edit}
                            onChange={(e) =>
                              handleMileageChange(
                                sheet.id,
                                "startingMileage",
                                Number(e.target.value)
                              )
                            }
                          />
                        </Holds>
                      </Holds>

                      <Holds className="col-start-4 col-end-5 h-full">
                        <Holds className="h-full justify-center">
                          <Inputs
                            type={"number"}
                            value={sheet.endingMileage || ""}
                            className="text-xs border-none h-full rounded-md rounded-tl-none rounded-bl-none justify-center text-right p-2.5"
                            disabled={!edit}
                            onChange={(e) =>
                              handleMileageChange(
                                sheet.id,
                                "endingMileage",
                                Number(e.target.value)
                              )
                            }
                          />
                        </Holds>
                      </Holds>
                    </Grids>
                  </Buttons>
                </Holds>
              ))}
            </>
          )}
        </Holds>
      </Grids>
    </Holds>
  );
}
