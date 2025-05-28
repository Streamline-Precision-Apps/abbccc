"use client";
import { useState, useEffect, useMemo, useRef } from "react";
import ViewComponent from "../(content)/hourView";
import { Holds } from "@/components/(reusable)/holds";
import { Grids } from "@/components/(reusable)/grids";
import LeftBar from "./_hoursComponents/leftBar";
import CenterBar from "./_hoursComponents/centerBar";
import RightBar from "./_hoursComponents/rightBar";
import TopControlPanel from "./_hoursComponents/topControlPanel";
import { useCalculateDailyHours } from "./_hoursComponents/calculateDailyHours";
import { motion, AnimatePresence } from "framer-motion";

type ControlComponentProps = {
  toggle: (toggle: boolean) => void;
};

export default function ControlComponent({ toggle }: ControlComponentProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<"left" | "right">("right");
  const dailyHoursCache = useRef<{ date: string; hours: number }[] | null>(
    null
  );
  const calculateDailyHours = useCalculateDailyHours();

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
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayIndex = dailyHours.findIndex(
      (entry) => new Date(entry.date).getTime() === today.getTime()
    );
    if (todayIndex !== -1) {
      setCurrentIndex(todayIndex);
    }
  }, [dailyHours]);

  const prevData = dailyHours[currentIndex - 1] || { date: "", hours: 0 };
  const currentData = dailyHours[currentIndex] || { date: "", hours: 0 };
  const nextData = dailyHours[currentIndex + 1] || { date: "", hours: 0 };

  const scrollLeft = () => {
    if (currentIndex > 0) {
      setDirection("left");
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const scrollRight = () => {
    if (currentIndex < dailyHours.length - 1) {
      setDirection("right");
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const returnToMain = () => {
    toggle(false);
  };

  return (
    <Grids rows="6" gap="5" className="h-full w-full">
      <Holds position={"row"} className="row-span-1 h-full w-full">
        <TopControlPanel returnToMain={returnToMain} />
      </Holds>

      <Holds className="row-span-4 h-full w-full rounded-[10px] overflow-hidden">
        <Holds position="row" className="h-full w-full">
          <Grids cols={"3"} gap="6" className="h-full w-full">
            <LeftBar prevData={prevData} />
            <CenterBar currentData={currentData} />
            <RightBar nextData={nextData} />
          </Grids>
        </Holds>
      </Holds>

      <Holds className="row-span-1 h-full w-full">
        <ViewComponent
          scrollLeft={scrollLeft}
          scrollRight={scrollRight}
          currentDate={currentData.date}
        />
      </Holds>
    </Grids>
  );
}
