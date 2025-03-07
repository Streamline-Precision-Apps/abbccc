"use client";
import { Contents } from "@/components/(reusable)/contents";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Spinner } from "@nextui-org/react";
import ClockOutWidget from "../_buttons/AdditonalclockOutBtns";
import ClockOutBtn from "../_buttons/clockOutBtn";
import FormsBtn from "../_buttons/formsBtn";
import GeneratorBtn from "../_buttons/generatorBtn";
import MyTeamWidget from "../_buttons/myTeamBtn";
import SwitchJobsBtn from "../_buttons/switchJobsBtn";
import { Dispatch, SetStateAction, use, useEffect } from "react";
import TascoBtn from "../_buttons/TascoBtn";
import { LogItem } from "@/lib/types";
import { useModalState } from "@/hooks/(dashboard)/useModalState";
import GeneralDashboardView from "./generalDashboardView";

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
  laborType,
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
  laborType: string;
}) {
  useEffect(() => {
    console.log("laborType: ", laborType);
  }, []);
  const modalState = useModalState();

  if (laborType === "manualLabor") {
    return (
      <GeneralDashboardView
        additionalButtonsType={additionalButtonsType}
        isModalOpen={isModalOpen}
        isModal2Open={isModal2Open}
        setIsModal2Open={setIsModal2Open}
        comment={comment}
        setComment={setComment}
        handleCOButton2={handleCOButton2}
        handleCOButton3={handleCOButton3}
        handleCloseModal={handleCloseModal}
        handleShowManagerButtons={handleShowManagerButtons}
        permission={permission}
        handleShowAdditionalButtons={handleShowAdditionalButtons}
        logs={logs}
      />
    );
  } else {
    return (
      <>
        <Contents width={"section"} className="py-5">
          <Grids cols={"2"} rows={permission !== "USER" ? "3" : "3"} gap={"5"}>
            {/* Render buttons based on state */}
            {additionalButtonsType === "clockOut" ? (
              <Holds
                className={
                  permission !== "USER"
                    ? "col-span-2 row-span-4 gap-5 h-full"
                    : "col-span-2 row-span-3 gap-5 h-full"
                }
              >
                <ClockOutWidget
                  handleShowManagerButtons={handleShowManagerButtons}
                  {...modalState}
                  comment={comment}
                  setComment={setComment}
                  handleCOButton2={handleCOButton2}
                  handleCOButton3={handleCOButton3}
                  logs={logs}
                />
              </Holds>
            ) : (
              <>
                <TascoBtn
                  permission={permission}
                  view={"tasco"}
                  laborType={laborType}
                />
                <SwitchJobsBtn
                  {...modalState}
                  handleShowManagerButtons={handleShowManagerButtons}
                  permission={permission}
                  logs={logs}
                  laborType={laborType}
                  view={"tasco"}
                />
                {permission !== "USER" && !additionalButtonsType && (
                  <GeneratorBtn />
                )}
                {permission !== "USER" && !additionalButtonsType && (
                  <MyTeamWidget />
                )}

                <ClockOutBtn
                  handleShowAdditionalButtons={handleShowAdditionalButtons}
                  permission={permission}
                  laborType={laborType}
                  View={"tasco"}
                />
              </>
            )}
          </Grids>
        </Contents>
      </>
    );
  }
}
