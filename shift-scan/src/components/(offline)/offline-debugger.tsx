"use client";
import React, { useState, useEffect } from "react";
import { useEnhancedOfflineStatus } from "@/hooks/useEnhancedOfflineStatus";
import {
  getOfflineTimesheetData,
  hasOfflineTimesheetData,
} from "@/utils/offlineApiWrapper";
import {
  isOfflineTimesheet,
  getOfflineActionsStatus,
  OfflineTimesheet,
} from "@/utils/offlineFirstWrapper";

// Define debug data structure
interface OfflineTimesheetData {
  id?: string;
  workType?: string;
  jobsiteLabel?: string;
  costCodeLabel?: string;
  costCode?: string;
  [key: string]: unknown;
}

interface DebugData {
  isOnline: boolean;
  hasOfflineData: boolean;
  offlineTimesheet: OfflineTimesheetData | null;
  currentOfflineTimesheet: OfflineTimesheetData | null;
  offlineDashboardData: Record<string, unknown> | null;
  cachedRecentTimecard: Record<string, unknown> | null;
  offlineActionsStatus: {
    pending: OfflineTimesheet[];
    syncing: OfflineTimesheet[];
    failed: OfflineTimesheet[];
    total: number;
  };
  timestamp: string;
}

interface OfflineDebuggerProps {
  showDetails?: boolean;
}

export default function OfflineDebugger({
  showDetails = false,
}: OfflineDebuggerProps) {
  const { isOnline, offlineStatus, summary } = useEnhancedOfflineStatus();
  const [debugData, setDebugData] = useState<DebugData | null>(null);
  const [isVisible, setIsVisible] = useState(showDetails);

  useEffect(() => {
    const updateDebugData = () => {
      const offlineTimesheet = getOfflineTimesheetData();
      const hasOfflineData = hasOfflineTimesheetData();
      const currentOfflineTimesheet = localStorage.getItem(
        "current_offline_timesheet",
      );
      const offlineDashboardData = localStorage.getItem(
        "offline_dashboard_data",
      );
      const cachedRecentTimecard = localStorage.getItem(
        "cached_recent_timecard",
      );

      setDebugData({
        isOnline,
        hasOfflineData,
        offlineTimesheet,
        currentOfflineTimesheet: currentOfflineTimesheet
          ? JSON.parse(currentOfflineTimesheet)
          : null,
        offlineDashboardData: offlineDashboardData
          ? JSON.parse(offlineDashboardData)
          : null,
        cachedRecentTimecard: cachedRecentTimecard
          ? JSON.parse(cachedRecentTimecard)
          : null,
        offlineActionsStatus: getOfflineActionsStatus(),
        timestamp: new Date().toLocaleTimeString(),
      });
    };

    updateDebugData();
    const interval = setInterval(updateDebugData, 2000);

    return () => clearInterval(interval);
  }, [isOnline]);

  // Only show in development mode
  if (process.env.NODE_ENV === "production" && !showDetails) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm mb-2 shadow-lg"
      >
        {isVisible ? "Hide" : "Show"} Offline Debug
      </button>

      {isVisible && (
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-w-md max-h-96 overflow-auto text-xs">
          <h3 className="font-bold mb-2">Offline Debug Info</h3>

          <div className="mb-2">
            <strong>Status:</strong>
            <div
              className={`inline-block w-3 h-3 rounded-full ml-2 ${isOnline ? "bg-green-500" : "bg-red-500"}`}
            ></div>
            <span className="ml-1">{isOnline ? "Online" : "Offline"}</span>
          </div>

          <div className="mb-2">
            <strong>Pending Actions:</strong> {offlineStatus.pending.length}
          </div>

          <div className="mb-2">
            <strong>Failed Actions:</strong> {offlineStatus.failed.length}
          </div>

          <div className="mb-2">
            <strong>Has Offline Data:</strong>{" "}
            {debugData?.hasOfflineData ? "Yes" : "No"}
          </div>

          {debugData?.offlineTimesheet && (
            <div className="mb-2">
              <strong>Offline Timesheet:</strong>
              <div className="bg-gray-100 p-2 rounded mt-1">
                <div>ID: {debugData.offlineTimesheet.id}</div>
                <div>Work Type: {debugData.offlineTimesheet.workType}</div>
                <div>Jobsite: {debugData.offlineTimesheet.jobsiteLabel}</div>
                <div>
                  Cost Code:{" "}
                  {debugData.offlineTimesheet.costCodeLabel ||
                    debugData.offlineTimesheet.costCode}
                </div>
              </div>
            </div>
          )}

          {debugData?.offlineActionsStatus?.pending &&
            debugData.offlineActionsStatus.pending.length > 0 && (
              <div className="mb-2">
                <strong>Pending Actions:</strong>
                <div className="bg-yellow-100 p-2 rounded mt-1 max-h-20 overflow-auto">
                  {debugData.offlineActionsStatus.pending.map(
                    (action: OfflineTimesheet, index: number) => (
                      <div key={index} className="text-xs">
                        {action.actionName} - {action.id}
                      </div>
                    ),
                  )}
                </div>
              </div>
            )}

          <div className="text-gray-500">
            Last updated: {debugData?.timestamp}
          </div>
        </div>
      )}
    </div>
  );
}
