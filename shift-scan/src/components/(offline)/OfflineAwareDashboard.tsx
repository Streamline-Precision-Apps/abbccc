"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Session } from "next-auth";
import { Bases } from "@/components/(reusable)/bases";
import { Contents } from "@/components/(reusable)/contents";
import { Holds } from "@/components/(reusable)/holds";
import { Grids } from "@/components/(reusable)/grids";
import BannerRotating from "@/components/(reusable)/bannerRotating";
import HamburgerMenuNew from "@/components/(animations)/hamburgerMenuNew";
import OfflineDebugger from "@/components/(offline)/offline-debugger";
import ClockOutCheck from "@/components/ClockOutCheck";
import DbWidgetSection from "@/app/(routes)/dashboard/dbWidgetSection";

type OfflineAwareDashboardProps = {
  session: Session;
  serverCurrentPageView: string | undefined;
  serverView: string;
  serverMechanicProjectID: string;
  serverLaborType: string;
  serverPrevTimeSheetId: string | null;
};

export default function OfflineAwareDashboard({
  session,
  serverCurrentPageView,
  serverView,
  serverMechanicProjectID,
  serverLaborType,
  serverPrevTimeSheetId,
}: OfflineAwareDashboardProps) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [dashboardData, setDashboardData] = useState({
    view: serverView,
    mechanicProjectID: serverMechanicProjectID,
    laborType: serverLaborType,
    prevTimeSheetId: serverPrevTimeSheetId,
  });

  useEffect(() => {
    const checkAuthorization = () => {
      // First check server-side cookies
      if (serverCurrentPageView === "dashboard") {
        setIsAuthorized(true);
        return;
      }

      // If server cookies don't have dashboard, check offline localStorage
      if (typeof window !== "undefined") {
        const offlineCurrentPageView = localStorage.getItem(
          "offline_currentPageView",
        );
        const offlineWorkRole = localStorage.getItem("offline_workRole");
        const offlineLaborType = localStorage.getItem("offline_laborType");
        const offlineTimesheetData = localStorage.getItem(
          "current_offline_timesheet",
        );

        // If user has offline dashboard data, allow access
        if (
          offlineCurrentPageView === "dashboard" &&
          (offlineTimesheetData || offlineWorkRole)
        ) {
          console.log(
            "[OFFLINE] Authorizing dashboard access via offline data",
          );

          // Update dashboard data with offline values
          setDashboardData({
            view: offlineWorkRole || serverView || "general",
            mechanicProjectID: serverMechanicProjectID,
            laborType: offlineLaborType || serverLaborType || "",
            prevTimeSheetId: serverPrevTimeSheetId, // Server timesheet takes precedence
          });

          setIsAuthorized(true);
          return;
        }
      }

      // If neither server cookies nor offline data authorize access, redirect
      console.log(
        "[AUTH] No dashboard authorization found, redirecting to home",
      );
      setIsAuthorized(false);
    };

    checkAuthorization();
  }, [
    serverCurrentPageView,
    serverView,
    serverMechanicProjectID,
    serverLaborType,
    serverPrevTimeSheetId,
  ]);

  // Show loading state while checking authorization
  if (isAuthorized === null) {
    return (
      <Bases>
        <Contents>
          <Holds className="w-full h-screen justify-center items-center">
            <div>Loading...</div>
          </Holds>
        </Contents>
      </Bases>
    );
  }

  // Redirect if not authorized
  if (isAuthorized === false) {
    router.push("/");
    return null;
  }

  // Render dashboard if authorized
  return (
    <Bases>
      <OfflineDebugger />
      <Contents>
        <Grids rows={"8"} gap={"5"}>
          <HamburgerMenuNew />
          {/* Clock-out check component - invisible but runs in background */}
          <ClockOutCheck
            userId={session.user.id}
            timesheetId={dashboardData.prevTimeSheetId}
          />
          <Holds className="row-start-2 row-end-4 bg-app-blue bg-opacity-20 w-full h-full justify-center items-center rounded-[10px]">
            <BannerRotating />
          </Holds>
          <Holds background={"white"} className="row-start-4 row-end-9 h-full">
            <DbWidgetSection
              session={session}
              view={dashboardData.view}
              mechanicProjectID={dashboardData.mechanicProjectID}
              laborType={dashboardData.laborType}
            />
          </Holds>
        </Grids>
      </Contents>
    </Bases>
  );
}
