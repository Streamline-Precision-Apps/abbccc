"use client";
import { Contents } from "@/components/(reusable)/contents";
import { Holds } from "@/components/(reusable)/holds";
import { ChangeEvent, useEffect, useState } from "react";
import { InjuryReportContent } from "./(components)/injury-report/injuryReportContent";
import { useScanData } from "@/app/context/JobSiteScanDataContext";
import { useSavedCostCode } from "@/app/context/CostCodeContext";
import { useCurrentView } from "@/app/context/CurrentViewContext";
import ReviewYourDay from "./(components)/reviewYourDay/reviewYourDay";
import { Bases } from "@/components/(reusable)/bases";
import { LaborClockOut } from "./(components)/clock-out-Verification/laborClockOut";
import { PreInjuryReport } from "./(components)/no-injury";
import Comment from "./(components)/comment";
import ReviewYourTeam from "./(components)/reviewYourTeam";

export type TimeSheet = {
  submitDate: string;
  date: Date | string;
  id: string;
  userId: string;
  jobsiteId: string;
  costcode: string;
  startTime: string;
  endTime: string | null;
  workType: string;
  Jobsite: {
    name: string;
  };
};

export default function ClockOutContent({ manager }: { manager: boolean }) {
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(0); // Using setStep instead of incrementStep
  const [path, setPath] = useState("ClockOut");
  const [checked, setChecked] = useState(false);
  const { scanResult } = useScanData();
  const { savedCostCode } = useSavedCostCode();
  const [base64String, setBase64String] = useState<string>("");
  const { currentView } = useCurrentView();
  const [commentsValue, setCommentsValue] = useState("");
  const [timesheets, setTimesheets] = useState<TimeSheet[]>([]);
  const [reviewYourTeam, setReviewYourTeam] = useState<boolean>(false);
  const [pendingTimeSheets, setPendingTimeSheets] = useState<TimeSheet>();

  const incrementStep = () => {
    setStep((prevStep) => prevStep + 1); // Increment function
  };

  const prevStep = () => {
    setStep((prevStep) => prevStep - 1); // Increment function
  };

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch("/api/getComment");
        const data = await response.json();
        setCommentsValue(data.comment || "");
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };
    fetchComments();
  }, []);

  useEffect(() => {
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

  useEffect(() => {
    const fetchTimesheets = async () => {
      try {
        const response = await fetch("/api/getTodaysTimesheets");
        const data = await response.json();

        const activeTimeSheet = data
          .filter((timesheet: TimeSheet) => timesheet.endTime === null)
          .sort(
            (a: TimeSheet, b: TimeSheet) =>
              new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
          )[0]; // Get the most recent one

        // Set state with both all pending timesheets and the active one
        setPendingTimeSheets(activeTimeSheet || null);

        setTimesheets(data);
      } catch (error) {
        console.error("Error fetching timesheets:", error);
      }
    };
    fetchTimesheets();
  }, []);

  const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
    setChecked(event.currentTarget.checked);
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

  const handleBreak = async () => {};

  const handleSubmitInjury = async () => {
    setPath("clockOut");
  };

  // step 0  is the comment step for clocking out
  if (step === 0) {
    return (
      <Bases>
        <Contents>
          <Holds background={"white"} className="h-full">
            <Comment
              handleClick={handleNextStep}
              clockInRole={""}
              setCommentsValue={setCommentsValue}
              commentsValue={commentsValue}
              checked={checked}
              handleCheckboxChange={handleCheckboxChange}
              setLoading={setLoading}
            />
          </Holds>
        </Contents>
      </Bases>
    );
  }
  if (step === 1 && !reviewYourTeam) {
    return (
      <ReviewYourDay
        handleClick={handleNextStep}
        prevStep={prevStep}
        loading={loading}
        timesheets={timesheets}
        manager={false} // Pass the manager prop once team is implemented
        setReviewYourTeam={setReviewYourTeam}
      />
    );
  }
  if (step === 1 && reviewYourTeam) {
    return (
      <ReviewYourTeam
        handleClick={handleNextStep}
        prevStep={prevStep}
        loading={loading}
        manager={manager}
      />
    );
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
        scanResult={scanResult?.qrCode}
        savedCostCode={savedCostCode}
        prevStep={prevStep}
        commentsValue={commentsValue}
        pendingTimeSheets={pendingTimeSheets}
      />
    );
  } else {
    return null;
  }
}
