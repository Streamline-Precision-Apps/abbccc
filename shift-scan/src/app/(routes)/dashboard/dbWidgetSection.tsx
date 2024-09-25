"use client";
import { Buttons } from "@/components/(reusable)/buttons";
import { Contents } from "@/components/(reusable)/contents";
import { Images } from "@/components/(reusable)/images";
import { Texts } from "@/components/(reusable)/texts";
import { useTranslations } from "next-intl";
import { Grids } from "@/components/(reusable)/grids";
import { useEffect, useMemo, useState } from "react";
import { Holds } from "@/components/(reusable)/holds";

import { useRouter } from "next/navigation";
import { Session } from "next-auth";
import { useRecentDBCostcode, useRecentDBEquipment, useRecentDBJobsite } from "../../context/dbRecentCodesContext";
import { useDBCostcode, useDBEquipment, useDBJobsite } from "../../context/dbCodeContext";
import { getAuthStep, setAuthStep } from "@/app/api/auth";
import DashboardButtons from "@/components/dashboard-buttons";
import Spinner from "@/components/(animations)/spinner";
import { updateTimeSheetBySwitch } from "@/actions/timeSheetActions";
import { Modals } from "@/components/(reusable)/modals";
type props = {
    session: Session;
    locale: string;
}
export default function DbWidgetSection( {session, locale} : props) {
const [loading, setLoading] = useState(true);
const router = useRouter();
const t = useTranslations("ManagerButtons");
const f = useTranslations("Home");
const [toggle, setToggle] = useState(true);
const handleToggle = () => setToggle(!toggle);
const authStep = getAuthStep();
const permission = session.user.permission;
const accountSetup = session.user.accountSetup;
const [logs, setLogs] = useState([]);
const [error, setError] = useState(null);
const [isModalOpen, setIsModalOpen] = useState(false);
const [additionalButtonsType, setAdditionalButtonsType] = useState<string | null>(null);

const handleShowManagerButtons = () => {
    setAdditionalButtonsType(null);
  };

  const handleShowAdditionalButtons = (type: string) => {
    setAdditionalButtonsType(type);
  };


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

  useEffect(() => {
    const fetchLogs = async () => {
    const recentLogsResponse = await fetch("/api/getLogs");
   const logs = await recentLogsResponse.json();
    setLogs(logs);
    }
    fetchLogs();
},[]);

 // Redirect to dashboard if authStep is success
 useEffect(() => {
    if (authStep !== "success") {
        
    router.push("/");
    }
    
  }, [authStep, router]);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Function to handle CO Button 2 action
  const handleCOButton2 = async () => {
    try{
    if (logs.length === 0) {
      // Perform action if there are no logs
      const formData2 = new FormData();
      const localeValue = localStorage.getItem("savedtimeSheetData");
      const t_id = JSON.parse(localeValue || "{}").id;
      formData2.append('id', t_id?.toString() || '');
      formData2.append('endTime', new Date().toISOString()); 
      formData2.append('TimeSheetComments', '');
      await updateTimeSheetBySwitch(formData2);


      setAuthStep("break");
      router.push("/");
    } else {
      setIsModalOpen(true);
    }}
    catch(err){
      console.error(err);
    }
  };

  // Function to handle CO Button 2 action
  const handleCOButton3 = async () => {
    if (logs.length === 0) {
      // Perform action if there are no logs
      router.push("/dashboard/clock-out");
    } else {
      setIsModalOpen(true);
    }
  };


return (
    <>
    {loading ? (
            <>
            <Holds className="my-2">
            <Spinner
            />
            </Holds>
            </>
        ):
    (
        <>
        <Grids variant={"widgets"} size={"default"}>
        {(permission !=="USER") && !additionalButtonsType && (
            <>
             <Buttons href="/dashboard/qr-generator" background={"lightBlue"}>
            <Holds className="my-2">
              <Images titleImg="/qr.svg" titleImgAlt="QR Code" background={"none"} size={"50"}/>
              <Texts size={"p4"}>{t("QrGenerator")}</Texts>
            </Holds>
          </Buttons>
          <Buttons href="/dashboard/myTeam" background={"lightBlue"}>
            <Holds className="my-2">
              <Images titleImg="/team.svg" titleImgAlt="my team" background={"none"} size={"50"}/>
              <Texts size={"p4"}>{t("MyTeam")}</Texts>
            </Holds>
          </Buttons>
            </>
          )
        }
        {additionalButtonsType === "equipment" ? (
            <>
            <Buttons
             background={"lightBlue"}
            size={null}
            onClick={handleShowManagerButtons}
          >
            <Holds className="my-2">
              <Texts>{t("GoHome")}</Texts>
              <Images
                  titleImg="/home.svg"
                  titleImgAlt="Home Icon"
                  size={"50"}
              />
            </Holds>
          </Buttons>
          <Buttons
            background={"green"}
            size={null}
            href="/dashboard/log-new"
          >
             <Holds className="my-2">
              <Texts>{t("LogNew")}</Texts>
              <Images
                titleImg="/equipment.svg"
                titleImgAlt="Equipment Icon"
                size={"50"}
              />
            </Holds>
          </Buttons>
          <Buttons
             background={"orange"}
            size={null}
            href="/dashboard/equipment"
          >
             <Holds className="my-2">
              <Texts>{t("Current")}</Texts>
              <Images
                titleImg="/current-equipment.svg"
                titleImgAlt="Equipment Icon"
                size={"50"}
              />
            </Holds>
          </Buttons>
        </>
        ) : additionalButtonsType === "clockOut" ? (
            <>
              <Buttons
                background={"lightBlue"}
                size={null}
                onClick={handleShowManagerButtons}
              >
                 <Holds className="my-2">
                  <Texts >{t("GoHome")}</Texts>
                  <Images
                    titleImg="/home.svg"
                    titleImgAlt="Home Icon"
                    size={"50"}
                  />
               </Holds>
              </Buttons>
              <Buttons
                background={"orange"}
                size={null}
                onClick={handleCOButton2}
              >
                <Holds className="my-2">
                  <Texts>{t("Break")}</Texts>
                  <Images
                    titleImg="/break.svg"
                    titleImgAlt="Break Icon"
                    size={"50"}
                  />
                </Holds>
              </Buttons>
              <Modals
                isOpen={isModalOpen}
                handleClose={handleCloseModal}
                variant={"default"}
                size={"clock"}
                type={"clock"}
              >
                <div className="flex flex-col bg-white px-2 ">
                  <h1>{t("Submit")}</h1>
                  <Buttons
                    background={"orange"}
                    size={"full"}
                    href={`/dashboard/equipment`}
                  >
                    <Texts>{t("CurrEQ")}</Texts>
                  </Buttons>
                </div>
              </Modals>
              <Buttons 
                background={"red"} 
                size={"full"}
                onClick={handleCOButton3}
              >
                 <Holds className="my-2">
                  <Texts>{t("End")}</Texts>
                  <Images
                    titleImg="/end-day.svg"
                    titleImgAlt="End Icon"
                    size={"50"}
                  />
                </Holds>
              </Buttons>
            </>
        ) :
        //all pages get these buttons except models
        (
            <>
            <Buttons
              background={"orange"}
              size={"full"}
              href="/dashboard/switch-jobs"
            >
              <Holds className="my-2">
                <Images
                  titleImg="/jobsite.svg"
                  titleImgAlt="Jobsite Icon"
                  size={"50"}
                ></Images>
                <Texts>{t("SwitchJobs")}</Texts>
              </Holds>
            </Buttons>
            <Buttons
              href="/dashboard/equipment"
              background={"green"}
              size={"full"}
              onClick={() => handleShowAdditionalButtons("equipment")}
            >
              <Holds className="my-2">
                <Images
                  titleImg="/equipment.svg"
                  titleImgAlt="Equipment Icon"
                  size={"50"}
                ></Images>
                <Texts>{t("Equipment")}</Texts>
              </Holds>
            </Buttons>
            <Buttons
              href="/dashboard/forms"
              background={"green"}
              size={"full"}
            >
              <Holds className="my-2">
                <Images
                  titleImg="/form.svg"
                  titleImgAlt="Forms Icon"
                  size={"50"}
                ></Images>
                <Texts>{t("Forms")}</Texts>
              </Holds>
            </Buttons>
            <Buttons
              href="/dashboard/clock-out"
              background={"red"}
              size={"full"}
              onClick={() => handleShowAdditionalButtons("clockOut")}
            >
              <Holds className="my-2">
                <Images
                  titleImg="/clock-out.svg"
                  titleImgAlt="Clock Out Icon"
                  size={"50"}
                ></Images>
                <Texts >{t("ClockOut")}</Texts>
              </Holds>
            </Buttons>
          </>
        )}  
        </Grids>
        </> 
        )}
</>
)}