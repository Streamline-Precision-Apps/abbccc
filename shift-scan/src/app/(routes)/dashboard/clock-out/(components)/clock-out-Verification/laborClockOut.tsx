"use client";
import { updateTimeSheet } from "@/actions/timeSheetActions";
import { executeOfflineFirstAction } from "@/utils/offlineFirstWrapper";
import { useOffline } from "@/providers/OfflineProvider";
import Spinner from "@/components/(animations)/spinner";
import { Bases } from "@/components/(reusable)/bases";
import { Buttons } from "@/components/(reusable)/buttons";
import { Contents } from "@/components/(reusable)/contents";
import { Holds } from "@/components/(reusable)/holds";
import { Images } from "@/components/(reusable)/images";
import { Inputs } from "@/components/(reusable)/inputs";
import { Labels } from "@/components/(reusable)/labels";
import { Texts } from "@/components/(reusable)/texts";
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";
import { Titles } from "@/components/(reusable)/titles";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";

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
  TascoLogs: {
    laborType: string;
    shiftType: string;
  }[];
};

export const LaborClockOut = ({
  prevStep,
  commentsValue,
  pendingTimeSheets,
  wasInjured,
  timeSheetId,
}: {
  prevStep: () => void;
  commentsValue: string;
  pendingTimeSheets: TimeSheet | undefined;
  wasInjured: boolean;
  timeSheetId: number | undefined;
}) => {
  // const { token, notificationPermissionStatus } = useFcmToken();
  const t = useTranslations("ClockOut");
  const [date] = useState(new Date());
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const { data: session } = useSession();
  const { isOnline } = useOffline();

  async function handleSubmitTimeSheet() {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("id", timeSheetId?.toString() || "");
      formData.append("userId", session?.user.id?.toString() || "");
      formData.append("endTime", new Date().toISOString());
      formData.append("timeSheetComments", commentsValue);
      formData.append("wasInjured", wasInjured.toString());

      // Use offline-first approach for updateTimeSheet
      const result = await executeOfflineFirstAction(
        "updateTimeSheet",
        updateTimeSheet,
        formData,
      );

      if (result) {
        // Only try to send notifications when online
        if (isOnline) {
          try {
            const response = await fetch("/api/notifications/send-multicast", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                topic: "timecard-submission",
                title: "New Timesheet Submission",
                message: `A new submission has been created and is pending approval.`,
                link: `/admins/timesheets`,
              }),
            });

            // Only try to parse JSON if the response is ok and has content
            if (
              response.ok &&
              response.headers.get("content-type")?.includes("application/json")
            ) {
              const data = await response.json();
              console.log("Notification sent successfully:", data);
            } else if (!response.ok) {
              console.warn(
                "Notification API returned non-ok status:",
                response.status,
                response.statusText,
              );
            }
          } catch (notificationError) {
            // Don't let notification failures block the clock-out process
            console.warn(
              "Failed to send notification, but timesheet was saved:",
              notificationError,
            );
          }
        } else {
          console.log("[OFFLINE] Timesheet clock-out saved locally for sync");
        }
      }

      setLoading(false);

      // Navigate to home page immediately regardless of online/offline status
      router.push("/");

      // Clear saved storage after navigation, but preserve offline action queue
      setTimeout(() => {
        if (isOnline) {
          fetch("/api/cookies?method=deleteAll");
          // Only clear localStorage when online since actions have been synced
          localStorage.clear();
        } else {
          // When offline, preserve the offline action queue and only clear non-essential data
          const offlineQueue = localStorage.getItem("offline_action_queue");
          const offlineDashboardData = localStorage.getItem(
            "offline_dashboard_data",
          );
          const currentOfflineTimesheet = localStorage.getItem(
            "current_offline_timesheet",
          );

          // Clear most localStorage but keep offline data
          localStorage.clear();

          // Restore essential offline data
          if (offlineQueue) {
            localStorage.setItem("offline_action_queue", offlineQueue);
          }
          if (offlineDashboardData) {
            localStorage.setItem(
              "offline_dashboard_data",
              offlineDashboardData,
            );
          }
          if (currentOfflineTimesheet) {
            localStorage.setItem(
              "current_offline_timesheet",
              currentOfflineTimesheet,
            );
          }

          console.log(
            "[OFFLINE] Preserved offline action queue for later sync",
          );
        }
      }, 500);
    } catch (error) {
      console.error("🔴 Failed to process the time sheet:", error);
      setLoading(false);

      // Still navigate to home page - the action will be retried when online
      if (!isOnline) {
        console.log(
          "[OFFLINE] Clock-out saved locally and will sync when online",
        );
        router.push("/");
      } else {
        // If online but error occurred, still try to navigate
        router.push("/");
      }
    }
  }

  return (
    <Bases>
      <Contents>
        {loading && (
          <Holds className="h-full absolute justify-center items-center">
            <Spinner size={40} />
          </Holds>
        )}
        <Holds
          background={"white"}
          className={
            loading ? `h-full w-full  opacity-[0.50]` : `h-full w-full `
          }
        >
          <TitleBoxes onClick={prevStep} className="h-24">
            <Holds className="h-full justify-end">
              <Holds position={"row"} className="justify-center gap-3">
                <Titles size={"lg"} position={"right"}>
                  {t("ClockOut")}
                </Titles>

                <Images
                  titleImg="/clockOut.svg"
                  titleImgAlt="Verify"
                  className="max-w-6 h-auto"
                />
              </Holds>
            </Holds>
          </TitleBoxes>

          <Contents width={"section"}>
            <Holds
              background={"timeCardYellow"}
              className="h-full w-full rounded-[10px] border-[3px] border-black mt-8"
            >
              <Holds className="h-full w-full px-3 py-2">
                <Holds position={"row"} className="justify-between">
                  <Texts size={"p7"} className="font-bold">
                    {date.toLocaleDateString()}
                  </Texts>
                  <Texts size={"p7"}>
                    {date.toLocaleTimeString("en-US", {
                      hour: "numeric",
                      minute: "numeric",
                      second: "numeric",
                      hour12: false,
                    })}
                  </Texts>
                </Holds>
                <Holds className="h-full w-full py-5">
                  <Labels htmlFor="laborType" size={"p5"} position={"left"}>
                    {t("LaborType")}
                  </Labels>
                  {pendingTimeSheets?.workType === "TASCO" ? (
                    <Inputs
                      state="disabled"
                      name="laborType"
                      className="text-center"
                      variant={"white"}
                      data={
                        pendingTimeSheets?.TascoLogs[0].laborType ===
                        "tascoAbcdLabor"
                          ? t("TascoLabor")
                          : t("TascoOperator")
                      }
                    />
                  ) : (
                    <Inputs
                      state="disabled"
                      name="laborType"
                      className="text-center"
                      variant={"white"}
                      data={
                        pendingTimeSheets?.workType === "LABOR"
                          ? t("GeneralLabor")
                          : pendingTimeSheets?.workType === "TRUCK_DRIVER"
                            ? t("TruckDriver")
                            : pendingTimeSheets?.workType === "MECHANIC"
                              ? t("Mechanic")
                              : ""
                      }
                    />
                  )}
                  {pendingTimeSheets?.workType === "TASCO" && (
                    <>
                      <Labels htmlFor="laborType" size={"p5"} position={"left"}>
                        {t("ShiftType")}
                      </Labels>
                      <Inputs
                        state="disabled"
                        name="laborType"
                        className="text-center"
                        variant={"white"}
                        data={pendingTimeSheets?.TascoLogs[0].shiftType || ""}
                      />
                    </>
                  )}
                  <Labels htmlFor="jobsiteId" size={"p5"} position={"left"}>
                    {t("JobSite")}
                  </Labels>
                  <Inputs
                    state="disabled"
                    name="jobsiteId"
                    className="text-center"
                    variant={"white"}
                    data={pendingTimeSheets?.Jobsite.name || ""}
                  />
                  <Labels htmlFor="costcode" size={"p6"} position={"left"}>
                    {t("CostCode")}
                  </Labels>
                  <Inputs
                    state="disabled"
                    name="costcode"
                    variant={"white"}
                    className="text-center"
                    data={pendingTimeSheets?.costcode || ""}
                  />
                </Holds>
              </Holds>
            </Holds>
          </Contents>

          <Contents width={"section"} className="my-5 h-[70px]">
            <Buttons
              background={"red"}
              onClick={handleSubmitTimeSheet}
              className="h-[60px] w-full"
            >
              <Titles size={"lg"}>{t("EndDay")}</Titles>
            </Buttons>
          </Contents>
        </Holds>
      </Contents>
    </Bases>
  );
};
