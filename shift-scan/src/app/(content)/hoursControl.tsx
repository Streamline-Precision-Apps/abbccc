"use client";
import { useState, useEffect } from "react";
import ViewComponent from "../(content)/hourView";
import { usePayPeriodTimeSheet } from "../context/PayPeriodTimeSheetsContext";
import { useTranslations } from "next-intl";
import { Contents } from "@/components/(reusable)/contents";
import { Texts } from "@/components/(reusable)/texts";
import { Buttons } from "@/components/(reusable)/buttons";
import { Holds } from "@/components/(reusable)/holds";
import { Grids } from "@/components/(reusable)/grids";

type ControlComponentProps = {
  toggle: (toggle: boolean) => void;
};

export default function ControlComponent({ toggle }: ControlComponentProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentDate, setCurrentDate] = useState(new Date());
  const { payPeriodTimeSheet } = usePayPeriodTimeSheet();
  const t = useTranslations("Home");
  const e = useTranslations("Err-Msg");

  const calculatePayPeriodStart = () => {
    try {
      const startDate = new Date(2024, 7, 5); // August 5, 2024
      const now = new Date();
      const diff = now.getTime() - startDate.getTime();
      const diffWeeks = Math.floor(diff / (2 * 7 * 24 * 60 * 60 * 1000)); // Two-week intervals
      return new Date(
        startDate.getTime() + diffWeeks * 2 * 7 * 24 * 60 * 60 * 1000
      );
    } catch {
      throw new Error(e("CalculatePayPeriod"));
    }
  };

  // Calculate daily hours from the timesheets (no memoization)
  const calculateDailyHours = () => {
    const startDate = calculatePayPeriodStart();
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 13); // Two-week period

    const dateKey = (date: Date) => date.toISOString().split("T")[0];

    // Initialize daily hours with zeros for each date in the pay period
    const hoursMap: { [key: string]: number } = {};
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      hoursMap[dateKey(currentDate)] = 0;
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Accumulate the timesheet durations into the initialized dates
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

    // Convert hoursMap to an array of objects sorted by date
    return Object.entries(hoursMap)
      .map(([date, hours]) => ({ date, hours }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  // Dynamically calculate daily hours whenever current date or index changes
  const dailyHours = calculateDailyHours();

  // Set the initial index based on the current date
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    const todayIndex = dailyHours.findIndex((entry) => entry.date === today);
    if (todayIndex !== -1) {
      setCurrentIndex(todayIndex);
    }
  }, [dailyHours]);

  // Current data based on index
  const currentData = dailyHours[currentIndex] || { date: "", hours: 0 };
  const prevData = dailyHours[currentIndex - 1] || { date: "", hours: 0 };
  const nextData = dailyHours[currentIndex + 1] || { date: "", hours: 0 };

  // Function to calculate the bar height in px
  const calculateBarHeight = (value: number) => {
    if (value === 0) return 0;
    if (value > 0 && value <= 1) return 10;
    if (value > 1 && value <= 2) return 37.5;
    if (value > 2 && value <= 3) return 75;
    if (value > 3 && value <= 4) return 112.5;
    if (value > 4 && value <= 5) return 150;
    if (value > 5 && value <= 6) return 187.5;
    if (value > 6 && value <= 7) return 225;
    if (value > 7 && value <= 8) return 262.5;
    if (value > 8) return 300;
  };

  // Scroll left
  const scrollLeft = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prevIndex) => prevIndex - 1);
      setCurrentDate(
        (prevDate) => new Date(prevDate.setDate(prevDate.getDate() - 1))
      );
    }
  };

  // Scroll right
  const scrollRight = () => {
    if (currentIndex < dailyHours.length - 1) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
      setCurrentDate(
        (prevDate) => new Date(prevDate.setDate(prevDate.getDate() + 1))
      );
    }
  };

  const returnToMain = () => {
    toggle(false);
  };

  return (
    <Grids rows={"7"} gap={"5"}>
      <Holds
        background={"darkBlue"}
        className="row-span-2 h-full border-black border-[3px] shadow-[8px_8px_0px_grey]"
      >
        <ViewComponent
          scrollLeft={scrollLeft}
          scrollRight={scrollRight}
          returnToMain={returnToMain}
          currentDate={currentDate}
        />
      </Holds>

      <Holds
        background={"white"}
        position={"row"}
        className="row-span-4 border-black border-[3px] shadow-[8px_8px_0px_grey]"
      >
        {/* Bar for Previous Day */}
        <Holds className="h-full">
          <Contents width={"section"} className="p-3 py-5">
            <Holds
              background={"darkBlue"}
              className="h-full border-black border-[3px] rounded-[10px] p-1 flex"
            >
              <div
                className={`border-black border-[3px] rounded-[10px] ${
                  prevData.hours === 0
                    ? "bg-clear"
                    : `h-[${calculateBarHeight(prevData.hours)}px]`
                } ${prevData.hours > 8 ? "bg-app-green" : "bg-app-orange"}`}
              >
                <Texts size={"p3"}>
                  {prevData.hours !== 0
                    ? `${prevData.hours.toFixed(1)} ${t("DA-Time-Label")}`
                    : ""}
                </Texts>
              </div>
            </Holds>
          </Contents>
        </Holds>

        {/* Bar for Current Day */}
        <Holds className="h-full">
          <Contents width={"section"} className="py-2">
            <Holds
              background={"darkBlue"}
              className="h-full border-black border-[3px] rounded-[10px] p-1 flex"
            >
              <Holds
                className={`border-black border-[3px] rounded-[10px] ${
                  currentData.hours === 0
                    ? "bg-clear"
                    : `h-[${calculateBarHeight(currentData.hours)}px]`
                } ${currentData.hours > 8 ? "bg-app-green" : "bg-app-orange"}`}
              >
                <Texts size={"p3"}>
                  {currentData.hours !== 0
                    ? `${currentData.hours.toFixed(1)} ${t("DA-Time-Label")}`
                    : ""}
                </Texts>
              </Holds>
            </Holds>
          </Contents>
        </Holds>

        {/* Bar for Next Day */}
        <Holds className="h-full">
          <Contents width={"section"} className="p-3 py-5">
            <Holds
              background={"darkBlue"}
              className="h-full border-black border-[3px] rounded-[10px] p-1 flex"
            >
              <Holds
                className={`border-black border-[3px] rounded-[10px] ${
                  nextData.hours === 0
                    ? "bg-clear"
                    : `h-[${calculateBarHeight(nextData.hours)}px]`
                } ${nextData.hours > 8 ? "bg-app-green" : "bg-app-orange"}`}
              >
                <Texts size={"p3"}>
                  {nextData.hours !== 0
                    ? `${nextData.hours.toFixed(1)} ${t("DA-Time-Label")}`
                    : ""}
                </Texts>
              </Holds>
            </Holds>
          </Contents>
        </Holds>
      </Holds>

      <Holds className="row-span-1 h-full">
        <Buttons href={"/timesheets"} background={"green"}>
          <Texts size={"p3"}>{t("TimeSheet-Label")}</Texts>
        </Buttons>
      </Holds>
    </Grids>
  );
}
