"use client";
import { Contents } from "@/components/(reusable)/contents";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import ClockOutWidget from "../_buttons/AdditonalclockOutBtns";
import ClockOutBtn from "../_buttons/clockOutBtn";
import EquipmentBtn from "../_buttons/equipmentBtn";
import GeneratorBtn from "../_buttons/generatorBtn";
import MyTeamWidget from "../_buttons/myTeamBtn";
import SwitchJobsBtn from "../_buttons/switchJobsBtn";
import TruckingBtn from "../_buttons/truckingBtn";
import { Dispatch, SetStateAction } from "react";
import { LogItem } from "@/lib/types";
import useModalState from "@/hooks/(dashboard)/useModalState";

export default function TruckDriverDashboardView({
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
  handleShowAdditionalButtons: (button: string) => void;
  logs: LogItem[];
  laborType: string;
}) {
  const modalState = useModalState();
  return (
    <>
      <Contents width={"section"} className="py-5">
        <Grids cols={"2"} rows={"3"} gap={"5"}>
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
                {...modalState}
                handleShowManagerButtons={handleShowManagerButtons}
                comment={comment}
                setComment={setComment}
                handleCOButton2={handleCOButton2}
                handleCOButton3={handleCOButton3}
                logs={logs}
              />
            </Holds>
          ) : (
            <>
              <TruckingBtn
                permission={permission}
                view={"truck"}
                laborType={laborType}
              />
              {permission === "USER" && laborType === "truckLabor" && (
                <EquipmentBtn permission={permission} />
              )}

              <SwitchJobsBtn
                {...modalState}
                handleShowManagerButtons={handleShowManagerButtons}
                permission={permission}
                logs={logs}
                laborType={laborType}
                view={"truck"}
              />
              {permission !== "USER" && !additionalButtonsType && (
                <GeneratorBtn />
              )}

              {permission !== "USER" && !additionalButtonsType && (
                <MyTeamWidget />
              )}
              {permission !== "USER" && laborType === "truckLabor" && (
                <EquipmentBtn permission={permission} />
              )}

              <ClockOutBtn
                handleShowAdditionalButtons={handleShowAdditionalButtons}
                permission={permission}
                View={"truck"}
                laborType={laborType}
              />
            </>
          )}
        </Grids>
      </Contents>
    </>
  );
}
