"use client";
import { Buttons } from "@/components/(reusable)/buttons";
import { Contents } from "@/components/(reusable)/contents";
import { Images } from "@/components/(reusable)/images";
import { Texts } from "@/components/(reusable)/texts";
import { useTranslations } from "next-intl";
import { Grids } from "@/components/(reusable)/grids";
import DisplayBreakTime from "./displayBreakTime";
import { useEffect, useState } from "react";
import Hours from "./hours";
import { Holds } from "@/components/(reusable)/holds";
import { usePayPeriodTimeSheet } from "../context/PayPeriodTimeSheetsContext";
import { useRouter } from "next/navigation";
import { Session } from "next-auth";
import { Banners } from "@/components/(reusable)/banners";
import { Titles } from "@/components/(reusable)/titles";
import Capitalize from "@/utils/captitalize";
import capitalizeAll from "@/utils/capitalizeAll";
import Spinner from "@/components/(animations)/spinner";
import { UseTotalPayPeriodHours } from "@/app/(content)/calculateTotal";
import { usePayPeriodData } from "@/hooks/(home)/usePayPeriod";
import WidgetContainer from "./widgetContainer";

type Props = {
  session: Session;
  locale: string;
};

export default function WidgetSection({ session, locale }: Props) {
  const date = new Date().toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  });
  const router = useRouter();
  const f = useTranslations("Home");
  const w = useTranslations("Widgets");
  const [toggle, setToggle] = useState(true);
  const handleToggle = () => setToggle(!toggle);
  const permission = session.user?.permission;
  const accountSetup = session.user?.accountSetup;
  const t = useTranslations("Home");
  const { setPayPeriodTimeSheets } = usePayPeriodTimeSheet();
  const { payPeriodSheets, pageView, setPageView, loading } = usePayPeriodData(
    setPayPeriodTimeSheets
  );
  const user = session.user;

  UseTotalPayPeriodHours(payPeriodSheets);

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
  if (loading) {
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
  return (
    <>
      <Holds className="row-start-2 row-end-4 bg-app-blue bg-opacity-20 w-full h-full justify-center items-center rounded-[10px]">
        {pageView === "" && (
          <Banners>
            <Titles text={"white"} size={"h2"}>
              {t("Banner")}
              {t("Name", {
                firstName: Capitalize(user.firstName),
              })}
              !
            </Titles>
            <Texts text={"white"} size={"p5"}>
              {t("Date", { date: capitalizeAll(date) })}
            </Texts>
          </Banners>
        )}
        {pageView === "break" && (
          <Banners>
            <Titles text={"white"} size={"h2"}>
              {t("EnjoyYourBreak")}
            </Titles>
            <Texts text={"white"} size={"p3"}>
              {t("HitReturnToClockBackIn")}
            </Texts>
          </Banners>
        )}
      </Holds>
      <Holds
        background={toggle ? "white" : "darkBlue"}
        className="row-start-4 row-end-9 h-full"
      >
        <Contents width={"section"} className="py-5">
          <Grids rows={"11"} cols={"2"} gap={"5"}>
            {pageView === "break" ? (
              <>
                {toggle ? (
                  <Holds
                    className={
                      toggle
                        ? "col-span-2 row-span-3 gap-5 h-full"
                        : "col-span-2 row-span-11 gap-5 h-full"
                    }
                  >
                    <DisplayBreakTime
                      setToggle={handleToggle}
                      display={toggle}
                    />
                  </Holds>
                ) : (
                  <Holds className="col-span-2 row-span-11 gap-5 h-full">
                    <Hours
                      setToggle={handleToggle}
                      display={toggle}
                      loading={loading}
                    />
                  </Holds>
                )}
              </>
            ) : (
              <Holds
                className={
                  toggle
                    ? "col-span-2 row-span-3 gap-5 h-full"
                    : "col-span-2 row-span-11 gap-5 h-full"
                }
              >
                <Hours
                  setToggle={handleToggle}
                  display={toggle}
                  loading={loading}
                />
              </Holds>
            )}
            {toggle ? (
              <>
                {(permission === "ADMIN" ||
                  permission === "SUPERADMIN" ||
                  permission === "MANAGER") && (
                  <Holds
                    position={"row"}
                    className="col-span-2 row-span-4 gap-5 h-full"
                  >
                    <WidgetContainer
                      titleImg="/qrCode.svg"
                      titleImgAlt="QR Code"
                      text={"QR"}
                      background={"lightBlue"}
                      translation={"Widgets"}
                      href="/dashboard/qr-generator?rPath=/"
                    />

                    <WidgetContainer
                      titleImg="/team.svg"
                      titleImgAlt="my team"
                      text={"MyTeam"}
                      background={"lightBlue"}
                      translation={"Widgets"}
                      href="/dashboard/myTeam?rPath=/"
                    />
                  </Holds>
                )}
                {pageView === "break" ? (
                  <Holds className="col-span-2 row-span-8 gap-5 h-full">
                    <WidgetContainer
                      titleImg="/clockBreak.svg"
                      titleImgAlt="Clock In Icon"
                      text={"Clock-btn-break"}
                      background={"orange"}
                      translation={"Home"}
                      href={"/break"}
                    />
                  </Holds>
                ) : (
                  <Holds
                    className={
                      permission === "ADMIN" ||
                      permission === "SUPERADMIN" ||
                      permission === "MANAGER"
                        ? `col-span-2 row-span-4 gap-5 h-full`
                        : `col-span-2 row-span-8 gap-5 h-full`
                    }
                  >
                    {permission === "ADMIN" ||
                    permission === "SUPERADMIN" ||
                    permission === "MANAGER" ? (
                      <WidgetContainer
                        titleImg="/clockIn.svg"
                        titleImgAlt="Clock In Icon"
                        text={"Clock-btn"}
                        textSize="h2"
                        background={"green"}
                        translation={"Home"}
                        href={"/clock"}
                      />
                    ) : (
                      <WidgetContainer
                        titleImg="/clockIn.svg"
                        titleImgAlt="Clock In Icon"
                        text={"Clock-btn"}
                        textSize="h1"
                        background={"green"}
                        translation={"Home"}
                        href={"/clock"}
                      />
                    )}
                  </Holds>
                )}
              </>
            ) : null}
          </Grids>
        </Contents>
      </Holds>
    </>
  );
}
