"use client";

/**
 * Offline-aware API wrapper for timesheet-related endpoints
 */

// Cache keys for storing API responses
const CACHE_KEYS = {
  RECENT_TIMECARD: 'cached_recent_timecard',
  RECENT_TIMECARD_RETURN: 'cached_recent_timecard_return',
  LOGS: 'cached_logs',
  JOBSITES: 'cached_jobsites',
  COST_CODES: 'cached_cost_codes',
  EQUIPMENT: 'cached_equipment'
};

/**
 * Enhanced fetch wrapper with offline fallback
 */
export async function fetchWithOfflineCache<T>(
  cacheKey: string,
  fetcher: () => Promise<T>,
  maxAge: number = 5 * 60 * 1000 // 5 minutes default
): Promise<T | null> {
  const isOnline = typeof navigator !== 'undefined' && navigator.onLine;

  if (isOnline) {
    try {
      const result = await fetcher();
      
      // Cache the successful result
      if (result) {
        const cacheData = {
          data: result,
          timestamp: Date.now(),
          cacheKey
        };
        localStorage.setItem(cacheKey, JSON.stringify(cacheData));
        console.log(`[API CACHE] Stored response for ${cacheKey}`);
      }
      
      return result;
    } catch (error) {
      console.warn(`[API] Online fetch failed for ${cacheKey}, trying cache:`, error);
      // Fall through to offline cache
    }
  }

  // Try to get from cache (either offline or failed online request)
  try {
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      const age = Date.now() - timestamp;
      
      if (age < maxAge || !isOnline) {
        console.log(`[API CACHE] Using cached data for ${cacheKey} (age: ${Math.round(age / 1000)}s)`);
        return data;
      } else {
        console.log(`[API CACHE] Cache expired for ${cacheKey}, removing`);
        localStorage.removeItem(cacheKey);
      }
    }
  } catch (error) {
    console.error(`[API CACHE] Failed to read cache for ${cacheKey}:`, error);
  }

  console.log(`[API CACHE] No valid cache for ${cacheKey}`);
  return null;
}

/**
 * Get recent timecard with offline support
 */
export async function getRecentTimecardOffline(): Promise<any> {
  return await fetchWithOfflineCache(
    CACHE_KEYS.RECENT_TIMECARD,
    async () => {
      const response = await fetch('/api/getRecentTimecard');
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      return response.json();
    }
  );
}

/**
 * Get recent timecard for return with offline support
 */
export async function getRecentTimecardReturnOffline(): Promise<any> {
  return await fetchWithOfflineCache(
    CACHE_KEYS.RECENT_TIMECARD_RETURN,
    async () => {
      const response = await fetch('/api/getRecentTimecardReturn');
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      return response.json();
    }
  );
}

/**
 * Get logs with offline support
 */
export async function getLogsOffline(): Promise<any[]> {
  const result = await fetchWithOfflineCache(
    CACHE_KEYS.LOGS,
    async () => {
      const response = await fetch('/api/getLogs');
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      return response.json();
    }
  );
  
  return result || [];
}

/**
 * Get jobsites with offline support  
 */
export async function getJobsitesOffline(): Promise<any[]> {
  const result = await fetchWithOfflineCache(
    CACHE_KEYS.JOBSITES,
    async () => {
      const response = await fetch('/api/getJobsites');
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      return response.json();
    },
    15 * 60 * 1000 // 15 minutes for jobsites
  );
  
  return result || [];
}

/**
 * Get cost codes with offline support
 */
export async function getCostCodesOffline(): Promise<any[]> {
  const result = await fetchWithOfflineCache(
    CACHE_KEYS.COST_CODES,
    async () => {
      const response = await fetch('/api/getCostCodes');
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      return response.json();
    },
    15 * 60 * 1000 // 15 minutes for cost codes
  );
  
  return result || [];
}

/**
 * Get equipment with offline support
 */
export async function getEquipmentOffline(): Promise<any[]> {
  const result = await fetchWithOfflineCache(
    CACHE_KEYS.EQUIPMENT,
    async () => {
      const response = await fetch('/api/getEquipment');
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      return response.json();
    },
    15 * 60 * 1000 // 15 minutes for equipment
  );
  
  return result || [];
}

/**
 * Clear all cached API data
 */
export function clearApiCache(): void {
  Object.values(CACHE_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
  console.log('[API CACHE] Cleared all cached API data');
}

/**
 * Check if we have offline timesheet data
 */
export function hasOfflineTimesheetData(): boolean {
  const currentOfflineTimesheet = localStorage.getItem('current_offline_timesheet');
  const offlineDashboardData = localStorage.getItem('offline_dashboard_data');
  
  return !!(currentOfflineTimesheet || offlineDashboardData);
}

/**
 * Get offline timesheet data for dashboard use
 */
export function getOfflineTimesheetData(): any | null {
  try {
    // First try current offline timesheet
    const currentOfflineTimesheet = localStorage.getItem('current_offline_timesheet');
    if (currentOfflineTimesheet) {
      return JSON.parse(currentOfflineTimesheet);
    }

    // Then try offline dashboard data
    const offlineDashboardData = localStorage.getItem('offline_dashboard_data');
    if (offlineDashboardData) {
      const data = JSON.parse(offlineDashboardData);
      return data.timesheet;
    }

    // Finally try cached recent timecard
    const cached = localStorage.getItem(CACHE_KEYS.RECENT_TIMECARD);
    if (cached) {
      const { data } = JSON.parse(cached);
      return data;
    }
  } catch (error) {
    console.error('[OFFLINE] Failed to get offline timesheet data:', error);
  }

  return null;
}
