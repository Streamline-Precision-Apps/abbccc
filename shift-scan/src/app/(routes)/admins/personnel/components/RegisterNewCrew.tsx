"use client";
import { Contents } from "@/components/(reusable)/contents";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Inputs } from "@/components/(reusable)/inputs";
import { Labels } from "@/components/(reusable)/labels";
import { Selects } from "@/components/(reusable)/selects";
import { Texts } from "@/components/(reusable)/texts";
import { useCrewCreationState } from "@/hooks/(Admin)/useCrewCreationState";
import { number } from "zod";

export default function RegisterNewCrew({
  cancelCrewCreation,
}: {
  cancelCrewCreation: () => void;
}) {
  const { crewCreationState } = useCrewCreationState();

  // Calculate counts
  const totalMembers = crewCreationState.selectedUsers.length;
  // Get the crew lead details (if any)
  const crewLead = crewCreationState.teamLead
    ? crewCreationState.selectedUsers.find(
        (user) => user.id === crewCreationState.teamLead
      )
    : null;

  return (
    <Holds className="col-span-4 w-full h-full overflow-y-auto no-scrollbar">
      <form action="" className="w-full h-full">
        <Grids className="w-full h-full grid-rows-[40px_1fr] gap-4">
          <Holds
            background={"white"}
            position={"row"}
            className="w-full px-5 py-1 justify-between items-center"
          >
            <Texts text={"link"} size={"p7"}>
              Submit New Crew
            </Texts>
            <Texts
              text={"link"}
              size={"p7"}
              onClick={() => cancelCrewCreation()}
            >
              Cancel Crew Creation
            </Texts>
          </Holds>
          <Grids rows={"8"} gap="4" className="w-full h-full">
            <Holds
              background={"white"}
              className="row-start-1 row-end-2 w-full h-full px-4"
            >
              <Holds position={"row"} className="gap-4">
                <Holds className="py-2">
                  <Texts position={"left"} size={"p7"} className="">
                    Crew Name
                  </Texts>
                  <Inputs type="text" name="crewName" value={""} />
                </Holds>
                <Holds className="py-2">
                  <Texts position={"left"} size={"p7"}>
                    Crew Type
                  </Texts>
                  <Selects
                    name="crewDescription"
                    value={""}
                    className="h-10 text-center"
                  >
                    <option value="">Select a crew type </option>
                  </Selects>
                </Holds>
              </Holds>
            </Holds>

            <Holds
              background={"white"}
              className="row-start-2 row-end-9 h-full w-full justify-center items-center overflow-y-auto no-scrollbar p-4"
            >
              <Grids className="w-full h-full grid-rows-[80px_1fr] gap-4">
                <Holds position={"row"} className="w-full h-full gap-4">
                  <Holds className="h-full">
                    <Texts size={"p7"} position={"left"}>
                      Crew Lead
                    </Texts>
                    <Inputs
                      type="text"
                      name="crewLead"
                      value={
                        crewLead ? `${crewLead} ${crewLead}` : "Not selected"
                      }
                      readOnly
                    />
                  </Holds>
                  <Holds className="h-full">
                    <Texts position={"right"} size={"p7"}>
                      Total Crew Members: {totalMembers}
                    </Texts>
                  </Holds>
                </Holds>
                <Holds className="w-full h-full border-[3px] border-black rounded-[10px]">
                  <Holds className="w-full h-full overflow-y-auto no-scrollbar">
                    {crewCreationState.selectedUsers.length === 0 ? (
                      <Texts size="p7" className="text-center p-4">
                        No members selected yet
                      </Texts>
                    ) : (
                      <div className="space-y-2">
                        {/* Display regular members */}
                        {crewCreationState.selectedUsers.map((member) => (
                          <Holds
                            key={member.id}
                            className="p-2 border-b flex justify-between items-center"
                          >
                            <Texts size="p7">{member.id}</Texts>
                          </Holds>
                        ))}
                      </div>
                    )}
                  </Holds>
                </Holds>
              </Grids>
            </Holds>
          </Grids>
        </Grids>
      </form>
    </Holds>
  );
}
