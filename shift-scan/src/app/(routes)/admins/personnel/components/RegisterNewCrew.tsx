"use client";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Texts } from "@/components/(reusable)/texts";

export default function RegisterNewCrew({
  cancelCrewCreation,
}: {
  cancelCrewCreation: () => void;
}) {
  return (
    <Holds className="col-span-4 w-full h-full overflow-y-auto no-scrollbar">
      <Grids className="w-full h-full grid-rows-[40px_1fr] gap-5">
        <Holds
          background={"white"}
          position={"row"}
          className="w-full px-5 py-1 justify-between items-center"
        >
          <Texts text={"link"} size={"p7"}>
            Submit New Crew
          </Texts>
          <Texts text={"link"} size={"p7"} onClick={() => cancelCrewCreation()}>
            Cancel Crew Creation
          </Texts>
        </Holds>
        <Holds
          background={"white"}
          className="w-full h-full justify-center items-center overflow-y-auto no-scrollbar p-3"
        >
          Create New Crew Form
        </Holds>
      </Grids>
    </Holds>
  );
}
