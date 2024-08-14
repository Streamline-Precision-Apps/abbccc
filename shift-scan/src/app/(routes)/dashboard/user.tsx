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
import { Equipment, Logs } from "@/lib/types";
import { updateTimeSheetBySwitch } from "@/actions/timeSheetActions";
import { Manager } from "./manager";

interface UserProps {
  additionalButtonsType: string | null;
  handleShowManagerButtons: () => void;
  handleShowAdditionalButtons: (type: string) => void;
  logs: Logs[]; // Use the consistent Logs type
  locale: string;
}

export const User: React.FC<UserProps> = ({
  additionalButtonsType,
  handleShowManagerButtons,
  handleShowAdditionalButtons,
  logs, // Use logs prop
  locale,
}) => {
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
            size={"widgetSm"}
            onClick={handleShowManagerButtons}
          >
            <div>
              <Images
                titleImg="/home.svg"
                titleImgAlt="Home Icon"
                variant={"icon"}
                size={"default"}
              ></Images>
              <Texts>{t("GoHome")}</Texts>
            </div>
          </Buttons>
          <Buttons
            variant={"green"}
            size={"widgetSm"}
            onClick={handleOpenModal}
          >
            <Images
              titleImg="/equipment.svg"
              titleImgAlt="Equipment Icon"
              variant={"icon"}
              size={"default"}
            />
            <Texts>{t("LogNew")}</Texts>
          </Buttons>
          <Modals
            isOpen={isModalOpen}
            handleClose={handleCloseModal}
            variant={"default"}
            size={"default"}
            type={"default"}
          >
            <div>
              <ClockProcessor
                type={"equipment"}
                id={user?.id}
                scannerType={"equipment"}
                isModalOpen={isModalOpen}
                locale={locale}
              />
            </div>
          </Modals>
          <Buttons
            variant={"orange"}
            size={"widgetSm"}
            href="/dashboard/equipment"
          >
            <Images
              titleImg="/forms.svg"
              titleImgAlt="Current Equipment Icon"
              variant={"icon"}
              size={"default"}
            />
            <Texts>{t("Current")}</Texts>
          </Buttons>
        </>
      ) : additionalButtonsType === "clockOut" ? (
        <>
          <Buttons
            variant={"default"}
            size={"widgetSm"}
            onClick={handleShowManagerButtons}
          >
            <Texts>{t("GoHome")}</Texts>
          </Buttons>
          <Buttons
            variant={"orange"}
            size={"widgetSm"}
            onClick={handleCOButton2}
          >
            <Texts>{t("Break")}</Texts>
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
          <Buttons variant={"red"} size={"widgetSm"} onClick={handleCOButton3}>
            <Texts>{t("End")}</Texts>
          </Buttons>
        </>
      ) : (
        <>
          <Buttons
            variant={"orange"}
            size={"widgetSm"}
            onClick={handleOpenModal}
          >
            <Images
              titleImg="/jobsite.svg"
              titleImgAlt="Jobsite Icon"
              variant={"icon"}
              size={"widgetSm"}
            ></Images>
            <Texts>{t("SwitchJobs")}</Texts>
          </Buttons>
          <Modals
            isOpen={isModalOpen}
            handleClose={handleCloseModal}
            variant={"default"}
            size={"clock"}
            type={"clock"}
          >
            <div className="flex flex-col bg-white px-2 ">
              <ClockProcessor
                type={"switchJobs"}
                id={user?.id}
                scannerType={"jobsite"}
                isModalOpen={isModalOpen}
                locale={locale}
              />
            </div>
          </Modals>

          <Buttons
            href="/dashboard/equipment"
            variant={"green"}
            size={"widgetSm"}
            onClick={() => handleShowAdditionalButtons("equipment")}
          >
            <Images
              titleImg="/equipment.svg"
              titleImgAlt="Equipment Icon"
              variant={"icon"}
              size={"widgetSm"}
            ></Images>
            <Texts>{t("Equipment")}</Texts>
          </Buttons>
          <Buttons
            href="/dashboard/forms"
            variant={"default"}
            size={"widgetSm"}
          >
            <Images
              titleImg="/forms.svg"
              titleImgAlt="Forms Icon"
              variant={"icon"}
              size={"widgetSm"}
            ></Images>
            <Texts>{t("Forms")}</Texts>
          </Buttons>
          <Buttons
            href="/dashboard/clock-out"
            variant={"red"}
            size={"widgetSm"}
            onClick={() => handleShowAdditionalButtons("clockOut")}
          >
            <Images
              titleImg="/clockOut.svg"
              titleImgAlt="Clock Out Icon"
              variant={"icon"}
              size={"widgetSm"}
            ></Images>
            <Texts>{t("ClockOut")}</Texts>
          </Buttons>
        </>
      )}
    </>
  );
};
