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
import { useRecentDBJobsite, useRecentDBCostcode, useRecentDBEquipment,} from "@/app/context/dbRecentCodesContext";
import { useSavedPayPeriodTimeSheet } from "../context/SavedPayPeriodTimeSheets";
import { clockProcessProps, TimeSheets,} from "@/lib/content"; // used for the interface and the props
import { Contents } from "@/components/(reusable)/contents";
import { Grids } from "@/components/(reusable)/grids";
import { User } from "@/lib/types";

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
  // TODO: only have 1 use translation function
  const t = useTranslations("Home");
  const f = useTranslations("Footer");
  const { setPayPeriodHours } = useSavedPayPeriodHours();
  const [toggle, setToggle] = useState(true);
  const { setSavedUserData } = useSavedUserData();
  const router = useRouter();
  const authStep = getAuthStep();
  const [hourbtn, setHourbtn] = useState(true);
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
  const {recentlyUsedJobCodes, setRecentlyUsedJobCodes,addRecentlyUsedJobCode,
  } = useRecentDBJobsite();

  // saves users cost code data until the user switches to another cost code
  const { costcodeResults, setCostcodeResults } = useDBCostcode();
  const {
    recentlyUsedCostCodes,
    setRecentlyUsedCostCodes,
    addRecentlyUsedCostCode,
  } = useRecentDBCostcode();

  // saves users equipment data until the user switches to another equipment
  const { equipmentResults, setEquipmentResults } = useDBEquipment();
  const {
    recentlyUsedEquipment,
    setRecentlyUsedEquipment,
    addRecentlyUsedEquipment,
  } = useRecentDBEquipment();

// runs the timesheet function and saves it to the context
  const { setPayPeriodTimeSheets } = useSavedPayPeriodTimeSheet();

// sets the saved pay period time sheets to display on the pay period page
  useEffect(() => {
    setPayPeriodTimeSheets(payPeriodSheets);
  }, [payPeriodSheets, setPayPeriodTimeSheets]);

  // if they loose their saved data it will reset them to new data
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

  const handler = () => {
    setToggle(!toggle);
  };

  const setHoursContext = () => {
    setPayPeriodHours(totalPayPeriodHours.toFixed(2));
  };

  function capitalize(str: any) {
    if (typeof str !== "string") {
      return "";
    }
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  if (authStep === "break") {
    return (
      <>
        <Bases variant={"default"}>
            <Header />
            <Contents>
            <Sections size={"default"}>
            <Contents variant={"header"} size={"test"}>
                <Headers variant={"relative"} size={"default"}></Headers>
              </Contents>
                <Banners variant={"default"}>
                  <Titles variant={"default"} size={"h1"}>
                    {t("Banner")}
                  </Titles>
                  <Texts variant={"default"} size={"p1"}>
                    {t("Date", { date: capitalize(date) })}
                  </Texts>
                </Banners>
                <Contents variant={"name"} size={null}>
                <Texts variant={"name"} size={"p1"}>
                  {t("Name", {
                    firstName: capitalize(user.firstName),
                    lastName: capitalize(user.lastName),
                  })}
                </Texts>
              </Contents>
                {/* An if statement to display the widgets or the hours */}
                  {toggle ? <Grids variant={"widgets"} size={"default"}>
                  <DisplayBreakTime setToggle={handler} display={toggle} />
                  <WidgetSection
                    user={user}
                    display={toggle}
                    locale={locale}
                    option={"break"}
                  />
                </Grids> : 
                <Hours setToggle={handler} display={toggle} />
              }
            </Sections>
          </Contents>
        </Bases>
      </>
    );
  } else {
    return (
      <>
        <Bases variant={"default"}>
          <Header />
          <Contents>
            <Sections size={"homepage"}>
              <Contents variant={"header"} size={"test"}>
                <Headers variant={"relative"} size={"default"}></Headers>
              </Contents>
              <Banners variant={"default"}>
                <Titles variant={"default"} size={"h1"}>
                  {t("Banner")}
                </Titles>
                <Texts variant={"default"} size={"p1"}>
                  {t("Date", { date: capitalize(date) })}
                </Texts>
              </Banners>
              <Contents variant={"name"} size={"test"}>
                <Texts variant={"name"} size={"p1"}>
                  {t("Name", {
                    firstName: capitalize(user.firstName),
                    lastName: capitalize(user.lastName),
                  })}
                </Texts>
              </Contents>
              {toggle ? <Grids variant={"widgets"} size={"default"}>
                <Hours setToggle={handler} display={toggle} />
                <WidgetSection user={user} display={toggle} locale={locale} />
              </Grids> : 
              <Hours setToggle={handler} display={toggle} />
              }
              <Footers>{f("Copyright")}</Footers>
            </Sections>
          </Contents>
        </Bases>
      </>
    );
  }
}
