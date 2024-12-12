"use client";
import React, { useEffect, useState } from "react";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Texts } from "@/components/(reusable)/texts";
import { Selects } from "@/components/(reusable)/selects";
import { useRouter, useSearchParams } from "next/navigation";
import Spinner from "@/components/(animations)/spinner";
import { useTranslations } from "next-intl";

type TimeSheet = {
  submitDate?: Date;
  id: string;
  userId?: string;
  date?: Date;
  jobsiteId?: string;
  costcode?: string;
  nu?: string;
  Fp?: string;
  vehicleId?: number | null;
  startTime?: Date | string;
  endTime?: Date | string | null;
  duration?: number | null;
  startingMileage?: number | null;
  endingMileage?: number | null;
  leftIdaho?: boolean | null;
  equipmentHauled?: string | null;
  materialsHauled?: string | null;
  hauledLoadsQuantity?: number | null;
  refuelingGallons?: number | null;
  timeSheetComments?: string | null;
  status?: string;
};

export const Filter = ({ params }: { params: { employee: string } }) => {
  const t = useTranslations("Admins");
  const [filter, setFilter] = useState<string>("DENIED");
  const [userTimeSheets, setUserTimeSheets] = useState<TimeSheet[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchTimesheets = async () => {
      setLoading(true);
      if (!params.employee) {
        setError("Invalid employee ID.");
        return;
      }

      try {
        const response = await fetch(
          `/api/getTimesheets/${params.employee}?filter=${filter}`
        );
        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.statusText}`);
        }
        const data = await response.json();
        setUserTimeSheets(data.timesheets || []);
        setError(null);
      } catch (error) {
        console.error(`${t("FailedToFetch")} ${t("EmployeeData")}`, error);
        setError("Unable to load timesheets. Please try again later.");
      }
      setLoading(false);
    };

    fetchTimesheets();
  }, [filter, params.employee]);

  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newFilter = event.target.value.toUpperCase();
    setFilter(newFilter);
  };

  const handleDateClick = (date: string) => {
    // Add a query parameter for the selected date
    const updatedSearchParams = new URLSearchParams(searchParams.toString());
    updatedSearchParams.set("date", date);
    router.push(`?${updatedSearchParams.toString()}`);
  };

  return (
    <Holds background="white" position="row" className="h-full w-full">
      {error ? (
        <Texts className="text-red-500">{error}</Texts>
      ) : (
        <Grids rows="6" gap="3" className="h-full w-full">
          {/* Filter by category */}
          <Holds className="h-full w-full row-span-1">
            <Selects
              onChange={handleFilterChange}
              value={filter}
              className="h-16"
            >
              <option value="ALL">{t("All")}</option>
              <option value="DENIED">{t("Denied")}</option>
              <option value="APPROVED">{t("Approved")}</option>
              <option value="PENDING">{t("Pending")}</option>
            </Selects>
          </Holds>
          <Holds className="h-full w-full row-span-5 overflow-y-auto no-scrollbar border-[3px] border-black rounded-[10px] ">
            {loading ? (
              <Holds className=" bg-[#CACACA] h-full w-full justify-center">
                <Spinner />
              </Holds>
            ) : (
              <Holds className="p-2 h-full w-full">
                {/* Filter list */}
                {userTimeSheets.length > 0 ? (
                  userTimeSheets.map((timesheet) => (
                    <Holds
                      key={timesheet.id}
                      className="h-full w-full even:bg-gray-200 odd:bg-gray-100 rounded-[10px] px-2 py-4"
                      onClick={() =>
                        handleDateClick(
                          timesheet.submitDate
                            ? new Date(timesheet.submitDate)
                                .toISOString()
                                .split("T")[0]
                            : ""
                        )
                      }
                    >
                      <Holds position={"row"} className="h-full w-full  ">
                        <Holds position={"left"} className="h-full w-full">
                          <Texts position={"left"} size="p4">
                            {timesheet.submitDate
                              ? [
                                  t("Sunday"),
                                  t("Monday"),
                                  t("Tuesday"),
                                  t("Wednesday"),
                                  t("Thursday"),
                                  t("Friday"),
                                  t("Saturday"),
                                ][new Date(timesheet.submitDate).getDay()]
                              : ""}
                          </Texts>
                        </Holds>
                        <Holds position={"right"} className="h-full w-full">
                          <Texts position={"left"} size="p4">
                            {timesheet.submitDate
                              ? new Date(
                                  timesheet.submitDate
                                ).toLocaleDateString()
                              : "No Submit Date"}
                          </Texts>
                        </Holds>
                      </Holds>
                    </Holds>
                  ))
                ) : (
                  <Holds className=" bg-[#CACACA] h-full w-full justify-center">
                    <Texts size="p5">{t("NoTimeSheetsFound")}</Texts>
                  </Holds>
                )}
              </Holds>
            )}
          </Holds>
        </Grids>
      )}
    </Holds>
  );
};
