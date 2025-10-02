"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

interface PermissionState {
  camera: boolean;
  location: boolean;
  lastUpdated?: string; // Timestamp for when permissions were last updated
  // iOS specific flags to prevent repeated prompts
  hasPromptedCamera?: boolean;
  hasPromptedLocation?: boolean;
}

interface PermissionsContextType {
  permissions: PermissionState;
  requestCameraPermission: () => Promise<boolean>;
  requestLocationPermission: () => Promise<boolean>;
  checkPermissions: () => Promise<void>;
  resetPermissions: () => void;
  isMobileDevice: () => boolean;
  syncPermissionsWithServer: (userId?: string) => Promise<void>;
  initialized: boolean;
}

const PermissionsContext = createContext<PermissionsContextType | undefined>(
  undefined,
);

export function PermissionsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [initialized, setInitialized] = useState(false);
  const [permissions, setPermissions] = useState<PermissionState>({
    camera: false,
    location: false,
  });

  const isIOSDevice = (): boolean => {
    if (typeof navigator === "undefined") return false;
    return (
      /iPad|iPhone|iPod/.test(navigator.userAgent) &&
      !(window as Window & { MSStream?: unknown }).MSStream
    );
  };

  const checkPermissions = async () => {
    try {
      // Detect mobile platforms
      const isIOS = isIOSDevice();
      const isAndroid =
        typeof navigator !== "undefined"
          ? /Android/.test(navigator.userAgent)
          : false;
      const isMobile = isMobileDevice();

      // First try to get permissions from localStorage for consistency
      const storedPermissions = getStoredPermissions();

      // Try to get user ID if available (depends on your auth implementation)
      // This is a placeholder - replace with your actual auth system
      const userId =
        typeof localStorage !== "undefined"
          ? localStorage.getItem("userId")
          : null;

      // If user is logged in, try to fetch permissions from server
      let serverPermissions: PermissionState | null = null;
      if (userId) {
        serverPermissions = await fetchPermissionsFromServer(userId);
      }

      // Use server permissions if available and more recent than local
      if (
        serverPermissions &&
        serverPermissions.lastUpdated &&
        storedPermissions.lastUpdated &&
        new Date(serverPermissions.lastUpdated) >
          new Date(storedPermissions.lastUpdated)
      ) {
        setPermissions(serverPermissions);
        // Update local storage with server data
        storePermissions(serverPermissions);
        setInitialized(true);
        return;
      }

      // For iOS, always use stored permissions to avoid prompts
      // iOS doesn't support the Permissions API well and will prompt users repeatedly
      if (isIOS) {
        setPermissions(storedPermissions);
        setInitialized(true);
        return;
      }

      // On other mobile devices, prioritize stored permissions to avoid prompts
      if (
        isMobile &&
        (storedPermissions.camera || storedPermissions.location)
      ) {
        setPermissions(storedPermissions);
        setInitialized(true);
        return;
      }

      // Only use permissions API if it's properly supported
      // Many mobile browsers have incomplete implementations
      if (
        navigator.permissions &&
        typeof navigator.permissions.query === "function" &&
        !isIOS
      ) {
        // iOS has issues with Permissions API
        try {
          // Check camera permission
          const cameraResult = await navigator.permissions.query({
            name: "camera" as PermissionName,
          });

          // Check geolocation permission
          const locationResult = await navigator.permissions.query({
            name: "geolocation",
          });

          const newPermissions = {
            camera: cameraResult.state === "granted",
            location: locationResult.state === "granted",
          };

          setPermissions(newPermissions);
          storePermissions(newPermissions);

          // Listen for changes in permission states
          cameraResult.addEventListener("change", async () => {
            const newCameraState = cameraResult.state === "granted";
            const updatedPermissions = {
              ...permissions,
              camera: newCameraState,
            };
            setPermissions(updatedPermissions);
            storePermissions(updatedPermissions);
          });

          locationResult.addEventListener("change", () => {
            const newLocationState = locationResult.state === "granted";
            const updatedPermissions = {
              ...permissions,
              location: newLocationState,
            };
            setPermissions(updatedPermissions);
            storePermissions(updatedPermissions);
          });
        } catch (permError) {
          // Fall back to localStorage if permissions API fails
          setPermissions(storedPermissions);
        }
      } else {
        // Use localStorage-based permissions when Permissions API isn't reliable
        setPermissions(storedPermissions);
      }

      setInitialized(true);
    } catch (error) {
      console.error("Error checking permissions:", error);
      // Still mark as initialized to not block the app
      setInitialized(true);
    }
  };

  // Helper to get permissions from localStorage
  const getStoredPermissions = (): PermissionState => {
    if (typeof localStorage === "undefined") {
      return { camera: false, location: false };
    }
    try {
      const storedPermissions = localStorage.getItem("app_permissions");
      return storedPermissions
        ? JSON.parse(storedPermissions)
        : { camera: false, location: false };
    } catch (e) {
      return { camera: false, location: false };
    }
  };

  // Helper to store permissions in localStorage
  const storePermissions = (newPermissions: PermissionState) => {
    if (typeof localStorage !== "undefined") {
      // Add a timestamp when storing permissions
      const permissionsWithTimestamp = {
        ...newPermissions,
        lastUpdated: new Date().toISOString(),
      };
      localStorage.setItem(
        "app_permissions",
        JSON.stringify(permissionsWithTimestamp),
      );
    }
  };

  // Function to sync permissions with the server database
  const syncPermissionsWithServer = async (userId?: string) => {
    try {
      // Skip if no userId is provided (user not authenticated)
      if (!userId) {
        return;
      }

      // Make API call to update permissions in database
      const response = await fetch("/api/user-permissions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          cameraAccess: permissions.camera,
          locationAccess: permissions.location,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to sync permissions with server");
      }
    } catch (error) {
      console.error("Error syncing permissions with server:", error);
      // Continue app execution even if sync fails
    }
  };

  // Function to fetch permissions from server
  const fetchPermissionsFromServer = async (
    userId: string,
  ): Promise<PermissionState | null> => {
    try {
      const response = await fetch(`/api/user-permissions?userId=${userId}`);

      if (!response.ok) {
        return null;
      }

      const data = await response.json();

      if (!data.permissions) {
        return null;
      }

      return {
        camera: data.permissions.cameraAccess,
        location: data.permissions.locationAccess,
        lastUpdated: data.permissions.lastUpdated,
      };
    } catch (error) {
      console.error("Error fetching permissions from server:", error);
      return null;
    }
  };

  const requestCameraPermission = async (): Promise<boolean> => {
    try {
      // Check if permission was already granted previously
      if (permissions.camera) {
        return true;
      }

      // For iOS: If we've already prompted, use the stored permission state
      // to avoid prompting again, unless it's been explicitly requested
      if (isIOSDevice() && permissions.hasPromptedCamera) {
        return permissions.camera;
      }

      // Request camera access
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment",
        },
      });

      // Clean up the stream after getting permission
      stream.getTracks().forEach((track) => track.stop());

      // Update and store permissions
      const newPermissions = {
        ...permissions,
        camera: true,
        // Mark that we've prompted for camera permission (for iOS)
        hasPromptedCamera: true,
      };
      setPermissions(newPermissions);
      storePermissions(newPermissions);

      // Try to sync with server if user is logged in
      const userId =
        typeof localStorage !== "undefined"
          ? localStorage.getItem("userId")
          : null;
      if (userId) {
        await syncPermissionsWithServer(userId);
      }

      return true;
    } catch (error) {
      console.error("Error requesting camera permission:", error);

      // Check if it's a NotAllowedError, meaning the user explicitly denied
      const isDenied =
        error instanceof DOMException &&
        (error.name === "NotAllowedError" ||
          error.name === "PermissionDeniedError");

      // Only update permissions if we have a clear denial
      if (isDenied) {
        const newPermissions = {
          ...permissions,
          camera: false,
          // Mark that we've prompted for camera permission (for iOS)
          hasPromptedCamera: true,
        };
        setPermissions(newPermissions);
        storePermissions(newPermissions);

        // Try to sync with server if user is logged in
        const userId =
          typeof localStorage !== "undefined"
            ? localStorage.getItem("userId")
            : null;
        if (userId) {
          await syncPermissionsWithServer(userId);
        }
      }

      return false;
    }
  };

  const requestLocationPermission = async (): Promise<boolean> => {
    try {
      // Check if permission was already granted previously
      if (permissions.location) {
        return true;
      }

      // For iOS: If we've already prompted, use the stored permission state
      // to avoid prompting again, unless it's been explicitly requested
      if (isIOSDevice() && permissions.hasPromptedLocation) {
        return permissions.location;
      }

      // Request location with a timeout to prevent long-hanging requests
      await new Promise((resolve, reject) => {
        const timeoutId = setTimeout(() => {
          reject(new Error("Location permission request timed out"));
        }, 10000); // 10 second timeout

        navigator.geolocation.getCurrentPosition(
          (position) => {
            clearTimeout(timeoutId);
            resolve(position);
          },
          (error) => {
            clearTimeout(timeoutId);
            reject(error);
          },
          {
            enableHighAccuracy: true,
            timeout: 8000,
            maximumAge: 0,
          },
        );
      });

      // Update and store permissions
      const newPermissions = {
        ...permissions,
        location: true,
        // Mark that we've prompted for location permission (for iOS)
        hasPromptedLocation: true,
      };
      setPermissions(newPermissions);
      storePermissions(newPermissions);

      // Try to sync with server if user is logged in
      const userId =
        typeof localStorage !== "undefined"
          ? localStorage.getItem("userId")
          : null;
      if (userId) {
        await syncPermissionsWithServer(userId);
      }

      return true;
    } catch (error) {
      console.error("Error requesting location permission:", error);

      // Check if error is a permission denial
      const isDenied =
        error instanceof GeolocationPositionError &&
        error.code === error.PERMISSION_DENIED;

      // Only update stored permissions if we have a clear denial
      if (isDenied) {
        const newPermissions = {
          ...permissions,
          location: false,
          // Mark that we've prompted for location permission (for iOS)
          hasPromptedLocation: true,
        };
        setPermissions(newPermissions);
        storePermissions(newPermissions);

        // Try to sync with server if user is logged in
        const userId =
          typeof localStorage !== "undefined"
            ? localStorage.getItem("userId")
            : null;
        if (userId) {
          await syncPermissionsWithServer(userId);
        }
      }

      return false;
    }
  };

  const isMobileDevice = (): boolean => {
    const userAgent =
      navigator.userAgent ||
      (navigator as Navigator & { vendor?: string }).vendor ||
      (window as Window & { opera?: string }).opera ||
      "";
    return (
      /android|iPad|iPhone|iPod/i.test(userAgent) ||
      typeof (window as Window & { orientation?: unknown }).orientation !==
        "undefined"
    );
  };

  const resetPermissions = () => {
    const defaultPermissions = {
      camera: false,
      location: false,
      hasPromptedCamera: false,
      hasPromptedLocation: false,
    };
    setPermissions(defaultPermissions);
    storePermissions(defaultPermissions);

    // Try to sync reset permissions to server
    const userId =
      typeof localStorage !== "undefined"
        ? localStorage.getItem("userId")
        : null;
    if (userId) {
      syncPermissionsWithServer(userId).catch(console.error);
    }
  };

  useEffect(() => {
    // For iOS, we initialize with stored values and avoid permission API calls
    if (typeof window !== "undefined" && isIOSDevice()) {
      const storedPermissions = getStoredPermissions();
      setPermissions(storedPermissions);
      setInitialized(true);
    } else {
      // For other platforms, proceed with normal permission checking
      checkPermissions();
    }
  }, []);

  return (
    <PermissionsContext.Provider
      value={{
        permissions,
        requestCameraPermission,
        requestLocationPermission,
        checkPermissions,
        resetPermissions,
        isMobileDevice,
        syncPermissionsWithServer,
        initialized,
      }}
    >
      {children}
    </PermissionsContext.Provider>
  );
}

export function usePermissions() {
  const context = useContext(PermissionsContext);
  if (context === undefined) {
    throw new Error("usePermissions must be used within a PermissionsProvider");
  }
  return context;
}
