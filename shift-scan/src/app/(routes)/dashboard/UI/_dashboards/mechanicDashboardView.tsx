"use client";
import { Contents } from "@/components/(reusable)/contents";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Spinner } from "@nextui-org/react";
import ClockOutWidget from "../_buttons/AdditonalclockOutBtns";
import EquipmentWidget from "../_buttons/AdditonalEquipmentBtns";
import ClockOutBtn from "../_buttons/clockOutBtn";

import FormsBtn from "../_buttons/formsBtn";
import GeneratorBtn from "../_buttons/generatorBtn";
import MyTeamWidget from "../_buttons/myTeamBtn";
import SwitchJobsBtn from "../_buttons/switchJobsBtn";
import { Dispatch, SetStateAction } from "react";
import EngineerBtn from "../_buttons/MechanicBtns";
import MechanicBtn from "../_buttons/MechanicBtns";

export default function MechanicDashboardView({
  additionalButtonsType,
  isModalOpen,
  isModal2Open,
  setIsModal2Open,
  comment,
  setComment,
  handleCOButton2,
  handleCOButton3,
  handleCloseModal,
  handleShowManagerButtons,
  permission,
  handleShowAdditionalButtons,
}: {
  additionalButtonsType: string | null;
  isModalOpen: boolean;
  isModal2Open: boolean;
  setIsModal2Open: Dispatch<SetStateAction<boolean>>;
  comment: string;
  setComment: Dispatch<SetStateAction<string>>;
  handleCOButton2: () => void;
  handleCOButton3: () => void;
  handleCloseModal: () => void;
  handleShowManagerButtons: () => void;
  permission: string;
  handleShowAdditionalButtons: (button: string) => void;
}) {
  return (
    <>
      <Contents width={"section"} className="py-5">
        <Grids cols={"2"} rows={"3"} gap={"5"}>
          {/* Render buttons based on state */}
          {additionalButtonsType === "equipment" ? (
            <Holds
              className={
                permission !== "USER"
                  ? "col-span-2 row-span-4 gap-5 h-full"
                  : "col-span-2 row-span-3 gap-5 h-full"
              }
            >
              <EquipmentWidget
                handleShowManagerButtons={handleShowManagerButtons}
              />
            </Holds>
          ) : additionalButtonsType === "clockOut" ? (
            <Holds
              className={
                permission !== "USER"
                  ? "col-span-2 row-span-4 gap-5 h-full"
                  : "col-span-2 row-span-3 gap-5 h-full"
              }
            >
              <ClockOutWidget
                handleShowManagerButtons={handleShowManagerButtons}
                setIsModal2Open={setIsModal2Open}
                isModal2Open={isModal2Open}
                isModalOpen={isModalOpen}
                comment={comment}
                setComment={setComment}
                handleCOButton2={handleCOButton2}
                handleCOButton3={handleCOButton3}
                handleCloseModal={handleCloseModal}
              />
            </Holds>
          ) : (
            <>
              <MechanicBtn permission={permission} view={"mechanic"} />
              <SwitchJobsBtn permission={permission} />
              {permission !== "USER" && !additionalButtonsType && (
                <GeneratorBtn />
              )}
              {permission !== "USER" && !additionalButtonsType && (
                <MyTeamWidget />
              )}

              <FormsBtn permission={permission} view={"mechanic"} />

              <ClockOutBtn
                handleShowAdditionalButtons={handleShowAdditionalButtons}
                permission={permission}
                View={"mechanic"}
              />
            </>
          )}
        </Grids>
      </Contents>
    </>
  );
}
