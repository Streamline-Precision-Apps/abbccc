"use client";
import { Buttons } from "@/components/(reusable)/buttons";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Inputs } from "@/components/(reusable)/inputs";
import { Texts } from "@/components/(reusable)/texts";
import { Titles } from "@/components/(reusable)/titles";
import { TruckingMaterialHaulLog, TruckingMaterialHaulLogData } from "@/lib/types";
import { useEffect, useState, useCallback } from "react";

type TimeCardTruckingMaterialHaulLogsProps = {
  edit: boolean;
  manager: string;
  truckingMaterialHaulLogs: TruckingMaterialHaulLogData;
  onDataChange: (data: typeof allMaterials) => void;
};

export default function TimeCardTruckingMaterialLogs({
  edit,
  manager,
  truckingMaterialHaulLogs,
  onDataChange,
}: TimeCardTruckingMaterialHaulLogsProps) {
  const allMaterials = truckingMaterialHaulLogs
    .flatMap((item) => item.TruckingLogs)
    .filter(
      (log): log is TruckingMaterialHaulLog =>
        log !== null && log?.id !== undefined && log?.Materials !== undefined
    )
    .flatMap((log) =>
      log.Materials.map((material) => ({
        ...material,
        logId: log.id, // Keep reference to the parent log
      }))
    );

  const [editedMaterials, setEditedMaterials] = useState(allMaterials);
  const [changesWereMade, setChangesWereMade] = useState(false);

  // Reset when edit mode is turned off or when new data comes in
  useEffect(() => {
    if (!edit) {
      setEditedMaterials(allMaterials);
      setChangesWereMade(false);
    }
  }, [edit, truckingMaterialHaulLogs]);

  const handleMaterialChange = useCallback(
    (id: string, logId: string, field: keyof TruckingMaterialHaulLog['Materials'][0], value: string | number | null) => {
      const updated = editedMaterials.map(m => {
        if (m.id === id && m.logId === logId) {
          return { ...m, [field]: value };
        }
        return m;
      });
      
      setChangesWereMade(true);
      setEditedMaterials(updated);
      onDataChange(updated);
    },
    [editedMaterials, onDataChange]
  );

  const isEmptyData = editedMaterials.length === 0;

  return (
    <Holds className="w-full h-full">
      <Grids rows={"7"}>
        <Holds className="row-start-1 row-end-7 overflow-y-scroll no-scrollbar h-full w-full">
          {!isEmptyData ? (
            <>
              <Grids cols={"2"} className="w-full h-fit">
                <Holds className="col-start-1 col-end-2 w-full h-full pr-1">
                  <Titles position={"left"} size={"h6"}>
                    Material & Location
                  </Titles>
                </Holds>
                <Holds className="col-start-2 col-end-3 w-full h-full pr-1">
                  <Titles position={"right"} size={"h6"}>
                    Weight
                  </Titles>
                </Holds>
              </Grids>

              {editedMaterials.map((material) => (
                <Holds
                  key={`${material.logId}-${material.id}`}
                  background={"white"}
                  className="border-black border-[3px] rounded-lg mb-2"
                >
                  <Buttons
                    shadow={"none"}
                    background={"none"}
                    className="w-full h-full text-left"
                  >
                    <Grids cols={"2"} className="w-full h-full">
                      <Holds className="col-start-1 col-end-2 h-full border-r-[2px] border-black">
                        <Grids rows={"2"} className="w-full h-full rounded-none">
                          <Holds className="row-start-1 row-end-2 h-full rounded-none border-b-[1.5px] border-black">
                            <Inputs
                              value={material.name}
                              onChange={(e) => 
                                handleMaterialChange(
                                  material.id, 
                                  material.logId, 
                                  'name', 
                                  e.target.value
                                )
                              }
                              disabled={!edit}
                              placeholder="Material"
                              className="w-full h-full border-none rounded-none rounded-tl-md text-xs"
                            />
                          </Holds>
                          <Holds className="row-start-2 row-end-3 h-full border-t-[1.5px] border-black">
                            <Inputs
                              value={material.LocationOfMaterial}
                              onChange={(e) => 
                                handleMaterialChange(
                                  material.id, 
                                  material.logId, 
                                  'LocationOfMaterial', 
                                  e.target.value
                                )
                              }
                              disabled={!edit}
                              placeholder="Location"
                              className="w-full h-full border-none rounded-none rounded-bl-md text-xs"
                            />
                          </Holds>
                        </Grids>
                      </Holds>
                      <Holds className="col-start-2 col-end-3 border-l-[1.5px] border-black">
                        <Grids rows={"3"} className="w-full h-full">
                          <Holds
                            position={"row"}
                            className={`row-start-1 row-end-2 h-full rounded-none rounded-tr-md border-b-[2px] border-black ${
                              edit ? "bg-white" : "bg-app-gray"
                            }`}
                          >
                            <Titles position={"left"} size={"h7"} className="px-1">
                              Material
                            </Titles>
                            <Inputs
                              value={material.materialWeight?.toString() || ""}
                              onChange={(e) => 
                                handleMaterialChange(
                                  material.id, 
                                  material.logId, 
                                  'materialWeight', 
                                  e.target.value ? Number(e.target.value) : null
                                )
                              }
                              disabled={!edit}
                              placeholder="Material"
                              className="w-full h-full border-none rounded-none rounded-tr-md text-right text-xs"
                            />
                          </Holds>
                          <Holds
                            position={"row"}
                            className={`row-start-2 row-end-3 h-full rounded-none border-b-[2px] border-black ${
                              edit ? "bg-white" : "bg-app-gray"
                            }`}
                          >
                            <Titles position={"left"} size={"h7"} className="px-1">
                              Light
                            </Titles>
                            <Inputs
                              value={material.lightWeight?.toString() || ""}
                              onChange={(e) => 
                                handleMaterialChange(
                                  material.id, 
                                  material.logId, 
                                  'lightWeight', 
                                  e.target.value ? Number(e.target.value) : null
                                )
                              }
                              disabled={!edit}
                              placeholder="Light"
                              className="w-full h-full border-none rounded-none text-right text-xs"
                            />
                          </Holds>
                          <Holds
                            position={"row"}
                            className={`row-start-3 row-end-4 h-full w-full rounded-br-md ${
                              edit ? "bg-white" : "bg-app-gray"
                            }`}
                          >
                            <Titles position={"left"} size={"h7"} className="px-1">
                              Gross
                            </Titles>
                            <Inputs
                              value={material.grossWeight?.toString() || ""}
                              onChange={(e) => 
                                handleMaterialChange(
                                  material.id, 
                                  material.logId, 
                                  'grossWeight', 
                                  e.target.value ? Number(e.target.value) : null
                                )
                              }
                              disabled={!edit}
                              placeholder="Gross"
                              className="w-full h-full border-none text-xs text-right rounded-none rounded-br-md"
                            />
                          </Holds>
                        </Grids>
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