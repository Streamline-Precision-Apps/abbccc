"use client";

import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";
import { useOfflineSync, type OfflineSyncState } from "@/hooks/useOfflineSync";

interface OfflineContextType extends OfflineSyncState {
  syncQueued: () => Promise<void>;
  updateQueuedCount: () => Promise<void>;
}

const OfflineContext = createContext<OfflineContextType | undefined>(undefined);

export const OfflineProvider = ({ children }: { children: ReactNode }) => {
  const offlineSync = useOfflineSync();

  const value: OfflineContextType = {
    ...offlineSync,
  };

  return (
    <OfflineContext.Provider value={value}>{children}</OfflineContext.Provider>
  );
};

export const useOffline = () => {
  const context = useContext(OfflineContext);
  if (!context) {
    throw new Error("useOffline must be used within an OfflineProvider");
  }
  return context;
};

// Component to show offline status and sync information
export const OfflineIndicator = () => {
  const [isMounted, setIsMounted] = useState(false);
  const { isOnline, isLoading, queuedActionsCount, syncQueued, lastSync } =
    useOffline();

  // Prevent hydration mismatch by only rendering after mount
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Don't render anything until mounted (prevents hydration mismatch)
  if (!isMounted) {
    return null;
  }

  if (isOnline && queuedActionsCount === 0) {
    return null; // Don't show anything when online and no queued actions
  }

  const formatStatusLine = (): string => {
    const parts: string[] = [];

    // Status
    parts.push(isOnline ? "Online" : "Offline");

    // Pending actions
    if (queuedActionsCount > 0) {
      parts.push(`${queuedActionsCount} Pending`);
    }

    // Last sync time
    if (lastSync) {
      parts.push(lastSync.toLocaleTimeString());
    }

    return parts.join(" | ");
  };

  return (
    <div
      className={`fixed bottom-0 left-1/2 transform -translate-x-1/2 z-50 px-2 py-1 text-xs whitespace-nowrap ${
        isOnline ? "text-green-800" : "text-red-800"
      }`}
    >
      <div className="flex items-center space-x-1">
        <span className="font-medium whitespace-nowrap">
          {formatStatusLine()}
        </span>
        {isOnline && queuedActionsCount > 0 && (
          <button
            onClick={syncQueued}
            disabled={isLoading}
            className="ml-2 px-1 py-0.5 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 disabled:opacity-50 whitespace-nowrap"
          >
            {isLoading ? "Syncing..." : "Sync"}
          </button>
        )}
      </div>
    </div>
  );
};
