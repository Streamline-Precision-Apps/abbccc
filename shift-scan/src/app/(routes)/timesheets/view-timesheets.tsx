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

type Props = {
  user: string;
};

export default function ViewTimesheets({ user }: Props) {
  const [showTimesheets, setShowTimesheets] = useState(false);
  const [timesheetData, setTimesheetData] = useState<TimeSheet[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const t = useTranslations("Home");

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
                        {t("Duration")}
                        <Inputs
                          value={
                            timesheet.endTime && timesheet.startTime
                              ? `${(
                                  (new Date(timesheet.endTime).getTime() -
                                    new Date(timesheet.startTime).getTime()) /
                                  1000 /
                                  60 /
                                  60
                                ).toFixed(2)} ${t("Unit")}`
                              : "N/A"
                          }
                          readOnly
                        />
                      </Labels>

                      <Labels>
                        {t("StartTime")}
                        <Inputs
                          value={
                            timesheet.startTime
                              ? formatTime(timesheet.startTime) // Pass directly
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
                              ? formatTime(timesheet.endTime) // Pass directly
                              : "N/A"
                          }
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
                <Holds className="h-full">
                  <Texts size={"p3"} className="py-8">
                    {t("NoDataMessage")}
                  </Texts>
                </Holds>
              )}
            </Holds>
          ) : (
            <Holds background={"white"} className="pb-10 h-full min-h-[50vh]">
              <Holds position={"center"} size={"70"} className="my-10">
                <Texts size={"p3"}>{t("FirstMessage")}</Texts>
              </Holds>
            </Holds>
          )}

          {error && <Texts className="text-red-500">{error}</Texts>}
        </>
      )}
    </>
  );
}
