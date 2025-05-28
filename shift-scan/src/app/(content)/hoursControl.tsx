"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { Holds } from "@/components/(reusable)/holds";
import { Grids } from "@/components/(reusable)/grids";
import ViewComponent from "../(content)/hourView";
import TopControlPanel from "./_hoursComponents/topControlPanel";
import { useCalculateDailyHours } from "./_hoursComponents/calculateDailyHours";
import { motion } from "framer-motion";
import Panel, { PanelData } from "./hourViewPanels";

// ----------------------------------------
// Type guard: checks if a data entry is a placeholder (i.e. label like "Start of Pay Period")
// ----------------------------------------
function isPlaceholderData(
  data: { date: string; hours?: number; isPlaceholder?: boolean }
): data is { date: string; isPlaceholder: boolean } {
  return data.isPlaceholder === true;
}

// ----------------------------------------
// Main Component: Controls the hourly scrollable view with navigation and center focus behavior
// ----------------------------------------
export default function ControlComponent({ toggle }: { toggle: (toggle: boolean) => void }) {
  const [currentIndex, setCurrentIndex] = useState(1); // tracks which panel is currently centered
  const dailyHoursCache = useRef<{ date: string; hours: number }[] | null>(null); // caching calculated hours
  const calculateDailyHours = useCalculateDailyHours(); // hook to calculate work hours per day
  const containerRef = useRef<HTMLDivElement>(null); // ref to the scrolling container
  const wasProgrammaticScroll = useRef(false); // flag to distinguish between user and programmatic scroll

  // ----------------------------------------
  // Memoize the hours data so it's only calculated once
  // ----------------------------------------
  const dailyHours = useMemo(() => {
    if (dailyHoursCache.current) return dailyHoursCache.current;
    const calculated = calculateDailyHours();
    dailyHoursCache.current = calculated;
    return calculated;
  }, [calculateDailyHours]);

  // ----------------------------------------
  // Add placeholder panels to the beginning and end
  // ----------------------------------------
  const extendedDailyHours = useMemo(() => {
    if (dailyHours.length === 0) return [];
    return [
      { date: "Start of Pay Period", isPlaceholder: true },
      ...dailyHours,
      { date: "End of Pay Period", isPlaceholder: true },
    ];
  }, [dailyHours]);

  // ----------------------------------------
  // Scroll a panel into the center position of the viewport
  // ----------------------------------------
  const scrollToIndexCentered = (index: number, smooth = true) => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const panelWidth = container.clientWidth / 3; // panel occupies 1/3 of the container

    let scrollLeft = (index - 1) * panelWidth;

    // Clamp scrolling within container bounds
    scrollLeft = Math.max(0, Math.min(scrollLeft, container.scrollWidth - container.clientWidth));

    wasProgrammaticScroll.current = true;
    container.style.scrollSnapType = "none"; // disable snapping temporarily
    container.scrollTo({
      left: scrollLeft,
      behavior: smooth ? "smooth" : "auto",
    });

    // Re-enable snapping after scroll
    setTimeout(() => {
      if (container) container.style.scrollSnapType = "x mandatory";
      wasProgrammaticScroll.current = false;
    }, 300);
  };

  // ----------------------------------------
  // On initial mount or data change, scroll to today’s panel or default to index 1
  // ----------------------------------------
  useEffect(() => {
    if (extendedDailyHours.length === 0) return;

    const todayDateStr = new Date().toISOString().slice(0, 10);

    const todayIndex = extendedDailyHours.findIndex(
      (d) => !isPlaceholderData(d) && d.date === todayDateStr
    );

    if (todayIndex !== -1) {
      setCurrentIndex(todayIndex + 1); // offset due to placeholder at the beginning
      scrollToIndexCentered(todayIndex + 1, false);
    } else {
      setCurrentIndex(1); // fallback
      setTimeout(() => scrollToIndexCentered(1, false), 100);
    }
  }, [extendedDailyHours]);

  // ----------------------------------------
  // When user stops scrolling, snap to the closest panel
  // ----------------------------------------
  const onScrollEnd = () => {
    if (wasProgrammaticScroll.current || !containerRef.current) return;

    const container = containerRef.current;
    const panelWidth = container.clientWidth / 3;
    const scrollLeft = container.scrollLeft;

    // Determine which panel is closest to center
    let closestIndex = Math.round(scrollLeft / panelWidth) + 1;

    // Clamp index to avoid snapping to placeholder panels
    closestIndex = Math.min(Math.max(closestIndex, 1), extendedDailyHours.length - 2);

    if (closestIndex !== currentIndex) {
      setCurrentIndex(closestIndex);
      scrollToIndexCentered(closestIndex, true);
    }
  };

  // ----------------------------------------
  // Navigate to previous panel
  // ----------------------------------------
  const scrollLeft = () => {
    if (currentIndex > 1) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      scrollToIndexCentered(newIndex);
    }
  };

  // ----------------------------------------
  // Navigate to next panel
  // ----------------------------------------
  const scrollRight = () => {
    if (currentIndex < extendedDailyHours.length - 2) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      scrollToIndexCentered(newIndex);
    }
  };

  // ----------------------------------------
  // Trigger return to the main view (outside this panel system)
  // ----------------------------------------
  const returnToMain = () => toggle(false);

  // ----------------------------------------
  // JSX Layout: Grid layout with top panel, center scrollable view, and bottom nav
  // ----------------------------------------
  return (
    <Grids rows="6" gap="5" className="h-full w-full">
      {/* Top panel controls */}
      <Holds position="row" className="row-span-1 h-full w-full">
        <TopControlPanel returnToMain={returnToMain} />
      </Holds>

      {/* Center panel with horizontally scrollable day panels */}
      <Holds className="row-span-4 h-full w-full rounded-[10px] overflow-hidden">
        <motion.div
          ref={containerRef}
          className="flex h-full overflow-x-auto scroll-smooth snap-x snap-mandatory"
          style={{ overscrollBehaviorX: "contain" }}
          onScroll={() => {
            if (containerRef.current) {
              clearTimeout((containerRef.current as any)._scrollTimeout);
              (containerRef.current as any)._scrollTimeout = setTimeout(onScrollEnd, 100);
            }
          }}
        >
          {extendedDailyHours.map((data, idx) => (
            <Panel key={`${data.date}-${idx}`} data={data} isCenter={idx === currentIndex} />
          ))}
        </motion.div>
      </Holds>

      {/* Bottom view for navigation and date display */}
      <Holds className="row-span-1 h-full w-full">
        <ViewComponent
          scrollLeft={scrollLeft}
          scrollRight={scrollRight}
          currentDate={extendedDailyHours[currentIndex]?.date || ""}
        />
      </Holds>
    </Grids>
  );
}
