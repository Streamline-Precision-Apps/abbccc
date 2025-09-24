"use client";
import { Contents } from "@/components/(reusable)/contents";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import ClockOutBtn from "../_buttons/clockOutBtn";
import EquipmentBtn from "../_buttons/equipmentBtn";
import GeneratorBtn from "../_buttons/generatorBtn";
import MyTeamWidget from "../_buttons/myTeamBtn";
import SwitchJobsBtn from "../_buttons/switchJobsBtn";
import { Dispatch, SetStateAction } from "react";
import { LogItem } from "@/lib/types";
import useModalState from "@/hooks/(dashboard)/useModalState";

export default function GeneralDashboardView({
  additionalButtonsType,
  verifyLogsCompletion,
  permission,
  logs,
  mechanicProjectID,
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
}) {
  const modalState = useModalState();
  return (
    <>
      <Contents width={"section"} className="py-5">
        <Grids cols={"2"} rows={"3"} gap={"5"}>
          <>
            <EquipmentBtn permission={permission} />

            <SwitchJobsBtn
              {...modalState}
              permission={permission}
              logs={logs}
              laborType={"general"}
              view={"general"}
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
              logs={logs}
              mechanicProjectID={mechanicProjectID}
              View={"general"}
              laborType="general"
            />
          </>
        </Grids>
      </Contents>
    </>
  );
}
