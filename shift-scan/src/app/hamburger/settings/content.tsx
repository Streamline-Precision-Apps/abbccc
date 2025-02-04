"use client";
import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import LocaleToggleSwitch from "@/components/(inputs)/toggleSwitch";
import { Holds } from "@/components/(reusable)/holds";
import { Buttons } from "@/components/(reusable)/buttons";
import { Titles } from "@/components/(reusable)/titles";
import "@/app/globals.css";
import { Texts } from "@/components/(reusable)/texts";
import { updateSettings } from "@/actions/hamburgerActions";
import { Contents } from "@/components/(reusable)/contents";
import { UserSettings } from "@/lib/types";
import { Grids } from "@/components/(reusable)/grids";
import Spinner from "@/components/(animations)/spinner";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { Inputs } from "@/components/(reusable)/inputs";
import { NModals } from "@/components/(reusable)/newmodals";
import LanguageModal from "@/app/(routes)/admins/_pages/sidebar/LanguageModal";

// Define Zod schema for UserSettings
const userSettingsSchema = z.object({
  personalReminders: z.boolean().optional(),
  generalReminders: z.boolean().optional(),
  cameraAccess: z.boolean().optional(),
  locationAccess: z.boolean().optional(),
  language: z.string().optional(),
});

type Props = {
  id: string;
};

