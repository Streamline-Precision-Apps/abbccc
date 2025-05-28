// components/Panel.tsx
"use client";
import { motion } from "framer-motion";

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
}: {
  data: PanelData;
  isCenter: boolean;
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

  return (
    <div className="flex flex-col items-center justify-end h-full min-w-[33.3333%] snap-center">
      <motion.div
        layout
        animate={{
          backgroundColor: isCenter ? "#1E7D2C" : "#e5e7eb",
          borderRadius: isCenter ? "12px" : "8px",
          scale: isCenter ? 1 : 0.95,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="relative w-11/12 h-full p-4 shadow-md flex items-end justify-center"
      >
        <motion.div
          initial={{ height: 0 }}
          animate={{
            height: Math.min(((data.hours ?? 0) / 12) * maxBarHeight, maxBarHeight),
          }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className={`w-3/4 rounded-md ${isCenter ? "bg-green-500" : "bg-blue-500"}`}
        />
      </motion.div>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="text-lg font-bold text-center text-white"
      >
        {Math.floor((data.hours ?? 0) * 10) / 10} hrs
      </motion.p>
    </div>
  );
}
