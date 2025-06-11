"use client";

import React, { useEffect } from "react";
import { usePermissions } from "@/app/context/PermissionsContext";

export default function AutoPermissionsManager() {
  const {
    permissions,
    requestCameraPermission,
    requestLocationPermission,
    initialized,
  } = usePermissions();

  useEffect(() => {
    if (!initialized) return;

    const handlePermissions = async () => {
      // If permissions are not granted, request them
      if (!permissions.camera) {
        try {
          await requestCameraPermission();
        } catch (err) {
          console.error("Failed to request camera permission:", err);
        }
      }

      if (!permissions.location) {
        try {
          await requestLocationPermission();
        } catch (err) {
          console.error("Failed to request location permission:", err);
        }
      }
    };

    const permissionsTimeout = setTimeout(() => {
      handlePermissions();
    }, 2000); // Wait 2 seconds after initialization before requesting permissions

    return () => clearTimeout(permissionsTimeout);
  }, [
    initialized,
    permissions,
    requestCameraPermission,
    requestLocationPermission,
  ]);

  // This component doesn't render anything
  return null;
}
