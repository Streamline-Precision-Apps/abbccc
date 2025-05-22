"use client";
import { SearchCrew } from "@/lib/types";
import {
  CrewCreationState,
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

export default function PersonnelMainContent({
  view,
  crew,
  setView,
  registrationState,
  updateRegistrationForm,
  updateRegistrationCrews,
  handleRegistrationSubmit,
  userEditStates,
  updateUserEditState,
  retainOnlyUserEditState,
  discardUserEditChanges,
}: {
  view: PersonnelView;
  crew: SearchCrew[];
  setView: Dispatch<SetStateAction<PersonnelView>>;
  registrationState: RegistrationState;
  updateRegistrationForm: (updates: Partial<RegistrationState["form"]>) => void;
  updateRegistrationCrews: (crewIds: string[]) => void;
  handleRegistrationSubmit: (e: React.FormEvent) => Promise<void>;
  crewCreationState: CrewCreationState;
  updateCrewForm: (updates: Partial<CrewCreationState["form"]>) => void;
  toggleCrewUser: (id: string) => void;
  toggleCrewManager: (id: string) => void;
  handleCrewSubmit: (e: React.FormEvent) => Promise<void>;
  userEditStates: Record<string, UserEditState>;
  updateUserEditState: (
    userId: string,
    updates: Partial<UserEditState>
  ) => void;
  retainOnlyUserEditState: (userId: string) => void;
  discardUserEditChanges: (userId: string) => void;
}) {
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
            cancelCrewCreation={() =>
              setView({ mode: "user", userId: view.userId })
            }
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
            cancelCrewCreation={() => setView({ mode: "registerUser" })}
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
          <ViewCrew setView={() => setView({ mode: "default" })} />
          <CreateNewUserTab
            setView={() => () =>
              setView({
                mode: "registerUser+crew",
                crewId: view.crewId,
              })}
          />
        </>
      )}
      {view.mode === "user+crew" && (
        <>
          <ViewCrew
            setView={() => setView({ mode: "user", userId: view.userId })}
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
            cancelCrewCreation={() => setView({ mode: "default" })}
          />
          <CreateNewUserTab setView={() => setView({ mode: "registerBoth" })} />
        </>
      )}
    </>
  );
}
