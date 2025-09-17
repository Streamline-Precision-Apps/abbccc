/**
 * React hooks for offline functionality
 * Provides easy-to-use hooks for managing offline state in React components
 */

import { useState, useEffect, useCallback } from 'react';
import { offlineManager, OfflineStatus, PendingAction } from '@/lib/offline-manager';
import { LogItem } from '@/lib/types';

/**
 * Hook to track online/offline status
 */
export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const cleanup = offlineManager.onNetworkChange(setIsOnline);
    return cleanup;
  }, []);

  return isOnline;
}

/**
 * Hook to get and track offline status including pending actions
 */
export function useOfflineStatus() {
  const [status, setStatus] = useState<OfflineStatus>({
    offline: !navigator.onLine,
    pendingActions: 0,
    totalActions: 0,
    offlineData: { timesheets: 0, equipmentLogs: 0 }
  });
  const [loading, setLoading] = useState(true);

  const refreshStatus = useCallback(async () => {
    try {
      const newStatus = await offlineManager.getOfflineStatus();
      setStatus(newStatus);
    } catch (error) {
      console.error('Failed to refresh offline status:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshStatus();
    
    // Set up auto-sync with status updates
    const cleanup = offlineManager.startAutoSync(setStatus);
    
    return cleanup;
  }, [refreshStatus]);

  return { status, loading, refreshStatus };
}

/**
 * Hook to manage offline sync operations
 */
export function useOfflineSync() {
  const [syncing, setSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);

  const syncOfflineActions = useCallback(async (): Promise<boolean> => {
    if (syncing) return false;
    
    setSyncing(true);
    try {
      const success = await offlineManager.syncOfflineActions();
      if (success) {
        setLastSyncTime(new Date());
      }
      return success;
    } catch (error) {
      console.error('Sync failed:', error);
      return false;
    } finally {
      setSyncing(false);
    }
  }, [syncing]);

  const clearOfflineData = useCallback(async (): Promise<boolean> => {
    try {
      const success = await offlineManager.clearOfflineData();
      if (success) {
        setLastSyncTime(null);
      }
      return success;
    } catch (error) {
      console.error('Clear offline data failed:', error);
      return false;
    }
  }, []);

  return {
    syncing,
    lastSyncTime,
    syncOfflineActions,
    clearOfflineData
  };
}

/**
 * Hook to get pending actions waiting to be synced
 */
export function usePendingActions() {
  const [pendingActions, setPendingActions] = useState<PendingAction[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshPendingActions = useCallback(async () => {
    try {
      const actions = await offlineManager.getPendingActions();
      setPendingActions(actions);
    } catch (error) {
      console.error('Failed to get pending actions:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshPendingActions();
    
    // Refresh every 30 seconds
    const interval = setInterval(refreshPendingActions, 30000);
    
    return () => clearInterval(interval);
  }, [refreshPendingActions]);

  return { pendingActions, loading, refreshPendingActions };
}

/**
 * Hook to get offline data (timesheets, equipment logs, etc.)
 */
export function useOfflineData() {
  const [offlineTimesheet, setOfflineTimesheet] = useState<Record<string, unknown> | null>(null);
  const [offlineEquipmentLogs, setOfflineEquipmentLogs] = useState<LogItem[]>([]);
  const [offlineDashboardData, setOfflineDashboardData] = useState<Record<string, unknown> | null>(null);

  const refreshOfflineData = useCallback(() => {
    setOfflineTimesheet(offlineManager.getOfflineTimesheet());
    setOfflineEquipmentLogs(offlineManager.getOfflineEquipmentLogs() as LogItem[]);
    setOfflineDashboardData(offlineManager.getOfflineDashboardData());
  }, []);

  useEffect(() => {
    refreshOfflineData();
    
    // Listen for storage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key && e.key.startsWith('offline_')) {
        refreshOfflineData();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [refreshOfflineData]);

  return {
    offlineTimesheet,
    offlineEquipmentLogs,
    offlineDashboardData,
    refreshOfflineData
  };
}

/**
 * Combined hook that provides all offline functionality
 */
export function useOffline() {
  const isOnline = useOnlineStatus();
  const { status, loading: statusLoading, refreshStatus } = useOfflineStatus();
  const { syncing, lastSyncTime, syncOfflineActions, clearOfflineData } = useOfflineSync();
  const { pendingActions, loading: pendingLoading, refreshPendingActions } = usePendingActions();
  const offlineData = useOfflineData();

  return {
    // Status
    isOnline,
    status,
    loading: statusLoading || pendingLoading,
    
    // Actions
    syncOfflineActions,
    clearOfflineData,
    refreshStatus,
    refreshPendingActions,
    
    // Data
    pendingActions,
    syncing,
    lastSyncTime,
    ...offlineData
  };
}
