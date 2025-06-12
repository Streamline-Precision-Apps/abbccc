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
  CrewData,
} from "./types/personnel";
import { SearchCrew } from "@/lib/types";
import { Dispatch, SetStateAction, useState } from "react";
import { useTranslations } from "next-intl";
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
  isCrewEditStateDirty,
  discardCrewEditChanges,
  isRegistrationFormDirty,
  resetRegistrationState,
  isCrewCreationFormDirty,
  resetCrewCreationState,
}: {
  view: PersonnelView;
  setView: (view: PersonnelView) => void;
  crew: CrewData[];
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
  isCrewEditStateDirty: (crewId: string) => boolean;
  discardCrewEditChanges: (crewId: string) => void;
  isRegistrationFormDirty: () => boolean;
  resetRegistrationState: () => void;
  isCrewCreationFormDirty: () => boolean;
  resetCrewCreationState: () => void;
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
      isCrewEditStateDirty,
      discardCrewEditChanges,
      isRegistrationFormDirty,
      setNextView,
      setIsDiscardChangesModalOpen,
      filteredList,
    });

  const confirmDiscardChanges = () => {
    if (nextView) {
      // Handle user edit discards
      if (view.mode === "user") {
        discardUserEditChanges(view.userId);
      }
      // Handle crew edit discards
      else if (view.mode === "crew" && "crewId" in view) {
        discardCrewEditChanges(view.crewId);
      }
      // Handle user+crew edit discards
      else if (view.mode === "user+crew" && "crewId" in view) {
        discardCrewEditChanges(view.crewId);
        if ("userId" in view) {
          discardUserEditChanges(view.userId);
        }
      }
      // Handle registration form discards
      else if (
        view.mode === "registerUser" ||
        view.mode === "registerUser+crew"
      ) {
        resetRegistrationState();
      }
      // Handle crew creation form discards
      else if (
        view.mode === "registerCrew" ||
        view.mode === "registerCrew+user"
      ) {
        resetCrewCreationState();
      }
      // Handle both registration and crew creation form discards
      else if (view.mode === "registerBoth") {
        resetRegistrationState();
        resetCrewCreationState();
      }

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

                // Determine target view based on current mode and selected crew
                let targetView: PersonnelView;

                if (crewId) {
                  switch (view.mode) {
                    case "user":
                      targetView = {
                        mode: "user+crew",
                        userId: view.userId,
                        crewId,
                      };
                      break;
                    case "registerCrew+user":
                      targetView = {
                        mode: "user+crew",
                        userId: view.userId,
                        crewId,
                      };
                      break;
                    case "registerUser+crew":
                      targetView = {
                        mode: "registerUser+crew",
                        crewId,
                      };
                      break;
                    case "registerBoth":
                      targetView = {
                        mode: "registerUser+crew",
                        crewId,
                      };
                      break;
                    case "registerUser":
                      targetView = {
                        mode: "registerUser+crew",
                        crewId,
                      };
                      break;
                    case "user+crew":
                      targetView = {
                        mode: "user+crew",
                        crewId,
                        userId: view.userId,
                      };
                      break;
                    default:
                      targetView = { mode: "crew", crewId };
                  }
                } else {
                  targetView = { mode: "default" };
                }

                // Check for unsaved changes before changing views
                const hasUnsavedCrewChanges =
                  (view.mode === "crew" || view.mode === "user+crew") &&
                  "crewId" in view &&
                  isCrewEditStateDirty(view.crewId);

                // Check if there are unsaved registration form changes
                const hasUnsavedRegistrationChanges =
                  (view.mode === "registerUser" ||
                    view.mode === "registerUser+crew" ||
                    view.mode === "registerBoth") &&
                  isRegistrationFormDirty();

                // Check if there are unsaved crew creation form changes
                const hasUnsavedCrewCreationChanges =
                  (view.mode === "registerCrew" ||
                    view.mode === "registerCrew+user" ||
                    view.mode === "registerBoth") &&
                  isCrewCreationFormDirty &&
                  isCrewCreationFormDirty();

                // Determine if we're switching from crew to user+crew (adding a user to the view)
                const isCrewToUserView =
                  view.mode === "crew" &&
                  targetView.mode === "user+crew" &&
                  "userId" in targetView;

                // Show confirmation dialog if:
                // 1. There are unsaved crew changes (and we're not just adding a user to the view)
                // 2. There are unsaved registration changes
                // 3. There are unsaved crew creation changes
                if (
                  (hasUnsavedCrewChanges && !isCrewToUserView) ||
                  hasUnsavedRegistrationChanges ||
                  hasUnsavedCrewCreationChanges
                ) {
                  // Store target view and show confirmation modal
                  setNextView(targetView);
                  setIsDiscardChangesModalOpen(true);
                } else {
                  // No unsaved changes or switching from crew to user view, proceed with view change
                  setView(targetView);
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
                    view={view}
                    isManager={employee.permission !== "USER"}
                    isCrewMember={selectedUsers.some(
                      (u) => u.id === employee.id
                    )}
                    isCurrentLead={teamLead === employee.id}
                    onEmployeeClick={handleEmployeeClick}
                    onCrewLeadToggle={handleCrewLeadToggle}
                    onEmployeeCheck={handleEmployeeCheck}
                    hasUnsavedChanges={
                      // Only show confirmation when in user mode and editing that specific user
                      // We're handling crew changes in the useEmployeeHandlers hook
                      view.mode === "user" &&
                      view.userId === employee.id &&
                      isUserEditStateDirty(view.userId)
                    }
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
        view={view}
      />
    </>
  );
}
