/**
 * Hook to manage offline synchronization for the entire app
 */
'use client';

import { useEffect, useState, useCallback } from 'react';
import { syncQueuedActions, getQueuedActionsCount } from '@/utils/offlineApi';
import { useOnlineStatus } from './useOnlineStatus';

export interface OfflineSyncState {
  isOnline: boolean;
  isLoading: boolean;
  queuedActionsCount: number;
  lastSync: Date | null;
  errors: string[];
}

export const useOfflineSync = () => {
  const isOnline = useOnlineStatus();
  const [state, setState] = useState<OfflineSyncState>({
    isOnline,
    isLoading: false,
    queuedActionsCount: 0,
    lastSync: null,
    errors: [],
  });

  // Update queued actions count
  const updateQueuedCount = useCallback(async () => {
    try {
      const count = await getQueuedActionsCount();
      setState(prev => ({ ...prev, queuedActionsCount: count }));
    } catch (error) {
      console.warn('Failed to get queued actions count:', error);
    }
  }, []);

  // Sync queued actions
  const syncQueued = useCallback(async () => {
    if (!isOnline) return;

    setState(prev => ({ ...prev, isLoading: true, errors: [] }));

    try {
      const result = await syncQueuedActions();
      setState(prev => ({
        ...prev,
        isLoading: false,
        lastSync: new Date(),
        queuedActionsCount: prev.queuedActionsCount - result.syncedCount,
        errors: result.errors.map(e => e.error),
      }));

      console.log("useOfflineSync1");

      if (result.success) {
        console.log(`Successfully synced ${result.syncedCount} actions`);
      } else {
        console.warn(`Sync completed with ${result.failedCount} failures`);
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        errors: [error instanceof Error ? error.message : 'Sync failed'],
      }));
    }
  }, [isOnline]);

  // Auto-sync when coming online (with debouncing to prevent spam)
  useEffect(() => {
    console.log("useOfflineSync2");
    if (isOnline && state.queuedActionsCount > 0) {
      // Add a small delay to prevent immediate sync spam
      const timer = setTimeout(() => {
        syncQueued();
      }, 2000); // 2 second delay
      
      return () => clearTimeout(timer);
    }
  }, [isOnline, state.queuedActionsCount, syncQueued]);

  // Update online status
  useEffect(() => {
    console.log("useOfflineSync2");
    setState(prev => ({ ...prev, isOnline }));
  }, [isOnline]);

  // Update queued count on mount and periodically (reduced frequency)
  useEffect(() => {
    console.log("useOfflineSync3");
    updateQueuedCount();
    const interval = setInterval(updateQueuedCount, 60000); // Reduced from 30s to 60s
    return () => clearInterval(interval);
  }, [updateQueuedCount]);

  return {
    ...state,
    syncQueued,
    updateQueuedCount,
  };
};
