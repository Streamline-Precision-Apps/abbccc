"use client";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Titles } from "@/components/(reusable)/titles";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import AccountInformation from "./accountInformation";
import ProfileImageEditor from "@/app/(routes)/hamburger/profile/ProfileImageEditor";
import { NewTab } from "@/components/(reusable)/newTabs";
import SettingSelections from "./SettingSelections";
import { UserSettings } from "@/lib/types";
import { updateSettings } from "@/actions/hamburgerActions";
import { z } from "zod";
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";

// Define Zod schema for UserSettings
const userSettingsSchema = z.object({
  personalReminders: z.boolean().optional(),
  generalReminders: z.boolean().optional(),
  cameraAccess: z.boolean().optional(),
  locationAccess: z.boolean().optional(),
  language: z.string().optional(),
});

type Employee = {
  id: string;
  firstName: string;
  lastName: string;
  email: string | null;
  signature?: string | null;
  image: string | null;
  imageUrl?: string | null;
  Contact: {
    phoneNumber: string;
    emergencyContact: string;
    emergencyContactNumber: string;
  };
};

export default function ProfilePage({ userId }: { userId: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const url = searchParams.get("returnUrl") || "/dashboard";
  const t = useTranslations("Hamburger-Profile");
  const [loading, setLoading] = useState(true);
  const [employee, setEmployee] = useState<Employee>();
  const [activeTab, setActiveTab] = useState(1);
  const [signatureBase64String, setSignatureBase64String] =
    useState<string>("");
  // Fetch Employee Data
  const [data, setData] = useState<UserSettings | null>(null);
  const [updatedData, setUpdatedData] = useState<UserSettings | null>(null);
  const [initialData, setInitialData] = useState<UserSettings | null>(null);

  const fetchEmployee = async () => {
    setLoading(true);
    try {
      const employeeRes = await fetch("/api/getEmployee");
      const employeeData = await employeeRes.json();
      setEmployee(employeeData);
      setSignatureBase64String(employeeData.signature ?? "");
    } catch (error) {
      console.error("Failed to fetch employee data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch Employee on Component Mount
  useEffect(() => {
    fetchEmployee();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/getSettings");
        if (response.ok) {
          const settings = await response.json();
          const validatedSettings = userSettingsSchema.parse(settings);

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
  }, [userId]);

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

  const handleLanguageChange = (key: keyof UserSettings, value: string) => {
    setUpdatedData((prev) => (prev ? { ...prev, [key]: value } : null));
  };

  // --- Updated toggles with permission requests ---

  // CameraAccess toggle: request permission when turned on
  const handleCameraAccessChange = async (value: boolean) => {
    if (value) {
      // Request camera permission when turning on
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        // Immediately stop the stream (we just wanted permission)
        stream.getTracks().forEach((track) => track.stop());
        handleChange("cameraAccess", true);
      } catch (err) {
        console.error("Camera access denied:", err);
        handleChange("cameraAccess", false);
      }
    } else {
      // When turning off, stop all camera tracks
      if (navigator.mediaDevices) {
        const streams = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        streams.getTracks().forEach((track) => track.stop());
      }
      handleChange("cameraAccess", false);
    }
  };

  // LocationAccess toggle: request permission when turned on
  const handleLocationAccessChange = async (value: boolean) => {
    if (value) {
      // Request location permission when turning on
      try {
        const position = await new Promise<GeolocationPosition>(
          (resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
          }
        );
        handleChange("locationAccess", true);
      } catch (err) {
        console.error("Location access denied:", err);
        handleChange("locationAccess", false);
      }
    } else {
      if ("geolocation" in navigator) {
        // Note: There's no direct way to "disable" geolocation,
        // but we can ensure our app stops using it
        handleChange("locationAccess", false);
      }
    }
  };

  return (
    <Grids rows={"6"} gap={"5"}>
      <Holds
        background={"white"}
        className={`row-start-1 row-end-2 h-full ${
          loading ? "animate-pulse" : ""
        }`}
      >
        <TitleBoxes onClick={() => router.push(`/${url}`)}>
          {/* Profile Image Editor (Pass fetchEmployee as Prop) */}

          <ProfileImageEditor
            employee={employee}
            reloadEmployee={fetchEmployee}
            loading={loading}
            employeeName={employee?.firstName + " " + employee?.lastName}
          />
        </TitleBoxes>
      </Holds>

      {/* Account Information Section */}
      <Holds
        className={`row-start-2 row-end-7 h-full ${
          loading ? "animate-pulse" : ""
        }`}
      >
        {/* Tabs */}
        <Holds position={"row"} className="h-fit flex gap-x-1">
          <NewTab
            titleImage={"/information.svg"}
            titleImageAlt={""}
            onClick={() => setActiveTab(1)}
            isActive={activeTab === 1}
            isComplete={true}
          >
            <Titles size={"h4"}>{t("AccountInformation")}</Titles>
          </NewTab>
          <NewTab
            titleImage={"/Settings.svg"}
            titleImageAlt={"Settings"}
            onClick={() => setActiveTab(2)}
            isActive={activeTab === 2}
            isComplete={true}
          >
            <Titles size={"h4"}>{t("AccountSettings")}</Titles>
          </NewTab>
        </Holds>

        {/* Content */}
        <Holds background={"white"} className="rounded-t-none h-full w-full">
          {loading ? null : (
            <>
              {activeTab === 1 && (
                <AccountInformation
                  employee={employee}
                  signatureBase64String={signatureBase64String}
                  setSignatureBase64String={setSignatureBase64String}
                />
              )}
              {activeTab === 2 && (
                <SettingSelections
                  id={userId}
                  handleLanguageChange={handleLanguageChange}
                  data={data}
                  updatedData={updatedData}
                  handleChange={handleChange}
                  handleCameraAccessChange={handleCameraAccessChange}
                  handleLocationAccessChange={handleLocationAccessChange}
                  setData={setData}
                  setUpdatedData={setUpdatedData}
                />
              )}
            </>
          )}
        </Holds>
      </Holds>
    </Grids>
  );
}
