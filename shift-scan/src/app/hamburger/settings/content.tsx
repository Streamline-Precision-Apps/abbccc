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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updatedData, setUpdatedData] = useState<UserSettings | null>(null);
  const [initialData, setInitialData] = useState<UserSettings | null>(null);

  // Fetch data on component mount
  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/getSettings");
        if (response.ok) {
          const settings = await response.json();

          // Validate the fetched data using Zod
          const validatedSettings = userSettingsSchema.parse(settings);

          // Add the userId property to the validatedSettings object
          const userId = id; // Replace "your_user_id_here" with the actual user ID
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

  // Handle save function for updating settings
  const handleSave = async () => {
    if (updatedData) {
      await updateSettings(updatedData);
      setIsModalOpen(false);
    }
  };

  // Handle setting changes
  const handleChange = (key: keyof UserSettings, value: boolean) => {
    setUpdatedData((prev) => (prev ? { ...prev, [key]: value } : null));
    setIsModalOpen(true);
  };

  // Handle cancel to revert changes
  const handleCancel = () => {
    setUpdatedData(initialData);
    setIsModalOpen(false);
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
      {/* Render UI elements with toggles and modals */}
      <Grids rows={"5"} gap={"3"}>
        <Holds background={"white"} className="row-span-2 h-full py-4">
          {/*-------------------------Approved Requests------------------------------*/}
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
              {/*----------------------Time Off Requests--------------------------------*/}
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
              {/*----------------------General Reminders--------------------------------*/}
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

        {/*---------------------Start of security------------------------------*/}
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

        {/*---------------------Start of language------------------------------*/}
        <Holds background={"white"} className="row-span-2 h-full py-4">
          <Contents width={"section"}>
            <Grids rows={"4"} gap={"5"}>
              <Holds className="row-span-1">
                <Titles>{t("Language")}</Titles>
              </Holds>
              <Holds position={"row"}>
                <Holds size={"70"}>
                  <Texts position={"left"}>{t("English")}</Texts>
                </Holds>
                <Holds size={"30"}>
                  <LocaleToggleSwitch
                    data={updatedData?.language === "en" || false}
                    onChange={(value: boolean) =>
                      handleChange("language", value)
                    }
                  />
                </Holds>
                <Holds size={"70"}>
                  <Texts position={"right"}>{t("Spanish")}</Texts>
                </Holds>
              </Holds>
            </Grids>
          </Contents>
        </Holds>

        {/*---------------------Change Password------------------------------*/}
        <Holds className="row-span-1 h-full">
          <Buttons
            onClick={() => router.push("/hamburger/changePassword")}
            background={"orange"}
          >
            <Titles>{t("ChangePassword")}</Titles>
          </Buttons>
        </Holds>

        {/* Modal for confirming save changes */}
        <Modals isOpen={isModalOpen} handleClose={handleCancel} size="sm">
          <Holds size={"full"} background={"white"}>
            <Holds size={"full"} className="p-3 py-5 justify-center">
              <Texts size={"p4"}>{t("SaveChanges")}</Texts>
            </Holds>
            <Holds
              size={"full"}
              position={"row"}
              background={"white"}
              className="justify-between p-3"
            >
              <Buttons onClick={handleSave} background={"green"} size={"40"}>
                <Titles>{t("Yes")}</Titles>
              </Buttons>
              <Buttons onClick={handleCancel} background={"red"} size={"40"}>
                <Titles>{t("Cancel")}</Titles>
              </Buttons>
            </Holds>
          </Holds>
        </Modals>
      </Grids>
    </>
  );
}
