"use client";
import { Contents } from "@/components/(reusable)/contents";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Spinner } from "@nextui-org/react";
import ClockOutWidget from "../_buttons/AdditonalclockOutBtns";
import EquipmentWidget from "../_buttons/AdditonalEquipmentBtns";
import ClockOutBtn from "../_buttons/clockOutBtn";
import EquipmentBtn from "../_buttons/equipmentBtn";
import FormsBtn from "../_buttons/formsBtn";
import GeneratorBtn from "../_buttons/generatorBtn";
import MyTeamWidget from "../_buttons/myTeamBtn";
import SwitchJobsBtn from "../_buttons/switchJobsBtn";
import { Dispatch, SetStateAction } from "react";
import { LogItem } from "@/lib/types";
import useModalState from "@/hooks/(dashboard)/useModalState";

export default function GeneralDashboardView({
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
  handleShowAdditionalButtons: (button: string) => void;
  logs: LogItem[];
}) {
  const modalState = useModalState();
  return (
    <>
      <Contents width={"section"} className="py-5">
        <Grids
          cols={"2"}
          rows={
            permission === "ADMIN" ||
            permission === "SUPERADMIN" ||
            permission === "MANAGER"
              ? "3"
              : "3"
          }
          gap={"5"}
        >
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
              {permission !== "USER" && !additionalButtonsType && (
                <GeneratorBtn />
              )}

              {permission !== "USER" && !additionalButtonsType && (
                <MyTeamWidget />
              )}

              <EquipmentBtn
                handleShowAdditionalButtons={handleShowAdditionalButtons}
                permission={permission}
              />

              <FormsBtn permission={permission} view={"general"} />

              <SwitchJobsBtn
                {...modalState}
                handleShowManagerButtons={handleShowManagerButtons}
                permission={permission}
                logs={logs}
                laborType={"general"}
                view={"general"}
              />

              <ClockOutBtn
                handleShowAdditionalButtons={handleShowAdditionalButtons}
                permission={permission}
                View={"general"}
                laborType="general"
              />
            </>
          )}
        </Grids>
      </Contents>
    </>
  );
}
