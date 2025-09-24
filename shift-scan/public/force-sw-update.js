// Force Service Worker Update Script
// This script forces the service worker to update and clears all caches

(async function forceServiceWorkerUpdate() {
  try {
    console.log('[SW Update] Starting service worker force update...');
    
    // Unregister existing service workers
    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      console.log(`[SW Update] Found ${registrations.length} service worker registrations`);
      
      for (const registration of registrations) {
        console.log('[SW Update] Unregistering service worker:', registration.scope);
        await registration.unregister();
      }
      
      // Clear all caches
      const cacheNames = await caches.keys();
      console.log(`[SW Update] Found ${cacheNames.length} caches to delete:`, cacheNames);
      
      for (const cacheName of cacheNames) {
        console.log('[SW Update] Deleting cache:', cacheName);
        await caches.delete(cacheName);
      }
      
      // Clear localStorage offline data to prevent conflicts
      console.log('[SW Update] Clearing offline data...');
      const offlineKeys = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.startsWith('offline_') || key.includes('action_queue'))) {
          offlineKeys.push(key);
        }
      }
      
      for (const key of offlineKeys) {
        localStorage.removeItem(key);
        console.log('[SW Update] Removed offline data:', key);
      }
      
      console.log('[SW Update] Service worker and caches cleared successfully!');
      console.log('[SW Update] Please refresh the page to register the new service worker.');
      
      // Auto-refresh after a short delay
      setTimeout(() => {
        console.log('[SW Update] Auto-refreshing page...');
        window.location.reload(true);
      }, 1000);
      
    } else {
      console.log('[SW Update] Service workers not supported');
    }
  } catch (error) {
    console.error('[SW Update] Error during force update:', error);
  }
})();