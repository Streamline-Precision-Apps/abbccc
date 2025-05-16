"use client";
import { Contents } from "@/components/(reusable)/contents";
import { useTranslations } from "next-intl";
import { Grids } from "@/components/(reusable)/grids";
import DisplayBreakTime from "./displayBreakTime";
import { useEffect, useState } from "react";
import Hours from "./hours";
import { Holds } from "@/components/(reusable)/holds";
import { usePayPeriodTimeSheet } from "../context/PayPeriodTimeSheetsContext";
import { useRouter } from "next/navigation";
import { Session } from "next-auth";
import Spinner from "@/components/(animations)/spinner";
import { UseTotalPayPeriodHours } from "@/app/(content)/calculateTotal";
import { usePayPeriodData } from "@/hooks/(home)/usePayPeriod";
import WidgetContainer from "./widgetContainer";
import DisplayBanner from "./displayBanner";
import DisplayBreakBanner from "./displayBreakBanner";

type Props = {
  session: Session;
  locale: string;
};

export default function WidgetSection({ session, locale }: Props) {
  // Hooks and state initialization
  const router = useRouter();
  const [toggle, setToggle] = useState(true);
  const { setPayPeriodTimeSheets } = usePayPeriodTimeSheet();
  const { payPeriodSheets, pageView, setPageView, loading } = usePayPeriodData(
    setPayPeriodTimeSheets
  );

  // Derived values
  const date = new Date().toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  });
  const permission = session.user?.permission;
  const accountSetup = session.user?.accountSetup;
  const user = session.user;
  const isManager = ["ADMIN", "SUPERADMIN", "MANAGER"].includes(permission);

  // Custom hooks
  UseTotalPayPeriodHours(payPeriodSheets);

  // Handlers
  const handleToggle = () => setToggle(!toggle);

  // Handle page redirects in a separate useEffect
  useEffect(() => {
    if (pageView === "dashboard") {
      router.push("/dashboard");
    }
    if (pageView === "removeLocalStorage") {
      setPageView("");
    }
    // Uncomment if necessary
    // if (!accountSetup) {
    //   router.push("/signin/signup");
    // }
  }, [pageView, router, accountSetup, setPageView]);

  //-----------------------------------------------------------------------

  // Redirect to dashboard if user is an admin

  // if (
  //   session?.user.permission === "ADMIN" ||
  //   (session?.user.permission === "SUPERADMIN" && window.innerWidth >= 820)
  // ) {
  //   router.push("/admins");
  // }

  // Loading state
  if (loading) {
    return <LoadingState />;
  }
  // Main render
  return (
    <>
      <BannerSection pageView={pageView} user={user} date={date} />

      <MainContentSection
        toggle={toggle}
        pageView={pageView}
        isManager={isManager}
        handleToggle={handleToggle}
        loading={loading}
      />
    </>
  );
}

// Sub-components for better organization
function LoadingState() {
  return (
    <>
      <Holds className="row-span-2 bg-app-blue bg-opacity-20 w-full p-10 h-[80%] rounded-[10px] animate-pulse"></Holds>
      <Holds
        background={"white"}
        className="row-span-5 h-full justify-center items-center animate-pulse"
      >
        <Spinner />
      </Holds>
    </>
  );
}
function BannerSection({
  pageView,
  user,
  date,
}: {
  pageView: string;
  user: any;
  date: string;
}) {
  return (
    <Holds className="row-start-2 row-end-4 bg-app-blue bg-opacity-20 w-full h-full justify-center items-center rounded-[10px]">
      {pageView === "" && (
        <DisplayBanner firstName={user.firstName} date={date} />
      )}
      {pageView === "break" && <DisplayBreakBanner />}
    </Holds>
  );
}
function MainContentSection({
  toggle,
  pageView,
  isManager,
  handleToggle,
  loading,
}: {
  toggle: boolean;
  pageView: string;
  isManager: boolean;
  handleToggle: () => void;
  loading: boolean;
}) {
  return (
    <Holds
      background={toggle ? "white" : "darkBlue"}
      className="row-start-4 row-end-9 h-full"
    >
      <Contents width={"section"} className="py-5">
        <Grids rows={"11"} cols={"2"} gap={"5"}>
          <TimeDisplaySection
            toggle={toggle}
            pageView={pageView}
            handleToggle={handleToggle}
            loading={loading}
          />

          {toggle && (
            <WidgetButtonsSection pageView={pageView} isManager={isManager} />
          )}
        </Grids>
      </Contents>
    </Holds>
  );
}
function TimeDisplaySection({
  toggle,
  pageView,
  handleToggle,
  loading,
}: {
  toggle: boolean;
  pageView: string;
  handleToggle: () => void;
  loading: boolean;
}) {
  if (pageView === "break") {
    return toggle ? (
      <Holds className="col-span-2 row-span-3 gap-5 h-full">
        <DisplayBreakTime setToggle={handleToggle} display={toggle} />
      </Holds>
    ) : (
      <Holds className="col-span-2 row-span-11 gap-5 h-full">
        <Hours setToggle={handleToggle} display={toggle} loading={loading} />
      </Holds>
    );
  }

  return (
    <Holds
      className={
        toggle
          ? "col-span-2 row-span-3 gap-5 h-full"
          : "col-span-2 row-span-11 gap-5 h-full"
      }
    >
      <Hours setToggle={handleToggle} display={toggle} loading={loading} />
    </Holds>
  );
}
function WidgetButtonsSection({
  pageView,
  isManager,
}: {
  pageView: string;
  isManager: boolean;
}) {
  const t = useTranslations("Home");
  return (
    <>
      {isManager && (
        <Holds position={"row"} className="col-span-2 row-span-4 gap-5 h-full">
          <WidgetContainer
            titleImg="/qrCode.svg"
            titleImgAlt={t("QrIcon")}
            text={"QR"}
            background={"lightBlue"}
            translation={"Widgets"}
            href="/dashboard/qr-generator?rPath=/"
          />
          <WidgetContainer
            titleImg="/team.svg"
            titleImgAlt={t("MyTeamIcon")}
            text={"MyTeam"}
            background={"lightBlue"}
            translation={"Widgets"}
            href="/dashboard/myTeam?rPath=/"
          />
        </Holds>
      )}

      <Holds
        className={
          isManager
            ? "col-span-2 row-span-4 gap-5 h-full"
            : "col-span-2 row-span-8 gap-5 h-full"
        }
      >
        <WidgetContainer
          titleImg="/clockIn.svg"
          titleImgAlt={t("ClockInIcon")}
          text={"Clock-btn" + (pageView === "break" ? "-break" : "")}
          textSize={isManager ? "h2" : "h1"}
          background={"green"}
          translation={"Home"}
          href={pageView === "break" ? "/break" : "/clock"}
        />
      </Holds>
    </>
  );
}
