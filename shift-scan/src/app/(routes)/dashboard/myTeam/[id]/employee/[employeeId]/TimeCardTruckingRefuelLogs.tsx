"use client";
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
import { useEffect, useState, useCallback } from "react";
import { useTranslations } from "next-intl";

// Define a type that extends TruckingRefuel with our additional properties
type ExtendedTruckingRefuel = TruckingRefuel & {
  truckName: string;
  truckingLogId: string;
};

type TimeCardTruckingRefuelLogsProps = {
  edit: boolean;
  manager: string;
  truckingRefuelLogs: TruckingRefuelLogData;
  onDataChange: (data: TruckingRefuelLogData) => void;
};

export default function TimeCardTruckingRefuelLogs({
  edit,
  manager,
  truckingRefuelLogs,
  onDataChange,
}: TimeCardTruckingRefuelLogsProps) {
  const t = useTranslations("MyTeam.TimeCardTruckingRefuelLogs");
  // Get all trucking logs with their refuel logs
  const allTruckingLogs: ExtendedTruckingRefuel[] = truckingRefuelLogs
    .flatMap((item) => item.TruckingLogs)
    .filter(
      (log): log is TruckingRefuelLog =>
        log !== null && log?.id !== undefined && log?.RefuelLogs !== undefined
    )
    .flatMap((log) =>
      log.RefuelLogs.map((refuel) => ({
        ...refuel,
        truckName: log.Equipment?.name || t("NoEquipmentFound"),
        truckingLogId: log.id,
      }))
    );

  const [editedRefuelLogs, setEditedRefuelLogs] =
    useState<ExtendedTruckingRefuel[]>(allTruckingLogs);
  const [changesWereMade, setChangesWereMade] = useState(false);

  // Reset when edit mode is turned off or when new data comes in
  useEffect(() => {
    setEditedRefuelLogs(allTruckingLogs);
    setChangesWereMade(false);
  }, [truckingRefuelLogs]);

  // Fix: Use the flat array for UI state, but update the nested structure for parent
  const handleRefuelChange = (
    truckingLogId: string,
    refuelId: string,
    field: string,
    value: any
  ) => {
    // Update the flat UI state
    setEditedRefuelLogs((prev) =>
      prev.map((rl) => (rl.id === refuelId ? { ...rl, [field]: value } : rl))
    );
    setChangesWereMade(true);

    // Update the nested structure for parent
    const updated = truckingRefuelLogs.map((item) => ({
      ...item,
      TruckingLogs: item.TruckingLogs.map((log) => {
        if (!log || log.id !== truckingLogId) return log;
        return {
          ...log,
          RefuelLogs: log.RefuelLogs.map((refuel) =>
            refuel.id === refuelId ? { ...refuel, [field]: value } : refuel
          ),
        };
      }),
    }));
    onDataChange(updated);
  };

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
                    {t("TruckID")}
                  </Titles>
                </Holds>
                <Holds className="col-start-3 col-end-4 w-full h-full pr-1">
                  <Titles position={"center"} size={"h6"}>
                    {t("Gallons")}
                  </Titles>
                </Holds>
                <Holds className="col-start-4 col-end-5 w-full h-full pr-1">
                  <Titles position={"right"} size={"h6"}>
                    {t("Mileage")}
                  </Titles>
                </Holds>
              </Grids>

              {editedRefuelLogs.map((rl) => (
                <Holds
                  key={`${rl.truckingLogId}-${rl.id}`}
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
                          value={rl.truckName}
                          disabled={true}
                          placeholder="Truck ID"
                          className="pl-1 py-2 w-full h-full text-xs border-none rounded-none rounded-tl-md rounded-bl-md"
                          readOnly
                        />
                      </Holds>

                      <Holds className="w-full h-full col-start-3 col-end-4 border-black">
                        <Inputs
                          type="number"
                          value={rl.gallonsRefueled?.toString() || ""}
                          onChange={(e) =>
                            handleRefuelChange(
                              rl.truckingLogId,
                              rl.id,
                              "gallonsRefueled",
                              e.target.value
                            )
                          }
                          disabled={!edit}
                          className="py-2 w-full h-full text-xs border-none rounded-none text-center"
                        />
                      </Holds>
                      <Holds className="w-full h-full col-start-4 col-end-5 border-l-[3px] border-black">
                        <Inputs
                          type="number"
                          value={rl.milesAtFueling?.toString() || ""}
                          onChange={(e) =>
                            handleRefuelChange(
                              rl.truckingLogId,
                              rl.id,
                              "milesAtFueling",
                              e.target.value
                            )
                          }
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
                {t("NoRefuelDataAvailable")}
              </Texts>
            </Holds>
          )}
        </Holds>
      </Grids>
    </Holds>
  );
}
