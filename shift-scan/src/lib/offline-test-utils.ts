/**
 * Offline Testing Utilities
 * Helper functions for testing offline functionality in development
 */

interface OfflineStats {
  actionQueue: Record<string, unknown>[];
  timesheets: Array<{ key: string; data: Record<string, unknown> }>;
  equipmentLogs: Array<{ key: string; data: Record<string, unknown> }>;
  otherOfflineData: Array<{ key: string; size: number; data: Record<string, unknown> }>;
  totalStorageUsed: number;
}

export class OfflineTestUtils {
  /**
   * Simulate going offline (development only)
   */
  static simulateOffline(): void {
    if (process.env.NODE_ENV !== 'development') {
      console.warn('simulateOffline should only be used in development');
      return;
    }

    // Override navigator.onLine
    Object.defineProperty(navigator, 'onLine', {
      value: false,
      writable: true
    });

    // Dispatch offline event
    window.dispatchEvent(new Event('offline'));
    console.log('🔴 Simulated offline mode');
  }

  /**
   * Simulate going online (development only)
   */
  static simulateOnline(): void {
    if (process.env.NODE_ENV !== 'development') {
      console.warn('simulateOnline should only be used in development');
      return;
    }

    // Restore navigator.onLine
    Object.defineProperty(navigator, 'onLine', {
      value: true,
      writable: true
    });

    // Dispatch online event
    window.dispatchEvent(new Event('online'));
    console.log('🟢 Simulated online mode');
  }

  /**
   * Create a test timesheet form submission
   */
  static async createTestTimesheet(): Promise<void> {
    const formData = new FormData();
    formData.append('userId', 'test-user-' + Date.now());
    formData.append('jobsiteId', 'TEST-JOBSITE-001');
    formData.append('costcode', 'TEST-001');
    formData.append('comment', 'Test timesheet created at ' + new Date().toISOString());
    formData.append('workType', 'LABOR');

    try {
      const response = await fetch('/', {
        method: 'POST',
        headers: {
          'Next-Action': 'handleGeneralTimeSheet',
        },
        body: formData
      });

      if (response.headers.get('X-Offline') === 'true') {
        console.log('✅ Test timesheet created offline');
      } else {
        console.log('✅ Test timesheet created online');
      }

      const result = await response.json();
      console.log('Timesheet result:', result);
    } catch (error) {
      console.error('❌ Failed to create test timesheet:', error);
    }
  }

  /**
   * Create a test equipment log
   */
  static async createTestEquipmentLog(): Promise<void> {
    const formData = new FormData();
    formData.append('equipmentId', 'TEST-EQUIPMENT-001');
    formData.append('timesheetId', 'test-timesheet-' + Date.now());
    formData.append('notes', 'Test equipment log created at ' + new Date().toISOString());

    try {
      const response = await fetch('/', {
        method: 'POST',
        headers: {
          'Next-Action': 'CreateEmployeeEquipmentLog',
        },
        body: formData
      });

      if (response.headers.get('X-Offline') === 'true') {
        console.log('✅ Test equipment log created offline');
      } else {
        console.log('✅ Test equipment log created online');
      }

      const result = await response.json();
      console.log('Equipment log result:', result);
    } catch (error) {
      console.error('❌ Failed to create test equipment log:', error);
    }
  }

  /**
   * Get detailed offline statistics
   */
  static getOfflineStats(): OfflineStats {
    const stats: OfflineStats = {
      actionQueue: [],
      timesheets: [],
      equipmentLogs: [],
      otherOfflineData: [],
      totalStorageUsed: 0
    };

    try {
      // Get action queue
      const queue = localStorage.getItem('offline_action_queue');
      if (queue) {
        stats.actionQueue = JSON.parse(queue);
      }

      // Scan all localStorage for offline data
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (!key) continue;

        const value = localStorage.getItem(key);
        if (!value) continue;

        stats.totalStorageUsed += value.length;

        if (key.startsWith('offline_timesheet_')) {
          stats.timesheets.push({
            key,
            data: JSON.parse(value)
          });
        } else if (key.startsWith('offline_equipment_log_')) {
          stats.equipmentLogs.push({
            key,
            data: JSON.parse(value)
          });
        } else if (key.startsWith('offline_')) {
          stats.otherOfflineData.push({
            key,
            size: value.length,
            data: JSON.parse(value)
          });
        }
      }
    } catch (error) {
      console.error('Error getting offline stats:', error);
    }

