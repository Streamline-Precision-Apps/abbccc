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
import TascoBtn from "../_buttons/TascoBtn";
import { LogItem } from "@/lib/types";
import { useModalState } from "@/hooks/(dashboard)/useModalState";

export default function TascoDashboardView({
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
  logs,
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
  currentView: string | null;
  handleShowAdditionalButtons: (button: string) => void;
  logs: LogItem[];
}) {
  const modalState = useModalState();
  return (
    <>
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
              {...modalState}
              comment={comment}
              setComment={setComment}
              handleCOButton2={handleCOButton2}
              handleCOButton3={handleCOButton3}
              logs={logs}
            />
          ) : (
            <>
              <TascoBtn permission={permission} view={"tasco"} />
              {permission !== "USER" && !additionalButtonsType && (
                <GeneratorBtn />
              )}
              {permission !== "USER" && !additionalButtonsType && (
                <MyTeamWidget />
              )}

              <FormsBtn permission={permission} view={"tasco"} />

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
    </>
  );
}
