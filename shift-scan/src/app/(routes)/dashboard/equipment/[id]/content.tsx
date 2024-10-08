"use client";

import { useState, useEffect } from "react";
import { Bases } from "@/components/(reusable)/bases";
import { Holds } from "@/components/(reusable)/holds";
import { Buttons } from "@/components/(reusable)/buttons";
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";
import { DeleteLogs, updateEmployeeEquipmentLog } from "@/actions/equipmentActions";
import { useRouter } from 'next/navigation';
import { Banners } from "@/components/(reusable)/banners";
import { useTranslations } from "next-intl";
import { Forms } from "@/components/(reusable)/forms";
import { Labels } from "@/components/(reusable)/labels";
import { Inputs } from "@/components/(reusable)/inputs";
import { TextAreas } from "@/components/(reusable)/textareas";
import { Texts } from "@/components/(reusable)/texts";

type EquipmentLog = {
  userId: string | undefined;
  formId: string | undefined;
};

export default function CombinedForm({
  userId,
  formId,
}: EquipmentLog) {
  const router = useRouter();
  const [logs, setLogs] = useState<any[]>([]);
  const [refueled, setRefueled] = useState<boolean>(false);
  const [fuel, setFuel] = useState<number>(0);
  const [notes, setNotes] = useState<string>("");
  const [characterCount, setCharacterCount] = useState<number>(40);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [completed, setCompleted] = useState<boolean>(false); // For handling completion status
  const t = useTranslations("EquipmentContent");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/getLogs/${formId}`);
        if (response.ok) {
          const data = await response.json();
          setLogs(data.usersLogs);
          setRefueled(data.equipmentform?.refueled ?? false);
          setFuel(data.equipmentform?.fuel_used ?? 0);
          setNotes(data.equipmentform?.equipment_notes || "");
          setCompleted(data.equipmentform?.completed ?? false);
          setCharacterCount(40 - (data.equipmentform?.equipment_notes?.length || 0));
        } else {
          console.error("Failed to fetch logs");
        }
      } catch (error) {
        console.error("Error fetching logs:", error);
      }
    };

    fetchData();
  }, [formId]); // Fetch data when formId changes

  const handleSaveClick = async (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    // Form data handling and saving
  };

  const handleEditClick = () => {
    setIsEditMode(true);
  };


  useEffect(() => {
    console.log('Completed:', completed);
    console.log('Users Logs:', usersLogs);
  
    if (completed) {
      setIsEditMode(false);
    }
  
    // Check if usersLogs has valid data
    if (usersLogs && usersLogs.length > 0) {
      const log = usersLogs[0]; // Ensure that usersLogs contains the expected data
      setRefueled(log.refueled);
      setFuel(log.fuelUsed ?? 0);
      setNotes(log.comment || "");
      console.log('Equipment Notes from Log:', log.comment); // Debug log to check the notes value
    }
  }, [completed, usersLogs]);

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

  const handleSaveClick = async (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('endTime', endTime.toString());
    formData.append('id', eqid ?? "");
    formData.append('completed', "true");
    if (setChangedDuration !== undefined) {
      formData.append('duration', changedDuration);
    }
    formData.append('refueled', refueled.toString());
    formData.append('fuelUsed', fuel.toString());
    formData.append('comment', notes);

    try {
      await updateEmployeeEquipmentLog(formData);
      setIsEditMode(false);
    } catch (error) {
      console.error("Error updating equipment log:", error);
    }
  };

  const deleteHandler = async (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const formData1 = new FormData();
    formData1.append('id', eqid ?? "");
    try {
      await DeleteLogs(formData1);
      router.replace("/dashboard/equipment");
    } catch (error) {
      console.error("Error deleting log:", error);
    }
  };

  const confirmation = async (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('endTime', endTime.toString());
    formData.append('id', eqid ?? "");
    formData.append('completed', "true");
    formData.append('duration', duration);
    formData.append('refueled', refueled.toString());
    formData.append('fuelUsed', fuel.toString());
    formData.append('comment', notes);

    try {
      await updateEmployeeEquipmentLog(formData);
    } catch (error) {
      console.error("Error submitting equipment log:", error);
    }
  };
  return (
    <>
      {completed ? (
        <Banners variant={"green"}>
          {t("Banner")}
        </Banners>
      ) : null}

      <Holds size={"titleBox"}>
        <TitleBoxes
          title={`${name}`}
          type="noIcon"
          titleImg="/current.svg"
          titleImgAlt="Current"
          variant={"default"}
          size={"default"}
        />
      </Holds>

      <Forms action={updateEmployeeEquipmentLog}>
        <Holds size={"dynamic"}>
          <Labels variant={"default"} size={"default"} />
          {t("Refueled")}
          <Inputs
            name="refueled"
            type="checkbox"
            defaultChecked={refueled}
            onChange={handleRefueledChange}
            readOnly={!isEditMode && completed}
          />
        </Holds>

        {refueled ? (
          <Holds size={"dynamic"}>
            <Labels variant={"default"} size={"default"} />
            {t("Gallons")}
            <Inputs
              type="number"
              name="fuelUsed"
              defaultValue={fuel}
              onChange={handleFuelValue}
              readOnly={!isEditMode && completed}
            />
          </Holds>
        ) : (
          <Inputs type="hidden" name="fuelUsed" value="0" />
        )}

        <Holds size={"dynamic"}>
          <Labels variant={"default"} size={"default"} />
          {t("CheckedTime")}
          <Inputs
            name={"duration"}
            value={completed ? changedDuration : duration}
            onChange={handleDurationChange}
            readOnly={!isEditMode && completed}
          />

          <Labels variant={"default"} size={"default"} />
          {t("Notes")}
          <TextAreas
            name="comment"
            value={notes}
            maxLength={40}
            onChange={handleNotesChange}
            readOnly={!isEditMode && completed}
          />

          {characterCount === 0 ? (
            <Texts size={"p3"} className={"text-red-400 text-right"}>
              "You have reached the maximum number of characters for this note"
            </Texts>
          ) : null}

          <Texts size={"p3"} className={characterCount > 0 ? "text-green-800  text-right" : "text-red-400 text-right"}>
            {`${characterCount} Characters`}
          </Texts>
        </Holds>

        <Inputs type="hidden" name="endTime" value={endTime.toString()} />
        <Inputs type="hidden" name="id" value={eqid} />
        <Inputs type="hidden" name="completed" value="true" />

        {completed ? (
          isEditMode ? (
            <Buttons
              type="submit"
              onClick={handleSaveClick}
              variant={"green"}
              size={"minBtn"}
              value="Save"
            >
              {t("Save")}
            </Buttons>
          ) : (
            <Buttons
              type="button"
              onClick={handleEditClick}
              variant={"orange"}
              size={"minBtn"}
              value="Edit"
            >
              {t("Edit")}
            </Buttons>
          )
        ) : (
          <Buttons
            type="submit"
            onClick={confirmation}
            variant={"green"}
            size={"minBtn"}
            value="Submit"
          >
            {t("Submit")}
          </Buttons>
        )}

        <Buttons href="/dashboard/equipment" variant={"red"} size={"minBtn"} onClick={deleteHandler}>
          {t("Delete")}
        </Buttons>
      </Forms>
    </>
  );
}
