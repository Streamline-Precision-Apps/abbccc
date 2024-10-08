"use client";
import React, { useState, useEffect, use } from "react";
import { useTranslations } from "next-intl";
import LocaleToggleSwitch from "@/components/(inputs)/toggleSwitch";
import { Holds } from "@/components/(reusable)/holds";
import { Buttons } from "@/components/(reusable)/buttons";
import { Titles } from "@/components/(reusable)/titles";
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";
import { Bases } from "@/components/(reusable)/bases";
import "@/app/globals.css";
import { Images } from "@/components/(reusable)/images";
import { Texts } from "@/components/(reusable)/texts";
import { Modals } from "@/components/(reusable)/modals";
import { updateSettings } from "@/actions/hamburgerActions";
import { Contents } from "@/components/(reusable)/contents";
import { UserSettings } from "@/lib/types";
import { Grids } from "@/components/(reusable)/grids";
import { Content } from "next/font/google";
import Spinner from "@/components/(animations)/spinner";
import { useRouter } from "next/navigation";

export default function Index() {
  const router = useRouter();
  const t = useTranslations("Hamburger");
  const [data, setData] = useState<UserSettings | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updatedData, setUpdatedData] = useState<UserSettings | null>(null);
  const [initialData, setInitialData] = useState<UserSettings | null>(null);

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/getSettings");
        if (response.ok) {
          const settings = await response.json();
          setData(settings);
          setUpdatedData(settings);
          setInitialData(settings); // Store initial data
        } else {
          console.error("Failed to fetch settings", response.statusText);
        }
      } catch (error) {
        console.error("Error occurred while fetching settings:", error);
      }
    };
    fetchData();
  }, []); // Dependency array to ensure it runs once

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

  if (!data)
    return (
      <>
        <Holds background={"white"} className="row-span-7 p-4 h-full">
          <Titles>{t("loading")}</Titles>
          <Spinner />
        </Holds>
      </>
    );

  return (
    <>
      {/* Render UI elements with toggles and modals */}
      <Grids rows={"5"} gap={"3"} className="">
        <Holds background={"white"} className="row-span-2 h-full py-4">
          {/*-------------------------Approved Requests------------------------------*/}
          <Contents width={"section"}>
            <Grids rows={"4"} gap={"5"}>
              <Holds className="row-span-1 ">
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
            {/*---------------------end of notifications------------------------------*/}
          </Contents>
        </Holds>

        {/*---------------------Start of security------------------------------*/}
        <Holds background={"white"} className="row-span-2 h-full py-4">
          <Contents width={"section"}>
            <Grids rows={"4"} gap={"5"}>
              <Holds className="row-span-1 ">
                <Titles>{t("Security")}</Titles>
              </Holds>
              <Holds position={"row"} className="row-span-1">
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
              <Holds position={"row"} className="row-span-1">
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
              <Holds position={"row"} className="row-span-1">
                <Holds size={"70"}>
                  <Texts position={"left"}>{t("locationAccess")}</Texts>
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
            {/*---------------------End of security------------------------------*/}
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
        {/*---------------------Change Password------------------------------*/}

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
