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
import { Footers } from "@/components/(reusable)/footers";
import { Bases } from "@/components/(reusable)/bases";
import { Header } from "@/components/header";
import { Images } from "@/components/(reusable)/images";
import { AnimatedHamburgerButton } from "@/components/(animations)/hamburgerMenu";
import {
  useDBJobsite,
  useDBCostcode,
  useDBEquipment,
} from "@/app/context/dbCodeContext";
import {
  useRecentDBJobsite,
  useRecentDBCostcode,
  useRecentDBEquipment,
} from "@/app/context/dbRecentCodesContext";
import { usePayPeriodTimeSheet } from "../context/PayPeriodTimeSheetsContext";
import { clockProcessProps, TimeSheets } from "@/lib/types";
import { Contents } from "@/components/(reusable)/contents";
import { Grids } from "@/components/(reusable)/grids";
import { User } from "@/lib/types";
import Capitalize from "@/utils/captitalize";
import { Holds } from "@/components/(reusable)/holds";

export default function Content({
  session,
  locale,
  equipment,
  jobCodes,
  costCodes,
  recentJobSites,
  recentCostCodes,
  recentEquipment,
  payPeriodSheets,
}: clockProcessProps) {
  const t = useTranslations("Home");
  const { setPayPeriodHours } = usePayPeriodHours();
  const [toggle, setToggle] = useState(true);
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
  const { recentlyUsedJobCodes, setRecentlyUsedJobCodes } =
    useRecentDBJobsite();

  // saves users cost code data until the user switches to another cost code
  const { costcodeResults, setCostcodeResults } = useDBCostcode();
  const { recentlyUsedCostCodes, setRecentlyUsedCostCodes } =
    useRecentDBCostcode();

  // saves users equipment data until the user switches to another equipment
  const { equipmentResults, setEquipmentResults } = useDBEquipment();
  const { recentlyUsedEquipment, setRecentlyUsedEquipment } =
    useRecentDBEquipment();

  // runs the timesheet function and saves it to the context
  const { setPayPeriodTimeSheets } = usePayPeriodTimeSheet();

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
      setCostcodeResults(costCodes);
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
    session,
    jobCodes,
    costCodes,
    equipment,
    recentJobSites,
    recentCostCodes,
    recentEquipment,
    jobsiteResults,
    costcodeResults,
    equipmentResults,
    recentlyUsedJobCodes,
    recentlyUsedCostCodes,
    recentlyUsedEquipment,
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
      if (session.user.accountSetup === false) {
        router.push("/signin/signup");
      }
      console.log("Session user:", session.user);
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
      <Bases>
        <Contents className="h-[90%] mt-10">
          <Holds background={"white"} className="h-full">
            <Holds position={"row"} className="mb-5">
              <Holds size={"30"}>
                <Images 
                titleImg="/logo.svg" 
                titleImgAlt="logo" 
                position={"left"} 
                background={"none"} 
                size={"full"}/>
              </Holds>
              <Holds size={"70"}>
                <AnimatedHamburgerButton/> {/* come back to this */}
              </Holds>
            </Holds>
            <Holds className="mb-10">
            <Banners position={"flex"}>
              <Titles text={"black"} size={"p1"}>{t("Banner")}</Titles>
              <Texts text={"black"} size={"p4"}>{t("Date", { date: Capitalize(date) })}</Texts>
            </Banners>
            {/* {toggle ? */}
            </Holds>
            <Holds>
              <Texts text={"black"} size={"p2"}>
                {t("Name", {
                  firstName: Capitalize(user.firstName),
                  lastName: Capitalize(user.lastName),
                })}
              </Texts>
            </Holds>
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
          </Holds>
        </Contents>
      </Bases>
    </>
  );
}
