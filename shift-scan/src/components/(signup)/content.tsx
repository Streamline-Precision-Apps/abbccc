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
// import { signOut } from "next-auth/react";
// import { z } from "zod";

// Define Zod schema for validating props
// const propsSchema = z.object({
//   userId: z.string().min(1, "User ID is required"),
//   accountSetup: z.boolean(),
// });

// Validation logic
// function validateProps(userId: string, accountSetup: boolean) {
//   try {
//     propsSchema.parse({ userId, accountSetup });
//     return true;
//   } catch (error) {
//     console.error("Invalid props:", error);
//     return false;
//   }
// }

export default function Content({
  userId,
  accountSetup,
}: {
  userId: string;
  accountSetup: boolean;
}) {
  // const isValid = validateProps(userId, accountSetup); // Validate props

  // Hooks setup
  const [step, setStep] = useState(4); // change to 1 after account setup is complete

  // Clear local storage if needed
  useEffect(() => {
    const authStep = getAuthStep();
    if (authStep === "removeLocalStorage") {
      localStorage.clear();
      setAuthStep("");
    }
  }, []);

  // Effect for account setup logic
  useEffect(() => {
    if (accountSetup) {
      handleComplete();
    } else {
      setStep(1);
    }
  }, [accountSetup]);

  // Define the function to handle completion
  const handleComplete = () => {
    try {
      setAuthStep("");
      signOut({ callbackUrl: "/signin" });
    } catch (error) {
      console.error(error);
    }
  };

  const handleNextStep = () => {
    setStep((prevStep) => prevStep + 1);
  };

  // Early return if validation fails
  // if (!isValid) return null;

  return (
    <Holds className="h-full" position={"row"}>
      <Contents width={"section"}>
        {step === 1 && <ShiftScanIntro handleNextStep={handleNextStep}/>}
        {step === 2 && (
          <ResetPassword id={userId} handleNextStep={handleNextStep}/>
        )}
        {step === 3 && (
          <ProfilePictureSetup id={userId} handleNextStep={handleNextStep}/>
        )}
        {step === 4 && (
          <SignatureSetup id={userId} handleNextStep={handleNextStep}/>
        )}
        {step === 5 && (
          <NotificationSettings id={userId} handleNextStep={handleNextStep}/>
        )}
        {step === 6 && (
          <Permissions id={userId} handleAccept={handleComplete}/>
        )}
      </Contents>
    </Holds>
  );
}
