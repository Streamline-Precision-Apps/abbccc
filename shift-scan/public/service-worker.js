const CACHE_NAME = 'shift-scan-cache-v19'; // Fixed cache name synchronization and critical issues
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
  '/dashboard/equipment', // Equipment page
  '/dashboard/clock-out', // Clock out page
];

// Server Actions that need offline support
const OFFLINE_SERVER_ACTIONS = [
  'handleGeneralTimeSheet',
  'handleMechanicTimeSheet', 
  'handleTascoTimeSheet',
  'handleTruckTimeSheet',
  'CreateEmployeeEquipmentLog',
  'updateTimeSheetBySwitch',
  'updateTruckDriverTSBySwitch',
  'breakOutTimeSheet',
  'updateTimeSheet',
  'returnToPrevWork'
];

// Critical assets that should be pre-cached - ALL SVG and image files
const CRITICAL_ASSETS = [
  // All SVG icons from public directory
  '/admin-white.svg',
  '/admin.svg',
  '/arrowBack.svg',
  '/arrowDown.svg',
  '/arrowDownThin.svg',
  '/arrowLeft.svg',
  '/arrowLeftSymbol.svg',
  '/arrowLeftThin.svg',
  '/arrowRight.svg',
  '/arrowRightSymbol.svg',
  '/arrowRightThin.svg',
  '/arrowUp.svg',
  '/arrowUpThin.svg',
  '/biometrics.svg',
  '/broken.svg',
  '/calendar.svg',
  '/camera.svg',
  '/cameraFilled.svg',
  '/checkbox.svg',
  '/clock.svg',
  '/clockBreak.svg',
  '/clockIn.svg',
  '/clockOut.svg',
  '/comment.svg',
  '/comments.svg',
  '/condense-white.svg',
  '/condense.svg',
  '/drag.svg',
  '/dragDots.svg',
  '/dragFormBuilder.svg',
  '/endDay.svg',
  '/equipment-white.svg',
  '/equipment.svg',
  '/eraser.svg',
  '/export-white.svg',
  '/export.svg',
  '/eye-blue.svg',
  '/eye.svg',
  '/eyeSlash.svg',
  '/fileClosed.svg',
  '/fileOpen.svg',
  '/filterDials.svg',
  '/filterFunnel.svg',
  '/form-white.svg',
  '/form.svg',
  '/formApproval.svg',
  '/formDuplicate.svg',
  '/formEdit.svg',
  '/formInspect-white.svg',
  '/formInspect.svg',
  '/formList-white.svg',
  '/formList.svg',
  '/formSave.svg',
  '/formSent.svg',
  '/formUndo.svg',
  '/hauling.svg',
  '/haulingFilled.svg',
  '/header.svg',
  '/home-white.svg',
  '/home.svg',
  '/inbox-white.svg',
  '/inbox.svg',
  '/inboxFilled.svg',
  '/information.svg',
  '/injury.svg',
  '/jobsite-white.svg',
  '/jobsite.svg',
  '/key.svg',
  '/language.svg',
  '/layout.svg',
  '/logo.svg',
  '/mechanic.svg',
  '/message.svg',
  '/mileage.svg',
  '/minus.svg',
  '/moreOptions.svg',
  '/moreOptionsCircle.svg',
  '/number.svg',
  '/plus-stroke-white.svg',
  '/plus-white.svg',
  '/plus.svg',
  '/policies.svg',
  '/priorityDelay.svg',
  '/priorityHigh.svg',
  '/priorityLow.svg',
  '/priorityMedium.svg',
  '/priorityPending.svg',
  '/priorityToday.svg',
  '/profileEmpty.svg',
  '/profileFilled.svg',
  '/qrCode-white.svg',
  '/qrCode.svg',
  '/radio.svg',
  '/refuel.svg',
  '/refuelFilled.svg',
  '/searchLeft.svg',
  '/searchRight.svg',
  '/Settings.svg',
  '/settingsFilled.svg',
  '/shiftScanLogo.svg',
  '/shiftscanlogoHorizontal.svg',
  '/spinner.svg',
  '/star.svg',
  '/starFilled.svg',
  '/state.svg',
  '/stateFilled.svg',
  '/statusApproved.svg',
  '/statusApprovedFilled.svg',
  '/statusDenied.svg',
  '/statusDeniedFilled.svg',
  '/statusOffline.svg',
  '/statusOngoing-white.svg',
  '/statusOngoing.svg',
  '/statusOngoingFilled.svg',
  '/statusOnline.svg',
  '/statusUnfinished.svg',
  '/tasco.svg',
  '/team-white.svg',
  '/team.svg',
  '/timecards.svg',
  '/tinyCheckMark-white.svg',
  '/title.svg',
  '/trash-red.svg',
  '/trash.svg',
  '/trucking.svg',
  '/user-white.svg',
  '/user.svg',
  // PNG and JPG images
  '/icon-192x192.png',
  '/icon-384x384.png',
  '/icon-512x512.png',
  '/ios/144.png',
  '/logo_JPG.jpg',
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
  /\/api\/getEquipmentList$/,
  /\/api\/getJobsiteSummary$/,
  /\/api\/auth\/session$/,
];

