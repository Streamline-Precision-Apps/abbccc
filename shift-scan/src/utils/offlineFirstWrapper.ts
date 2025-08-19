"use client";

import React from "react";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";

// Local storage keys
const OFFLINE_QUEUE_KEY = "offline_timesheet_queue";
const OFFLINE_TIMESHEET_KEY = "offline_timesheet_data";

// Types for offline data
interface OfflineTimesheet {
  id: string;
  actionName: string;
  formData: { [key: string]: any };
  timestamp: number;
  status: "pending" | "synced";
}

/**
 * Offline-first wrapper for timesheet server actions
 * When offline: stores actions locally without database interaction
 * When online: executes actions normally and syncs any offline data
 */
export async function executeOfflineFirstAction<T extends any[], R>(
  actionName: string,
  serverAction: (...args: T) => Promise<R>,
  ...args: T
): Promise<R | string> {
  const isOnline = typeof navigator !== 'undefined' && navigator.onLine;

  if (!isOnline) {
    // When offline, store the action locally and return a mock timesheet ID
    const mockTimesheetId = `offline_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Convert FormData to plain object for storage
    const formDataObj: { [key: string]: any } = {};
    if (args[0] instanceof FormData) {
      const formData = args[0] as FormData;
      for (const [key, value] of formData.entries()) {
        formDataObj[key] = value;
      }
    }

    const offlineTimesheet: OfflineTimesheet = {
      id: mockTimesheetId,
      actionName,
      formData: formDataObj,
      timestamp: Date.now(),
      status: "pending"
    };

    // Store in offline queue
    const existingQueue = getOfflineQueue();
    existingQueue.push(offlineTimesheet);
    localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(existingQueue));

    // Store individual timesheet data for immediate UI updates
    localStorage.setItem(`${OFFLINE_TIMESHEET_KEY}_${mockTimesheetId}`, JSON.stringify(offlineTimesheet));

    console.log(`[OFFLINE] Stored ${actionName} locally with ID: ${mockTimesheetId}`);
    return mockTimesheetId as R;
  } else {
    try {
      // When online, execute the action normally
      const result = await serverAction(...args);
      
      // After successful online action, try to sync any pending offline actions
      syncOfflineActions();
      
      return result;
    } catch (error) {
      console.error(`Online ${actionName} failed:`, error);
      // If online action fails, fall back to offline storage
      return executeOfflineFirstAction(actionName, serverAction, ...args);
    }
  }
}

/**
 * Get the current offline queue
 */
function getOfflineQueue(): OfflineTimesheet[] {
  try {
    const queue = localStorage.getItem(OFFLINE_QUEUE_KEY);
    return queue ? JSON.parse(queue) : [];
  } catch {
    return [];
  }
}

/**
 * Sync offline actions when back online
 */
export async function syncOfflineActions() {
  const isOnline = typeof navigator !== 'undefined' && navigator.onLine;
  if (!isOnline) return;

  const queue = getOfflineQueue();
  const pendingActions = queue.filter(action => action.status === "pending");

  if (pendingActions.length === 0) return;

  console.log(`[SYNC] Syncing ${pendingActions.length} offline actions...`);

  for (const action of pendingActions) {
    try {
      // Reconstruct FormData from stored object
      const formData = new FormData();
      Object.entries(action.formData).forEach(([key, value]) => {
        formData.append(key, value);
      });

      // Import and execute the appropriate server action
      let serverAction;
      switch (action.actionName) {
        case "handleGeneralTimeSheet":
          const { handleGeneralTimeSheet } = await import("@/actions/timeSheetActions");
          serverAction = handleGeneralTimeSheet;
          break;
        case "handleMechanicTimeSheet":
          const { handleMechanicTimeSheet } = await import("@/actions/timeSheetActions");
          serverAction = handleMechanicTimeSheet;
          break;
        case "handleTascoTimeSheet":
          const { handleTascoTimeSheet } = await import("@/actions/timeSheetActions");
          serverAction = handleTascoTimeSheet;
          break;
        case "CreateEmployeeEquipmentLog":
          const { CreateEmployeeEquipmentLog } = await import("@/actions/equipmentActions");
          serverAction = CreateEmployeeEquipmentLog;
          break;
        case "breakOutTimeSheet":
          const { breakOutTimeSheet } = await import("@/actions/timeSheetActions");
          serverAction = breakOutTimeSheet;
          break;
        default:
          console.warn(`Unknown action: ${action.actionName}`);
          continue;
      }

      if (serverAction) {
        const result = await serverAction(formData);
        console.log(`[SYNC] Successfully synced ${action.actionName}:`, result);
        
        // Mark as synced
        action.status = "synced";
        
        // Remove offline timesheet data
        localStorage.removeItem(`${OFFLINE_TIMESHEET_KEY}_${action.id}`);
      }
    } catch (error) {
      console.error(`[SYNC] Failed to sync ${action.actionName}:`, error);
    }
  }

  // Update the queue with synced status
  const updatedQueue = queue.map(action => 
    pendingActions.some(p => p.id === action.id) ? { ...action, status: "synced" as const } : action
  );

  // Remove synced actions from queue (keep only last 10 for reference)
  const cleanedQueue = updatedQueue.filter(action => action.status === "pending").slice(-10);
  localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(cleanedQueue));
}

/**
 * Get offline timesheet data by ID (for UI updates)
 */
export function getOfflineTimesheet(id: string): OfflineTimesheet | null {
  try {
    const data = localStorage.getItem(`${OFFLINE_TIMESHEET_KEY}_${id}`);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

/**
 * Hook to automatically sync when coming back online
 */
export function useOfflineSync() {
  const isOnline = useOnlineStatus();

  React.useEffect(() => {
    if (isOnline) {
      syncOfflineActions();
    }
  }, [isOnline]);

  return {
    isOnline,
    syncOfflineActions,
    getOfflineQueue: () => getOfflineQueue().filter(a => a.status === "pending"),
  };
}

/**
 * Check if a timesheet ID is from offline storage
 */
export function isOfflineTimesheet(id: string): boolean {
  return id.startsWith("offline_");
}
