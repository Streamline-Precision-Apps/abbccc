import { Buttons } from "@/components/(reusable)/buttons";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Inputs } from "@/components/(reusable)/inputs";
import { Texts } from "@/components/(reusable)/texts";
import { Titles } from "@/components/(reusable)/titles";
import { EmployeeEquipmentLogWithRefuel } from "@/lib/types";
import { useEffect, useState } from "react";

type TimeCardTruckingStateMileageLogsProps = {
  edit: boolean;
  setEdit: (edit: boolean) => void;
  manager: string;
  equipmentRefuelLogs: EmployeeEquipmentLogWithRefuel[] | null;
};

// Define a new type for flattened refuel logs
type FlattenedRefuelLog = {
  equipmentId: string;
  equipmentName: string;
  refuelLog: {
    id: string;
    gallonsRefueled: number;
  };
};

export default function TimeCardEquipmentRefuelLogs({
  edit,
  setEdit,
  manager,
  equipmentRefuelLogs,
}: TimeCardTruckingStateMileageLogsProps) {
  // Flatten the logs to pair each RefuelLog with its Equipment
  const flattenRefuelLogs = (
    logs: EmployeeEquipmentLogWithRefuel[]
  ): FlattenedRefuelLog[] => {
    return logs.flatMap((log) =>
      log.RefuelLogs.map((refuel) => ({
        equipmentId: log.Equipment?.id || "",
        equipmentName: log.Equipment?.name || "",
        refuelLog: refuel,
      }))
    );
  };

  const allRefuelLogs = equipmentRefuelLogs?.filter(
    (log) => log.RefuelLogs && log.RefuelLogs.length > 0
  );

  const [flattenedLogs, setFlattenedLogs] = useState<FlattenedRefuelLog[]>(
    allRefuelLogs ? flattenRefuelLogs(allRefuelLogs) : []
  );

  useEffect(() => {
    if (equipmentRefuelLogs) {
      const filteredLogs = equipmentRefuelLogs.filter(
        (log) => log.RefuelLogs && log.RefuelLogs.length > 0
      );
      setFlattenedLogs(flattenRefuelLogs(filteredLogs));
    } else {
      setFlattenedLogs([]);
    }
  }, [equipmentRefuelLogs]);

  const isEmptyData = flattenedLogs.length === 0;

  return (
    <Holds className="w-full h-full">
      <Grids rows={"7"}>
        <Holds className="row-start-1 row-end-7 overflow-y-scroll no-scrollbar h-full w-full">
          {!isEmptyData ? (
            <>
              <Grids cols={"4"} className="w-full h-fit">
                <Holds className="col-start-1 col-end-3 w-full h-full">
                  <Titles position={"center"} size={"h6"}>
                    Equipment ID
                  </Titles>
                </Holds>

                <Holds className="col-start-3 col-end-5 w-full h-full pr-1">
                  <Titles position={"center"} size={"h6"}>
                    Gallons Refueled
                  </Titles>
                </Holds>
              </Grids>

              {flattenedLogs.map(({ equipmentName, refuelLog }) => (
                <Holds
                  key={refuelLog.id}
                  className="border-black border-[3px] rounded-lg bg-white mb-2"
                >
                  <Buttons
                    shadow={"none"}
                    background={"none"}
                    className="w-full h-full text-left"
                  >
                    <Grids cols={"4"} className="w-full h-full">
                      <Holds className="col-start-1 col-end-3 w-full h-full">
                        <Inputs
                          value={equipmentName}
                          disabled={!edit}
                          className="text-xs border-none h-full rounded-none rounded-bl-md rounded-tl-md justify-center text-center pl-1"
                        />
                      </Holds>

                      <Holds className="col-start-3 col-end-5 w-full h-full border-l-black border-l-[3px]">
                        <Inputs
                          value={refuelLog.gallonsRefueled}
                          disabled={!edit}
                          className="text-xs border-none h-full rounded-none rounded-br-md rounded-tr-md justify-center text-center"
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
                No Equipment Refuel Logs Found
              </Texts>
            </Holds>
          )}
        </Holds>
      </Grids>
    </Holds>
  );
}
