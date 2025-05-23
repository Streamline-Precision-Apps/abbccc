"use client";
import { Buttons } from "@/components/(reusable)/buttons";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Inputs } from "@/components/(reusable)/inputs";
import { Texts } from "@/components/(reusable)/texts";
import { Titles } from "@/components/(reusable)/titles";
import {
  MaterialType,
  TruckingMaterialHaulLog,
  TruckingMaterialHaulLogData,
} from "@/lib/types";
import { useEffect, useState } from "react";

// Define the type for processed material data
type ProcessedMaterialLog = {
  id: string;
  name: string;
  LocationOfMaterial: string;
  materialWeight: number | null;
  lightWeight: number | null;
  grossWeight: number | null;
  logId: string;
};

type TimeCardTruckingMaterialHaulLogsProps = {
  edit: boolean;
  manager: string;
  truckingMaterialHaulLogs: TruckingMaterialHaulLogData;
  onDataChange: (data: ProcessedMaterialLog[]) => void;
};

export default function TimeCardTruckingMaterialLogs({
  edit,
  manager,
  truckingMaterialHaulLogs,
  onDataChange,
}: TimeCardTruckingMaterialHaulLogsProps) {
  // Use truckingMaterialHaulLogs prop directly for rendering and updates
  // Handler for updating a nested Material item
  const handleMaterialChange = (
    truckingLogItemIndex: number,
    truckingLogId: string,
    materialId: string,
    field: keyof ProcessedMaterialLog,
    value: any
  ) => {
    const updated = truckingMaterialHaulLogs.map((item, idx) => {
      if (idx === truckingLogItemIndex) {
        return {
          ...item,
          TruckingLogs: item.TruckingLogs.map((log) => {
            if (log.id === truckingLogId) {
              return {
                ...log,
                Materials: log.Materials.map((material) =>
                  material.id === materialId
                    ? { ...material, [field]: value }
                    : material
                ),
              };
            }
            return log;
          }),
        };
      }
      return item;
    });
    onDataChange(updated);
  };

  const [materialTypes, setMaterialTypes] = useState<MaterialType[]>([]);

  useEffect(() => {
    const fetchMaterialTypes = async () => {
      try {
        const materialTypesResponse = await fetch("/api/getMaterialTypes");
        const materialTypesData = await materialTypesResponse.json();
        setMaterialTypes(materialTypesData);
        console.log("Material Types:", materialTypesData);
      } catch {
        console.error("Error fetching material types");
      }
    };

    fetchMaterialTypes();
  }, []);

  const isEmptyData = truckingMaterialHaulLogs.length === 0;

  return (
    <Holds className="w-full h-full">
      <Grids rows={"7"}>
        <Holds className="row-start-1 row-end-7 overflow-y-scroll no-scrollbar h-full w-full">
          {!isEmptyData ? (
            <>
              <Grids cols={"2"} className="w-full h-fit">
                <Holds className="col-start-1 col-end-2 w-full h-full pr-1">
                  <Titles position={"left"} size={"h6"}>
                    {t("MaterialLocation")}
                  </Titles>
                </Holds>
                <Holds className="col-start-2 col-end-3 w-full h-full pr-1">
                  <Titles position={"right"} size={"h6"}>
                    {t("Weight")}
                  </Titles>
                </Holds>
              </Grids>

              {truckingMaterialHaulLogs.map(
                (truckingLogItem, truckingLogItemIndex) =>
                  truckingLogItem.TruckingLogs.map((material) => (
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
                            <Grids
                              rows={"2"}
                              className="w-full h-full rounded-none"
                            >
                              <Holds className="row-start-1 row-end-2 h-full rounded-none border-b-[1.5px] border-black">
                                {edit ? (
                                  <select
                                    value={material.name}
                                    onChange={(e) =>
                                      handleMaterialChange(
                                        truckingLogItemIndex,
                                        material.logId,
                                        "name",
                                        e.target.value
                                      )
                                    }
                                    disabled={!edit}
                                    className="w-full h-full border-none rounded-none rounded-tl-md text-xs px-2 bg-white"
                                  >
                                    <option value="">Select Material</option>
                                    {materialTypes.map((materialType) => (
                                      <option
                                        key={materialType.id}
                                        value={materialType.name}
                                      >
                                        {materialType.name}
                                      </option>
                                    ))}
                                  </select>
                                ) : (
                                  <Inputs
                                    value={material.name}
                                    onChange={(e) =>
                                      handleMaterialChange(
                                        truckingLogItemIndex,
                                        material.logId,
                                        "name",
                                        e.target.value
                                      )
                                    }
                                    disabled={true}
                                    placeholder="Material"
                                    className="w-full h-full border-none rounded-none rounded-tl-md text-xs"
                                  />
                                )}
                              </Holds>
                              <Holds className="row-start-2 row-end-3 h-full border-t-[1.5px] border-black">
                                <Inputs
                                  value={material.LocationOfMaterial}
                                  onChange={(e) =>
                                    handleMaterialChange(
                                      truckingLogItemIndex,
                                      material.logId,
                                      "LocationOfMaterial",
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
                                <Titles
                                  position={"left"}
                                  size={"h7"}
                                  className="px-1"
                                >
                                  Material
                                </Titles>
                                <Inputs
                                  value={
                                    material.materialWeight?.toString() || ""
                                  }
                                  onChange={(e) =>
                                    handleMaterialChange(
                                      truckingLogItemIndex,
                                      material.logId,
                                      "materialWeight",
                                      e.target.value
                                        ? Number(e.target.value)
                                        : null
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
                                <Titles
                                  position={"left"}
                                  size={"h7"}
                                  className="px-1"
                                >
                                  Light
                                </Titles>
                                <Inputs
                                  value={material.lightWeight?.toString() || ""}
                                  onChange={(e) =>
                                    handleMaterialChange(
                                      truckingLogItemIndex,
                                      material.logId,
                                      "lightWeight",
                                      e.target.value
                                        ? Number(e.target.value)
                                        : null
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
                                <Titles
                                  position={"left"}
                                  size={"h7"}
                                  className="px-1"
                                >
                                  Gross
                                </Titles>
                                <Inputs
                                  value={material.grossWeight?.toString() || ""}
                                  onChange={(e) =>
                                    handleMaterialChange(
                                      truckingLogItemIndex,
                                      material.logId,
                                      "grossWeight",
                                      e.target.value
                                        ? Number(e.target.value)
                                        : null
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
                  ))
              )}
            </>
          ) : (
            <Holds className="w-full h-full flex items-center justify-center">
              <Texts size="p6" className="text-gray-500 italic">
                {t("NoHaulLogsAvailable")}
              </Texts>
            </Holds>
          )}
        </Holds>
      </Grids>
    </Holds>
  );
}

