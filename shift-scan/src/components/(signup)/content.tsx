"use client";
import "@/app/globals.css";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Footers } from "@/components/(reusable)/footers";
import { Holds } from "@/components/(reusable)/Holds";
import { Bases } from "@/components/(reusable)/bases";
import { Header } from "@/components/header";
import { Contents } from "@/components/(reusable)/contents";
import { Grids } from "@/components/(reusable)/grids";
import { clearAuthStep, getAuthStep, setAuthStep } from "@/app/api/auth";
import ShiftScanIntro from "./shiftScanIntro";
import ResetPassword from "./resetPassword";
import ProfilePictureSetup from "./profilePictureSetup";
import SignatureSetup from "./signatureSetup";
import NotificationSettings from "./notificationSettings";
import Permissions from "./permissions";
import { signOut } from "next-auth/react";

export default function Content({
  userId,
  accountSetup,
  locale,
}: {
  userId: string;
  accountSetup: boolean;
  locale: string;
}) {
  const t = useTranslations("Home");
  const f = useTranslations("Footer");
  const [toggle, setToggle] = useState(true);
  const router = useRouter();
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
      // Use the callbackUrl for redirect to avoid double navigation
      signOut({ callbackUrl: '/signin' });
    } catch (error) {
      console.log(error);
    }
  };

  const handleNextStep = () => {
    setStep((prevStep) => prevStep + 1);
  };

  return (
    <>
      <Bases variant={"default"}>
        <Header />
        <Contents>
          <Holds size={"homepage"}>
            <Contents variant={"name"} size={"test"}>
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
    </>
  );
}
