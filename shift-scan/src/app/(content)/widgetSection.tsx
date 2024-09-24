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
import { useRecentDBCostcode, useRecentDBEquipment, useRecentDBJobsite } from "../context/dbRecentCodesContext";
import { useDBCostcode, useDBEquipment, useDBJobsite } from "../context/dbCodeContext";
type props = {
    session: Session;
}
export default function WidgetSection( {session} : props) {
const [loading, setLoading] = useState(true);
const router = useRouter();
const t = useTranslations("ManagerButtons");
const f = useTranslations("Home");
const [toggle, setToggle] = useState(true);
const handleToggle = () => setToggle(!toggle);
const authStep = getAuthStep();
const permission = session.user.permission;
const accountSetup = session.user.accountSetup;

const { setPayPeriodHours } = usePayPeriodHours();
const { setPayPeriodTimeSheets} = usePayPeriodTimeSheet();
const [payPeriodSheets, setPayPeriodSheets] = useState([]);


const { jobsiteResults, setJobsiteResults } = useDBJobsite();
  const { recentlyUsedJobCodes, setRecentlyUsedJobCodes } = useRecentDBJobsite();
  const { costcodeResults, setCostcodeResults } = useDBCostcode();
  const { recentlyUsedCostCodes, setRecentlyUsedCostCodes } = useRecentDBCostcode();
  const { equipmentResults, setEquipmentResults } = useDBEquipment();
  const { recentlyUsedEquipment, setRecentlyUsedEquipment } = useRecentDBEquipment();
//---------------------Fetches-------------------------------------------
  // Fetch job sites, cost codes, equipment, and timesheet data from the API

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [jobsiteResponse, recentJobsiteResponse, costcodeResponse, recentCostcodeResponse, equipmentResponse, recentEquipmentResponse] = await Promise.all([
          fetch("/api/getJobsites"),
          fetch("/api/getRecentJobsites"),
          fetch("/api/getCostCodes"),
          fetch("/api/getRecentCostCodes"),
          fetch("/api/getEquipment"),
          fetch("/api/getRecentEquipment"),
        ]);

        const [jobSites, recentJobSites, costCodes, recentCostCodes, equipment, recentEquipment] = await Promise.all([
          jobsiteResponse.json(),
          recentJobsiteResponse.json(),
          costcodeResponse.json(),
          recentCostcodeResponse.json(),
          equipmentResponse.json(),
          recentEquipmentResponse.json(),

        ]);

        setJobsiteResults(jobSites);
        setRecentlyUsedJobCodes(recentJobSites);
        setCostcodeResults(costCodes);
        setRecentlyUsedCostCodes(recentCostCodes);
        setEquipmentResults(equipment);
        setRecentlyUsedEquipment(recentEquipment);

      } catch (error) {
        console.error("Error fetching data:", error);
      }
      finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [
    setJobsiteResults,
    setRecentlyUsedJobCodes,
    setCostcodeResults,
    setRecentlyUsedCostCodes,
    setEquipmentResults,
    setRecentlyUsedEquipment,
  ]);

//---------------------------------------------------------------------

useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await fetch("/api/getPayPeriodTimeSheets");
      const data = await response.json();
      setPayPeriodSheets(data);
      setPayPeriodTimeSheets(data); // Update the context after fetching
    } catch (error) {
      console.error("Error fetching pay period sheets:", error);
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
    if (!accountSetup)
    {
    router.push("/signin/signup");
    }
    
  }, [authStep, router]);


//-----------------------------------------------------------------------
  // Calculate total pay period hours
  const totalPayPeriodHours = useMemo(() => {
    if (!payPeriodSheets.length) return 0;
    return payPeriodSheets
      .filter((sheet: any) => sheet.duration !== null)
      .reduce((total, sheet: any) => total + (sheet.duration ?? 0), 0);
  }, [payPeriodSheets]);
  
  useEffect(() => {
    setPayPeriodHours(totalPayPeriodHours.toFixed(2));
  }, [totalPayPeriodHours, setPayPeriodHours]);

return (
<Holds className="">
{authStep === "break" ? (
<>

{/* A ternary statement to display the break widget or view hours */}
    {toggle ? (
      <DisplayBreakTime
      setToggle={handleToggle}
      display={toggle}
/>
    ) : (
      <Hours setToggle={handleToggle} display={toggle} loading={loading} />
    )}
    </>
) :
(
    <>
    <Hours setToggle={handleToggle} display={toggle}  loading={loading}  />
</>
)
}
{toggle ? (
  <Grids variant={"widgets"} size={"sm"}>
    { permission === "ADMIN" || permission === "SUPERADMIN" || permission === "MANAGER"  ? (
      <>
    <Buttons href="/dashboard/qr-generator" background={"lightBlue"} size={"full"}>
        <Holds className="justify-center items-center py-5">
            <Images titleImg="/qr.svg" titleImgAlt="QR Code" size={"40"}/>
            <Texts>{t("QrGenerator")}</Texts>
        </Holds>
    </Buttons>
    <Buttons href="/dashboard/myTeam" background={"lightBlue"} size={"full"}>
    <Holds className="justify-center items-center py-5">
            <Images titleImg="/team.svg" titleImgAlt="my team" size={"40"}/>
                <Texts >{t("MyTeam")}</Texts>
        </Holds>
    </Buttons> 
    </>
) :(null)
}
    <Buttons 
        background={"green"} 
        size={"full"} // this eliminated the big if statement
        href="/clock"
        className="col-span-2" // added this if they are
        >
            <Holds className="justify-center items-center py-5">
            <Images titleImg="/clock-in.svg" titleImgAlt="QR Code" size={"40"}  />
            <Texts>{f("Clock-btn")}</Texts>
            </Holds>
        </Buttons>
    </Grids>
        ) : (null)
      }
      </Holds>
    );
  }