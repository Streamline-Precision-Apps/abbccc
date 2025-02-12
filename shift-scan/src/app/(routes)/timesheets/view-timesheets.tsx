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
import { formatTime } from "@/utils/formatDateAMPMS";
import { useTranslations } from "next-intl";
import { Contents } from "@/components/(reusable)/contents";
import { Grids } from "@/components/(reusable)/grids";
import { TimeSheet } from "@/lib/types";
import EmptyView from "@/components/(reusable)/emptyView";
import { Images } from "@/components/(reusable)/images";

type Props = {
  user: string;
};

export default function ViewTimesheets({ user }: Props) {
  const [showTimesheets, setShowTimesheets] = useState(false);
  const [timesheetData, setTimesheetData] = useState<TimeSheet[]>([]);
  const [loading, setLoading] = useState(false);

  const t = useTranslations("Home");

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
    <Grids rows={"7"} gap={"3"} className="h-full">
      <Holds
        background={"white"}
        className={`py-2 px-4 h-full row-start-1 row-end-3`}
      >
        <Contents width={"section"} className="h-full">
          <Forms onSubmit={handleSubmit} className="row-span-2 h-full">
            <Grids rows={"2"} className="h-full">
              <Holds className="row-start-1 row-end-2">
                <Inputs type="hidden" name="id" value={user} readOnly />
                <Labels size={"p4"}>{t("EnterDate")}</Labels>
                <Inputs type="date" name="date" defaultValue={currentDate} />
              </Holds>
              <Holds>
                <Buttons
                  type="submit"
                  background={"lightBlue"}
                  className="py-1"
                >
                  <Titles size={"h5"}>{t("SearchTimesheets")}</Titles>
                </Buttons>
              </Holds>
            </Grids>
          </Forms>
        </Contents>
      </Holds>
      {!showTimesheets && !loading && (
        <Holds
          background={"white"}
          size={"full"}
          className="h-full row-start-3 row-end-8"
        >
          <Holds position={"center"} className="h-full p-1">
            <EmptyView
              TopChild={
                <Titles size={"h3"} className="mt-4">
                  Search to view you old timesheets
                </Titles>
              }
              color={"bg-white"}
            />
          </Holds>
        </Holds>
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
            <Titles size={"h3"} className="mt-4">
              {t("Loading")}
            </Titles>
          </Holds>
        </Holds>
      ) : (
        showTimesheets && (
          <Holds
            background={"white"}
            size={"full"}
            className="h-full row-start-3 row-end-8 overflow-auto no-scrollbar p-2"
          >
            {timesheetData.length > 0 ? (
              timesheetData.map((timesheet) => (
                <Holds
                  key={timesheet.id}
                  size={"full"}
                  className="px-5 py-3 border-[3px] border-black rounded-[10px] mb-5"
                >
                  <Grids cols={"8"} className="pb-4">
                    <Holds className="col-start-8 col-end-9">
                      <Images
                        titleImg={"/document-duplicate.svg"}
                        titleImgAlt={"Copy And Paste"}
                        onClick={() => copyToClipboard(timesheet.id)}
                      />
                    </Holds>
                  </Grids>
                  <Grids rows={"4"} cols={"2"} gap={"2"}>
                    <Holds className="col-start-1 col-end-3  h-full">
                      <Titles size={"h3"} className="underline">
                        {t("TotalHoursWorked")}
                      </Titles>
                      <Texts size={"p4"}>
                        {calculateDuration(
                          timesheet.startTime,
                          timesheet.endTime
                        )}{" "}
                        {"Hrs"}
                      </Texts>
                    </Holds>

                    <Labels size={"p4"}>
                      {t("StartTime")}
                      <Inputs
                        value={
                          timesheet.startTime
                            ? formatTime(timesheet.startTime.toString())
                            : "N/A"
                        }
                        readOnly
                        className="text-center"
                      />
                    </Labels>
                    <Labels size={"p4"}>
                      {t("EndTime")}
                      <Inputs
                        value={
                          timesheet.endTime
                            ? formatTime(timesheet.endTime.toString())
                            : "N/A"
                        }
                        readOnly
                        className="text-center"
                      />
                    </Labels>

                    <Labels size={"p4"}>
                      {t("Jobsite")}
                      <Inputs
                        value={timesheet.jobsiteId}
                        readOnly
                        className="pl-2"
                      />
                    </Labels>
                    <Labels size={"p4"}>
                      {t("CostCode")}
                      <Inputs
                        value={timesheet.costcode}
                        readOnly
                        className="pl-2"
                      />
                    </Labels>
                  </Grids>
                </Holds>
              ))
            ) : (
              <Holds
                size={"full"}
                className="h-full justify-center items-center"
              >
                {" "}
                <EmptyView
                  TopChild={<Titles size={"h2"}>{t("NoData")}</Titles>}
                  color={"bg-white"}
                />
              </Holds>
            )}
          </Holds>
        )
      )}
    </Grids>
  );
}
