"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

interface PermissionState {
  camera: boolean;
  location: boolean;
  lastUpdated?: string; // Timestamp for when permissions were last updated
  hasPromptedCamera?: boolean;
  hasPromptedLocation?: boolean;
}

interface LocationCoordinates {
  latitude: number;
  longitude: number;
  timestamp: string;
}

interface PermissionsContextType {
  permissions: PermissionState;
  requestCameraPermission: () => Promise<boolean>;
  requestLocationPermission: () => Promise<{
    success: boolean;
    coordinates?: LocationCoordinates;
  }>;
  requestAllPermissions: () => Promise<{
    camera: boolean;
    location: boolean;
    coordinates?: LocationCoordinates;
  }>;
  checkPermissions: () => Promise<void>;
  resetPermissions: () => void;
  resetCameraPermission: () => void;
  resetLocationPermission: () => void;
  getStoredCoordinates: () => LocationCoordinates | null;
  clearStoredCoordinates: () => void;
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

  // Request Functions for permissions

  const requestAllPermissions = async () => {
    const cameraResult = await requestCameraPermission();
    const locationResult = await requestLocationPermission();

    return {
      camera: cameraResult,
      location: locationResult.success,
      coordinates: locationResult.coordinates,
    };
  };
  const requestCameraPermission = async (): Promise<boolean> => {
    try {
      // Check if mediaDevices is available
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Camera access is not supported by this browser");
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
      // Provide better error logging
      const errorMessage =
        error instanceof Error ? error.message : JSON.stringify(error);
      console.error("Error requesting camera permission:", errorMessage);

      // Update permissions to false if request fails
      const newPermissions = {
        ...permissions,
        camera: false,
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

      return false;
    }
  };
  const requestLocationPermission = async (): Promise<{
    success: boolean;
    coordinates?: LocationCoordinates;
  }> => {
    try {
      // Check if geolocation is available
      if (!navigator.geolocation) {
        throw new Error("Geolocation is not supported by this browser");
      }

      // Request location with a timeout to prevent long-hanging requests
      const position = await new Promise<GeolocationPosition>(
        (resolve, reject) => {
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
              // Handle geolocation error with better error message
              const errorCode = (error as GeolocationPositionError).code;
              const errorMessage =
                (error as GeolocationPositionError).message || "Unknown error";

              if (errorCode === 1) {
                reject(new Error("Location permission denied by user"));
              } else if (errorCode === 2) {
                reject(new Error("Location position unavailable"));
              } else if (errorCode === 3) {
                reject(new Error("Location request timed out"));
              } else {
                reject(new Error(`Location error: ${errorMessage}`));
              }
            },
            {
              enableHighAccuracy: true,
              timeout: 8000,
              maximumAge: 0,
            },
          );
        },
      );

      // Extract and store coordinates
      const coordinates: LocationCoordinates = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        timestamp: new Date().toISOString(),
      };

      // Store coordinates in localStorage
      storeLocationCoordinates(coordinates);

      // Update and store permissions
      const newPermissions = {
        ...permissions,
        location: true,
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

      return { success: true, coordinates };
    } catch (error) {
      // Provide better error logging
      const errorMessage =
        error instanceof Error ? error.message : JSON.stringify(error);
      console.error("Error requesting location permission:", errorMessage);

      // Clear any stored coordinates on error
      clearStoredCoordinates();

      // Update permissions to false if request fails
      const newPermissions = {
        ...permissions,
        location: false,
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

      return { success: false };
    }
  };

  // Helper Functions for Permissions Context
  const isIOSDevice = (): boolean => {
    if (typeof navigator === "undefined") return false;
    return (
      /iPad|iPhone|iPod/.test(navigator.userAgent) &&
      !(window as Window & { MSStream?: unknown }).MSStream
    );
  };

  // This is a non-intrusive check that won't trigger browser permission prompts
  const checkPermissions = async () => {
    try {
      // First try to get permissions from localStorage for consistency
      const storedPermissions = getStoredPermissions();

      // Try to get user ID if available (depends on your auth implementation)
      const userId =
        typeof localStorage !== "undefined"
          ? localStorage.getItem("userId")
          : null;

      // If user is logged in, try to fetch permissions from server
      // This won't trigger browser permission prompts, it just checks the database
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

      // Use stored permissions without triggering any browser prompts
      setPermissions(storedPermissions);
      setInitialized(true);

      // Check permissions state using the Permissions API if available
      // Note: This is a passive check that doesn't trigger prompts
      if (
        navigator.permissions &&
        typeof navigator.permissions.query === "function" &&
        !isIOSDevice()
      ) {
        try {
          // These queries only check the current state without prompting
          const cameraResult = await navigator.permissions.query({
            name: "camera" as PermissionName,
          });
          const locationResult = await navigator.permissions.query({
            name: "geolocation",
          });

          // Update our state based on what we find
          const permissionState = {
            ...storedPermissions,
            camera: cameraResult.state === "granted",
            location: locationResult.state === "granted",
          };

          setPermissions(permissionState);
          storePermissions(permissionState);

          // Set up listeners for future changes
          cameraResult.addEventListener("change", () => {
            setPermissions((prev) => ({
              ...prev,
              camera: cameraResult.state === "granted",
            }));
          });

          locationResult.addEventListener("change", () => {
            setPermissions((prev) => ({
              ...prev,
              location: locationResult.state === "granted",
            }));
          });
        } catch (permError) {
          console.log(
            "Permission query failed, using stored values",
            permError,
          );
          // Non-critical error, we already set permissions from storage
        }
      }
    } catch (error) {
      console.error("Error checking permissions:", error);
      // Still mark as initialized to not block the app
      setInitialized(true);
    }
  };
  // Helper to store location coordinates in localStorage
  const storeLocationCoordinates = (coordinates: LocationCoordinates) => {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem("location_coordinates", JSON.stringify(coordinates));
    }
  };

  // Helper to get stored location coordinates
  const getStoredCoordinates = (): LocationCoordinates | null => {
    if (typeof localStorage === "undefined") {
      return null;
    }
    try {
      const storedCoordinates = localStorage.getItem("location_coordinates");
      return storedCoordinates ? JSON.parse(storedCoordinates) : null;
    } catch (e) {
      console.error("Error retrieving stored coordinates:", e);
      return null;
    }
  };

  // Helper to clear stored location coordinates
  const clearStoredCoordinates = () => {
    if (typeof localStorage !== "undefined") {
      localStorage.removeItem("location_coordinates");
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

  // Reset all permissions to default (false)
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

  // Reset only camera permission to allow re-requesting
  const resetCameraPermission = () => {
    const updatedPermissions = {
      ...permissions,
      camera: false,
    };
    setPermissions(updatedPermissions);
    storePermissions(updatedPermissions);
  };

  // Reset only location permission to allow re-requesting
  const resetLocationPermission = () => {
    const updatedPermissions = {
      ...permissions,
      location: false,
    };
    setPermissions(updatedPermissions);
    storePermissions(updatedPermissions);
  };

  /* initializing the permissions state when the component mounts. */
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedPermissions = getStoredPermissions();
      setPermissions(storedPermissions);
      setInitialized(true);
    }
  }, []);

  return (
    <PermissionsContext.Provider
      value={{
        permissions,
        requestCameraPermission,
        requestLocationPermission,
        requestAllPermissions,
        checkPermissions,
        resetPermissions,
        resetCameraPermission,
        resetLocationPermission,
        getStoredCoordinates,
        clearStoredCoordinates,
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
