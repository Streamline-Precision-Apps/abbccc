"use client";
import { Bases } from "@/components/(reusable)/bases";
import { Buttons } from "@/components/(reusable)/buttons";
import { Contents } from "@/components/(reusable)/contents";
import { Holds } from "@/components/(reusable)/holds";
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";
import { ChangeEvent, use, useEffect, useState } from "react";
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
  const { showBanner, bannerMessage, setShowBanner, setBannerMessage } =
    useBanner();
  const { scanResult } = useScanData();
  const { savedCostCode } = useSavedCostCode();
  const { savedTimeSheetData } = useTimeSheetData();
  const [date] = useState(new Date());
  const [base64String, setBase64String] = useState<string>("");

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

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const response = await window.fetch("/api/getSignature");
        const json = await response.json();
        setBase64String(json.signature);
      } catch (error) {
        console.error("Error fetching signature:", error);
      } finally {
        setLoading(false);
      }
    };
    fetch();
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
      <>
        <Grids className="grid-rows-4 gap-5">
          <Holds background={"white"} className="row-span-1 h-full">
            <Contents width={"section"}>
              <TitleBoxes
                title={t("InjuryVerification")}
                titleImg="/end-day.svg"
                titleImgAlt="Team"
              />
            </Contents>
          </Holds>
          <Holds background={"white"} className="row-span-3 h-full">
            <Contents width={"section"}>
              <Grids rows={"5"} gap={"5"}>
                <Holds className="row-span-2 h-full my-auto">
                  <Texts size={"p2"}>{t("SignBelow")}</Texts>
                  <Holds className="border-[3px] border-black h-full ">
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
                      onChange={handleCheckboxChange} // Use state handler
                      defaultChecked={checked} // Pass state value
                    />
                  </Holds>
                </Holds>

                <Holds className="row-span-1 mx-auto">
                  <Contents width={"section"}>
                    <Buttons
                      background={checked ? "green" : "red"}
                      onClick={handleNextStepAndSubmit}
                      disabled={loading} // Disable while loading
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
            titleImgAlt="Team"
          />
        </Holds>
        <Holds background={"white"} className="h-full row-span-8">
          <InjuryReportContent
            base64String={base64String}
            setBase64String={setBase64String}
            handleComplete={handleNextStep} // Ensure handleComplete does the right thing
            handleSubmitImage={handleSubmitImage}
          />
        </Holds>
      </Grids>
    );
  } else if (
    (step === 2 && path === "ClockOut") ||
    (step === 3 && path === "Injury")
  ) {
    return (
      <>
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
              <Texts>
                {t("ClockInTime")} {}
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
      </>
    );
  } else {
    return null;
  }
}
