"use client";
import { Contents } from "@/components/(reusable)/contents";
import { Grids } from "@/components/(reusable)/grids";
import ClockOutBtn from "../_buttons/clockOutBtn";
import GeneratorBtn from "../_buttons/generatorBtn";
import MyTeamWidget from "../_buttons/myTeamBtn";
import SwitchJobsBtn from "../_buttons/switchJobsBtn";
import { Dispatch, SetStateAction, use, useEffect } from "react";
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
  handleCOButton3,
  handleCloseModal,
  handleShowManagerButtons,
  permission,
  logs,
  laborType,
}: {
  additionalButtonsType: string | null;
  isModalOpen: boolean;
  isModal2Open: boolean;
  setIsModal2Open: Dispatch<SetStateAction<boolean>>;
  comment: string;
  setComment: Dispatch<SetStateAction<string>>;
  handleCOButton3: () => void;
  handleCloseModal: () => void;
  handleShowManagerButtons: () => void;
  permission: string;
  currentView: string | null;
  logs: LogItem[];
  laborType: string;
}) {
  useEffect(() => {
    console.log("laborType: ", laborType);
  }, []);
  const modalState = useModalState();

  if (laborType === "manualLabor") {
    return (
      <>
        <Contents width={"section"} className="py-5">
          <Grids cols={"2"} rows={"3"} gap={"5"}>
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
                handleShowAdditionalButtons={handleCOButton3}
                permission={permission}
                laborType={laborType}
                View={"tasco"}
              />
            </>
          </Grids>
        </Contents>
      </>
    );
  } else {
    return (
      <>
        <Contents width={"section"} className="py-5">
          <Grids cols={"2"} rows={"3"} gap={"5"}>
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
                handleShowAdditionalButtons={handleCOButton3}
                permission={permission}
                laborType={laborType}
                View={"tasco"}
              />
            </>
          </Grids>
        </Contents>
      </>
    );
  }
}