export default function SettingSelections({ id }: Props) {
  const router = useRouter();
  const t = useTranslations("Hamburger");
  const [data, setData] = useState<UserSettings | null>(null);
  const [updatedData, setUpdatedData] = useState<UserSettings | null>(null);
  const [initialData, setInitialData] = useState<UserSettings | null>(null);
  // const [isSaving, setIsSaving] = useState(false);
  const [isLangModalOpen, setIsLangModalOpen] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [bannerMessage, setBannerMessage] = useState("");

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/getSettings");
        if (response.ok) {
          const settings = await response.json();
          const validatedSettings = userSettingsSchema.parse(settings);

          const userId = id;
          const updatedSettings = { ...validatedSettings, userId };

          setData(updatedSettings);
          setUpdatedData(updatedSettings);
          setInitialData(updatedSettings); // Store initial data
        } else {
          console.error("Failed to fetch settings", response.statusText);
        }
      } catch (error) {
        console.error("Error occurred while fetching settings:", error);
      }
    };
    fetchData();
  }, [id, isLangModalOpen]);

  // Automatically save settings when updated
  useEffect(() => {
    const saveChanges = async () => {
      if (updatedData && updatedData !== initialData) {
        // setIsSaving(true);
        await updateSettings(updatedData);
        // setTimeout(() => setIsSaving(false), 1000);
        setInitialData(updatedData);
      }
    };
    saveChanges();
  }, [updatedData, initialData]);

  // Save settings before user navigates away from the page
  useEffect(() => {
    const handleBeforeUnload = async () => {
      if (updatedData && updatedData !== initialData) {
        await updateSettings(updatedData);
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [updatedData, initialData]);

  // Helper function: update permission setting in state
  const handleChange = (key: keyof UserSettings, value: boolean) => {
    setUpdatedData((prev) => (prev ? { ...prev, [key]: value } : null));
  };

  // --- Updated toggles with permission requests ---

  // CameraAccess toggle: request permission when turned on
  const handleCameraAccessChange = (value: boolean) => {
    if (value) {
      // Request camera permission
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then(() => {
          handleChange("cameraAccess", true);
        })
        .catch(() => {
          setBannerMessage("Camera permission denied by the browser.");
          setShowBanner(true);
          handleChange("cameraAccess", false);
        });
    } else {
      // When turning off, simply update the state.
      handleChange("cameraAccess", false);
    }
  };

  // LocationAccess toggle: request permission when turned on
  const handleLocationAccessChange = (value: boolean) => {
    if (value) {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          () => {
            handleChange("locationAccess", true);
          },
          () => {
            setBannerMessage("Location permission denied by the browser.");
            setShowBanner(true);
            handleChange("locationAccess", false);
          }
        );
      } else {
        setBannerMessage("Geolocation is not supported by your browser.");
        setShowBanner(true);
        handleChange("locationAccess", false);
      }
    } else {
      handleChange("locationAccess", false);
    }
  };

  if (!data) {
    return (
      <>
        <Holds
          background="white"
          className="row-span-7 p-4 h-full justify-center items-center animate-pulse"
        >
          <Spinner />
        </Holds>
        <Holds className="row-span-1">
          <Buttons
            onClick={() => router.push("/hamburger/changePassword")}
            background="orange"
            className="py-2"
          >
            <Titles>{t("ChangePassword")}</Titles>
          </Buttons>
        </Holds>
      </>
    );
  }

  return (
    <>
      {/* Banner for error/feedback */}
      {showBanner && (
        <Holds
          style={{ position: "fixed", top: 0, width: "100%", zIndex: 1000 }}
        >
          <Buttons onClick={() => setShowBanner(false)} background="red">
            <Texts size="p6">{bannerMessage}</Texts>
          </Buttons>
        </Holds>
      )}
      <Holds className="row-span-7 h-full p-4">
        <Grids rows="5" gap="3">
          {/*-------------------------Notifications Settings------------------------------*/}
          <Holds background="white" className="row-span-1 h-full py-4">
            <Contents width="section">
              <Grids rows="1" gap="5">
                <Holds position="row">
                  <Holds size="70">
                    <Texts position="left">{t("GeneralReminders")}</Texts>
                  </Holds>
                  <Holds size="30">
                    <LocaleToggleSwitch
                      data={updatedData?.generalReminders || false}
                      onChange={(value: boolean) => {
                        handleChange("generalReminders", value);
                      }}
                    />
                  </Holds>
                </Holds>
              </Grids>
            </Contents>
          </Holds>

          <Holds background="white" className="row-span-1 h-full py-4">
            <Contents width="section">
              <Grids rows="1" gap="5">
                <Holds position="row">
                  <Holds size="70">
                    <Texts position="left">{t("PersonalReminders")}</Texts>
                  </Holds>
                  <Holds size="30">
                    <LocaleToggleSwitch
                      data={updatedData?.personalReminders || false}
                      onChange={(value: boolean) => {
                        handleChange("personalReminders", value);
                      }}
                    />
                  </Holds>
                </Holds>
              </Grids>
            </Contents>
          </Holds>

          {/*-------------------------App Usage settings------------------------------*/}
          <Holds background="white" className="row-span-1 h-full py-4">
            <Contents width="section">
              <Grids rows="1" gap="5">
                <Holds position="row">
                  <Holds size="70">
                    <Texts position="left">{t("CameraAccess")}</Texts>
                  </Holds>
                  <Holds size="30">
                    <LocaleToggleSwitch
                      data={updatedData?.cameraAccess || false}
                      onChange={handleCameraAccessChange}
                    />
                  </Holds>
                </Holds>
              </Grids>
            </Contents>
          </Holds>
          <Holds background="white" className="row-span-1 h-full py-4">
            <Contents width="section">
              <Grids rows="1" gap="5">
                <Holds position="row">
                  <Holds size="70">
                    <Texts position="left">{t("LocationAccess")}</Texts>
                  </Holds>
                  <Holds size="30">
                    <LocaleToggleSwitch
                      data={updatedData?.locationAccess || false}
                      onChange={handleLocationAccessChange}
                    />
                  </Holds>
                </Holds>
              </Grids>
            </Contents>
          </Holds>

          {/*---------------------Language Settings------------------------------*/}
          <Holds background="white" className="row-span-1 h-full py-4">
            <Contents width="section">
              <Grids rows="1" gap="5">
                <Holds className="row-span-1">
                  <Titles>{t("Language")}</Titles>
                </Holds>
                <Holds className="row-span-1 mx-auto">
                  <Inputs
                    readOnly
                    value={
                      updatedData?.language === "en" ? "English" : "Español"
                    }
                    data={updatedData?.language}
                    onClick={() => setIsLangModalOpen(true)}
                    className="bg-app-blue h-[2rem] w-1/2 mx-auto text-center"
                  />
                </Holds>
              </Grids>
            </Contents>
          </Holds>

          {/* Language Selection Modal */}
          <NModals
            size="xl"
            isOpen={isLangModalOpen}
            handleClose={() => setIsLangModalOpen(false)}
          >
            <LanguageModal
              setIsOpenLanguageSelector={() => setIsLangModalOpen(false)}
            />
          </NModals>
        </Grids>
      </Holds>

      {/*---------------------Change Password------------------------------*/}
      <Holds className="row-span-1 h-full">
        <Buttons
          onClick={() => router.push("/hamburger/changePassword")}
          background="orange"
          className="py-2"
        >
          <Titles>{t("ChangePassword")}</Titles>
        </Buttons>
      </Holds>
    </>
  );
}
