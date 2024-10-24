"use client";
import "@/app/globals.css";
import { useEffect, useState } from "react";
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

// Validation logic outside the component
function validateProps(userId: string, accountSetup: boolean) {
  try {
    propsSchema.parse({ userId, accountSetup });
    return true; // Return true if validation passes
  } catch (error) {
    console.error("Invalid props:", error);
    return false; // Return false if validation fails
  }
}

export default function Content({
  userId,
  accountSetup,
}: {
  userId: string;
  accountSetup: boolean;
}) {
  const isValid = validateProps(userId, accountSetup); // Validate before rendering

  // Hooks are now called unconditionally, regardless of validation outcome
  const [step, setStep] = useState(1);

  // Effect to handle authStep and localStorage clearing
  useEffect(() => {
    const authStep = getAuthStep();

    if (authStep === "removeLocalStorage") {
      localStorage.clear();
      setAuthStep(""); // Perform actions conditionally inside the effect
    }
  }, []); // No conditional around the useEffect hook

  // Effect to handle account setup logic
  useEffect(() => {
    if (accountSetup) {
      handleComplete(); // Conditionally call your function based on accountSetup
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

  if (!isValid) {
    return null; // Conditionally return early only after all hooks are set up
  }

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
          </Contents>
        </Holds>
      </Contents>
    </Bases>
  );
}
