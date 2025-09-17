"use client";
import { 
  clearOfflineData, 
  getOfflineActionsStatus, 
  syncOfflineActions,
  retryFailedActions 
} from '@/utils/offlineFirstWrapper';

// Global window interface extension
declare global {
  interface Window {
    OfflineDevUtils: typeof OfflineDevUtils;
  }
}

/**
 * Development utilities for testing offline functionality
 * Only use these functions during development/testing
 */
export const OfflineDevUtils = {
  /**
   * Simulate going offline (for testing)
   */
  goOffline: () => {
    if (typeof window !== 'undefined') {
      // Override navigator.onLine temporarily
      Object.defineProperty(navigator, 'onLine', {
        value: false,
        writable: true
      });
      
      // Dispatch offline event
      window.dispatchEvent(new Event('offline'));
      console.log('[DEV] Simulated offline mode');
    }
  },

  /**
   * Simulate coming back online (for testing)
   */
  goOnline: () => {
    if (typeof window !== 'undefined') {
      // Restore navigator.onLine
      Object.defineProperty(navigator, 'onLine', {
        value: true,
        writable: true
      });
      
      // Dispatch online event
      window.dispatchEvent(new Event('online'));
      console.log('[DEV] Simulated online mode');
    }
  },

  /**
   * Get current offline status for debugging
   */
  getStatus: () => {
    const status = getOfflineActionsStatus();
    console.log('[DEV] Offline Status:', {
      isOnline: navigator.onLine,
      ...status
    });
    return status;
  },

  /**
   * Force sync all offline actions
   */
  forceSync: async () => {
    console.log('[DEV] Force syncing offline actions...');
    return await syncOfflineActions();
  },

  /**
   * Retry all failed actions
   */
  retryAll: async () => {
    console.log('[DEV] Retrying failed actions...');
    return await retryFailedActions();
  },

  /**
   * Clear all offline data (use with caution)
   */
  clearAll: () => {
    console.log('[DEV] Clearing all offline data...');
    clearOfflineData();
  },

  /**
   * Show all stored offline data
   */
  showStoredData: () => {
    try {
      const queue = localStorage.getItem('offline_timesheet_queue');
      const data = queue ? JSON.parse(queue) : [];
      console.log('[DEV] Stored offline data:', data);
      return data;
    } catch (error) {
      console.error('[DEV] Error reading stored data:', error);
      return [];
    }
  }
};

// Make utilities available globally in development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  window.OfflineDevUtils = OfflineDevUtils;
}

export default OfflineDevUtils;
