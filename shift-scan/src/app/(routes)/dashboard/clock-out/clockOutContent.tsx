"use client";
import { Bases } from "@/components/(reusable)/bases";
import { Buttons } from "@/components/(reusable)/buttons";
import { Contents } from "@/components/(reusable)/contents";
import { Holds } from "@/components/(reusable)/holds";
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";
import { useEffect, useState } from "react";
import { Signature } from "./(components)/injury-verification/Signature";
import { Checkbox } from "./(components)/injury-verification/checkBox";
import { useTranslations } from "next-intl";
import { InjuryReportContent } from "./(components)/injury-report/injuryReportContent";
import { Titles } from "@/components/(reusable)/titles";
import { useScanData } from "@/app/context/JobSiteScanDataContext";
import { useSavedCostCode } from "@/app/context/CostCodeContext";
import { useTimeSheetData } from "@/app/context/TimeSheetIdContext";
import { useRouter } from "next/navigation";
import { updateTimeSheet } from "@/actions/timeSheetActions"; // Make sure to update import if the function was renamed or relocated
import { Banners } from "@/components/(reusable)/banners";
import { Texts } from "@/components/(reusable)/texts";
import { Clock } from "@/components/clock";
import { Forms } from "@/components/(reusable)/forms";
import { Inputs } from "@/components/(reusable)/inputs";
import { Images } from "@/components/(reusable)/images";
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

type ClockOutContentProps = {
  id: string;
  signature: string | null;
  locale: string;
};

export default function ClockOutContent({
  id,
  signature,
  locale,
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
  const { savedTimeSheetData } = useTimeSheetData();
  const [date] = useState(new Date());

  // Checking if window exists before accessing localStorage
  const localStorageData =
    typeof window !== "undefined"
      ? {
          jobsite: localStorage.getItem("jobSite"),
          costCode: localStorage.getItem("costCode"),
          timesheet: JSON.parse(
            localStorage.getItem("savedtimeSheetData") || "{}"
          ),
        }
      : {};

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
      await uploadFirstSignature(formData); // This assumes you have an uploadFirstSignature function elsewhere
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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent default form submission behavior

    try {
      const formData = new FormData(event.currentTarget); // Use event.currentTarget instead of event.target
      await updateTimeSheet(formData); // Assuming updateTimeSheet is a server action
      localStorage.clear();
      router.push("/"); // Redirect to the homepage after form submission
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
      incrementStep(2); // Submit timesheet when the user confirms no injury
    }
  };

  const handleNextStep = () => {
    incrementStep(step + 1);
  };

  if (step === 1) {
    return (
      <Bases>
        <Contents>
          <Holds>
            <TitleBoxes
              title={t("InjuryVerification")}
              titleImg="/new/end-day.svg"
              titleImgAlt="Team"
              variant={"row"}
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
                <Banners background="red">{bannerMessage}</Banners>
              </div>
            )}
            <Holds>
              <Titles size={"h3"}>{t("SignBelow")}</Titles>
              <Signature
                setBase64String={setBase64String}
                base64string={base64String}
                handleSubmitImage={handleSubmitImage}
              />
            </Holds>
            <Holds>
              <Contents>
                <Titles size={"h4"}>{t("SignatureVerify")}</Titles>
                <Checkbox checked={checked} onChange={handleCheckboxChange} />
              </Contents>
            </Holds>
            {/* Button changes based on checkbox state */}
            <Buttons
              background={checked ? "green" : "red"} // Green for Continue, Red for Report an Injury
              size={null}
              onClick={handleNextStepAndSubmit}
              disabled={isSubmitting} // Disable button while submitting
            >
              <Titles size={"h3"}>
                {checked ? t("Continue") : t("ReportInjury")}{" "}
                {/* Button text changes */}
              </Titles>
            </Buttons>
          </Holds>
        </Contents>
      </Bases>
    );
  } else if (step === 2 && path === "Injury") {
    return (
      <Bases>
        <Contents>
          <Holds>
            <TitleBoxes
              title={t("InjuryVerification")}
              titleImg="/new/injury.svg"
              titleImgAlt="Team"
              variant={"row"}
              type="row"
            />
          </Holds>
          <Holds>
            <InjuryReportContent
              base64String={base64String}
              setBase64String={setBase64String}
              handleComplete={handleNextStep} // Ensure handleComplete does the right thing
              handleSubmitImage={handleSubmitImage}
            />
          </Holds>
        </Contents>
      </Bases>
    );
  } else if (
    (step === 2 && path === "ClockOut") ||
    (step === 3 && path === "Injury")
  ) {
    return (
      <Bases>
        <Banners background={bannerMessage.length > 0 ? "green" : "default"}>
          {bannerMessage}
        </Banners>
        <Contents>
          <Holds>
            <TitleBoxes
              title={t("Bye")}
              titleImg={"/new/end-day.svg"}
              titleImgAlt={""}
              variant={"row"}
              type="row"
            />
            <Contents>
              <Buttons size={null} type="submit">
                <Images
                  titleImg={"/new/downArrow.svg"}
                  titleImgAlt={"downArrow"}
                />
              </Buttons>
              <Texts>
                {t("ClockOutDate")} {new Date().toLocaleDateString()}
              </Texts>
              <Texts>
                {t("Jobsite")} {scanResult?.data || localStorageData?.jobsite}
              </Texts>
              <Texts>
                {t("CostCode")} {savedCostCode || localStorageData?.costCode}
              </Texts>
              <Forms onSubmit={handleSubmit}>
                <Inputs
                  type="hidden"
                  name="id"
                  value={(
                    savedTimeSheetData?.id || localStorageData?.timesheet.id
                  )?.toString()} // Convert id to string
                  readOnly
                />
                <Inputs
                  type="hidden"
                  name="endTime"
                  value={new Date().toISOString()}
                  readOnly
                />
                <Inputs
                  type="hidden"
                  name="timeSheetComments"
                  value={""}
                  readOnly
                />
                <Inputs type="hidden" name="userId" value={id || ""} readOnly />
                <Buttons
                  type="submit"
                  className="bg-app-red mx-auto flex justify-center w-full h-full py-4 px-5 rounded-lg text-black font-bold mt-5"
                  disabled={isSubmitting} // Disable while submitting
                >
                  <Clock time={date.getTime()} />
                </Buttons>
              </Forms>
            </Contents>
          </Holds>
        </Contents>
      </Bases>
    );
  } else {
    return null;
  }
}
