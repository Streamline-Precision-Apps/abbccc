"use client";

import { useState, useEffect } from "react";
import {
  getOfflineActionsStatus,
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

  if (!isVisible) return null;

  const { pending, syncing, failed } = status;

  return (
    <div className="fixed top-16 right-4 z-50 bg-white border border-gray-300 rounded-lg shadow-lg p-4 max-w-sm">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-medium text-gray-900">Offline Sync Status</h3>
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-400 hover:text-gray-600"
        >
          ×
        </button>
      </div>

      <div className="space-y-2">
        {syncing.length > 0 && (
          <div className="flex items-center text-blue-600">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse mr-2"></div>
            <span className="text-sm">Syncing {syncing.length} item(s)...</span>
          </div>
        )}

        {pending.length > 0 && (
          <div className="flex items-center text-yellow-600">
            <div className="w-2 h-2 bg-yellow-600 rounded-full mr-2"></div>
            <span className="text-sm">
              {pending.length} item(s) waiting to sync
            </span>
          </div>
        )}

        {failed.length > 0 && (
          <div className="flex items-center text-red-600">
            <div className="w-2 h-2 bg-red-600 rounded-full mr-2"></div>
            <span className="text-sm">
              {failed.length} item(s) failed to sync
            </span>
          </div>
        )}
      </div>

      {failed.length > 0 && (
        <div className="mt-3 pt-2 border-t border-gray-200">
          <details>
            <summary className="text-xs text-gray-600 cursor-pointer">
              View failed items
            </summary>
            <div className="mt-2 space-y-1">
              {failed.map((action) => (
                <div
                  key={action.id}
                  className="text-xs text-red-600 bg-red-50 p-2 rounded"
                >
                  <div className="font-medium">{action.actionName}</div>
                  {action.lastError && (
                    <div className="text-red-500 mt-1">{action.lastError}</div>
                  )}
                  {action.lastError?.includes("USER_NOT_FOUND") && (
                    <div className="text-red-700 mt-1">
                      Please log in again to sync this item.
                    </div>
                  )}
                </div>
              ))}
            </div>
          </details>
        </div>
      )}
    </div>
  );
}
