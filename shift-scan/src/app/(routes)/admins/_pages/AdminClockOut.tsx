"use client";
// import ClockOutContent from "@/app/(routes)/dashboard/clock-out/clockOutContent";

import { Texts } from "@/components/(reusable)/texts";
import { Buttons } from "@/components/(reusable)/buttons";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Contents } from "@/components/(reusable)/contents";
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";
import Spinner from "@/components/(animations)/spinner";
import { Titles } from "@/components/(reusable)/titles";
import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import Checkbox from "@/components/(inputs)/CheckBox";
import { useRouter } from "next/navigation";
import { InjuryReportContent } from "../../dashboard/clock-out/(components)/injury-report/injuryReportContent";
import { updateTimeSheet } from "@/actions/timeSheetActions";
import { Images } from "@/components/(reusable)/images";
import { useScanData } from "@/app/context/JobSiteScanDataContext";
import { useSavedCostCode } from "@/app/context/CostCodeContext";
import { useTimeSheetData } from "@/app/context/TimeSheetIdContext";
import { Inputs } from "@/components/(reusable)/inputs";
import { Clock } from "@/components/clock";

export const AdminClockOut = ({ handleClose }: { handleClose: () => void }) => {
  const [loading, setLoading] = useState(true);
  const [step, incrementStep] = useState(1);
  const router = useRouter();
  const [path, setPath] = useState("ClockOut");
  const formRef = useRef<HTMLFormElement>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const hasSubmitted = useRef(false);
  const { scanResult } = useScanData();
  const { savedCostCode } = useSavedCostCode();
  const { savedTimeSheetData } = useTimeSheetData();
  const [date] = useState(new Date());
  const t = useTranslations("ClockOut");
  const [checked, setChecked] = useState(false);
  const [base64String, setBase64String] = useState<string>("");

  const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
    setChecked(event.currentTarget.checked);
  };

  const handleNextStepAndSubmit = async () => {
    if (!checked) {
      setPath("Injury");
      incrementStep(2);
    } else {
      incrementStep(2);
    }
  };

  const handleNextStep = async () => {
    incrementStep(3);
  };

  const handleButtonClick = () => {
    handleSubmit();
  };

  const localStorageData = useMemo(() => {
    return typeof window !== "undefined"
      ? {
          jobsite: localStorage.getItem("jobSite"),
          costCode: localStorage.getItem("costCode"),
          timesheet: JSON.parse(
            localStorage.getItem("savedtimeSheetData") || ""
          ),
        }
      : {};
  }, []);

  const handleSubmit = async () => {
    if (isSubmitting || hasSubmitted.current) return;

    try {
      setIsSubmitting(true);
      hasSubmitted.current = true;

      const formData = new FormData(formRef.current as HTMLFormElement);
      await updateTimeSheet(formData);
      localStorage.clear();
      router.push("/");
    } catch (error) {
      console.error("Failed to submit the time sheet:", error);
    } finally {
      setIsSubmitting(false);
      hasSubmitted.current = false;
      handleClose();
    }
  };

  useEffect(() => {
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
  }, []);
  if (step === 1) {
    return (
      <Holds className="h-[500px] overflow-y-auto ">
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
                      {/* eslint-disable-next-line @next/next/no-img-element */}
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
      </Holds>
    );
  } else if (step === 2 && path === "Injury") {
    return (
      <Grids rows={"10"} gap={"5"}>
        <Holds background={"white"} className="h-full row-span-8">
          {/* Injury Report Content */}
          <InjuryReportContent
            base64String={base64String}
            setBase64String={setBase64String}
            handleComplete={handleNextStepAndSubmit}
            handleSubmitImage={handleSubmit}
            handleNextStep={handleNextStep}
          />
        </Holds>
      </Grids>
    );
  } else if (step === 2 && path === "ClockOut") {
    return (
      <>
        <Holds background={"white"} className="row-span-3 ">
          <Contents width={"section"} className="py-5">
            <Holds className="h-full">
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
                        savedTimeSheetData?.id || localStorageData?.timesheet.id
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
      </>
    );
  } else if (step === 3) {
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
};
