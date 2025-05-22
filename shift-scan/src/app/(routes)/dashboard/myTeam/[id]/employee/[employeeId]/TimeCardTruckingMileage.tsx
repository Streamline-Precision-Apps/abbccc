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
import { useEffect, useState, useCallback } from "react";

interface TimeCardTruckingMileageProps {
  edit: boolean;
  manager: string;
  truckingMileage: TruckingMileageData;
  onDataChange: (data: TruckingMileageData) => void; // FIX: expects nested structure
}

export default function TimeCardTruckingMileage({
  edit,
  manager,
  truckingMileage,
  onDataChange,
}: TimeCardTruckingMileageProps) {
  // Use truckingMileage prop directly for rendering and updates
  const allTruckingLogs = truckingMileage
    .flatMap((item) => item.TruckingLogs)
    .filter(
      (log): log is TruckingMileage =>
        !!log && typeof log === "object" && "id" in log
    );

  const isEmptyData = allTruckingLogs.length === 0;

  // Handler to update the TruckingMileageData structure
  const handleMileageChange = (
    id: string,
    field: keyof TruckingMileageUpdate,
    value: any
  ) => {
    const updated = truckingMileage
      .map((item) => {
        const updatedLogs = item.TruckingLogs.map((log) => {
          if (log && log.id === id) {
            return { ...log, [field]: value };
          }
          return log;
        }).filter(
          (log): log is TruckingMileage =>
            !!log && typeof log === 'object' && 'id' in log
        );
        if (updatedLogs.length === 0) return null;
        // Use the id of the first log as the parent id (TruckingLog.id)
        return {
          id: updatedLogs[0].id,
          TruckingLogs: updatedLogs,
        };
      })
      .filter(
        (item): item is { id: string; TruckingLogs: TruckingMileage[] } =>
          !!item && item.TruckingLogs.length > 0 && !!item.id
      );

    onDataChange(updated);
  };

  return (
    <Holds className="w-full h-full">
      <Grids rows={"7"}>
        <Holds className="row-start-1 row-end-7 overflow-y-scroll no-scrollbar h-full w-full">
          {isEmptyData ? (
            <Holds className="w-full h-full flex items-center justify-center">
              <Texts size="p6" className="text-gray-500 italic">
                No trucking mileage data available
              </Texts>
            </Holds>
          ) : (
            <>
              <Grids cols={"4"} className="w-full h-fit">
                <Holds className="col-start-1 col-end-3 w-full h-full pl-1">
                  <Titles position={"left"} size={"h6"}>
                    Truck ID
                  </Titles>
                </Holds>
                <Holds className="col-start-3 col-end-4 w-full h-full pr-1">
                  <Titles position={"center"} size={"h6"}>
                    Start
                  </Titles>
                </Holds>
                <Holds className="col-start-4 col-end-5 w-full h-full pr-1">
                  <Titles position={"right"} size={"h6"}>
                    End
                  </Titles>
                </Holds>
              </Grids>

              {allTruckingLogs.map((sheet) => (
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
