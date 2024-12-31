"use client";
import React, { useEffect, useState } from "react";
import { Holds } from "../(reusable)/holds";
import { Texts } from "../(reusable)/texts";
import { Buttons } from "../(reusable)/buttons";
import { Grids } from "../(reusable)/grids";
import { Titles } from "../(reusable)/titles";
import LocaleToggleSwitch from "../(inputs)/toggleSwitch";
import { Contents } from "../(reusable)/contents";
import { UserSettings } from "@/lib/types";
import { useTranslations } from "next-intl";
import { updateSettings } from "@/actions/hamburgerActions";

type prop = {
  userId: string;
  handleNextStep: () => void;
}

export default function NotificationSettings({userId, handleNextStep}: prop) {
  console.log(userId);
  const [updatedData, setUpdatedData] = useState<UserSettings | null>(null);
  const [initialData, setInitialData] = useState<UserSettings | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const t = useTranslations("SignUpPermissions");

  const handleChange = (key: keyof UserSettings, value: boolean) => {
    setUpdatedData((prev) => (prev ? { ...prev, [key]: value } : null));
  };

  const handleYesToAll = () => {
    setUpdatedData ((prev) => (prev ? { ...prev,
      ["approvedRequests"]: true,
      ["timeOffRequests"]: true,
      ["generalReminders"]: true,
      ["biometric"]: true,
      ["cameraAccess"]: true,
      ["locationAccess"]: true,
    } : null));
  }

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/getSettings");
        if (response.ok) {
          const settings = await response.json();

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
  }, [initialData, updatedData]);

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
    <Grids rows={"10"} gap={"5"} className="mb-5">
      <Holds background={"white"} className="row-span-1 h-full justify-center">
        <Titles size={"h1"}>{t("GiveUsAccess")}</Titles>
      </Holds>
      <Holds background={"white"} className="row-span-1 h-full justify-center">
        <Buttons onClick={() => handleYesToAll()}>
          <Texts size={"p3"} >{t("YesToEverything")}</Texts>
        </Buttons>
      </Holds>
      <Holds background={"white"} className="row-span-7 h-full">
          <Contents width={"section"}>
            <Grids rows={"4"} gap={"0"}>
              <Holds className="row-span-1">
                <Titles size={"h2"}>{t("RequiredForAppUse")}</Titles>
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
              <Holds position={"row"}>
                <Holds size={"70"}>
                  <Texts position={"left"}>{t("Cookies")}</Texts>
                </Holds>
                <Holds size={"30"}>
                  <LocaleToggleSwitch
                    data={false}
                    onChange={(value: boolean) =>
                      handleChange("biometric", value)
                    }
                  />
                </Holds>
              </Holds>
            </Grids>
          </Contents>
          {/* ------------------------------------------------------------- */}
          <Contents width={"section"} className="mb-2">
            <Grids rows={"4"} gap={"0"}>
              <Holds className="row-span-1">
                <Titles size={"h2"}>{t("OptionalButVeryHelpful")}</Titles>
              </Holds>
              <Holds position={"row"}>
                <Holds size={"70"}>
                  <Texts position={"left"}>{t("BiometricsLogin")}</Texts>
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
                  <Texts position={"left"}>{t("Notifications")}</Texts>
                </Holds>
                <Holds size={"30"}>
                  <LocaleToggleSwitch
                    data={updatedData?.approvedRequests || false}
                    onChange={(value: boolean) =>{
                      handleChange("approvedRequests", value);
                      handleChange("timeOffRequests", value);
                      handleChange("generalReminders", value);}
                    }
                  />
                </Holds>
              </Holds>
              <Holds position={"row"}>
                <Holds size={"70"}>
                  <Texts position={"left"}>{t("PhotoAlbum")}</Texts>
                </Holds>
                <Holds size={"30"}>
                  <LocaleToggleSwitch
                    data={false}
                    onChange={(value: boolean) =>
                      handleChange("biometric", value)
                    }
                  />
                </Holds>
              </Holds>
            </Grids>
          </Contents>
      </Holds>
      <Holds className="row-span-1 h-full">
        <Buttons background={"orange"} onClick={handleNextStep}>
          <Titles size={"h2"}>{t("Next")}</Titles>
        </Buttons>
      </Holds>
    </Grids>
    </>
  )};











// "use client";
// import React, { useState } from "react";
// import { Buttons } from "../(reusable)/buttons";
// import { setUserSettings } from "@/actions/userActions";

// const NotificationSettings = ({
//   id,
//   handleNextStep,
// }: {
//   id: string;
//   handleNextStep: () => void;
// }) => {
//   const [approvedRequests, setApprovedRequests] = useState(false);
//   const [timeoffRequests, setTimeoffRequests] = useState(false);
//   const [generalReminders, setGeneralReminders] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const handleSubmitSettings = async () => {
//     const formData = new FormData();
//     formData.append("id", id);
//     formData.append("approvedRequests", String(approvedRequests));
//     formData.append("timeoffRequests", String(timeoffRequests));
//     formData.append("GeneralReminders", String(generalReminders));

//     setIsSubmitting(true);
//     try {
//       await setUserSettings(formData);
//       handleNextStep(); // Proceed to the next step only if settings update is successful
//     } catch (error) {
//       console.error("Error updating settings:", error);
//       alert("There was an error updating your settings. Please try again.");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div style={{ textAlign: "center", padding: "20px" }}>
//       <p>Would you like to receive reminder notifications for the following?</p>

//       <div style={{ margin: "20px 0" }}>
//         <div style={{ marginBottom: "15px" }}>
//           <label style={{ marginRight: "10px" }}>Approved Requests</label>
//           <input
//             type="checkbox"
//             checked={approvedRequests}
//             onChange={(e) => setApprovedRequests(e.target.checked)}
//           />
//         </div>
//         <div style={{ marginBottom: "15px" }}>
//           <label style={{ marginRight: "10px" }}>Timeoff Requests</label>
//           <input
//             type="checkbox"
//             checked={timeoffRequests}
//             onChange={(e) => setTimeoffRequests(e.target.checked)}
//           />
//         </div>
//         <div style={{ marginBottom: "15px" }}>
//           <label style={{ marginRight: "10px" }}>General Reminders</label>
//           <input
//             type="checkbox"
//             checked={generalReminders}
//             onChange={(e) => setGeneralReminders(e.target.checked)}
//           />
//         </div>
//       </div>

//       <Buttons
//         onClick={handleSubmitSettings}
//         style={{ backgroundColor: "orange", color: "black" }}
//         disabled={isSubmitting} // Disable the button while submitting
//       >
//         {isSubmitting ? "Submitting..." : "Next"}
//       </Buttons>
//     </div>
//   );
// };

// export default NotificationSettings;
