"use client";
import React, { useEffect, useState } from "react";
import { Holds } from "../(reusable)/holds";
import { Texts } from "../(reusable)/texts";
import { Buttons } from "../(reusable)/buttons";
import { Grids } from "../(reusable)/grids";
import { Titles } from "../(reusable)/titles";
import LocaleToggleSwitch from "../(inputs)/toggleSwitch";
import { Contents } from "../(reusable)/contents";
import { UserSettings } from "@/lib/types";
import { useTranslations } from "next-intl";
import { Banners } from "../(reusable)/banners";
import { setUserPermissions } from "@/actions/userActions";
import { ProgressBar } from "./progressBar";
import { Button } from "../ui/button";

type prop = {
  userId: string;
  handleNextStep: () => void;
  totalSteps: number;
  currentStep: number;
};

export default function NotificationSettings({
  userId,
  handleNextStep,
  totalSteps,
  currentStep,
}: prop) {
  console.log(userId);
  const t = useTranslations("SignUpPermissions");
  const [showBanner, setShowBanner] = useState(false);
  const [bannerMessage, setBannerMessage] = useState("");
  const [updatedData, setUpdatedData] = useState<UserSettings | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isRequiredAcessed, setIsRequiredAcessed] = useState(false);

  // Update the state for a particular setting
  const handleChange = (key: keyof UserSettings, value: boolean) => {
    setUpdatedData((prev) => (prev ? { ...prev, [key]: value } : null));
  };

  useEffect(() => {
    // Check if consent has already been given
    const consent = localStorage.getItem("cookieConsent");
    if (!consent) {
      handleChange("cookiesAccess", false);
    }
    if (consent === "true") {
      handleChange("cookiesAccess", true);
    }
  }, []);

  const handleAcceptCookies = () => {
    localStorage.setItem("cookieConsent", "true");
    handleChange("cookiesAccess", true);
  };

  // Update all settings to true (for the required ones)
  const handleYesToAll = () => {
    setUpdatedData((prev) =>
      prev
        ? {
            ...prev,
            generalReminders: true,
            personalReminders: true,
            cameraAccess: true,
            locationAccess: true,
            cookiesAccess: true,
          }
        : null
    );
  };

  // Request system-level permissions
  const requestSystemPermissions = async () => {
    try {
      // Request Camera Access
      const cameraStream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      console.log("Camera access granted", cameraStream);

      // Request Location Access (wrapped in a Promise to use async/await)
      await new Promise((resolve, reject) => {
        if ("geolocation" in navigator) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              console.log("Location access granted", position);
              resolve(position);
            },
            (error) => {
              console.error("Location access denied", error);
              reject(error);
            }
          );
        } else {
          reject(new Error("Geolocation not available"));
        }
      });

      // Request Notification Access
      const notificationPermission = await Notification.requestPermission();
      if (notificationPermission === "granted") {
        console.log("Notification access granted");
      } else {
        console.warn("Notification access denied");
      }

      // Now update the UI state to reflect that permissions were granted
      handleYesToAll();
    } catch (error) {
      console.error("One or more permissions were denied", error);
      setBannerMessage(
        "One or more permissions were denied. Please check your browser settings."
      );
      setShowBanner(true);
    }
  };

  useEffect(() => {
    if (showBanner) {
      const timer = setTimeout(() => {
        setShowBanner(false);
      }, 8000); // Banner disappears after 8 seconds
      return () => clearTimeout(timer);
    }
  }, [showBanner]);

  // Fetch settings on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/getSettings");
        if (response.ok) {
          const settings = await response.json();
          setUpdatedData(settings);
        } else {
          console.error("Failed to fetch settings", response.statusText);
        }
      } catch (error) {
        console.error("Error occurred while fetching settings:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    // Update the flag if required settings (camera, location, cookies) are enabled
    if (
      updatedData?.cameraAccess === true &&
      updatedData?.locationAccess === true &&
      updatedData?.cookiesAccess === true
    ) {
      setIsRequiredAcessed(true);
    }
  }, [updatedData]);

  const handleSubmitSettings = async () => {
    if (!isRequiredAcessed) {
      setBannerMessage(`${t("RequiredPermissionsError")}`);
      setShowBanner(true);
      return;
    }
    try {
      setIsSubmitting(true);
      const data = new FormData();
      data.append("id", userId);
      data.append("cameraAccess", updatedData?.cameraAccess?.toString() || "");
      data.append(
        "locationAccess",
        updatedData?.locationAccess?.toString() || ""
      );
      data.append(
        "cookiesAccess",
        updatedData?.cookiesAccess?.toString() || ""
      );
      data.append(
        "generalReminders",
        updatedData?.generalReminders?.toString() || ""
      );
      data.append(
        "personalReminders",
        updatedData?.personalReminders?.toString() || ""
      );

      await setUserPermissions(data);
      handleNextStep();
    } catch (error) {
      console.error("Error occurred while submitting settings:", error);
      setBannerMessage(`${t("FetchErrorMessage")}`);
      setShowBanner(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-screen h-screen grid grid-rows-10 gap-1">
      <div className="h-full flex flex-col justify-end row-span-2 gap-1 pb-4">
        <Texts text={"white"} className="justify-end" size={"sm"}>
          {t("AcceptAllPermissions")}
        </Texts>
      </div>
      <div className="h-full row-span-8 flex flex-col bg-white border border-zinc-300 p-4 gap-4">
        <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />

        <div className=" h-full flex flex-col items-center gap-8">
          <Holds className="row-span-1">
            <Titles size={"h2"}>{t("RequiredForAppUse")}</Titles>
          </Holds>
          <Holds position={"row"}>
            <Holds size={"70"}>
              <Texts position={"left"}>{t("CameraAccess")}</Texts>
            </Holds>
            <Holds size={"30"}>
              <LocaleToggleSwitch
                data={updatedData?.cameraAccess || false}
                onChange={(value: boolean) => {
                  handleChange("cameraAccess", value);
                }}
              />
            </Holds>
          </Holds>
          <Holds position={"row"}>
            <Holds size={"70"}>
              <Texts position={"left"}>{t("LocationAccess")}</Texts>
            </Holds>
            <Holds size={"30"}>
              <LocaleToggleSwitch
                data={updatedData?.locationAccess || false}
                onChange={(value: boolean) => {
                  handleChange("locationAccess", value);
                }}
              />
            </Holds>
          </Holds>
          <Holds position={"row"}>
            <Holds size={"70"}>
              <Texts position={"left"}>{t("Cookies")}</Texts>
            </Holds>
            <Holds size={"30"}>
              <LocaleToggleSwitch
                data={updatedData?.cookiesAccess || false}
                onChange={handleAcceptCookies}
              />
            </Holds>
          </Holds>
        </div>
        <div>
          <Button
            size={"lg"}
            onClick={handleSubmitSettings}
            className="bg-app-dark-blue text-white rounded-lg p-2 w-full"
            disabled={isSubmitting} // Disable the button while submitting
          >
            <p>{isSubmitting ? `${t("Submitting")}` : `${t("Next")}`}</p>
          </Button>
        </div>
      </div>
    </div>
  );
}
