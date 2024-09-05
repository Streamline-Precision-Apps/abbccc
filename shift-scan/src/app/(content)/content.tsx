"use client";
import "@/app/globals.css";
import { useTranslations } from "next-intl";
import Hours from "@/app/(content)/hours";
import WidgetSection from "@/components/widgetSection";
import { useEffect, useState, useMemo } from "react";
import { useSavedPayPeriodHours } from "../context/SavedPayPeriodHours";
import { useSavedUserData } from "../context/UserContext";
import { getAuthStep, setAuthStep } from "../api/auth";
import DisplayBreakTime from "./displayBreakTime";
import { useRouter } from "next/navigation";
import { Titles } from "@/components/(reusable)/titles";
import { Banners } from "@/components/(reusable)/banners";
import { Texts } from "@/components/(reusable)/texts";
import { Footers } from "@/components/(reusable)/footers";
import { Sections } from "@/components/(reusable)/sections";
import { Bases } from "@/components/(reusable)/bases";
import { Header } from "@/components/header";
import { Headers } from "@/components/(reusable)/headers";
import {useDBJobsite,useDBCostcode,useDBEquipment} from "@/app/context/dbCodeContext";
import { useRecentDBJobsite, useRecentDBCostcode, useRecentDBEquipment} from "@/app/context/dbRecentCodesContext";
import { useSavedPayPeriodTimeSheet } from "../context/SavedPayPeriodTimeSheets";
import { clockProcessProps, TimeSheets,} from "@/lib/content"; // used for the interface and the props
import { Contents } from "@/components/(reusable)/contents";
import { Grids } from "@/components/(reusable)/grids";
import { User } from "@/lib/types";
import Capitalize from "@/utils/captitalize";

export default function Content({
  session,
  locale,
  equipment,
  jobCodes,
  CostCodes,
  recentJobSites,
  recentCostCodes,
  recentEquipment,
  payPeriodSheets,
}: clockProcessProps) {

  const t = useTranslations("Home");
  const { setPayPeriodHours } = useSavedPayPeriodHours();
  const [toggle, setToggle] = useState(true);
  const { setSavedUserData } = useSavedUserData();
  const router = useRouter();
  const authStep = getAuthStep();
  const date = new Date().toLocaleDateString(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
    weekday: "long",
  });
  // creates a state of user data
  const [user, setData] = useState<User>({
    id: "",
    firstName: "",
    lastName: "",
    permission: undefined,
  });

  // saves user instance of jobsite data until the user switches to another job
  const { jobsiteResults, setJobsiteResults } = useDBJobsite();
  const {recentlyUsedJobCodes, setRecentlyUsedJobCodes,
  } = useRecentDBJobsite();

  // saves users cost code data until the user switches to another cost code
  const { costcodeResults, setCostcodeResults } = useDBCostcode();
  const {
    recentlyUsedCostCodes,
    setRecentlyUsedCostCodes,
  } = useRecentDBCostcode();

  // saves users equipment data until the user switches to another equipment
  const { equipmentResults, setEquipmentResults } = useDBEquipment();
  const {
    recentlyUsedEquipment,
    setRecentlyUsedEquipment,
  } = useRecentDBEquipment();

// runs the timesheet function and saves it to the context
  const { setPayPeriodTimeSheets } = useSavedPayPeriodTimeSheet();

// sets the saved pay period time sheets to display on the pay period page
  useEffect(() => {
    setPayPeriodTimeSheets(payPeriodSheets);
  }, [payPeriodSheets, setPayPeriodTimeSheets]);

  // if they loose their saved data it will reset them using a useEffect and useContext
  useEffect(() => {
    if (jobsiteResults.length === 0) {
      setJobsiteResults(jobCodes);
    }
    if (costcodeResults.length === 0) {
      setCostcodeResults(CostCodes);
    }
    if (equipmentResults.length === 0) {
      setEquipmentResults(equipment);
    }
    if (recentlyUsedJobCodes.length === 0) {
      setRecentlyUsedJobCodes(recentJobSites);
    }
    if (recentlyUsedCostCodes.length === 0) {
      setRecentlyUsedCostCodes(recentCostCodes);
    }
    if (recentlyUsedEquipment.length === 0) {
      setRecentlyUsedEquipment(recentEquipment);
    }
  }, [
    session, jobCodes, CostCodes, equipment, recentJobSites, recentCostCodes, recentEquipment,
    jobsiteResults, costcodeResults, equipmentResults, recentlyUsedJobCodes, recentlyUsedCostCodes, recentlyUsedEquipment,
  ]);

// calculates the total pay period hours into one number of hours
  const totalPayPeriodHours = useMemo(() => {
    return payPeriodSheets
      .filter((sheet): sheet is TimeSheets => sheet.duration !== null)
      .reduce((total, sheet) => total + (sheet.duration ?? 0), 0);
  }, [payPeriodSheets]);

// redirects to dashboard if authStep is success
  useEffect(() => {
    if (authStep === "success") {
      router.push("/dashboard");
    }
  }, [authStep, router]);

// removes local storage if authStep is removeLocalStorage
  useEffect(() => {
    if (authStep === "removeLocalStorage") {
      localStorage.clear();
      setAuthStep("");
    }
  }, [authStep]);

// sets the saved user data
  useEffect(() => {
    if (session && session.user) {
      console.log("Session user:", session.user);
      setSavedUserData({
        id: session.user.id,
      });
      setData({
        id: session.user.id,
        firstName: session.user.firstName,
        lastName: session.user.lastName,
        permission: session.user.permission,
      });
      setHoursContext();
    }
  }, [session]);

  // sets the total pay period hours for the home screen display
  const setHoursContext = () => {
    setPayPeriodHours(totalPayPeriodHours.toFixed(2));
  };

  // toogles fromt the home display to hours section 
  const handleToggle = () => {
    setToggle(!toggle);
  };

  
    return (
      <>
        <Bases variant={"default"}>
          <Contents variant={"default"} size={"default"}>
            <Sections size={"homepage"}>
              <Contents variant={"header"} size={null}>
                <Headers variant={"relative"} size={"default"}></Headers>
              </Contents>
              <Banners variant={"default"}>
                <Titles variant={"default"} size={"h1"}>
                  {t("Banner")}
                </Titles>
                <Texts variant={"default"} size={"p1"}>
                  {t("Date", { date: Capitalize(date) })}
                </Texts>
              </Banners>
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
{(authStep === "break") ? 
  <>
  {/* A ternary statement to display the break widget or view hours */}
    {toggle ? <Grids variant={"widgets"} size={"default"}>
      <DisplayBreakTime setToggle={handleToggle} display={toggle} />
      <WidgetSection
        user={user}
        display={toggle}
        locale={locale}
        option={"break"}
      />
      </Grids> : 
        <Hours setToggle={handleToggle} display={toggle} />
      }
  </>
:
/* A ternary statement to display the break time or hours
False -> display hours                    */
  <>
    {/* A ternary statement to display the total clocked hours widget or view hours */}
      {toggle ? 
        <Grids variant={"widgets"} size={"sm"}>
          <Hours setToggle={handleToggle} display={toggle} />
          <WidgetSection user={user} display={toggle} locale={locale} />
        </Grids> 
        : 
        <Hours setToggle={handleToggle} display={toggle} />
      }
  </>
          }
    </Sections>
  </Contents>
    {/* <Footers variant={"default"}>{t("Copyright")}</Footers> */}
    {/* <Header />  */}
    {/* this contains the login log out buttons */}
  </Bases>
</>
);
}
