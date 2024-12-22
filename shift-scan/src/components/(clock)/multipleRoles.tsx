"use client";
import { useSession } from "next-auth/react";
import { Buttons } from "../(reusable)/buttons";
import { Holds } from "../(reusable)/holds";
import { Grids } from "../(reusable)/grids";
import { useEffect } from "react";
import { Titles } from "../(reusable)/titles";

type Props = {
  handleNextStep: () => void;
  setClockInRole: React.Dispatch<React.SetStateAction<string>>;
  clockInRole: string;
};
export default function MultipleRoles({
  handleNextStep,
  setClockInRole,
}: Props) {
  const { data: session } = useSession();
  const tascoView = session?.user.tascoView;
  const truckView = session?.user.truckView;
  const mechanicView = session?.user.mechanicView;

  useEffect(() => {
    const chooseRole = () => {
      if (!tascoView && !truckView && !mechanicView) {
        setClockInRole("general");
        handleNextStep();
      }
    };
    chooseRole();
  }, [tascoView, truckView, mechanicView, setClockInRole, handleNextStep]);
  return (
    <Holds className="h-full w-full">
      <Grids rows={"7"} gap={"5"} className="my-5 h-fullw-full">
        <Holds className="row-start-1 row-end-3 h-full w-full justify-center">
          <Titles size={"h3"}>Please choose your role</Titles>
        </Holds>
        {tascoView === true && (
          <Holds className="h-full row-span-1">
            <Buttons
              onClick={() => {
                handleNextStep();
                setClockInRole("tasco");
              }}
              background={"lightBlue"}
              className="w-5/6"
            >
              <Titles size={"h3"}>TASCO</Titles>
            </Buttons>
          </Holds>
        )}
        {truckView === true && (
          <Holds className="h-full row-span-1">
            <Buttons
              onClick={() => {
                handleNextStep();
                setClockInRole("truck");
              }}
              background={"lightBlue"}
              className="w-5/6"
            >
              <Titles size={"h3"}>Truck</Titles>
            </Buttons>
          </Holds>
        )}
        {mechanicView === true && (
          <Holds className="h-full row-span-1">
            <Buttons
              onClick={() => {
                handleNextStep();
                setClockInRole("mechanic");
              }}
              background={"lightBlue"}
              className="w-5/6"
            >
              <Titles size={"h3"}>Mechanic</Titles>
            </Buttons>
          </Holds>
        )}
        <Holds className="h-full row-span-1">
          <Buttons
            onClick={() => {
              handleNextStep();
              setClockInRole("general");
            }}
            background={"lightBlue"}
            className="w-5/6"
          >
            <Titles size={"h3"}>General</Titles>
          </Buttons>
        </Holds>
      </Grids>
    </Holds>
  );
}
