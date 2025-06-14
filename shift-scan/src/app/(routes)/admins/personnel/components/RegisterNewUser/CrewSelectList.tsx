import { CheckBox } from "@/components/(inputs)/checkBox";
import { Buttons } from "@/components/(reusable)/buttons";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Images } from "@/components/(reusable)/images";
import { NModals } from "@/components/(reusable)/newmodals";
import { Texts } from "@/components/(reusable)/texts";
import { Titles } from "@/components/(reusable)/titles";
import { Dispatch, SetStateAction, useState } from "react";
import { PersonnelView } from "../types/personnel";
import { view } from "framer-motion";

export default function CrewSelectList({
  crew,
  selectedCrews,
  handleCrewCheckbox,
  setViewOption,
  viewOption,
}: {
  crew: {
    id: string;
    name: string;
  }[];
  selectedCrews: string[];
  handleCrewCheckbox: (id: string) => void;
  setViewOption: Dispatch<SetStateAction<PersonnelView>>;
  viewOption: PersonnelView;
}) {
  return (
    <>
      <Holds size={"50"} className="h-full">
        <Texts position={"left"} size={"p7"}>
          Crews
        </Texts>
        <Holds className="w-full h-full border-2 border-black rounded-[10px] py-2 px-1">
          <div className="h-full overflow-y-auto no-scrollbar">
            {crew.map((c) => (
              <Holds
                position={"row"}
                key={c.id}
                className="p-1 justify-center items-center gap-2 group"
              >
                <Holds
                  background={
                    selectedCrews.includes(c.id) ? "lightBlue" : "gray"
                  }
                  className="w-full h-full transition-colors duration-150 cursor-pointer "
                  onClick={() => {
                    if (viewOption.mode === "registerUser+crew") {
                      setViewOption({
                        mode: "registerUser+crew",
                        crewId: c.id,
                      });
                    } else if (viewOption.mode === "registerUser") {
                      setViewOption({
                        mode: "registerUser+crew",
                        crewId: c.id,
                      });
                    } else {
                      setViewOption({
                        mode: "crew",
                        crewId: c.id,
                      });
                    }
                  }} // add a click handler to open the crew details
                >
                  <Titles size={"h6"}>{c.name}</Titles>
                </Holds>

                <Holds className="w-fit h-full ">
                  <CheckBox
                    shadow={false}
                    id={`crew-${c.id}`}
                    name="selectedCrews"
                    checked={selectedCrews.includes(c.id)}
                    onChange={() => handleCrewCheckbox(c.id)}
                    label=""
                    width={30}
                    height={30}
                  />
                </Holds>
              </Holds>
            ))}
          </div>
        </Holds>
      </Holds>
    </>
  );
}
