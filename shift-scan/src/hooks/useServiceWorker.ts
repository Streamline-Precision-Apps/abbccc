/**
 * Registers the service worker for offline support.
 * @returns void
 */
import { useEffect } from 'react';

export const useServiceWorker = (): void => {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/service-worker.js')
        .then(registration => {
          console.log('[ServiceWorker] Registration successful:', registration);
          
          // Force update check
          registration.addEventListener('updatefound', () => {
            console.log('[ServiceWorker] Update found, installing new version');
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  console.log('[ServiceWorker] New version installed, refresh to activate');
                  // Optionally, you could show a notification to the user here
                }
              });
            }
          });
          
          // Check for updates immediately
          registration.update();
        })
        .catch(error => {
          console.error('[ServiceWorker] Registration failed:', error);
        });
    }
  }, []);
};
