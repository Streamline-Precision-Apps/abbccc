"use client";
import { Buttons } from "@/components/(reusable)/buttons";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Inputs } from "@/components/(reusable)/inputs";
import { Texts } from "@/components/(reusable)/texts";
import { Titles } from "@/components/(reusable)/titles";
import { TruckingMileage } from "@/lib/types";
import { useEffect, useState } from "react";

type TimeCardTruckingMileageProps = {
  edit: boolean;
  setEdit: (edit: boolean) => void;
  manager: string;
  truckingMileage: TruckingMileage[];
};

export default function TimeCardTruckingMileage({
  edit,
  setEdit,
  manager,
  truckingMileage,
}: TimeCardTruckingMileageProps) {
  const [editedTruckingMileage, setEditedTruckingMileage] =
    useState<TruckingMileage[]>(truckingMileage);

  const handleMileageChange = (
    id: string,
    field: keyof TruckingMileage,
    value: string | number
  ) => {
    setEditedTruckingMileage((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  useEffect(() => {
    setEditedTruckingMileage(truckingMileage);
  }, [truckingMileage]);

  const isEmptyData =
    editedTruckingMileage.length === 1 &&
    !editedTruckingMileage[0].startingMileage &&
    !editedTruckingMileage[0].endingMileage;

  return (
    <Holds className="w-full h-full">
      <Grids rows={"7"}>
        {/* Timesheet Editing Section */}
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
                  <Titles position={"right"} size={"h6"}>
                    Start
                  </Titles>
                </Holds>
                <Holds className="col-start-4 col-end-5 w-full h-full pr-1">
                  <Titles position={"right"} size={"h6"}>
                    End
                  </Titles>
                </Holds>
              </Grids>

              {editedTruckingMileage?.map((sheet) => (
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
                      <Holds className="col-start-1 col-end-3 p-2">
                        <Inputs
                          type={"text"}
                          value={sheet.Equipment?.name || ""}
                          className="text-xs border-none h-full rounded-none justify-center"
                          disabled={!edit}
                          onChange={(e) =>
                            handleMileageChange(
                              sheet.id,
                              "Equipment",
                              e.target.value
                            )
                          }
                        />
                      </Holds>
                      <Holds className="col-start-3 col-end-4 border-x-[3px] border-black h-full">
                        <Holds className="h-full justify-center">
                          <Inputs
                            type={"number"}
                            value={sheet.startingMileage}
                            className="text-xs border-none h-full rounded-none justify-center"
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
                            className="text-xs border-none h-full rounded-none justify-center text-right"
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
