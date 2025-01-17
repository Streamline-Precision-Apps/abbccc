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
import EngineerBtn from "../_buttons/EnginneerBtns";

export default function MechanicDashboardView({
  loading,
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
  loading: boolean;
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
      {loading ? (
        <Holds className="my-auto">
          <Spinner />
        </Holds>
      ) : (
        <Contents width={"section"} className="py-5">
          <Grids cols={"2"} rows={permission !== "USER" ? "4" : "3"} gap={"5"}>
            {/* Render buttons based on state */}
            {additionalButtonsType === "equipment" ? (
              <EquipmentWidget
                handleShowManagerButtons={handleShowManagerButtons}
              />
            ) : additionalButtonsType === "clockOut" ? (
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
            ) : (
              <>
                <EngineerBtn permission={permission} view={"mechanic"} />
                {permission !== "USER" && !additionalButtonsType && (
                  <GeneratorBtn />
                )}
                {permission !== "USER" && !additionalButtonsType && (
                  <MyTeamWidget />
                )}

                <FormsBtn permission={permission} view={"mechanic"} />

                <SwitchJobsBtn permission={permission} />

                <ClockOutBtn
                  handleShowAdditionalButtons={handleShowAdditionalButtons}
                  permission={permission}
                  View={"mechanic"}
                />
              </>
            )}
          </Grids>
        </Contents>
      )}
    </>
  );
}
