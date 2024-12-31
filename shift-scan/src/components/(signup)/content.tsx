"use client";
import "@/app/globals.css";
import { useEffect, useState } from "react";
import { Holds } from "@/components/(reusable)/holds";
import { Contents } from "@/components/(reusable)/contents";
import ShiftScanIntro from "./shiftScanIntro";
import ResetPassword from "./resetPassword";
import ProfilePictureSetup from "./profilePictureSetup";
import SignatureSetup from "./signatureSetup";
import NotificationSettings from "./notificationSettings";
import Permissions from "./permissions";
import { setAuthStep, getAuthStep } from "@/app/api/auth";
import { signOut } from "next-auth/react";
import { z } from "zod";

// Define Zod schema for validating props
const propsSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  accountSetup: z.boolean(),
});

// Validation logic
function validateProps(userId: string, accountSetup: boolean) {
  try {
    propsSchema.parse({ userId, accountSetup });
    return true;
  } catch (error) {
    console.error("Invalid props:", error);
    return false;
  }
}

export default function Content({
  userId,
  accountSetup,
}: {
  userId: string;
  accountSetup: boolean;
}) {
  const isValid = validateProps(userId, accountSetup); // Ensure this is at the top
  const [step, setStep] = useState(3); // Always call useState
  const handleComplete = () => {
    try {
      setAuthStep("");
      signOut({ callbackUrl: "/signin" });
    } catch (error) {
      console.error(error);
    }
  };

  // Always call useEffect
  useEffect(() => {
    const authStep = getAuthStep();
    if (authStep === "removeLocalStorage") {
      localStorage.clear();
      setAuthStep("");
    }
  }, []);

  useEffect(() => {
    if (accountSetup) {
      handleComplete();
    } else {
      setStep(1);
    }
  }, [accountSetup]);

  const handleNextStep = () => {
    setStep((prevStep) => prevStep + 1);
  };

  // Early return after hooks are declared
  if (!isValid) return <div>Error: Invalid props provided.</div>;

  return (
    <Holds className="h-full" position={"row"}>
      <Contents width={"section"}>
        {/* {step === 1 && <ShiftScanIntro handleNextStep={handleNextStep} />}
        {step === 2 && (
          <ResetPassword userId={userId} handleNextStep={handleNextStep} /> */}
        {/* )} */}
        {step === 1 && (
          <NotificationSettings userId={userId} handleNextStep={handleNextStep} />
        )}
                        {step === 2 && (
          <ProfilePictureSetup id={userId} handleNextStep={handleNextStep} />
        )}
                {step === 3 && (
          <Permissions id={userId} handleAccept={handleComplete}/>
        )}

        {step === 4 && (
          <SignatureSetup id={userId} handleNextStep={handleNextStep} />
        )}
        {step === 7 && (
          <Permissions id={userId} handleAccept={handleComplete}/>
        )}
      </Contents>
    </Holds>
  );
}
