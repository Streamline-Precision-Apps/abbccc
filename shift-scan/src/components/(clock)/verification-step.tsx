"use client";
import React, { Dispatch, SetStateAction, useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useScanData } from "@/app/context/JobSiteScanDataContext";
import { useSavedCostCode } from "@/app/context/CostCodeContext";
import { useTimeSheetData } from "@/app/context/TimeSheetIdContext";
import { handleGeneralTimeSheet } from "@/actions/timeSheetActions";
import {
  executeOfflineFirstAction,
  isOfflineTimesheet,
  getOfflineActionsStatus,
} from "@/utils/offlineFirstWrapper";
import { useEnhancedOfflineStatus } from "@/hooks/useEnhancedOfflineStatus";
import { Buttons } from "../(reusable)/buttons";
import { Contents } from "../(reusable)/contents";
import { Labels } from "../(reusable)/labels";
import { Inputs } from "../(reusable)/inputs";
import { Forms } from "../(reusable)/forms";
import { Images } from "../(reusable)/images";
import { useSession } from "next-auth/react";
import { Holds } from "../(reusable)/holds";
import { Grids } from "../(reusable)/grids";
import { useCommentData } from "@/app/context/CommentContext";
import {
  setCurrentPageView,
  setLaborType,
  setWorkRole,
} from "@/actions/cookieActions";
import { Titles } from "../(reusable)/titles";
import { useRouter } from "next/navigation";
import Spinner from "../(animations)/spinner";
import { TitleBoxes } from "../(reusable)/titleBoxes";
import { Texts } from "../(reusable)/texts";

type Options = {
  id: string;
  label: string;
  code: string;
};
type VerifyProcessProps = {
  type: string;
  role: string;
  option?: string;
  comments?: string;
  handlePreviousStep?: () => void;
  laborType?: string;
  clockInRoleTypes: string | undefined;
  returnPathUsed: boolean;
  setStep: Dispatch<SetStateAction<number>>;
  jobsite: Options | null;
  cc: Options | null;
};

