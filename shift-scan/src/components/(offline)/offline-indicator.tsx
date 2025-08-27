"use client";
import React from "react";
import { useEnhancedOfflineStatus } from "@/hooks/useEnhancedOfflineStatus";

interface OfflineIndicatorProps {
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  className?: string;
}

export default function OfflineIndicator({
  position = "top-right",
  className = "",
}: OfflineIndicatorProps) {
  const { isOnline, summary } = useEnhancedOfflineStatus();

  if (isOnline && !summary.hasPending) {
    return null; // Don't show anything when online with no pending actions
  }

  const getPositionClasses = () => {
    switch (position) {
      case "top-left":
        return "top-4 left-4";
      case "top-right":
        return "top-4 right-4";
      case "bottom-left":
        return "bottom-4 left-4";
      case "bottom-right":
        return "bottom-4 right-4";
      default:
        return "top-4 right-4";
    }
  };

  const getStatusColor = () => {
    if (!isOnline) return "bg-amber-500";
    if (summary.hasErrors) return "bg-red-500";
    if (summary.hasPending) return "bg-blue-500";
    return "bg-green-500";
  };

  const getStatusText = () => {
    if (!isOnline) return "Offline";
    if (summary.hasErrors) return "Sync Error";
    if (summary.hasPending) return "Syncing";
    return "Online";
  };

  return (
    <div className={`fixed ${getPositionClasses()} z-50 ${className}`}>
      <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-3 py-1 shadow-sm text-sm">
        <div className={`w-2 h-2 rounded-full ${getStatusColor()}`}></div>
        <span className="text-gray-700 text-xs">{getStatusText()}</span>
        {summary.hasPending && (
          <span className="text-gray-500 text-xs">
            ({summary.hasPending ? "pending" : ""})
          </span>
        )}
      </div>
    </div>
  );
}
