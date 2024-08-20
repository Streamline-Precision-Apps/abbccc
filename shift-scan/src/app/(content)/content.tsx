"use client";
import "@/app/globals.css";
import { useTranslations } from "next-intl";
import Hours from "@/app/(content)/hours";
import WidgetSection from "@/components/widgetSection";
import { useSession } from "next-auth/react";
import { CustomSession, User, PayPeriodTimesheets } from "@/lib/types";
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
import { useDBJobsite, useDBCostcode, useDBEquipment } from "@/app/context/dbCodeContext";
import { useRecentDBJobsite, useRecentDBCostcode, useRecentDBEquipment} from "@/app/context/dbRecentCodesContext";
import { useSavedPayPeriodTimeSheet } from "../context/SavedPayPeriodTimeSheets";
import { clockProcessProps, jobCodes, CostCode, Equipment, TimeSheets } from "@/lib/content";
import { Contents } from "@/components/(reusable)/contents";
import { Grids } from "@/components/(reusable)/grids";


export default function Content({
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
  const f = useTranslations("Footer");
  const { data: session } = useSession() as { data: CustomSession | null };
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
  const [user, setData] = useState<User>({
    id: "", name: "", firstName: "", lastName: "", permission: "",
  });
  const { jobsiteResults, setJobsiteResults } = useDBJobsite();
  const {
    recentlyUsedJobCodes,
    setRecentlyUsedJobCodes,
    addRecentlyUsedJobCode,
    } = useRecentDBJobsite();
  const { costcodeResults, setCostcodeResults } = useDBCostcode();
  const {
    recentlyUsedCostCodes,
    setRecentlyUsedCostCodes,
    addRecentlyUsedCostCode,
    } = useRecentDBCostcode();
  const { equipmentResults, setEquipmentResults } = useDBEquipment();
  const {
    recentlyUsedEquipment,
    setRecentlyUsedEquipment,
    addRecentlyUsedEquipment,
    } = useRecentDBEquipment();

  const { setPayPeriodTimeSheets } = useSavedPayPeriodTimeSheet(); // Correct name here
  setPayPeriodTimeSheets(payPeriodSheets); // Correct usage here

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
    jobCodes,
    CostCodes,
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


  // Calculate total hours for the current pay period
  const totalPayPeriodHours = useMemo(() => {
    return payPeriodSheets
      .filter((sheet): sheet is TimeSheets => sheet.duration !== null)
      .reduce((total, sheet) => total + (sheet.duration ?? 0), 0);
  }, [payPeriodSheets]);

  useEffect(() => {
    if (authStep === "success") {
      router.push("/dashboard");
    }
  }, []);

  // when you clock out, clear local storage then rests the auth step
  useEffect(() => {
    if (authStep === "removeLocalStorage") {
      localStorage.clear();
      setAuthStep("");
    }
  }, []);


  useEffect(() => {
    if (session && session.user) {
      setSavedUserData({
        id: session.user.id,
      });
      setData({
        id: session.user.id,
        name: session.user.name,
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

  useEffect(() => {
    setJobsiteResults(jobCodes);
    setCostcodeResults(CostCodes);
    setEquipmentResults(equipment);
  }, []);

  // Define setHoursContext function
  const setHoursContext = () => {
    // Set the pay period hours as a string
    setPayPeriodHours(totalPayPeriodHours.toFixed(2)); // Ensure it's to 2 decimal places
  };

  // Helper function to capitalize the first letter of a string
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
        <Contents size={"default"}>
          <Header />
          <Sections size={"default"}>
          <Contents size={"default"}>
            <Headers variant={"relative"} size={"default"}></Headers>
            <Banners variant={"default"}>
              <Titles variant={"default"} size={"h1"}>
                {t("Banner")}
              </Titles>
              <Texts variant={"default"} size={"p1"}>
                {t("Date", { date: capitalize(date) })}
              </Texts>
            </Banners>
            <Texts variant={"name"} size={"p1"}>
              {t("Name", {
                firstName: capitalize(user.firstName),
                lastName: capitalize(user.lastName),
              })}
            </Texts>
            <Contents size={"default"}>
            <DisplayBreakTime setToggle={handler} display={toggle} />
            <WidgetSection user={user} display={toggle} locale={locale} option={"break"} />
            </Contents>
            </Contents>
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
              <Titles variant={"default"} size={"h1"}>{t("Banner")}</Titles>
              <Texts variant={"default"} size={"p1"}>{t("Date", { date: capitalize(date) })}</Texts>
            </Banners>
            <Contents variant={"name"} size={"test"}>
              <Texts variant={"name"} size={"p1"}>
                {t("Name", {firstName: capitalize(user.firstName),lastName: capitalize(user.lastName),})}
              </Texts>
            </Contents>
            <Grids variant={"widgets"} size={"default"}>
              <Hours setToggle={handler} display={toggle} />
              <WidgetSection user={user} display={toggle} locale={locale} />
            </Grids>
            <Footers>{f("Copyright")}</Footers>
          </Sections>
          </Contents>
        </Bases>
      </>
    );
  }  
}
