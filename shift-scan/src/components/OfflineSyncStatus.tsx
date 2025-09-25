"use client";

import { useState, useEffect } from "react";
import {
  getOfflineActionsStatus,
  clearOfflineData,
  type OfflineTimesheet,
} from "@/utils/offlineFirstWrapper";

export default function OfflineSyncStatus() {
  const [status, setStatus] = useState({
    pending: [] as OfflineTimesheet[],
    syncing: [] as OfflineTimesheet[],
    failed: [] as OfflineTimesheet[],
    total: 0,
  });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const checkOfflineActions = () => {
      const offlineStatus = getOfflineActionsStatus();
      setStatus(offlineStatus);
      setIsVisible(offlineStatus.total > 0);
    };

    // Check initially
    checkOfflineActions();

    // Set up interval to check periodically
    const interval = setInterval(checkOfflineActions, 2000);

    return () => clearInterval(interval);
  }, []);

  const handleClearFailed = () => {
    try {
      clearOfflineData();
      // Force refresh the status
      const offlineStatus = getOfflineActionsStatus();
      setStatus(offlineStatus);
      setIsVisible(offlineStatus.total > 0);
    } catch (error) {
      console.error('Failed to clear offline data:', error);
    }
  };

  if (!isVisible) return null;

  const { pending, syncing, failed } = status;

  return (
    <div className="fixed bottom-2 left-1/2 transform -translate-x-1/2 z-50 bg-transparent">
      <div className="text-center">
        {syncing.length > 0 && (
          <div className="text-xs text-red-600 mb-1">
            Syncing {syncing.length} item(s)...
          </div>
        )}

        {pending.length > 0 && (
          <div className="text-xs text-red-600 mb-1">
            {pending.length} item(s) waiting to sync
          </div>
        )}

        {failed.length > 0 && (
          <div className="text-xs text-red-600">
            {failed.length} item(s) failed to sync
            <button
              onClick={handleClearFailed}
              className="ml-2 text-xs text-red-800 underline hover:text-red-900"
              title="Clear all offline sync data"
            >
              clear
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
