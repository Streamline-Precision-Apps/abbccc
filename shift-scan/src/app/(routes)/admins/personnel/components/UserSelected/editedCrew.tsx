"use client";
import { CheckBox } from "@/components/(inputs)/checkBox";
import { Buttons } from "@/components/(reusable)/buttons";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Images } from "@/components/(reusable)/images";
import { NModals } from "@/components/(reusable)/newmodals";
import { Texts } from "@/components/(reusable)/texts";
import { Titles } from "@/components/(reusable)/titles";
import { changeCrewLead, removeCrewLead } from "@/actions/PersonnelActions";
import { UserData, CrewData } from "../types/personnel";
import { useState, useEffect } from "react";

export default function EditedCrew({
  edited,
  crew,
  selectedCrews,
  handleCrewCheckbox,
  permission,
  user,
}: {
  user: UserData;
  edited: {
    [key: string]: boolean;
  };
  crew: CrewData[];
  selectedCrews: CrewData[];
  handleCrewCheckbox: (id: string) => void;
  permission: string;
}) {
  const [crewLeadModal, SetCrewLeadModal] = useState(false);
  const [crewId, SetCrewId] = useState("");
  const [isDemoting, setIsDemoting] = useState(false);

  const handleCrewLeadChange = async (crewId: string) => {
    try {
      if (isDemoting) {
        await removeCrewLead(crewId);
      } else {
        await changeCrewLead(crewId, user.id);
      }
      SetCrewLeadModal(false);
      setIsDemoting(false);
    } catch (error) {
      console.error("Error updating crew lead:", error);
    }
  };

  return (
    <>
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
                    selectedCrews.some((sc) => sc.id === c.id)
                      ? "lightBlue"
                      : "lightGray"
                  }
                  className="w-full h-full transition-colors duration-150 cursor-pointer"
                  onClick={() => {}} // add a click handler to open the crew details
                >
                  <Titles size={"h6"}>{c.name}</Titles>
                </Holds>
                {permission !== "USER" &&
                  selectedCrews.some((sc) => sc.id === c.id) && (
                    <Holds className="w-fit h-full">
                      {c.leadId === user.id ? (
                        <img
                          src="/starFilled.svg"
                          alt=""
                          className="w-10 h-10"
                        />
                      ) : (
                        <img
                          src="/star.svg"
                          alt=""
                          className="w-10 h-10"
                          onClick={() => {
                            SetCrewLeadModal(true);
                            SetCrewId(c.id);
                          }}
                        />
                      )}
                    </Holds>
                  )}
                <Holds className="w-fit h-full">
                  <CheckBox
                    shadow={false}
                    id={`crew-${c.id}`}
                    name="selectedCrews"
                    checked={selectedCrews.some((sc) => sc.id === c.id)}
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
      <NModals
        isOpen={crewLeadModal}
        background={"noOpacity"}
        size={"xs"}
        handleClose={() => {
          SetCrewLeadModal(false);
        }}
      >
        <Holds
          background={"white"}
          className="w-full h-full justify-center items-center"
        >
          <Holds className="w-full h-full  row-span-1">
            <Texts size={"p6"}>
              {" "}
              Would you like to make this User the new Crew lead?
            </Texts>
          </Holds>
          <Holds className="w-full justify-center items-center gap-5">
            <Buttons
              onClick={() => handleCrewLeadChange(crewId)}
              shadow={"none"}
              className=" h-10"
              background={"lightBlue"}
            >
              <Texts size={"p5"}>Yes</Texts>
            </Buttons>
            <Buttons
              onClick={() => SetCrewLeadModal(false)}
              shadow={"none"}
              className=" h-10"
              background={"red"}
            >
              <Texts size={"p5"}>Cancel</Texts>
            </Buttons>
          </Holds>
        </Holds>
      </NModals>
    </>
  );
}