// Debug logging function with throttling to prevent spam
const logThrottle = new Map();
const log = (message, data = '') => {
  // Only log important messages in production, or all messages in development
  const isDevelopment = self.location.hostname === 'localhost' || self.location.hostname === '127.0.0.1';
  const isImportantMessage = message.includes('Failed') || message.includes('Error') || message.includes('offline') || message.includes('Offline');
  
  if (isDevelopment || isImportantMessage) {
    // Throttle repeated messages (only log once per minute for same message)
    const now = Date.now();
    const lastLogged = logThrottle.get(message);
    if (!lastLogged || now - lastLogged > 60000) { // 1 minute throttle
      console.log(`[ServiceWorker] ${message}`, data);
      logThrottle.set(message, now);
    }
  }
};

// ===============================================
// OFFLINE DATA MANAGEMENT
// ===============================================

// Generate unique offline IDs
const generateOfflineId = (prefix = 'offline') => {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Store offline action for later sync
const storeOfflineAction = (actionName, formData, additionalData = {}) => {
  try {
    const offlineId = generateOfflineId();
    const action = {
      id: offlineId,
      actionName,
      formData: Object.fromEntries(formData.entries()),
      timestamp: Date.now(),
      status: 'pending',
      retryCount: 0,
      ...additionalData
    };

    // Store in queue
    const queue = JSON.parse(localStorage.getItem('offline_action_queue') || '[]');
    queue.push(action);
    localStorage.setItem('offline_action_queue', JSON.stringify(queue));

    // Store individual action
    localStorage.setItem(`offline_action_${offlineId}`, JSON.stringify(action));

    log(`Stored offline action: ${actionName}`, offlineId);
    return offlineId;
  } catch (error) {
    log('Failed to store offline action:', error);
    return null;
  }
};

// Get cached offline data with fallbacks
const getOfflineData = (key, fallback = null) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch (error) {
    log(`Failed to get offline data for ${key}:`, error);
    return fallback;
  }
};

// Store offline data
const storeOfflineData = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    log(`Failed to store offline data for ${key}:`, error);
    return false;
  }
};

// Create offline timesheet entity
const createOfflineTimesheet = (formData, workType = 'LABOR') => {
  const timesheetId = generateOfflineId('timesheet');
  
  const timesheet = {
    id: timesheetId,
    userId: formData.get('userId'),
    date: formData.get('date') || new Date().toISOString(),
    startTime: formData.get('startTime') || new Date().toISOString(),
    endTime: formData.get('endTime') || null,
    status: 'DRAFT',
    workType: workType,
    jobsiteId: formData.get('jobsiteId') || '',
    costCode: formData.get('costcode') || '',
    comment: formData.get('comment') || '',
    isOffline: true,
    offlineTimestamp: Date.now()
  };

  // Store timesheet
  storeOfflineData(`offline_timesheet_${timesheetId}`, timesheet);
  storeOfflineData('current_offline_timesheet', timesheet);

  // Update dashboard data
  const dashboardData = getOfflineData('offline_dashboard_data', {});
  dashboardData.timesheet = timesheet;
  dashboardData.lastUpdate = Date.now();
  storeOfflineData('offline_dashboard_data', dashboardData);

  return timesheet;
};

// Create offline equipment log entity  
const createOfflineEquipmentLog = (formData) => {
  const logId = generateOfflineId('equipment_log');
  
  const equipmentLog = {
    id: logId,
    equipmentId: formData.get('equipmentId'),
    timesheetId: formData.get('timesheetId'),
    startTime: formData.get('startTime') || new Date().toISOString(),
    endTime: formData.get('endTime') || null,
    notes: formData.get('notes') || '',
    isOffline: true,
    offlineTimestamp: Date.now()
  };

  // Store equipment log
  storeOfflineData(`offline_equipment_log_${logId}`, equipmentLog);
  
  // Add to equipment logs array
  const equipmentLogs = getOfflineData('offline_equipment_logs', []);
  equipmentLogs.push(equipmentLog);
  storeOfflineData('offline_equipment_logs', equipmentLogs);

  return equipmentLog;
};

