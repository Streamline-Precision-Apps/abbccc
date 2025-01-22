"use client";
import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { usePayPeriodTimeSheet } from "@/app/context/PayPeriodTimeSheetsContext";
import { useTranslations } from "next-intl";
import { Texts } from "@/components/(reusable)/texts";
import { Holds } from "@/components/(reusable)/holds";
import { Grids } from "@/components/(reusable)/grids";
import AdminHourControls from "./AdminHourControls";
import { toZonedTime } from "date-fns-tz";
import {
  startOfWeek as startOfWeekFn,
  differenceInCalendarWeeks as differenceInCalendarWeeksFn,
  addWeeks as addWeeksFn,
} from "date-fns";
const MST_TIMEZONE = "America/Denver";

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

export default function AdminHours() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const { payPeriodTimeSheet } = usePayPeriodTimeSheet();
  const t = useTranslations("Home");
  const dailyHoursCache = useRef<{ date: string; hours: number }[] | null>(
    null
  );

  const calculateDailyHours = useCallback(() => {
    const startDate = calculatePayPeriodStart();
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 13); // Two-week period
    const dateKey = (date: Date) => {
      return date.toString(); // makes a Date key to group hours
    };
    const hoursMap: Record<string, number> = {};
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      const zonedDate = toZonedTime(currentDate, MST_TIMEZONE);
      hoursMap[dateKey(zonedDate)] = 0;
      currentDate.setDate(currentDate.getDate() + 1);
    }

    if (payPeriodTimeSheet) {
      payPeriodTimeSheet.forEach((sheet) => {
        const sheetStart = toZonedTime(sheet.startTime, MST_TIMEZONE); // get start time in MST
        const sheetEnd = toZonedTime(sheet.endTime, MST_TIMEZONE); // get end time in MST
        const sheetDateKey = toZonedTime(
          sheetStart.toISOString().split("T")[0],
          MST_TIMEZONE
        ).toString();

        if (hoursMap[sheetDateKey] !== undefined) {
          // makes sure the date key exists
          const hours =
            (sheetEnd.getTime() - sheetStart.getTime()) / (1000 * 60 * 60); // calculate hours
          hoursMap[sheetDateKey] += hours; // add hours to the date key
        }
      });
    }

    return Object.entries(hoursMap)
      .map(([date, hours]) => ({ date, hours }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [payPeriodTimeSheet]);

  const dailyHours = useMemo(() => {
    const calculatedHours = dailyHoursCache.current || calculateDailyHours();
    dailyHoursCache.current = calculatedHours;
    return calculatedHours;
  }, [calculateDailyHours]);

  useEffect(() => {
    const today = toZonedTime(new Date(), MST_TIMEZONE); // get today in MST
    today.setHours(0, 0, 0, 0).toString(); // set hours to 0 to match the date key
    console.log("Today", today);
    const todayIndex = dailyHours.findIndex(
      (entry) =>
        toZonedTime(new Date(entry.date), MST_TIMEZONE).toString() ===
        today.toString()
    );
    console.log("todayIndex", todayIndex);
    if (todayIndex !== -1) {
      setCurrentIndex(todayIndex);
    }
  }, [dailyHours]);
  // Calculate the slice range for a fixed window of 14 items
  const start = Math.max(0, currentIndex - 2);
  const end = start + 5;
  const visibleHours = dailyHours.slice(start, end); // Slice for 14 items only

  const calculateBarHeight = (value: number) => {
    if (value === 0) return 100;
    if (value > 0 && value <= 1) return 20;
    if (value > 1 && value <= 2) return 30;
    if (value > 2 && value <= 3) return 30;
    if (value > 3 && value <= 4) return 40;
    if (value > 4 && value <= 5) return 50;
    if (value > 5 && value <= 6) return 60;
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

  return (
    <Grids rows="7" gap="5">
      <Holds background="darkBlue" className="row-span-2 h-[100px]">
        <AdminHourControls
          scrollLeft={scrollLeft}
          scrollRight={scrollRight}
          currentDate={dailyHours[currentIndex]?.date}
          dataRangeStart={dailyHours[0]?.date}
          dataRangeEnd={dailyHours[dailyHours.length - 1]?.date}
        />
      </Holds>

      <Holds position="row" className="row-span-5 w-full">
        {visibleHours.map((data, index) => (
          <Holds key={index} className="px-2 py-2 h-full w-[20%]">
            <Holds
              className={`h-full border-[3px] rounded-[10px] p-1 flex justify-end
              ${
                data.date === new Date().toISOString().split("T")[0]
                  ? "bg-app-dark-blue border-[4px] border-white"
                  : "bg-slate-400 border-black"
              }
                 ${
                   data.date === dailyHours[currentIndex]?.date
                     ? "border-[5px]  border-app-green "
                     : " "
                 } `}
            >
              {/* The background is is a certain color depending on the hours you worked  */}
              <Holds
                className={`rounded-[10px] ${
                  data.date === new Date().toISOString().split("T")[0]
                    ? "justify-center"
                    : "justify-end"
                } ${
                  data.hours > 8
                    ? "bg-app-green justify-center"
                    : data.hours > 0
                    ? "bg-app-orange justify-center"
                    : " mb-5"
                }`}
                style={{
                  height: `${calculateBarHeight(data.hours)}%`,
                  border: data.hours ? "3px solid black" : "none",
                }}
              >
                {/*If the date text is black and greater than 0 */}
                <Texts className="text-black" size="p6">
                  {data.hours !== 0
                    ? `${data.hours.toFixed(1)} ${t("DA-Time-Label")}`
                    : ""}
                </Texts>

                {/*If the date is not the current date and the hours are 0  */}
                <Texts className="text-black" size="p4">
                  {data.hours === 0 &&
                  data.date <= new Date().toISOString().split("T")[0] &&
                  data.date !== new Date().toISOString().split("T")[0]
                    ? `0 `
                    : ""}
                </Texts>

                {/*If the date is the current date and the hours are 0  */}
                <Texts className="text-white" size="p4">
                  {data.hours === 0 &&
                  data.date === new Date().toISOString().split("T")[0] &&
                  data.date === new Date().toISOString().split("T")[0]
                    ? `0 `
                    : ""}
                </Texts>
                {/*If the date is the current date and the hours are 0 it is white */}
                <Texts
                  size="p4"
                  className={`${
                    data.date === new Date().toISOString().split("T")[0] &&
                    data.hours === 0
                      ? "text-white"
                      : "text-black"
                  }`}
                >
                  {data.date <= new Date().toISOString().split("T")[0]
                    ? `${t("DA-Time-Label")}`
                    : ""}
                </Texts>
              </Holds>
            </Holds>
          </Holds>
        ))}
      </Holds>
    </Grids>
  );
}
