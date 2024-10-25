"use client";
import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import LocaleToggleSwitch from "@/components/(inputs)/toggleSwitch";
import { Holds } from "@/components/(reusable)/holds";
import { Buttons } from "@/components/(reusable)/buttons";
import { Titles } from "@/components/(reusable)/titles";
import "@/app/globals.css";
import { Texts } from "@/components/(reusable)/texts";
import { Modals } from "@/components/(reusable)/modals";
import { updateSettings } from "@/actions/hamburgerActions";
import { Contents } from "@/components/(reusable)/contents";
import { UserSettings } from "@/lib/types";
import { Grids } from "@/components/(reusable)/grids";
import Spinner from "@/components/(animations)/spinner";
import { useRouter } from "next/navigation";
import { z } from "zod"; // Import Zod for validation
import { Inputs } from "@/components/(reusable)/inputs";
import { Selects } from "@/components/(reusable)/selects";
import { setLocale } from "@/actions/cookieActions";

// Define Zod schema for UserSettings
const userSettingsSchema = z.object({
  approvedRequests: z.boolean().optional(),
  timeOffRequests: z.boolean().optional(),
  generalReminders: z.boolean().optional(),
  biometric: z.boolean().optional(),
  cameraAccess: z.boolean().optional(),
  locationAccess: z.boolean().optional(),
  language: z.string().optional(),
});

type Props = {
  id: string;
};

export default function Index({ id }: Props) {
  const router = useRouter();
  const t = useTranslations("Hamburger");
  const [data, setData] = useState<UserSettings | null>(null);
  const [updatedData, setUpdatedData] = useState<UserSettings | null>(null);
  const [initialData, setInitialData] = useState<UserSettings | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLangModalOpen, setIsLangModalOpen] = useState(false);

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
  }, []);

  // Automatically save settings when updated
  useEffect(() => {
    const saveChanges = async () => {
      if (updatedData && updatedData !== initialData) {
        setIsSaving(true);
        await updateSettings(updatedData);

        setTimeout(() => setIsSaving(false), 1000);
        setInitialData(updatedData);
      }
    };
    saveChanges();
  }, [updatedData]);

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

  // Handle setting changes
  const handleChange = (key: keyof UserSettings, value: boolean) => {
    setUpdatedData((prev) => (prev ? { ...prev, [key]: value } : null));
  };

  const handleSelectChange = (key: keyof UserSettings, value: string) => {
    setUpdatedData((prev) => (prev ? { ...prev, [key]: value } : null));
    setLocale(value === "en" ? false : true);
  };
  if (!data) {
    return (
      <Holds background={"white"} className="row-span-7 p-4 h-full">
        <Titles>{t("loading")}</Titles>
        <Spinner />
      </Holds>
    );
  }

  return (
    <>
      {isSaving && (
        <Holds
          background={"green"}
          className="h-fit text-center absolute top-[20%]"
        >
          {t("Saving")}
        </Holds>
      )}
      <Grids rows={"5"} gap={"3"}>
        {/*-------------------------Notifications Settings------------------------------*/}
        <Holds background={"white"} className="row-span-2 h-full py-4">
          <Contents width={"section"}>
            <Grids rows={"4"} gap={"5"}>
              <Holds className="row-span-1">
                <Titles>{t("Notifications")}</Titles>
              </Holds>
              <Holds position={"row"}>
                <Holds size={"70"}>
                  <Texts position={"left"}>{t("ApprovedRequests")}</Texts>
                </Holds>
                <Holds size={"30"}>
                  <LocaleToggleSwitch
                    data={updatedData?.approvedRequests || false}
                    onChange={(value: boolean) =>
                      handleChange("approvedRequests", value)
                    }
                  />
                </Holds>
              </Holds>
              <Holds position={"row"}>
                <Holds size={"70"}>
                  <Texts position={"left"}>{t("TimeOffRequests")}</Texts>
                </Holds>
                <Holds size={"30"}>
                  <LocaleToggleSwitch
                    data={updatedData?.timeOffRequests || false}
                    onChange={(value: boolean) =>
                      handleChange("timeOffRequests", value)
                    }
                  />
                </Holds>
              </Holds>
              <Holds position={"row"}>
                <Holds size={"70"}>
                  <Texts position={"left"}>{t("GeneralReminders")}</Texts>
                </Holds>
                <Holds size={"30"}>
                  <LocaleToggleSwitch
                    data={updatedData?.generalReminders || false}
                    onChange={(value: boolean) =>
                      handleChange("generalReminders", value)
                    }
                  />
                </Holds>
              </Holds>
            </Grids>
          </Contents>
        </Holds>

        {/*---------------------Security Settings------------------------------*/}
        <Holds background={"white"} className="row-span-2 h-full py-4">
          <Contents width={"section"}>
            <Grids rows={"4"} gap={"5"}>
              <Holds className="row-span-1">
                <Titles>{t("Security")}</Titles>
              </Holds>
              <Holds position={"row"}>
                <Holds size={"70"}>
                  <Texts position={"left"}>{t("Biometrics")}</Texts>
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
                  <Texts position={"left"}>{t("CameraAccess")}</Texts>
                </Holds>
                <Holds size={"30"}>
                  <LocaleToggleSwitch
                    data={updatedData?.cameraAccess || false}
                    onChange={(value: boolean) =>
                      handleChange("cameraAccess", value)
                    }
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
                    onChange={(value: boolean) =>
                      handleChange("locationAccess", value)
                    }
                  />
                </Holds>
              </Holds>
            </Grids>
          </Contents>
        </Holds>

        {/*---------------------Language Settings------------------------------*/}
        <Holds background={"white"} className="row-span-2 h-full py-4">
          <Contents width={"section"}>
            <Grids rows={"2"} gap={"5"}>
              <Holds className="row-span-1 ">
                <Titles>{t("Language")}</Titles>
              </Holds>
              <Holds className="row-span-1 mx-auto">
                <Inputs
                  readOnly
                  value={updatedData?.language === "en" ? "English" : "Spanish"}
                  data={updatedData?.language}
                  onClick={() => setIsLangModalOpen(true)}
                  className="bg-app-blue h-[2rem] w-1/2  mx-auto text-center"
                />
              </Holds>
            </Grids>
          </Contents>
        </Holds>

        {/* Language Selection Modal */}
        <Modals
          isOpen={isLangModalOpen}
          handleClose={() => setIsLangModalOpen(false)}
          size={"lg"}
          title="Language Selection"
          background={"default"}
        >
          <Holds size={"full"} className="h-[20rem]">
            <Contents width={"section"} className="h-full">
              <Selects
                value={updatedData?.language || "en"}
                onChange={(e) => handleSelectChange("language", e.target.value)}
              >
                <option value="default">Choose a Language</option>
                <option value="en">English</option>
                <option value="es">Spanish</option>
              </Selects>
            </Contents>
          </Holds>
        </Modals>

        {/*---------------------Change Password------------------------------*/}
        <Holds className="row-span-1 h-full">
          <Buttons
            onClick={() => router.push("/hamburger/changePassword")}
            background={"orange"}
          >
            <Titles>{t("ChangePassword")}</Titles>
          </Buttons>
        </Holds>
      </Grids>
    </>
  );
}
