import Dexie, { Table } from 'dexie';

export interface CachedApiResponse {
  key: string;
  data: unknown;
  timestamp: number;
  ttl?: number; // Time to live in milliseconds
}

export interface QueuedAction {
  id?: number;
  endpoint: string;
  method: string;
  payload: Record<string, unknown> | null;
  timestamp: number;
  retryCount?: number;
  maxRetries?: number;
  lastError?: string; // Track last error for debugging
}

/**
 * Dexie.js database for offline caching and action queue
 */
class OfflineDb extends Dexie {
  cachedApiResponses!: Table<CachedApiResponse, string>;
  queuedActions!: Table<QueuedAction, number>;

  constructor() {
    super('OfflineDb');
    this.version(2).stores({
      cachedApiResponses: 'key',
      queuedActions: '++id,endpoint,method,timestamp',
    });
    
    // Add index for timestamp-based queries
    this.version(2).stores({
      cachedApiResponses: 'key',
      queuedActions: '++id,endpoint,method,timestamp',
    });
  }
}

export const offlineDb = new OfflineDb();
