"use client";
import { SearchCrew } from "@/lib/types";
import {
  BaseUser,
  CrewCreationState,
  CrewData,
  CrewEditState,
  PersonnelView,
  RegistrationState,
  UserEditState,
} from "./types/personnel";
import { Dispatch, SetStateAction } from "react";
import UserSelected from "./UserSelected";
import CreateNewCrewTab from "./CreateNewCrew";
import CreateNewUserTab from "./CreateNewUserTab";
import DefaultTab from "./defaultTab";
import RegisterNewCrew from "./RegisterNewCrew";
import RegisterNewUser from "./RegisterNewUser";
import ViewCrew from "./ViewCrew";

interface PersonnelMainContentProps {
  view: PersonnelView;
  crew: SearchCrew[];
  setView: Dispatch<SetStateAction<PersonnelView>>;
  registrationState: RegistrationState;
  updateRegistrationForm: (updates: Partial<RegistrationState["form"]>) => void;
  updateRegistrationCrews: (crewIds: string[]) => void;
  handleRegistrationSubmit: (e: React.FormEvent) => Promise<void>;
  crewCreationState: CrewCreationState;
  updateCrewForm: (updates: Partial<CrewCreationState["form"]>) => void;
  handleCrewSubmit: (e: React.FormEvent) => Promise<void>;
  userEditStates: Record<string, UserEditState>;
  updateUserEditState: (
    userId: string,
    updates: Partial<UserEditState>
  ) => void;
  retainOnlyUserEditState: (userId: string) => void;
  discardUserEditChanges: (userId: string) => void;
  employees: BaseUser[];
  crewEditStates: Record<string, CrewEditState>;
  updateCrewEditState: (
    crewId: string,
    updates: Partial<CrewEditState>
  ) => void;
  discardCrewEditChanges: (crewId: string) => void;
  retainOnlyCrewEditState: (crewId: string) => void;
  isCrewEditStateDirty: (crewId: string) => boolean;
  initializeCrewEditState: (crewData: CrewData) => CrewEditState;
}

