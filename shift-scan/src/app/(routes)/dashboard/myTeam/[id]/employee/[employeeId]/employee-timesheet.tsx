"use client";

import { ChangeEvent, useState } from "react";
import { fetchTimesheets } from "@/actions/timeSheetActions";
import { Holds } from "@/components/(reusable)/holds";
import { Titles } from "@/components/(reusable)/titles";
import { Contents } from "@/components/(reusable)/contents";
import { Inputs } from "@/components/(reusable)/inputs";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import EditWorkNew from "./editWork-new";
import { TimeSheet } from "@/lib/types";

export const EmployeeTimeSheets = () => {
  const [date, setDate] = useState<string>(""); // State for selected date
  const { employeeId } = useParams(); // Get employeeId from the URL
  const [edit, setEdit] = useState(false);
  const t = useTranslations("MyTeam");
  const [timeSheets, setTimeSheets] = useState<TimeSheet[]>([]); // State for storing timesheets

  // Handle date selection and fetch timesheets
  const handleDateChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const selectedDate = e.target.value; // This should be a valid 'YYYY-MM-DD' date
    setDate(selectedDate); // Update the state with the selected date

    if (selectedDate) {
      try {
        // Pass correct parameters: employeeId and selectedDate
        const fetchedTimeSheets = await fetchTimesheets(
          employeeId as string,
          selectedDate
        );
        // TODO check to ensure this functions right. It was updated for build fixes.

        setTimeSheets(fetchedTimeSheets as unknown as TimeSheet[]);
      } catch (error) {
        console.error("Error fetching timesheets:", error);
      }
    }
  };

  return (
    <Holds background={"darkBlue"}>
      <Contents width={"section"}>
        {/* Input for selecting a date */}
        <Holds>
          <Titles text={"white"} position={"left"}>
            {t("SelectDate")}
          </Titles>
          <Inputs
            type="date"
            name="date"
            id="date"
            value={date} // Bind input value to state
            className="flex justify-center m-auto text-black text-2xl bg-white p-2 border-2 border-black rounded-2xl"
            onChange={handleDateChange} // Use onChange to handle input
          />
        </Holds>
      </Contents>

      {/* Render the timesheets using EditWorkNew */}
      {timeSheets.length > 0 && (
        <>
          <Holds size={"full"} className="w-full h-full">
            <EditWorkNew timesheet={timeSheets} edit={edit} setEdit={setEdit} />
          </Holds>
        </>
      )}

      {/* Display a message if no timesheets are found */}
      {date && timeSheets.length === 0 && (
        <Holds size={"full"} className="my-5">
          <Titles text={"white"}>{t("NoTimesheetsFound")}</Titles>
        </Holds>
      )}
    </Holds>
  );
};
