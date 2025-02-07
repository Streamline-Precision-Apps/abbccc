"use client";
import { Buttons } from "@/components/(reusable)/buttons";
import { Contents } from "@/components/(reusable)/contents";
import { Holds } from "@/components/(reusable)/holds";
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";
import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { InjuryReportContent } from "./(components)/injury-report/injuryReportContent";
import { Titles } from "@/components/(reusable)/titles";
import { useScanData } from "@/app/context/JobSiteScanDataContext";
import { useSavedCostCode } from "@/app/context/CostCodeContext";
import { useRouter } from "next/navigation";
import { updateTimeSheet } from "@/actions/timeSheetActions";
import { Texts } from "@/components/(reusable)/texts";
import { Clock } from "@/components/clock";
import { Inputs } from "@/components/(reusable)/inputs";
import { Images } from "@/components/(reusable)/images";
import { Grids } from "@/components/(reusable)/grids";
import Spinner from "@/components/(animations)/spinner";
import { CheckBox } from "@/components/(inputs)/checkBox";
import { useCurrentView } from "@/app/context/CurrentViewContext";
import { useStartingMileage } from "@/app/context/StartingMileageContext";
import Comment from "@/components/(clock)/comment";
import ReviewYourDay from "./(components)/reviewYourDay/reviewYourDay";
import { RemoveCookiesAtClockOut } from "@/actions/cookieActions";
import { Bases } from "@/components/(reusable)/bases";
import { LaborClockOut } from "./(components)/clock-out-Verification/laborClockOut";
import { PreInjuryReport } from "./(components)/no-injury";

export default function ClockOutContent() {
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(0); // Using setStep instead of incrementStep
  const [path, setPath] = useState("ClockOut");
  const router = useRouter();
  const t = useTranslations("ClockOut");
  const [checked, setChecked] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const hasSubmitted = useRef(false);
  const { scanResult } = useScanData();
  const { savedCostCode } = useSavedCostCode();
  const { setStartingMileage } = useStartingMileage();
  const [date] = useState(new Date());
  const [base64String, setBase64String] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { currentView } = useCurrentView();
  const [commentsValue, setCommentsValue] = useState("");

  const incrementStep = () => {
    setStep((prevStep) => prevStep + 1); // Increment function
  };

  const prevStep = () => {
    setStep((prevStep) => prevStep - 1); // Increment function
  };

  useEffect(() => {
    console.log("path:", path);
  }, [path]);

  useEffect(() => {
    if (currentView === "truck") {
      setPath("truck");
    }
    // Fetching the signature only once
    const fetchSignature = async () => {
      setLoading(true);
      try {
        const response = await window.fetch("/api/getUserSignature");
        const json = await response.json();
        const signature = json.signature;
        setBase64String(signature);
      } catch (error) {
        console.error("Error fetching signature:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSignature();
  }, [currentView]);

  const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
    setChecked(event.currentTarget.checked);
  };

  const handleSubmit = async () => {
    if (isSubmitting || hasSubmitted.current) return;
    try {
      setIsSubmitting(true);
      hasSubmitted.current = true;
      let timeSheetId = null;

      const response = await fetch("/api/getRecentTimecard");
      const tsId = await response.json();
      timeSheetId = tsId.id;

      if (!timeSheetId) {
        alert("No valid TimeSheet ID was found. Please try again later.");
        return;
      }

      const formData = new FormData(formRef.current as HTMLFormElement);

      formData.append("id", timeSheetId); // Append the timeSheetId to the form data
      await updateTimeSheet(formData);
      localStorage.clear();
      setStartingMileage(null);
      RemoveCookiesAtClockOut();
      router.push("/");
    } catch (error) {
      console.error("Failed to submit the time sheet:", error);
    } finally {
      setIsSubmitting(false);
      hasSubmitted.current = false;
    }
  };

  const handleNextStepAndSubmit = async () => {
    if (!checked) {
      setPath("Injury");
      incrementStep();
    } else if (checked && currentView === "truck") {
      setPath("truck");
      incrementStep();
    } else {
      setPath("clockOut");
      incrementStep();
    }
  };

  const handleNextStep = async () => {
    if (currentView === "truck") {
      setPath("truck");
    }
    incrementStep();
  };

  const handleButtonClick = () => {
    handleSubmit();
  };

  const handleSubmitInjury = async () => {
    if (currentView === "truck") {
      setPath("truck");
    } else {
      setPath("clockOut");
    }
  };
  // step 0  is the comment step for clocking out
  if (step === 0) {
    return (
      <Bases>
        <Contents>
          <Holds background={"white"} className="row-span-1 h-full">
            <Contents width={"section"} className="py-4">
              <Comment
                handleClick={handleNextStep}
                clockInRole={""}
                setCommentsValue={setCommentsValue}
                commentsValue={commentsValue}
              />
            </Contents>
          </Holds>
        </Contents>
      </Bases>
    );
  }
  if (step === 1) {
    return <ReviewYourDay handleClick={handleNextStep} prevStep={prevStep} />;
  }

  if (step === 2) {
    return (
      <PreInjuryReport
        handleCheckboxChange={handleCheckboxChange}
        checked={checked}
        loading={loading}
        base64String={base64String}
        handleNextStepAndSubmit={handleNextStepAndSubmit}
        prevStep={prevStep}
      />
    );
  } else if (step === 3 && path === "Injury") {
    return (
      <InjuryReportContent
        base64String={base64String}
        handleNextStep={handleSubmitInjury}
        prevStep={prevStep}
      />
    );
  } else if (step === 3 && path === "clockOut") {
    return (
      <LaborClockOut
        handleButtonClick={handleButtonClick}
        scanResult={scanResult?.data}
        savedCostCode={savedCostCode}
        formRef={formRef}
        isSubmitting={isSubmitting}
        prevStep={prevStep}
      />
    );
  } else {
    return null;
  }
}
