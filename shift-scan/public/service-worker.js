const CACHE_NAME = 'shift-scan-cache-v5'; // Updated version for comprehensive caching
const STATIC_ASSETS = [
  '/manifest.json',
  '/offline.html',
  '/fallback.css', // Fallback CSS for offline mode
  '/', // Cache the root page to help with CSS discovery
  '/dashboard', // Main dashboard page
  '/clock', // Clock page
  '/break', // Break page
  '/dashboard/equipment/log-new', // Equipment log page
  '/dashboard/switch-jobs', // Switch jobs page
];

// Critical assets that should be pre-cached
const CRITICAL_ASSETS = [
  // SVG icons (add all your SVGs)
  '/logo.svg',
  '/arrowBack.svg',
  '/arrowDown.svg',
  '/arrowLeft.svg',
  '/arrowRight.svg',
  '/home.svg',
  '/clock.svg',
  '/equipment.svg',
  '/form.svg',
  '/inbox.svg',
  '/jobsite.svg',
  '/plus.svg',
  '/calendar.svg',
  '/camera.svg',
  '/comment.svg',
  '/export.svg',
  '/eye.svg',
  '/fileClosed.svg',
  '/fileOpen.svg',
  '/filterDials.svg',
  '/filterFunnel.svg',
  '/header.svg',
  '/information.svg',
  '/language.svg',
  '/layout.svg',
  '/message.svg',
  '/mileage.svg',
  '/minus.svg',
  '/moreOptions.svg',
  '/policies.svg',
  // Add more SVGs as needed
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
  /\/_next\/image(\?.*)?$/,                  // Next.js optimized images
];

// API endpoints to cache responses for offline use
const API_CACHE_PATTERNS = [
  /\/api\/cookies(\?.*)?$/,
  /\/api\/getRecentTimecard$/,
  /\/api\/jobsites\/.*$/,
  /\/api\/getJobsites$/,
  /\/api\/getCostCodes$/,
  /\/api\/getEquipment$/,
];

// Debug logging function
const log = (message, data = '') => {
  console.log(`[ServiceWorker] ${message}`, data);
};

