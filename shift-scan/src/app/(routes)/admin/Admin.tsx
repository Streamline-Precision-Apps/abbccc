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

interface AdminProps {
  additionalButtonsType: string | null;
  handleShowManagerButtons: () => void;
  handleShowAdditionalButtons: (type: string) => void;
}

export const Admin: React.FC<AdminProps> = ({
  additionalButtonsType,
  handleShowManagerButtons,
  handleShowAdditionalButtons,
}) => {
  const t = useTranslations("admin");
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

  return (
    <>
      {additionalButtonsType === "recruitment" ? (
        <>
          <Buttons
            variant={"default"}
            size={"widgetSm"}
            onClick={handleShowManagerButtons}
          >
            <div className="flex flex-row justify-center items-center ">
              <Images
                titleImg="/home.svg"
                titleImgAlt="Home Icon"
                variant={"icon"}
                size={"default"}
              ></Images>
              <Texts>Home</Texts>
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
            <Texts>Log New</Texts>
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
                type={"equipment"}
                id={user?.id}
                scannerType={"equipment"}
                isModalOpen={isModalOpen}
              />
            </div>
          </Modals>
          <Buttons
            variant={"orange"}
            size={"widgetSm"}
            href="/dashboard/equipment/current"
          >
            <Images
              titleImg="/forms.svg"
              titleImgAlt="Current Equipment Icon"
              variant={"icon"}
              size={"default"}
            />
            <Texts>Current Equipment</Texts>
          </Buttons>
        </>
      ) : additionalButtonsType === "clockOut" ? (
        <>
          <Buttons
            variant={"default"}
            size={"widgetSm"}
            onClick={handleShowManagerButtons}
          >
            <Texts>Return Home</Texts>
          </Buttons>
          <Buttons
            variant={"orange"}
            size={"widgetSm"}
          >
            <Texts>Start Break</Texts>
          </Buttons>
          <Modals
            isOpen={isModalOpen}
            handleClose={handleCloseModal}
            variant={"default"}
            size={"clock"}
            type={"clock"}
          >
            <div className="flex flex-col bg-white px-2 ">
              <h1>Equipment logs need to be submitted.</h1>
              <Buttons
                variant={"orange"}
                size={"default"}
                href={`/dashboard/equipment/current`}
              >
                <Texts>View Current Equipment</Texts>
              </Buttons>
            </div>
          </Modals>
          <Buttons variant={"red"} size={"widgetSm"} >
            <Texts>End Work Day</Texts>
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
