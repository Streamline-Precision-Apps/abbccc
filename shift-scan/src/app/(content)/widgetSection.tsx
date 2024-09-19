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
type props = {
    session: Session;
}
export default function WidgetSection( {session} : props) {
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
//---------------------Fetches-------------------------------------------
  // Fetch job sites, cost codes, equipment, and timesheet data from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [payPeriodSheetsResponse] = await Promise.all([
          fetch("/api/getPayPeriodTimeSheets")
        ]);

        const [payPeriodSheets] = await Promise.all([
          payPeriodSheetsResponse.json(),
        ]);
        setPayPeriodSheets(payPeriodSheets);

      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [

    setPayPeriodTimeSheets(payPeriodSheets)
  ]);

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
    if (!payPeriodSheets) return 0;
    return payPeriodSheets.filter((sheet : any) => sheet.duration !== null)
    .reduce((total, sheet:any) => total + (sheet.duration ?? 0), 0);
  }, [payPeriodSheets]);

  // Set the total pay period hours in context
  useEffect(() => {
    setPayPeriodHours(totalPayPeriodHours.toFixed(2));
  }, [totalPayPeriodHours, setPayPeriodHours]);
return (
<>
{authStep === "break" ? (
<>

{/* A ternary statement to display the break widget or view hours */}
    {toggle ? (
      <DisplayBreakTime
      setToggle={handleToggle}
      display={toggle}
/>
    ) : (
      <Hours setToggle={handleToggle} display={toggle} />
    )}
    </>
) :
(
    <>
<Hours setToggle={handleToggle} display={toggle}  />
</>
)
}
{toggle ? (
  <Grids variant={"widgets"} size={"sm"}>
    { permission === "ADMIN" || permission === "SUPERADMIN" || permission === "MANAGER"  ? (
      <>
    <Buttons href="/dashboard/qr-generator" variant={"lightBlue"} size={"fill"}>
        <Holds>
            <Images titleImg="/new/qr.svg" titleImgAlt="QR Code" variant={"icon"} size={"widgetSm"}/>
            <Texts size={"widgetSm"}>{t("QrGenerator")}</Texts>
        </Holds>
    </Buttons>
    <Buttons href="/dashboard/myTeam" variant={"lightBlue"} size={"fill"}>
        <Holds>
            <Images titleImg="/new/team.svg" titleImgAlt="my team" variant={"icon"} size={"widgetSm"}/>
                <Texts size={"widgetSm"}>{t("MyTeam")}</Texts>
        </Holds>
    </Buttons> 
</>
) : 
<Hours setToggle={handleToggle} display={toggle}  />
}
    <Buttons 
        variant={"green"} 
        size={"fill"} // this eliminated the big if statement
        href="/clock"
        className="col-span-2" // added this if they are
        >
            <Holds variant={"col"} className="justify-center items-center py-5">
            <Images titleImg="/new/clock-in.svg" titleImgAlt="QR Code" variant={"icon"} size={"widgetSm"}  />
            <Texts size={"widgetMed"}>{f("Clock-btn")}</Texts>
            </Holds>
        </Buttons>
    </Grids>
        ) : (null)
      }
    </>
    );
  }