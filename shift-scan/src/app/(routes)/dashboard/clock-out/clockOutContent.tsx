"use client";
import { Bases } from "@/components/(reusable)/bases";
import { Buttons } from "@/components/(reusable)/buttons";
import { Contents } from "@/components/(reusable)/contents";
import { Sections } from "@/components/(reusable)/sections";
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";
import { useEffect, useState } from "react";
import Signature from "./(components)/injury-verification/Signature";
import Checkbox from "./(components)/injury-verification/checkBox";
import { useTranslations } from "next-intl";
import { InjuryReportContent } from "./(components)/injury-report/injuryReportContent";
import { Titles } from "@/components/(reusable)/titles";
import { useScanData } from "@/app/context/JobSiteContext";
import { useSavedCostCode } from "@/app/context/CostCodeContext";
import { useSavedTimeSheetData } from "@/app/context/TimeSheetIdContext";
import { useRouter } from "next/navigation";
import { updateTimeSheet, GetAllTimeSheets } from "@/actions/timeSheetActions";
import { Banners } from "@/components/(reusable)/banners";
import { setAuthStep } from "@/app/api/auth";
import { Texts } from "@/components/(reusable)/texts";
import { Clock } from "@/components/clock";
import { uploadFirstSignature } from "@/actions/userActions";

// Custom hook for managing banners
function useBanner(initialMessage = "") {
  const [showBanner, setShowBanner] = useState(false);
  const [bannerMessage, setBannerMessage] = useState(initialMessage);

  useEffect(() => {
    if (showBanner) {
      const timer = setTimeout(() => setShowBanner(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showBanner]);

  return { showBanner, bannerMessage, setShowBanner, setBannerMessage };
}

interface ClockOutContentProps {
  id: string;
  signature: string | null;
}

export default function ClockOutContent({
  id,
  signature,
}: ClockOutContentProps) {
  const [step, incrementStep] = useState(1);
  const [path, setPath] = useState("ClockOut");
  const router = useRouter();
  const t = useTranslations("clock-out");
  const [checked, setChecked] = useState(false); // Checkbox state
  const { showBanner, bannerMessage, setShowBanner, setBannerMessage } =
    useBanner();
  const { scanResult } = useScanData();
  const { savedCostCode } = useSavedCostCode();
  const { savedTimeSheetData } = useSavedTimeSheetData();

  const localStorageData = {
    jobsite: localStorage.getItem("jobSite"),
    costCode: localStorage.getItem("costCode"),
    timesheet: JSON.parse(localStorage.getItem("savedtimeSheetData") || "{}"),
    breakTimeSec: localStorage.getItem("breakTime"),
  };

  const breakTimeTotal = localStorageData.breakTimeSec
    ? parseFloat(localStorageData.breakTimeSec) / 3600
    : null;
  const time = new Date().getTime();
  const [base64String, setBase64String] = useState<string>(signature || "");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleCheckboxChange = (newChecked: boolean) => {
    setChecked(newChecked);
  };

  const handleSubmitImage = async () => {
    if (!base64String) {
      setBannerMessage("Please capture a signature before proceeding.");
      setShowBanner(true);
      return;
    }

    const formData = new FormData();
    formData.append("id", id);
    formData.append("Signature", base64String);

    setIsSubmitting(true);
    try {
      await uploadFirstSignature(formData);
    } catch (error) {
      console.error("Error uploading signature:", error);
      setBannerMessage(
        "There was an error uploading your signature. Please try again."
      );
      setShowBanner(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async () => {
    try {
      let duration = 0.0;
      const formData = new FormData();
      formData.append(
        "id",
        savedTimeSheetData?.id || localStorageData.timesheet.id.toString()
      );
      formData.append("end_time", new Date().toString());
      formData.append("timesheet_comments", "");
      formData.append("app_comments", "");

      const date = await updateTimeSheet(formData);
      const retrieve = date?.date?.toString();
      if (retrieve) {
        const data = await GetAllTimeSheets(retrieve);
        duration = data?.reduce(
          (total, timeSheet) => total + (timeSheet.duration ?? 0),
          0
        );
      }

      setAuthStep("");
      setBannerMessage(
        `Timecard Submitted! ${duration?.toFixed(
          2
        )} total hours && ${breakTimeTotal?.toFixed(
          2
        )} total break time used. You will be redirected soon!`
      );

      setTimeout(() => {
        router.push("/");
        localStorage.removeItem("breakTime");
        setAuthStep("removeLocalStorage");
      }, 5000);
    } catch (error) {
      console.error("Failed to submit the time sheet:", error);
      setBannerMessage(
        "There was an error submitting the time sheet. Please try again."
      );
      setShowBanner(true);
    }
  };

  const handleNextStepAndSubmit = async () => {
    if (!checked) {
      // When checkbox is not checked, set the path to "Injury" and move to the next step
      setPath("Injury");
      incrementStep(2);
    } else {
      await handleSubmit(); // Submit timesheet when the user confirms no injury
    }
  };

  if (step === 1) {
    return (
      <Bases variant={"default"}>
        <Contents size={"default"}>
          <Sections size={"default"}>
            <TitleBoxes
              title={t("InjuryVerification")}
              titleImg="/endDay.svg"
              titleImgAlt="Team"
              variant={"row"}
              size={"default"}
              type="row"
            />
            {showBanner && (
              <div
                style={{
                  position: "fixed",
                  top: 0,
                  width: "100%",
                  zIndex: 1000,
                }}
              >
                <Banners variant="red">{bannerMessage}</Banners>
              </div>
            )}
            <Sections size={"titleBox"}>
              <Titles size={"h3"}>{t("SignBelow")}</Titles>
              <Signature
                setBase64String={setBase64String}
                base64string={base64String}
                handleSubmitImage={handleSubmitImage}
              />
            </Sections>
            <Sections size={"titleBox"}>
              <Contents variant={"rowCenter"}>
                <Titles size={"h4"}>{t("SignatureVerify")}</Titles>
                <Checkbox checked={checked} onChange={handleCheckboxChange} />
              </Contents>
            </Sections>
            {/* Button changes based on checkbox state */}
            <Buttons
              variant={checked ? "green" : "red"} // Green for Continue, Red for Report an Injury
              size={"widgetMed"}
              onClick={handleNextStepAndSubmit}
            >
              <Titles size={"h3"}>
                {checked ? t("Continue") : t("ReportInjury")}{" "}
                {/* Button text changes */}
              </Titles>
            </Buttons>
          </Sections>
        </Contents>
      </Bases>
    );
  } else if (step === 2 && path === "Injury") {
    return (
      <Bases variant={"default"}>
        <Contents size={"default"}>
          <Sections size={"titleBox"}>
            <TitleBoxes
              title={t("InjuryVerification")}
              titleImg="/injury.svg"
              titleImgAlt="Team"
              variant={"row"}
              size={"default"}
              type="row"
            />
          </Sections>
          <Sections size={"dynamic"}>
            <InjuryReportContent
              base64String={base64String}
              setBase64String={setBase64String}
              handleComplete={handleSubmit} // Ensure handleComplete does the right thing
              handleSubmitImage={handleSubmitImage}
            />
          </Sections>
        </Contents>
      </Bases>
    );
  } else {
    return null;
  }
}
