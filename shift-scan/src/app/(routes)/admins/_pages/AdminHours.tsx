"use client";
import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { usePayPeriodTimeSheet } from "@/app/context/PayPeriodTimeSheetsContext";
import { useTranslations } from "next-intl";
import { Texts } from "@/components/(reusable)/texts";
import { Holds } from "@/components/(reusable)/holds";
import { Grids } from "@/components/(reusable)/grids";
import AdminHourControls from "./AdminHourControls";

const calculatePayPeriodStart = () => {
  const startDate = new Date(2024, 7, 5); // August 5, 2024
  const now = new Date();
  const diff = now.getTime() - startDate.getTime();
  const diffWeeks = Math.floor(diff / (2 * 7 * 24 * 60 * 60 * 1000)); // Two-week intervals
  return new Date(
    startDate.getTime() + diffWeeks * 2 * 7 * 24 * 60 * 60 * 1000
  );
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
    const dateKey = (date: Date) => date.toISOString().split("T")[0];
    const hoursMap: Record<string, number> = {};
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      hoursMap[dateKey(currentDate)] = 0;
      currentDate.setDate(currentDate.getDate() + 1);
    }

    if (payPeriodTimeSheet) {
      payPeriodTimeSheet.forEach((sheet) => {
        const sheetDateKey = new Date(sheet.startTime)
          .toISOString()
          .split("T")[0];
        if (hoursMap[sheetDateKey] !== undefined) {
          (hoursMap[sheetDateKey] +=
            (new Date(sheet.endTime).getTime() -
              new Date(sheet.startTime).getTime()) /
            (1000 * 60 * 60)),
            0;
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
    const today = new Date().toISOString().split("T")[0];
    const todayIndex = dailyHours.findIndex((entry) => entry.date === today);
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
                <Texts size="p4">
                  {data.hours !== 0 ? data.hours.toFixed(1) : ""}
                </Texts>
                <Texts size="p4">
                  {data.hours === 0 &&
                  data.date <= new Date().toISOString().split("T")[0]
                    ? `0 `
                    : ""}
                </Texts>
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
                    : data.date === new Date().toISOString().split("T")[0]
                    ? `${t("Today")}`
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