// Handle server action offline
const handleServerActionOffline = (actionName, formData) => {
  log(`Handling ${actionName} offline`);
  
  switch (actionName) {
    case 'handleGeneralTimeSheet':
    case 'handleMechanicTimeSheet':
    case 'handleTascoTimeSheet':
    case 'handleTruckTimeSheet':
      const workTypeMap = {
        'handleGeneralTimeSheet': 'LABOR',
        'handleMechanicTimeSheet': 'MECHANIC', 
        'handleTascoTimeSheet': 'TASCO',
        'handleTruckTimeSheet': 'TRUCK_DRIVER'
      };
      const timesheet = createOfflineTimesheet(formData, workTypeMap[actionName]);
      storeOfflineAction(actionName, formData, { entityType: 'timesheet', entityId: timesheet.id });
      return { success: true, data: timesheet };

    case 'CreateEmployeeEquipmentLog':
      const equipmentLog = createOfflineEquipmentLog(formData);
      storeOfflineAction(actionName, formData, { entityType: 'equipment_log', entityId: equipmentLog.id });
      return { success: true, data: equipmentLog };

    case 'updateTimeSheetBySwitch':
    case 'updateTruckDriverTSBySwitch':
      // Handle job switching offline
      const currentTimesheet = getOfflineData('current_offline_timesheet');
      if (currentTimesheet) {
        currentTimesheet.endTime = new Date().toISOString();
        currentTimesheet.status = 'PENDING';
        storeOfflineData(`offline_timesheet_${currentTimesheet.id}`, currentTimesheet);
      }
      
      // Create new timesheet for switch
      const newTimesheet = createOfflineTimesheet(formData);
      storeOfflineAction(actionName, formData, { entityType: 'timesheet_switch', entityId: newTimesheet.id });
      return { success: true, data: newTimesheet };

    case 'breakOutTimeSheet':
      // Handle break time offline
      const breakData = {
        id: generateOfflineId('break'),
        timesheetId: formData.get('timesheetId'),
        startTime: new Date().toISOString(),
        endTime: formData.get('endTime') || null,
        isOffline: true
      };
      storeOfflineData(`offline_break_${breakData.id}`, breakData);
      storeOfflineAction(actionName, formData, { entityType: 'break', entityId: breakData.id });
      return { success: true, data: breakData };

    case 'updateTimeSheet':
      // Handle timesheet updates offline
      const timesheetId = formData.get('id');
      const existingTimesheet = getOfflineData(`offline_timesheet_${timesheetId}`);
      if (existingTimesheet) {
        // Update existing offline timesheet
        Object.entries(Object.fromEntries(formData.entries())).forEach(([key, value]) => {
          if (value !== null && value !== undefined) {
            existingTimesheet[key] = value;
          }
        });
        existingTimesheet.lastModified = Date.now();
        storeOfflineData(`offline_timesheet_${timesheetId}`, existingTimesheet);
        storeOfflineData('current_offline_timesheet', existingTimesheet);
      }
      storeOfflineAction(actionName, formData, { entityType: 'timesheet_update', entityId: timesheetId });
      return { success: true, data: existingTimesheet };

    default:
      // Generic offline action storage
      const genericId = generateOfflineId('action');
      storeOfflineAction(actionName, formData, { entityType: 'generic', entityId: genericId });
      return { success: true, data: { id: genericId } };
  }
};

// Generate offline timecard response from stored data
const generateOfflineTimecardResponse = () => {
  try {
    // Try to get current offline timesheet first
    const currentOfflineTimesheet = localStorage.getItem('current_offline_timesheet');
    if (currentOfflineTimesheet) {
      const timesheet = JSON.parse(currentOfflineTimesheet);
      log('Found current offline timesheet for API response:', timesheet.id);
      return {
        id: timesheet.id,
        endTime: timesheet.endTime
      };
    }

    // Try offline dashboard data
    const offlineDashboardData = localStorage.getItem('offline_dashboard_data');
    if (offlineDashboardData) {
      const data = JSON.parse(offlineDashboardData);
      if (data.timesheet) {
        log('Found offline dashboard timesheet for API response:', data.timesheet.id);
        return {
          id: data.timesheet.id,
          endTime: data.timesheet.endTime
        };
      }
    }

    // Try cached API response
    const cachedTimecard = localStorage.getItem('cached_recent_timecard');
    if (cachedTimecard) {
      const cached = JSON.parse(cachedTimecard);
      const data = cached.data || cached;
      log('Found cached timecard for API response:', data.id);
      return {
        id: data.id,
        endTime: data.endTime
      };
    }
  } catch (error) {
    log('Error generating offline timecard response:', error);
  }
  
  return null;
};

