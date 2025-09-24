"use client";

import React from "react";

// Local storage keys
const OFFLINE_QUEUE_KEY = "offline_timesheet_queue";
const OFFLINE_TIMESHEET_KEY = "offline_timesheet_data";

// Types for offline data
export interface OfflineTimesheet {
  id: string;
  actionName: string;
  formData: Record<string, unknown>;
  timestamp: number;
  status: "pending" | "syncing" | "synced" | "failed";
  retryCount?: number;
  lastError?: string;
}

/**
 * Offline-first wrapper for timesheet server actions
 * When offline: stores actions locally without database interaction
 * When online: executes actions normally and syncs any offline data
 */
export async function executeOfflineFirstAction<T extends unknown[], R>(
  actionName: string,
  serverAction: (...args: T) => Promise<R>,
  ...args: T
): Promise<R | string> {
  const isOnline = typeof navigator !== 'undefined' && navigator.onLine;

  if (!isOnline) {
    // When offline, store the action locally and return a mock timesheet ID
    const mockTimesheetId = `offline_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Convert FormData to plain object for storage
    const formDataObj: Record<string, unknown> = {};
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
      status: "pending",
      retryCount: 0
    };

    // Store in offline queue
    const existingQueue = getOfflineQueue();
    existingQueue.push(offlineTimesheet);
    localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(existingQueue));

    // Store individual timesheet data for immediate UI updates
    localStorage.setItem(`${OFFLINE_TIMESHEET_KEY}_${mockTimesheetId}`, JSON.stringify(offlineTimesheet));

    console.log(`[OFFLINE] Stored ${actionName} locally with ID: ${mockTimesheetId}`);
    
    // Dispatch custom event for UI updates
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('offlineActionStored', { 
        detail: { actionName, id: mockTimesheetId } 
      }));
    }
    
    return mockTimesheetId as R;
  } else {
    try {
      // When online, execute the action normally
      const result = await serverAction(...args);
      
      // After successful online action, try to sync any pending offline actions
      // Don't await this to avoid blocking the current action
      setTimeout(() => syncOfflineActions(), 100);
      
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
 * Update a specific offline action in the queue and local storage
 */
function updateOfflineAction(updatedAction: OfflineTimesheet): void {
  try {
    // Update in queue
    const queue = getOfflineQueue();
    const index = queue.findIndex(action => action.id === updatedAction.id);
    if (index !== -1) {
      queue[index] = updatedAction;
      localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(queue));
    }
    
    // Update individual timesheet data
    localStorage.setItem(`${OFFLINE_TIMESHEET_KEY}_${updatedAction.id}`, JSON.stringify(updatedAction));
  } catch (error) {
    console.error('Failed to update offline action:', error);
  }
}

/**
 * Sync offline actions when back online
 */
export async function syncOfflineActions(): Promise<{ success: number; failed: number }> {
  const isOnline = typeof navigator !== 'undefined' && navigator.onLine;
  if (!isOnline) return { success: 0, failed: 0 };

  const queue = getOfflineQueue();
  const pendingActions = queue.filter(action => 
    action.status === "pending" && (action.retryCount || 0) < 3
  );

  if (pendingActions.length === 0) return { success: 0, failed: 0 };

  console.log(`[SYNC] Syncing ${pendingActions.length} offline actions...`);

  let successCount = 0;
  let failedCount = 0;

  // Process actions sequentially to avoid overwhelming the server
  for (const action of pendingActions) {
    try {
      // Mark as syncing
      action.status = "syncing";
      updateOfflineAction(action);

      // Reconstruct FormData from stored object with better handling
      const formData = new FormData();
      Object.entries(action.formData).forEach(([key, value]) => {
        if (value instanceof Blob) {
          formData.append(key, value);
        } else if (value !== null && value !== undefined) {
          formData.append(key, String(value));
        }
      });
      
      // Add flag to indicate this is an offline sync
      formData.append("isOfflineSync", "true");

      // Debug: Log the reconstructed FormData
      console.log(`[SYNC] Reconstructed FormData for ${action.actionName}:`, Object.fromEntries(formData.entries()));

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
        case "updateTimeSheet":
          const { updateTimeSheet } = await import("@/actions/timeSheetActions");
          serverAction = updateTimeSheet;
          break;
        default:
          console.warn(`Unknown action: ${action.actionName}`);
          action.status = "failed";
          action.lastError = `Unknown action type: ${action.actionName}`;
          updateOfflineAction(action);
          failedCount++;
          continue;
      }

      if (serverAction) {
        const result = await serverAction(formData);
        console.log(`[SYNC] Successfully synced ${action.actionName}:`, result);
        
        // Mark as synced and remove offline data
        action.status = "synced";
        action.lastError = undefined;
        updateOfflineAction(action);
        
        // Remove offline timesheet data
        localStorage.removeItem(`${OFFLINE_TIMESHEET_KEY}_${action.id}`);
        
        successCount++;

        // Dispatch success event
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('offlineActionSynced', { 
            detail: { actionName: action.actionName, id: action.id, result } 
          }));
        }
      }
    } catch (error) {
      console.error(`[SYNC] Failed to sync ${action.actionName}:`, error);
      
      // Update retry count and status
      action.retryCount = (action.retryCount || 0) + 1;
      action.lastError = error instanceof Error ? error.message : 'Unknown error';
      
      // Check if it's a user validation error - don't retry these
      if (action.lastError.includes("USER_NOT_FOUND") || 
          action.lastError.includes("User account not found") ||
          action.lastError.includes("Unauthorized user")) {
        action.status = "failed";
        console.warn(`[SYNC] User validation failed for action ${action.actionName} - marking as failed, no retries`);
        failedCount++;
      } else if (action.retryCount >= 3) {
        action.status = "failed";
        console.error(`[SYNC] Max retries reached for ${action.actionName}, marking as failed`);
        failedCount++;
      } else {
        action.status = "pending";
      }
      
      updateOfflineAction(action);
      failedCount++;

      // Dispatch failure event
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('offlineActionFailed', { 
          detail: { actionName: action.actionName, id: action.id, error: action.lastError } 
        }));
      }
    }

    // Small delay between actions to prevent overwhelming the server
    await new Promise(resolve => setTimeout(resolve, 200));
  }

  // Clean up the queue - keep failed actions for manual retry, remove synced ones
  const updatedQueue = queue.filter(action => action.status !== "synced");
  localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(updatedQueue));

  console.log(`[SYNC] Completed: ${successCount} succeeded, ${failedCount} failed`);
  
  return { success: successCount, failed: failedCount };
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
  const [isOnline, setIsOnline] = React.useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  React.useEffect(() => {
    function handleOnline() { 
      setIsOnline(true);
      syncOfflineActions();
    }
    function handleOffline() { 
      setIsOnline(false);
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);
      
      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }
  }, []);

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

/**
 * Get all offline actions with their current status
 */
export function getOfflineActionsStatus(): {
  pending: OfflineTimesheet[];
  syncing: OfflineTimesheet[];
  failed: OfflineTimesheet[];
  total: number;
} {
  const queue = getOfflineQueue();
  return {
    pending: queue.filter(a => a.status === "pending"),
    syncing: queue.filter(a => a.status === "syncing"),
    failed: queue.filter(a => a.status === "failed"),
    total: queue.length
  };
}

/**
 * Manually retry failed offline actions
 */
export async function retryFailedActions(): Promise<{ success: number; failed: number }> {
  const queue = getOfflineQueue();
  const failedActions = queue.filter(action => action.status === "failed");
  
  // Reset failed actions to pending for retry
  failedActions.forEach(action => {
    action.status = "pending";
    action.retryCount = 0;
    action.lastError = undefined;
    updateOfflineAction(action);
  });
  
  if (failedActions.length > 0) {
    console.log(`[RETRY] Retrying ${failedActions.length} failed actions...`);
    return await syncOfflineActions();
  }
  
  return { success: 0, failed: 0 };
}

/**
 * Clear all offline data (for development/testing)
 */
export function clearOfflineData(): void {
  try {
    const queue = getOfflineQueue();
    
    // Remove individual timesheet data
    queue.forEach(action => {
      localStorage.removeItem(`${OFFLINE_TIMESHEET_KEY}_${action.id}`);
    });
    
    // Clear the queue
    localStorage.removeItem(OFFLINE_QUEUE_KEY);
    
    console.log('[OFFLINE] Cleared all offline data');
  } catch (error) {
    console.error('Failed to clear offline data:', error);
  }
}
