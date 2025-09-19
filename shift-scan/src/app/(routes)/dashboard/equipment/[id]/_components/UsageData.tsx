import { CheckBox } from "@/components/(inputs)/checkBox";
import { Buttons } from "@/components/(reusable)/buttons";
import { Holds } from "@/components/(reusable)/holds";
import { Inputs } from "@/components/(reusable)/inputs";
import { Labels } from "@/components/(reusable)/labels";
import { Texts } from "@/components/(reusable)/texts";
import { format, parseISO } from "date-fns";
import { TextAreas } from "@/components/(reusable)/textareas";
import { useNotification } from "@/app/context/NotificationContext";
import { Dispatch, SetStateAction, useState } from "react";
import { EquipmentLog, RefuelLogData } from "../types";
import { Images } from "@/components/(reusable)/images";
import { EquipmentState } from "../../../../../../../prisma/generated/prisma/client";

interface UsageDataProps {
  formState: EquipmentLog;
  handleFieldChange: (
    field: string,
    value: string | number | boolean | EquipmentState | RefuelLogData | null,
  ) => void;
  formattedTime: string;
  handleChangeRefueled: () => void;
  handleFullOperational: () => void;
  AddRefuelLog: (gallons: number, existingLogId?: string) => void;
  refuelLog: RefuelLogData | null;
  setRefuelLog: Dispatch<SetStateAction<RefuelLogData | null>>;
  t: (key: string) => string;
  isRefueled: boolean;
  deleteLog: () => Promise<void>;
  saveEdits: () => Promise<void>;
  isFormValid: () => boolean | "" | null | undefined;
}

