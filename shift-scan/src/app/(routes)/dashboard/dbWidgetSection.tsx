"use client";
import { Buttons } from "@/components/(reusable)/buttons";
import { Images } from "@/components/(reusable)/images";
import { Texts } from "@/components/(reusable)/texts";
import { useTranslations } from "next-intl";
import { Grids } from "@/components/(reusable)/grids";
import { useEffect, useMemo, useState } from "react";
import { Holds } from "@/components/(reusable)/holds";

import { useRouter } from "next/navigation";
import { Session } from "next-auth";
import { getAuthStep, setAuthStep } from "@/app/api/auth";
import Spinner from "@/components/(animations)/spinner";
import { updateTimeSheetBySwitch } from "@/actions/timeSheetActions";
import { Modals } from "@/components/(reusable)/modals";
import React from "react";
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

  useEffect(() => {
    const fetchLogs = async () => {
    setLoading(true);
    try{
      const recentLogsResponse = await fetch("/api/getLogs");
      const logs = await recentLogsResponse.json();
      setLogs(logs);
    }
    catch {
      console.error("Error fetching logs:", error);
    }
    finally{
      setLoading(false);
    }
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
{/* Loading Spinner */}
    {loading ? (
            <>
            <Holds >
            <Spinner
            />
            </Holds>
            </>
        ):
    (
      <>
      {/* Component that will render */}
        <Grids >
{/* Checks if a user has a permission of "USER" it won't render any manager buttons below */}
        {(permission !=="USER") && !additionalButtonsType && (
            <>
            <Holds 
            position={"row"}
            className="row-span-1 col-span-2">
              <Buttons 
              href="/dashboard/qr-generator" 
              background={"lightBlue"}
              size={"widgetSm"}>
              <Holds className="my-2">
                <Images titleImg="/qr.svg" titleImgAlt="QR Code" background={"none"} size={"40"}/>
                <Texts size={"p4"}>{t("QrGenerator")}</Texts>
              </Holds>
            </Buttons>
            <Buttons 
            href="/dashboard/myTeam" 
            background={"lightBlue"}
            size={"widgetSm"}>
              <Holds className="my-2">
                <Images titleImg="/team.svg" titleImgAlt="my team" background={"none"} size={"40"}/>
                <Texts size={"p4"}>{t("MyTeam")}</Texts>
              </Holds>
            </Buttons>
          </Holds>
            </>
          )
        }
{/* This section includes the buttons within equipment */}
        {additionalButtonsType === "equipment" ? (
          <>
           <Holds size={"full"} className="col-span-1">
            <Buttons
             background={"lightBlue"}
            size={"widgetMed"}
            onClick={handleShowManagerButtons}
          >
            <Holds className="my-2">
              <Texts size={"p4"}>{t("GoHome")}</Texts>
              <Images
                  titleImg="/home.svg"
                  titleImgAlt="Home Icon"
                  size={"20"}
              />
            </Holds>
          </Buttons>
        </Holds>
        <Holds size={"full"} className="col-span-1">
          <Buttons
            background={"green"}
            size={"widgetMed"}
            href="/dashboard/log-new"
          >
             <Holds className="my-2">
              <Texts size={"p4"}>{t("LogNew")}</Texts>
              <Images
                titleImg="/equipment.svg"
                titleImgAlt="Equipment Icon"
                size={"20"}
              />
            </Holds>
          </Buttons>
        </Holds>
        <Holds size={"full"} className="col-span-2">
          <Buttons
             background={"orange"}
             size={"widgetMed"}
            href="/dashboard/equipment"
          >
             <Holds className="my-2">
              <Texts size={"p4"}>{t("Current")}</Texts>
              <Images
                titleImg="/current-equipment.svg"
                titleImgAlt="Equipment Icon"
                size={"20"}
              />
            </Holds>
          </Buttons>
        </Holds>
        </>
        ) :
        additionalButtonsType === "clockOut" ? (
          <>
{/* this ternary show all the buttons within ClockOut toggle */}
          <Holds size={"full"} className="col-span-1">
              <Buttons
                background={"lightBlue"}
                 size={"full"}
                className="p-4"
                onClick={handleShowManagerButtons}
              >
                 <Holds className="my-2">
                  <Texts size={"p4"}>{t("GoHome")}</Texts>
                  <Images
                    titleImg="/home.svg"
                    titleImgAlt="Home Icon"
                    size={"40"}
                  />
               </Holds>
              </Buttons>
            </Holds>
            <Holds size={"full"} className="col-span-1">
              <Buttons
                background={"orange"}
                size={"full"}
                className="p-4"
                onClick={handleCOButton2}
              >
                <Holds className="my-2">
                  <Texts size={"p4"}>{t("Break")}</Texts>
                  <Images
                    titleImg="/break.svg"
                    titleImgAlt="Break Icon"
                    size={"40"}
                  />
                </Holds>
              </Buttons>
            </Holds>
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
                     className="p-4"
                    href={`/dashboard/equipment`}
                  >
                    <Texts size={"p3"}>{t("CurrEQ")}</Texts>
                  </Buttons>
                </div>
              </Modals>
              <Holds size={"full"} className="col-span-2">
              <Buttons 
                background={"red"} 
                size={"full"}
                onClick={handleCOButton3}
                 className="p-4"
              >
                 <Holds position={"row"} className="justify-between space-x-4" >
                  <Texts size={"p2"}>{t("End")}</Texts>
                  <Images
                    titleImg="/end-day.svg"
                    titleImgAlt="End Icon"
                    size={"40"}
                  />
                </Holds>
              </Buttons>
            </Holds>
            </>
        ) :
        //all pages get these buttons except for the additional button type sections
        (
            <>
            <Holds 
            position={"row"}
            className="row-span-1 col-span-2">
              <Buttons
                background={"orange"}
                size={"widgetSm"}
                href="/dashboard/switch-jobs"
                
              >
                <Holds className="my-2">
                  <Images
                    titleImg="/jobsite.svg"
                    titleImgAlt="Jobsite Icon"
                    size={"40"}
                  ></Images>
                  <Texts size={"p4"}>{t("SwitchJobs")}</Texts>
                </Holds>
              </Buttons>
              <Buttons
                href="/dashboard/equipment"
                background={"green"}
                size={"widgetSm"}
                onClick={() => handleShowAdditionalButtons("equipment")}
              >
                <Holds className="my-2">
                  <Images
                    titleImg="/equipment.svg"
                    titleImgAlt="Equipment Icon"
                    size={"40"}
                  ></Images>
                  <Texts size={"p4"}>{t("Equipment")}</Texts>
                </Holds>
              </Buttons>
            </Holds>
            <Holds 
            position={"row"}
            className="row-span-1 col-span-2">
              <Buttons
                href="/dashboard/forms"
                background={"green"}
                size={"widgetSm"}
              >
                <Holds className="my-2">
                  <Images
                    titleImg="/form.svg"
                    titleImgAlt="Forms Icon"
                    size={"40"}
                  ></Images>
                  <Texts size={"p4"}>{t("Forms")}</Texts>
                </Holds>
              </Buttons>
              <Buttons
                href="/dashboard/clock-out"
                background={"red"}
                size={"widgetSm"}
                onClick={() => handleShowAdditionalButtons("clockOut")}
              >
                <Holds className="my-2">
                  <Images
                    titleImg="/clock-out.svg"
                    titleImgAlt="Clock Out Icon"
                    size={"40"}
                  ></Images>
                  <Texts size={"p4"}>{t("ClockOut")}</Texts>
                </Holds>
              </Buttons>
            </Holds>
          </>
        )}  
        </Grids>
        </> 
        )}
</>
)}