"use client";
import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import LocaleToggleSwitch from "@/components/(inputs)/toggleSwitch";
import { Holds } from "@/components/(reusable)/holds";
import { Buttons } from "@/components/(reusable)/buttons";
import SwitchWithLabel from "@/components/(inputs)/switchWithLabel";
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
    <div>
      <Bases>
        <Holds size={"titleBox"}>
          <TitleBoxes
            title={t("Title")}
            titleImg="/Settings.svg"
            titleImgAlt="Settings"
            variant={"default"}
            size={"default"}
          />
        </Holds>

        <Holds size={"dynamic"}>
          <Titles>{t("Notifications")}</Titles>
          <SwitchWithLabel>
            <Texts size={"left"}>{t("ApprovedRequests")}</Texts>
            <LocaleToggleSwitch
              data={updatedData.approvedRequests || false}
              onChange={(value: boolean) =>
                handleChange("approvedRequests", value)
              }
            />
          </SwitchWithLabel>
          <SwitchWithLabel>
            <Texts>{t("TimeOffRequests")}</Texts>
            <LocaleToggleSwitch
              data={updatedData.timeOffRequests || false}
              onChange={(value: boolean) =>
                handleChange("timeOffRequests", value)
              }
            />
          </SwitchWithLabel>
          <SwitchWithLabel>
            <Texts>{t("GeneralReminders")}</Texts>
            <LocaleToggleSwitch
              data={updatedData.generalReminders || false}
              onChange={(value: boolean) =>
                handleChange("generalReminders", value)
              }
            />
          </SwitchWithLabel>
        </Holds>

        <Holds size={"dynamic"}>
          <Titles>{t("Security")}</Titles>
          <SwitchWithLabel>
            <Texts>{t("Biometrics")}</Texts>
            <LocaleToggleSwitch
              data={updatedData.biometric || false}
              onChange={(value: boolean) => handleChange("biometric", value)}
            />
          </SwitchWithLabel>
          <SwitchWithLabel>
            <Texts>{t("CameraAccess")}</Texts>
            <LocaleToggleSwitch
              data={updatedData.cameraAccess || false}
              onChange={(value: boolean) => handleChange("cameraAccess", value)}
            />
          </SwitchWithLabel>
          <SwitchWithLabel>
            <Texts>{t("LocationAccess")}</Texts>
            <LocaleToggleSwitch
              data={updatedData.LocationAccess || false}
              onChange={(value: boolean) =>
                handleChange("LocationAccess", value)
              }
            />
          </SwitchWithLabel>
        </Holds>

        <Buttons
          onClick={() => setIsModalOpen(true)}
          variant={"orange"}
          size={null}
        >
          <Titles>{t("ChangePassword")}</Titles>
        </Buttons>
      </Bases>

      <Modals isOpen={isModalOpen} handleClose={handleCancel} size="clock">
        <Holds size={"dynamic"} className="p-4">
          <h2>{t("SaveChanges")}</h2>
          <Buttons onClick={handleSave} variant={"green"} size={null}>
            <Titles>{t("Yes")}</Titles>
          </Buttons>
          <Buttons onClick={handleCancel} variant={"red"} size={null}>
            <Titles>{t("Cancel")}</Titles>
          </Buttons>
        </Holds>
      </Modals>
    </div>
  );
}
