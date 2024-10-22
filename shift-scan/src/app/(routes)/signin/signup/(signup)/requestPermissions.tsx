import React, { useState } from "react";
import { Buttons } from "@/components/(reusable)/buttons"; // Adjust the import path as needed

const RequestPermissions = ({
  handlePermissionsGranted,
}: {
  handlePermissionsGranted: any;
}) => {
  const [permissionsGranted, setPermissionsGranted] = useState({
    location: false,
    camera: false,
    cookies: false,
  });

  const requestLocationPermission = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setPermissionsGranted((prev) => ({ ...prev, location: true }));
        },
        (error) => {
          console.error("Error requesting location permission:", error);
        }
      );
    } else {
      alert("Geolocation is not available in your browser.");
    }
  };

  const requestCameraPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setPermissionsGranted((prev) => ({ ...prev, camera: true }));
      stream.getTracks().forEach((track) => track.stop()); // Stop the stream after getting permission
    } catch (error) {
      console.error("Error requesting camera permission:", error);
    }
  };

  const requestCookiesPermission = () => {
    // Simulating cookie consent - in reality, this would involve setting a consent cookie or interacting with a cookie management service.
    document.cookie = "cookieConsent=true; path=/;";
    setPermissionsGranted((prev) => ({ ...prev, cookies: true }));
  };

  const handleRequestPermissions = () => {
    requestLocationPermission();
    requestCameraPermission();
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
