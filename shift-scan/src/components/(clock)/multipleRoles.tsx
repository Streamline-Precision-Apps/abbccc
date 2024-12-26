"use client";
import { useSession } from "next-auth/react";
import { Buttons } from "../(reusable)/buttons";
import { Holds } from "../(reusable)/holds";
import { Grids } from "../(reusable)/grids";
import { Titles } from "../(reusable)/titles";
import { useTranslations } from "next-intl";

type Props = {
  handleNextStep: () => void;
  setClockInRole: React.Dispatch<React.SetStateAction<string>>;
  clockInRole: string;
  option?: string;
  handleReturn?: () => void;
};
export default function MultipleRoles({
  handleNextStep,
  setClockInRole,
  option,
  handleReturn,
}: Props) {
  const t = useTranslations("Clock");
  const { data: session } = useSession();
  const tascoView = session?.user.tascoView;
  const truckView = session?.user.truckView;
  const mechanicView = session?.user.mechanicView;

  const selectView = (clockInRole: string) => {
    setClockInRole(clockInRole);
    localStorage.setItem("clockInRole", clockInRole);
    handleNextStep();
  };
  return (
    <Holds className="h-full w-full">
      <Grids rows={"7"} gap={"5"} className="my-5 h-full w-full">
        <Holds className="row-start-1 row-end-3 h-full w-full justify-center">
          <Titles size={"h3"}>{t("PleaseChooseYourRole")}</Titles>
        </Holds>
        {tascoView === true && (
          <Holds className="h-full row-span-1">
            <Buttons
              onClick={() => {
                selectView("tasco");
              }}
              background={"lightBlue"}
              className="w-5/6"
            >
              <Titles size={"h3"}>{t("TASCO")}</Titles>
            </Buttons>
          </Holds>
        )}
        {truckView === true && (
          <Holds className="h-full row-span-1">
            <Buttons
              onClick={() => {
                selectView("truck");
              }}
              background={"lightBlue"}
              className="w-5/6"
            >
              <Titles size={"h3"}>{t("Truck")}</Titles>
            </Buttons>
          </Holds>
        )}
        {mechanicView === true && (
          <Holds className="h-full row-span-1">
            <Buttons
              onClick={() => {
                selectView("mechanic");
              }}
              background={"lightBlue"}
              className="w-5/6"
            >
              <Titles size={"h3"}>{t("Mechanic")}</Titles>
            </Buttons>
          </Holds>
        )}
        <Holds className="h-full row-span-1">
          <Buttons
            onClick={() => {
              selectView("general");
            }}
            background={"lightBlue"}
            className="w-5/6"
          >
            <Titles size={"h3"}>{t("General")}</Titles>
          </Buttons>
        </Holds>
        {option === "break" ? (
          <Holds className="h-full row-span-1">
            <Buttons
              onClick={handleReturn}
              background={"red"}
              className="w-5/6"
            >
              <Titles size={"h5"}>{t("ReturnToJobsite")}</Titles>
            </Buttons>
          </Holds>
        ) : null}
      </Grids>
    </Holds>
  );
}
