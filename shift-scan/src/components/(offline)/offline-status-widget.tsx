"use client";
import React from "react";
import { useEnhancedOfflineStatus } from "@/hooks/useEnhancedOfflineStatus";
import { Holds } from "@/components/(reusable)/holds";
import { Texts } from "@/components/(reusable)/texts";
import { Images } from "@/components/(reusable)/images";

interface OfflineStatusWidgetProps {
  className?: string;
}

export default function OfflineStatusWidget({
  className = "",
}: OfflineStatusWidgetProps) {
  const { isOnline, summary } = useEnhancedOfflineStatus();

  // Don't show widget if online and no pending actions
  if (isOnline && !summary.hasPending) {
    return null;
  }

  const getCurrentTimesheetInfo = () => {
    try {
      const currentTimesheet = localStorage.getItem(
        "current_offline_timesheet",
      );
      if (currentTimesheet) {
        return JSON.parse(currentTimesheet);
      }
    } catch (error) {
      console.error("Failed to get current timesheet info:", error);
    }
    return null;
  };

  const timesheetInfo = getCurrentTimesheetInfo();

  const getStatusMessage = () => {
    if (!isOnline) {
      return timesheetInfo
        ? `Working offline on ${timesheetInfo.jobsiteLabel || "Unknown Job Site"}`
        : "Working offline";
    }
    if (summary.hasPending) {
      return `${summary.hasPending ? "Syncing data..." : "Syncing complete"}`;
    }
    return "Connected";
  };

  const getStatusColor = () => {
    if (!isOnline) return "bg-amber-50 border-amber-200";
    if (summary.hasErrors) return "bg-red-50 border-red-200";
    if (summary.hasPending) return "bg-blue-50 border-blue-200";
    return "bg-green-50 border-green-200";
  };

  const getIconColor = () => {
    if (!isOnline) return "text-amber-600";
    if (summary.hasErrors) return "text-red-600";
    if (summary.hasPending) return "text-blue-600";
    return "text-green-600";
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Holds className={`${getStatusColor()} border rounded-lg p-4 ${className}`}>
      <div className="flex items-center gap-3">
        <div className={`${getIconColor()}`}>
          {!isOnline ? (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.366zM18 10a8 8 0 11-16 0 8 8 0 0116 0z"
                clipRule="evenodd"
              />
            </svg>
          ) : summary.hasPending ? (
            <svg
              className="w-5 h-5 animate-spin"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </div>

        <div className="flex-1">
          <Texts size="p5" className="font-medium">
            {getStatusMessage()}
          </Texts>

          {timesheetInfo && (
            <div className="mt-1">
              <Texts size="p6" className="text-gray-600">
                Started: {formatTime(timesheetInfo.offlineTimestamp)}
              </Texts>
              {timesheetInfo.costCode && (
                <Texts size="p6" className="text-gray-600">
                  Cost Code: {timesheetInfo.costCode}
                </Texts>
              )}
            </div>
          )}

          {summary.hasPending && (
            <Texts size="p6" className="text-gray-500 mt-1">
              {summary.hasPending ? "Actions pending sync" : ""}
            </Texts>
          )}
        </div>
      </div>
    </Holds>
  );
}
