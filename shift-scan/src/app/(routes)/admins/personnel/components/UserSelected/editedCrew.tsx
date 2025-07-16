"use client";
import { CheckBox } from "@/components/(inputs)/checkBox";
import { Holds } from "@/components/(reusable)/holds";
import { Texts } from "@/components/(reusable)/texts";
import { Titles } from "@/components/(reusable)/titles";
import { CrewData, PersonnelView, UserData } from "../types/personnel";
import { Dispatch, SetStateAction, useState } from "react";

export default function EditedCrew({
  edited,
  crew,
  selectedCrews,
  crewLeads,
  handleCrewCheckbox,
  handleCrewLeadToggle,
  permission,
  user,
  setViewOption,
  viewOption,
}: {
  user: UserData;
  edited: {
    [key: string]: boolean;
  };
  crew: CrewData[];
  selectedCrews: string[];
  crewLeads: Record<string, boolean>;
  handleCrewCheckbox: (id: string) => void;
  handleCrewLeadToggle: (crewId: string) => void;
  permission: string;
  setViewOption: Dispatch<SetStateAction<PersonnelView>>;
  viewOption: PersonnelView;
}) {
  const [showAllCrews, setShowAllCrews] = useState(false);
  const crewsToShow = showAllCrews
    ? crew
    : crew.filter((c) => selectedCrews.includes(c.id));
  return (
    <Holds size={"50"} className="h-full">
      <Texts position={"left"} size={"p7"}>
        Crews
      </Texts>
      <Holds
        className={`w-full h-full border-2 ${
          edited.crews || edited.crewLeads
            ? "border-orange-400"
            : "border-black"
        } rounded-[10px] p-2`}
      >
        <div className="h-full overflow-y-auto no-scrollbar">
          {crewsToShow.map((c) => (
            <Holds
              position={"row"}
              key={c.id}
              className="p-1 justify-center items-center gap-2 group"
            >
              <Holds
                onClick={() => {
                  if (viewOption.mode === "user") {
                    setViewOption({
                      mode: "user+crew",
                      userId: user.id,
                      crewId: c.id,
                    });
                  } else if (viewOption.mode === "user+crew") {
                    setViewOption({
                      ...viewOption,
                      crewId: c.id,
                    });
                  }
                }}
                background={
                  selectedCrews.some((sc) => sc === c.id)
                    ? "lightBlue"
                    : "lightGray"
                }
                className="w-full h-full transition-colors duration-150 cursor-pointer"
              >
                <Titles size={"h6"}>{c.name}</Titles>
              </Holds>{" "}
              {permission !== "USER" &&
                selectedCrews.some((sc) => sc === c.id) && (
                  <Holds className="w-fit h-full flex items-center">
                    <img
                      onClick={() => handleCrewLeadToggle(c.id)}
                      src={crewLeads[c.id] ? "/starFilled.svg" : "/star.svg"}
                      alt={
                        crewLeads[c.id] ? "Current Crew Lead" : "Make Crew Lead"
                      }
                      className="w-[35px] h-[35px] "
                      title={
                        crewLeads[c.id] ? "Current Crew Lead" : "Make Crew Lead"
                      }
                    />
                  </Holds>
                )}
              <Holds className="w-fit h-full">
                <CheckBox
                  shadow={false}
                  id={`crew-${c.id}`}
                  name="selectedCrews"
                  checked={selectedCrews.some((sc) => sc === c.id)}
                  onChange={() => handleCrewCheckbox(c.id)}
                  label=""
                  width={30}
                  height={30}
                />
              </Holds>
            </Holds>
          ))}
          <Texts
            size="p7"
            text={"link"}
            className="italic mt-2 cursor-pointer"
            onClick={() => setShowAllCrews(!showAllCrews)}
          >
            {showAllCrews ? "View My Crews" : "Show all Crews"}
          </Texts>
        </div>
      </Holds>
    </Holds>
  );
}
