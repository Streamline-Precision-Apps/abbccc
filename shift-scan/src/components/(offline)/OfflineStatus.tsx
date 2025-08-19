"use client";

import React from "react";
import {
  useOfflineSync,
  isOfflineTimesheet,
} from "@/utils/offlineFirstWrapper";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";

interface OfflineStatusProps {
  className?: string;
}

export function OfflineStatus({ className = "" }: OfflineStatusProps) {
  const isOnline = useOnlineStatus();
  const { getOfflineQueue } = useOfflineSync();
  const pendingActions = getOfflineQueue();

  if (isOnline && pendingActions.length === 0) {
    return null; // Don't show anything when online and no pending actions
  }

  return (
    <div className={`bg-blue-100 border-l-4 border-blue-500 p-4 ${className}`}>
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <div
            className={`w-3 h-3 rounded-full ${isOnline ? "bg-green-500" : "bg-red-500"}`}
          />
        </div>
        <div className="ml-3">
          <p className="text-sm text-blue-700">
            {isOnline ? (
              pendingActions.length > 0 ? (
                <>Syncing {pendingActions.length} offline action(s)...</>
              ) : (
                "Online - All data synced"
              )
            ) : (
              <>
                Offline Mode - Actions will sync when connection returns
                {pendingActions.length > 0 &&
                  ` (${pendingActions.length} pending)`}
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

interface OfflineTimesheetBadgeProps {
  timesheetId: string;
  className?: string;
}

export function OfflineTimesheetBadge({
  timesheetId,
  className = "",
}: OfflineTimesheetBadgeProps) {
  if (!isOfflineTimesheet(timesheetId)) {
    return null;
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 ${className}`}
    >
      Offline
    </span>
  );
}
