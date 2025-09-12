"use client";
import React, { useState, useEffect } from "react";
import { Buttons } from "../(reusable)/buttons"; // Adjust the import path as needed
import { usePermissions } from "@/app/context/PermissionsContext";

const RequestPermissions = ({
  handlePermissionsGranted,
}: {
  handlePermissionsGranted: () => void;
}) => {
  const [permissionsGranted, setPermissionsGranted] = useState({
    location: false,
    camera: false,
    cookies: false,
  });
  const { requestCameraPermission, requestLocationPermission } =
    usePermissions();

  // Use the centralized permission context for requesting location permission
  const handleLocationPermission = async () => {
    const granted = await requestLocationPermission();
    setPermissionsGranted((prev) => ({ ...prev, location: granted }));
  };

  // Use the centralized permission context for requesting camera permission
  const handleCameraPermission = async () => {
    const granted = await requestCameraPermission();
    setPermissionsGranted((prev) => ({ ...prev, camera: granted }));
  };

  const requestCookiesPermission = () => {
    // Simulating cookie consent - in reality, this would involve setting a consent cookie or interacting with a cookie management service.
    document.cookie = "cookieConsent=true; path=/;";
    setPermissionsGranted((prev) => ({ ...prev, cookies: true }));
  };

  const handleRequestPermissions = async () => {
    await handleLocationPermission();
    await handleCameraPermission();
    requestCookiesPermission();
  };

  const allPermissionsGranted =
    permissionsGranted.location &&
    permissionsGranted.camera &&
    permissionsGranted.cookies;

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <p>
        Please grant the following permissions to enable full access to the
        application:
      </p>

      <div style={{ margin: "40px 0", fontWeight: "bold", fontSize: "24px" }}>
        <p>Location: {permissionsGranted.location ? "Granted" : "Pending"}</p>
        <p>Cookies: {permissionsGranted.cookies ? "Granted" : "Pending"}</p>
        <p>Camera: {permissionsGranted.camera ? "Granted" : "Pending"}</p>
      </div>

      <Buttons
        onClick={handleRequestPermissions}
        style={{
          backgroundColor: "limegreen",
          color: "black",
          marginBottom: "10px",
        }}
        disabled={allPermissionsGranted}
      >
        {allPermissionsGranted ? "Permissions Granted" : "Grant Permissions"}
      </Buttons>

      <Buttons
        onClick={handlePermissionsGranted}
        style={{ backgroundColor: "orange", color: "black" }}
        disabled={!allPermissionsGranted}
      >
        Proceed
      </Buttons>
    </div>
  );
};

export default RequestPermissions;
