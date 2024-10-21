"use client";
import { useMemo, useState, useEffect } from "react";
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

  // Calculate daily hours from the timesheets
  const dailyHours = useMemo(() => {
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
        const dateKey = new Date(sheet.startTime).toISOString().split("T")[0];
        if (hoursMap[dateKey] !== undefined) {
          hoursMap[dateKey] += sheet.duration ?? 0;
        }
      });
    }

    // Convert hoursMap to an array of objects sorted by date
    return Object.entries(hoursMap)
      .map(([date, hours]) => ({ date, hours }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [payPeriodTimeSheet, calculatePayPeriodStart]);

  // Set the initial index based on the current date
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    const todayIndex = dailyHours.findIndex((entry) => entry.date === today);
    if (todayIndex !== -1) {
      setCurrentIndex(todayIndex);
    }
  }, [dailyHours]);

  // Current data based on index
  const currentData = useMemo(() => {
    const currentDay = dailyHours[currentIndex];
    const prevDay = dailyHours[currentIndex - 1];
    const nextDay = dailyHours[currentIndex + 1];

    return {
      day: currentIndex + 1,
      value: currentDay ? currentDay.hours : 0,
      valuePrev: prevDay ? prevDay.hours : 0,
      valueNext: nextDay ? nextDay.hours : 0,
    };
  }, [currentIndex, dailyHours]);

  // Function to calculate the bar height in px
  // max px=300
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

  const scrollLeft = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prevIndex) => prevIndex - 1);
      setCurrentDate((prevDate) => {
        const newDate = new Date(prevDate);
        newDate.setDate(prevDate.getDate() - 1);
        return newDate;
      });
    }
  };

  const scrollRight = () => {
    if (currentIndex < dailyHours.length - 1) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
      setCurrentDate((prevDate) => {
        const newDate = new Date(prevDate);
        newDate.setDate(prevDate.getDate() + 1);
        return newDate;
      });
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
        <Holds //------------------------------------ First Bar
          className="h-full"
        >
          <Contents width={"section"} className="p-3 py-5">
            <Holds
              background={"darkBlue"}
              className="h-full border-black border-[3px] rounded-[10px] p-1 flex"
            >
              <div
                className={`border-black border-[3px] rounded-[10px]
              ${
                currentData.valuePrev === 0
                  ? "bg-clear"
                  : `h-[${calculateBarHeight(currentData.valuePrev)}px]`
              }
                ${
                  currentData.valuePrev > 8
                    ? "bg-app-green border-black border-[3px] rounded-[10px]"
                    : "bg-app-orange border-black border-[3px] rounded-[10px]"
                }
                ${currentData.valuePrev !== 0 ? "" : "bg-clear  border-none"}
                `}
              >
                <Texts size={"p3"}>
                  {currentData.valuePrev !== 0
                    ? `${currentData.valuePrev.toFixed(1)} ${t(
                        "DA-Time-Label"
                      )}`
                    : ""}
                </Texts>
              </div>
            </Holds>
          </Contents>
        </Holds>
        <Holds //------------------------------------ Second Bar
          className="h-full"
        >
          <Contents width={"section"} className="py-2">
            <Holds
              background={"darkBlue"}
              className="h-full border-black border-[3px] rounded-[10px] p-1 flex"
            >
              <Holds
                className={`
                ${
                  currentData.value === 0
                    ? "bg-clear"
                    : `h-[${calculateBarHeight(currentData.value)}px]`
                }  
                  ${
                    currentData.value > 8
                      ? "bg-app-green border-black border-[3px] rounded-[10px]"
                      : "bg-app-orange border-black border-[3px] rounded-[10px]"
                  }
                  ${currentData.value !== 0 ? "" : "bg-clear border-none"}
                  `}
              >
                <Texts size={"p3"}>
                  {currentData.value !== 0
                    ? `${currentData.value.toFixed(1)} ${t("DA-Time-Label")}`
                    : ""}
                </Texts>
              </Holds>
            </Holds>
          </Contents>
        </Holds>
        <Holds //------------------------------------ Third Bar
          className="h-full"
        >
          <Contents width={"section"} className="p-3 py-5">
            <Holds
              background={"darkBlue"}
              className="h-full border-black border-[3px] rounded-[10px] p-1 flex"
            >
              <Holds
                className={`border-black border-[3px] rounded-[10px]
                ${
                  currentData.valueNext === 0
                    ? "bg-clear"
                    : `h-[${calculateBarHeight(currentData.valueNext)}px] `
                }
                  ${
                    currentData.valueNext > 8
                      ? "bg-app-green border-black border-[3px] rounded-[10px]"
                      : "bg-app-orange border-black border-[3px] rounded-[10px]"
                  }
                  ${currentData.valueNext !== 0 ? "" : "bg-clear  border-none"}
                  `}
              >
                <Texts size={"p3"}>
                  {currentData.valueNext !== 0
                    ? `${currentData.valueNext.toFixed(1)} ${t(
                        "DA-Time-Label"
                      )}`
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
