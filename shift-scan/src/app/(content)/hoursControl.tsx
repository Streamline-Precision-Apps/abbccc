"use client";
import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import ViewComponent from "../(content)/hourView";
import { Holds } from "@/components/(reusable)/holds";
import { Grids } from "@/components/(reusable)/grids";
import LeftBar from "./_hoursComponents/leftBar";
import CenterBar from "./_hoursComponents/centerBar";
import RightBar from "./_hoursComponents/rightBar";
import TopControlPanel from "./_hoursComponents/topControlPanel";
import { useCalculateDailyHours } from "./_hoursComponents/calculateDailyHours";
import { AnimatePresence, motion } from "framer-motion";
import { set } from "date-fns";

type ControlComponentProps = {
  toggle: (toggle: boolean) => void;
};

/**
 * Main control component for displaying and navigating time tracking data.
 */
export default function ControlComponent({ toggle }: ControlComponentProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<"left" | "right">("right");
  const dailyHoursCache = useRef<{ date: string; hours: number }[] | null>(
    null
  );
  const calculateDailyHours = useCalculateDailyHours();

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
    const today = new Date(); // get today
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
      setCurrentIndex((prev) => prev - 1);
      setDirection("left");
    }
  };

  const scrollRight = () => {
    if (currentIndex < dailyHours.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setDirection("right");
    }
  };

  const returnToMain = () => {
    toggle(false);
  };

  const carouselVariants = {
    enter: (direction: string) => ({
      x: direction === "left" ? "33.33%" : "-33.33%",
      opacity: 0,
    }),
    center: {
      x: "0%",
      opacity: 1,
    },
    exit: (direction: string) => ({
      x: direction === "left" ? "-33.33%" : "33.33%",
      opacity: 0,
    }),
  };

  return (
    <Grids rows="6" gap="5" className="h-full w-full">
      <Holds position={"row"} className="row-span-1 h-full w-full">
        <TopControlPanel returnToMain={returnToMain} />
      </Holds>

      <Holds className="row-span-4 h-full w-full rounded-[10px]">
        <Holds position="row" className="h-full w-full">
          {/* Render prevData only if it exists */}

          <Grids cols={"3"} gap="6" className="h-full w-full">
            <AnimatePresence custom={direction} mode="popLayout">
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={carouselVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="h-full w-full"
              >
                <LeftBar prevData={prevData} />
              </motion.div>
            </AnimatePresence>
            <AnimatePresence custom={direction} mode="popLayout">
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={carouselVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="h-full w-full"
              >
                <CenterBar currentData={currentData} />
              </motion.div>
            </AnimatePresence>
            <AnimatePresence custom={direction} mode="popLayout">
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={carouselVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="h-full w-full"
              >
                <RightBar nextData={nextData} />
              </motion.div>
            </AnimatePresence>
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
