/**
 * Inline Service Worker Debug Helper
 * Copy and paste this entire script into browser console to debug cache and offline issues
 */

(async function debugServiceWorkerInline() {
  console.log('🔍 Debugging Service Worker...');
  
  if (!('serviceWorker' in navigator)) {
    console.error('❌ Service Worker not supported');
    return;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    console.log('✅ Service Worker ready:', registration);

    // Check cache contents manually
    const cacheNames = await caches.keys();
    console.log('🗂️ All cache names:', cacheNames);

    for (const cacheName of cacheNames) {
      if (cacheName.includes('shift-scan-cache')) {
        console.log(`📋 Checking cache: ${cacheName}`);
        const cache = await caches.open(cacheName);
        const keys = await cache.keys();
        
        console.log(`Cache ${cacheName} contents (${keys.length} items):`);
        keys.forEach((request, index) => {
          console.log(`  ${index + 1}. ${request.url}`);
          if (request.url.includes('/clock')) {
            console.log('    🎯 Clock page found in cache!');
          }
        });

        // Test if we can match the clock page with different variations
        const clockTests = [
          '/clock',
          `${window.location.origin}/clock`,
          new Request('/clock'),
          new Request(`${window.location.origin}/clock`),
          new Request('/clock', { mode: 'navigate' })
        ];

        console.log('🧪 Testing clock page cache matches:');
        for (let i = 0; i < clockTests.length; i++) {
          const test = clockTests[i];
          const match = await cache.match(test);
          const testDesc = typeof test === 'string' ? test : `Request(${test.url})`;
          if (match) {
            console.log(`  ✅ Clock page matches for: ${testDesc}`);
          } else {
            console.log(`  ❌ Clock page does NOT match for: ${testDesc}`);
          }
        }
      }
    }

    // Test clock navigation
    console.log('🧪 Testing clock page fetch...');
    try {
      const response = await fetch('/clock');
      console.log('📡 Clock page fetch result:', response.status, response.statusText);
      console.log('📍 Response URL:', response.url);
      
      if (response.url.includes('offline')) {
        console.log('⚠️ Clock page redirected to offline page!');
      } else {
        console.log('✅ Clock page fetch successful');
      }
    } catch (error) {
      console.error('❌ Clock page fetch failed:', error);
    }

    // Test navigation simulation
    console.log('🎭 Testing navigation request simulation...');
    try {
      const navRequest = new Request('/clock', {
        method: 'GET',
        mode: 'navigate',
        cache: 'default'
      });

      // This will be intercepted by service worker
      const navResponse = await fetch(navRequest);
      console.log('🔀 Navigation simulation result:', navResponse.status, navResponse.statusText);
      console.log('📍 Navigation response URL:', navResponse.url);
      
      if (navResponse.url.includes('offline')) {
        console.log('⚠️ Navigation simulation redirected to offline page!');
      } else {
        console.log('✅ Navigation simulation worked correctly');
      }
    } catch (error) {
      console.error('❌ Navigation simulation failed:', error);
    }

  } catch (error) {
    console.error('❌ Debug failed:', error);
  }

  console.log('📋 Debug Summary:');
  console.log('If you see "Clock page redirected to offline page", the issue is in the service worker navigation handling.');
  console.log('If clock page is not found in cache, the issue is during service worker installation.');
  console.log('Check the Service Worker logs in DevTools > Application > Service Workers for more details.');
})();
