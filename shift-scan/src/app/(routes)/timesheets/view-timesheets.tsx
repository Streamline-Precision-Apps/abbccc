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
import { z } from "zod";
import { TimeSheet } from "@/lib/types";

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
  const [timesheetData, setTimesheetData] = useState<TimeSheet[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const t = useTranslations("Home");

  // Validate initial state with Zod schema
  try {
    ViewTimesheetsSchema.parse({
      user,
      showTimesheets,
      timesheetData,
      loading,
      error,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("Initial state validation error:", error.errors);
    }
  }

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
    setError(null);
    try {
      const dateIso = date
        ? new Date(date).toISOString().slice(0, 10)
        : undefined;
      const queryParam = dateIso ? `?date=${dateIso}` : "";
      const response = await fetch(`/api/getTimesheets${queryParam}`);

      if (!response.ok) {
        throw new Error("Failed to fetch timesheets");
      }

      const data: TimeSheet[] = await response.json();
      setTimesheetData(data);
      setShowTimesheets(true);
    } catch (error) {
      setError("Error fetching timesheets");
      console.error(error);
    } finally {
      setLoading(false);
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
          {error && <Texts className="text-red-500">{error}</Texts>}
        </Contents>
      </Holds>

      {loading ? (
        <Holds
          background={"white"}
          size={"full"}
          className="h-full min-h-[50vh]"
        >
          <Holds position={"center"} size={"50"} className="my-10 ">
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
            className="h-full min-h-[50vh]"
          >
            {timesheetData.length > 0 ? (
              timesheetData.map((timesheet) => (
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
                          timesheet.startTime
                            ? formatTime(timesheet.startTime.toString())
                            : "N/A"
                        }
                        readOnly
                      />
                    </Labels>
                    <Labels>
                      {t("EndTime")}
                      <Inputs
                        value={
                          timesheet.endTime
                            ? formatTime(timesheet.endTime.toString())
                            : "N/A"
                        }
                        readOnly
                      />
                    </Labels>
                    <Labels>
                      {t("Duration")}
                      <Inputs
                        value={calculateDuration(
                          timesheet.startTime,
                          timesheet.endTime
                        )}
                        readOnly
                      />
                    </Labels>
                    <Labels>
                      {t("Jobsite")}
                      <Inputs value={timesheet.jobsiteId} readOnly />
                    </Labels>
                    <Labels>
                      {t("CostCode")}
                      <Inputs value={timesheet.costcode} readOnly />
                    </Labels>
                  </Holds>
                </Holds>
              ))
            ) : (
              <Titles size={"h2"} className="pt-8">
                {t("NoData")}
              </Titles>
            )}
          </Holds>
        )
      )}
    </>
  );
}
