"use client";
import { Buttons } from "@/components/(reusable)/buttons";
import { Contents } from "@/components/(reusable)/contents";
import { Images } from "@/components/(reusable)/images";
import { Texts } from "@/components/(reusable)/texts";
import { useTranslations } from "next-intl";
import { Grids } from "@/components/(reusable)/grids";
import DisplayBreakTime from "./displayBreakTime";
import { useEffect, useMemo, useState } from "react";
import Hours from "./hours";
import { Holds } from "@/components/(reusable)/holds";
import { getAuthStep, setAuthStep } from "../api/auth";
import { usePayPeriodHours } from "../context/PayPeriodHoursContext";
import { usePayPeriodTimeSheet } from "../context/PayPeriodTimeSheetsContext";
import { useRouter } from "next/navigation";
import { Session } from "next-auth";
import { PayPeriodTimesheets } from "@/lib/types";
type props = {
  session: Session;
};
export default function WidgetSection({ session }: props) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const f = useTranslations("Home");
  const w = useTranslations("Widgets");
  const e = useTranslations("Err-Msg");
  const [toggle, setToggle] = useState(true);
  const handleToggle = () => setToggle(!toggle);
  const authStep = getAuthStep();
  const permission = session.user.permission;
  const accountSetup = session.user.accountSetup;

  const { setPayPeriodHours } = usePayPeriodHours();
  const { setPayPeriodTimeSheets } = usePayPeriodTimeSheet();
  const [payPeriodSheets, setPayPeriodSheets] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/getPayPeriodTimeSheets");
        const data = await response.json();
        setPayPeriodSheets(data);
        setPayPeriodTimeSheets(data); // Update the context after fetching
      } catch (error) {
        console.error(e("PayPeriod-Fetch"), error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [setPayPeriodTimeSheets]);

  //---------------------------------------------------------------------
  // Redirect to dashboard if authStep is success
  useEffect(() => {
    if (authStep === "success") {
      router.push("/dashboard");
    }
    if (authStep === "removeLocalStorage") {
      localStorage.clear();
      setAuthStep("");
    }
    if (!accountSetup) {
      router.push("/signin/signup");
    }
  }, [authStep, router, accountSetup]);

  //-----------------------------------------------------------------------
  // Calculate total pay period hours
  const totalPayPeriodHours = useMemo(() => {
    if (!payPeriodSheets.length) return 0;
    return payPeriodSheets
      .filter((sheet: PayPeriodTimesheets) => sheet.duration !== null)
      .reduce(
        (total, sheet: PayPeriodTimesheets) => total + (sheet.duration ?? 0),
        0
      );
  }, [payPeriodSheets]);

  useEffect(() => {
    setPayPeriodHours(totalPayPeriodHours.toFixed(2));
  }, [totalPayPeriodHours, setPayPeriodHours]);

  return (
    <Contents width={"section"} className="py-5">
      <Grids rows={"5"} cols={"2"} gap={"5"}>
        {authStep === "break" ? (
          <>
            {/* A ternary statement to display the break widget or view hours */}
            {toggle ? (
              <Holds
                className={
                  toggle
                    ? "col-span-2 row-span-1 gap-5 h-full"
                    : "col-span-2 row-span-5 gap-5 h-full"
                }
              >
                <DisplayBreakTime setToggle={handleToggle} display={toggle} />
              </Holds>
            ) : (
              <Holds className="bg-pink-700 col-span-2 row-span-5 gap-5 h-full">
                <Hours //----------------------active hour viewer on break
                  setToggle={handleToggle}
                  display={toggle}
                  loading={loading}
                />
              </Holds>
            )}
          </>
        ) : (
          <>
            <Holds
              className={
                toggle
                  ? "col-span-2 row-span-1 gap-5 h-full"
                  : "col-span-2 row-span-5 gap-5 h-full"
              }
            >
              <Hours //----------------------This is the view hours widget while clocked out
                setToggle={handleToggle}
                display={toggle}
                loading={loading}
              />
            </Holds>
          </>
        )}
        {toggle ? (
          <>
            {permission === "ADMIN" ||
            permission === "SUPERADMIN" ||
            permission === "MANAGER" ? (
              <>
                <Holds
                  position={"row"}
                  className="col-span-2 row-span-2 gap-5 h-full"
                >
                  <Buttons //----------------------This is the qr generator widget
                    background={"lightBlue"}
                    href="/dashboard/qr-generator"
                  >
                    <Holds>
                      <Images
                        titleImg="/qr.svg"
                        titleImgAlt="QR Code"
                        size={"40"}
                      />
                    </Holds>
                    <Holds>
                      <Texts size={"p3"}>{w("QR")}</Texts>
                    </Holds>
                  </Buttons>
                  <Buttons //----------------------This is the my team widget
                    background={"lightBlue"}
                    href="/dashboard/myTeam"
                  >
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
              </>
            ) : null}
            {authStep === "break" ? (
              <Holds className="col-span-2 row-span-2 gap-5 h-full">
                <Buttons //----------------------This is the clock in widget while on break
                  background={"orange"}
                  href="/break"
                >
                  <Holds position={"row"} className="my-auto">
                    <Holds size={"70"}>
                      <Texts size={"p1"}>{f("Clock-btn")}</Texts>
                    </Holds>
                    <Holds size={"30"}>
                      <Images
                        titleImg="/clock-in.svg"
                        titleImgAlt="Clock In Icon"
                        size={"50"}
                      />
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
                    ? `col-span-2 row-span-2 gap-5 h-full` //if you have permission smaller widget
                    : `col-span-2 row-span-4 gap-5 h-full` // else bigger widget
                }
              >
                <Buttons //----------------------This is the clock in widget while clocked out
                  background={"green"}
                  href="/clock"
                >
                  {permission === "ADMIN" ||
                  permission === "SUPERADMIN" ||
                  permission === "MANAGER" ? (
                    <Holds position={"row"} className="my-auto">
                      <Holds size={"60"}>
                        <Texts size={"p1"}>{f("Clock-btn")}</Texts>
                      </Holds>
                      <Holds size={"40"}>
                        <Images
                          titleImg="/clock-in.svg"
                          titleImgAlt="Clock In Icon"
                          size={"70"}
                        />
                      </Holds>
                    </Holds>
                  ) : (
                    <Holds className="my-auto">
                      <Holds size={"50"}>
                        <Images
                          titleImg="/clock-in.svg"
                          titleImgAlt="Clock In Icon"
                          size={"70"}
                        />
                      </Holds>
                      <Holds size={"60"}>
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
  );
}
