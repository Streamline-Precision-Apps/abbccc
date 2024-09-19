"use client";
import "@/app/globals.css";
import { useTranslations } from "next-intl";
import Hours from "@/app/(content)/hours";
import WidgetSection from "@/components/widgetSection";
import { useEffect, useState, useMemo } from "react";
import { usePayPeriodHours } from "../context/PayPeriodHoursContext";
import { getAuthStep, setAuthStep } from "../api/auth";
import DisplayBreakTime from "./displayBreakTime";
import { useRouter } from "next/navigation";
import { Titles } from "@/components/(reusable)/titles";
import { Banners } from "@/components/(reusable)/banners";
import { Texts } from "@/components/(reusable)/texts";
import { Sections } from "@/components/(reusable)/sections";
import { Bases } from "@/components/(reusable)/bases";
import { Header } from "@/components/header";
import { Headers } from "@/components/(reusable)/headers";
import {useDBJobsite,useDBCostcode,useDBEquipment,} from "@/app/context/dbCodeContext";
import {useRecentDBJobsite,useRecentDBCostcode,useRecentDBEquipment,} from "@/app/context/dbRecentCodesContext";
import { usePayPeriodTimeSheet } from "../context/PayPeriodTimeSheetsContext";
import { clockProcess, TimeSheets} from "@/lib/types";
import { Contents } from "@/components/(reusable)/contents";
import { Grids } from "@/components/(reusable)/grids";
import { User } from "@/lib/types";
import Capitalize from "@/utils/captitalize";

export default function Content({ session, locale }: clockProcess) {
  const router = useRouter();
  const t = useTranslations("Home");
  const authStep = getAuthStep();
  // useStates hooks
  const [toggle, setToggle] = useState(true);

  const { setPayPeriodHours } = usePayPeriodHours();
  const { setPayPeriodTimeSheets} = usePayPeriodTimeSheet();
  const [payPeriodSheets, setPayPeriodSheets] = useState([]);

  const { jobsiteResults, setJobsiteResults } = useDBJobsite();
  const { recentlyUsedJobCodes, setRecentlyUsedJobCodes } = useRecentDBJobsite();
  const { costcodeResults, setCostcodeResults } = useDBCostcode();
  const { recentlyUsedCostCodes, setRecentlyUsedCostCodes } = useRecentDBCostcode();
  const { equipmentResults, setEquipmentResults } = useDBEquipment();
  const { recentlyUsedEquipment, setRecentlyUsedEquipment } = useRecentDBEquipment();
// on load user
  const [user, setUser] = useState<User>({
    id: "",
    firstName: "",
    lastName: "",
    permission: undefined,
  });
// banner
  const date = new Date().toLocaleDateString(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
    weekday: "long",
  });

  // Fetch job sites, cost codes, equipment, and timesheet data from the API
 


  // Redirect to dashboard if authStep is success
  useEffect(() => {
    if (authStep === "success") {
      router.push("/dashboard");
    }
  }, [authStep, router]);

  // Clear local storage if authStep is removeLocalStorage
  useEffect(() => {
    if (authStep === "removeLocalStorage") {
      localStorage.clear();
      setAuthStep("");
    }
  }, [authStep]);

  // Set user data
  useEffect(() => {
    if (session && session.user) {
      if (!session.user.accountSetup) {
        router.push("/signin/signup");
      }
      setUser({
        id: session.user.id,
        firstName: session.user.firstName,
        lastName: session.user.lastName,
        permission: session.user.permission,
      });
    }
  }, [session, router]);

  // Toggle between home display and hours section
  const handleToggle = () => setToggle(!toggle);

  return (
    <>
      <Bases variant={"default"}>
        <Contents variant={"default"} size={"default"}>
          <Sections size={"homepage"}>
            <Contents variant={"header"} size={null}>
              <Headers variant={"relative"} size={"default"}></Headers>
            </Contents>
            {/* <Banners variant={"default"}>
              <Titles variant={"default"} size={"h1"}>
                {t("Banner")}
              </Titles>
              <Texts variant={"default"} size={"p1"}>
                {t("Date", { date: Capitalize(date) })}
              </Texts>
            </Banners> */}
            {/* {toggle ? */}
            <Contents variant={"name"} size={"nameContainer"}>
              <Texts variant={"name"} size={"p0"}>
                {t("Name", {
                  firstName: Capitalize(user.firstName),
                  lastName: Capitalize(user.lastName),
                })}
              </Texts>
            </Contents>
            {/* : null} */}
            {/* A ternary statement to display the break time or hours
      Truth -> display break time                         */}
            {authStep === "break" ? (
              <>
                {/* A ternary statement to display the break widget or view hours */}
                {toggle ? (
                  <Grids variant={"widgets"} size={"default"}>
                    <DisplayBreakTime
                      setToggle={handleToggle}
                      display={toggle}
                    />
                    <WidgetSection
                      user={user}
                      display={toggle}
                      locale={locale}
                      option={"break"}
                    />
                  </Grids>
                ) : (
                  <Hours setToggle={handleToggle} display={toggle} />
                )}
              </>
            ) : (
              /* A ternary statement to display the break time or hours
False -> display hours                    */
              <>
                {/* A ternary statement to display the total clocked hours widget or view hours */}
                {toggle ? (
                  <Grids variant={"widgets"} size={"sm"}>
                    <Hours setToggle={handleToggle} display={toggle} />
                    <WidgetSection
                      user={user}
                      display={toggle}
                      locale={locale}
                    />
                  </Grids>
                ) : (
                  <Hours setToggle={handleToggle} display={toggle} />
                )}
              </>
            )}
          </Sections>
        </Contents>
      </Bases>
    </>
  );
}
