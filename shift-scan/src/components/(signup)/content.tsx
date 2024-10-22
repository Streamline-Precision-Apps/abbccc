"use client";
import "@/app/globals.css";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Footers } from "@/components/(reusable)/footers";
import { Holds } from "@/components/(reusable)/holds";
import { Bases } from "@/components/(reusable)/bases";
import { Header } from "@/components/header";
import { Contents } from "@/components/(reusable)/contents";
import { getAuthStep, setAuthStep } from "@/app/api/auth";
import ShiftScanIntro from "./shiftScanIntro";
import ResetPassword from "./resetPassword";
import ProfilePictureSetup from "./profilePictureSetup";
import SignatureSetup from "./signatureSetup";
import NotificationSettings from "./notificationSettings";
import Permissions from "./permissions";
import { signOut } from "next-auth/react";
import { z } from "zod";

// Define Zod schema for validating props
const propsSchema = z.object({
  userId: z.string().nonempty("User ID is required"),
  accountSetup: z.boolean(),
});

export default function Content({
  userId,
  accountSetup,
}: {
  userId: string;
  accountSetup: boolean;
}) {
  // Validate props using Zod
  try {
    propsSchema.parse({ userId, accountSetup });
  } catch (error) {
    console.error("Invalid props:", error);
    return null; // Don't render if props are invalid
  }

  const t = useTranslations("Home");
  const f = useTranslations("Footer");
  const [step, setStep] = useState(1);

  useEffect(() => {
    const authStep = getAuthStep();
    if (authStep === "removeLocalStorage") {
      localStorage.clear();
      setAuthStep("");
    }
  }, []);

  useEffect(() => {
    console.log("Account setup:", accountSetup);
    if (accountSetup) {
      handleComplete();
    } else {
      setStep(1);
    }
  }, [accountSetup]);

  const handleComplete = () => {
    try {
      setAuthStep("");
      signOut({ callbackUrl: "/signin" });
    } catch (error) {
      console.log(error);
    }
  };

  const handleNextStep = () => {
    setStep((prevStep) => prevStep + 1);
  };

  return (
    <Bases>
      <Header />
      <Contents>
        <Holds>
          <Contents>
            {step === 1 && <ShiftScanIntro handleNextStep={handleNextStep} />}
            {step === 2 && (
              <ResetPassword id={userId} handleNextStep={handleNextStep} />
            )}
            {step === 3 && (
              <ProfilePictureSetup
                id={userId}
                handleNextStep={handleNextStep}
              />
            )}
            {step === 4 && (
              <SignatureSetup id={userId} handleNextStep={handleNextStep} />
            )}
            {step === 5 && (
              <NotificationSettings
                id={userId}
                handleNextStep={handleNextStep}
              />
            )}
            {step === 6 && (
              <Permissions id={userId} handleAccept={handleComplete} />
            )}
            <Footers>{f("Copyright")}</Footers>
          </Contents>
        </Holds>
      </Contents>
    </Bases>
  );
}
