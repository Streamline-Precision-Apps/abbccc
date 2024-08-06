"use client";

import "@/app/globals.css";
import { useTranslations } from "next-intl";
import Hours from "@/app/(content)/hours";
import WidgetSection from "@/components/widgetSection";
import { useSession } from "next-auth/react";
import { CustomSession, User } from "@/lib/types";
import { useEffect, useState } from "react";
import { useSavedPayPeriodHours } from "../context/SavedPayPeriodHours";
import { useSavedUserData } from "../context/UserContext";
import { getAuthStep } from "../api/auth";
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
import {
  useDBJobsite,
  useDBCostcode,
  useDBEquipment,
} from "@/app/context/dbCodeContext";
import { useMemo } from "react";

type jobCodes = {
  id: number;
  jobsite_id: string;
  jobsite_name: string;
};
type CostCode = {
  id: number;
  cost_code: string;
  cost_code_description: string;
};

type equipment = {
  id: string;
  qr_id: string;
  name: string;
};

type timeSheets = {
  duration: number | null;
};

interface clockProcessProps {
  jobCodes: jobCodes[];
  CostCodes: CostCode[];
  equipment: equipment[];
  recentJobSites: jobCodes[];
  recentCostCodes: CostCode[];
  recentEquipment: equipment[];
  timeSheets: timeSheets[];
}

export default function Content({
  equipment,
  jobCodes,
  CostCodes,
  recentJobSites,
  recentCostCodes,
  recentEquipment,
  timeSheets,
} : clockProcessProps) {
  const t = useTranslations("Home");
  const f = useTranslations("Footer");
  const { data: session } = useSession() as { data: CustomSession | null };
  const { setPayPeriodHours } = useSavedPayPeriodHours();
  const [toggle, setToggle] = useState(true);
  const { setSavedUserData } = useSavedUserData();
  const router = useRouter();
  const date = new Date().toLocaleDateString( 'en-US', { year: 'numeric', month: 'short', day: 'numeric', weekday: 'long' });
  const [user, setData] = useState<User>({ id: "", name: "", firstName: "", lastName: "", permission: "", });
  const { jobsiteResults, setJobsiteResults } = useDBJobsite();
  const { costcodeResults, setCostcodeResults } = useDBCostcode();
  const { equipmentResults, setEquipmentResults } = useDBEquipment();

  // Move useMemo outside of setHoursContext function
  const totalhours = useMemo(() => {
    // Use a type guard to ensure non-null values
    return timeSheets
      .filter((sheet): sheet is { duration: number } => sheet.duration !== null) // This narrows down the type
      .reduce((total, sheet) => total + sheet.duration, 0);
  }, [timeSheets]);

  useEffect(() => {
    if (authStep ==="success") {
      router.push("/dashboard");
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
    console.log(toggle);
  };

  useEffect(() => {
    setJobsiteResults(jobCodes);
    setCostcodeResults(CostCodes);
    setEquipmentResults(equipment);
  }, []);

  // Define setHoursContext function
  const setHoursContext = () => {
    // Set the pay period hours as a string
    setPayPeriodHours(totalhours.toFixed(2)); // Ensure it's to 2 decimal places
  };

  const authStep = getAuthStep();

  if (authStep === "break") {
    return (
      <> 
      <Bases variant={"default"} size={"default"}>
      <Header/>
      <Sections size={"default"}>
      <Headers variant={"relative"} size={"default"}></Headers>
      <Banners variant={"default"} size={"default"}>
                <Titles variant={"default"} size={"h1"}>{t("Banner")}</Titles>
                <Texts variant={"default"} size={"p1"}>{t("Date", { date })}</Texts>
        </Banners>
          <Texts variant={"name"} size={"p1"}>{t("Name", { firstName: user.firstName, lastName: user.lastName })}</Texts>
          <DisplayBreakTime setToggle={handler} display={toggle} />
          <WidgetSection user={user} display={toggle} />
          <Footers >{f("Copyright")}</Footers>
            </Sections>
        </Bases>
      </>
    );
  }
  else {
    return (
      <>
        <Bases variant={"default"} size={"default"}>
            <Header/>
            <Sections size={"default"}>
            <Headers variant={"relative"} size={"default"}></Headers>
        <Banners variant={"default"} size={"default"}>
                <Titles variant={"default"} size={"h1"}>{t("Banner")}</Titles>
                <Texts variant={"default"} size={"p1"}>{t("Date", { date })}</Texts>
        </Banners>
          <Texts variant={"name"} size={"p1"}>{t("Name", { firstName: user.firstName, lastName: user.lastName })}</Texts>
          <Hours setToggle={handler} display={toggle} />
          <WidgetSection user={user} display={toggle} />
          <Footers >{f("Copyright")}</Footers>
            </Sections>
        </Bases>
      </>
    );
  }
}
