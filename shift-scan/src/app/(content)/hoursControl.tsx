"use client";
import { useMemo, useState, useEffect } from "react";
import ViewComponent from "../(content)/hourView";
import { useSavedPayPeriodTimeSheet } from "../context/SavedPayPeriodTimeSheets";
import { BarChartComponent } from "@/app/(content)/hourData";
import { useTranslations } from "next-intl";
import { useSavedPayPeriodHours } from "../context/SavedPayPeriodHours";

interface ControlComponentProps {
  toggle: (toggle: boolean) => void;
}

const ControlComponent: React.FC<ControlComponentProps> = ({ toggle }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentDate, setCurrentDate] = useState(new Date());
  const { payPeriodTimeSheet } = useSavedPayPeriodTimeSheet();
  const t = useTranslations("Home");
  const { payPeriodHours } = useSavedPayPeriodHours();

  // Calculate daily hours from the timesheets
  const dailyHours = useMemo(() => {
    const hoursMap: { [key: string]: number } = {};

    if (payPeriodTimeSheet) {
      console.log(payPeriodTimeSheet);
      payPeriodTimeSheet.forEach((sheet) => {
        // Convert start_time to a Date object and extract only the date part
        const dateKey = new Date(sheet.start_time).toISOString().split("T")[0];

        // Accumulate the duration for each date
        if (!hoursMap[dateKey]) {
          hoursMap[dateKey] = 0;
        }
        hoursMap[dateKey] += sheet.duration ?? 0;
        console.log(hoursMap);
      });
    }

    // Convert hoursMap to an array of objects sorted by date
    return Object.entries(hoursMap)
      .map(([date, hours]) => ({ date, hours }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [payPeriodTimeSheet]);

  // Set the initial index based on the current date
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    const todayIndex = dailyHours.findIndex(entry => entry.date === today);
    if (todayIndex !== -1) {
      setCurrentIndex(todayIndex);
    }
  }, [dailyHours]);

  // Current data based on index
  const currentData = useMemo(() => {
    console.log(dailyHours);
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
    <>
      <div className="border bg-gray-200 rounded mb-2">
        <ViewComponent
          scrollLeft={scrollLeft}
          scrollRight={scrollRight}
          returnToMain={returnToMain}
          currentDate={currentDate}
        />
      </div>
      <div className="p-1 border-2 border-black rounded flex flex-col items-center justify-center w-full">
        <p className="text-xs p-1">
          {t("DA-PayPeriod-Label")} {payPeriodHours} {t("Unit")}
        </p>
        {/* This div needs to be here for the chart to render correctly. */}
        <div style={{ width: "80%", height: 180 }}>
          <BarChartComponent data={currentData} currentIndex={currentIndex} />
        </div>
        <h2>
          {currentData.value || 0} {t("DA-Time-Label")}
        </h2>
      </div>
    </>
  );
};

export default ControlComponent;
