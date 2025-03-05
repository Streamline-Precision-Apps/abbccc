"use client";

import { Holds } from "@/components/(reusable)/holds";
import { useSearchParams } from "next/navigation";
import EmptyView from "../../../_pages/EmptyView";
import { useEffect, useState } from "react";
import { z } from "zod";
import { TimesheetSchema } from "@/lib/zod";
import { CSVLink } from "react-csv";
import { Texts } from "@/components/(reusable)/texts";
import { Grids } from "@/components/(reusable)/grids";
import Spinner from "@/components/(animations)/spinner";
import { useTranslations } from "next-intl";

const TimesheetsArraySchema = z.array(TimesheetSchema);

type TimeSheets = z.infer<typeof TimesheetsArraySchema>[number];

export default function ReportView() {
  const searchParams = useSearchParams();
  const t = useTranslations("Admins");
  const [readyToFetchData, setReadyToFetchData] = useState<boolean>(false);
  const [timeSheets, setTimeSheets] = useState<TimeSheets[]>([]);
  const [loading, setLoading] = useState(false);

  // Extract query parameters
  const page = searchParams.get("page") || "";
  const startDate = searchParams.get("startDate") || "";
  const endDate = searchParams.get("endDate") || "";

  useEffect(() => {
    setReadyToFetchData(true);
  }, [page, startDate, endDate]);

  useEffect(() => {
    if (readyToFetchData) {
      const fetchTimesheets = async () => {
        setLoading(true);
        try {
          const response = await fetch(
            `/api/getReport?page=${page}&startDate=${startDate}&endDate=${endDate}`
          );
          const data = await response.json();

          // Ensure data is an array
          if (Array.isArray(data)) {
            setTimeSheets(data);
          } else {
            console.error("Invalid data format: Expected an array.");
            setTimeSheets([]); // Reset to an empty array if invalid
          }
        } catch (error) {
          console.error("Error fetching timesheets:", error);
          setTimeSheets([]); // Reset to an empty array if there's an error
        } finally {
          setLoading(false);
        }
      };
      fetchTimesheets();
    }
  }, [readyToFetchData, page, startDate, endDate]);

  // Define the headers for the CSV
  const headers = [
    { label: "Submit Date", key: "submitDate" },
    { label: "Date", key: "date" },
    { label: "Cost Code", key: "costcode" },
    { label: "Vehicle ID", key: "vehicleId" },
    { label: "Start Time", key: "startTime" },
    { label: "End Time", key: "endTime" },
    { label: "Duration", key: "duration" },
    { label: "Starting Mileage", key: "startingMileage" },
    { label: "Ending Mileage", key: "endingMileage" },
    { label: "Left Idaho", key: "leftIdaho" },
    { label: "Equipment Hauled", key: "equipmentHauled" },
    { label: "Materials Hauled", key: "materialsHauled" },
    { label: "Hauled Loads Quantity", key: "hauledLoadsQuantity" },
    { label: "Refueling Gallons", key: "refuelingGallons" },
    { label: "Timesheet Comments", key: "timeSheetComments" },
    { label: "User ID", key: "userId" },
    { label: "Jobsite ID", key: "jobsiteId" },
  ];

  // Convert the timesheets to a format suitable for CSVLink
  const csvData = timeSheets.map((sheet) => ({
    submitDate: sheet.submitDate?.slice(0, 10),
    date: sheet.date?.slice(0, 10),
    costcode: sheet.costcode,
    vehicleId: sheet.vehicleId,
    startTime: sheet.startTime?.slice(11, 19),
    endTime: sheet.endTime?.slice(11, 19),
    duration: sheet.duration,
    startingMileage: sheet.startingMileage,
    endingMileage: sheet.endingMileage,
    leftIdaho: sheet.leftIdaho ? "Yes" : "No",
    equipmentHauled: sheet.equipmentHauled,
    materialsHauled: sheet.materialsHauled,
    hauledLoadsQuantity: sheet.hauledLoadsQuantity,
    refuelingGallons: sheet.refuelingGallons,
    timeSheetComments: sheet.timeSheetComments,
    userId: sheet.userId,
    jobsiteId: sheet.jobsiteId,
  }));

  //

  if (!page || !startDate || !endDate) {
    return (
      <Holds className="w-full h-full">
        <EmptyView Children={undefined} />
      </Holds>
    );
  }
  return (
    <Holds className="w-full h-full rounded-[10px]">
      {loading ? (
        <Holds className="w-full h-full justify-center items-center">
          <Spinner />
        </Holds>
      ) : timeSheets.length > 0 ? (
        <Grids rows={"12"} className="w-full h-full p-2">
          <Holds className="w-full h-full overflow-x-scroll row-start-2 row-end-13 border-[3px] border-app-dark-blue ">
            <table className="min-w-full border-collapse border border-gray-300 text-left">
              <thead>
                <tr className="bg-app-gray ">
                  {headers.map((header) => (
                    <th
                      key={header.key}
                      className="px-4 py-2 border border-gray-300 text-sm font-semibold text-gray-700"
                    >
                      {header.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {timeSheets.map((sheet, index) => (
                  <tr
                    key={index}
                    className={index % 2 === 0 ? "bg-white" : "bg-app-gray "}
                  >
                    <td className="px-4 py-2 border border-gray-300">
                      {new Date(sheet.submitDate).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2 border border-gray-300">
                      {new Date(sheet.date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2 border border-gray-300">
                      {sheet.costcode}
                    </td>
                    <td className="px-4 py-2 border border-gray-300">
                      {sheet.vehicleId}
                    </td>
                    <td className="px-4 py-2 border border-gray-300">
                      {sheet.startTime
                        ? new Date(sheet.startTime).toLocaleTimeString(
                            "en-US",
                            {
                              hour: "numeric",
                              minute: "numeric",
                              second: "numeric",
                              timeZone: "UTC",
                              hour12: true,
                            }
                          )
                        : ""}
                    </td>
                    <td className="px-4 py-2 border border-gray-300">
                      {sheet.endTime
                        ? new Date(sheet.endTime).toLocaleTimeString("en-US", {
                            hour: "numeric",
                            minute: "numeric",
                            second: "numeric",
                            timeZone: "UTC",
                            hour12: true,
                          })
                        : ""}
                    </td>
                    <td className="px-4 py-2 border border-gray-300">
                      {sheet.duration?.toFixed(2)}
                    </td>
                    <td className="px-4 py-2 border border-gray-300">
                      {sheet.startingMileage}
                    </td>
                    <td className="px-4 py-2 border border-gray-300">
                      {sheet.endingMileage}
                    </td>
                    <td className="px-4 py-2 border border-gray-300">
                      {sheet.leftIdaho ? "Yes" : "No"}
                    </td>
                    <td className="px-4 py-2 border border-gray-300">
                      {sheet.equipmentHauled}
                    </td>
                    <td className="px-4 py-2 border border-gray-300">
                      {sheet.materialsHauled}
                    </td>
                    <td className="px-4 py-2 border border-gray-300">
                      {sheet.hauledLoadsQuantity}
                    </td>
                    <td className="px-4 py-2 border border-gray-300">
                      {sheet.refuelingGallons}
                    </td>
                    <td className="px-4 py-2 border border-gray-300">
                      {sheet.timeSheetComments}
                    </td>
                    <td className="px-4 py-2 border border-gray-300">
                      {sheet.userId}
                    </td>
                    <td className="px-4 py-2 border border-gray-300">
                      {sheet.jobsiteId}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Holds>

          <Holds className="w-full h-full row-start-1 row-end-2 flex flex-row justify-end">
            <CSVLink
              data={csvData}
              headers={headers}
              filename={"timeSheets.csv"}
              target="_blank"
              className="bg-app-green h-full p-2 rounded-t-[10px]  text-white"
            >
              <Texts size={"p6"} className="h-full w-full">
                {t("DownloadAsCSV")}
              </Texts>
            </CSVLink>
          </Holds>
        </Grids>
      ) : (
        <EmptyView
          Children={<Texts size={"p6"}>{t("NoTimeSheetsFound")}</Texts>}
        />
      )}
    </Holds>
  );
}
