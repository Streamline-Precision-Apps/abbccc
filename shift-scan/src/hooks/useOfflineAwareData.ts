"use client";
import { useCallback } from 'react';
import { useEnhancedOfflineStatus } from "@/hooks/useEnhancedOfflineStatus";
import { isOfflineTimesheet, getOfflineActionsStatus } from "@/utils/offlineFirstWrapper";

export interface OfflineData {
  logs: any[];
  timesheet: any | null;
  projects: any[];
  lastUpdate: number;
}

const OFFLINE_DATA_KEY = "offline_dashboard_data";

/**
 * Utility for managing offline dashboard data
 */
export class OfflineDashboardData {
  
  /**
   * Store dashboard data offline
   */
  static store(data: Partial<OfflineData>) {
    try {
      const existing = this.get();
      const updated = {
        ...existing,
        ...data,
        lastUpdate: Date.now()
      };
      localStorage.setItem(OFFLINE_DATA_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('Failed to store offline dashboard data:', error);
    }
  }

  /**
   * Get stored offline dashboard data
   */
  static get(): OfflineData {
    try {
      const data = localStorage.getItem(OFFLINE_DATA_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch (error) {
      console.error('Failed to get offline dashboard data:', error);
    }
    
    return {
      logs: [],
      timesheet: null,
      projects: [],
      lastUpdate: 0
    };
  }

  /**
   * Clear offline dashboard data
   */
  static clear() {
    try {
      localStorage.removeItem(OFFLINE_DATA_KEY);
    } catch (error) {
      console.error('Failed to clear offline dashboard data:', error);
    }
  }

  /**
   * Check if offline data is stale (older than 1 hour)
   */
  static isStale(): boolean {
    const data = this.get();
    const oneHour = 60 * 60 * 1000;
    return (Date.now() - data.lastUpdate) > oneHour;
  }

  /**
   * Generate mock timesheet data for offline mode
   */
  static generateMockTimesheet(userId: string, workRole: string): any {
    // First, check if we have a current offline timesheet
    try {
      const currentOfflineTimesheet = localStorage.getItem('current_offline_timesheet');
      if (currentOfflineTimesheet) {
        const timesheet = JSON.parse(currentOfflineTimesheet);
        console.log('[OFFLINE] Found current offline timesheet:', timesheet.id);
        return timesheet;
      }
    } catch (error) {
      console.error('Failed to get current offline timesheet:', error);
    }

    // Check for cached recent timecard API response
    try {
      const cachedTimecard = localStorage.getItem('cached_recent_timecard');
      if (cachedTimecard) {
        const timesheet = JSON.parse(cachedTimecard);
        console.log('[OFFLINE] Found cached timecard:', timesheet.id);
        return timesheet;
      }
    } catch (error) {
      console.error('Failed to get cached timecard:', error);
    }

    // Fallback to generating from offline actions
    const offlineStatus = getOfflineActionsStatus();
    const recentOfflineTimesheet = offlineStatus.pending
      .filter(action => action.actionName === 'handleGeneralTimeSheet')
      .sort((a, b) => b.timestamp - a.timestamp)[0];

    if (recentOfflineTimesheet) {
      console.log('[OFFLINE] Generating timesheet from offline action:', recentOfflineTimesheet.id);
      return {
        id: recentOfflineTimesheet.id,
        userId: userId,
        date: new Date().toISOString(),
        startTime: new Date(recentOfflineTimesheet.timestamp).toISOString(),
        endTime: null,
        status: 'DRAFT',
        workType: workRole.toUpperCase(),
        jobsiteId: recentOfflineTimesheet.formData.jobsiteId || '',
        costCode: recentOfflineTimesheet.formData.costcode || '',
        jobsiteLabel: recentOfflineTimesheet.formData.jobsiteLabel || 'Offline Job Site',
        costCodeLabel: recentOfflineTimesheet.formData.costCodeLabel || 'Offline Cost Code',
        isOffline: true,
        offlineTimestamp: recentOfflineTimesheet.timestamp
      };
    }

    console.log('[OFFLINE] No offline timesheet data found');
    return null;
  }

  /**
   * Generate mock logs for offline mode
   */
  static generateMockLogs(): any[] {
    // Return empty logs for offline mode - user hasn't created any logs yet
    return [];
  }
}

/**
 * Hook for offline-aware data fetching
 */
export function useOfflineAwareData() {
  const { isOnline } = useEnhancedOfflineStatus();

  /**
   * Fetch data with offline fallback
   */
  const fetchWithOfflineFallback = useCallback(async <T>(
    url: string,
    offlineKey: keyof OfflineData,
    mockDataGenerator?: () => T
  ): Promise<T | null> => {
    if (isOnline) {
      try {
        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          
          // Store successful online data for offline use
          OfflineDashboardData.store({ [offlineKey]: data });
          
          return data;
        }
      } catch (error) {
        console.error(`Failed to fetch ${url}:`, error);
      }
    }

    // Use offline data or mock data
    const offlineData = OfflineDashboardData.get();
    const storedData = offlineData[offlineKey];
    
    if (storedData && Array.isArray(storedData) && storedData.length > 0) {
      return storedData as T;
    }
    
    if (mockDataGenerator) {
      return mockDataGenerator();
    }

    return null;
  }, [isOnline]);

  /**
   * Fetch logs with offline support and caching to prevent repeat calls
   */
  const fetchLogs = useCallback(async () => {
    // Check if we already have recent logs data
    const cachedLogs = localStorage.getItem('dashboard_logs_cache');
    const now = Date.now();
    
    if (cachedLogs) {
      try {
        const { data, timestamp } = JSON.parse(cachedLogs);
        // Use cached data if it's less than 30 seconds old
        if (now - timestamp < 30000) {
          console.log('[CACHE] Using recent logs cache');
          return data;
        }
      } catch (error) {
        console.error('Failed to parse cached logs:', error);
      }
    }

    const logsData = await fetchWithOfflineFallback(
      '/api/getLogs',
      'logs',
      () => OfflineDashboardData.generateMockLogs()
    );

    // Cache the result for 30 seconds
    if (logsData) {
      try {
        localStorage.setItem('dashboard_logs_cache', JSON.stringify({
          data: logsData,
          timestamp: now
        }));
      } catch (error) {
        console.error('Failed to cache logs:', error);
      }
    }

    return logsData;
  }, [fetchWithOfflineFallback]);

  /**
   * Fetch recent timecard with offline support
   */
  const fetchRecentTimecard = useCallback(async (userId: string, workRole: string) => {
    if (isOnline) {
      try {
        const response = await fetch('/api/getRecentTimecard');
        if (response.ok) {
          const data = await response.json();
          
          // Store successful online data for offline use
          OfflineDashboardData.store({ timesheet: data });
          
          return data;
        }
      } catch (error) {
        console.error('Failed to fetch recent timecard:', error);
      }
    }

    // Use offline fallback
    console.log('[OFFLINE] Using offline timecard data');
    return OfflineDashboardData.generateMockTimesheet(userId, workRole);
  }, [isOnline]);

  /**
   * Fetch maintenance projects with offline support
   */
  const fetchMaintenanceProjects = useCallback(async () => {
    return await fetchWithOfflineFallback(
      '/api/getMaintenanceProjects',
      'projects',
      () => []
    );
  }, [fetchWithOfflineFallback]);

  return {
    isOnline,
    fetchLogs,
    fetchRecentTimecard,
    fetchMaintenanceProjects,
    clearOfflineData: OfflineDashboardData.clear,
    isDataStale: OfflineDashboardData.isStale
  };
}
