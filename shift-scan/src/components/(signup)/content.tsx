"use client";
import "@/app/globals.css";
import { useTranslations } from "next-intl";
import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Footers } from "@/components/(reusable)/footers";
import { Sections } from "@/components/(reusable)/sections";
import { Bases } from "@/components/(reusable)/bases";
import { Header } from "@/components/header";
import { Contents } from "@/components/(reusable)/contents";
import { Grids } from "@/components/(reusable)/grids";
import { getAuthStep, setAuthStep } from "@/app/api/auth";
import ShiftScanIntro from "./shiftScanIntro";
import ResetPassword from "./resetPassword";
import ProfilePictureSetup from "./profilePictureSetup";
import SignatureSetup from "./signatureSetup";
import NotificationSettings from "./notificationSettings";
import Permissions from "./permissions";

export default function Content({
  userId,
  locale
}: { userId: string; locale: string }) {
  const t = useTranslations("Home");
  const f = useTranslations("Footer");
  const [toggle, setToggle] = useState(true);
  const router = useRouter();
  const authStep = getAuthStep();
  const [step, setStep] = useState(1);
  const [path, setPath] = useState("");



  // useEffect(() => {
  //   if (authStep !== "signup") {
  //     router.push("/signin");
  //   }
  // }, [authStep, router]);

  useEffect(() => {
    if (authStep === "removeLocalStorage") {
      localStorage.clear();
      setAuthStep("");
    }
  }, [authStep]);

  const handler = () => {
    setToggle(!toggle);
  };

  useEffect(() => {
    setStep(1);
}, []);

const handleComplete = () => {
  try {
      setAuthStep("success");
      router.push("/");
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
            <Sections size={"homepage"}>
              <Contents variant={"name"} size={"test"}>
                {step === 1 && (
                  <ShiftScanIntro handleNextStep={handleNextStep} />
                )}
                {step === 2 && (
                  <ResetPassword id={userId} handleNextStep={handleNextStep} />
                )}
                {/* {step === 2.5 && (
                  <BiometricsSetup />
                  )} */}
                  {step === 3 && (
                    <ProfilePictureSetup id={userId} handleNextStep={handleNextStep} />
                  )}
                  {step === 4 && (
                    <SignatureSetup id={userId} handleNextStep={handleNextStep} />
                  )}
                  {step === 5 && (
                    <NotificationSettings id={userId} handleNextStep={handleNextStep} />
                  )}
                  {step === 6 && (
                    <Permissions handleAccept={handleComplete} />
                  )}
              <Footers>{f("Copyright")}</Footers>
              </Contents>
            </Sections>
          </Contents>
        </Bases>
      </>
    );
}
