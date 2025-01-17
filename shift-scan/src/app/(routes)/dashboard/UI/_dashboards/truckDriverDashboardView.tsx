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
import TruckingBtn from "../_buttons/truckingBtn";
import { Dispatch, SetStateAction } from "react";

export default function TruckDriverDashboardView({
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
          <Grids
            cols={"2"}
            rows={
              permission === "ADMIN" ||
              permission === "SUPERADMIN" ||
              permission === "MANAGER"
                ? "4"
                : "3"
            }
            gap={"5"}
          >
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
                <TruckingBtn permission={permission} view={"truck"} />
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
                <FormsBtn permission={permission} view={"truck"} />

                <SwitchJobsBtn permission={permission} />

                <ClockOutBtn
                  handleShowAdditionalButtons={handleShowAdditionalButtons}
                  permission={permission}
                  View={"truck"}
                />
              </>
            )}
          </Grids>
        </Contents>
      )}
    </>
  );
}
