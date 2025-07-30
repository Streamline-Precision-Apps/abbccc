/**
 * Comprehensive offline API utilities for Shift Scan application
 * Handles caching, queuing, and synchronization of data when offline
 */

import { offlineDb, type CachedApiResponse, type QueuedAction } from './offlineDb';

// Additional types for better type safety
interface FetchOptions extends RequestInit {
  timeout?: number;
  retries?: number;
  ttl?: number; // Cache time to live
}

interface SyncResult {
  success: boolean;
  syncedCount: number;
  failedCount: number;
  errors: Array<{ action: QueuedAction; error: string }>;
}

// Constants
const DEFAULT_TIMEOUT = 30000; // 30 seconds
const DEFAULT_TTL = 300000; // 5 minutes
const MAX_RETRY_ATTEMPTS = 3;
const CACHE_CLEANUP_INTERVAL = 3600000; // 1 hour

/**
 * Checks if the browser is online
 */
export function isOnline(): boolean {
  return typeof window !== 'undefined' ? window.navigator.onLine : true;
}

/**
 * Enhanced fetch with timeout support
 */
async function fetchWithTimeout(url: string, options: FetchOptions = {}): Promise<Response> {
  const { timeout = DEFAULT_TIMEOUT, ...fetchOptions } = options;
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error(`Request timeout after ${timeout}ms`);
    }
    throw error;
  }
}

/**
 * Checks if cached data is still valid based on TTL
 */
function isCacheValid(cachedItem: CachedApiResponse, defaultTtl = DEFAULT_TTL): boolean {
  const ttl = cachedItem.ttl || defaultTtl;
  return Date.now() - cachedItem.timestamp < ttl;
}

/**
 * Fetches data from API with comprehensive offline caching support
 * @param key - Unique identifier for caching
 * @param fetcher - Function that returns a Promise with the data
 * @param options - Additional options for caching and fetching
 */
export async function fetchWithOfflineCache<T = any>(
  key: string,
  fetcher: () => Promise<T>,
  options: { ttl?: number; forceRefresh?: boolean } = {}
): Promise<T> {
  const { ttl = DEFAULT_TTL, forceRefresh = false } = options;
  
  // Check cache first if not forcing refresh
  if (!forceRefresh) {
    try {
      const cached = await offlineDb.cachedApiResponses.get(key);
      if (cached && isCacheValid(cached, ttl)) {
        return cached.data;
      }
    } catch (error) {
      console.warn('Cache read error:', error);
    }
  }
  
  if (isOnline()) {
    try {
      const data = await fetcher();
      
      // Cache the successful response
      try {
        await offlineDb.cachedApiResponses.put({
          key,
          data,
          timestamp: Date.now(),
          ttl,
        });
      } catch (cacheError) {
        console.warn('Cache write error:', cacheError);
      }
      
      return data;
    } catch (fetchError) {
      // If online fetch fails, try to serve from cache
      try {
        const cached = await offlineDb.cachedApiResponses.get(key);
        if (cached) {
          console.warn('Serving stale cache due to fetch error:', fetchError);
          return cached.data;
        }
      } catch (cacheError) {
        console.warn('Cache fallback failed:', cacheError);
      }
      
      throw fetchError;
    }
  } else {
    // Offline: serve from cache
    try {
      const cached = await offlineDb.cachedApiResponses.get(key);
      if (cached) {
        return cached.data;
      }
    } catch (cacheError) {
      console.warn('Offline cache read error:', cacheError);
    }
    
    throw new Error('Offline and no cached data available for key: ' + key);
  }
}

/**
 * Enhanced API fetch function with automatic caching
 */
export async function apiGet<T = any>(
  endpoint: string,
  options: FetchOptions & { cacheKey?: string; ttl?: number } = {}
): Promise<T> {
  const { cacheKey = endpoint, ttl = DEFAULT_TTL, ...fetchOptions } = options;
  
  return fetchWithOfflineCache(
    cacheKey,
    async () => {
      const response = await fetchWithTimeout(endpoint, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...fetchOptions.headers,
        },
        ...fetchOptions,
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      return response.json();
    },
    { ttl }
  );
}

/**
 * Queues a server action (mutation) for later sync when offline
 */
export async function queueServerAction(
  endpoint: string,
  method: string,
  payload: any = null,
  options: { maxRetries?: number } = {}
): Promise<void> {
  const { maxRetries = MAX_RETRY_ATTEMPTS } = options;
  
  const action: QueuedAction = {
    endpoint,
    method,
    payload,
    timestamp: Date.now(),
    retryCount: 0,
    maxRetries,
  };
  
  try {
    await offlineDb.queuedActions.add(action);
  } catch (error) {
    console.error('Failed to queue action:', error);
    throw new Error('Failed to queue offline action');
  }
}

/**
 * Executes a server action immediately if online, queues if offline
 */
