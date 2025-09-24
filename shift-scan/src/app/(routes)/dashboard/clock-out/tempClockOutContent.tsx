"use client";
import { Contents } from "@/components/(reusable)/contents";
import { Holds } from "@/components/(reusable)/holds";
import { ChangeEvent, useEffect, useState } from "react";
import { InjuryReportContent } from "./(components)/injury-report/injuryReportContent";
import { useCurrentView } from "@/app/context/CurrentViewContext";
import ReviewYourDay from "./(components)/reviewYourDay/reviewYourDay";
import { Bases } from "@/components/(reusable)/bases";
import { LaborClockOut } from "./(components)/clock-out-Verification/laborClockOut";
import { PreInjuryReport } from "./(components)/no-injury";
import Comment from "./(components)/comment";
import { useRouter } from "next/navigation";
import { fetchWithOfflineCache } from "@/utils/offlineApi";

type crewUsers = {
  id: string;
  firstName: string;
  lastName: string;
  clockedIn: boolean;
};

type TimesheetFilter =
  | "timesheetHighlights"
  | "truckingMileage"
  | "truckingEquipmentHaulLogs"
  | "truckingMaterialHaulLogs"
  | "truckingRefuelLogs"
  | "truckingStateLogs"
  | "tascoHaulLogs"
  | "tascoRefuelLogs"
  | "equipmentLogs"
  | "equipmentRefuelLogs"
  | "mechanicLogs";

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
  status: string; // Added status for filtering
  Jobsite: {
    name: string;
  };
  TascoLogs: {
    laborType: string;
    shiftType: string;
  }[];
};

interface ClockOutContentProps {
  userId: string;
  permission: string;
  clockOutComment: string;
}