export default function UsageData({
  formState,
  handleFieldChange,
  formattedTime,
  handleChangeRefueled,
  handleFullOperational,
  AddRefuelLog,
  refuelLog,
  setRefuelLog,
  t,
  isRefueled,
  deleteLog,
  saveEdits,
  isFormValid,
}: UsageDataProps) {
  const [newRefuelGallons, setNewRefuelGallons] = useState<string>("");
  const [showRefuelInput, setShowRefuelInput] = useState<boolean>(false);
  const { setNotification } = useNotification();

  const handleRefuelCheckboxChange = () => {
    if (!isRefueled) {
      // Show input when checking the box
      setShowRefuelInput(true);
    } else {
      // If there's an existing log, don't allow unchecking
      setNotification(t("DeleteRefuelLogFirst"), "error");
    }
  };

  const handleCreateRefuel = () => {
    const gallons = parseFloat(newRefuelGallons);
    if (!newRefuelGallons || isNaN(gallons) || gallons <= 0) {
      setNotification(t("ValidGallons"), "error");
      return;
    }

    // Create new refuel log with temp ID
    const newRefuelLog = {
      id: "temp-" + Date.now(),
      gallonsRefueled: gallons,
    };

    setRefuelLog(newRefuelLog);
    handleChangeRefueled(); // Mark as refueled
    setShowRefuelInput(false);

    setNotification(t("ClickFinishLogs"), "success");
  };

  const handleUpdateRefuel = () => {
    const gallons = parseFloat(newRefuelGallons);
    if (!newRefuelGallons || isNaN(gallons) || gallons <= 0) {
      setNotification(t("ValidGallons"), "error");
      return;
    }

    if (!refuelLog) {
      setNotification(t("NoRefuelLogToUpdate"), "error");
      return;
    }

    // Update existing refuel log gallons only
    const updatedRefuelLog = {
      ...refuelLog,
      gallonsRefueled: gallons,
    };

    setRefuelLog(updatedRefuelLog);
    setShowRefuelInput(false);

    setNotification(t("ClickFinishLogs"), "success");
  };

  const handleDeleteRefuelLog = () => {
    if (refuelLog) {
      setRefuelLog(null);
      handleChangeRefueled(); // Update parent state
      setShowRefuelInput(false);
      setNewRefuelGallons("");
      setNotification(t("RefuelLogRemoved"), "success");
    }
  };

  return (
    <Holds className="row-start-1 row-end-8 w-full h-full overflow-y-auto no-scrollbar">
      <Holds className="w-full">
        <Holds position={"row"} className="w-full">
          <Holds className="w-[90]">
            <Labels size="p5">{t("StartTime")}</Labels>
            <Inputs
              type="time"
              value={
                formState.startTime
                  ? format(new Date(formState.startTime), "HH:mm")
                  : ""
              }
              className="w-full border-[3px] border-r-[1.5px] border-black p-1 rounded-[10px] rounded-r-none"
              onChange={(e) => {
                const newTime = e.target.value;
                const currentDate = new Date(formState.startTime || new Date());
                const [newHours, newMinutes] = newTime.split(":").map(Number);
                currentDate.setHours(newHours, newMinutes, 0, 0);
                handleFieldChange("startTime", currentDate.toISOString());
              }}
            />
          </Holds>
          <Holds className="w-full">
            <Labels size="p5">{t("EndTime")}</Labels>
            <Inputs
              type="time"
              value={
                formState.endTime
                  ? format(new Date(parseISO(formState.endTime)), "HH:mm")
                  : ""
              }
              className="w-full border-[3px] border-l-[1.5px] border-black p-1 rounded-[10px] rounded-l-none"
              onChange={(e) => {
                const newTime = e.target.value;
                const currentDate = new Date(formState.endTime || new Date());
                const [newHours, newMinutes] = newTime.split(":").map(Number);
                currentDate.setHours(newHours, newMinutes, 0, 0);
                handleFieldChange("endTime", currentDate.toISOString());
              }}
            />
          </Holds>
        </Holds>
        <Texts position={"right"} size="p6">
          <span className="italic mr-1">{t("Duration:")}</span> {formattedTime}
        </Texts>
      </Holds>

      <Holds background="white" className="w-full relative">
        <Labels size="p5">{t("Comment")}</Labels>
        <TextAreas
          maxLength={40}
          placeholder={t("EnterCommentsHere")}
          value={formState.comment || ""}
          onChange={(e) => handleFieldChange("comment", e.target.value)}
          className="text-sm"
        />
        <Texts
          size="p3"
          className={`${
            typeof formState.comment === "string" &&
            formState.comment.length >= 40
              ? "text-red-500 absolute bottom-4 right-4"
              : "absolute bottom-4 right-4"
          }`}
        >
          {`${
            typeof formState.comment === "string" ? formState.comment.length : 0
          }/40`}
        </Texts>
      </Holds>

      <Holds position={"row"} className="w-full pb-3">
        <Holds size={"20"} className="h-full justify-center relative">
          <CheckBox
            shadow={false}
            id="fullyOperational"
            name="fullyOperational"
            width={40}
            height={40}
            checked={formState.fullyOperational}
            onChange={handleFullOperational}
          />
        </Holds>
        <Holds size={"80"} className="h-full justify-center">
          <Texts position={"left"} size="p3">
            {t("FullyOperational")} <span className="text-red-500">*</span>
          </Texts>
        </Holds>
      </Holds>

      <Holds className="w-full pb-4">
        <Holds position={"row"} className="w-full pb-3">
          <Holds size={"20"} className="h-full justify-center relative">
            <CheckBox
              shadow={false}
              id="refueled"
              name="refueled"
              width={40}
              height={40}
              checked={isRefueled}
              onChange={handleRefuelCheckboxChange}
            />
          </Holds>
          <Holds size={"80"} className="h-full justify-center">
            <Texts position={"left"} size="p3">
              {t("EquipmentRefueled")}
            </Texts>
          </Holds>
        </Holds>

        {showRefuelInput && (
          <Holds background="white" className=" mb-3">
            <Labels size="p5">{t("GallonsRefueled")}</Labels>
            <Inputs
              type="number"
              step="0.1"
              min="0"
              placeholder="Enter gallons refueled"
              value={newRefuelGallons}
              onChange={(e) => setNewRefuelGallons(e.target.value)}
              className="border border-gray-300 mb-2"
            />
            <Holds position="row" className="w-full gap-4">
              <Buttons
                shadow="none"
                background="green"
                className="w-full"
                onClick={refuelLog ? handleUpdateRefuel : handleCreateRefuel}
              >
                {refuelLog ? t("Update") : t("Save")}
              </Buttons>
              <Buttons
                shadow="none"
                background="red"
                className="w-full"
                onClick={() => {
                  if (refuelLog) {
                    handleDeleteRefuelLog();
                  } else {
                    setShowRefuelInput(false);
                    setNewRefuelGallons("");
                  }
                }}
              >
                {refuelLog ? t("DeleteLog") : t("Cancel")}
              </Buttons>
            </Holds>
          </Holds>
        )}

        {isRefueled && !showRefuelInput && (
          <Holds className="p-3 border border-solid border-green-500 rounded-lg bg-green-50">
            <Holds
              position="row"
              className="w-full h-full justify-center items-center"
            >
              <Texts size="p5" className="text-green-700">
                {refuelLog?.gallonsRefueled || 0} {t("GallonsRefueled")}
              </Texts>

              <Buttons
                shadow={"none"}
                background={"none"}
                className="text-xs w-12 h-full"
                onClick={() => {
                  setNewRefuelGallons(
                    refuelLog?.gallonsRefueled?.toString() || "",
                  );
                  setShowRefuelInput(true);
                }}
              >
                <Images
                  className="w-5 h-5 mx-auto"
                  titleImg={"/eraser.svg"}
                  titleImgAlt={"Edit"}
                />
              </Buttons>
            </Holds>
          </Holds>
        )}
      </Holds>
    </Holds>
  );
}
