const CACHE_NAME = 'shift-scan-cache-v4'; // Updated version to fix CSS caching
const STATIC_ASSETS = [
  '/manifest.json',
  '/offline.html',
  '/fallback.css', // Fallback CSS for offline mode
  '/', // Cache the root page to help with CSS discovery
];

// URLs patterns that should be cached with network-first strategy
const CACHE_PATTERNS = [
  /\/_next\/static\/css\/.*\.css(\?.*)?$/,   // Next.js CSS files with query params
  /\/_next\/static\/chunks\/.*\.js(\?.*)?$/, // Next.js JavaScript chunks with query params
  /\/_next\/static\/.*\.(css|js)(\?.*)?$/,   // All Next.js static assets with query params
  /\.css(\?.*)?$/,                           // All CSS files (with or without query params)
  /\.js(\?.*)?$/,                            // All JavaScript files with query params
  /\.(png|jpg|jpeg|gif|svg|ico|webp)(\?.*)?$/, // Images with query params
  /\/api\/.*$/,                              // API routes (for offline fallback)
];

// Debug logging function
const log = (message, data = '') => {
  console.log(`[ServiceWorker] ${message}`, data);
};

// Function to discover and cache CSS files
const discoverAndCacheCSS = async (cache) => {
  try {
    // Try to fetch the main page to discover CSS files
    const response = await fetch('/');
    if (response.ok) {
      const html = await response.text();
      
      // Extract CSS file URLs from the HTML
      const cssMatches = html.match(/href="([^"]*\.css[^"]*)"/g);
      if (cssMatches) {
        for (const match of cssMatches) {
          const href = match.match(/href="([^"]*)"/)[1];
          if (href.startsWith('/_next/static/css/')) {
            try {
              const cssResponse = await fetch(href);
              if (cssResponse.ok) {
                await cache.put(href, cssResponse.clone());
                log('Discovered and cached CSS:', href);
                
                // Also cache without query parameters for easier matching
                const baseHref = href.split('?')[0];
                if (baseHref !== href) {
                  await cache.put(baseHref, cssResponse.clone());
                  log('Cached CSS base URL:', baseHref);
                }
              }
            } catch (err) {
              log('Failed to cache discovered CSS:', href, err.message);
            }
          }
        }
      }
    }
  } catch (err) {
    log('CSS discovery failed:', err.message);
  }
};

// Function to find cached CSS file even with different query parameters
const findCachedCSS = async (request) => {
  const url = new URL(request.url);
  const baseUrl = `${url.origin}${url.pathname}`;
  
  try {
    const cache = await caches.open(CACHE_NAME);
    const keys = await cache.keys();
    
    // Look for a cached version of this CSS file
    for (const key of keys) {
      const keyUrl = new URL(key.url);
      const keyBaseUrl = `${keyUrl.origin}${keyUrl.pathname}`;
      
      if (keyBaseUrl === baseUrl && keyUrl.pathname.endsWith('.css')) {
        const cached = await cache.match(key);
        if (cached) {
          log('Found cached CSS with different query params:', key.url);
          return cached;
        }
      }
    }
  } catch (err) {
    log('Error searching for cached CSS:', err.message);
  }
  
  return null;
};

