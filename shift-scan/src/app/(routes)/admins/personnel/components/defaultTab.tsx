"use client";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Texts } from "@/components/(reusable)/texts";
import { CrewEditState, UserEditState } from "./types/personnel";
import { NotificationComponent } from "@/components/(inputs)/NotificationComponent";
import { useNotification } from "@/app/context/NotificationContext";

export default function DefaultTab({
  createNewCrew,
  RegisterEmployee,
}: {
  createNewCrew: () => void;
  RegisterEmployee: () => void;
}) {
  return (
    <Holds className="col-span-8 w-full h-full overflow-y-auto no-scrollbar">
      <Grids className="w-full h-full grid-rows-[40px_1fr] gap-5">
        <Holds
          background={"white"}
          position={"row"}
          className="w-full px-5 py-1 space-x-10 items-center relative"
        >
          <Holds
            className="flex w-fit items-center"
            onClick={() => createNewCrew()}
          >
            <Texts text={"link"} size={"p7"}>
              Create New Crew
            </Texts>
          </Holds>
          <Holds
            className="flex w-fit items-center "
            onClick={() => RegisterEmployee()}
          >
            <Texts text={"link"} size={"p7"}>
              Register New Employee
            </Texts>
            <NotificationComponent />
            {/* <Holds
              background={"green"}
              className="absolute w-full h-full top-0 left-0 justify-center items-center"
            >
              <Texts size={"p6"} className="italic">
                Successfully Deleted
              </Texts>
            </Holds> */}
          </Holds>
        </Holds>
      </Grids>
    </Holds>
  );
}
