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
import { useTranslations } from "next-intl";

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
  onDataChange: (data: TruckingMaterialHaulLogData) => void;
  focusIds: string[];
  setFocusIds: (ids: string[]) => void;
  isReviewYourTeam?: boolean;
};

// Helper to flatten nested material logs for server submission
export const flattenMaterialLogs = (
  logs: TruckingMaterialHaulLogData
): ProcessedMaterialLog[] => {
  const result: ProcessedMaterialLog[] = [];
  logs.forEach((item) => {
    (item.TruckingLogs ?? []).forEach((log) => {
      if (!log) return;
      (log.Materials ?? []).forEach((material) => {
        if (
          material &&
          material.id &&
          (material.name ||
            material.LocationOfMaterial ||
            material.materialWeight !== null ||
            material.lightWeight !== null ||
            material.grossWeight !== null)
        ) {
          result.push({
            id: material.id,
            name: material.name,
            LocationOfMaterial: material.LocationOfMaterial,
            materialWeight: material.materialWeight,
            lightWeight: material.lightWeight,
            grossWeight: material.grossWeight,
            logId: log.id,
          });
        }
      });
    });
  });
  return result;
};

export default function TimeCardTruckingMaterialLogs({
  edit,
  manager,
  truckingMaterialHaulLogs,
  onDataChange,
  focusIds,
  setFocusIds,
  isReviewYourTeam,
}: TimeCardTruckingMaterialHaulLogsProps) {
  const t = useTranslations("MyTeam.TimeCardTruckingMaterialLogs");
  // Add state to store local input values to prevent losing focus while typing
  const [inputValues, setInputValues] = useState<
    Record<string, string | number | null>
  >({});

  // Create a unique key for each input field
  const getInputKey = (
    logId: string,
    materialId: string,
    fieldName: string
  ) => {
    return `${logId}-${materialId}-${fieldName}`;
  };

  // Get the current value from local state or use the original value
  const getDisplayValue = (
    logId: string,
    materialId: string,
    fieldName: string,
    originalValue: any
  ) => {
    const key = getInputKey(logId, materialId, fieldName);
    return key in inputValues ? inputValues[key] : originalValue;
  };

  // Update local state without triggering parent update (and thus avoiding re-render)
  const handleLocalChange = (
    logId: string,
    materialId: string,
    fieldName: string,
    value: any
  ) => {
    setInputValues((prev) => ({
      ...prev,
      [getInputKey(logId, materialId, fieldName)]: value,
    }));
  };
  // Update parent state only when field loses focus (onBlur)
  const handleBlur = (
    itemIdx: number,
    logId: string,
    materialId: string,
    field: keyof ProcessedMaterialLog
  ) => {
    const key = getInputKey(logId, materialId, field);

    if (key in inputValues) {
      const value = inputValues[key];
      handleMaterialChange(itemIdx, logId, materialId, field, value);

      // Clear from local state to avoid duplicate processing
      setInputValues((prev) => {
        const newState = { ...prev };
        delete newState[key];
        return newState;
      });
    }
  };
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
          TruckingLogs: (item.TruckingLogs ?? []).map((log) => {
            if (!log) return log;
            if (log.id === truckingLogId) {
              return {
                ...log,
                Materials: (log.Materials ?? []).map((material) =>
                  material && material.id === materialId
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

              {truckingMaterialHaulLogs.map((item, itemIdx) =>
                (item.TruckingLogs ?? []).map((log, logIdx) => {
                  if (!log) return null;
                  return (log.Materials ?? []).map((material, matIdx) => {
                    if (!material) return null;
                    return (
                      <Holds
                        key={`${log.id}-${material.id}`}
                        background={
                          focusIds.includes(material.id) ? "orange" : "white"
                        }
                        className={`border-black border-[3px] rounded-lg mb-2 ${
                          isReviewYourTeam ? "cursor-pointer" : ""
                        }`}
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
                                {" "}
                                <Holds className="row-start-1 row-end-2 h-full rounded-none border-b-[1.5px] border-black">
                                  {" "}
                                  {edit ? (
                                    <Inputs
                                      value={getDisplayValue(
                                        log.id,
                                        material.id,
                                        "name",
                                        material.name
                                      )}
                                      background={
                                        isFocused ? "orange" : "white"
                                      }
                                      onChange={(e) =>
                                        handleLocalChange(
                                          log.id,
                                          material.id,
                                          "name",
                                          e.target.value
                                        )
                                      }
                                      onBlur={() =>
                                        handleBlur(
                                          itemIdx,
                                          log.id,
                                          material.id,
                                          "name"
                                        )
                                      }
                                      disabled={!edit}
                                      placeholder="Material"
                                      className="w-full h-full border-none rounded-none rounded-tl-md text-xs px-2 bg-white"
                                    />
                                  ) : (
                                    <Inputs
                                      value={material.name}
                                      onChange={(e) =>
                                        handleMaterialChange(
                                          itemIdx,
                                          log.id,
                                          material.id,
                                          "name",
                                          e.target.value
                                        )
                                      }
                                      disabled={true}
                                      background={
                                        focusIds.includes(material.id)
                                          ? "orange"
                                          : "white"
                                      }
                                      placeholder="Material"
                                      className="w-full h-full border-none rounded-none rounded-tl-md text-xs"
                                    />
                                  )}
                                </Holds>{" "}
                                <Holds className="row-start-2 row-end-3 h-full border-t-[1.5px] border-black">
                                  {" "}
                                  <Inputs
                                    value={getDisplayValue(
                                      log.id,
                                      material.id,
                                      "LocationOfMaterial",
                                      material.LocationOfMaterial
                                    )}
                                    onChange={(e) =>
                                      handleLocalChange(
                                        log.id,
                                        material.id,
                                        "LocationOfMaterial",
                                        e.target.value
                                      )
                                    }
                                    onBlur={() =>
                                      handleBlur(
                                        itemIdx,
                                        log.id,
                                        material.id,
                                        "LocationOfMaterial"
                                      )
                                    }
                                    disabled={!edit}
                                    background={
                                      focusIds.includes(material.id)
                                        ? "orange"
                                        : "white"
                                    }
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
                                  </Titles>{" "}
                                  <Inputs
                                    value={
                                      getDisplayValue(
                                        log.id,
                                        material.id,
                                        "materialWeight",
                                        material.materialWeight
                                      ) || ""
                                    }
                                    onChange={(e) =>
                                      handleLocalChange(
                                        log.id,
                                        material.id,
                                        "materialWeight",
                                        e.target.value
                                          ? Number(e.target.value)
                                          : null
                                      )
                                    }
                                    onBlur={() =>
                                      handleBlur(
                                        itemIdx,
                                        log.id,
                                        material.id,
                                        "materialWeight"
                                      )
                                    }
                                    disabled={!edit}
                                    background={
                                      focusIds.includes(material.id)
                                        ? "orange"
                                        : "white"
                                    }
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
                                  </Titles>{" "}
                                  <Inputs
                                    value={
                                      getDisplayValue(
                                        log.id,
                                        material.id,
                                        "lightWeight",
                                        material.lightWeight
                                      ) || ""
                                    }
                                    onChange={(e) =>
                                      handleLocalChange(
                                        log.id,
                                        material.id,
                                        "lightWeight",
                                        e.target.value
                                          ? Number(e.target.value)
                                          : null
                                      )
                                    }
                                    onBlur={() =>
                                      handleBlur(
                                        itemIdx,
                                        log.id,
                                        material.id,
                                        "lightWeight"
                                      )
                                    }
                                    disabled={!edit}
                                    background={
                                      focusIds.includes(material.id)
                                        ? "orange"
                                        : "white"
                                    }
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
                                  </Titles>{" "}
                                  <Inputs
                                    value={
                                      getDisplayValue(
                                        log.id,
                                        material.id,
                                        "grossWeight",
                                        material.grossWeight
                                      ) || ""
                                    }
                                    onChange={(e) =>
                                      handleLocalChange(
                                        log.id,
                                        material.id,
                                        "grossWeight",
                                        e.target.value
                                          ? Number(e.target.value)
                                          : null
                                      )
                                    }
                                    onBlur={() =>
                                      handleBlur(
                                        itemIdx,
                                        log.id,
                                        material.id,
                                        "grossWeight"
                                      )
                                    }
                                    disabled={!edit}
                                    background={
                                      focusIds.includes(material.id)
                                        ? "orange"
                                        : "white"
                                    }
                                    placeholder="Gross"
                                    className="w-full h-full border-none text-xs text-right rounded-none rounded-br-md"
                                  />
                                </Holds>
                              </Grids>
                            </Holds>
                          </Grids>
                        </Buttons>
                      </Holds>
                    );
                  });
                })
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