export default function VerificationStep({
  type,
  comments,
  role,
  handlePreviousStep,
  laborType,
  clockInRoleTypes,
  returnPathUsed,
  setStep,
  jobsite,
  cc,
}: VerifyProcessProps) {
  const t = useTranslations("Clock");
  const [date] = useState(new Date());
  const [loading, setLoading] = useState<boolean>(false);
  const { data: session } = useSession();
  const { savedCommentData, setCommentData } = useCommentData();
  const router = useRouter();
  const { isOnline, summary } = useEnhancedOfflineStatus();

  // Check offline status and pending actions
  useEffect(() => {
    // Listen for offline action events is handled by useEnhancedOfflineStatus
    console.log(`Connection status: ${isOnline ? "Online" : "Offline"}`);
  }, [isOnline]);

  if (!session) return null; // Conditional rendering for session
  const { id } = session.user;

  const fetchRecentTimeSheetId = async (): Promise<string | null> => {
    try {
      // Import the offline API wrapper
      const { getRecentTimecardOffline } = await import(
        "@/utils/offlineApiWrapper"
      );
      const data = await getRecentTimecardOffline();
      console.log("[TIMESHEET] Recent timesheet data:", data);
      return data?.id || null;
    } catch (error) {
      console.error("Error fetching recent timesheet ID:", error);
      return null;
    }
  };

  const handleSubmit = async () => {
    if (!id) {
      console.error("User ID does not exist");
      return;
    }
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("submitDate", new Date().toISOString());
      formData.append("userId", id?.toString() || "");
      formData.append("date", new Date().toISOString());
      formData.append("jobsiteId", jobsite?.id || "");
      formData.append("costcode", cc?.code || "");
      formData.append("startTime", new Date().toISOString());
      formData.append("workType", role);

      // If switching jobs, include the previous timesheet ID
      if (type === "switchJobs") {
        let timeSheetId: string | null = null;

        if (isOnline) {
          timeSheetId = await fetchRecentTimeSheetId();
        } else {
          // In offline mode, try to get the most recent offline timesheet
          const offlineStatus = getOfflineActionsStatus();
          const recentOfflineTimesheet = offlineStatus.pending.sort(
            (a, b) => b.timestamp - a.timestamp,
          )[0];
          timeSheetId = recentOfflineTimesheet?.id || null;
        }

        if (!timeSheetId) {
          throw new Error("No valid TimeSheet ID found for job switch.");
        }

        formData.append("id", timeSheetId);
        formData.append("endTime", new Date().toISOString());
        formData.append(
          "timeSheetComments",
          savedCommentData?.id.toString() || "",
          savedCommentData?.id.toString() || "",
        );
        formData.append("type", "switchJobs");
      }

      // Use the offline-first function
      const response = await executeOfflineFirstAction(
        "handleGeneralTimeSheet",
        handleGeneralTimeSheet,
        formData,
      );

      // Update state and redirect
      const timesheetId = response || "";
      setTimeSheetData({ id: timesheetId });
      setCommentData(null);
      localStorage.removeItem("savedCommentData");

      // Store timesheet info for offline dashboard use
      if (isOfflineTimesheet(timesheetId)) {
        const offlineTimesheetData = {
          id: timesheetId,
          userId: id,
          date: new Date().toISOString(),
          startTime: new Date().toISOString(),
          endTime: null,
          status: "DRAFT",
          workType: role,
          jobsiteId: jobsite?.id || "",
          costCode: cc?.code || "",
          jobsiteLabel: jobsite?.label || "",
          costCodeLabel: cc?.label || "",
          isOffline: true,
          offlineTimestamp: Date.now(),
        };

        // Store current timesheet
        localStorage.setItem(
          "current_offline_timesheet",
          JSON.stringify(offlineTimesheetData),
        );

        // Store comprehensive dashboard data
        const dashboardData = {
          timesheet: offlineTimesheetData,
          logs: [], // Start with empty logs for new timesheet
          projects: [],
          lastUpdate: Date.now(),
          workRole: role,
          isOfflineSession: true,
        };

        localStorage.setItem(
          "offline_dashboard_data",
          JSON.stringify(dashboardData),
        );

        // Also store for API fallback
        localStorage.setItem(
          "cached_recent_timecard",
          JSON.stringify(offlineTimesheetData),
        );

        console.log(`[OFFLINE] Stored comprehensive offline timesheet data:`, {
          timesheetId,
          jobsite: jobsite?.label,
          costCode: cc?.label,
          workType: role,
        });
      }

      // Update cookies and navigate
      await Promise.all([
        setCurrentPageView("dashboard"),
        setWorkRole(role),
        setLaborType(clockInRoleTypes || ""),
      ]);

      // Check if this was an offline operation
      if (isOfflineTimesheet(timesheetId)) {
        console.log(`[OFFLINE] Timesheet created offline: ${timesheetId}`);
        console.log(`[OFFLINE] Navigating to dashboard with offline data`);
        // Show user that they're working offline but the action was saved
      }

      console.log(
        `[NAVIGATION] Redirecting to dashboard with timesheet: ${timesheetId}`,
      );
      router.push("/dashboard");
    } catch (error) {
      console.error("Error in handleSubmit:", error);

      // Show user-friendly error message
      if (!isOnline) {
        console.log("[OFFLINE] Action saved locally and will sync when online");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Holds className="h-full w-full relative">
      {loading && (
        <Holds className="h-full absolute justify-center items-center">
          <Spinner size={40} />
        </Holds>
      )}
      <Holds
        background={"white"}
        className={loading ? `h-full w-full opacity-[0.50]` : `h-full w-full `}
      >
        <Grids rows={"7"} gap={"5"} className="h-full w-full">
          {/* Add offline status indicator */}
          {!isOnline && (
            <Holds className="absolute top-2 right-2 z-10">
              <div className="flex items-center gap-2 bg-amber-100 border border-amber-400 text-amber-800 px-3 py-1 rounded-md text-sm">
                <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                <span>Offline Mode</span>
              </div>
            </Holds>
          )}

          <Holds className="row-start-1 row-end-2 h-full w-full">
            <TitleBoxes position={"row"} onClick={handlePreviousStep}>
              <Titles position={"right"} size={"h4"}>
                {t("VerifyJobSite")}
              </Titles>
              <Images
                titleImg="/clockIn.svg"
                titleImgAlt="Verify"
                className="w-10 h-10"
              />
            </TitleBoxes>
          </Holds>
          <Holds className="row-start-2 row-end-8 h-full w-full">
            <Contents width={"section"}>
              <Grids rows={"7"} gap={"5"} className="h-full w-full pb-5">
                <Holds
                  background={"timeCardYellow"}
                  className="row-start-1 row-end-7 h-full border-[3px] rounded-[10px] border-black"
                >
                  <Contents width={"section"} className="h-full py-2">
                    <Holds className="flex flex-row justify-between pb-3">
                      <Texts size={"p7"} position={"left"}>
                        {date.toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "numeric",
                          day: "numeric",
                        })}
                      </Texts>
                      <Texts size={"p7"} position={"right"}>
                        {date.toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                          hour12: true,
                        })}
                      </Texts>
                    </Holds>

                    <Labels htmlFor="jobsiteId" size={"p3"} position={"left"}>
                      {t("LaborType")}
                    </Labels>
                    <Inputs
                      state="disabled"
                      name="jobsiteId"
                      variant={"white"}
                      data={"General Labor"}
                      className="text-center"
                    />

                    <Labels htmlFor="jobsiteId" size={"p3"} position={"left"}>
                      {t("JobSite-label")}
                    </Labels>
                    <Inputs
                      state="disabled"
                      name="jobsiteId"
                      variant={"white"}
                      data={jobsite?.label || ""}
                      className="text-center"
                    />
                    <Labels htmlFor="costcode" size={"p3"} position={"left"}>
                      {t("CostCode-label")}
                    </Labels>
                    <Inputs
                      state="disabled"
                      name="costcode"
                      variant={"white"}
                      data={cc?.label || ""}
                      className="text-center"
                    />
                  </Contents>
                </Holds>

                <Holds className="row-start-7 row-end-8   ">
                  <Buttons
                    onClick={() => handleSubmit()}
                    background={"green"}
                    className=" w-full h-full py-2"
                  >
                    <Titles size={"h2"}>
                      {!isOnline ? t("SaveOffline") : t("StartDay")}
                    </Titles>
                  </Buttons>
                </Holds>
              </Grids>
            </Contents>
          </Holds>
        </Grids>
      </Holds>
    </Holds>
  );
}
