/**
 * Offline Status Manager Component
 * Shows offline readiness and provides manual caching controls
 */
"use client";

import { useEffect, useState } from "react";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { useOfflineSync } from "@/utils/offlineFirstWrapper";
import {
  cacheEntireApp,
  checkOfflineReadiness,
  getCacheStats,
  clearAllCaches,
} from "@/utils/offlineCacheManager";

interface OfflineReadiness {
  isReady: boolean;
  cachedRoutes: string[];
  cachedAssets: number;
}

interface CacheStats {
  totalCaches: number;
  totalEntries: number;
  estimatedSize: string;
}

export const OfflineStatusManager = () => {
  const isOnline = useOnlineStatus();
  const { getOfflineQueue, syncOfflineActions } = useOfflineSync();
  const [offlineReadiness, setOfflineReadiness] = useState<OfflineReadiness>({
    isReady: false,
    cachedRoutes: [],
    cachedAssets: 0,
  });
  const [cacheStats, setCacheStats] = useState<CacheStats>({
    totalCaches: 0,
    totalEntries: 0,
    estimatedSize: "0 KB",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [pendingActions, setPendingActions] = useState(0);

  const updateStatus = async () => {
    const readiness = await checkOfflineReadiness();
    const stats = await getCacheStats();
    const pending = getOfflineQueue().length;
    setOfflineReadiness(readiness);
    setCacheStats(stats);
    setPendingActions(pending);
  };

  useEffect(() => {
    updateStatus();
    // Check every 30 seconds
    const interval = setInterval(updateStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleCacheApp = async () => {
    setIsLoading(true);
    try {
      const success = await cacheEntireApp();
      if (success) {
        // Wait a bit for caching to complete, then update status
        setTimeout(updateStatus, 3000);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearCache = async () => {
    setIsLoading(true);
    try {
      await clearAllCaches();
      setTimeout(updateStatus, 1000);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = () => {
    if (!isOnline) return "text-red-600";
    if (offlineReadiness.isReady) return "text-green-600";
    return "text-yellow-600";
  };

  const getStatusText = () => {
    if (!isOnline) return "Offline";
    if (offlineReadiness.isReady) return "Offline Ready";
    return "Limited Offline";
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-white shadow-lg rounded-lg p-3 max-w-sm">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <div
            className={`w-3 h-3 rounded-full ${
              !isOnline
                ? "bg-red-500"
                : offlineReadiness.isReady
                  ? "bg-green-500"
                  : "bg-yellow-500"
            }`}
          />
          <span className={`font-medium text-sm ${getStatusColor()}`}>
            {getStatusText()}
            {pendingActions > 0 && (
              <span className="ml-1 bg-blue-500 text-white text-xs px-1 rounded-full">
                {pendingActions}
              </span>
            )}
          </span>
        </div>
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-xs text-gray-500 hover:text-gray-700"
        >
          {showDetails ? "−" : "+"}
        </button>
      </div>

      {showDetails && (
        <div className="space-y-2 text-xs text-gray-600">
          <div>
            <div>Cached Assets: {cacheStats.totalEntries}</div>
            <div>Storage Used: {cacheStats.estimatedSize}</div>
            <div>Cached Routes: {offlineReadiness.cachedRoutes.length}</div>
            {pendingActions > 0 && (
              <div className="text-blue-600 font-medium">
                Pending Actions: {pendingActions}
              </div>
            )}
          </div>

          {isOnline && pendingActions > 0 && (
            <button
              onClick={syncOfflineActions}
              className="w-full bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600"
            >
              Sync Now
            </button>
          )}

          {isOnline && (
            <div className="space-y-1">
              <button
                onClick={handleCacheApp}
                disabled={isLoading}
                className="w-full bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600 disabled:opacity-50"
              >
                {isLoading ? "Caching..." : "Cache Full App"}
              </button>
              <button
                onClick={handleClearCache}
                disabled={isLoading}
                className="w-full bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600 disabled:opacity-50"
              >
                Clear Cache
              </button>
            </div>
          )}

          {offlineReadiness.cachedRoutes.length > 0 && (
            <div className="mt-2">
              <div className="font-medium">Cached Pages:</div>
              <div className="text-xs">
                {offlineReadiness.cachedRoutes.join(", ")}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OfflineStatusManager;
