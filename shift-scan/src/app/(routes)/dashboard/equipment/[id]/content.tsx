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
import { Grids } from "@/components/(reusable)/grids";
import Spinner from "@/components/(animations)/spinner";
import { Titles } from "@/components/(reusable)/titles";
import { EmployeeEquipmentLogs } from "@/lib/types";

export default function CombinedForm({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [logs, setLogs] = useState<EmployeeEquipmentLogs[]>([]);
  const [refueled, setRefueled] = useState(false);
  const [fuel, setFuel] = useState<number>(0);
  const [notes, setNotes] = useState<string>("");
  const [characterCount, setCharacterCount] = useState<number>(40);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [completed, setCompleted] = useState<boolean>(false);
  const [, setStartTime] = useState();
  const [, setEndTime] = useState();
  const [productName, setProductName] = useState("");

  const [changedDuration, setChangedDuration] = useState<string>("");
  const [changedDurationHours, setChangedDurationHours] = useState<string>("");
  const [changedDurationMinutes, setChangedDurationMinutes] =
    useState<string>("");
  const [changedDurationSeconds, setChangedDurationSeconds] =
    useState<string>("");

  const t = useTranslations("Equipment");
  const b = useTranslations("Widgets");

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

        setLogs(data); // saves first data entry to be able to revert bac to
        setRefueled(data.isRefueled);
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

  const handleRefueledChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRefueled(event.target.checked);
    setFuel(0);
  };

  useEffect(() => {
    if (completed) {
      setIsEditMode(false);
    }
    if (Array.isArray(logs) && logs.length > 0 && !isEditMode) {
      const log = logs[0];
      setRefueled(log.isRefueled ?? false);
      setFuel(log.fuelUsed ?? 0);
      setNotes(log.comment || "");
    }
  }, [isEditMode, completed, logs]);

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
      <Grids rows={"10"} gap={"5"}>
        <Holds
          background={"white"}
          className="row-span-2 h-full my-auto animate-pulse "
        >
          <TitleBoxes
            title="Loading..."
            type="noIcon"
            titleImg="/current.svg"
            titleImgAlt="Current"
            variant="default"
            size="default"
            className="my-auto"
          />
        </Holds>
        <Holds
          background={"white"}
          className=" row-span-2 h-full my-auto animate-pulse "
        >
          <Holds className="my-auto">
            <Spinner />
          </Holds>
        </Holds>
        <Holds
          background={"white"}
          className=" row-span-2 h-full my-auto animate-pulse  "
        >
          <Holds></Holds>
        </Holds>
        <Holds
          background={"white"}
          className=" row-span-3 h-full my-auto animate-pulse  "
        >
          <Holds></Holds>
        </Holds>
        <Holds className=" row-span-1 h-full my-auto  ">
          <Holds position={"row"} className="gap-4">
            <Buttons disabled className="h-full py-2">
              <Titles></Titles>
            </Buttons>
            <Buttons disabled className="h-full py-6">
              <Titles></Titles>
            </Buttons>
          </Holds>
        </Holds>
      </Grids>
    );
  }

  return (
    <Grids rows={"10"} gap={"5"}>
      <Holds background={"white"} className="my-auto row-span-2 h-full">
        <Contents width={"section"}>
          <TitleBoxes
            title={productName}
            type="noIcon"
            titleImg="/current.svg"
            titleImgAlt="Current"
            variant="default"
            size="default"
            href="/dashboard/equipment"
          />
        </Contents>
        {completed && (
          <Banners background={"green"} className=" rounded-b-xl h-1/2">
            <Texts position={"center"} text={"white"} size={"p6"} className="">
              {t("Banner")}
            </Texts>
          </Banners>
        )}
        {error && (
          <Banners background={"red"} className=" rounded-b-xl h-1/2">
            <Texts position={"center"} text={"white"} size={"p6"} className="">
              {error}
            </Texts>
          </Banners>
        )}
      </Holds>

      <Holds background={"white"} className="row-span-2 h-full">
        <Contents width={"section"} className="h-full">
          <Grids rows={"2"} cols={"4"} className="h-full ">
            <Holds
              className={`my-auto col-span-3 ${
                refueled ? "row-span-1" : "row-span-2"
              } `}
            >
              <Holds>
                <Texts size={"p2"} position={"left"}>
                  {t("Refueled")}
                </Texts>
              </Holds>
            </Holds>
            <Holds
              position={"right"}
              className={`row-span-1 col-span-1 my-auto ${
                refueled ? "row-span-1" : "row-span-2"
              }`}
            >
              <Checkbox
                id={"1"}
                name={"refueled"}
                label={""}
                size={refueled ? 2 : 3}
                defaultChecked={refueled}
                disabled={isEditMode || !completed ? false : true}
                onChange={handleRefueledChange}
              />
            </Holds>

            {refueled && (
              <>
                <Holds className="my-auto row-span-1 col-span-3">
                  <Texts size={"p2"} position={"left"}>
                    {t("Gallons")}
                  </Texts>
                </Holds>
                <Holds className="my-auto row-span-1 col-span-1 ">
                  <Inputs
                    type="number"
                    name="fuelUsed"
                    value={fuel}
                    min={0}
                    onChange={(e) => setFuel(e.target.valueAsNumber)}
                    disabled={isEditMode || !completed ? false : true}
                    className="border-[3px] text-center "
                  />
                </Holds>
              </>
            )}
          </Grids>
        </Contents>
      </Holds>

      <Holds background={"white"} className=" row-span-5 h-full ">
        <Contents width={"section"}>
          {/* Edit Form */}
          <Grids rows={"3"}>
            <Holds position={"row"} className="row-span-1  h-full">
              <Holds size={"50"}>
                <Texts position={"left"} size={"p2"}>
                  {t("Duration")}
                </Texts>
              </Holds>
              <Holds
                position={"row"}
                size={"50"}
                className={`${
                  !isEditMode && completed ? "bg-gray-400" : "bg-white"
                } border-[3px] border-black rounded-2xl py-1 my-auto justify-between`}
              >
                <Holds>
                  <Holds>
                    <Inputs
                      type="number"
                      name="duration-hrs"
                      min={0}
                      value={changedDurationHours}
                      onChange={handleDurationHrsChange}
                      disabled={isEditMode || !completed ? false : true}
                      className="border-0 text-center "
                    />
                  </Holds>
                </Holds>

                <Texts size={"p4"}>:</Texts>
                <Holds>
                  <Holds>
                    <Inputs
                      type="number"
                      name="duration-min"
                      min={0}
                      max={59}
                      value={changedDurationMinutes}
                      onChange={handleDurationMinChange}
                      disabled={isEditMode || !completed ? false : true}
                      className="border-0 text-center"
                    />
                  </Holds>
                </Holds>

                <Texts size={"p4"}>:</Texts>

                <Holds>
                  <Holds>
                    <Inputs
                      type="number"
                      name="duration-sec"
                      min={0}
                      max={59}
                      value={changedDurationSeconds}
                      onChange={handleDurationSecChange}
                      disabled={isEditMode || !completed ? false : true}
                      className="border-0 text-center"
                    />
                  </Holds>
                </Holds>
              </Holds>
            </Holds>

            <Holds position={"row"} className="row-span-2 h-full">
              <Holds className=" relative">
                <Labels>{t("Notes")}</Labels>
                <TextAreas
                  name="comment"
                  value={notes}
                  onChange={(e) => {
                    setNotes(e.target.value);
                    setCharacterCount(40 - e.target.value.length);
                  }}
                  maxLength={40}
                  minLength={1}
                  rows={5}
                  placeholder="Enter notes here"
                  disabled={isEditMode || !completed ? false : true}
                  style={{ resize: "none", width: "100%", height: "100%" }} // Disable resizing
                />
                <Holds className="absolute bottom-4 right-4">
                  <Texts position={"right"} size="p6" text={"black"}>
                    {characterCount}
                  </Texts>
                </Holds>
              </Holds>
            </Holds>
          </Grids>
        </Contents>
      </Holds>

      <Holds position={"row"} className=" row-span-1 my-auto h-full">
        {/* Delete Form */}
        <Contents width={"section"}>
          <Holds position={"row"} className="my-auto gap-4 h-full">
            <Forms
              onSubmit={deleteHandler}
              className="my-auto space-x-4 h-full"
            >
              <Buttons type="submit" background="red">
                <Titles>{b("Delete")}</Titles>
              </Buttons>
            </Forms>

            {/* Submit Form */}
            {!completed && (
              <Forms onSubmit={handleSaveClick} className="my-auto h-full">
                <Buttons type="submit" background="green">
                  <Titles>{b("Submit")}</Titles>
                </Buttons>
              </Forms>
            )}
            {isEditMode && completed && (
              <Forms onSubmit={handleSaveClick} className="my-auto h-full">
                <Buttons type="submit" background="green">
                  <Titles>{b("Save")}</Titles>
                </Buttons>
              </Forms>
            )}
            {/* Edit Toggle */}
            {!isEditMode && completed && (
              <Forms className="my-auto h-full">
                <Buttons onClick={handleEditClick} background="orange">
                  <Titles>{b("Edit")}</Titles>
                </Buttons>
              </Forms>
            )}
          </Holds>
        </Contents>
      </Holds>
    </Grids>
  );
}
