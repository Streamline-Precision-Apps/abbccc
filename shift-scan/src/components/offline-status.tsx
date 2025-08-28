/**
 * Offline Status Component
 * Displays current offline status and provides sync controls
 */

import React from "react";
import { useOffline } from "@/hooks/use-offline";

interface OfflineStatusComponentProps {
  showDetails?: boolean;
  showControls?: boolean;
  className?: string;
}

export function OfflineStatusComponent({
  showDetails = true,
  showControls = true,
  className = "",
}: OfflineStatusComponentProps) {
  const {
    isOnline,
    status,
    loading,
    syncOfflineActions,
    clearOfflineData,
    pendingActions,
    syncing,
    lastSyncTime,
    offlineTimesheet,
    offlineEquipmentLogs,
  } = useOffline();

  const handleSync = async () => {
    const success = await syncOfflineActions();
    if (success) {
      alert("Sync completed successfully!");
    } else {
      alert("Sync failed. Please try again.");
    }
  };

  const handleClearData = async () => {
    if (
      confirm(
        "Are you sure you want to clear all offline data? This cannot be undone.",
      )
    ) {
      const success = await clearOfflineData();
      if (success) {
        alert("Offline data cleared successfully!");
      } else {
        alert("Failed to clear offline data.");
      }
    }
  };

  if (loading) {
    return (
      <div className={`p-4 bg-gray-100 rounded-lg ${className}`}>
        <div className="animate-pulse">Loading offline status...</div>
      </div>
    );
  }

  return (
    <div
      className={`p-4 rounded-lg ${className} ${
        isOnline
          ? status.pendingActions > 0
            ? "bg-yellow-100 border-l-4 border-yellow-400"
            : "bg-green-100 border-l-4 border-green-400"
          : "bg-red-100 border-l-4 border-red-400"
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <div
            className={`w-3 h-3 rounded-full ${
              isOnline ? "bg-green-500" : "bg-red-500"
            }`}
          />
          <span className="font-medium">{isOnline ? "Online" : "Offline"}</span>
        </div>

        {showControls && (
          <div className="flex space-x-2">
            {status.pendingActions > 0 && (
              <button
                onClick={handleSync}
                disabled={syncing || !isOnline}
                className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {syncing ? "Syncing..." : "Sync Now"}
              </button>
            )}

            <button
              onClick={handleClearData}
              className="px-3 py-1 text-sm bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Clear Data
            </button>
          </div>
        )}
      </div>

      {showDetails && (
        <div className="space-y-2">
          {status.pendingActions > 0 && (
            <div className="text-sm">
              <span className="font-medium text-orange-600">
                {status.pendingActions} pending action
                {status.pendingActions !== 1 ? "s" : ""} waiting to sync
              </span>
            </div>
          )}

          {(status.offlineData.timesheets > 0 ||
            status.offlineData.equipmentLogs > 0) && (
            <div className="text-sm text-gray-600">
              Offline data: {status.offlineData.timesheets} timesheet
              {status.offlineData.timesheets !== 1 ? "s" : ""},{" "}
              {status.offlineData.equipmentLogs} equipment log
              {status.offlineData.equipmentLogs !== 1 ? "s" : ""}
            </div>
          )}

          {lastSyncTime && (
            <div className="text-xs text-gray-500">
              Last sync: {lastSyncTime.toLocaleString()}
            </div>
          )}

          {pendingActions.length > 0 && (
            <details className="text-sm">
              <summary className="cursor-pointer text-blue-600 hover:text-blue-800">
                View pending actions ({pendingActions.length})
              </summary>
              <div className="mt-2 space-y-1 pl-4 border-l-2 border-gray-200">
                {pendingActions.map((action) => (
                  <div key={action.id} className="text-xs">
                    <span className="font-mono">{action.actionName}</span>
                    <span className="text-gray-500 ml-2">
                      {new Date(action.timestamp).toLocaleString()}
                      {action.retryCount > 0 && ` (retry ${action.retryCount})`}
                    </span>
                  </div>
                ))}
              </div>
            </details>
          )}

          {offlineTimesheet && (
            <details className="text-sm">
              <summary className="cursor-pointer text-blue-600 hover:text-blue-800">
                Current offline timesheet
              </summary>
              <div className="mt-2 text-xs text-gray-600">
                <div>ID: {offlineTimesheet.id}</div>
                <div>Type: {offlineTimesheet.workType}</div>
                <div>
                  Start: {new Date(offlineTimesheet.startTime).toLocaleString()}
                </div>
                {offlineTimesheet.endTime && (
                  <div>
                    End: {new Date(offlineTimesheet.endTime).toLocaleString()}
                  </div>
                )}
              </div>
            </details>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Simple offline indicator for nav bars or headers
 */
export function OfflineIndicator({ className = "" }: { className?: string }) {
  const { isOnline, status } = useOffline();

  if (isOnline && status.pendingActions === 0) {
    return null; // Don't show anything when fully online and synced
  }

  return (
    <div className={`flex items-center space-x-2 text-sm ${className}`}>
      <div
        className={`w-2 h-2 rounded-full ${
          isOnline ? "bg-yellow-500" : "bg-red-500"
        }`}
      />
      <span>{isOnline ? `${status.pendingActions} pending` : "Offline"}</span>
    </div>
  );
}

export default OfflineStatusComponent;
