/**
 * Enhanced network detection hook with connection quality monitoring
 */
'use client';

import { useEffect, useState, useCallback } from 'react';

export interface NetworkInfo {
  isOnline: boolean;
  connectionType: 'slow-2g' | '2g' | '3g' | '4g' | 'wifi' | 'unknown';
  downlink: number; // Effective bandwidth in Mbps
  isSlowConnection: boolean;
  rtt: number; // Round-trip time in ms
}

declare global {
  interface Navigator {
    connection?: {
      effectiveType: '2g' | '3g' | '4g' | 'slow-2g';
      downlink: number;
      rtt: number;
      saveData: boolean;
      addEventListener?: (type: string, listener: EventListener) => void;
      removeEventListener?: (type: string, listener: EventListener) => void;
    };
  }
}

export const useNetworkStatus = () => {
  const [networkInfo, setNetworkInfo] = useState<NetworkInfo>({
    isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
    connectionType: 'unknown',
    downlink: 0,
    isSlowConnection: false,
    rtt: 0,
  });

  const updateNetworkInfo = useCallback(() => {
    const connection = navigator.connection;
    const isOnline = navigator.onLine;
    
    let connectionType: NetworkInfo['connectionType'] = 'unknown';
    let downlink = 0;
    let rtt = 0;
    let isSlowConnection = false;

    if (connection) {
      connectionType = connection.effectiveType === 'slow-2g' ? 'slow-2g' :
                      connection.effectiveType === '2g' ? '2g' :
                      connection.effectiveType === '3g' ? '3g' :
                      connection.effectiveType === '4g' ? '4g' :
                      'unknown';
      
      downlink = connection.downlink || 0;
      rtt = connection.rtt || 0;
      isSlowConnection = connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g';
    } else if (isOnline) {
      // Fallback for browsers without connection API
      connectionType = 'wifi'; // Assume WiFi if online and no connection info
    }

    setNetworkInfo({
      isOnline,
      connectionType,
      downlink,
      isSlowConnection,
      rtt,
    });
  }, []);

  useEffect(() => {
    updateNetworkInfo();

    const handleOnline = () => updateNetworkInfo();
    const handleOffline = () => updateNetworkInfo();
    const handleConnectionChange = () => updateNetworkInfo();

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    if (navigator.connection?.addEventListener) {
      navigator.connection.addEventListener('change', handleConnectionChange);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      
      if (navigator.connection?.removeEventListener) {
        navigator.connection.removeEventListener('change', handleConnectionChange);
      }
    };
  }, [updateNetworkInfo]);

  return networkInfo;
};
