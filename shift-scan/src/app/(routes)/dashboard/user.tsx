"use client";
import { useTranslations } from "next-intl";
import { Buttons } from "@/components/(reusable)/buttons";
import { Images } from "@/components/(reusable)/images";
import { Texts } from "@/components/(reusable)/texts";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Modals } from "@/components/(reusable)/modals";
import ClockProcessor from "@/components/(clock)/clockProcess";
import { useSession } from "next-auth/react";
import { CustomSession } from "@/lib/types";
import { setAuthStep } from "@/app/api/auth";
import { Logs } from "@/lib/types";
import { updateTimeSheetBySwitch } from "@/actions/timeSheetActions";
import { Contents } from "@/components/(reusable)/contents";

interface UserProps {
  additionalButtonsType: string | null;
  handleShowManagerButtons: () => void;
  handleShowAdditionalButtons: (type: string) => void;
  logs: Logs[]; // Use the consistent Logs type
  locale: string;
  manager: boolean;
}

export default function User({
  additionalButtonsType,
  handleShowManagerButtons,
  handleShowAdditionalButtons,
  logs, // Use logs prop
  locale,
  manager}: UserProps
){
  const t = useTranslations("ManagerButtons");
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: session } = useSession() as { data: CustomSession | null };
  const user = session?.user;

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
      formData2.append('end_time', new Date().toISOString()); 
      formData2.append('timesheet_comments', '');
      formData2.append('app_comment', 'On break');
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
      {additionalButtonsType === "equipment" ? (
        <>
          <Buttons
            variant={"default"}
            size={"widgetMed"}
            onClick={handleShowManagerButtons}
          >
            <Contents variant={"widgetButtonRow"} size={"test"}>
              <Texts size={"widgetMed"}>{t("GoHome")}</Texts>
              <Images
                  titleImg="/new/home.svg"
                  titleImgAlt="Home Icon"
                  variant={"icon"}
                  size={"widgetMed"}
              />
            </Contents>
          </Buttons>
          <Buttons
            variant={"green"}
            size={"widgetMed"}
            href="/dashboard/log-new"
          >
            <Contents variant={"widgetButtonRow"} size={"test"}>
              <Texts size={"widgetMed"}>{t("LogNew")}</Texts>
              <Images
                titleImg="/new/equipment.svg"
                titleImgAlt="Equipment Icon"
                variant={"icon"}
                size={"widgetMed"}
              />
            </Contents>
          </Buttons>
          <Buttons
            variant={"orange"}
            size={"widgetMed"}
            href="/dashboard/equipment"
          >
            <Contents variant={"widgetButtonRow"} size={null}>
              <Texts size={"widgetMed"}>{t("Current")}</Texts>
              <Images
                titleImg="/new/current-equipment.svg"
                titleImgAlt="Equipment Icon"
                variant={"icon"}
                size={"widgetMed"}
              />
            </Contents> 
          </Buttons>
        </>
      ) : additionalButtonsType === "clockOut" ? (
        <>
          <Buttons
            variant={"default"}
            size={"widgetMed"}
            onClick={handleShowManagerButtons}
          >
            <Contents variant={"widgetButtonRow"} size={"test"}>
              <Texts size={"widgetMed"}>{t("GoHome")}</Texts>
              <Images
                titleImg="/new/home.svg"
                titleImgAlt="Home Icon"
                variant={"icon"}
                size={"widgetMed"}
              />
            </Contents>
          </Buttons>
          <Buttons
            variant={"orange"}
            size={"widgetMed"}
            onClick={handleCOButton2}
          >
            <Contents variant={"widgetButtonRow"} size={"test"}>
              <Texts size={"widgetMed"}>{t("Break")}</Texts>
              <Images
                titleImg="/new/break.svg"
                titleImgAlt="Break Icon"
                variant={"icon"} 
                size={"widgetMed"}
              />
            </Contents>
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
                variant={"orange"}
                size={"default"}
                href={`/dashboard/equipment`}
              >
                <Texts>{t("CurrEQ")}</Texts>
              </Buttons>
            </div>
          </Modals>
          <Buttons 
            variant={"red"} 
            size={"widgetMed"} 
            onClick={handleCOButton3}
          >
            <Contents variant={"widgetButtonRow"} size={"test"}>
              <Texts size={"widgetMed"}>{t("End")}</Texts>
              <Images
                titleImg="/new/end-day.svg"
                titleImgAlt="End Icon"
                variant={"icon"}
                size={"widgetMed"}
              />
            </Contents>
          </Buttons>
        </>
      ) : (manager === true ? (
        <>
          <Buttons
            variant={"orange"}
            size={"widgetSm"}
            href="/dashboard/switch-jobs"
          >
            <Contents variant={"widgetButton"} size={"test"}>
              <Images
                titleImg="/new/jobsite.svg"
                titleImgAlt="Jobsite Icon"
                variant={"icon"}
                size={"widgetSm"}
              ></Images>
              <Texts size={"widgetSm"}>{t("SwitchJobs")}</Texts>
            </Contents>
          </Buttons>

          <Buttons
            href="/dashboard/equipment"
            variant={"green"}
            size={"widgetSm"}
            onClick={() => handleShowAdditionalButtons("equipment")}
          >
            <Contents variant={"widgetButton"} size={"test"}>
              <Images
                titleImg="/new/equipment.svg"
                titleImgAlt="Equipment Icon"
                variant={"icon"}
                size={"widgetSm"}
              ></Images>
              <Texts size={"widgetSm"}>{t("Equipment")}</Texts>
            </Contents>
          </Buttons>
          <Buttons
            href="/dashboard/forms"
            variant={"green"}
            size={"widgetSm"}
          >
            <Contents variant={"widgetButton"} size={"test"}>
              <Images
                titleImg="/new/form.svg"
                titleImgAlt="Forms Icon"
                variant={"icon"}
                size={"widgetSm"}
              ></Images>
              <Texts size={"widgetSm"}>{t("Forms")}</Texts>
            </Contents>
          </Buttons>
          <Buttons
            href="/dashboard/clock-out"
            variant={"red"}
            size={"widgetSm"}
            onClick={() => handleShowAdditionalButtons("clockOut")}
          >
            <Contents variant={"widgetButton"} size={"test"}>
              <Images
                titleImg="/new/clock-out.svg"
                titleImgAlt="Clock Out Icon"
                variant={"icon"}
                size={"widgetSm"}
              ></Images>
              <Texts size={"widgetSm"}>{t("ClockOut")}</Texts>
            </Contents>
          </Buttons>
        </>
      
      ): //manager === false
      (
        <>
          <Buttons
            variant={"orange"}
            size={"widgetSm"}
            onClick={handleOpenModal}
          >
            <Contents variant={"widgetButton"} size={"test"}>
              <Images
                titleImg="/new/jobsite.svg"
                titleImgAlt="Jobsite Icon"
                variant={"icon"}
                size={"widgetSm"}
              ></Images>
              <Texts size={"widgetSm"}>{t("SwitchJobs")}</Texts>
            </Contents>
          </Buttons>

          <Buttons
            href="/dashboard/equipment"
            variant={"green"}
            size={"widgetSm"}
            onClick={() => handleShowAdditionalButtons("equipment")}
          >
            <Contents variant={"widgetButton"} size={"test"}>
              <Images
                titleImg="/new/equipment.svg"
                titleImgAlt="Equipment Icon"
                variant={"icon"}
                size={"widgetSm"}
              ></Images>
              <Texts size={"widgetSm"}>{t("Equipment")}</Texts>
            </Contents>
          </Buttons>
          <Buttons
            href="/dashboard/forms"
            variant={"green"}
            size={"widgetMed"}
          >
            <Contents variant={"widgetButtonRow"} size={"test"}>
              <Texts size={"widgetMed"}>{t("Forms")}</Texts>
              <Images
                titleImg="/new/form.svg"
                titleImgAlt="Forms Icon"
                variant={"icon"}
                size={"widgetMed"}
              />
            </Contents>
          </Buttons>
          <Buttons
            href="/dashboard/clock-out"
            variant={"red"}
            size={"widgetMed"}
            onClick={() => handleShowAdditionalButtons("clockOut")}
          >
            <Contents variant={"widgetButtonRow"} size={"test"}>
            <Texts size={"widgetMed"}>{t("ClockOut")}</Texts>
              <Images
                titleImg="/new/clock-out.svg"
                titleImgAlt="Clock Out Icon"
                variant={"icon"}
                size={"widgetMed"}
              />
            </Contents>
          </Buttons>
        </>
      
        ))}
    </>
  );
};
