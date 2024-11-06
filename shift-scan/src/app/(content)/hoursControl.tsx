"use client";
import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import ViewComponent from "../(content)/hourView";
import { usePayPeriodTimeSheet } from "../context/PayPeriodTimeSheetsContext";
import { useTranslations } from "next-intl";

import { Texts } from "@/components/(reusable)/texts";
import { Buttons } from "@/components/(reusable)/buttons";
import { Holds } from "@/components/(reusable)/holds";
import { Grids } from "@/components/(reusable)/grids";

type ControlComponentProps = {
  toggle: (toggle: boolean) => void;
};

export default function ControlComponent({ toggle }: ControlComponentProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [todayIndex, setTodayIndex] = useState(0);
  const { payPeriodTimeSheet } = usePayPeriodTimeSheet();
  const t = useTranslations("Home");
  const dailyHoursCache = useRef<{ date: string; hours: number }[] | null>(
    null
  );

  const calculatePayPeriodStart = () => {
    const startDate = new Date(2024, 7, 5); // August 5, 2024
    const now = new Date();
    const diff = now.getTime() - startDate.getTime();
    const diffWeeks = Math.floor(diff / (2 * 7 * 24 * 60 * 60 * 1000)); // Two-week intervals
    return new Date(
      startDate.getTime() + diffWeeks * 2 * 7 * 24 * 60 * 60 * 1000
    );
  };

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
          hoursMap[sheetDateKey] += sheet.duration ?? 0;
        }
      });
    }

    return Object.entries(hoursMap)
      .map(([date, hours]) => ({ date, hours }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [payPeriodTimeSheet]);

  // calls the previous function and created a new array
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
    const today = new Date().toISOString().split("T")[0];
    const todayIndex = dailyHours.findIndex((entry) => entry.date === today);
    if (todayIndex !== -1) {
      setCurrentIndex(todayIndex + 1);
      setTodayIndex(todayIndex + 1);
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
    <Grids rows="7" gap="5">
      <Holds
        background="darkBlue"
        className="row-span-2 h-full shadow-[8px_8px_0px_grey]"
      >
        <ViewComponent
          returnToMain={returnToMain}
          scrollLeft={scrollLeft}
          scrollRight={scrollRight}
          currentDate={new Date(currentData.date)}
        />
      </Holds>

      <Holds
        position="row"
        className="row-span-4 border-black border-[3px] rounded-2xl shadow-[8px_8px_0px_grey]"
      >
        {[prevData, currentData, nextData].map((data, index) => (
          <Holds
            key={index}
            className={`mx-auto ${
              currentData.date === data.date
                ? "px-2 py-2 h-full w-[30%]"
                : prevData.date === data.date
                ? "px-2 py-4 h-full w-[25%]"
                : nextData.date === data.date
                ? "px-2 py-4 h-full w-[25%]"
                : "px-2 py-4 h-full hidden xl:block xl:w-28"
            }`}
          >
            <Holds
              background={"darkBlue"}
              className={`h-full rounded-[10px] p-1 flex justify-end
                ${
                  // this is a ternary to style today with a green border and all the other days with a black border
                  data.date === Today.date
                    ? " border-[5px] border-app-green "
                    : " border-[3px] border-black"
                } ${
                // this is a ternary to style days with 0 hours before today
                data.hours === 0 &&
                data.date <= new Date().toISOString().split("T")[0]
                  ? " "
                  : ""
              }`}
            >
              <Holds
                // this is a ternary to style the hours inputs green, orange, or clear
                className={`rounded-[10px] justify-end ${
                  data.hours > 8 && data.hours !== 0
                    ? "bg-app-green"
                    : "bg-none"
                }
                    ${
                      data.hours < 8 && data.hours !== 0
                        ? "bg-app-orange"
                        : "bg-none"
                    }
                        
                     `}
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
                    ? data.hours
                    : ""}
                </Texts>
                <Texts size="p4">
                  {data.date <= new Date().toISOString().split("T")[0]
                    ? `${t("DA-Time-Label")}`
                    : ""}
                </Texts>
              </Holds>
            </Holds>
          </Holds>
        ))}
      </Holds>
      <Holds className="row-span-1 h-full">
        <Buttons href={"/timesheets"} background={"green"}>
          <Texts size={"p3"}>{t("TimeSheet-Label")}</Texts>
        </Buttons>
      </Holds>
    </Grids>
  );
}
