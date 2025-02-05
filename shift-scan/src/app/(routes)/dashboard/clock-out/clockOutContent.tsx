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
import { useTruckScanData } from "@/app/context/TruckScanDataContext";
import { CheckBox } from "@/components/(inputs)/checkBox";
import { useCurrentView } from "@/app/context/CurrentViewContext";
import TruckClockOutForm from "./(components)/truckClockOutForm";
import { useStartingMileage } from "@/app/context/StartingMileageContext";
import Comment from "@/components/(clock)/comment";
import ReviewYourDay from "./(components)/reviewYourDay";
import { RemoveCookiesAtClockOut } from "@/actions/cookieActions";
import { Bases } from "@/components/(reusable)/bases";
import { LaborClockOut } from "./(components)/clock-out-Verification/laborClockOut";

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
          <Grids className="grid-rows-1 gap-5">
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
          </Grids>
        </Contents>
      </Bases>
    );
  }
  if (step === 1) {
    return (
      <Bases>
        <Contents>
          <Grids className="grid-rows-1 gap-5">
            <Holds background={"white"} className="row-span-1 h-full">
              <Contents width={"section"} className="py-4">
                <ReviewYourDay handleClick={handleNextStep} />
              </Contents>
            </Holds>
          </Grids>
        </Contents>
      </Bases>
    );
  }

  if (step === 2) {
    return (
      <Bases>
        <Contents>
          <Holds background={"white"}>
            <TitleBoxes
              title={t("InjuryVerification")}
              titleImg="/end-day.svg"
              titleImgAlt="Team"
              href="/dashboard"
            />
          </Holds>
          <Holds background={"white"} className="h-full mt-5 py-4">
            <Contents width={"section"}>
              <Grids rows={"8"} className="h-full w-full ">
                <Holds className="row-start-1 row-end-2">
                  <Texts size={"p3"}>{t("SignBelow")}</Texts>
                </Holds>
                <Holds position={"row"} className="row-start-2 row-end-4">
                  <Holds size={"70"}>
                    <Titles size={"h2"}>{t("SignatureVerify")}</Titles>
                  </Holds>
                  <Holds size={"30"}>
                    <CheckBox
                      id="injury-checkbox"
                      name="injury-verify"
                      onChange={handleCheckboxChange}
                      defaultChecked={checked}
                    />
                  </Holds>
                </Holds>
                <Holds className="row-start-4 row-end-6 h-full ">
                  <Holds className="border-[3px] border-black rounded-[10px] h-full">
                    {loading ? (
                      <Holds className="my-auto">
                        <Spinner />
                      </Holds>
                    ) : (
                      <Holds className="my-auto">
                        {base64String ? (
                          <Image
                            src={base64String}
                            alt="Loading signature"
                            width={100}
                            height={100}
                            className="w-[40%] mx-auto"
                          />
                        ) : (
                          <Holds className="my-auto">
                            <Texts size={"p2"}>{t("NoSignature")}</Texts>
                          </Holds>
                        )}
                      </Holds>
                    )}
                  </Holds>
                </Holds>

                <Holds className="row-start-8 row-end-9 h-full ">
                  <Buttons
                    background={checked ? "green" : "red"}
                    onClick={handleNextStepAndSubmit}
                    disabled={loading}
                  >
                    <Titles size={"h3"}>
                      {checked ? t("Continue") : t("ReportInjury")}
                    </Titles>
                  </Buttons>
                </Holds>
              </Grids>
            </Contents>
          </Holds>
        </Contents>
      </Bases>
    );
  } else if (step === 3 && path === "Injury") {
    return (
      <Bases>
        <Contents>
          <Holds background={"white"}>
            <TitleBoxes
              title={t("InjuryVerification")}
              titleImg="/injury.svg"
              titleImgAlt={"injury icon"}
            />
          </Holds>
          <Holds background={"white"} className="h-full mt-5 py-4 ">
            {/* Injury Report Content */}
            <InjuryReportContent
              base64String={base64String}
              handleNextStep={handleSubmitInjury}
            />
          </Holds>
        </Contents>
      </Bases>
    );
  } else if (step === 3 && path === "clockOut") {
    return (
      <LaborClockOut
        handleButtonClick={handleNextStep}
        scanResult={scanResult?.data.toString() || ""}
        savedCostCode={savedCostCode}
        formRef={formRef}
        isSubmitting={isSubmitting}
      />
    );
  } else if (step === 4 && path === "clockOut") {
    return (
      <Bases>
        <Contents>
          <Grids rows={"4"} gap={"5"}>
            <Holds background={"white"} className="row-span-1 h-full">
              <Contents width={"section"} className="py-4">
                <TitleBoxes
                  title={t("Bye")}
                  titleImg={"/end-day.svg"}
                  titleImgAlt={"End of Day Icon"}
                />
              </Contents>
            </Holds>
            <Holds background={"white"} className="row-span-3 h-full">
              <Contents width={"section"} className="py-5">
                <Holds background={"lightGray"} className="h-full">
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
                        {t("Jobsite")} {scanResult?.data}
                      </Texts>
                    </Holds>
                    <Holds className="row-span-1 h-full my-auto">
                      <Texts>
                        {t("CostCode")} {savedCostCode}
                      </Texts>
                    </Holds>
                    <Holds className="row-span-1 h-full my-auto">
                      <form ref={formRef}>
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
        </Contents>
      </Bases>
    );
  } else {
    return null;
  }
}
