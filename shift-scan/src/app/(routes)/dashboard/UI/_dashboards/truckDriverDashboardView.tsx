"use client";
import { Contents } from "@/components/(reusable)/contents";
import { Grids } from "@/components/(reusable)/grids";
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
  logs: LogItem[];
  laborType: string;
}) {
  const modalState = useModalState();
  return (
    <>
      <Contents width={"section"} className="py-5">
        <Grids cols={"2"} rows={"3"} gap={"5"}>
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
              handleShowAdditionalButtons={handleCOButton3}
              permission={permission}
              View={"truck"}
              laborType={laborType}
            />
          </>
        </Grids>
      </Contents>
    </>
  );
}
