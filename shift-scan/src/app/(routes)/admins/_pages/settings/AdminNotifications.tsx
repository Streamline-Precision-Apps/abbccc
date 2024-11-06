import { setLocale } from "@/actions/cookieActions";
import { updateSettings } from "@/actions/hamburgerActions";
import Spinner from "@/components/(animations)/spinner";
import LocaleToggleSwitch from "@/components/(inputs)/toggleSwitch";
import { Buttons } from "@/components/(reusable)/buttons";
import { Contents } from "@/components/(reusable)/contents";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Inputs } from "@/components/(reusable)/inputs";
import { Modals } from "@/components/(reusable)/modals";
import { Selects } from "@/components/(reusable)/selects";
import { Texts } from "@/components/(reusable)/texts";
import { Titles } from "@/components/(reusable)/titles";
import { UserSettings } from "@/lib/types";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { z } from "zod";

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

export const AdminNotifications = ({ id }: { id: string }) => {
  const router = useRouter();
  const t = useTranslations("Hamburger");

  const [data, setData] = useState<UserSettings | null>(null);
  const [updatedData, setUpdatedData] = useState<UserSettings | null>(null);
  const [initialData, setInitialData] = useState<UserSettings | null>(null);
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
        await updateSettings(updatedData);
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
    <Holds className="h-full w-full ">
      <Titles size={"h4"} className="my-1">
        {t("Title")}
      </Titles>
      <Grids rows={"5"}>
        {/*-------------------------Notifications Settings------------------------------*/}
        <Holds background={"white"} className="row-span-3 ">
          <Contents width={"section"}>
            <Holds className="gap-2">
              <Holds position={"row"}>
                <Holds size={"70"}>
                  <Texts position={"left"} size={"p6"}>
                    {t("GeneralReminders")}
                  </Texts>
                </Holds>
                <Holds size={"30"}>
                  <LocaleToggleSwitch
                    data={updatedData?.generalReminders || false}
                    onChange={(value: boolean) => {
                      handleChange("generalReminders", value);
                      handleChange("timeOffRequests", value);
                      handleChange("approvedRequests", value);
                    }}
                  />
                </Holds>
              </Holds>

              <Holds position={"row"}>
                <Holds size={"70"}>
                  <Texts position={"left"} size={"p6"}>
                    {t("CameraAccess")}
                  </Texts>
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
                  <Texts position={"left"} size={"p6"}>
                    {t("LocationAccess")}
                  </Texts>
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

              {/*-------------------------Language Settings------------------------------*/}

              <Holds position={"row"} className=" w-full my-auto">
                <Holds position={"left"} className="w-1/2">
                  <Texts position={"left"} size={"p5"}>
                    {t("Language")}
                  </Texts>
                </Holds>
                <Holds position={"right"} className="w-1/2 flex justify-end">
                  <Inputs
                    readOnly
                    value={
                      updatedData?.language === "en" ? "English" : "Spanish"
                    }
                    data={updatedData?.language}
                    onClick={() => setIsLangModalOpen(true)}
                    className="bg-app-blue h-[2rem]  text-center cursor-pointer"
                  />
                </Holds>
              </Holds>
            </Holds>
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
        <Holds className="row-span-2 h-full">
          <Buttons
            onClick={() => router.push("/hamburger/changePassword")}
            background={"orange"}
            size={"80"}
            className=" my-auto"
          >
            <Titles size={"h4"}>{t("ChangePassword")}</Titles>
          </Buttons>
        </Holds>
      </Grids>
    </Holds>
  );
};
