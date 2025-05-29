// components/Panel.tsx
"use client";
import { motion, AnimatePresence } from "framer-motion";

export type PanelData = {
  date: string;
  hours?: number;
  isPlaceholder?: boolean;
};

function isPlaceholderData(data: PanelData): data is { date: string; isPlaceholder: true } {
  return data.isPlaceholder === true;
}

export default function Panel({
  data,
  isCenter,
  distanceFromCenter = 0, // new prop for distance
}: {
  data: PanelData;
  isCenter: boolean;
  /**
   * The number of panel positions away from the center (0=center, 1=adjacent, etc.)
   */
  distanceFromCenter?: number;
}) {
  const maxBarHeight = 200;

  if (isPlaceholderData(data)) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-w-[33.3333%] snap-center">
        <div className="w-16 h-16 rounded-full bg-white border-2 border-gray-400 flex items-center justify-center text-xs text-gray-500 text-center px-1">
          {data.date}
        </div>
      </div>
    );
  }

  // Opacity based on distance from the focused (center) panel
  const maxDistance = 4; // fade out after 4 panels away
  const normalizedDistance = Math.min(Math.abs(distanceFromCenter), maxDistance);
  // No opacity change for center and adjacent panels
  const contentOpacity = normalizedDistance <= 1 ? 1 : 1 - 0.18 * normalizedDistance;
  const scale = isCenter ? 1 : 1 - 0.04 * normalizedDistance;

  // Bar color logic: orange for current date, green for others
  const isToday = data.date === new Date().toLocaleDateString('en-CA');
  const barColor = isToday ? '#FF8800' : '#1E7D2C'; // orange for today, green for others

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={data.date}
        initial={{ scale: 0.95 }}
        animate={{
          scale
        }}
        exit={{ scale: 0.95 }}
        transition={{ duration: 0.35, ease: 'easeInOut' }}
        className="flex flex-col items-center justify-end h-full min-w-[33.3333%] snap-center"
        style={{ willChange: 'scale' }}
      >
        <motion.div
          layout
          animate={{
            backgroundColor: isCenter ? '#1E7D2C' : '#e5e7eb',
            borderRadius: isCenter ? '12px' : '8px',
            scale: isCenter ? 1 : 0.95,
            opacity: contentOpacity
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="relative w-11/12 h-full p-4 flex items-end justify-center"
        >
          {/* Only render the vertical bar, remove the horizontal bar */}
          <motion.div
            initial={{ height: 0 }}
            animate={{
              height: Math.min(((data.hours ?? 0) / 12) * maxBarHeight, maxBarHeight),
              opacity: contentOpacity
            }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className={`w-5/6 rounded-md ${isToday ? 'bg-[#FF8800]' : isCenter ? 'bg-green-500' : distanceFromCenter === 1 || distanceFromCenter === -1 ? 'bg-blue-500' : 'bg-blue-500'}`}
          />
        </motion.div>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: contentOpacity, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="text-lg font-bold text-center text-white"
        >
          {Math.floor((data.hours ?? 0) * 10) / 10} hrs
        </motion.p>
      </motion.div>
    </AnimatePresence>
  );
}

// Helper to get today's date in local time as YYYY-MM-DD
const getTodayString = () => new Date().toLocaleDateString('en-CA');
