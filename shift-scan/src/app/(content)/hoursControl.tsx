"use client";
import { useMemo, useState, useEffect } from "react";
import ViewComponent from "../(content)/hourView";
import { useSavedPayPeriodTimeSheet } from "../context/SavedPayPeriodTimeSheets";
import { BarChartComponent } from "@/app/(content)/hourData";
import { useTranslations } from "next-intl";
import { useSavedPayPeriodHours } from "../context/SavedPayPeriodHours";
import { Contents } from "@/components/(reusable)/contents";
import { Texts } from "@/components/(reusable)/texts";
import test from "node:test";
import { Button } from "@nextui-org/react";
import { Buttons } from "@/components/(reusable)/buttons";

interface ControlComponentProps {
  toggle: (toggle: boolean) => void;
}

const ControlComponent: React.FC<ControlComponentProps> = ({ toggle }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentDate, setCurrentDate] = useState(new Date());
  const { payPeriodTimeSheet } = useSavedPayPeriodTimeSheet();
  const t = useTranslations("Home");
  const { payPeriodHours } = useSavedPayPeriodHours();

  const calculatePayPeriodStart = () => {
    try{
    const startDate = new Date(2024, 7, 5); // August 5, 2024 ->later you can change this to the actual start date of the app/ first day of the pay period when the app is deployed
    const now = new Date();
    const diff = now.getTime() - startDate.getTime();
    const diffWeeks = Math.floor(diff / (2 * 7 * 24 * 60 * 60 * 1000)); // Two-week intervals
    return new Date(
      startDate.getTime() + diffWeeks * 2 * 7 * 24 * 60 * 60 * 1000
    );
  }
  catch{
    throw new Error("Failed to calculate pay period start date");
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
    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      hoursMap[dateKey(currentDate)] = 0;
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Accumulate the timesheet durations into the initialized dates
    if (payPeriodTimeSheet) {
      payPeriodTimeSheet.forEach((sheet) => {
        const dateKey = new Date(sheet.start_time).toISOString().split("T")[0];
        if (hoursMap[dateKey] !== undefined) {
          hoursMap[dateKey] += sheet.duration ?? 0;
        }
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
    <Contents variant={"hoursDisplay"} title={t("DA-Control-Title")}>
      {/* <Contents variant={"rowCenter"} size={null} >
          {t("DA-PayPeriod-Label")} {payPeriodHours} {t("Unit")}
      </Contents > */}
      <Contents variant={"default"} size={null} >
        <ViewComponent
          scrollLeft={scrollLeft}
          scrollRight={scrollRight}
          returnToMain={returnToMain}
          currentDate={currentDate}
          />
      </Contents>
      <Contents variant={"barsBG"} size={null}>
          <Contents size={null} style={{ margin: "auto", width: "100%", height: 300 }}>
          <BarChartComponent data={currentData} />
          </Contents>
        <Texts variant={"default"} size={"p0"}>
          {currentData.value.toFixed(1) || 0} {t("DA-Time-Label")}
        </Texts>
    </Contents>
    <Buttons href="/timesheets" variant={"green"} size={"widgetMed"} className="mt-10">
    <Texts variant={"default"} size={"p0"}>
      view my payroll
    </Texts>
    </Buttons>
    </Contents>
          </>
  );
};

export default ControlComponent;
