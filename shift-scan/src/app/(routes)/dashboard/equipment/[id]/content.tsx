"use client";

import { useState, useEffect } from "react";
import { Holds } from "@/components/(reusable)/holds";
import { Buttons } from "@/components/(reusable)/buttons";
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";
import {
  DeleteLogs,
  updateEmployeeEquipmentLog,
} from "@/actions/equipmentActions";
import { useRouter } from "next/navigation";
import { Banners } from "@/components/(reusable)/banners";
import { useTranslations } from "next-intl";
import { Forms } from "@/components/(reusable)/forms";
import { Labels } from "@/components/(reusable)/labels";
import { Inputs } from "@/components/(reusable)/inputs";
import { TextAreas } from "@/components/(reusable)/textareas";
import { Texts } from "@/components/(reusable)/texts";

export default function CombinedForm({ formId }: { formId: string }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [logs, setLogs] = useState<any[]>([]);
  const [refueled, setRefueled] = useState<boolean>(false);
  const [fuel, setFuel] = useState<number>(0);
  const [notes, setNotes] = useState<string>("");
  const [characterCount, setCharacterCount] = useState<number>(40);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [completed, setCompleted] = useState<boolean>(false);
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");

  const [changedDuration, setChangedDuration] = useState<string>("");
  const t = useTranslations("EquipmentContent");

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/getEQFormById/${formId}`);

        if (!response.ok) {
          throw new Error(`Failed to fetch logs: ${response.statusText}`);
        }

        const data = await response.json();

        if (!data) {
          throw new Error("No data returned from server");
        }

        // Destructure the necessary fields from the response
        const { equipmentform, userNotes } = data;

        // Update state based on the response structure
        setStartTime(userNotes.startTime ?? "");
        setEndTime(userNotes.endTime ?? "");
        setLogs(userNotes || []);
        setRefueled(userNotes.isRefueled ?? false);
        setFuel(userNotes.fuelUsed ?? 0);
        setNotes(userNotes.comment || "");
        setCompleted(userNotes.isCompleted ?? false);
        setCharacterCount(40 - (userNotes?.comment?.length || 0));
        setChangedDuration(userNotes?.duration ?? "");
      } catch (error) {
        setError((error as Error).message);
        console.error("Error fetching logs:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (formId) {
      fetchData();
    }
  }, [formId]);
  useEffect(() => {
    if (completed) {
      setIsEditMode(false);
    }
    if (logs.length > 0) {
      const log = logs[0]; // Example: Set data based on the first log entry
      setRefueled(log.isRefueled);
      setFuel(log.fuelUsed ?? 0);
      setNotes(log.comment || "");
    }
  }, [completed, logs]);

  const handleRefueledChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRefueled(event.target.checked);
  };

  const handleFuelValue = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFuel(event.target.valueAsNumber);
  };

  const handleNotesChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCharacterCount(40 - event.target.value.length);
    setNotes(event.target.value);
  };

  const handleDurationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChangedDuration(event.target.value);
  };

  const handleEditClick = () => {
    setIsEditMode(true);
  };

  const handleSaveClick = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.append("endTime", new Date().toISOString());
    formData.append("id", formId ?? "");
    formData.append("completed", "true");

    try {
      await updateEmployeeEquipmentLog(formData);
      setIsEditMode(false);
    } catch (error) {
      console.error("Error updating equipment log:", error);
    }
  };

  const deleteHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    try {
      await DeleteLogs(formData);
      router.replace("/dashboard/equipment");
    } catch (error) {
      console.error("Error deleting log:", error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      {completed && <Banners background="green">{t("Banner")}</Banners>}

      <Holds>
        <TitleBoxes
          title="Equipment Log"
          type="noIcon"
          titleImg="/current.svg"
          titleImgAlt="Current"
          variant="default"
          size="default"
        />
      </Holds>
      <Texts>
        {startTime} - {endTime}
      </Texts>

      <Forms onSubmit={handleSaveClick}>
        <Holds>
          <Labels />
          {t("Refueled")}
          <Inputs
            name="refueled"
            type="checkbox"
            checked={refueled}
            onChange={handleRefueledChange}
            readOnly={!isEditMode && completed}
          />
        </Holds>

        {refueled && (
          <Holds>
            <Labels />
            {t("Gallons")}
            <Inputs
              type="number"
              name="fuelUsed"
              value={fuel.toString()}
              onChange={handleFuelValue}
              readOnly={!isEditMode && completed}
            />
          </Holds>
        )}

        <Holds>
          <Labels />
          {t("CheckedTime")}
          <Inputs
            name="duration"
            value={completed ? changedDuration : ""}
            onChange={handleDurationChange}
            readOnly={!isEditMode && completed}
          />

          <Labels />
          {t("Notes")}
          <TextAreas
            name="comment"
            value={notes}
            maxLength={40}
            onChange={handleNotesChange}
            readOnly={!isEditMode && completed}
          />

          {characterCount <= 0 ? (
            <Texts size="p3" className="text-red-400 text-right">
              "You have reached the maximum number of characters for this note"
            </Texts>
          ) : null}

          <Texts
            size="p3"
            className={
              characterCount > 0
                ? "text-green-800 text-right"
                : "text-red-400 text-right"
            }
          >
            {`${characterCount} Characters`}
          </Texts>
        </Holds>

        <Inputs type="hidden" name="endTime" value={new Date().toISOString()} />
        <Inputs type="hidden" name="id" value={formId ?? ""} />
        <Inputs type="hidden" name="completed" value="true" />
        <Holds position="row">
          <Holds>
            {completed ? (
              isEditMode ? (
                <Buttons type="submit" background="green">
                  {t("Save")}
                </Buttons>
              ) : (
                <Buttons
                  type="button"
                  onClick={handleEditClick}
                  background="orange"
                  size={"90"}
                >
                  {t("Edit")}
                </Buttons>
              )
            ) : (
              <Buttons type="submit" background="green" size={"90"}>
                {t("Submit")}
              </Buttons>
            )}
          </Holds>
          <Holds>
            <Buttons
              type="button"
              onClick={(e) => deleteHandler(e as any)}
              background="red"
              size={"90"}
            >
              {t("Delete")}
            </Buttons>
          </Holds>
        </Holds>
      </Forms>
    </>
  );
}