export async function executeOrQueueAction<T = any>(
  endpoint: string,
  method: string,
  payload: any = null,
  options: FetchOptions & { maxRetries?: number } = {}
): Promise<T | null> {
  if (isOnline()) {
    try {
      const response = await fetchWithTimeout(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        body: payload ? JSON.stringify(payload) : undefined,
        ...options,
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      // Invalidate related cache entries
      await invalidateCacheByPattern(endpoint);
      
      return response.json();
    } catch (error) {
      console.warn('Online action failed, queuing for later:', error);
      await queueServerAction(endpoint, method, payload, options);
      return null;
    }
  } else {
    await queueServerAction(endpoint, method, payload, options);
    return null;
  }
}

/**
 * Attempts to sync all queued actions when online
 */
export async function syncQueuedActions(): Promise<SyncResult> {
  if (!isOnline()) {
    return { success: false, syncedCount: 0, failedCount: 0, errors: [] };
  }
  
  const actions = await offlineDb.queuedActions.orderBy('timestamp').toArray();
  let syncedCount = 0;
  let failedCount = 0;
  const errors: Array<{ action: QueuedAction; error: string }> = [];
  
  for (const action of actions) {
    try {
      const response = await fetchWithTimeout(action.endpoint, {
        method: action.method,
        headers: { 'Content-Type': 'application/json' },
        body: action.payload ? JSON.stringify(action.payload) : undefined,
        timeout: DEFAULT_TIMEOUT,
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      // Success: remove from queue and invalidate cache
      await offlineDb.queuedActions.delete(action.id!);
      await invalidateCacheByPattern(action.endpoint);
      syncedCount++;
      
    } catch (error) {
      const retryCount = (action.retryCount || 0) + 1;
      const maxRetries = action.maxRetries || MAX_RETRY_ATTEMPTS;
      
      if (retryCount >= maxRetries) {
        // Max retries reached, remove from queue
        await offlineDb.queuedActions.delete(action.id!);
        failedCount++;
        errors.push({
          action,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      } else {
        // Increment retry count
        await offlineDb.queuedActions.update(action.id!, { 
          ...action,
          retryCount 
        });
      }
    }
  }
  
  return {
    success: failedCount === 0,
    syncedCount,
    failedCount,
    errors,
  };
}

/**
 * Gets the count of queued actions
 */
export async function getQueuedActionsCount(): Promise<number> {
  try {
    return await offlineDb.queuedActions.count();
  } catch (error) {
    console.warn('Failed to get queued actions count:', error);
    return 0;
  }
}

/**
 * Clears all queued actions (use with caution)
 */
export async function clearQueuedActions(): Promise<void> {
  try {
    await offlineDb.queuedActions.clear();
  } catch (error) {
    console.error('Failed to clear queued actions:', error);
    throw error;
  }
}

/**
 * Invalidates cache entries by pattern matching
 */
export async function invalidateCacheByPattern(pattern: string): Promise<void> {
  try {
    const allCached = await offlineDb.cachedApiResponses.toArray();
    const toDelete = allCached.filter(item => item.key.includes(pattern));
    
    for (const item of toDelete) {
      await offlineDb.cachedApiResponses.delete(item.key);
    }
  } catch (error) {
    console.warn('Cache invalidation failed:', error);
  }
}

/**
 * Invalidates specific cache entry
 */
export async function invalidateCache(key: string): Promise<void> {
  try {
    await offlineDb.cachedApiResponses.delete(key);
  } catch (error) {
    console.warn('Cache invalidation failed for key:', key, error);
  }
}

/**
 * Clears expired cache entries
 */
export async function cleanupExpiredCache(): Promise<void> {
  try {
    const allCached = await offlineDb.cachedApiResponses.toArray();
    const now = Date.now();
    
    for (const item of allCached) {
      if (!isCacheValid(item)) {
        await offlineDb.cachedApiResponses.delete(item.key);
      }
    }
  } catch (error) {
    console.warn('Cache cleanup failed:', error);
  }
}

/**
 * Gets cache statistics
 */
export async function getCacheStats(): Promise<{
  totalEntries: number;
  expiredEntries: number;
  totalSize: number;
}> {
  try {
    const allCached = await offlineDb.cachedApiResponses.toArray();
    const expiredEntries = allCached.filter(item => !isCacheValid(item)).length;
    const totalSize = JSON.stringify(allCached).length;
    
    return {
      totalEntries: allCached.length,
      expiredEntries,
      totalSize,
    };
  } catch (error) {
    console.warn('Failed to get cache stats:', error);
    return { totalEntries: 0, expiredEntries: 0, totalSize: 0 };
  }
}

/**
 * Initializes periodic cache cleanup
 */
export function initializeCacheCleanup(): void {
  if (typeof window !== 'undefined') {
    setInterval(cleanupExpiredCache, CACHE_CLEANUP_INTERVAL);
  }
}

// Initialize cache cleanup on module load
if (typeof window !== 'undefined') {
  initializeCacheCleanup();
}
