"use client";

import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Inputs } from "@/components/(reusable)/inputs";
import { Labels } from "@/components/(reusable)/labels";
import { Selects } from "@/components/(reusable)/selects";
import { Texts } from "@/components/(reusable)/texts";
import { BaseUser, CrewCreationState } from "../types/personnel";
import { Buttons } from "@/components/(reusable)/buttons";
import { NModals } from "@/components/(reusable)/newmodals";
import { useState } from "react";
import { Titles } from "@/components/(reusable)/titles";
import { Contents } from "@/components/(reusable)/contents";

export default function RegisterNewCrew({
  cancelCrewCreation,
  crewCreationState,
  employees,
  handleCrewSubmit,
  updateCrewForm,
  isCrewCreationFormDirty,
}: {
  cancelCrewCreation: () => void;
  crewCreationState: CrewCreationState;
  employees: BaseUser[];
  handleCrewSubmit: (e: React.FormEvent) => Promise<void>;
  updateCrewForm: (updates: Partial<CrewCreationState["form"]>) => void;
  isCrewCreationFormDirty?: () => boolean;
}) {
  const [cancelRegistrationModalOpen, setCancelRegistrationModalOpen] =
    useState(false);
  const { isSuccess } = crewCreationState;
  // Calculate counts
  const totalMembers = crewCreationState.selectedUsers.length;
  // Get the crew lead details (if any)
  const crewLead = crewCreationState.teamLead;

  // Check if the form is empty to bypass the cancel confirmation
  const isFormEmpty = () => {
    // Check if crew name has content
    const hasCrewName = crewCreationState.form.crewName.trim() !== "";

    // Check if crew type is selected
    const hasCrewType = crewCreationState.form.crewType !== "";

    // Check if any users are selected
    const hasSelectedUsers = crewCreationState.selectedUsers.length > 0;

    // Check if a team lead is selected
    const hasTeamLead = crewCreationState.teamLead !== null;

    return !hasCrewName && !hasCrewType && !hasSelectedUsers && !hasTeamLead;
  };

  return (
    <>
      <Holds className="col-span-4 w-full h-full overflow-y-auto no-scrollbar">
        <form onSubmit={handleCrewSubmit} className="w-full h-full">
          <Grids className="w-full h-full grid-rows-[40px_1fr] gap-4">
            <Holds
              background={"white"}
              position={"row"}
              className="w-full px-5 py-1 justify-between items-center relative"
            >
              <Buttons
                background={"none"}
                shadow={"none"}
                className="flex w-fit items-center "
                type="submit"
              >
                <Texts text={"link"} size={"p7"}>
                  Submit New Crew
                </Texts>
              </Buttons>
              <Buttons
                background={"none"}
                shadow={"none"}
                className="flex w-fit items-center "
                type="button"
              >
                <Texts
                  text={"link"}
                  size={"p7"}
                  onClick={() => {
                    // Use isCrewCreationFormDirty if available, otherwise fall back to isFormEmpty
                    const hasUnsavedChanges = isCrewCreationFormDirty
                      ? isCrewCreationFormDirty()
                      : !isFormEmpty();
                    if (!hasUnsavedChanges) {
                      // If no unsaved changes, bypass the modal and cancel directly
                      cancelCrewCreation();
                    } else {
                      // Otherwise show the confirmation modal
                      setCancelRegistrationModalOpen(true);
                    }
                  }}
                >
                  Cancel Crew Creation
                </Texts>
              </Buttons>
              {isSuccess && (
                <Holds
                  background={"green"}
                  className="absolute w-full h-full top-0 left-0 justify-center items-center"
                >
                  <Texts size={"p6"} className="italic">
                    Successfully Registered New Crew!
                  </Texts>
                </Holds>
              )}
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
                    <Inputs
                      type="text"
                      name="crewName"
                      value={crewCreationState.form.crewName}
                      onChange={(e) =>
                        updateCrewForm({ crewName: e.target.value })
                      }
                    />
                  </Holds>
                  <Holds className="py-2">
                    <Texts position={"left"} size={"p7"}>
                      Crew Type
                    </Texts>
                    <Selects
                      name="crewDescription"
                      value={crewCreationState.form.crewType}
                      onChange={(e) =>
                        updateCrewForm({
                          crewType: e.target
                            .value as CrewCreationState["form"]["crewType"],
                        })
                      }
                      className="h-10 text-center"
                    >
                      <option value="">Select a crew type</option>
                      <option value="TRUCK_DRIVER">Truck Driver</option>
                      <option value="TASCO">Tasco</option>
                      <option value="MECHANIC">Mechanical</option>
                      <option value="LABOR">Labor</option>
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
                          crewLead
                            ? `${
                                employees.find(
                                  (employee) => employee.id === crewLead
                                )?.firstName
                              } ${
                                employees.find(
                                  (employee) => employee.id === crewLead
                                )?.lastName
                              }`
                            : ""
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
                              <Texts size="p7">
                                {
                                  employees.find(
                                    (employee) => employee.id === member.id
                                  )?.firstName
                                }{" "}
                                {
                                  employees.find(
                                    (employee) => employee.id === member.id
                                  )?.lastName
                                }
                              </Texts>
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
      <NModals
        isOpen={cancelRegistrationModalOpen}
        handleClose={() => setCancelRegistrationModalOpen(false)}
        size="sm"
        background={"noOpacity"}
      >
        <Holds className="w-full h-full items-center justify-center text-center pt-3">
          <Contents width="section" className="h-full">
            <Holds className="flex h-1/2">
              <Texts size="p5">
                You have unsaved crew creation form changes. Are you sure you
                want to discard them?
              </Texts>
            </Holds>
            <Holds className="flex justify-center items-center gap-4 h-1/2">
              <Buttons
                shadow="none"
                background="lightBlue"
                className="w-full p-2"
                onClick={() => {
                  cancelCrewCreation();
                  setCancelRegistrationModalOpen(false);
                }}
              >
                <Titles size="h5">Yes, continue.</Titles>
              </Buttons>
              <Buttons
                background="red"
                shadow="none"
                className="w-full p-2"
                onClick={() => setCancelRegistrationModalOpen(false)}
              >
                <Titles size="h5">No, go back!</Titles>
              </Buttons>
            </Holds>
          </Contents>
        </Holds>
      </NModals>
    </>
  );
}
