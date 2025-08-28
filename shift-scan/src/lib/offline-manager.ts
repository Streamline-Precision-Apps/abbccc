/**
 * Offline Manager Utility
 * Provides client-side interface for managing offline functionality
 * and communicating with the service worker
 */

export interface OfflineStatus {
  offline: boolean;
  pendingActions: number;
  totalActions: number;
  offlineData: {
    timesheets: number;
    equipmentLogs: number;
  };
}

export interface PendingAction {
  id: string;
  actionName: string;
  timestamp: number;
  retryCount: number;
}

class OfflineManager {
  private serviceWorker: ServiceWorker | null = null;

  constructor() {
    this.initializeServiceWorker();
  }

  private async initializeServiceWorker() {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.ready;
        this.serviceWorker = registration.active;
        
        // Listen for service worker updates
        navigator.serviceWorker.addEventListener('controllerchange', () => {
          this.serviceWorker = navigator.serviceWorker.controller;
        });
      } catch (error) {
        console.error('Service Worker initialization failed:', error);
      }
    }
  }

  /**
   * Send a message to the service worker and wait for response
   */
  private async sendMessage(type: string, data?: any): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.serviceWorker) {
        reject(new Error('Service Worker not available'));
        return;
      }

      const messageChannel = new MessageChannel();
      messageChannel.port1.onmessage = (event) => {
        resolve(event.data);
      };

      this.serviceWorker.postMessage({ type, data }, [messageChannel.port2]);
      
      // Timeout after 5 seconds
      setTimeout(() => {
        reject(new Error('Service Worker message timeout'));
      }, 5000);
    });
  }

  /**
   * Get current offline status and pending actions count
   */
  async getOfflineStatus(): Promise<OfflineStatus> {
    try {
      return await this.sendMessage('GET_OFFLINE_STATUS');
    } catch (error) {
      console.error('Failed to get offline status:', error);
      return {
        offline: !navigator.onLine,
        pendingActions: 0,
        totalActions: 0,
        offlineData: { timesheets: 0, equipmentLogs: 0 }
      };
    }
  }

  /**
   * Get list of pending actions waiting to be synced
   */
  async getPendingActions(): Promise<PendingAction[]> {
    try {
      const result = await this.sendMessage('GET_PENDING_ACTIONS');
      return result.pendingActions || [];
    } catch (error) {
      console.error('Failed to get pending actions:', error);
      return [];
    }
  }

  /**
   * Manually trigger sync of offline actions
   */
  async syncOfflineActions(): Promise<boolean> {
    try {
      const result = await this.sendMessage('SYNC_OFFLINE_ACTIONS');
      return result.success || false;
    } catch (error) {
      console.error('Failed to sync offline actions:', error);
      return false;
    }
  }

  /**
   * Clear all offline data (use with caution)
   */
  async clearOfflineData(): Promise<boolean> {
    try {
      const result = await this.sendMessage('CLEAR_OFFLINE_DATA');
      return result.success || false;
    } catch (error) {
      console.error('Failed to clear offline data:', error);
      return false;
    }
  }

  /**
   * Check if the app is currently online
   */
  isOnline(): boolean {
    return navigator.onLine;
  }

  /**
   * Listen for online/offline events
   */
  onNetworkChange(callback: (online: boolean) => void): () => void {
    const handleOnline = () => callback(true);
    const handleOffline = () => callback(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Return cleanup function
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }

  /**
   * Get offline timesheet data from localStorage
   */
  getOfflineTimesheet(): any | null {
    try {
      const data = localStorage.getItem('current_offline_timesheet');
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Failed to get offline timesheet:', error);
      return null;
    }
  }

  /**
   * Get offline equipment logs from localStorage
   */
  getOfflineEquipmentLogs(): any[] {
    try {
      const data = localStorage.getItem('offline_equipment_logs');
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to get offline equipment logs:', error);
      return [];
    }
  }

  /**
   * Get offline dashboard data
   */
  getOfflineDashboardData(): any | null {
    try {
      const data = localStorage.getItem('offline_dashboard_data');
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Failed to get offline dashboard data:', error);
      return null;
    }
  }

  /**
   * Monitor offline status and automatically sync when back online
   */
  startAutoSync(onStatusChange?: (status: OfflineStatus) => void): () => void {
    let intervalId: NodeJS.Timeout;
    
    const checkAndSync = async () => {
      const status = await this.getOfflineStatus();
      
      if (onStatusChange) {
        onStatusChange(status);
      }

      // If we're online and have pending actions, try to sync
      if (!status.offline && status.pendingActions > 0) {
        console.log(`Auto-syncing ${status.pendingActions} pending actions`);
        const success = await this.syncOfflineActions();
        if (success) {
          console.log('Auto-sync completed successfully');
          if (onStatusChange) {
            // Get updated status after sync
            const updatedStatus = await this.getOfflineStatus();
            onStatusChange(updatedStatus);
          }
        }
      }
    };

    // Check immediately
    checkAndSync();

    // Check every 30 seconds
    intervalId = setInterval(checkAndSync, 30000);

    // Also check when network status changes
    const networkCleanup = this.onNetworkChange((online) => {
      if (online) {
        // Wait a bit for connection to stabilize
        setTimeout(checkAndSync, 2000);
      }
    });

    // Return cleanup function
    return () => {
      clearInterval(intervalId);
      networkCleanup();
    };
  }
}

// Export singleton instance
export const offlineManager = new OfflineManager();

// Export for use in components
export default offlineManager;