export default function PersonnelMainContent(props: PersonnelMainContentProps) {
  const {
    view,
    crew,
    employees,
    setView,
    registrationState,
    updateRegistrationForm,
    updateRegistrationCrews,
    handleRegistrationSubmit,
    crewCreationState,
    updateCrewForm,
    handleCrewSubmit,
    userEditStates,
    updateUserEditState,
    retainOnlyUserEditState,
    discardUserEditChanges,
    crewEditStates,
    updateCrewEditState,
    retainOnlyCrewEditState,
    discardCrewEditChanges,
  } = props;
  // Crew context values are only destructured from useCrewEdit, not from props

  return (
    <>
      {view.mode === "user" && (
        <>
          <UserSelected
            crew={crew}
            setView={() => setView({ mode: "default" })}
            setRegistration={() => setView({ mode: "registerUser" })}
            userid={view.userId}
            editState={
              userEditStates[view.userId] || {
                user: null,
                originalUser: null,
                selectedCrews: [],
                originalCrews: [],
                edited: {},
                loading: false,
                successfullyUpdated: false,
              }
            }
            updateEditState={(updates) =>
              updateUserEditState(view.userId, updates)
            }
            retainOnlyUserEditState={retainOnlyUserEditState}
            discardUserEditChanges={discardUserEditChanges}
          />
          <CreateNewCrewTab
            setView={() =>
              setView(
                view.mode === "user" && "userId" in view
                  ? {
                      mode: "registerCrew+user",
                      userId: view.userId,
                    }
                  : view
              )
            }
          />
        </>
      )}
      {view.mode === "registerUser+crew" && (
        <>
          <ViewCrew
            setView={() => {
              setView({ mode: "registerUser" });
            }}
            employees={employees}
            crewId={view.crewId}
            crewEditStates={
              crewEditStates[view.crewId] || {
                crew: null,
                originalCrew: null,
                edited: {},
                loading: false,
                successfullyUpdated: false,
              }
            }
            updateCrewEditState={(updates) =>
              updateCrewEditState(view.crewId, updates)
            }
            retainOnlyCrewEditState={retainOnlyCrewEditState}
            discardCrewEditChanges={discardCrewEditChanges}
          />
          <RegisterNewUser
            crew={crew}
            cancelRegistration={() =>
              setView({ mode: "crew", crewId: view.crewId })
            }
            registrationState={registrationState}
            updateRegistrationForm={updateRegistrationForm}
            updateRegistrationCrews={updateRegistrationCrews}
            handleSubmit={handleRegistrationSubmit}
          />
        </>
      )}
      {view.mode === "registerCrew+user" && (
        <>
          <RegisterNewCrew
            crewCreationState={crewCreationState}
            cancelCrewCreation={() =>
              setView({ mode: "user", userId: view.userId })
            }
            employees={employees}
            handleCrewSubmit={handleCrewSubmit}
            updateCrewForm={updateCrewForm}
          />
          <UserSelected
            crew={crew}
            setView={() => setView({ mode: "registerCrew" })}
            setRegistration={() => setView({ mode: "registerBoth" })}
            userid={view.userId}
            editState={
              userEditStates[view.userId] || {
                user: null,
                originalUser: null,
                selectedCrews: [],
                originalCrews: [],
                edited: {},
                loading: false,
                successfullyUpdated: false,
              }
            }
            updateEditState={(updates) =>
              updateUserEditState(view.userId, updates)
            }
            retainOnlyUserEditState={retainOnlyUserEditState}
            discardUserEditChanges={discardUserEditChanges}
          />
        </>
      )}
      {view.mode === "registerBoth" && (
        <>
          <RegisterNewCrew
            crewCreationState={crewCreationState}
            cancelCrewCreation={() => setView({ mode: "registerUser" })}
            employees={employees}
            handleCrewSubmit={handleCrewSubmit}
            updateCrewForm={updateCrewForm}
          />
          <RegisterNewUser
            crew={crew}
            cancelRegistration={() => setView({ mode: "registerCrew" })}
            registrationState={registrationState}
            updateRegistrationForm={updateRegistrationForm}
            updateRegistrationCrews={updateRegistrationCrews}
            handleSubmit={handleRegistrationSubmit}
          />
        </>
      )}
      {view.mode === "crew" && (
        <>
          <ViewCrew
            setView={() => {
              setView({ mode: "registerUser" });
            }}
            employees={employees}
            crewId={view.crewId}
            crewEditStates={
              crewEditStates[view.crewId] || {
                crew: {},
                originalCrew: {},
                edited: {},
                loading: false,
                successfullyUpdated: false,
              }
            }
            updateCrewEditState={(updates) =>
              updateCrewEditState(view.crewId, updates)
            }
            retainOnlyCrewEditState={retainOnlyCrewEditState}
            discardCrewEditChanges={discardCrewEditChanges}
          />
          <CreateNewUserTab
            setView={() =>
              setView({
                mode: "registerUser+crew",
                crewId: view.crewId,
              })
            }
          />
        </>
      )}
      {view.mode === "user+crew" && (
        <>
          <ViewCrew
            setView={() => {
              setView({ mode: "registerUser" });
            }}
            employees={employees}
            crewId={view.crewId}
            crewEditStates={
              crewEditStates[view.crewId] || {
                crew: null,
                originalCrew: null,
                edited: {},
                loading: false,
                successfullyUpdated: false,
              }
            }
            updateCrewEditState={(updates: Partial<CrewEditState>) =>
              updateCrewEditState(view.crewId, updates)
            }
            retainOnlyCrewEditState={retainOnlyCrewEditState}
            discardCrewEditChanges={discardCrewEditChanges}
          />
          <UserSelected
            crew={crew}
            setView={() => setView({ mode: "crew", crewId: view.crewId })}
            setRegistration={() =>
              setView({ mode: "registerUser+crew", crewId: view.crewId })
            }
            userid={view.userId}
            editState={
              userEditStates[view.userId] || {
                user: null,
                originalUser: null,
                selectedCrews: [],
                originalCrews: [],
                edited: {},
                loading: false,
                successfullyUpdated: false,
              }
            }
            updateEditState={(updates) =>
              updateUserEditState(view.userId, updates)
            }
            retainOnlyUserEditState={retainOnlyUserEditState}
            discardUserEditChanges={discardUserEditChanges}
          />
        </>
      )}
      {view.mode === "default" && (
        <DefaultTab
          createNewCrew={() => setView({ mode: "registerCrew" })}
          RegisterEmployee={() => setView({ mode: "registerUser" })}
        />
      )}
      {view.mode === "registerUser" && (
        <>
          <RegisterNewUser
            crew={crew}
            cancelRegistration={() => setView({ mode: "default" })}
            registrationState={registrationState}
            updateRegistrationForm={updateRegistrationForm}
            updateRegistrationCrews={updateRegistrationCrews}
            handleSubmit={handleRegistrationSubmit}
          />
          <CreateNewCrewTab setView={() => setView({ mode: "registerBoth" })} />
        </>
      )}

      {/* registerBoth mode is not used in this UI, so this block is removed for clarity */}
      {view.mode === "registerCrew" && (
        <>
          <RegisterNewCrew
            crewCreationState={crewCreationState}
            cancelCrewCreation={() => setView({ mode: "default" })}
            employees={employees}
            handleCrewSubmit={handleCrewSubmit}
            updateCrewForm={updateCrewForm}
          />
          <CreateNewUserTab setView={() => setView({ mode: "registerBoth" })} />
        </>
      )}
    </>
  );
}
