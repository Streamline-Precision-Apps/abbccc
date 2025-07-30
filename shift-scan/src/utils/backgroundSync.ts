/**
 * Background sync utilities for offline data synchronization
 */
'use client';

import { syncQueuedActions } from './offlineApi';

declare global {
  interface ServiceWorkerRegistration {
    sync?: {
      register(tag: string): Promise<void>;
    };
  }
  
  interface SyncEvent extends Event {
    tag: string;
    lastChance: boolean;
    waitUntil(promise: Promise<any>): void;
  }
}

export class BackgroundSync {
  private static instance: BackgroundSync;
  private registration: ServiceWorkerRegistration | null = null;

  private constructor() {}

  static getInstance(): BackgroundSync {
    if (!BackgroundSync.instance) {
      BackgroundSync.instance = new BackgroundSync();
    }
    return BackgroundSync.instance;
  }

  async init(): Promise<void> {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      return;
    }

    try {
      this.registration = await navigator.serviceWorker.ready;
      console.log('[BackgroundSync] Service worker ready for background sync');
    } catch (error) {
      console.warn('[BackgroundSync] Failed to initialize:', error);
    }
  }

  async scheduleSync(tag: string = 'offline-sync'): Promise<void> {
    if (!this.registration?.sync) {
      console.warn('[BackgroundSync] Background sync not supported');
      return;
    }

    try {
      await this.registration.sync.register(tag);
      console.log(`[BackgroundSync] Scheduled sync with tag: ${tag}`);
    } catch (error) {
      console.warn('[BackgroundSync] Failed to schedule sync:', error);
    }
  }

  async syncNow(): Promise<void> {
    try {
      await syncQueuedActions();
      console.log('[BackgroundSync] Manual sync completed');
    } catch (error) {
      console.error('[BackgroundSync] Manual sync failed:', error);
    }
  }
}

// Initialize background sync
export const backgroundSync = BackgroundSync.getInstance();

// Auto-initialize when module loads
if (typeof window !== 'undefined') {
  backgroundSync.init();
}
