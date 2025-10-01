"use client";
import "@/app/globals.css";
import { useEffect, useState } from "react";
import { Holds } from "@/components/(reusable)/holds";
import ResetPassword from "./resetPassword";
import ProfilePictureSetup from "./profilePictureSetup";
import SignatureSetup from "./signatureSetup";
import NotificationSettings from "./notificationSettings";
// import Permissions from "./permissions";
import { setAuthStep, getAuthStep } from "@/app/api/auth";
import { signOut } from "next-auth/react";
import { z } from "zod";
import { finishUserSetup } from "@/actions/userActions";
import { EnterAccountInfo } from "./EnterAccountInfo";

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
  userName,
}: {
  userId: string;
  accountSetup: boolean;
  userName: string;
}) {
  const isValid = validateProps(userId, accountSetup); // Ensure this is at the top
  const [step, setStep] = useState(1); // Always call useState
  const totalSteps = 6; // Total number of steps in the signup process
  const handleComplete = async () => {
    try {
      // mark accountSetup as true
      await finishUserSetup(userId);
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

  const handleNextStep = () => {
    setStep((prevStep) => prevStep + 1);
  };

  // Early return after hooks are declared
  if (!isValid) return <div>Error: Invalid props provided.</div>;

  return (
    <Holds className="h-full" position={"row"}>
      {/* {step === 1 && (
        <Bases>
          <Contents>
            <ShiftScanIntro handleNextStep={handleNextStep} />
          </Contents>
        </Bases>
      )} */}
      {step === 1 && (
        <EnterAccountInfo
          userId={userId}
          handleNextStep={handleNextStep}
          userName={userName}
          totalSteps={totalSteps}
          currentStep={step}
        />
      )}

      {step === 2 && (
        <ResetPassword
          userId={userId}
          handleNextStep={handleNextStep}
          totalSteps={totalSteps}
          currentStep={step}
        />
      )}
      {step === 3 && (
        <NotificationSettings
          userId={userId}
          handleNextStep={handleNextStep}
          totalSteps={totalSteps}
          currentStep={step}
        />
      )}
      {step === 4 && (
        <ProfilePictureSetup
          userId={userId}
          handleNextStep={handleNextStep}
          totalSteps={totalSteps}
          currentStep={step}
        />
      )}
      {/* {step === 5 && (
          <Permissions id={userId} handleAccept={handleComplete}/>
        )} */}
      {step === 5 && (
        <SignatureSetup
          id={userId}
          handleNextStep={handleComplete}
          totalSteps={totalSteps}
          currentStep={step}
        />
      )}
      {/* {step === 7 && (
        <Bases>
          <Contents>
            <SignUpOutro handleComplete={handleComplete} />
          </Contents>
        </Bases>
      )} */}
    </Holds>
  );
}
