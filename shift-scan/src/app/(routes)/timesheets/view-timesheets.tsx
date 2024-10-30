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
import { TimeSheet } from "../dashboard/myTeam/[id]/employee/[employeeId]/editWork";
import { z } from "zod";

// Zod schema for component state
const ViewTimesheetsSchema = z.object({
  user: z.string(),
  showTimesheets: z.boolean(),
  startingEntry: z.boolean(),
  timesheetData: z.array(
    z.object({
      id: z.string().nullable(),
      startTime: z.union([z.string(), z.instanceof(Date)]).nullable(),
      endTime: z.union([z.string(), z.instanceof(Date)]).nullable(),
      duration: z.number().nullable(),
      jobsiteId: z.string().nullable(),
      costcode: z.string().nullable(),
    })
  ),
  loading: z.boolean(),
  error: z.string().nullable(),
});

type Props = {
  user: string;
};

export default function ViewTimesheets({ user }: Props) {
  const [showTimesheets, setShowTimesheets] = useState(false);
  const [startingEntry] = useState(false);
  const [timesheetData, setTimesheetData] = useState<TimeSheet[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formattedTimes, setFormattedTimes] = useState<{
    [key: string]: { startTime: string; endTime: string };
  }>({});
  const t = useTranslations("Home");

  // Validate initial state with Zod schema
  try {
    ViewTimesheetsSchema.parse({
      user,
      showTimesheets,
      startingEntry,
      timesheetData,
      loading,
      error,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("Initial state validation error:", error.errors);
    }
  }

  // Fetch timesheets from the API
  const fetchTimesheets = async (date?: string) => {
    setLoading(true);
    try {
      const queryParam = date ? `?date=${date}` : "";
      const response = await fetch(`/api/getTimesheets${queryParam}`);

      if (!response.ok) {
        throw new Error("Failed to fetch timesheets");
      }

      const data: TimeSheet[] = await response.json();
      setTimesheetData(data);
      setShowTimesheets(true);

      // Format startTime and endTime asynchronously
      const formattedData: { [key: string]: { startTime: string; endTime: string } } =
        {};
      for (const timesheet of data) {
        if (timesheet.id) {
          formattedData[timesheet.id] = {
            startTime: timesheet.startTime
              ? await formatTime(timesheet.startTime.toString())
              : "N/A",
            endTime: timesheet.endTime
              ? await formatTime(timesheet.endTime.toString())
              : "N/A",
          };
        }
      }
      setFormattedTimes(formattedData);
    } catch (error) {
      setError("Error fetching timesheets");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget as HTMLFormElement);
    const date = formData.get("date")?.toString();
    await fetchTimesheets(date);
  };

  const currentDate = new Date().toISOString().split("T")[0]; // Format date as YYYY-MM-DD

  return (
    <>
      <Holds background={"white"} className="my-5 h-full">
        <Contents width={"section"}>
          <Grids rows={"2"} gap={"2"} className="py-5">
            <Forms onSubmit={handleSubmit} className="row-span-2">
              <Inputs type="hidden" name="id" value={user} readOnly />
              <Labels>{t("EnterDate")}</Labels>
              <Inputs type="date" name="date" defaultValue={currentDate} />
              <Buttons type="submit" background={"lightBlue"} className="py-2">
                <Titles size={"h3"}>{t("SearchTimesheets")}</Titles>
              </Buttons>
            </Forms>
          </Grids>
        </Contents>
      </Holds>

      {loading ? (
        <Holds
          background={"white"}
          size={"full"}
          className="h-full min-h-[50vh]"
        >
          <Holds position={"center"} size={"50"} className="my-10">
            <Spinner />
            <Titles size={"h3"} className="mt-4">
              {t("Loading")}
            </Titles>
          </Holds>
        </Holds>
      ) : (
        <>
          {showTimesheets ? (
            <Holds
              background={"white"}
              size={"full"}
              className="h-full min-h-[50vh]"
            >
              {timesheetData.length > 0 ? (
                <Titles size={"h2"} className="pt-8">
                  {`Timesheets Found (${timesheetData.length})`}
                </Titles>
              ) : (
                <Titles size={"h2"} className="pt-8">
                  {t("NoData")}
                </Titles>
              )}

              {timesheetData.length > 0 ? (
                timesheetData.map((timesheet) =>
                  timesheet.id ? (
                    <Holds
                      key={timesheet.id}
                      size={"full"}
                      className="odd:bg-app-blue rounded"
                    >
                      <Holds size={"70"} className="p-4 py-8">
                        <Labels>
                          {t("TimesheetID")}
                          <Inputs value={timesheet.id} readOnly />
                        </Labels>
                        <Labels>
                          {t("StartTime")}
                          <Inputs
                            value={
                              formattedTimes[timesheet.id]?.startTime || "N/A"
                            }
                            readOnly
                          />
                        </Labels>
                        <Labels>
                          {t("EndTime")}
                          <Inputs
                            value={formattedTimes[timesheet.id]?.endTime || "N/A"}
                            readOnly
                          />
                        </Labels>
                        <Labels>
                          {t("Duration")}
                          <Inputs
                            value={
                              timesheet.duration
                                ? `${timesheet.duration.toFixed(2)} ${t("Unit")}`
                                : "N/A"
                            }
                            readOnly
                          />
                        </Labels>
                        <Labels>
                          {t("Jobsite")}
                          <Inputs value={timesheet.jobsiteId || "N/A"} readOnly />
                        </Labels>
                        <Labels>
                          {t("CostCode")}
                          <Inputs value={timesheet.costcode || "N/A"} readOnly />
                        </Labels>
                      </Holds>
                    </Holds>
                  ) : null
                )
              ) : (
                <Holds className="h-full">
                  <Texts size={"p3"} className="py-8">
                    {t("NoDataMessage")}
                  </Texts>
                </Holds>
              )}
            </Holds>
          ) : (
            <Holds background={"white"} className="pb-10 h-full min-h-[50vh]">
              {startingEntry ? null : (
                <Holds position={"center"} size={"70"} className="my-10">
                  <Texts size={"p3"}>{t("FirstMessage")}</Texts>
                </Holds>
              )}
            </Holds>
          )}

          {error && <Texts className="text-red-500">{error}</Texts>}
        </>
      )}
    </>
  );
}
