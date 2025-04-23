"use client";
import React, {
  useState,
  ChangeEvent,
  SetStateAction,
  Dispatch,
  useEffect,
} from "react";
import { useTranslations } from "next-intl";
import LocaleToggleSwitch from "@/components/(inputs)/toggleSwitch";
import { Holds } from "@/components/(reusable)/holds";
import { Buttons } from "@/components/(reusable)/buttons";
import { Titles } from "@/components/(reusable)/titles";
import "@/app/globals.css";
import { Texts } from "@/components/(reusable)/texts";
import { Contents } from "@/components/(reusable)/contents";
import { UserSettings } from "@/lib/types";
import { Grids } from "@/components/(reusable)/grids";
import Spinner from "@/components/(animations)/spinner";
import { useRouter } from "next/navigation";
import { NModals } from "@/components/(reusable)/newmodals";
import LanguageModal from "@/app/(routes)/admins/_pages/sidebar/LanguageModal";
import { Selects } from "@/components/(reusable)/selects";
import { setLocale } from "@/actions/cookieActions";

type Props = {
  id: string;
  setData: Dispatch<SetStateAction<UserSettings | null>>;
  data: UserSettings | null;
  updatedData: UserSettings | null;
  setUpdatedData: Dispatch<SetStateAction<UserSettings | null>>;
  handleChange: (key: keyof UserSettings, value: boolean) => void;
  handleLanguageChange: (key: keyof UserSettings, value: string) => void;
  handleCameraAccessChange: (value: boolean) => void;
  handleLocationAccessChange: (value: boolean) => void;
};

export default function SettingSelections({
  id,
  handleLanguageChange,
  data,
  updatedData,
  handleChange,
  handleCameraAccessChange,
  handleLocationAccessChange,
}: Props) {
  const router = useRouter();
  const t = useTranslations("Hamburger");
  const [language, setLanguage] = useState<string>();
  const [isLangModalOpen, setIsLangModalOpen] = useState(false);
  useEffect(() => {
    if (!data?.language) return;
    setLanguage(data.language);
  }, [data]);

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
    <Grids>
      <Holds className="row-span-7 h-full p-4">
        <Grids rows="5" gap="3">
          {/*---------------------Language Settings------------------------------*/}
          <Holds background="white" className="row-span-1 h-full py-4">
            <Selects
              value={language} // Use `language` state
              onChange={(event: ChangeEvent<HTMLSelectElement>) => {
                handleLanguageChange("language", event.target.value);
                const formData = new FormData();
                formData.append("id", id);
                formData.append("language", event.target.value);
                setLanguage(event.target.value);
                setLocale(event.target.value === "es");
              }}
            >
              <option value="en">English</option>
              <option value="es">Español</option>
            </Selects>
          </Holds>

          {/*-------------------------Notifications Settings------------------------------*/}
          <Holds background="white" className="row-span-1 h-full py-4">
            <Contents width="section">
              <Grids rows="1" gap="5">
                <Holds position="row">
                  <Holds size="70">
                    <Texts size={"p4"} position="left">
                      {t("GeneralReminders")}
                    </Texts>
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
                    <Texts size={"p4"} position="left">
                      {t("PersonalReminders")}
                    </Texts>
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
                    <Texts size={"p4"} position="left">
                      {t("CameraAccess")}
                    </Texts>
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
                    <Texts size={"p4"} position="left">
                      {t("LocationAccess")}
                    </Texts>
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
      <Holds className="row-span-1 h-full p-4">
        <Buttons
          onClick={() => router.push("/hamburger/changePassword")}
          background="orange"
          className="py-2"
        >
          <Titles size={"h4"}>{t("ChangePassword")}</Titles>
        </Buttons>
      </Holds>
    </Grids>
  );
}
