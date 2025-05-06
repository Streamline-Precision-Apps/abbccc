"use client";
import { Contents } from "@/components/(reusable)/contents";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Images } from "@/components/(reusable)/images";
import { Titles } from "@/components/(reusable)/titles";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import AccountInformation from "./accountInformation";
import ProfileImageEditor from "./ProfileImageEditor";
import { NewTab } from "@/components/(reusable)/newTabs";
import SettingSelections from "./SettingSelections";
import { UserSettings } from "@/lib/types";
import { updateSettings } from "@/actions/hamburgerActions";
import { z } from "zod";

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
  contact: {
    phoneNumber: string;
    emergencyContact: string;
    emergencyContactNumber: string;
  };
};

export default function ProfilePage({ userId }: { userId: string }) {
  const router = useRouter();
  const t = useTranslations("Hamburger");
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
  const handleCameraAccessChange = (value: boolean) => {
    if (value) {
      // Request camera permission
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then(() => {
          handleChange("cameraAccess", true);
        })
        .catch(() => {
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
            handleChange("locationAccess", false);
          }
        );
      } else {
        handleChange("locationAccess", false);
      }
    } else {
      handleChange("locationAccess", false);
    }
  };

  return (
    <Contents width={"section"}>
      <Grids rows={"10"} gap={"5"}>
        <Holds
          background={"white"}
          className={`row-span-2 h-full ${loading ? "animate-pulse" : ""}`}
        >
          <Grids cols={"5"} className="h-full w-full pt-3">
            {/* Back Button */}
            <Holds className="col-span-1 h-full w-full">
              <Images
                titleImg="/arrowBack.svg"
                titleImgAlt="Back"
                onClick={() => router.back()}
                className="max-w-[40px] max-h-[40px]"
              />
            </Holds>

            {/* Profile Image Editor (Pass fetchEmployee as Prop) */}
            <Holds className="col-start-2 col-end-5 h-full w-full flex justify-center items-center  ">
              <ProfileImageEditor
                employee={employee}
                reloadEmployee={fetchEmployee}
                loading={loading}
              />
            </Holds>

            {/* Employee ID */}
            {loading ? null : (
              <Holds className="col-span-1 h-full">
                <Titles size={"h6"}>{`#ID: ${employee?.id}`}</Titles>
              </Holds>
            )}

            {/* Employee Name */}
            {loading ? null : (
              <Holds className="col-span-5 mt-3">
                <Titles
                  size={"h3"}
                >{`${employee?.firstName} ${employee?.lastName}`}</Titles>
              </Holds>
            )}
          </Grids>
        </Holds>

        {/* Account Information Section */}
        <Holds
          className={`row-span-8 h-full ${loading ? "animate-pulse" : ""}`}
        >
          <Grids rows={"10"} className="h-full w-full">
            {/* Tabs */}
            <Holds position={"row"} className="row-span-1 flex gap-1">
              <NewTab
                titleImage={"/information.svg"}
                titleImageAlt={""}
                onClick={() => setActiveTab(1)}
                isActive={activeTab === 1}
                isComplete={true}
              >
                <Titles size={"h4"}>Account Information</Titles>
              </NewTab>
              <NewTab
                titleImage={"/settings.svg"}
                titleImageAlt={""}
                onClick={() => setActiveTab(2)}
                isActive={activeTab === 2}
                isComplete={true}
              >
                <Titles size={"h4"}>Account Settings</Titles>
              </NewTab>
            </Holds>

            {/* Content */}
            <Holds
              background={"white"}
              className="row-span-9 rounded-t-none h-full w-full"
            >
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
          </Grids>
        </Holds>
      </Grids>
    </Contents>
  );
}
