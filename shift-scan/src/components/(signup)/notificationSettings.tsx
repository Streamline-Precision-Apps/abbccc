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

type prop = {
  userId: string;
  handleNextStep: () => void;
}

export default function NotificationSettings({userId, handleNextStep}: prop) {
  console.log(userId);
  const t = useTranslations("SignUpPermissions");
  const [showBanner, setShowBanner] = useState(false);
  const [bannerMessage, setBannerMessage] = useState("");
  const [updatedData, setUpdatedData] = useState<UserSettings | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isRequiredAcessed, setIsRequiredAcessed] = useState(false);

  const handleChange = (key: keyof UserSettings, value: boolean) => {
    setUpdatedData((prev) => (prev ? { ...prev, [key]: value } : null));
  };

  const handleYesToAll = () => {
    setUpdatedData ((prev) => (prev ? { ...prev,
      ["approvedRequests"]: true,
      ["timeOffRequests"]: true,
      ["generalReminders"]: true,
      ["biometric"]: true,
      ["cameraAccess"]: true,
      ["locationAccess"]: true,
    } : null));
  }

  useEffect(() => {
    if (showBanner) {
      const timer = setTimeout(() => {
        setShowBanner(false);
      }, 8000); // Banner disappears after 5 seconds

      return () => clearTimeout(timer); // Clear the timeout if the component unmounts
    }
  }, [showBanner]);

  // Fetch data on component mount
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
    if (updatedData?.cameraAccess === true && updatedData?.locationAccess === true && updatedData?.cookiesAccess === true) {
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
      const data = new FormData();
      data.append("id", userId);
      data.append("biometrics", updatedData?.biometric?.toString() || "");
      data.append("cameraAccess", updatedData?.cameraAccess?.toString() || "");
      data.append("locationAccess", updatedData?.locationAccess?.toString() || "");
      data.append("cookiesAccess", updatedData?.cookiesAccess?.toString() || "");
      data.append("generalReminders", updatedData?.generalReminders?.toString() || "");
      data.append("approvedRequests", updatedData?.approvedRequests?.toString() || "");
      data.append("timeOffRequests", updatedData?.timeOffRequests?.toString() || "");
      data.append("photoAlbumAccess", updatedData?.photoAlbumAccess?.toString() || "");

      await setUserPermissions(data);
      handleNextStep();
  } catch (error) {
    console.error("Error occurred while fetching settings:", error);
    setBannerMessage(`${t("FetchErrorMessage")}`);
    setShowBanner(true);
  } finally {
    setIsSubmitting(false);
  }
}

  return (
    <>
    {/* Show the banner at the top of the page */}
    {showBanner && (
        <Holds
        style={{ position: "fixed", top: 0, width: "100%", zIndex: 1000 }}
        >
          <Banners background={"red"}>
            <Texts size={"p6"}>{bannerMessage}</Texts>
          </Banners>
        </Holds>
      )}
    <Grids rows={"10"} gap={"5"} className="mb-5">
      <Holds background={"white"} className="row-span-1 h-full justify-center">
        <Titles size={"h1"}>{t("GiveUsAccess")}</Titles>
      </Holds>
      <Holds background={"white"} className="row-span-1 h-full justify-center">
        <Buttons onClick={() => handleYesToAll()}>
          <Texts size={"p3"} >{t("YesToEverything")}</Texts>
        </Buttons>
      </Holds>
      <Holds background={"white"} className="row-span-7 h-full">
          <Contents width={"section"}>
            <Grids rows={"4"} gap={"0"}>
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
                      handleChange("locationAccess", value)
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
                    data={false}
                    onChange={(value: boolean) => {
                      handleChange("cookiesAccess", value)
                    }}
                  />
                </Holds>
              </Holds>
            </Grids>
          </Contents>
          {/* ------------------------------------------------------------- */}
          <Contents width={"section"} className="mb-2">
            <Grids rows={"4"} gap={"0"}>
              <Holds className="row-span-1">
                <Titles size={"h2"}>{t("OptionalButVeryHelpful")}</Titles>
              </Holds>
              <Holds position={"row"}>
                <Holds size={"70"}>
                  <Texts position={"left"}>{t("BiometricsLogin")}</Texts>
                </Holds>
                <Holds size={"30"}>
                  <LocaleToggleSwitch
                    data={updatedData?.biometric || false}
                    onChange={(value: boolean) =>
                      handleChange("biometric", value)
                    }
                  />
                </Holds>
              </Holds>
              <Holds position={"row"}>
                <Holds size={"70"}>
                  <Texts position={"left"}>{t("Notifications")}</Texts>
                </Holds>
                <Holds size={"30"}>
                  <LocaleToggleSwitch
                    data={updatedData?.approvedRequests || false}
                    onChange={(value: boolean) =>{
                      handleChange("approvedRequests", value);
                      handleChange("timeOffRequests", value);
                      handleChange("generalReminders", value);}
                    }
                  />
                </Holds>
              </Holds>
              <Holds position={"row"}>
                <Holds size={"70"}>
                  <Texts position={"left"}>{t("PhotoAlbum")}</Texts>
                </Holds>
                <Holds size={"30"}>
                  <LocaleToggleSwitch
                    data={false}
                    onChange={(value: boolean) =>
                      handleChange("photoAlbumAccess", value)
                    }
                  />
                </Holds>
              </Holds>
            </Grids>
          </Contents>
      </Holds>
      <Holds className="row-span-1 h-full">
        <Buttons 
        background={isRequiredAcessed ? "orange" : "darkGrey"} 
        onClick={handleSubmitSettings}
        disabled={isSubmitting}
        >
          <Titles size={"h2"}>
            {isSubmitting ? `${t("Submitting")}` : `${t("Next")}`}
          </Titles>
        </Buttons>
      </Holds>
    </Grids>
    </>
  )};