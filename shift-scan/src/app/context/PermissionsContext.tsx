"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

interface PermissionState {
  camera: boolean;
  location: boolean;
}

interface PermissionsContextType {
  permissions: PermissionState;
  requestCameraPermission: () => Promise<boolean>;
  requestLocationPermission: () => Promise<boolean>;
  checkPermissions: () => Promise<void>;
  initialized: boolean;
}

const PermissionsContext = createContext<PermissionsContextType | undefined>(
  undefined
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

  const checkPermissions = async () => {
    try {
      // Check camera permission
      const cameraResult = await navigator.permissions.query({
        name: "camera" as PermissionName,
      });

      // Check geolocation permission
      const locationResult = await navigator.permissions.query({
        name: "geolocation",
      });

      setPermissions({
        camera: cameraResult.state === "granted",
        location: locationResult.state === "granted",
      });

      // Listen for changes in permission states
      cameraResult.addEventListener("change", async () => {
        const newCameraState = cameraResult.state === "granted";
        setPermissions((prev) => ({ ...prev, camera: newCameraState }));
      });

      locationResult.addEventListener("change", () => {
        const newLocationState = locationResult.state === "granted";
        setPermissions((prev) => ({ ...prev, location: newLocationState }));
      });
      setInitialized(true);
    } catch (error) {
      console.error("Error checking permissions:", error);
      setInitialized(true);
    }
  };

  const requestCameraPermission = async (): Promise<boolean> => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment",
        },
      });
      stream.getTracks().forEach((track) => track.stop()); // Clean up
      setPermissions((prev) => ({ ...prev, camera: true }));
      return true;
    } catch (error) {
      console.error("Error requesting camera permission:", error);
      setPermissions((prev) => ({ ...prev, camera: false }));
      return false;
    }
  };

  const requestLocationPermission = async (): Promise<boolean> => {
    try {
      await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        });
      });
      setPermissions((prev) => ({ ...prev, location: true }));
      return true;
    } catch (error) {
      console.error("Error requesting location permission:", error);
      setPermissions((prev) => ({ ...prev, location: false }));
      return false;
    }
  };

  useEffect(() => {
    checkPermissions();
  }, []);

  return (
    <PermissionsContext.Provider
      value={{
        permissions,
        requestCameraPermission,
        requestLocationPermission,
        checkPermissions,
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
