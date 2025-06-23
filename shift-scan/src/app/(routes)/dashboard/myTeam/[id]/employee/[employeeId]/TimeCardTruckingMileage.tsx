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
  onDataChange: (data: TruckingMileageData) => void; // FIX: expects nested structure
  focusIds: string[];
  setFocusIds: (ids: string[]) => void;
  isReviewYourTeam?: boolean;
}

export default function TimeCardTruckingMileage({
  edit,
  manager,
  truckingMileage,
  onDataChange,
  focusIds,
  setFocusIds,
  isReviewYourTeam,
}: TimeCardTruckingMileageProps) {
  const t = useTranslations("MyTeam.TimeCardTruckingMileage");

  // Debug what data we're receiving
  useEffect(() => {
    console.log("TimeCardTruckingMileage received data:", {
      isReviewYourTeam,
      truckingMileageLength: truckingMileage?.length,
      truckingMileage,
    });
  }, [truckingMileage, isReviewYourTeam]);

  // Add state to store local input values to prevent losing focus while typing
  const [inputValues, setInputValues] = useState<
    Record<string, string | number | null>
  >({});

  // Create a unique key for each input field
  const getInputKey = (logId: string, fieldName: string) => {
    return `${logId}-${fieldName}`;
  };

  // Get the current value from local state or use the original value
  const getDisplayValue = (
    logId: string,
    fieldName: string,
    originalValue: string | number | null
  ) => {
    const key = getInputKey(logId, fieldName);
    return key in inputValues ? inputValues[key] : originalValue;
  };

  // Update local state without triggering parent update (and thus avoiding re-render)
  const handleLocalChange = (
    logId: string,
    fieldName: string,
    value: string | number | null
  ) => {
    setInputValues((prev) => ({
      ...prev,
      [getInputKey(logId, fieldName)]: value,
    }));
  };

  // Update parent state only when field loses focus (onBlur)
  const handleBlur = (logId: string, field: keyof TruckingMileageUpdate) => {
    const key = getInputKey(logId, field);

    if (key in inputValues) {
      const value = inputValues[key];
      handleMileageChange(logId, field, value);

      // Clear from local state to avoid duplicate processing
      setInputValues((prev) => {
        const newState = { ...prev };
        delete newState[key];
        return newState;
      });
    }
  };

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
    value: number | null | string | undefined
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
            !!log && typeof log === "object" && "id" in log
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

              {allTruckingLogs.map((sheet) => {
                const isFocused = focusIds.includes(sheet.id);
                const handleToggleFocus = () => {
                  if (isFocused) {
                    setFocusIds(focusIds.filter((id) => id !== sheet.id));
                  } else {
                    setFocusIds([...focusIds, sheet.id]);
                  }
                };
                return (
                  <Holds
                    key={sheet.id}
                    background={isFocused ? "orange" : "white"}
                    className={`relative border-black border-[3px] rounded-lg mb-2
                    ${isReviewYourTeam ? "cursor-pointer" : ""}`}
                    onClick={isReviewYourTeam ? handleToggleFocus : undefined}
                  >
                    {isReviewYourTeam && (
                      <div
                        className="absolute top-0 left-0 w-full h-full z-10 cursor-pointer"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleToggleFocus();
                        }}
                      />
                    )}
                    <Buttons
                      shadow={"none"}
                      background={"none"}
                      className="w-full h-full text-left"
                    >
                      <Grids cols={"4"} className="w-full h-full">
                        <Holds className="col-start-1 col-end-3 h-full w-full">
                          {" "}
                          <Inputs
                            type={"text"}
                            value={sheet.Equipment?.name || ""}
                            className="text-xs border-none h-full w-full p-2.5 rounded-md rounded-tr-none rounded-br-none justify-center"
                            background={isFocused ? "orange" : "white"}
                            disabled={true} // Equipment name should not be editable
                            readOnly
                          />
                        </Holds>
                        <Holds className="col-start-3 col-end-4 border-x-[3px] border-black h-full">
                          <Holds className="h-full justify-center">
                            {" "}
                            <Inputs
                              type={"number"}
                              value={
                                getDisplayValue(
                                  sheet.id,
                                  "startingMileage",
                                  sheet.startingMileage
                                ) ?? ""
                              }
                              className="text-xs border-none h-full rounded-none justify-center p-2.5"
                              background={isFocused ? "orange" : "white"}
                              disabled={!edit}
                              onChange={(e) =>
                                handleLocalChange(
                                  sheet.id,
                                  "startingMileage",
                                  Number(e.target.value)
                                )
                              }
                              onBlur={() =>
                                handleBlur(sheet.id, "startingMileage")
                              }
                            />
                          </Holds>
                        </Holds>

                        <Holds className="col-start-4 col-end-5 h-full">
                          <Holds className="h-full justify-center">
                            {" "}
                            <Inputs
                              type={"number"}
                              value={
                                getDisplayValue(
                                  sheet.id,
                                  "endingMileage",
                                  sheet.endingMileage || ""
                                ) ?? ""
                              }
                              className="text-xs border-none h-full rounded-md rounded-tl-none rounded-bl-none justify-center text-right p-2.5"
                              background={isFocused ? "orange" : "white"}
                              disabled={!edit}
                              onChange={(e) =>
                                handleLocalChange(
                                  sheet.id,
                                  "endingMileage",
                                  Number(e.target.value)
                                )
                              }
                              onBlur={() =>
                                handleBlur(sheet.id, "endingMileage")
                              }
                            />
                          </Holds>
                        </Holds>
                      </Grids>
                    </Buttons>
                  </Holds>
                );
              })}
            </>
          )}
        </Holds>
      </Grids>
    </Holds>
  );
}