// Enhanced function to discover and cache all critical app resources
const discoverAndCacheAppResources = async (cache) => {
  try {
    // 1. Cache critical SVG assets first
    for (const asset of CRITICAL_ASSETS) {
      try {
        const response = await fetch(asset);
        if (response.ok) {
          await cache.put(asset, response);
          log('Cached critical asset:', asset);
        }
      } catch (err) {
        log('Failed to cache critical asset:', asset, err.message);
      }
    }

    // 2. Discover and cache CSS files from the main page
    const response = await fetch('/');
    if (response.ok) {
      const html = await response.text();
      
      // Extract and cache CSS files
      const cssMatches = html.match(/href="([^"]*\.css[^"]*)"/g);
      if (cssMatches) {
        for (const match of cssMatches) {
          const href = match.match(/href="([^"]*)"/)[1];
          if (href.startsWith('/_next/static/css/') || href.startsWith('/')) {
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

      // Extract and cache JavaScript files
      const jsMatches = html.match(/src="([^"]*\.js[^"]*)"/g);
      if (jsMatches) {
        for (const match of jsMatches) {
          const src = match.match(/src="([^"]*)"/)[1];
          if (src.startsWith('/_next/static/')) {
            try {
              const jsResponse = await fetch(src);
              if (jsResponse.ok) {
                await cache.put(src, jsResponse.clone());
                log('Discovered and cached JS:', src);
              }
            } catch (err) {
              log('Failed to cache discovered JS:', src, err.message);
            }
          }
        }
      }
    }

    // 3. Pre-cache important pages by visiting them
    const importantPages = ['/dashboard', '/clock', '/break'];
    for (const page of importantPages) {
      try {
        const pageResponse = await fetch(page);
        if (pageResponse.ok) {
          await cache.put(page, pageResponse.clone());
          log('Pre-cached page:', page);
          
          // Extract resources from this page too
          const pageHtml = await pageResponse.text();
          const pageResources = [
            ...pageHtml.match(/href="([^"]*\.(css|js)[^"]*)"/g) || [],
            ...pageHtml.match(/src="([^"]*\.(js|png|jpg|jpeg|svg)[^"]*)"/g) || []
          ];
          
          for (const resource of pageResources) {
            const url = resource.match(/(href|src)="([^"]*)"/)[2];
            if (url.startsWith('/_next/') || url.startsWith('/')) {
              try {
                const resourceResponse = await fetch(url);
                if (resourceResponse.ok) {
                  await cache.put(url, resourceResponse);
                  log('Cached page resource:', url);
                }
              } catch (err) {
                // Ignore individual resource failures
              }
            }
          }
        }
      } catch (err) {
        log('Failed to pre-cache page:', page, err.message);
      }
    }
    
  } catch (err) {
    log('App resource discovery failed:', err.message);
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
  log('Service Worker installing with comprehensive caching...');
  event.waitUntil(
    caches.open(CACHE_NAME).then(async cache => {
      try {
        // Cache static assets first
        await cache.addAll(STATIC_ASSETS);
        log('Static assets cached successfully');
        
        // Discover and cache all app resources comprehensively
        await discoverAndCacheAppResources(cache);
        
        log('Comprehensive app caching completed');
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

  // Enhanced API caching for offline functionality
  const isApiRequest = API_CACHE_PATTERNS.some(pattern => pattern.test(fullUrl));
  if (isApiRequest) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          if (response && response.status === 200) {
            const cloned = response.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, cloned);
              log('Cached API response:', fullUrl);
            }).catch(err => {
              log('Failed to cache API response:', err);
            });
          }
          return response;
        })
        .catch(async () => {
          log('API request failed, trying cache for:', fullUrl);
          const cached = await caches.match(event.request);
          if (cached) {
            log('Serving API from cache:', fullUrl);
            return cached;
          }
          // Return a default response for failed API calls
          return new Response(JSON.stringify({ error: 'Offline', cached: false }), {
            status: 503,
            headers: { 'Content-Type': 'application/json' }
          });
        })
    );
    return;
  }

  // Check if this request should be cached based on patterns
  const shouldCache = CACHE_PATTERNS.some(pattern => pattern.test(fullUrl) || pattern.test(pathname));

  if (shouldCache) {
    const isCss = pathname.endsWith('.css');
    const isImage = /\.(png|jpg|jpeg|gif|svg|ico|webp)(\?.*)?$/.test(pathname);
    
    // Always use the base path (no query params) as the cache key for CSS
    const cacheKey = isCss ? `${url.origin}${pathname}` : event.request;

    // Special handling for CSS files with query params
    if (isCss && url.search) {
      event.respondWith(
        caches.open(CACHE_NAME).then(async cache => {
          const cached = await cache.match(cacheKey);
          if (cached) {
            // Silently serve from cache to reduce log spam
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

    // For all other cached resources (including base CSS, JS, images)
    event.respondWith(
      caches.open(CACHE_NAME).then(async cache => {
        // Check cache first for images to reduce redundant fetching
        if (isImage) {
          const cached = await cache.match(cacheKey);
          if (cached) {
            // Silently serve images from cache to reduce log spam
            return cached;
          }
        }

        // Try to fetch from network
        try {
          const response = await fetch(event.request);
          if (response && response.status === 200 && response.type !== 'opaque') {
            // Only log for new resources, not repeated fetches
            if (!isImage || !(await cache.match(cacheKey))) {
              log('Successfully fetched and caching:', event.request);
            }
            const responseToCache = response.clone();
            cache.put(cacheKey, responseToCache).catch(err => 
              log('Failed to cache asset:', cacheKey, err)
            );
            return response;
          }
          return response;
        } catch (err) {
          log('Network failed, trying cache for:', cacheKey);
          // Try to get from cache
          const cached = await cache.match(cacheKey);
          if (cached) {
            // Only log for non-frequent files to reduce spam
            const isFrequentFile = event.request.url.includes('manifest.json') || 
                                   event.request.url.endsWith('/') || 
                                   event.request.url.includes('.ico');
            if (!isFrequentFile) {
              log('Serving from cache (default):', event.request.url);
            }
            return cached;
          }
          throw err; // Re-throw if no cached version
        }
      })
    );
    return;
  }

  // Default handling for other requests
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) {
        // Only log for non-frequent files to reduce spam
        const isFrequentFile = pathname === '/' || pathname === '/manifest.json' || pathname.includes('.ico');
        if (!isFrequentFile) {
          log('Serving from cache (default):', fullUrl);
        }
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

// Force cache all critical routes (can be triggered manually)
const cacheAllRoutes = async () => {
  const criticalRoutes = [
    '/',
    '/dashboard',
    '/clock',
    '/break',
    '/dashboard/equipment/log-new',
    '/dashboard/switch-jobs',
    '/signin', // Even though we exclude it from SW, cache for offline fallback
  ];

  const cache = await caches.open(CACHE_NAME);
  
  for (const route of criticalRoutes) {
    try {
      const response = await fetch(route);
      if (response.ok) {
        await cache.put(route, response);
        log('Force cached route:', route);
      }
    } catch (err) {
      log('Failed to force cache route:', route, err.message);
    }
  }
};

// Message handler for manual cache control
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'CACHE_ALL_ROUTES') {
    log('Manual cache all routes requested');
    event.waitUntil(cacheAllRoutes());
  }
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Background sync event handler
self.addEventListener('sync', event => {
  if (event.tag === 'offline-sync') {
    log('Background sync triggered');
    event.waitUntil(handleBackgroundSync());
  }
});

// Handle background sync with throttling to prevent excessive retries
async function handleBackgroundSync() {
  const THROTTLE_MINUTES = 5; // Minimum minutes between retries
  const now = Date.now();

  try {
    // Open database with proper error handling
    const db = await new Promise((resolve, reject) => {
      const dbRequest = indexedDB.open('OfflineDb', 2); // Version 2 for timestamp support
      
      dbRequest.onupgradeneeded = (event) => {
        const database = event.target.result;
        
        // Ensure queuedActions store exists with proper schema
        if (!database.objectStoreNames.contains('queuedActions')) {
          const store = database.createObjectStore('queuedActions', { 
            keyPath: 'id',
            autoIncrement: true 
          });
          store.createIndex('by_timestamp', 'timestamp', { unique: false });
          log('Created queuedActions store with timestamp index');
        } else {
          // If store exists but needs index, add it
          const transaction = event.target.transaction;
          const store = transaction.objectStore('queuedActions');
          if (!store.indexNames.contains('by_timestamp')) {
            store.createIndex('by_timestamp', 'timestamp', { unique: false });
            log('Added timestamp index to existing store');
          }
        }
      };
      
      dbRequest.onsuccess = () => resolve(dbRequest.result);
      dbRequest.onerror = () => reject(dbRequest.error);
    });

    const transaction = db.transaction(['queuedActions'], 'readwrite');
    const store = transaction.objectStore('queuedActions');

    // Get actions using timestamp-based throttling
    let actions;
    try {
      // Try to use the timestamp index for efficient querying
      const index = store.index('by_timestamp');
      const throttleThreshold = now - (THROTTLE_MINUTES * 60 * 1000);
      const range = IDBKeyRange.upperBound(throttleThreshold);
      
      actions = await new Promise((resolve, reject) => {
        const request = index.getAll(range);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
      
      log(`Found ${actions.length} actions eligible for sync (older than ${THROTTLE_MINUTES} minutes)`);
    } catch (indexError) {
      // Fallback: get all actions if index doesn't exist yet
      log('Timestamp index not available, using fallback method');
      actions = await new Promise((resolve, reject) => {
        const request = store.getAll();
        request.onsuccess = () => {
          const allActions = request.result;
          // Filter by timestamp manually
          const throttleThreshold = now - (THROTTLE_MINUTES * 60 * 1000);
          const filteredActions = allActions.filter(action => 
            !action.timestamp || action.timestamp <= throttleThreshold
          );
          resolve(filteredActions);
        };
        request.onerror = () => reject(request.error);
      });
    }

    let syncedCount = 0;
    let failedCount = 0;

    for (const action of actions) {
      try {
        log(`Attempting to sync: ${action.method} ${action.endpoint}`);
        
        const response = await fetch(action.endpoint, {
          method: action.method,
          headers: { 'Content-Type': 'application/json' },
          body: action.payload ? JSON.stringify(action.payload) : undefined,
        });

        if (response.ok) {
          // Success: remove the action from queue
          await new Promise((resolve, reject) => {
            const deleteRequest = store.delete(action.id);
            deleteRequest.onsuccess = () => resolve();
            deleteRequest.onerror = () => reject(deleteRequest.error);
          });
          syncedCount++;
          log(`Successfully synced: ${action.endpoint}`);
        } else {
          // HTTP error: update timestamp to throttle retry
          await new Promise((resolve, reject) => {
            const updateRequest = store.put({
              ...action,
              timestamp: now,
              lastError: `HTTP ${response.status}: ${response.statusText}`
            });
            updateRequest.onsuccess = () => resolve();
            updateRequest.onerror = () => reject(updateRequest.error);
          });
          failedCount++;
          log(`Sync failed (HTTP ${response.status}), throttling: ${action.endpoint}`);
        }
      } catch (fetchError) {
        // Network error: update timestamp to throttle retry
        await new Promise((resolve, reject) => {
          const updateRequest = store.put({
            ...action,
            timestamp: now,
            lastError: fetchError.message
          });
          updateRequest.onsuccess = () => resolve();
          updateRequest.onerror = () => reject(updateRequest.error);
        });
        failedCount++;
        log(`Sync failed (network error), throttling: ${action.endpoint}`, fetchError.message);
      }
    }

    // Close database connection
    db.close();

    log(`Background sync completed: ${syncedCount} synced, ${failedCount} failed (throttled for ${THROTTLE_MINUTES} minutes)`);
    
    return { syncedCount, failedCount };
  } catch (error) {
    log('Background sync failed:', error);
    throw error;
  }
}
