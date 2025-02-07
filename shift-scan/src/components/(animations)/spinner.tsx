import React from "react";

interface SpinnerProps {
  size?: number; // Size in pixels, default will be 40 (equivalent to `h-10 w-10`)
  color?: string;
}

export default function Spinner({
  size = 40,
  color = "border-app-dark-blue",
}: SpinnerProps) {
  return (
    <div className="flex justify-center items-center">
      <div
        className={`animate-spin-custom rounded-full border-b-2 ${color}`}
        style={{ height: size, width: size }}
      ></div>
    </div>
  );
}