self.addEventListener('install', event => {
  log('Service Worker installing...');
  event.waitUntil(
    caches.open(CACHE_NAME).then(async cache => {
      try {
        // Cache static assets first
        await cache.addAll(STATIC_ASSETS);
        log('Static assets cached successfully');
        
        // Discover and cache CSS files from the main page
        await discoverAndCacheCSS(cache);
        
      } catch (err) {
        log('Install failed:', err);
        throw err;
      }
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {

  // Only handle GET requests
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);
  const pathname = url.pathname;
  const fullUrl = url.href;

  // Exclude /signin and /api/auth/* from service worker handling
  if (pathname === '/signin' || pathname.startsWith('/api/auth/')) {
    return;
  }

  // Special handling for navigation requests (HTML pages)
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          if (response && response.status === 200) {
            const cloned = response.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, cloned).catch(err => 
                log('Failed to cache navigation request:', err)
              );
            });
          }
          return response;
        })
        .catch(async () => {
          log('Navigation request failed, trying cache for:', pathname);
          // Try to serve from cache
          const cached = await caches.match(event.request);
          if (cached) return cached;
          // Fallback: return the branded offline.html page
          return caches.match('/offline.html');
        })
    );
    return;
  }

  // Check if this request should be cached based on patterns
  const shouldCache = CACHE_PATTERNS.some(pattern => pattern.test(fullUrl) || pattern.test(pathname));

  if (shouldCache) {
    const isCss = pathname.endsWith('.css');
    // Always use the base path (no query params) as the cache key for CSS
    const cacheKey = isCss ? `${url.origin}${pathname}` : event.request;

    // Only log and cache the base CSS file (no query params)
    if (isCss && url.search) {
      // For requests with query params, just serve the cached base file (if available)
      event.respondWith(
        caches.open(CACHE_NAME).then(async cache => {
          const cached = await cache.match(cacheKey);
          if (cached) {
            // Only log once for serving from cache
            // log('Serving CSS from cache (query param request):', cacheKey);
            return cached;
          }
          // If not cached, try to fetch and cache the base file
          try {
            const response = await fetch(cacheKey);
            if (response && response.status === 200 && response.type !== 'opaque') {
              await cache.put(cacheKey, response.clone());
              log('Successfully fetched and caching (base CSS):', cacheKey);
              return response;
            }
          } catch (err) {
            // Ignore fetch errors
          }
          // Fallback: try to find any cached CSS
          const fallback = await findCachedCSS(event.request);
          if (fallback) return fallback;
          // Fallback: serve fallback.css if critical
          if (pathname.includes('app/layout.css') || pathname.includes('app/page.css')) {
            const fallbackCSS = await cache.match('/fallback.css');
            if (fallbackCSS) return fallbackCSS;
          }
          return fetch(event.request); // As last resort
        })
      );
      return;
    }

    // For base CSS file (no query params), fetch, cache, and log ONCE
    event.respondWith(
      fetch(event.request)
        .then(response => {
          if (response && response.status === 200 && response.type !== 'opaque') {
            log('Successfully fetched and caching:', cacheKey);
            const responseToCache = response.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(cacheKey, responseToCache).catch(err => 
                log('Failed to cache asset:', cacheKey, err)
              );
            });
          }
          return response;
        })
        .catch(async () => {
          log('Network failed, trying cache for:', cacheKey);
          // Try to get from cache
          const cached = await caches.match(cacheKey);
          if (cached) {
            log('Serving from cache:', cacheKey);
            return cached;
          }
          // For CSS files, try to find a cached version with different query params
          if (isCss) {
            const cachedCSS = await findCachedCSS(event.request);
            if (cachedCSS) {
              log('Serving CSS from cache (query param match):', cacheKey);
              return cachedCSS;
            }
            // If no CSS found and it's a critical CSS file, serve fallback
            if (pathname.includes('app/layout.css') || pathname.includes('app/page.css')) {
              const fallbackCSS = await caches.match('/fallback.css');
              if (fallbackCSS) {
                log('Serving fallback CSS for:', cacheKey);
                return fallbackCSS;
              }
            }
          }
          log('No cache found for:', cacheKey);
          throw new Error('No cache available');
        })
    );
    return;
  }

  // Default handling for other requests
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) {
        log('Serving from cache (default):', fullUrl);
        return cached;
      }
      
      return fetch(event.request).then(response => {
        if (response && response.status === 200 && response.type !== 'opaque') {
          const cloned = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, cloned).catch(err => 
              log('Failed to cache default asset:', fullUrl, err)
            );
          });
        }
        return response;
      }).catch(() => {
        log('Failed to fetch and no cache for:', fullUrl);
        return caches.match('/offline.html');
      });
    })
  );
});

// Background sync event handler
self.addEventListener('sync', event => {
  if (event.tag === 'offline-sync') {
    log('Background sync triggered');
    event.waitUntil(handleBackgroundSync());
  }
});

// Handle background sync
async function handleBackgroundSync() {
  try {
    // Get queued actions from IndexedDB and sync them
    const dbRequest = indexedDB.open('OfflineDb', 1);
    
    return new Promise((resolve, reject) => {
      dbRequest.onsuccess = async () => {
        const db = dbRequest.result;
        const transaction = db.transaction(['queuedActions'], 'readwrite');
        const store = transaction.objectStore('queuedActions');
        const getAllRequest = store.getAll();
        
        getAllRequest.onsuccess = async () => {
          const actions = getAllRequest.result;
          let syncedCount = 0;
          
          for (const action of actions) {
            try {
              const response = await fetch(action.endpoint, {
                method: action.method,
                headers: { 'Content-Type': 'application/json' },
                body: action.payload ? JSON.stringify(action.payload) : undefined,
              });
              
              if (response.ok) {
                // Remove successfully synced action
                store.delete(action.id);
                syncedCount++;
              }
            } catch (err) {
              log('Background sync action failed:', err);
            }
          }
          
          log(`Background sync completed: ${syncedCount} actions synced`);
          resolve();
        };
        
        getAllRequest.onerror = () => reject(getAllRequest.error);
      };
      
      dbRequest.onerror = () => reject(dbRequest.error);
    });
  } catch (error) {
    log('Background sync failed:', error);
    throw error;
  }
}
