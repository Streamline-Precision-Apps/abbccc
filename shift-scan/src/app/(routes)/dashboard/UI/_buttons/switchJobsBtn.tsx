import { Buttons } from "@/components/(reusable)/buttons";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Images } from "@/components/(reusable)/images";
import { NModals } from "@/components/(reusable)/newmodals";
import { Texts } from "@/components/(reusable)/texts";
import { Titles } from "@/components/(reusable)/titles";
import useModalState from "@/hooks/(dashboard)/useModalState";
import { LogItem } from "@/lib/types";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import HorizontalLayout from "./horizontalLayout";
import VerticalLayout from "./verticalLayout";

export default function SwitchJobsBtn({
  permission,
  mechanicProjectID,
  logs,
  laborType,
  view,
}: {
  permission: string;
  mechanicProjectID?: string;

  logs: LogItem[];
  laborType: string;
  view: string;
}) {
  const t = useTranslations("Widgets");
  const modalState = useModalState();
  const router = useRouter();

  return (
    <>
      {permission === "USER" && (
        <>
          {laborType === "truckLabor" ? (
            <VerticalLayout
              text={"Switch"}
              titleImg={"/jobsite.svg"}
              titleImgAlt={"Job site Icon"}
              color={"orange"}
              handleEvent={() => {
                if (logs.length === 0) {
                  router.push("/dashboard/switch-jobs");
                } else if (mechanicProjectID === "") {
                  router.push("/dashboard/switch-jobs");
                } else {
                  modalState.handleOpenModal();
                }
              }}
            />
          ) : (
            <HorizontalLayout
              text={"Switch"}
              titleImg={"/jobsite.svg"}
              titleImgAlt={"Job site Icon"}
              color={"orange"}
              handleEvent={() => {
                if (logs.length === 0) {
                  router.push("/dashboard/switch-jobs");
                } else if (mechanicProjectID === "") {
                  router.push("/dashboard/switch-jobs");
                } else {
                  modalState.handleOpenModal();
                }
              }}
            />
          )}
        </>
      )}
      {permission !== "USER" && (
        <VerticalLayout
          text={"Switch"}
          titleImg={"/jobsite.svg"}
          titleImgAlt={"Job site Icon"}
          color={"orange"}
          handleEvent={() => {
            if (logs.length === 0) {
              router.push("/dashboard/switch-jobs");
            } else if (mechanicProjectID === "") {
              router.push("/dashboard/switch-jobs");
            } else {
              modalState.handleOpenModal();
            }
          }}
        />
      )}

      <NModals
        isOpen={modalState.isModalOpen}
        handleClose={modalState.handleCloseModal}
        size="screen"
        background="takeABreak"
      >
        <Holds background="white" className="h-full">
          <Holds className="h-full p-4">
            <Grids rows="7" gap="5">
              <Holds className="row-start-1 row-end-2 h-full w-full justify-center">
                <Grids rows="2" cols="5" gap="3" className="h-full w-full">
                  <Holds
                    className="row-start-1 row-end-2 col-start-1 col-end-2 h-full w-full justify-center"
                    onClick={() => {
                      modalState.handleCloseModal();
                    }}
                  >
                    <Images
                      titleImg="/arrowBack.svg"
                      titleImgAlt="back"
                      position="left"
                    />
                  </Holds>
                  <Holds className="row-start-2 row-end-3 col-start-1 col-end-6 h-full w-full justify-center">
                    <Titles size="h1">{t("Whoops")}</Titles>
                  </Holds>
                </Grids>
              </Holds>
              <Holds className="h-full row-start-2 row-end-3 my-auto">
                <Texts size="p2">{t("ReturnToLogOut")}</Texts>
              </Holds>
              <Holds className="h-full row-start-3 row-end-8 my-auto overflow-y-scroll no-scrollbar border-[3px] border-black rounded-[10px]">
                <Holds className="w-full p-2 flex flex-col space-y-4">
                  {[...new Set(logs.map((log) => log.type))].map(
                    (type, index) => (
                      <Buttons
                        key={index}
                        background="lightBlue"
                        href={
                          type === "equipment"
                            ? "/dashboard/equipment"
                            : type === "mechanic"
                            ? `/dashboard/mechanic/projects/${
                                logs.find((log) => log.type === type)
                                  ?.maintenanceId
                              }`
                            : type === "Trucking Assistant"
                            ? "/dashboard/truckingAssistant"
                            : type === "tasco"
                            ? "/dashboard/tasco"
                            : undefined
                        }
                        className="w-full py-3"
                      >
                        <Texts size="p3">{type} </Texts>
                      </Buttons>
                    )
                  )}
                </Holds>
              </Holds>
            </Grids>
          </Holds>
        </Holds>
      </NModals>
    </>
  );
}
