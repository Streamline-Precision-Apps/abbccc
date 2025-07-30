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

  // Auto-sync when coming online
  useEffect(() => {
    if (isOnline && state.queuedActionsCount > 0) {
      syncQueued();
    }
  }, [isOnline, state.queuedActionsCount, syncQueued]);

  // Update online status
  useEffect(() => {
    setState(prev => ({ ...prev, isOnline }));
  }, [isOnline]);

  // Update queued count on mount and periodically
  useEffect(() => {
    updateQueuedCount();
    const interval = setInterval(updateQueuedCount, 30000); // Every 30 seconds
    return () => clearInterval(interval);
  }, [updateQueuedCount]);

  return {
    ...state,
    syncQueued,
    updateQueuedCount,
  };
};
