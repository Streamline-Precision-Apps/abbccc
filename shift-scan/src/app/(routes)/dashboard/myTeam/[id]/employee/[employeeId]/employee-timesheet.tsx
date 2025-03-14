"use client";

import { ChangeEvent, use, useEffect, useState } from "react";
import { fetchTimesheets } from "@/actions/timeSheetActions";
import { Holds } from "@/components/(reusable)/holds";
import { Titles } from "@/components/(reusable)/titles";
import { Contents } from "@/components/(reusable)/contents";
import { Inputs } from "@/components/(reusable)/inputs";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import EditWorkNew from "./editWork-new";

import { Grids } from "@/components/(reusable)/grids";
import { Labels } from "@/components/(reusable)/labels";
import { format } from "date-fns";
import { TimeSheet } from "@/lib/types";
import Spinner from "@/components/(animations)/spinner";

export const EmployeeTimeSheets = ({
  date,
  setDate,
  timeSheets,
  edit,
  setEdit,
  loading,
  manager,
}: {
  date: string;
  setDate: (date: string) => void;
  timeSheets: TimeSheet[];
  edit: boolean;
  setEdit: (edit: boolean) => void;
  loading: boolean;
  manager: string;
}) => {
  const t = useTranslations("MyTeam");

  return (
    <Holds background={"white"} className="h-full w-full">
      <Grids rows={"6"} className=" h-full w-full ">
        {loading ? (
          <Holds
            background={"white"}
            className="row-start-2 row-end-7 h-full justify-center items-center animate-pulse"
          >
            <Spinner size={70} />
          </Holds>
        ) : (
          <Holds className="row-start-2 row-end-7 h-full w-full overflow-y-scroll no-scrollbar">
            {timeSheets.length > 0 && (
              <EditWorkNew
                timeSheet={timeSheets}
                edit={edit}
                setEdit={setEdit}
                manager={manager}
              />
            )}

            {/* Display a message if no timesheets are found */}
            {date && timeSheets.length === 0 && (
              <Holds size={"full"} className="w-full h-full p-6">
                <Titles size={"h4"} text={"black"}>
                  {t("NoTimesheetsFound")}
                </Titles>
                <Titles size={"h5"} text={"black"}>
                  {t("ForThisDate")}
                </Titles>
              </Holds>
            )}
          </Holds>
        )}

        <Holds
          background={"darkBlue"}
          className="row-start-1 row-end-2 rounded-none h-full  "
        >
          <Labels
            size={"p5"}
            text={"white"}
            position={"left"}
            htmlFor="date"
            className="pl-1"
          >
            {t("SelectDate")}
          </Labels>
          <Inputs
            type="date"
            name="date"
            id="date"
            value={date} // Bind input value to state
            className="flex  text-black bg-white  border-2 border-black "
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setDate(e.target.value)
            }
          />
        </Holds>
      </Grids>
    </Holds>
  );
};