// Enhanced function to discover and cache all critical app resources
const discoverAndCacheAppResources = async (cache) => {
  try {
    // 1. Cache critical SVG assets first
    log('Caching critical assets...');
    let cachedCount = 0;
    for (const asset of CRITICAL_ASSETS) {
      try {
        const response = await fetch(asset);
        if (response.ok) {
          await cache.put(asset, response);
          cachedCount++;
        }
      } catch (err) {
        log('Failed to cache critical asset:', asset, err.message);
      }
    }
    log(`Cached ${cachedCount} critical assets`);

    // 2. Discover and cache CSS files from the main page
    const response = await fetch('/');
    if (response.ok) {
      const html = await response.text();
      
      // Extract and cache CSS files
      const cssMatches = html.match(/href="([^"]*\.css[^"]*)"/g);
      if (cssMatches) {
        let cssCount = 0;
        for (const match of cssMatches) {
          const href = match.match(/href="([^"]*)"/)[1];
          if (href.startsWith('/_next/static/css/') || href.startsWith('/')) {
            try {
              const cssResponse = await fetch(href);
              if (cssResponse.ok) {
                await cache.put(href, cssResponse.clone());
                cssCount++;
                
                // Also cache without query parameters for easier matching
                const baseHref = href.split('?')[0];
                if (baseHref !== href) {
                  await cache.put(baseHref, cssResponse.clone());
                }
              }
            } catch (err) {
              // Ignore CSS errors
            }
          }
        }
        log(`Discovered and cached ${cssCount} CSS files`);
      }

      // Extract and cache JavaScript files
      const jsMatches = html.match(/src="([^"]*\.js[^"]*)"/g);
      if (jsMatches) {
        let jsCount = 0;
        for (const match of jsMatches) {
          const src = match.match(/src="([^"]*)"/)[1];
          if (src.startsWith('/_next/static/')) {
            try {
              const jsResponse = await fetch(src);
              if (jsResponse.ok) {
                await cache.put(src, jsResponse.clone());
                jsCount++;
              }
            } catch (err) {
              // Ignore JS errors
            }
          }
        }
        log(`Discovered and cached ${jsCount} JS files`);
      }
    }

    // 3. Pre-cache important pages by visiting them
    const importantPages = ['/dashboard', '/clock', '/break'];
    log(`Pre-caching ${importantPages.length} important pages...`);
    let pagesCached = 0;
    for (const page of importantPages) {
      try {
        log(`Attempting to cache page: ${page}`);
        const pageResponse = await fetch(page);
        if (pageResponse.ok) {
          await cache.put(page, pageResponse.clone());
          pagesCached++;
          log(`✅ Successfully cached page: ${page}`);
          
          // Extract resources from this page too (but don't log each one)
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
                }
              } catch (err) {
                // Ignore individual resource failures
              }
            }
          }
        }
      } catch (err) {
        log('❌ Failed to pre-cache page:', page, err.message);
      }
    }
    log(`📄 Page pre-caching completed: ${pagesCached}/${importantPages.length} pages cached`);
    
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

// ===============================================
// SERVER ACTION HANDLING
// ===============================================

