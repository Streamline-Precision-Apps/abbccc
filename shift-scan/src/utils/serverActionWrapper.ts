"use client";

import { queueServerAction, syncQueuedActions } from "@/utils/offlineApi";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";

/**
 * Wrapper for server actions to provide offline compatibility
 * @param actionName - Unique identifier for the server action
 * @param serverAction - The server action function to execute
 * @param args - Arguments to pass to the server action
 * @returns Promise that resolves when action is executed or queued
 */
export async function executeServerAction<T extends unknown[], R>(
  actionName: string,
  serverAction: (...args: T) => Promise<R>,
  ...args: T
): Promise<R | void> {
  // Check if we're online
  const isOnline = typeof navigator !== 'undefined' && navigator.onLine;

  if (isOnline) {
    try {
      // Try to execute immediately if online
      const result = await serverAction(...args);
      
      // Removed auto-sync after every server action to prevent spam
      // useOfflineSync hook handles sync timing appropriately
      
      return result;
    } catch (error) {
      console.warn(`Server action ${actionName} failed, queuing for offline sync:`, error);
      // If the action fails and we have a network issue, queue it
      // Convert args array to a Record for storage
      const payload = args.length === 1 && args[0] instanceof FormData 
        ? Object.fromEntries((args[0] as FormData).entries())
        : { args: args };
      await queueServerAction(actionName, "POST", payload);
      return;
    }
  } else {
    // If offline, queue the action
    console.log(`Offline: Queuing server action ${actionName}`);
    // Convert args array to a Record for storage
    const payload = args.length === 1 && args[0] instanceof FormData 
      ? Object.fromEntries((args[0] as FormData).entries())
      : { args: args };
    await queueServerAction(actionName, "POST", payload);
    return;
  }
}

/**
 * Hook to provide server action wrapper with online status awareness
 */
export function useServerAction() {
  const isOnline = useOnlineStatus();

  const execute = async <T extends unknown[], R>(
    actionName: string,
    serverAction: (...args: T) => Promise<R>,
    ...args: T
  ): Promise<R | void> => {
    return executeServerAction(actionName, serverAction, ...args);
  };

  return {
    execute,
    isOnline,
    syncQueued: syncQueuedActions
  };
}

/**
 * Higher-order function to wrap server actions with offline support
 */
export function withOfflineSupport<T extends unknown[], R>(
  actionName: string,
  serverAction: (...args: T) => Promise<R>
) {
  return async (...args: T): Promise<R | void> => {
    return executeServerAction(actionName, serverAction, ...args);
  };
}
