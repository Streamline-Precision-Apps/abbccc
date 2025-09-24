/**
 * Offline Cache Manager
 * Utilities to manage comprehensive app caching for full offline functionality
 */
'use client';

/**
 * Triggers the service worker to cache all critical routes and resources
 */
export const cacheEntireApp = async (): Promise<boolean> => {
  if (!('serviceWorker' in navigator)) {
    console.warn('Service Worker not supported');
    return false;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    
    if (registration.active) {
      // Send message to service worker to cache all routes
      registration.active.postMessage({ type: 'CACHE_ALL_ROUTES' });
      
      console.log('[OfflineCacheManager] Triggered comprehensive app caching');
      return true;
    }
    
    console.warn('[OfflineCacheManager] No active service worker found');
    return false;
  } catch (error) {
    console.error('[OfflineCacheManager] Failed to trigger caching:', error);
    return false;
  }
};

/**
 * Checks if the app is likely to work offline by testing cache availability
 */
export const checkOfflineReadiness = async (): Promise<{
  isReady: boolean;
  cachedRoutes: string[];
  cachedAssets: number;
}> => {
  if (!('caches' in window)) {
    return { isReady: false, cachedRoutes: [], cachedAssets: 0 };
  }

  try {
    const cache = await caches.open('shift-scan-cache-v19');
    const cachedRequests = await cache.keys();
    
    const cachedRoutes = cachedRequests
      .map(req => new URL(req.url).pathname)
      .filter(path => !path.includes('/_next/') && !path.includes('.'))
      .filter((path, index, arr) => arr.indexOf(path) === index); // Remove duplicates

    const criticalRoutes = ['/', '/dashboard', '/clock', '/break'];
    const hasCriticalRoutes = criticalRoutes.every(route => 
      cachedRoutes.includes(route)
    );

    return {
      isReady: hasCriticalRoutes && cachedRequests.length > 10,
      cachedRoutes,
      cachedAssets: cachedRequests.length
    };
  } catch (error) {
    console.error('[OfflineCacheManager] Failed to check offline readiness:', error);
    return { isReady: false, cachedRoutes: [], cachedAssets: 0 };
  }
};

/**
 * Clears all cached data (useful for development/testing)
 */
export const clearAllCaches = async (): Promise<boolean> => {
  if (!('caches' in window)) {
    return false;
  }

  try {
    const cacheNames = await caches.keys();
    await Promise.all(cacheNames.map(name => caches.delete(name)));
    
    console.log('[OfflineCacheManager] Cleared all caches');
    return true;
  } catch (error) {
    console.error('[OfflineCacheManager] Failed to clear caches:', error);
    return false;
  }
};

/**
 * Gets cache statistics
 */
export const getCacheStats = async (): Promise<{
  totalCaches: number;
  totalEntries: number;
  estimatedSize: string;
}> => {
  if (!('caches' in window)) {
    return { totalCaches: 0, totalEntries: 0, estimatedSize: '0 KB' };
  }

  try {
    const cacheNames = await caches.keys();
    let totalEntries = 0;
    
    for (const name of cacheNames) {
      const cache = await caches.open(name);
      const keys = await cache.keys();
      totalEntries += keys.length;
    }

    // Rough estimate - each cache entry averages ~50KB
    const estimatedBytes = totalEntries * 50 * 1024;
    const estimatedSize = estimatedBytes > 1024 * 1024 
      ? `${(estimatedBytes / (1024 * 1024)).toFixed(1)} MB`
      : `${(estimatedBytes / 1024).toFixed(1)} KB`;

    return {
      totalCaches: cacheNames.length,
      totalEntries,
      estimatedSize
    };
  } catch (error) {
    console.error('[OfflineCacheManager] Failed to get cache stats:', error);
    return { totalCaches: 0, totalEntries: 0, estimatedSize: '0 KB' };
  }
};
