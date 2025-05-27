"use client";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Images } from "@/components/(reusable)/images";
import { Inputs } from "@/components/(reusable)/inputs";
import { Selects } from "@/components/(reusable)/selects";
import { Texts } from "@/components/(reusable)/texts";
import {
  UserData,
  CrewCreationState,
  CrewEditState,
  PersonnelView,
  UserEditState,
} from "./types/personnel";
import { SearchCrew } from "@/lib/types";
import { Dispatch, SetStateAction, useState } from "react";
import { useTranslations } from "next-intl";
import { NModals } from "@/components/(reusable)/newmodals";
import { Buttons } from "@/components/(reusable)/buttons";
import { Titles } from "@/components/(reusable)/titles";
import { Contents } from "@/components/(reusable)/contents";
import Spinner from "@/components/(animations)/spinner";
import EmployeeRow from "./SideBar/EmployeeRow";
import { useEmployeeHandlers } from "../hooks/useEmployeeHandlers";
import DiscardChangesModal from "./SideBar/DiscardChangesModal";

export default function PersonnelSideBar({
  view,
  setView,
  crew,
  loading,
  term,
  setTerm,
  handleSearchChange,
  filteredList,
  userEditStates,
  isUserEditStateDirty,
  discardUserEditChanges,
  crewCreationState,
  selectLead,
  addMembers,
  removeMembers,
  crewEditStates,
  updateCrewEditState,
}: {
  view: PersonnelView;
  setView: (view: PersonnelView) => void;
  crew: SearchCrew[];
  loading: boolean;
  term: string;
  setTerm: Dispatch<SetStateAction<string>>;
  handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  filteredList: UserData[];
  userEditStates: Record<string, UserEditState>;
  isUserEditStateDirty: (userId: string) => boolean;
  discardUserEditChanges: (userId: string) => void;
  crewCreationState: CrewCreationState;
  selectLead: (leadId: string | null) => void;
  addMembers: (userId: string[]) => void;
  removeMembers: (userId: string[]) => void;
  crewEditStates: Record<string, CrewEditState>;
  updateCrewEditState: (
    crewId: string,
    updates: Partial<CrewEditState>
  ) => void;
}) {
  const t = useTranslations("Admins");
  const [nextView, setNextView] = useState<PersonnelView | null>(null);
  const [isDiscardChangesModalOpen, setIsDiscardChangesModalOpen] =
    useState(false);

  const isEditingExistingCrew =
    view.mode === "crew" ||
    view.mode === "user+crew" ||
    view.mode === "registerUser+crew";

  const currentCrewId =
    view.mode === "crew" ||
    view.mode === "user+crew" ||
    view.mode === "registerUser+crew"
      ? view.crewId
      : null;

  const selectedUsers = isEditingExistingCrew
    ? crewEditStates[currentCrewId!]?.crew?.Users || []
    : crewCreationState.selectedUsers;

  const teamLead = isEditingExistingCrew
    ? crewEditStates[currentCrewId!]?.crew?.leadId
    : crewCreationState.teamLead;

  const { handleEmployeeClick, handleCrewLeadToggle, handleEmployeeCheck } =
    useEmployeeHandlers({
      view,
      setView,
      crewEditStates,
      crewCreationState,
      updateCrewEditState,
      selectLead,
      addMembers,
      removeMembers,
      discardUserEditChanges,
      isUserEditStateDirty,
      filteredList,
    });

  const confirmDiscardChanges = () => {
    if (nextView && view.mode === "user") {
      discardUserEditChanges(view.userId); // <-- discard context state
      setView(nextView);
      setNextView(null);
      setIsDiscardChangesModalOpen(false);
    }
  };

  const cancelDiscard = () => {
    setIsDiscardChangesModalOpen(false);
    setNextView(null);
  };

  return (
    <>
      <Holds className="w-full h-full col-start-1 col-end-3">
        <Grids className="w-full h-full grid-rows-[50px_40px_1fr] gap-4">
          <Holds className="w-full h-full">
            <Selects
              onChange={(e) => {
                const crewId = e.target.value;
                console.log("Selected Crew ID:", crewId);
                if (crewId) {
                  switch (view.mode) {
                    case "user":
                      setView({
                        mode: "user+crew",
                        userId: view.userId,
                        crewId,
                      });
                      break;
                    case "registerCrew+user":
                      setView({
                        mode: "user+crew",
                        userId: view.userId,
                        crewId,
                      });
                      break;
                    case "registerUser+crew":
                      setView({
                        mode: "registerUser+crew",
                        crewId,
                      });
                      break;
                    case "registerBoth":
                      setView({
                        mode: "registerUser+crew",
                        crewId,
                      });
                      break;
                    case "registerUser":
                      setView({
                        mode: "registerUser+crew",
                        crewId,
                      });
                      break;
                    case "user+crew":
                      setView({
                        mode: "user+crew",
                        crewId,
                        userId: view.userId,
                      });
                      break;
                    default:
                      setView({ mode: "crew", crewId });
                  }
                } else {
                  setView({ mode: "default" });
                }
              }}
              value={
                view.mode === "crew" ||
                view.mode === "user+crew" ||
                view.mode === "registerUser+crew"
                  ? view.crewId
                  : ""
              }
              className="w-full text-center text-base h-full border-2"
            >
              <option value="">Select a Crew</option>
              {crew.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </Selects>
          </Holds>

          <Holds background="white" position="row" className="w-full h-full">
            <Holds size="10">
              <Images titleImg="/searchLeft.svg" titleImgAlt="search" />
            </Holds>
            <Inputs
              type="search"
              placeholder={t("PersonalSearchPlaceholder")}
              value={term}
              onChange={handleSearchChange}
              className="border-none outline-none text-sm text-left w-full h-full rounded-md bg-white"
            />
          </Holds>

          <Holds
            background="white"
            className="w-full h-full overflow-y-auto no-scrollbar"
          >
            {loading ? (
              <Holds className="flex justify-center items-center w-full h-full">
                <Spinner />
              </Holds>
            ) : (
              <div className="w-full h-full overflow-y-auto no-scrollbar p-3">
                {filteredList.map((employee) => (
                  <EmployeeRow
                    key={employee.id}
                    employee={employee}
                    isSelected={
                      (view.mode === "user" && view.userId === employee.id) ||
                      (view.mode === "user+crew" &&
                        view.userId === employee.id) ||
                      (view.mode === "registerCrew+user" &&
                        view.userId === employee.id)
                    }
                    isCrew={
                      view.mode === "registerUser+crew" ||
                      view.mode === "crew" ||
                      view.mode === "user+crew" ||
                      view.mode === "registerCrew" ||
                      view.mode === "registerCrew+user" ||
                      view.mode === "registerBoth"
                    }
                    isManager={employee.permission !== "USER"}
                    isCrewMember={selectedUsers.some(
                      (u) => u.id === employee.id
                    )}
                    isCurrentLead={teamLead === employee.id}
                    onEmployeeClick={handleEmployeeClick}
                    onCrewLeadToggle={handleCrewLeadToggle}
                    onEmployeeCheck={handleEmployeeCheck}
                  />
                ))}
              </div>
            )}
          </Holds>
        </Grids>
      </Holds>

      <DiscardChangesModal
        isOpen={isDiscardChangesModalOpen}
        confirmDiscardChanges={confirmDiscardChanges}
        cancelDiscard={cancelDiscard}
      />
    </>
  );
}
