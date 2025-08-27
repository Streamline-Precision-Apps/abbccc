"use client";
import { useState, useEffect, useCallback } from 'react';
import { 
  useOfflineSync, 
  getOfflineActionsStatus, 
  syncOfflineActions,
  retryFailedActions,
  OfflineTimesheet 
} from '@/utils/offlineFirstWrapper';

export interface OfflineStatus {
  pending: OfflineTimesheet[];
  syncing: OfflineTimesheet[];
  failed: OfflineTimesheet[];
  total: number;
}

export interface OfflineSyncResult {
  success: number;
  failed: number;
}

/**
 * Enhanced hook for managing offline functionality across the app
 */
export function useEnhancedOfflineStatus() {
  const { isOnline } = useOfflineSync();
  const [offlineStatus, setOfflineStatus] = useState<OfflineStatus>(getOfflineActionsStatus());
  const [isSyncing, setIsSyncing] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);
  const [lastSyncResult, setLastSyncResult] = useState<OfflineSyncResult | null>(null);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error' | 'info';
    message: string;
  } | null>(null);

  // Update status when offline events occur
  const updateStatus = useCallback(() => {
    setOfflineStatus(getOfflineActionsStatus());
  }, []);

  // Handle offline action events
  useEffect(() => {
    const handleOfflineActionStored = (event: CustomEvent) => {
      updateStatus();
      setNotification({
        type: 'info',
        message: `Action saved offline: ${event.detail.actionName}`
      });
    };

    const handleOfflineActionSynced = (event: CustomEvent) => {
      updateStatus();
      setNotification({
        type: 'success',
        message: `Action synced: ${event.detail.actionName}`
      });
    };

    const handleOfflineActionFailed = (event: CustomEvent) => {
      updateStatus();
      setNotification({
        type: 'error',
        message: `Sync failed: ${event.detail.actionName}`
      });
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('offlineActionStored', handleOfflineActionStored as EventListener);
      window.addEventListener('offlineActionSynced', handleOfflineActionSynced as EventListener);
      window.addEventListener('offlineActionFailed', handleOfflineActionFailed as EventListener);

      return () => {
        window.removeEventListener('offlineActionStored', handleOfflineActionStored as EventListener);
        window.removeEventListener('offlineActionSynced', handleOfflineActionSynced as EventListener);
        window.removeEventListener('offlineActionFailed', handleOfflineActionFailed as EventListener);
      };
    }
  }, [updateStatus]);

  // Periodic status update (reduced frequency)
  useEffect(() => {
    const interval = setInterval(updateStatus, 10000); // Increased from 3s to 10s
    return () => clearInterval(interval);
  }, [updateStatus]);

  // Manual sync function
  const performSync = useCallback(async (): Promise<OfflineSyncResult> => {
    if (!isOnline || isSyncing) {
      return { success: 0, failed: 0 };
    }

    setIsSyncing(true);
    try {
      const result = await syncOfflineActions();
      setLastSyncResult(result);
      
      if (result.success > 0) {
        setNotification({
          type: 'success',
          message: `Successfully synced ${result.success} action(s)`
        });
      }
      
      if (result.failed > 0) {
        setNotification({
          type: 'error',
          message: `Failed to sync ${result.failed} action(s)`
        });
      }
      
      return result;
    } catch (error) {
      setNotification({
        type: 'error',
        message: 'Sync operation failed'
      });
      return { success: 0, failed: 0 };
    } finally {
      setIsSyncing(false);
      updateStatus();
    }
  }, [isOnline, isSyncing, updateStatus]);

  // Retry failed actions
  const retryFailed = useCallback(async (): Promise<OfflineSyncResult> => {
    if (isRetrying || offlineStatus.failed.length === 0) {
      return { success: 0, failed: 0 };
    }

    setIsRetrying(true);
    try {
      const result = await retryFailedActions();
      setLastSyncResult(result);
      
      if (result.success > 0) {
        setNotification({
          type: 'success',
          message: `Successfully retried ${result.success} action(s)`
        });
      }
      
      return result;
    } catch (error) {
      setNotification({
        type: 'error',
        message: 'Retry operation failed'
      });
      return { success: 0, failed: 0 };
    } finally {
      setIsRetrying(false);
      updateStatus();
    }
  }, [isRetrying, offlineStatus.failed.length, updateStatus]);

  // Clear notification
  const clearNotification = useCallback(() => {
    setNotification(null);
  }, []);

  // Get summary status
  const getSummary = useCallback(() => {
    return {
      hasPending: offlineStatus.pending.length > 0,
      hasErrors: offlineStatus.failed.length > 0,
      isActive: offlineStatus.total > 0,
      canSync: isOnline && !isSyncing && offlineStatus.pending.length > 0,
      canRetry: !isRetrying && offlineStatus.failed.length > 0
    };
  }, [offlineStatus, isOnline, isSyncing, isRetrying]);

  return {
    // Status
    isOnline,
    offlineStatus,
    isSyncing,
    isRetrying,
    lastSyncResult,
    notification,
    summary: getSummary(),
    
    // Actions
    performSync,
    retryFailed,
    clearNotification,
    updateStatus,
    
    // Utilities
    hasPendingActions: offlineStatus.pending.length > 0,
    hasFailedActions: offlineStatus.failed.length > 0,
    totalActions: offlineStatus.total
  };
}
