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

type Props = {
  session: Session;
  locale: string;
};

export default function WidgetSection({ session, locale }: Props) {
  const date = new Date().toLocaleDateString(locale, {
    year: "numeric",
    month: "short",
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
        <Holds className="row-span-2 bg-app-blue bg-opacity-20 w-full p-10 h-[80%] my-2 rounded-[10px] animate-pulse"></Holds>
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
      <Holds className="row-span-2 bg-app-blue bg-opacity-20 w-full p-4 my-2 rounded-[10px]">
        {pageView === "" && (
          <Banners>
            <Titles text={"white"} size={"h2"}>
              {t("Banner")}
              {t("Name", {
                firstName: Capitalize(user.firstName),
              })}
              !
            </Titles>
            <Texts text={"white"} size={"p3"}>
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
      <Holds background={"white"} className="row-span-5 h-full">
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
                    <Buttons
                      background={"lightBlue"}
                      href="/dashboard/qr-generator"
                    >
                      <Holds>
                        <Images
                          titleImg="/qrCode.svg"
                          titleImgAlt="QR Code"
                          size={"40"}
                        />
                      </Holds>
                      <Holds>
                        <Texts size={"p3"}>{w("QR")}</Texts>
                      </Holds>
                    </Buttons>
                    <Buttons background={"lightBlue"} href="/dashboard/myTeam">
                      <Holds>
                        <Images
                          titleImg="/team.svg"
                          titleImgAlt="my team"
                          size={"40"}
                        />
                      </Holds>
                      <Holds>
                        <Texts size={"p3"}>{w("MyTeam")}</Texts>
                      </Holds>
                    </Buttons>
                  </Holds>
                )}
                {pageView === "break" ? (
                  <Holds className="col-span-2 row-span-8 gap-5 h-full">
                    <Buttons background={"orange"} href="/break">
                      <Holds className="my-auto">
                        <Holds size={"50"}>
                          <Images
                            titleImg="/clockIn.svg"
                            titleImgAlt="Clock In Icon"
                            size={"70"}
                          />
                        </Holds>
                        <Holds size={"50"}>
                          <Texts size={"p1"}>{f("Clock-btn-break")}</Texts>
                        </Holds>
                      </Holds>
                    </Buttons>
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
                    <Buttons background={"green"} href="/clock">
                      {permission === "ADMIN" ||
                      permission === "SUPERADMIN" ||
                      permission === "MANAGER" ? (
                        <Holds position={"row"} className="my-auto">
                          <Holds size={"60"}>
                            <Texts size={"p1"}>{f("Clock-btn")}</Texts>
                          </Holds>
                          <Holds size={"40"}>
                            <Images
                              titleImg="/clockIn.svg"
                              titleImgAlt="Clock In Icon"
                              size={"70"}
                            />
                          </Holds>
                        </Holds>
                      ) : (
                        <Holds className="my-auto">
                          <Holds size={"50"}>
                            <Images
                              titleImg="/clockIn.svg"
                              titleImgAlt="Clock In Icon"
                              size={"70"}
                            />
                          </Holds>
                          <Holds size={"50"}>
                            <Texts size={"p1"}>{f("Clock-btn")}</Texts>
                          </Holds>
                        </Holds>
                      )}
                    </Buttons>
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
