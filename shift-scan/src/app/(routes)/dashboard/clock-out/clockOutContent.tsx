"use client";
import { Buttons } from "@/components/(reusable)/buttons";
import { Contents } from "@/components/(reusable)/contents";
import { Holds } from "@/components/(reusable)/holds";
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";
import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { InjuryReportContent } from "./(components)/injury-report/injuryReportContent";
import { Titles } from "@/components/(reusable)/titles";
import { useScanData } from "@/app/context/JobSiteScanDataContext";
import { useSavedCostCode } from "@/app/context/CostCodeContext";
import { useTimeSheetData } from "@/app/context/TimeSheetIdContext";
import { useRouter } from "next/navigation";
import { updateTimeSheet } from "@/actions/timeSheetActions";
import { Texts } from "@/components/(reusable)/texts";
import { Clock } from "@/components/clock";
import { Inputs } from "@/components/(reusable)/inputs";
import { Images } from "@/components/(reusable)/images";
import { Grids } from "@/components/(reusable)/grids";
import Spinner from "@/components/(animations)/spinner";
import Checkbox from "@/components/(inputs)/CheckBox";
import { z } from "zod";

// Zod schema for component state
const ClockOutContentSchema = z.object({
  loading: z.boolean(),
  step: z.number(),
  path: z.string(),
  checked: z.boolean(),
  base64String: z.string(),
  isSubmitting: z.boolean(),
  scanResult: z
    .object({
      data: z.string().optional(),
    })
    .nullable(),
  savedCostCode: z.string().nullable(),
  savedTimeSheetData: z
    .object({
      id: z.union([z.string(), z.number()]).optional(),
    })
    .nullable(),
  date: z.date(),
});

// Main component function
export default function ClockOutContent() {
  const [loading, setLoading] = useState(true);
  const [step, incrementStep] = useState(1);
  const [path, setPath] = useState("ClockOut");
  const router = useRouter();
  const t = useTranslations("ClockOut");
  const [checked, setChecked] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const hasSubmitted = useRef(false);
  const { scanResult } = useScanData();
  const { savedCostCode } = useSavedCostCode();
  const { savedTimeSheetData } = useTimeSheetData();
  const [date] = useState(new Date());
  const [base64String, setBase64String] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Validate initial state with Zod schema
  try {
    ClockOutContentSchema.parse({
      loading,
      step,
      path,
      checked,
      base64String,
      isSubmitting,
      scanResult,
      savedCostCode,
      savedTimeSheetData,
      date,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("Initial state validation error:", error.errors);
    }
  }

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

  const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
    setChecked(event.currentTarget.checked);
  };

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
    }
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

  if (step === 1) {
    return (
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
}
