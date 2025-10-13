"use client";
import React, { useEffect, useState } from "react";
import { Holds } from "../(reusable)/holds";
import { Texts } from "../(reusable)/texts";
import { Buttons } from "../(reusable)/buttons";
import { Grids } from "../(reusable)/grids";
import { Titles } from "../(reusable)/titles";
import LocaleToggleSwitch from "../(inputs)/toggleSwitch";
import { Contents } from "../(reusable)/contents";
import { useTranslations } from "next-intl";
import { Banners } from "../(reusable)/banners";
import { setUserPermissions } from "@/actions/userActions";
import { ProgressBar } from "./progressBar";
import { Button } from "../ui/button";
import { usePermissions } from "@/app/context/PermissionsContext";

type UserSettings = {
  userId: string;
  language?: string;
  personalReminders?: boolean;
  generalReminders?: boolean;
  cameraAccess?: boolean;
  locationAccess?: boolean;
  cookiesAccess?: boolean;
};

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
  const { requestCameraPermission, requestLocationPermission } =
    usePermissions();

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
        : null,
    );
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
        updatedData?.locationAccess?.toString() || "",
      );
      data.append(
        "cookiesAccess",
        updatedData?.cookiesAccess?.toString() || "",
      );
      data.append(
        "generalReminders",
        updatedData?.generalReminders?.toString() || "",
      );
      data.append(
        "personalReminders",
        updatedData?.personalReminders?.toString() || "",
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
    <div className="h-dvh w-full flex flex-col">
      <div className="w-full h-[10%] flex flex-col justify-end py-3">
        <Texts text={"white"} className="justify-end" size={"sm"}>
          {t("AcceptAllPermissions")}
        </Texts>
      </div>
      <div className="bg-white w-full h-[40px] border border-slate-200 flex flex-col justify-center gap-1">
        <div className="w-[95%] max-w-[600px] mx-auto">
          <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto no-scrollbar bg-white pb-[200px]">
        <div className="max-w-[600px] w-[95%] p-4 px-2 flex flex-col mx-auto gap-4">
          <div className=" h-full max-h-[50vh] flex flex-col items-center gap-8">
            <div>
              <Titles size={"h5"}>{t("RequiredForAppUse")}</Titles>
            </div>
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
        </div>
      </div>
      <div className="w-full h-[10%] bg-white border-t border-slate-200 px-4 py-2">
        <Button
          size={"lg"}
          onClick={handleSubmitSettings}
          className={`${isRequiredAcessed ? "bg-app-dark-blue" : "bg-gray-300 "} text-white rounded-lg p-2 w-full`}
          disabled={isSubmitting} // Disable the button while submitting
        >
          <p>{isSubmitting ? `${t("Submitting")}` : `${t("Next")}`}</p>
        </Button>
      </div>
    </div>
  );
}
