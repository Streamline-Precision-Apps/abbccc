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
import { Dispatch, SetStateAction } from "react";
import EngineerBtn from "../_buttons/MechanicBtns";
import MechanicBtn from "../_buttons/MechanicBtns";
import { LogItem } from "@/lib/types";
import useModalState from "@/hooks/(dashboard)/useModalState";

export default function MechanicDashboardView({
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
  mechanicProjectID,
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
  mechanicProjectID: string;
  laborType: string;
}) {
  const modalState = useModalState();
  return (
    <>
      <Contents width={"section"} className="py-5">
        <Grids cols={"2"} rows={"3"} gap={"5"}>
          <>
            <MechanicBtn permission={permission} view={"mechanic"} />
            <SwitchJobsBtn
              {...modalState}
              handleShowManagerButtons={handleShowManagerButtons}
              permission={permission}
              mechanicProjectID={mechanicProjectID}
              logs={logs}
              laborType={laborType}
              view={"mechanic"}
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
              View={"mechanic"}
              laborType={laborType}
            />
          </>
        </Grids>
      </Contents>
    </>
  );
}
