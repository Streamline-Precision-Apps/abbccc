"use client";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { useTranslations } from "next-intl";
import { useCallback } from "react";
import { createCrew, submitNewEmployee } from "@/actions/adminActions";
import { UserData } from "./components/types/personnel";
import { usePersonnelState } from "@/hooks/(Admin)/usePersonnelState";
import { useRegistrationState } from "@/hooks/(Admin)/useRegistrationState";
import { useCrewCreationState } from "@/hooks/(Admin)/useCrewCreationState";
import { useViewState } from "@/hooks/(Admin)/useViewState";
import { useUserEdit } from "@/app/context/(admin)/UserEditContext";
import PersonnelSideBar from "./components/PersonnelSideBar";
import PersonnelMainContent from "./components/PersonnelMainContent";

export default function Personnel() {
  const t = useTranslations("Admins");
  const {
    loading,
    employees,
    crew,
    term,
    setTerm,
    filteredList,
    handleSearchChange,
    fetchAllData,
  } = usePersonnelState();

  const {
    registrationState,
    updateRegistrationForm,
    updateRegistrationCrews,
    setRegistrationPending,
    resetRegistrationState,
  } = useRegistrationState();

  const {
    crewCreationState,
    updateCrewForm,
    toggleCrewUser,
    toggleCrewManager,
    setCrewCreationPending,
    resetCrewCreationState,
  } = useCrewCreationState();

  const { view, setView } = useViewState();
  const { userEditStates, updateUserEditState } = useUserEdit();

  const handleRegistrationSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        setRegistrationPending(true);
        const result = await submitNewEmployee({
          ...registrationState.form,
          password: registrationState.form.password || "", // add a default value
          crews: registrationState.selectedCrews,
        });
        if (result?.success) {
          resetRegistrationState();
          await fetchAllData();
          setView({ mode: "default" });
        }
      } catch (error) {
        console.error(error);
      } finally {
        setRegistrationPending(false);
      }
    },
    [
      registrationState,
      fetchAllData,
      setRegistrationPending,
      resetRegistrationState,
      setView,
    ]
  );

  const handleCrewSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        if (
          !crewCreationState.form.crewName.trim() ||
          !crewCreationState.teamLead
        )
          return;

        setCrewCreationPending(true);
        const formData = new FormData();
        formData.append("crewName", crewCreationState.form.crewName.trim());
        formData.append(
          "crewDescription",
          crewCreationState.form.crewDescription.trim()
        );
        formData.append(
          "crew",
          JSON.stringify(crewCreationState.selectedUsers)
        );
        formData.append("teamLead", crewCreationState.teamLead);

        await createCrew(formData);
        await fetchAllData();
        resetCrewCreationState();
        setView({ mode: "default" });
      } catch (error) {
        console.error("Failed to create crew:", error);
        setCrewCreationPending(false);
      }
    },
    [
      crewCreationState,
      fetchAllData,
      setCrewCreationPending,
      resetCrewCreationState,
      setView,
    ]
  );

  // Helper function to initialize edit state for a user
  const initializeUserEditState = (userData: UserData) => {
    const crewIds = userData.Crews.map((c) => c.id);
    return {
      user: userData,
      originalUser: userData,
      selectedCrews: crewIds,
      originalCrews: crewIds,
      edited: {},
      loading: false,
      successfullyUpdated: false,
    };
  };

  return (
    <Holds background={"white"} className="h-full w-full rounded-[10px]">
      <Holds background={"adminBlue"} className="h-full w-full rounded-[10px]">
        <Grids
          cols={"10"}
          gap={"5"}
          className="w-full h-full p-3 rounded-[10px]"
        >
          {/* Sidebar with search and list, make it scrollable only in the list area */}
          <PersonnelSideBar
            view={view}
            setView={setView}
            crew={crew}
            loading={loading}
            term={term}
            setTerm={setTerm}
            handleSearchChange={handleSearchChange}
            filteredList={filteredList}
          />
          {/* Main content area, also scrollable if needed */}
          {/* Display logic based on new state variables */}
          <PersonnelMainContent
            view={view}
            setView={setView}
            crew={crew}
            registrationState={registrationState}
            updateRegistrationForm={updateRegistrationForm}
            updateRegistrationCrews={updateRegistrationCrews}
            handleRegistrationSubmit={handleRegistrationSubmit}
            crewCreationState={crewCreationState}
            updateCrewForm={updateCrewForm}
            toggleCrewUser={toggleCrewUser}
            toggleCrewManager={toggleCrewManager}
            handleCrewSubmit={handleCrewSubmit}
            userEditStates={userEditStates}
            updateUserEditState={updateUserEditState}
          />
        </Grids>
      </Holds>
    </Holds>
  );
}