// Handle server action requests with offline support
const handleServerActionRequest = async (request, actionName) => {
  try {
    // Try network first
    if (navigator.onLine) {
      const response = await fetch(request.clone());
      if (response.ok) {
        log(`Server action ${actionName} completed online`);
        return response;
      }
      throw new Error(`Server action failed: ${response.status}`);
    } else {
      throw new Error('Offline');
    }
  } catch (error) {
    // Handle offline
    log(`Handling server action ${actionName} offline:`, error.message);
    
    try {
      const formData = await request.formData();
      const result = handleServerActionOffline(actionName, formData);
      
      // Return a successful response
      return new Response(JSON.stringify(result), {
        status: 200,
        statusText: 'OK (Offline)',
        headers: {
          'Content-Type': 'application/json',
          'X-Offline': 'true'
        }
      });
    } catch (offlineError) {
      log(`Offline handling failed for ${actionName}:`, offlineError);
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Offline processing failed',
        message: 'Unable to process request offline'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }
};

// Network first with offline fallback for API requests
const networkFirstWithOfflineFallback = async (request) => {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
      
      // Special handling for session API - cache session data in localStorage
      const url = new URL(request.url);
      if (url.pathname.includes('/api/auth/session')) {
        try {
          const sessionData = await networkResponse.clone().json();
          if (sessionData) {
            // Cache session data in localStorage for offline use
            localStorage.setItem('offline_session_cache', JSON.stringify(sessionData));
            log('🟢 Session cached for offline use');
          }
        } catch (error) {
          log('Failed to cache session data:', error);
        }
      }
      
      return networkResponse;
    }
    throw new Error(`Network response not ok: ${networkResponse.status}`);
  } catch (error) {
    // Return cached version or offline data
    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }

    // Generate offline fallback data for specific API routes
    const url = new URL(request.url);
    if (url.pathname.includes('/api/dashboard')) {
      const offlineData = getOfflineData('offline_dashboard_data', {
        timesheet: getOfflineData('current_offline_timesheet'),
        equipmentLogs: getOfflineData('offline_equipment_logs', []),
        user: { name: 'Offline User' },
        lastUpdate: Date.now()
      });
      
      return new Response(JSON.stringify(offlineData), {
        status: 200,
        headers: { 
          'Content-Type': 'application/json',
          'X-Offline': 'true'
        }
      });
    }

    // Handle session API fallback
    if (url.pathname.includes('/api/auth/session')) {
      // Try to get cached session data
      const cachedSession = getOfflineData('offline_session_cache');
      if (cachedSession) {
        log('🔵 Providing cached session for offline use');
        return new Response(JSON.stringify(cachedSession), {
          status: 200,
          headers: { 
            'Content-Type': 'application/json',
            'X-Offline': 'true'
          }
        });
      } else {
        // No cached session available - return null (unauthenticated)
        log('⚠️ No cached session available, returning null');
        return new Response(JSON.stringify(null), {
          status: 200,
          headers: { 
            'Content-Type': 'application/json',
            'X-Offline': 'true'
          }
        });
      }
    }

    return new Response(JSON.stringify({ 
      error: 'Offline', 
      message: 'No cached data available' 
    }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

// ===============================================
// SYNC MECHANISM
// ===============================================

// Sync offline actions when back online
const syncOfflineActions = async () => {
  if (!navigator.onLine) {
    log('Cannot sync - still offline');
    return false;
  }

  try {
    const queue = getOfflineData('offline_action_queue', []);
    const pendingActions = queue.filter(action => action.status === 'pending');
    
    if (pendingActions.length === 0) {
      log('No pending actions to sync');
      return true;
    }

    log(`Syncing ${pendingActions.length} offline actions`);
    let successCount = 0;
    let failCount = 0;

    for (const action of pendingActions) {
      try {
        // Reconstruct FormData
        const formData = new FormData();
        Object.entries(action.formData).forEach(([key, value]) => {
          formData.append(key, value);
        });

        // Make the actual server action request
        const response = await fetch('/', {
          method: 'POST',
          headers: {
            'Next-Action': action.actionName,
          },
          body: formData
        });

        if (response.ok) {
          // Mark as synced
          action.status = 'synced';
          action.syncedAt = Date.now();
          localStorage.setItem(`offline_action_${action.id}`, JSON.stringify(action));
          successCount++;
          log(`Synced action: ${action.actionName}`, action.id);
        } else {
          throw new Error(`Sync failed with status: ${response.status}`);
        }
      } catch (error) {
        // Mark as failed and increment retry count
        action.status = 'failed';
        action.retryCount = (action.retryCount || 0) + 1;
        action.lastError = error.message;
        localStorage.setItem(`offline_action_${action.id}`, JSON.stringify(action));
        failCount++;
        log(`Failed to sync action: ${action.actionName}`, error);
      }
    }

    // Update the queue
    const updatedQueue = queue.map(action => {
      const updatedAction = JSON.parse(localStorage.getItem(`offline_action_${action.id}`) || JSON.stringify(action));
      return updatedAction;
    });
    localStorage.setItem('offline_action_queue', JSON.stringify(updatedQueue));

    log(`Sync complete: ${successCount} success, ${failCount} failed`);
    return failCount === 0;
  } catch (error) {
    log('Sync failed:', error);
    return false;
  }
};

// Debug function to check what's in cache
const debugCacheContents = async () => {
  try {
    const cache = await caches.open(CACHE_NAME);
    const keys = await cache.keys();
    log('Cache contents:');
    keys.forEach(request => {
      log(`  - ${request.url}`);
    });
    return keys;
  } catch (error) {
    log('Failed to check cache contents:', error);
    return [];
  }
};

self.addEventListener('install', event => {
  log('Service Worker installing with comprehensive caching...');
  event.waitUntil(
    caches.open(CACHE_NAME).then(async cache => {
      try {
        // Cache static assets first with better error handling
        log('Caching static assets:', STATIC_ASSETS);
        for (const asset of STATIC_ASSETS) {
          try {
            await cache.add(asset);
            log(`Successfully cached: ${asset}`);
          } catch (err) {
            // Only log failures for critical assets, not all assets
            if (asset === '/manifest.json' || asset === '/offline.html') {
              log(`Failed to cache critical asset ${asset}:`, err.message);
            }
            // Continue with other assets even if one fails
          }
        }
        
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
  const { request } = event;
  const url = new URL(request.url);
  const pathname = url.pathname;
  const fullUrl = url.href;

  // Exclude specific paths from service worker handling
  if (pathname === '/signin' || 
      pathname.startsWith('/api/auth/') ||
      pathname.startsWith('/debug-') ||
      pathname.endsWith('.map') ||
      pathname.startsWith('/_next/webpack-hmr') ||
      pathname.startsWith('/_next/static/webpack-hmr') ||
      fullUrl.includes('turbopack-hmr') ||
      url.protocol === 'chrome-extension:') {
    return;
  }

  // Handle POST requests (server actions)
  if (request.method === 'POST') {
    const actionHeader = request.headers.get('Next-Action');
    if (actionHeader && OFFLINE_SERVER_ACTIONS.includes(actionHeader)) {
      log(`Intercepting server action: ${actionHeader}`);
      event.respondWith(handleServerActionRequest(request, actionHeader));
      return;
    }
    // Let other POST requests pass through normally
    return;
  }

  // Only handle GET requests from here on
  if (request.method !== 'GET') return;

  // Special handling for navigation requests (HTML pages)
  if (request.mode === 'navigate') {
    log(`[NAVIGATION] Handling navigation request for: ${pathname}`);
    event.respondWith(
      fetch(request)
        .then(response => {
          if (response && response.status === 200) {
            const cloned = response.clone();
            caches.open(CACHE_NAME).then(cache => {
              // Cache both the original request and a clean URL version
              cache.put(request, cloned.clone()).catch(err => 
                log('Failed to cache navigation request:', err)
              );
              // Also cache with clean URL (no query params)
              const cleanUrl = `${url.origin}${pathname}`;
              cache.put(cleanUrl, cloned.clone()).catch(err => 
                log('Failed to cache clean URL:', err)
              );
            });
          }
          return response;
        })
        .catch(async () => {
          log(`🔍 OFFLINE FALLBACK: Navigation failed for ${pathname}, checking cache...`);
          log('Navigation request failed, trying cache for:', pathname);
          
          // Try to serve from cache first - try exact match
          const cached = await caches.match(request);
          if (cached) {
            log('Serving exact cached page for offline navigation:', pathname);
            return cached;
          }
          
          // Try without query parameters
          const urlWithoutQuery = `${url.origin}${pathname}`;
          const cachedWithoutQuery = await caches.match(urlWithoutQuery);
          if (cachedWithoutQuery) {
            log('Serving cached page without query params:', pathname);
            return cachedWithoutQuery;
          }
          
          // For clock page specifically, try multiple strategies
          if (pathname === '/clock') {
            log('Special handling for clock page');
            
            // Debug: List all cached keys for clock debugging
            const cache = await caches.open(CACHE_NAME);
            const allKeys = await cache.keys();
            log('Total cached keys:', allKeys.length);
            log('Looking for clock page in cache...');
            
            // List some relevant keys for debugging
            const relevantKeys = allKeys.filter(key => {
              const keyUrl = key.url || key;
              return keyUrl.includes('clock') || keyUrl.endsWith('/') || keyUrl.includes('dashboard');
            }).map(key => key.url || key);
            log('Relevant cached keys:', relevantKeys);
            
            // Try multiple variations for clock page
            const clockVariations = [
              '/clock',
              '/clock/',
              `${url.origin}/clock`,
              `${url.origin}/clock/`,
              new Request('/clock'),
              new Request(`${url.origin}/clock`)
            ];
            
            for (const variation of clockVariations) {
              const clockCache = await caches.match(variation);
              if (clockCache) {
                log('Serving cached clock page variation:', variation);
                return clockCache;
              }
            }
            
            // Try searching through all keys manually
            for (const key of allKeys) {
              const keyUrl = new URL(key.url);
              if (keyUrl.pathname === '/clock' || keyUrl.pathname === '/clock/') {
                const clockCache = await cache.match(key);
                if (clockCache) {
                  log('Found clock page in manual search:', key.url);
                  return clockCache;
                }
              }
            }
            
            // If no clock page cached, serve root page instead of offline page
            // This allows the app to load and then handle navigation client-side
            log('🔄 No cached clock page found, trying root page as fallback');
            const rootCache = await caches.match('/');
            if (rootCache) {
              log('✅ Serving root page as fallback for clock page (client-side routing can handle)');
              return rootCache;
            }
            
            // Last attempt: serve dashboard as fallback
            const dashboardCache = await caches.match('/dashboard');
            if (dashboardCache) {
              log('✅ Serving dashboard as fallback for clock page');
              return dashboardCache;
            }
            
            log('❌ No suitable fallback found for clock page');
          }
          
          // For dashboard pages
          if (pathname === '/dashboard' || pathname.startsWith('/dashboard')) {
            const dashboardCache = await caches.match('/dashboard');
            if (dashboardCache) {
              log('Serving cached dashboard for offline navigation');
              return dashboardCache;
            }
            
            // Try root as fallback for dashboard too
            const rootCache = await caches.match('/');
            if (rootCache) {
              log('Serving root page as fallback for dashboard');
              return rootCache;
            }
          }
          
          // For other STATIC_ASSETS pages, try to find them
          const staticAssetPaths = [
            '/dashboard/equipment',
            '/dashboard/equipment/log-new', 
            '/dashboard/switch-jobs',
            '/dashboard/clock-out',
            '/break'
          ];
          
          if (staticAssetPaths.some(path => pathname === path || pathname.startsWith(path))) {
            // Try to find any cached version of this path
            for (const assetPath of staticAssetPaths) {
              if (pathname.startsWith(assetPath)) {
                const assetCache = await caches.match(assetPath);
                if (assetCache) {
                  log(`Serving cached asset page: ${assetPath} for ${pathname}`);
                  return assetCache;
                }
              }
            }
            
            // Fallback to root for asset pages too (let client-side routing handle it)
            const rootCache = await caches.match('/');
            if (rootCache) {
              log('Serving root as fallback for asset page:', pathname);
              return rootCache;
            }
          }
          
          // Last resort: try to serve root page for ANY navigation
          const rootFallback = await caches.match('/');
          if (rootFallback) {
            log('Serving root page as final fallback for:', pathname);
            return rootFallback;
          }
          
          // Only serve offline page if absolutely nothing else is available
          log('No cached pages found, serving offline.html for:', pathname);
          const offlinePage = await caches.match('/offline.html');
          return offlinePage || new Response('Offline', { 
            status: 503, 
            statusText: 'Service Unavailable',
            headers: { 'Content-Type': 'text/html' }
          });
        })
    );
    return;
  }

  // Enhanced API caching for offline functionality
  const isApiRequest = API_CACHE_PATTERNS.some(pattern => pattern.test(fullUrl));
  if (isApiRequest) {
    event.respondWith(
      networkFirstWithOfflineFallback(request)
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
          // First try exact match
          const cached = await cache.match(cacheKey);
          if (cached) {
            return cached;
          }
          
          // Try to find any cached version of this CSS file
          const fallback = await findCachedCSS(event.request);
          if (fallback) {
            log('Serving cached CSS variant for:', pathname);
            return fallback;
          }
          
          // If not cached, try to fetch and cache the base file (only when online)
          if (navigator.onLine) {
            try {
              const response = await fetch(cacheKey);
              if (response && response.status === 200 && response.type !== 'opaque') {
                await cache.put(cacheKey, response.clone());
                log('Successfully fetched and cached CSS:', cacheKey);
                return response;
              }
            } catch (err) {
              // Fetch failed - continue to fallbacks
            }
          }
          
          // Fallback: serve fallback.css for critical CSS files
          if (pathname.includes('app/layout.css') || pathname.includes('app/page.css')) {
            const fallbackCSS = await cache.match('/fallback.css');
            if (fallbackCSS) {
              log('Serving fallback.css for critical CSS:', pathname);
              return fallbackCSS;
            }
          }
          
          // Final fallback: return minimal CSS response to prevent errors
          log('Creating minimal CSS response for:', pathname);
          return new Response('/* Offline CSS placeholder - styling handled by Tailwind fallback */', {
            status: 200,
            headers: { 
              'Content-Type': 'text/css',
              'Cache-Control': 'no-cache'
            }
          });
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
            // Only log for new resources, not repeated fetches, and only for critical APIs
            const isNewResource = !(await cache.match(cacheKey));
            const isCriticalAPI = event.request.url.includes('/api/') && !event.request.url.includes('getLogs');
            
            if (isNewResource && isCriticalAPI) {
              log('Successfully fetched and caching:', event.request.url);
            }
            
            const responseToCache = response.clone();
            cache.put(cacheKey, responseToCache).catch(err => 
              log('Failed to cache asset:', cacheKey, err)
            );
            return response;
          }
          return response;
        } catch (err) {
          // Only log network failures for important APIs, not frequent ones
          if (!event.request.url.includes('getLogs')) {
            log('Network failed, trying cache for:', cacheKey);
          }
          // Try to get from cache
          const cached = await cache.match(cacheKey);
          if (cached) {
            // Only log for non-frequent files to reduce spam
            const isFrequentFile = event.request.url.includes('manifest.json') || 
                                   event.request.url.endsWith('/') || 
                                   event.request.url.includes('.ico') ||
                                   event.request.url.includes('getLogs');
            if (!isFrequentFile) {
              log('Serving from cache (default):', event.request.url);
            }
            return cached;
          }
          
          // For images, return a transparent pixel instead of throwing error
          if (isImage) {
            log('Creating fallback response for missing image:', pathname);
            // Return a 1x1 transparent PNG as fallback
            const transparentPixel = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
            return fetch(transparentPixel);
          }
          
          // For other assets, return appropriate error response instead of throwing
          log('No cached version available for:', event.request.url);
          return new Response('', { 
            status: 404, 
            statusText: 'Not Found',
            headers: { 
              'Content-Type': isImage ? 'image/png' : 'text/plain'
            }
          });
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
      }).catch(async () => {
        log('Failed to fetch and no cache for:', fullUrl);
        
        // For Next.js assets with version parameters, try to find a cached version without the version
        if (pathname.includes('/_next/static/') && url.search) {
          const baseUrl = `${url.origin}${pathname}`;
          const cached = await caches.match(baseUrl);
          if (cached) {
            log('Serving cached version without query params for:', baseUrl);
            return cached;
          }
          
          // Try to find any cached version of this file (different version)
          const cache = await caches.open(CACHE_NAME);
          const keys = await cache.keys();
          const similarAsset = keys.find(request => 
            request.url.includes(pathname.split('?')[0])
          );
          if (similarAsset) {
            const similarCached = await cache.match(similarAsset);
            if (similarCached) {
              log('Serving similar cached asset for:', pathname);
              return similarCached;
            }
          }
        }
        
        // Only return offline.html for navigation requests, not assets
        if (request.mode === 'navigate') {
          return caches.match('/offline.html');
        }
        
        // For assets, return a network error instead of offline page
        return new Response('', { 
          status: 404, 
          statusText: 'Not Found' 
        });
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

// ===============================================
// ENHANCED EVENT HANDLERS FOR OFFLINE SYNC
// ===============================================

// Listen for online/offline events for our new sync system
self.addEventListener('online', () => {
  log('Device is online - attempting offline action sync');
  syncOfflineActions();
});

// Enhanced message handling for manual sync triggers and status
self.addEventListener('message', (event) => {
  const { type, data } = event.data || {};
  
  switch (type) {
    case 'SYNC_OFFLINE_ACTIONS':
      log('Manual sync requested for offline actions');
      event.waitUntil(syncOfflineActions().then(success => {
        event.ports[0]?.postMessage({ success });
      }));
      break;
      
    case 'GET_OFFLINE_STATUS':
      const queue = getOfflineData('offline_action_queue', []);
      const pendingCount = queue.filter(action => action.status === 'pending').length;
      event.ports[0]?.postMessage({ 
        offline: !navigator.onLine,
        pendingActions: pendingCount,
        totalActions: queue.length,
        offlineData: {
          timesheets: Object.keys(localStorage).filter(key => key.startsWith('offline_timesheet_')).length,
          equipmentLogs: Object.keys(localStorage).filter(key => key.startsWith('offline_equipment_log_')).length
        }
      });
      break;
      
    case 'CLEAR_OFFLINE_DATA':
      try {
        localStorage.removeItem('offline_action_queue');
        Object.keys(localStorage).forEach(key => {
          if (key.startsWith('offline_')) {
            localStorage.removeItem(key);
          }
        });
        log('Offline data cleared');
        event.ports[0]?.postMessage({ success: true });
      } catch (error) {
        log('Failed to clear offline data:', error);
        event.ports[0]?.postMessage({ success: false, error: error.message });
      }
      break;

    case 'GET_PENDING_ACTIONS':
      const pendingActions = getOfflineData('offline_action_queue', [])
        .filter(action => action.status === 'pending')
        .map(action => ({
          id: action.id,
          actionName: action.actionName,
          timestamp: action.timestamp,
          retryCount: action.retryCount || 0
        }));
      event.ports[0]?.postMessage({ pendingActions });
      break;

    case 'DEBUG_CACHE':
      debugCacheContents().then(keys => {
        event.ports[0]?.postMessage({ 
          cacheKeys: keys.map(request => request.url),
          cacheName: CACHE_NAME
        });
      });
      break;
  }
});

log('Service Worker script loaded with comprehensive offline support');
