/**
 * Offline CSS Fallback Manager
 * Ensures critical CSS is available when offline
 */
'use client';

import { useEffect } from 'react';

const OfflineCSSFallback = () => {
  useEffect(() => {
    console.log("useOfflineCSSFallback1");
    const ensureCSSLoaded = async () => {
      // Check if Tailwind CSS is working by testing a known class
      const testElement = document.createElement('div');
      testElement.className = 'hidden';
      testElement.style.position = 'absolute';
      testElement.style.top = '-9999px';
      document.body.appendChild(testElement);
      
      const computed = window.getComputedStyle(testElement);
      const isHidden = computed.display === 'none';
      
      document.body.removeChild(testElement);
      
      // If Tailwind isn't working, inject fallback CSS
      if (!isHidden) {
        console.log('[OfflineCSSFallback] Tailwind CSS not detected, loading fallback');
        
        // Check if fallback CSS is already loaded
        const existingFallback = document.getElementById('fallback-css');
        if (!existingFallback) {
          const link = document.createElement('link');
          link.id = 'fallback-css';
          link.rel = 'stylesheet';
          link.type = 'text/css';
          link.href = '/fallback.css';
          link.onload = () => {
            console.log('[OfflineCSSFallback] Fallback CSS loaded successfully');
          };
          link.onerror = () => {
            console.error('[OfflineCSSFallback] Failed to load fallback CSS');
          };
          document.head.appendChild(link);
        }
      } else {
        console.log('[OfflineCSSFallback] Tailwind CSS is working properly');
      }
    };

    // Run the check after a short delay to ensure DOM is ready
    const timer = setTimeout(ensureCSSLoaded, 100);
    
    return () => clearTimeout(timer);
  }, []);

  return null;
};

export default OfflineCSSFallback;
