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
import { calculateDuration } from "@/utils/calculateDuration";
import { Contents } from "@/components/(reusable)/contents";
import Checkbox from "@/components/(inputs)/checkbox";
import { set } from "zod";
import { Grids } from "@/components/(reusable)/grids";
import Spinner from "@/components/(animations)/spinner";
import Link from "next/link";

export default function CombinedForm({ params }: { params: { id: string } }) {
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
  const [startTime, setStartTime] = useState();
  const [endTime, setEndTime] = useState();
  const [productName, setProductName] = useState("");

  const [changedDuration, setChangedDuration] = useState<string>("");
  const [changedDurationHours, setChangedDurationHours] = useState<string>("");
  const [changedDurationMinutes, setChangedDurationMinutes] =
    useState<string>("");
  const [changedDurationSeconds, setChangedDurationSeconds] =
    useState<string>("");

  const t = useTranslations("EquipmentContent");

  // Fetch Equipment Form Details
  useEffect(() => {
    const fetchEquipmentForm = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/getEqUserLogs/${params.id}`);
        if (!response.ok) {
          throw new Error(
            `Failed to fetch equipment form: ${response.statusText}`
          );
        }

        const recievedData = await response.json();
        const data = recievedData[0];
        console.log(data);
        setLogs(data); // saves first data entry to be able to revert bac to
        setRefueled(data.isRefueled ?? false);
        setFuel(data.fuelUsed ?? 0);
        setNotes(data.comment || "");
        setCompleted(data.isCompleted ?? false);
        setStartTime(data.startTime);
        setEndTime(data.endTime ?? new Date().toISOString());
        setCharacterCount(40 - (data.comment?.length || 0));
        setProductName(data.Equipment.name);
        // Use the stored duration (as a float) or calculate it if not available
        const durationString = data.duration
          ? calculateDuration(data.duration, data.startTime, data.endTime)
          : calculateDuration(
              null,
              data.startTime,
              data.endTime ?? new Date().toISOString()
            );

        // Split the duration string into hours, minutes, and seconds
        const [hours, minutes, seconds] = durationString.split(":");
        setChangedDurationHours(hours);
        setChangedDurationMinutes(minutes);
        setChangedDurationSeconds(seconds);
        setChangedDuration(durationString);
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEquipmentForm();
  }, [params.id]);

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

  const handleDurationHrsChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setChangedDurationHours(event.target.value);
    setChangedDuration(
      `${event.target.value}:${changedDurationMinutes}:${changedDurationSeconds}`
    );
  };

  const handleDurationMinChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setChangedDurationMinutes(event.target.value);
    setChangedDuration(
      `${changedDurationHours}:${event.target.value}:${changedDurationSeconds}`
    );
  };

  const handleDurationSecChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setChangedDurationSeconds(event.target.value);
    setChangedDuration(
      `${changedDurationHours}:${changedDurationMinutes}:${event.target.value}`
    );
  };
  const handleEditClick = () => {
    setIsEditMode(true);
  };

  const handleSaveClick = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.append("endTime", new Date().toISOString());
    formData.append("id", params.id.toString());
    formData.append("completed", "true");
    formData.append("comment", notes);
    formData.append("isRefueled", refueled.toString());
    formData.append("fuelUsed", fuel.toString());
    formData.append("duration", changedDuration);

    try {
      await updateEmployeeEquipmentLog(formData);
      setIsEditMode(false);
      router.replace("/dashboard/equipment");
    } catch (error) {
      console.error("Error updating equipment log:", error);
    }
  };

  const deleteHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.append("id", params.id.toString());
    try {
      await DeleteLogs(formData);
      router.replace("/dashboard/equipment");
    } catch (error) {
      console.error("Error deleting log:", error);
    }
  };

  if (isLoading) {
    return (
      <>
        <Holds background={"white"} className="`row-span-1 h-full">
          <TitleBoxes
            title="Loading..."
            type="noIcon"
            titleImg="/current.svg"
            titleImgAlt="Current"
            variant="default"
            size="default"
          />
        </Holds>
        <Holds background={"white"} className=" row-span-9 h-full ">
          <Holds>
            <Texts size={"p2"}>{t("Loading")}</Texts>
          </Holds>
          <Spinner />
        </Holds>
      </>
    );
  }

  if (error) {
    return (
      <Holds background={"white"} className="h-full ">
        <Holds>
          <Texts color={"red"} size={"p2"}>
            Error: {error}
          </Texts>
        </Holds>
        <Holds>
          <Buttons
            size={"50"}
            onClick={() => {
              setError("");
              router.refresh();
            }}
          >
            Try again
          </Buttons>
        </Holds>
      </Holds>
    );
  }

  return (
    <>
      {completed && (
        <Banners
          position={"absolute"}
          background="green"
          className="z-10 h-7 top-0 p-1"
        >
          <Texts
            position={"center"}
            text={"white"}
            size={"p6"}
            className=" py-0"
          >
            {t("Banner")}
          </Texts>
        </Banners>
      )}
      <Holds background={"white"} className="my-auto row-span-1 h-full">
        <Contents width={"section"}>
          <TitleBoxes
            title={productName}
            type="noIcon"
            titleImg="/current.svg"
            titleImgAlt="Current"
            variant="default"
            size="default"
          />
        </Contents>
      </Holds>
      <Holds className=" row-span-9 h-full ">
        <Grids rows={"10"} gap={"5"}>
          <Holds background={"white"} className="row-span-3 h-full ">
            <Contents width={"section"}>
              {/* Edit Form */}
              <Labels size={"p1"}>{t("Duration")}</Labels>
              <Holds
                position={"row"}
                className="space-x-5 justify-between my-auto"
              >
                <Holds size={"20"}>
                  <Holds>
                    <Labels position={"center"}>Hrs</Labels>
                    <Inputs
                      type="text"
                      name="duration-hrs"
                      value={changedDurationHours}
                      onChange={handleDurationHrsChange}
                      disabled={isEditMode || !completed ? false : true}
                    />
                  </Holds>
                </Holds>
                <Holds size={"20"}>
                  <Holds>
                    <Labels position={"center"}>Min</Labels>
                    <Inputs
                      type="text"
                      name="duration-min"
                      value={changedDurationMinutes}
                      onChange={handleDurationMinChange}
                      disabled={isEditMode || !completed ? false : true}
                    />
                  </Holds>
                </Holds>
                <Holds size={"20"}>
                  <Holds>
                    <Labels position={"center"}>Sec</Labels>
                    <Inputs
                      type="text"
                      name="duration-sec"
                      value={changedDurationSeconds}
                      onChange={handleDurationSecChange}
                      disabled={isEditMode || !completed ? false : true}
                    />
                  </Holds>
                </Holds>
              </Holds>
            </Contents>
          </Holds>
          <Holds background={"white"} className="row-span-3 h-full py-2">
            <Contents width={"section"}>
              <Holds position={"row"} className="space-x-4 my-auto">
                <Holds size={"80"}>
                  <Labels>{t("Refueled")}</Labels>
                </Holds>
                <Holds size={"20"}>
                  <Checkbox
                    id={"1"}
                    name={"refueled"}
                    label={""}
                    defaultChecked={refueled}
                    disabled={isEditMode || !completed ? false : true}
                    onChange={(e) => {
                      setRefueled(e.target.checked);
                      return Promise.resolve();
                    }}
                  />
                </Holds>
              </Holds>

              {refueled && (
                <Holds position={"row"} className="space-x-4 my-auto">
                  <Holds size={"70"}>
                    <Labels>{t("Gallons")}</Labels>
                  </Holds>
                  <Holds size={"30"}>
                    <Inputs
                      type="number"
                      name="fuelUsed"
                      value={fuel}
                      onChange={(e) => setFuel(e.target.valueAsNumber)}
                      disabled={isEditMode || !completed ? false : true}
                      placeholder="Enter gallons"
                      className="h-10"
                    />
                  </Holds>
                </Holds>
              )}
            </Contents>
          </Holds>

          <Holds background={"white"} className="row-span-3 h-full">
            <Contents width={"section"}>
              <Holds className="my-auto">
                <Labels>{t("Notes")}</Labels>
                <TextAreas
                  name="comment"
                  value={notes}
                  onChange={(e) => {
                    setNotes(e.target.value);
                    setCharacterCount(40 - e.target.value.length);
                  }}
                  maxLength={40}
                  placeholder="Enter notes here"
                  disabled={isEditMode || !completed ? false : true}
                />
                <Texts position={"right"} color="gray" size="p6">
                  {characterCount} Characters
                </Texts>
              </Holds>
            </Contents>
          </Holds>

          <Holds position={"row"} className=" my-auto row-span-1 h-full">
            {/* Submit Form */}
            {!completed && (
              <Forms onSubmit={handleSaveClick}>
                <Buttons type="submit" background="green">
                  {t("Submit")}
                </Buttons>
              </Forms>
            )}
            {isEditMode && completed && (
              <Forms onSubmit={handleSaveClick}>
                <Buttons type="submit" background="green">
                  {t("Submit")}
                </Buttons>
              </Forms>
            )}
            {/* Edit Toggle */}
            {!isEditMode && completed && (
              <Forms>
                <Buttons onClick={handleEditClick} background="orange">
                  {t("Edit")}
                </Buttons>
              </Forms>
            )}
            {/* Delete Form */}
            <Forms onSubmit={deleteHandler}>
              <Buttons type="submit" background="red" className="">
                {t("Delete")}
              </Buttons>
            </Forms>
          </Holds>
        </Grids>
      </Holds>
    </>
  );
}
