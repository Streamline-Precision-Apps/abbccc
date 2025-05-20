"use client";
import { CheckBox } from "@/components/(inputs)/checkBox";
import { Holds } from "@/components/(reusable)/holds";
import { Texts } from "@/components/(reusable)/texts";
import { Titles } from "@/components/(reusable)/titles";
import { useState, useEffect } from "react";
export default function EditedCrew({
  edited,
  crew,
  selectedCrews,
  handleCrewCheckbox,
}: {
  edited: {
    [key: string]: boolean;
  };
  crew: { id: string; name: string }[];
  selectedCrews: string[];
  handleCrewCheckbox: (id: string) => void;
}) {
  return (
    <Holds size={"50"} className="h-full">
      <Texts position={"left"} size={"p7"}>
        Crews
      </Texts>
      <Holds
        className={`w-full h-full border-2 ${
          edited.crews ? "border-orange-400" : "border-black"
        } rounded-[10px] p-2`}
      >
        <div className="h-full overflow-y-auto no-scrollbar">
          {crew.map((c) => (
            <Holds
              position={"row"}
              key={c.id}
              className="p-1 justify-center items-center gap-2 group"
            >
              <Holds
                background={
                  selectedCrews.includes(c.id) ? "lightBlue" : "lightGray"
                }
                className="w-full h-full transition-colors duration-150 cursor-pointer "
                onClick={() => {}} // add a click handler to open the crew details
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
                  size={2}
                />
              </Holds>
            </Holds>
          ))}
        </div>
      </Holds>
    </Holds>
  );
}
