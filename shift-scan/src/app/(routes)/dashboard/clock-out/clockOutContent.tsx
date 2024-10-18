"use client";
import { Bases } from "@/components/(reusable)/bases";
import { Buttons } from "@/components/(reusable)/buttons";
import { Contents } from "@/components/(reusable)/contents";
import { Holds } from "@/components/(reusable)/holds";
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";
import { ChangeEvent, use, useEffect, useMemo, useRef, useState } from "react";
import { Signature } from "./(components)/injury-verification/Signature";

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
import { Grids } from "@/components/(reusable)/grids";
import Spinner from "@/components/(animations)/spinner";
import Checkbox from "@/components/(inputs)/checkbox";

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
};

export default function ClockOutContent({ id }: ClockOutContentProps) {
  const [loading, setLoading] = useState(true);
  const [step, incrementStep] = useState(1);
  const [path, setPath] = useState("ClockOut");
  const router = useRouter();
  const t = useTranslations("ClockOut");
  const [checked, setChecked] = useState(false); // Checkbox state
  const formRef = useRef<HTMLFormElement>(null);
  const hasSubmitted = useRef(false);
  const { showBanner, bannerMessage, setShowBanner, setBannerMessage } =
    useBanner();
  const { scanResult } = useScanData();
  const { savedCostCode } = useSavedCostCode();
  const { savedTimeSheetData } = useTimeSheetData();
  const [date] = useState(new Date());
  const [base64String, setBase64String] = useState<string>("");

  // Optimizing localStorage access using useMemo
  const localStorageData = useMemo(() => {
    return typeof window !== "undefined"
      ? {
          jobsite: localStorage.getItem("jobSite"),
          costCode: localStorage.getItem("costCode"),
          timesheet: JSON.parse(
            localStorage.getItem("savedtimeSheetData") || "{}"
          ),
        }
      : {};
  }, []);

  // Fetching the signature only once
  useEffect(() => {
    const fetchSignature = async () => {
      setLoading(true);
      try {
        const response = await window.fetch("/api/getUserSignature");
        const json = await response.json();
        setBase64String(json.signature);
      } catch (error) {
        console.error("Error fetching signature:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSignature();
  }, []);

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
    setChecked(event.currentTarget.checked);
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
      setBannerMessage("There was an error uploading your signature.");
      setShowBanner(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async () => {
    if (isSubmitting || hasSubmitted.current) return; // Prevent multiple submissions

    try {
      setIsSubmitting(true);
      hasSubmitted.current = true;

      const formData = new FormData(formRef.current as HTMLFormElement); // Get form data manually
      console.log("FormData:", formData);
      await updateTimeSheet(formData);
      localStorage.clear();
      router.push("/");
    } catch (error) {
      console.error("Failed to submit the time sheet:", error);
      setBannerMessage("There was an error submitting the time sheet.");
      setShowBanner(true);
    } finally {
      setIsSubmitting(false);
      hasSubmitted.current = false;
    }
  };

  const handleNextStepAndSubmit = async () => {
    if (!checked) {
      setPath("Injury");
      incrementStep(2);
    } else {
      incrementStep(2); // Proceed if no injury
    }
  };

  const handleButtonClick = () => {
    handleSubmit(); // Directly call the handleSubmit function to submit the form
  };

  if (step === 1) {
    return (
      <>
        <Grids className="grid-rows-4 gap-5">
          <Holds background={"white"} className="row-span-1 h-full">
            <Contents width={"section"}>
              <TitleBoxes
                title={t("InjuryVerification")}
                titleImg="/end-day.svg"
                titleImgAlt="Team"
                href="/dashboard"
              />
            </Contents>
          </Holds>
          <Holds background={"white"} className="row-span-3 h-full">
            <Contents width={"section"}>
              <Grids rows={"5"} gap={"5"}>
                <Holds className="row-span-2 h-full my-auto">
                  <Texts size={"p2"}>{t("SignBelow")}</Texts>
                  <Holds className="border-[3px] border-black h-full">
                    {loading ? (
                      <Holds className="my-auto">
                        <Spinner />
                      </Holds>
                    ) : (
                      <Holds className="my-auto">
                        <img
                          src={base64String}
                          alt="Loading signature"
                          className="w-[40%] mx-auto"
                        />
                      </Holds>
                    )}
                  </Holds>
                </Holds>
                <Holds position={"row"} className="row-span-2 h-full my-auto">
                  <Holds size={"70"}>
                    <Titles size={"h2"}>{t("SignatureVerify")}</Titles>
                  </Holds>
                  <Holds size={"30"}>
                    <Checkbox
                      id="injury-checkbox"
                      name="injury-verify"
                      onChange={handleCheckboxChange}
                      defaultChecked={checked}
                    />
                  </Holds>
                </Holds>
                <Holds className="row-span-1 mx-auto">
                  <Contents width={"section"}>
                    <Buttons
                      background={checked ? "green" : "red"}
                      onClick={handleNextStepAndSubmit}
                      disabled={loading}
                    >
                      <Titles size={"h3"}>
                        {checked ? t("Continue") : t("ReportInjury")}
                      </Titles>
                    </Buttons>
                  </Contents>
                </Holds>
              </Grids>
            </Contents>
          </Holds>
        </Grids>
      </>
    );
  } else if (step === 2 && path === "Injury") {
    return (
      <Grids rows={"10"} gap={"5"}>
        <Holds background={"white"} className="h-full row-span-2">
          <TitleBoxes
            title={t("InjuryVerification")}
            titleImg="/injury.svg"
            titleImgAlt={"injury icon"}
          />
        </Holds>
        <Holds background={"white"} className="h-full row-span-8">
          {/* Injury Report Content */}
        </Holds>
      </Grids>
    );
  } else if (step === 2 && path === "ClockOut") {
    return (
      <>
        <Grids rows={"4"} gap={"5"}>
          <Holds background={"white"} className="row-span-1 h-full">
            <Contents width={"section"}>
              <TitleBoxes
                title={t("Bye")}
                titleImg={"/end-day.svg"}
                titleImgAlt={"End of Day Icon"}
              />
              <Banners
                background={bannerMessage.length > 0 ? "green" : "default"}
              >
                {bannerMessage}
              </Banners>
            </Contents>
          </Holds>
          <Holds background={"white"} className="row-span-3 h-full">
            <Contents width={"section"} className="py-5">
              <Holds background={"orange"} className="h-full">
                <Grids rows={"6"} gap={"5"}>
                  <Holds className="row-span-1 h-full my-auto">
                    <Holds position={"right"} size={"20"}>
                      <Buttons type="button" onClick={handleButtonClick}>
                        <Images
                          titleImg={"/downArrow.svg"}
                          titleImgAlt={"downArrow"}
                          size={"80"}
                          className="mx-auto p-2"
                        />
                      </Buttons>
                    </Holds>
                  </Holds>
                  <Holds className="row-span-1 h-full my-auto">
                    <Texts>
                      {t("ClockOutDate")} {new Date().toLocaleDateString()}
                    </Texts>
                  </Holds>
                  <Holds className="row-span-1 h-full my-auto">
                    <Texts>
                      {t("Jobsite")}{" "}
                      {scanResult?.data || localStorageData?.jobsite}
                    </Texts>
                  </Holds>
                  <Holds className="row-span-1 h-full my-auto">
                    <Texts>
                      {t("CostCode")}{" "}
                      {savedCostCode || localStorageData?.costCode}
                    </Texts>
                  </Holds>
                  <Holds className="row-span-1 h-full my-auto">
                    <form ref={formRef}>
                      <Inputs
                        type="hidden"
                        name="id"
                        value={(
                          savedTimeSheetData?.id ||
                          localStorageData?.timesheet.id
                        )?.toString()}
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
                      <Buttons
                        onClick={handleButtonClick}
                        className="bg-app-red mx-auto flex justify-center w-full h-full py-4 px-5 rounded-lg text-black font-bold mt-5"
                        disabled={isSubmitting}
                      >
                        <Clock time={date.getTime()} />
                      </Buttons>
                    </form>
                  </Holds>
                </Grids>
              </Holds>
            </Contents>
          </Holds>
        </Grids>
      </>
    );
  } else {
    return null;
  }
}
