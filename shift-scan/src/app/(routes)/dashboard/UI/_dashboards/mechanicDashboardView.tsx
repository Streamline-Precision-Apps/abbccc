"use client";
import { Contents } from "@/components/(reusable)/contents";
import { Grids } from "@/components/(reusable)/grids";
import ClockOutBtn from "../_buttons/clockOutBtn";
import GeneratorBtn from "../_buttons/generatorBtn";
import MyTeamWidget from "../_buttons/myTeamBtn";
import SwitchJobsBtn from "../_buttons/switchJobsBtn";
import OfflineStatusWidget from "@/components/(offline)/offline-status-widget";
import { Dispatch, SetStateAction } from "react";
import MechanicBtn from "../_buttons/MechanicBtns";
import { LogItem } from "@/lib/types";
import useModalState from "@/hooks/(dashboard)/useModalState";

export default function MechanicDashboardView({
  additionalButtonsType,
  verifyLogsCompletion,
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
  verifyLogsCompletion: () => void;
  permission: string;
  logs: LogItem[];
  mechanicProjectID: string;
  laborType: string;
}) {
  const modalState = useModalState();
  return (
    <>
      <Contents width={"section"} className="py-5">
        <OfflineStatusWidget className="mb-4" />
        <Grids cols={"2"} rows={"3"} gap={"5"}>
          <>
            <MechanicBtn permission={permission} view={"mechanic"} />
            <SwitchJobsBtn
              {...modalState}
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
              handleShowAdditionalButtons={verifyLogsCompletion}
              permission={permission}
              mechanicProjectID={mechanicProjectID}
              logs={logs}
              View={"mechanic"}
              laborType={laborType}
            />
          </>
        </Grids>
      </Contents>
    </>
  );
}
