"use client";
import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import ViewComponent from "../(content)/hourView";
import { usePayPeriodTimeSheet } from "../context/PayPeriodTimeSheetsContext";
import { useTranslations } from "next-intl";
import { toZonedTime } from "date-fns-tz";
import {
  startOfWeek as startOfWeekFn,
  differenceInCalendarWeeks as differenceInCalendarWeeksFn,
  addWeeks as addWeeksFn,
} from "date-fns";

import { Texts } from "@/components/(reusable)/texts";
import { Buttons } from "@/components/(reusable)/buttons";
import { Holds } from "@/components/(reusable)/holds";
import { Grids } from "@/components/(reusable)/grids";
import { Images } from "@/components/(reusable)/images";
import { Titles } from "@/components/(reusable)/titles";

type ControlComponentProps = {
  toggle: (toggle: boolean) => void;
};
const MST_TIMEZONE = "America/Denver";

export default function ControlComponent({ toggle }: ControlComponentProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [todayIndex, setTodayIndex] = useState(0);
  const { payPeriodTimeSheet } = usePayPeriodTimeSheet();
  const t = useTranslations("Home");
  const dailyHoursCache = useRef<{ date: string; hours: number }[] | null>(
    null
  );

  const calculatePayPeriodStart = () => {
    const startDate = new Date(2024, 7, 5); // August 5, 2024 (Monday)
    const now = toZonedTime(new Date(), MST_TIMEZONE);

    // Find the most recent Monday
    const currentWeekStart = startOfWeekFn(now, { weekStartsOn: 1 }); // 1 = Monday

    // Calculate the number of weeks since the startDate
    const weeksSinceStart = differenceInCalendarWeeksFn(
      currentWeekStart,
      startDate,
      {
        weekStartsOn: 1,
      }
    );

    // Determine the current two-week period
    const payPeriodNumber = Math.floor(weeksSinceStart / 2);

    // Calculate the start of the current pay period
    const payPeriodStart = addWeeksFn(startDate, payPeriodNumber * 2);

    return toZonedTime(payPeriodStart, MST_TIMEZONE);
  };

  const calculateDailyHours = useCallback(() => {
    const startDate = calculatePayPeriodStart(); // get the start of the current pay period
    const endDate = new Date(startDate); // Clone to avoid mutating startDate
    endDate.setDate(endDate.getDate() + 13); // Mutate the end date to add 13 days for a Two-week period (14 days)

    const dateKey = (date: Date) => {
      return date.toString(); // makes a Date key to group hours
    };
    const hoursMap: Record<string, number> = {}; // makes a record to hold date key and hours
    const currentDate = new Date(startDate); // made a clone of startDate to avoid multiple date keys

    // PreCalculate hours for each day in the pay period to have a zero value starting point
    while (currentDate <= endDate) {
      const zonedDate = toZonedTime(currentDate, MST_TIMEZONE);
      hoursMap[dateKey(zonedDate)] = 0;
      currentDate.setDate(currentDate.getDate() + 1);
    }
    // take current time sheets and add them to the hours map
    if (payPeriodTimeSheet) {
      payPeriodTimeSheet.forEach((sheet) => {
        // Convert sheet times to MST
        const sheetStart = toZonedTime(sheet.startTime, MST_TIMEZONE); // get start time in MST
        const sheetEnd = toZonedTime(sheet.endTime, MST_TIMEZONE); // get end time in MST
        const sheetDateKey = toZonedTime(
          sheetStart.toISOString().split("T")[0],
          MST_TIMEZONE
        ).toString(); // Get put the timesheet under the same date key

        if (hoursMap[sheetDateKey] !== undefined) {
          // makes sure the date key exists
          const hours =
            (sheetEnd.getTime() - sheetStart.getTime()) / (1000 * 60 * 60); // calculate hours
          hoursMap[sheetDateKey] += hours; // add hours to the date key
        }
      });
    }
    // sort the hours map by date
    return Object.entries(hoursMap)
      .map(([date, hours]) => ({ date, hours }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [payPeriodTimeSheet]);

  // calls the previous function and creates a new array
  const dailyHours = useMemo(() => {
    if (dailyHoursCache.current) {
      return dailyHoursCache.current;
    } else {
      const calculatedHours = calculateDailyHours();
      dailyHoursCache.current = calculatedHours;
      return calculatedHours;
    }
  }, [calculateDailyHours]);

  useEffect(() => {
    const today = toZonedTime(new Date(), MST_TIMEZONE); // get today in MST
    today.setHours(0, 0, 0, 0).toString(); // set hours to 0 to match the date key
    const todayIndex = dailyHours.findIndex(
      (entry) =>
        toZonedTime(new Date(entry.date), MST_TIMEZONE).toString() ===
        today.toString()
    );
    if (todayIndex !== -1) {
      setCurrentIndex(todayIndex);
      setTodayIndex(todayIndex);
    }
  }, [dailyHours]);

  const Today = dailyHours[todayIndex] || { date: "", hours: 0 };
  const prevData = dailyHours[currentIndex - 1] || { date: "", hours: 0 };
  const currentData = dailyHours[currentIndex] || { date: "", hours: 0 };
  const nextData = dailyHours[currentIndex + 1] || { date: "", hours: 0 };

  const calculateBarHeight = (value: number) => {
    if (value === 0) return 50;
    if (value > 0 && value <= 1) return 50;
    if (value > 1 && value <= 2) return 50;
    if (value > 2 && value <= 3) return 50;
    if (value > 3 && value <= 4) return 50;
    if (value > 4 && value <= 5) return 60;
    if (value > 5 && value <= 6) return 70;
    if (value > 6 && value <= 7) return 80;
    if (value > 7 && value <= 8) return 90;
    if (value > 8) return 100;
  };

  const scrollLeft = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prevIndex) => prevIndex - 1);
    }
  };

  const scrollRight = () => {
    if (currentIndex < dailyHours.length - 1) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }
  };
  const returnToMain = () => {
    toggle(false);
  };

  return (
    <Grids rows="12" gap="5" className="h-full w-full">
      <Holds position={"row"} className="row-span-2">
        <Holds size={"20"} className="h-full mr-5">
          <Buttons background={"red"} onClick={returnToMain}>
            <Images
              titleImg={"/turnBack.svg"}
              titleImgAlt="return"
              className="mx-auto p-2"
            />
          </Buttons>
        </Holds>
        <Holds size={"80"} className="h-full">
          <Buttons href={"/timesheets"} background={"green"}>
            <Titles size={"h3"}>{t("TimeSheet-Label")}</Titles>
          </Buttons>
        </Holds>
      </Holds>

      <Holds className="row-span-10 h-full w-full rounded-[10px]">
        <Grids gap={"5"} className="h-full w-full">
          <Holds position="row" className="h-full w-full pt-2">
            {/* Render prevData only if it exists */}
            {prevData.date !== "" ? (
              <Holds className="mx-auto pt-6 h-full w-[25%]">
                <Holds
                  className={`h-full rounded-[10px] bg-white p-2 justify-end  ${
                    prevData.hours === 0 &&
                    prevData.date <=
                      toZonedTime(new Date(), MST_TIMEZONE)
                        .toISOString()
                        .split("T")[0]
                      ? ""
                      : ""
                  }`}
                >
                  <Holds
                    className={`rounded-[10px] ${
                      prevData.hours !== 0 ? "bg-app-blue" : ""
                    }`}
                    style={{
                      height: `${calculateBarHeight(prevData.hours)}%`,
                      border: prevData.hours ? "3px solid black" : "",
                    }}
                  ></Holds>
                </Holds>
                <Texts size="p6" text={"white"}>
                  {prevData.hours !== 0
                    ? `${prevData.hours.toFixed(1)} ${t("DA-Time-Label")}`
                    : `0.0 ${t("DA-Time-Label")}`}
                </Texts>
                <Texts size="p6" text={"white"}>
                  {prevData.hours === 0 &&
                  prevData.date <=
                    toZonedTime(new Date(), MST_TIMEZONE)
                      .toISOString()
                      .split("T")[0]
                    ? `${prevData.hours} ${t("DA-Time-Label")}`
                    : ""}
                </Texts>
                <Texts size="p6" text={"white"}>
                  {prevData.date <=
                  toZonedTime(new Date(), MST_TIMEZONE)
                    .toISOString()
                    .split("T")[0]
                    ? `${t("DA-Time-Label")}`
                    : ""}
                </Texts>
              </Holds>
            ) : (
              <Holds className="mx-auto pt-4 h-full w-[25%]" />
            )}

            {/* Render currentData */}
            <Holds className="mx-auto h-full w-[30%]">
              <Holds
                className={`h-full rounded-[10px] bg-app-dark-green p-2 flex justify-end ${
                  currentData.hours === 0 &&
                  currentData.date <=
                    toZonedTime(new Date(), MST_TIMEZONE)
                      .toISOString()
                      .split("T")[0]
                    ? " "
                    : ""
                }`}
              >
                <Holds
                  className={`rounded-[10px] justify-end ${
                    currentData.hours !== 0 ? "bg-app-green" : ""
                  }`}
                  style={{
                    height: `${calculateBarHeight(currentData.hours)}%`,
                    border: currentData.hours ? "3px solid black" : "none",
                  }}
                ></Holds>
              </Holds>
              <Texts size="p6" text={"white"}>
                {currentData.hours !== 0
                  ? `${currentData.hours.toFixed(1)} ${t("DA-Time-Label")}`
                  : `0.0 ${t("DA-Time-Label")}`}
              </Texts>
              <Texts size="p6" text={"white"}>
                {currentData.hours === 0 &&
                currentData.date <=
                  toZonedTime(new Date(), MST_TIMEZONE)
                    .toISOString()
                    .split("T")[0]
                  ? `${currentData.hours} ${t("DA-Time-Label")}`
                  : ""}
              </Texts>
              <Texts size="p6" text={"white"}>
                {currentData.date <=
                toZonedTime(new Date(), MST_TIMEZONE)
                  .toISOString()
                  .split("T")[0]
                  ? `${t("DA-Time-Label")}`
                  : ""}
              </Texts>
            </Holds>

            {/* Render nextData */}
            {nextData.date !== "" ? (
              <Holds className="mx-auto pt-4 rounded-[10px] h-full w-[25%]">
                <Holds
                  background="white"
                  className={`h-full rounded-[10px] p-2 flex justify-end ${
                    nextData.hours === 0 &&
                    nextData.date <=
                      toZonedTime(new Date(), MST_TIMEZONE)
                        .toISOString()
                        .split("T")[0]
                      ? " "
                      : ""
                  }`}
                >
                  <Holds
                    className={`rounded-[10px] ${
                      nextData.hours !== 0 ? "bg-app-blue" : ""
                    }`}
                    style={{
                      height: `${calculateBarHeight(nextData.hours)}%`,
                      border: nextData.hours ? "3px solid black" : "none",
                    }}
                  ></Holds>
                </Holds>
                <Texts size="p6" text={"white"}>
                  {nextData.hours !== 0
                    ? ` ${nextData.hours.toFixed(1)} ${t("DA-Time-Label")}`
                    : `0.0 ${t("DA-Time-Label")}`}
                </Texts>
                <Texts size="p6" text={"white"}>
                  {nextData.hours === 0 &&
                  nextData.date <=
                    toZonedTime(new Date(), MST_TIMEZONE)
                      .toISOString()
                      .split("T")[0]
                    ? `${nextData.hours} ${t("DA-Time-Label")}`
                    : ""}
                </Texts>
                <Texts size="p6" text={"white"}>
                  {nextData.date <=
                  toZonedTime(new Date(), MST_TIMEZONE)
                    .toISOString()
                    .split("T")[0]
                    ? `${t("DA-Time-Label")}`
                    : ""}
                </Texts>
              </Holds>
            ) : (
              <Holds className="mx-auto pt-6 h-full w-[25%]" />
            )}
          </Holds>

          <Holds className="h-full w-full">
            <ViewComponent
              scrollLeft={scrollLeft}
              scrollRight={scrollRight}
              currentDate={currentData.date}
            />
          </Holds>
        </Grids>
      </Holds>
    </Grids>
  );
}