    return stats;
  }

  /**
   * Clear all offline test data
   */
  static clearTestData(): void {
    const keysToRemove: string[] = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('offline_')) {
        keysToRemove.push(key);
      }
    }

    keysToRemove.forEach(key => localStorage.removeItem(key));
    console.log(`🧹 Cleared ${keysToRemove.length} offline data items`);
  }

  /**
   * Monitor service worker messages
   */
  static monitorServiceWorker(): void {
    if (!('serviceWorker' in navigator)) {
      console.warn('Service Worker not supported');
      return;
    }

    navigator.serviceWorker.addEventListener('message', (event) => {
      console.log('📨 Service Worker message:', event.data);
    });

    navigator.serviceWorker.ready.then((registration) => {
      console.log('🔧 Service Worker ready:', registration);
    });

    console.log('👀 Monitoring Service Worker messages...');
  }

  /**
   * Test offline sync functionality
   */
  static async testOfflineSync(): Promise<void> {
    console.log('🧪 Testing offline sync...');

    // 1. Go offline
    this.simulateOffline();
    
    // 2. Create some test data
    await this.createTestTimesheet();
    await this.createTestEquipmentLog();

    // 3. Show stats
    const stats = this.getOfflineStats();
    console.log('📊 Offline data created:', stats);

    // 4. Go back online
    setTimeout(() => {
      this.simulateOnline();
      console.log('📡 Back online - sync should start automatically');
    }, 2000);
  }

  /**
   * Stress test with multiple offline actions
   */
  static async stressTestOffline(count: number = 5): Promise<void> {
    console.log(`🚀 Stress testing with ${count} offline actions...`);
    
    this.simulateOffline();

    const promises = [];
    for (let i = 0; i < count; i++) {
      if (i % 2 === 0) {
        promises.push(this.createTestTimesheet());
      } else {
        promises.push(this.createTestEquipmentLog());
      }
    }

    await Promise.all(promises);

    const stats = this.getOfflineStats();
    console.log(`📊 Created ${stats.actionQueue.length} offline actions`);

    // Go back online after a delay
    setTimeout(() => {
      this.simulateOnline();
      console.log('📡 Back online - mass sync should start');
    }, 3000);
  }

  /**
   * Print comprehensive offline report
   */
  static printOfflineReport(): void {
    const stats = this.getOfflineStats();
    
    console.group('📋 Offline Status Report');
    console.log('🌐 Online Status:', navigator.onLine);
    console.log('⏳ Pending Actions:', stats.actionQueue.length);
    console.log('📝 Offline Timesheets:', stats.timesheets.length);
    console.log('🔧 Offline Equipment Logs:', stats.equipmentLogs.length);
    console.log('💾 Storage Used:', Math.round(stats.totalStorageUsed / 1024) + ' KB');
    
    if (stats.actionQueue.length > 0) {
      console.group('⏳ Action Queue Details');
      stats.actionQueue.forEach((action: Record<string, unknown>, index: number) => {
        console.log(`${index + 1}. ${action.actionName} (${action.status}) - ${new Date(action.timestamp as number).toLocaleString()}`);
      });
      console.groupEnd();
    }

    if (stats.timesheets.length > 0) {
      console.group('📝 Offline Timesheets');
      stats.timesheets.forEach((ts: { key: string; data: Record<string, unknown> }, index: number) => {
        console.log(`${index + 1}. ${ts.data.id} - ${ts.data.workType} (${new Date(ts.data.startTime as string).toLocaleString()})`);
      });
      console.groupEnd();
    }

    console.groupEnd();
  }
}

// Make available globally in development
declare global {
  interface Window {
    OfflineTestUtils: typeof OfflineTestUtils;
  }
}
if (process.env.NODE_ENV === 'development') {
  window.OfflineTestUtils = OfflineTestUtils;
  console.log('🧪 OfflineTestUtils available on window.OfflineTestUtils');
  console.log('Example usage:');
  console.log('  OfflineTestUtils.testOfflineSync()');
  console.log('  OfflineTestUtils.printOfflineReport()');
  console.log('  OfflineTestUtils.simulateOffline()');
  console.log('  OfflineTestUtils.simulateOnline()');
}

export default OfflineTestUtils;
