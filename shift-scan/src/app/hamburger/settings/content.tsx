"use client";
import React, { useState, useEffect } from "react";
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

export default function Index({ data }: { data: UserSettings }) {
  const t = useTranslations("Hamburger");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updatedData, setUpdatedData] = useState(data);
  const [initialData, setInitialData] = useState(data);

  useEffect(() => {
    setInitialData(data); // Store initial data when component mounts
  }, [data]);

  const handleSave = async () => {
    await updateSettings(updatedData);
    setIsModalOpen(false);
  };

  const handleChange = (key: keyof UserSettings, value: boolean) => {
    setUpdatedData((prev) => ({ ...prev, [key]: value }));
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setUpdatedData(initialData); // Revert to initial state on cancel
    setIsModalOpen(false);
  };

  return (
    <>
      <Bases>
        <Contents>
          <Grids size={"settings"}>
            <Holds 
            background={"white"}
            className="row-span-1 h-full">
              <TitleBoxes
              title={t("Title")}
              titleImg="/Settings.svg"
              titleImgAlt="Settings"
              variant={"default"}
              size={"default"}
              />
            </Holds>
            <Holds 
            background={"white"}
            className="row-span-2 h-full">
              <Titles>{t("Notifications")}</Titles>
              <Holds position={"row"}>
                <Holds size={"70"}>
                  <Texts position={"left"}>{t("ApprovedRequests")}</Texts>
                </Holds>
                <Holds size={"30"}>
                    <LocaleToggleSwitch
                      data={updatedData.approvedRequests || false}
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
                    data={updatedData.timeOffRequests || false}
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
                    data={updatedData.generalReminders || false}
                    onChange={(value: boolean) =>
                      handleChange("generalReminders", value)
                    }
                  />
                </Holds>
              </Holds>
            </Holds>

            <Holds 
            background={"white"} 
            className="row-span-2">
              <Titles>{t("Security")}</Titles>
              <Holds position={"row"}>
                <Holds size={"70"}>
                  <Texts position={"left"}>{t("Biometrics")}</Texts>
                </Holds>
                <Holds size={"30"}>
                  <LocaleToggleSwitch
                    data={updatedData.biometric || false}
                    onChange={(value: boolean) => handleChange("biometric", value)}
                  />
                </Holds>
              </Holds>
              <Holds position={"row"}>
                <Holds size={"70"}>
                  <Texts position={"left"}>{t("CameraAccess")}</Texts>
                </Holds>
                <Holds size={"30"}>
                  <LocaleToggleSwitch
                    data={updatedData.cameraAccess || false}
                    onChange={(value: boolean) => handleChange("cameraAccess", value)}
                  />
                </Holds>
              </Holds>
              <Holds position={"row"}>
                <Holds size={"70"}>
                  <Texts position={"left"}>{t("LocationAccess")}</Texts>
                </Holds>
                <Holds size={"30"}>
                  <LocaleToggleSwitch
                    data={updatedData.LocationAccess || false}
                    onChange={(value: boolean) =>
                      handleChange("LocationAccess", value)
                    }
                  />
                </Holds>
              </Holds>
            </Holds>
            <Holds 
            className="row-span-1">
            <Buttons
            onClick={() => setIsModalOpen(true)}
            background={"orange"}>
              <Titles>{t("ChangePassword")}</Titles>
            </Buttons>
            </Holds>
          </Grids>
        </Contents>
      </Bases>

      <Modals isOpen={isModalOpen} handleClose={handleCancel} size="clock">
        <Holds>
          <h2>{t("SaveChanges")}</h2>
          <Buttons onClick={handleSave} background={"green"}>
            <Titles>{t("Yes")}</Titles>
          </Buttons>
          <Buttons onClick={handleCancel} background={"red"}>
            <Titles>{t("Cancel")}</Titles>
          </Buttons>
        </Holds>
      </Modals>
    </>
  );
}
