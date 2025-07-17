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
import CreateNewCrewTab from "./CreateNewCrewTab";
import CreateNewUserTab from "./CreateNewUserTab";
import DefaultTab from "./defaultTab";
import RegisterNewCrew from "./RegisterNewCrew/RegisterNewCrew";
import RegisterNewUser from "./RegisterNewUser/RegisterNewUser";
import CrewSelected from "./CrewSelected/CrewSelected";

interface PersonnelMainContentProps {
  view: PersonnelView;
  crew: CrewData[];
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
  setCrewCreationSuccess: (isSuccess: boolean) => void;
  fetchAllData: () => Promise<void>;
  isUserEditStateDirty: (userId: string) => boolean;
  isCrewCreationFormDirty?: () => boolean;
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
    fetchAllData,
    isUserEditStateDirty,
    isCrewCreationFormDirty,
  } = props;

  return (
    <>
      {view.mode === "user" && (
        <>
          <UserSelected
            fetchAllData={fetchAllData}
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
            setViewOption={setView}
            viewOption={view}
            isUserEditStateDirty={isUserEditStateDirty}
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
          <CrewSelected
            setView={() => setView({ mode: "registerUser" })}
            fetchAllData={fetchAllData}
            resetView={() => setView({ mode: "default" })}
            employees={employees}
            crewId={view.crewId}
            crewEditState={
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
            setViewOption={setView}
            viewOption={view}
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
            setViewOption={setView}
            viewOption={view}
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
            isCrewCreationFormDirty={isCrewCreationFormDirty}
          />
          <UserSelected
            crew={crew}
            fetchAllData={fetchAllData}
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
            setViewOption={setView}
            viewOption={view}
            isUserEditStateDirty={isUserEditStateDirty}
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
            isCrewCreationFormDirty={isCrewCreationFormDirty}
          />
          <RegisterNewUser
            crew={crew}
            cancelRegistration={() => setView({ mode: "registerCrew" })}
            registrationState={registrationState}
            updateRegistrationForm={updateRegistrationForm}
            updateRegistrationCrews={updateRegistrationCrews}
            handleSubmit={handleRegistrationSubmit}
            setViewOption={setView}
            viewOption={view}
          />
        </>
      )}
      {view.mode === "crew" && (
        <>
          <CrewSelected
            setView={() => setView({ mode: "registerUser" })}
            fetchAllData={fetchAllData}
            resetView={() => setView({ mode: "default" })}
            employees={employees}
            crewId={view.crewId}
            crewEditState={
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
            setViewOption={setView}
            viewOption={view}
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
          <CrewSelected
            setView={() => setView({ mode: "registerUser" })}
            fetchAllData={fetchAllData}
            resetView={() => setView({ mode: "default" })}
            employees={employees}
            crewId={view.crewId}
            crewEditState={
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
            setViewOption={setView}
            viewOption={view}
            userId={view.userId}
          />
          <UserSelected
            fetchAllData={fetchAllData}
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
            setViewOption={setView}
            viewOption={view}
            isUserEditStateDirty={isUserEditStateDirty}
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
            setViewOption={setView}
            viewOption={view}
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
            isCrewCreationFormDirty={isCrewCreationFormDirty}
          />
          <CreateNewUserTab setView={() => setView({ mode: "registerBoth" })} />
        </>
      )}
    </>
  );
}