export default function TempClockOutContent({
  userId,
  permission,
  clockOutComment,
}: ClockOutContentProps) {
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(0); // Using setStep instead of incrementStep
  const [path, setPath] = useState("clockOut");
  const [checked, setChecked] = useState(false);
  const [base64String, setBase64String] = useState<string>("");
  const { currentView } = useCurrentView();
  const router = useRouter();
  const [commentsValue, setCommentsValue] = useState(clockOutComment || "");
  const [timesheets, setTimesheets] = useState<TimeSheet[]>([]);
  // Removed reviewYourTeam state, not needed for manager flow
  const [pendingTimeSheets, setPendingTimeSheets] = useState<TimeSheet>();
  const [editFilter, setEditFilter] = useState<TimesheetFilter | null>(null);
  const [editDate, setEditDate] = useState<string>("");
  const [focusIds, setFocusIds] = useState<string[]>([]);
  const [employeeId, setEmployeeId] = useState<string>("");
  const [teamUsers, setTeamUsers] = useState<crewUsers[]>([]);
  const [wasInjured, setWasInjured] = useState<boolean>(false);
  const [currentTimesheetId, setCurrentTimesheetId] = useState<number>();

  const incrementStep = () => {
    setStep((prevStep) => prevStep + 1); // Increment function
  };

  const prevStep = () => {
    setStep((prevStep) => prevStep - 1); // Increment function
  };

  useEffect(() => {
    setCommentsValue(clockOutComment || "");
  }, [clockOutComment]);

  useEffect(() => {
    const getRecentTimeCard = async () => {
      try {
        console.log("🔍 Clock-out: Fetching recent timecard...");
        console.log("🔍 Clock-out: User agent:", navigator.userAgent);
        console.log("🔍 Clock-out: Document cookies:", document.cookie);

        // Use the same fetchWithOfflineCache pattern as banner component
        const data = await fetchWithOfflineCache(
          "recentTimecard",
          async () => {
            console.log("🔍 Clock-out: Making raw fetch call...");
            const response = await fetch("/api/getRecentTimecard");
            console.log("🔍 Clock-out: Raw response status:", response.status);
            console.log("🔍 Clock-out: Raw response headers:", [
              ...response.headers.entries(),
            ]);
            const text = await response.text();
            console.log(
              "🔍 Clock-out: Raw response text:",
              text.substring(0, 200),
            );

            try {
              return JSON.parse(text);
            } catch (parseError) {
              console.error("🔍 Clock-out: JSON parse error:", parseError);
              console.error(
                "🔍 Clock-out: Response was not JSON:",
                text.substring(0, 500),
              );
              return null;
            }
          },
          { forceRefresh: true }, // Force fresh data for timesheet check
        );

        console.log("🔍 Clock-out: API response:", data);
        console.log("🔍 Clock-out: Response has ID?", !!data?.id);

        // Check if we have valid timesheet data before accessing id
        if (data && data.id) {
          console.log("✅ Clock-out: Found timesheet with ID:", data.id);
          setCurrentTimesheetId(data.id);
        } else {
          // Check if we're offline and have offline timesheet data
          const offlineTimesheet = localStorage.getItem(
            "current_offline_timesheet",
          );
          if (offlineTimesheet) {
            try {
              const parsedTimesheet = JSON.parse(offlineTimesheet);
              console.log(
                "✅ Clock-out: Using offline timesheet ID:",
                parsedTimesheet.id,
              );
              setCurrentTimesheetId(parsedTimesheet.id);
              return;
            } catch (parseError) {
              console.error("Failed to parse offline timesheet:", parseError);
            }
          }

          console.warn(
            "❌ Clock-out: No active timesheet found, redirecting to dashboard",
          );
          console.warn(
            "❌ Clock-out: Expected data with { id: number, endTime: null }",
          );
          // Redirect to home page if no active timesheet
          router.push("/");
          return;
        }
      } catch (error) {
        console.error("❌ Clock-out: Error fetching recent time card:", error);
        // Redirect on error as well
        router.push("/");
        return;
      }
    };
    getRecentTimeCard();
  }, [router]);

  // Batch fetch all clock-out details (timesheets, comment, signature)
  useEffect(() => {
    const fetchClockoutDetails = async () => {
      setLoading(true);
      try {
        // Use fetchWithOfflineCache for offline support
        const data = await fetchWithOfflineCache(
          "clockoutDetails",
          async () => {
            const response = await fetch("/api/clockoutDetails");
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
          },
          { ttl: 5 * 60 * 1000 }, // 5 minute cache
        );

        setTimesheets(data.timesheets || []);
        setBase64String(data.signature || "");

        // Set the most recent active timesheet (endTime === null)
        const activeTimeSheet = (data.timesheets || [])
          .filter((timesheet: TimeSheet) => timesheet.endTime === null)
          .sort(
            (a: TimeSheet, b: TimeSheet) =>
              new Date(b.startTime).getTime() - new Date(a.startTime).getTime(),
          )[0];
        setPendingTimeSheets(activeTimeSheet || undefined);
      } catch (error) {
        console.error("Error fetching clock-out details:", error);

        // Try to load offline timesheet data when API fails
        const offlineTimesheet = localStorage.getItem(
          "current_offline_timesheet",
        );
        if (offlineTimesheet) {
          try {
            const parsedTimesheet = JSON.parse(offlineTimesheet);
            console.log(
              "✅ Clock-out: Loading offline timesheet for review:",
              parsedTimesheet,
            );

            // Transform offline timesheet to match TimeSheet interface
            const transformedTimesheet = {
              submitDate: parsedTimesheet.date,
              date: parsedTimesheet.date,
              id: parsedTimesheet.id,
              userId: parsedTimesheet.userId,
              jobsiteId: parsedTimesheet.jobsiteId,
              costcode:
                parsedTimesheet.costCode || parsedTimesheet.costcode || "",
              startTime: parsedTimesheet.startTime,
              endTime: parsedTimesheet.endTime,
              workType: parsedTimesheet.workType,
              status: parsedTimesheet.status || "DRAFT",
              Jobsite: {
                name:
                  parsedTimesheet.jobsiteLabel ||
                  parsedTimesheet.Jobsite?.name ||
                  "Unknown Jobsite",
              },
              TascoLogs: [],
            };

            setTimesheets([transformedTimesheet]);
            setPendingTimeSheets(transformedTimesheet);
          } catch (parseError) {
            console.error("Failed to parse offline timesheet:", parseError);
            // Set fallback values for offline mode
            setTimesheets([]);
            setPendingTimeSheets(undefined);
          }
        } else {
          // Set fallback values for offline mode
          setTimesheets([]);
          setPendingTimeSheets(undefined);
        }

        setBase64String("");
      } finally {
        setLoading(false);
      }
    };
    fetchClockoutDetails();
  }, [currentView]);

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        // Add timeout and use fetchWithOfflineCache for consistency
        const data = await fetchWithOfflineCache(
          "myTeamsUsers",
          async () => {
            const response = await fetch("/api/getMyTeamsUsers");
            if (!response.ok) return [];
            return await response.json();
          },
          { ttl: 10 * 60 * 1000 }, // 10 minute cache
        );
        setTeamUsers(data || []);
      } catch (error) {
        console.error("Error fetching team users:", error);
        setTeamUsers([]); // Fallback to empty array
      }
    };
    fetchTeamMembers();
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
              handleClick={() => setStep(1)}
              clockInRole={""}
              setCommentsValue={setCommentsValue}
              commentsValue={commentsValue}
              checked={checked}
              handleCheckboxChange={handleCheckboxChange}
              loading={loading}
              setLoading={setLoading}
            />
          </Holds>
        </Contents>
      </Bases>
    );
  }

  if (step === 1) {
    return (
      <ReviewYourDay
        handleClick={handleNextStep}
        prevStep={prevStep}
        loading={loading}
        timesheets={timesheets}
        setReviewYourTeam={() => {}}
        currentTimesheetId={currentTimesheetId}
      />
    );
  }

  if (step === 2) {
    // PreInjuryReport for both managers and non-managers after review step
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
    // Injury Report step
    return (
      <InjuryReportContent
        base64String={base64String}
        handleNextStep={handleSubmitInjury}
        prevStep={prevStep}
        setWasInjured={setWasInjured}
      />
    );
  } else if (step === 3 && path === "clockOut") {
    // Final Clock-Out step
    return (
      <LaborClockOut
        prevStep={prevStep}
        commentsValue={commentsValue}
        pendingTimeSheets={pendingTimeSheets}
        wasInjured={wasInjured}
        timeSheetId={currentTimesheetId}
      />
    );
  } else {
    return null;
  }
}
