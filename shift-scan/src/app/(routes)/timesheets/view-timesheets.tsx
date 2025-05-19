"use client";
import React, { useState } from "react";
import { Inputs } from "@/components/(reusable)/inputs";
import { Holds } from "@/components/(reusable)/holds";
import { Titles } from "@/components/(reusable)/titles";
import { Forms } from "@/components/(reusable)/forms";
import { Texts } from "@/components/(reusable)/texts";
import { Buttons } from "@/components/(reusable)/buttons";
import { Labels } from "@/components/(reusable)/labels";
import Spinner from "@/components/(animations)/spinner";
import { useTranslations } from "next-intl";
import { Grids } from "@/components/(reusable)/grids";
import { TimeSheet } from "@/lib/types";
import { Images } from "@/components/(reusable)/images";
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";
import { useRouter } from "next/navigation";
import TimesheetList from "./timesheetList";

type Props = {
  user: string;
};

export default function ViewTimesheets({ user }: Props) {
  const t = useTranslations("TimeSheet");
  const [showTimesheets, setShowTimesheets] = useState(false);
  const [timesheetData, setTimesheetData] = useState<TimeSheet[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Function to calculate duration
  const calculateDuration = (
    startTime: string | Date | null | undefined,
    endTime: string | Date | null | undefined
  ): string => {
    if (startTime && endTime) {
      const start = new Date(startTime).getTime();
      const end = new Date(endTime).getTime();
      const durationInMilliseconds = end - start;
      const durationInHours = durationInMilliseconds / (1000 * 60 * 60);
      return durationInHours.toFixed(2); // Format as hours with two decimals
    }
    return "N/A";
  };

  // Fetch timesheets from the API
  const fetchTimesheets = async (date?: string) => {
    setLoading(true);
    try {
      const dateIso = date
        ? new Date(date).toISOString().slice(0, 10)
        : undefined;
      const queryParam = dateIso ? `?date=${dateIso}` : "";
      const response = await fetch(`/api/getTimesheets${queryParam}`);

      const data: TimeSheet[] = await response.json();
      setTimesheetData(data);
      setShowTimesheets(true);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (timesheet: string) => {
    try {
      await navigator.clipboard.writeText(timesheet);
      // Optionally, provide user feedback:
      alert("Copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy!", err);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget as HTMLFormElement);
    const date = formData.get("date")?.toString();
    await fetchTimesheets(date);
  };

  const currentDate = new Date().toISOString().split("T")[0]; // Format date as YYYY-MM-DD

  return (
    <>
      <Holds
        position={"row"}
        background={"white"}
        className="row-span-1 w-full h-full"
      >
        <TitleBoxes
          onClick={() => {
            router.push("/");
          }}
        >
          <Holds
            position={"row"}
            className="w-full justify-center items-center gap-x-2"
          >
            <Titles size={"h2"}>{t("MyTimecards")}</Titles>
            <Images
              titleImg={"/timecards.svg"}
              titleImgAlt={`${t("Title")}`}
              className="w-8 h-8"
            />
          </Holds>
        </TitleBoxes>
      </Holds>
      <Holds className="row-start-2 row-end-8 h-full">
        <Grids rows={"7"} gap={"5"} className="h-full">
          <Holds
            background={"white"}
            className={`py-2 px-4 h-full row-start-1 row-end-3`}
          >
            <Forms onSubmit={handleSubmit} className=" h-full">
              <Grids rows={"2"} className="h-full">
                <Holds className="row-start-1 row-end-2">
                  <Inputs type="hidden" name="id" value={user} readOnly />
                  <Labels size={"p4"}>{t("EnterDate")}</Labels>
                  <Inputs
                    type="date"
                    name="date"
                    defaultValue={currentDate}
                    className="text-center"
                  />
                </Holds>
                <Holds>
                  <Buttons
                    type="submit"
                    background={"lightBlue"}
                    className="py-2"
                  >
                    <Titles size={"h5"}>{t("ViewTimecards")}</Titles>
                  </Buttons>
                </Holds>
              </Grids>
            </Forms>
          </Holds>
          {!showTimesheets && !loading && (
            <Holds
              background={"lightGray"}
              size={"full"}
              className="h-full row-start-3 row-end-8"
            />
          )}

          {loading ? (
            <Holds
              background={"white"}
              size={"full"}
              className="h-full row-start-3 row-end-8 animate-pulse"
            >
              <Holds
                position={"center"}
                size={"50"}
                className="h-full flex flex-col justify-center items-center "
              >
                <Spinner />
                <Texts size={"p3"} className="mt-4">
                  {t("LoadingTimecards")}
                </Texts>
              </Holds>
            </Holds>
          ) : (
            showTimesheets && (
              <Holds
                background={"white"}
                size={"full"}
                className="h-full row-start-3 row-end-8 overflow-auto no-scrollbar p-2 "
              >
                {timesheetData.length > 0 ? (
                  timesheetData.map((timesheet) => (
                    <TimesheetList
                      key={timesheet.id}
                      timesheet={timesheet}
                      calculateDuration={calculateDuration}
                      copyToClipboard={copyToClipboard}
                    />
                  ))
                ) : (
                  <Holds
                    size={"full"}
                    className="h-full justify-center items-center"
                  >
                    <Texts size={"p3"} className="text-gray-500 italic">
                      {t("NoTimecardsFoundForTheDaySelected")}
                    </Texts>
                  </Holds>
                )}
              </Holds>
            )
          )}
        </Grids>
      </Holds>
    </>
  );
}
