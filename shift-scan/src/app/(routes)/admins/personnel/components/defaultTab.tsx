"use client";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Texts } from "@/components/(reusable)/texts";

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
          className="w-full px-5 py-1 space-x-10 items-center"
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
          </Holds>
        </Holds>
      </Grids>
    </Holds>
  );
}
