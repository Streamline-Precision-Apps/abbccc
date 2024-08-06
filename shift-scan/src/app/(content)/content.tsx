"use client";

import "@/app/globals.css";
import { useTranslations } from "next-intl";
import Hours from "@/app/(content)/hours";
import WidgetSection from "@/components/widgetSection";
import { useSession } from "next-auth/react";
import { CustomSession, User } from "@/lib/types";
import { useEffect, useState, useMemo } from "react";
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
import { useSavedDailyHours } from "../context/SavedDailyHours";

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
  payPeriodSheets: timeSheets[];
  todaySheets: timeSheets[];
}

export default function Content({
  equipment,
  jobCodes,
  CostCodes,
  recentJobSites,
  recentCostCodes,
  recentEquipment,
  payPeriodSheets,
  todaySheets,
}: clockProcessProps) {
  const t = useTranslations("Home");
  const f = useTranslations("Footer");
  const { data: session } = useSession() as { data: CustomSession | null };
  const { setPayPeriodHours } = useSavedPayPeriodHours();
  const { setDailyHours } = useSavedDailyHours();
  const [toggle, setToggle] = useState(true);
  const { setSavedUserData } = useSavedUserData();
  const router = useRouter();
  const date = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    weekday: 'long',
  });
  const [user, setData] = useState<User>({
    id: '',
    name: '',
    firstName: '',
    lastName: '',
    permission: '',
  });
  const { jobsiteResults, setJobsiteResults } = useDBJobsite();
  const { costcodeResults, setCostcodeResults } = useDBCostcode();
  const { equipmentResults, setEquipmentResults } = useDBEquipment();

  // Calculate total hours for the current pay period
  const totalPayPeriodHours = useMemo(() => {
    return payPeriodSheets
      .filter((sheet): sheet is { duration: number } => sheet.duration !== null)
      .reduce((total, sheet) => total + sheet.duration, 0);
  }, [payPeriodSheets]);

  // Calculate total hours for today
  const totalTodayHours = useMemo(() => {
    return todaySheets
      .filter((sheet): sheet is { duration: number } => sheet.duration !== null)
      .reduce((total, sheet) => total + sheet.duration, 0);
  }, [todaySheets]);

  // Example use of totalPayPeriodHours and totalTodayHours: log them or display them
  console.log(`Total hours for the current pay period: ${totalPayPeriodHours}`);
  console.log(`Total hours for today: ${totalTodayHours}`);

  useEffect(() => {
    if (authStep === 'success') {
      router.push('/dashboard');
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
    setPayPeriodHours(totalPayPeriodHours.toFixed(2)); // Ensure it's to 2 decimal places
    setDailyHours(totalTodayHours.toFixed(2));
  };

  const authStep = getAuthStep();

  if (authStep === 'break') {
    return (
      <>
        <Bases variant={'default'} size={'default'}>
          <Header />
          <Sections size={'default'}>
            <Headers variant={'relative'} size={'default'}></Headers>
            <Banners variant={'default'} size={'default'}>
              <Titles variant={'default'} size={'h1'}>
                {t('Banner')}
              </Titles>
              <Texts variant={'default'} size={'p1'}>
                {t('Date', { date })}
              </Texts>
            </Banners>
            <Texts variant={'name'} size={'p1'}>
              {t('Name', {
                firstName: user.firstName,
                lastName: user.lastName,
              })}
            </Texts>
            <DisplayBreakTime setToggle={handler} display={toggle} />
            <WidgetSection user={user} display={toggle} />
            <Footers>{f('Copyright')}</Footers>
          </Sections>
        </Bases>
      </>
    );
  } else {
    return (
      <>
        <Bases variant={'default'} size={'default'}>
          <Header />
          <Sections size={'default'}>
            <Headers variant={'relative'} size={'default'}></Headers>
            <Banners variant={'default'} size={'default'}>
              <Titles variant={'default'} size={'h1'}>
                {t('Banner')}
              </Titles>
              <Texts variant={'default'} size={'p1'}>
                {t('Date', { date })}
              </Texts>
            </Banners>
            <Texts variant={'name'} size={'p1'}>
              {t('Name', {
                firstName: user.firstName,
                lastName: user.lastName,
              })}
            </Texts>
            <Hours setToggle={handler} display={toggle} />
            <WidgetSection user={user} display={toggle} />
            <Footers>{f('Copyright')}</Footers>
          </Sections>
        </Bases>
      </>
    );
  }
}
