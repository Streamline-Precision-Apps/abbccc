import { useCallback } from "react";
import {
  BaseUser,
  PersonnelView,
  CrewEditState,
  CrewCreationState,
} from "../components/types/personnel";

interface UseEmployeeHandlersProps {
  view: PersonnelView;
  setView: (view: PersonnelView) => void;
  crewEditStates: Record<string, CrewEditState>;
  crewCreationState: CrewCreationState;
  updateCrewEditState: (
    crewId: string,
    updates: Partial<CrewEditState>
  ) => void;
  selectLead: (leadId: string | null) => void;
  addMembers: (userId: string[]) => void;
  removeMembers: (userId: string[]) => void;
  discardUserEditChanges: (userId: string) => void;
  isUserEditStateDirty: (userId: string) => boolean;
  isCrewEditStateDirty?: (crewId: string) => boolean;
  discardCrewEditChanges?: (crewId: string) => void;
  isRegistrationFormDirty?: () => boolean;
  isCrewCreationFormDirty?: () => boolean;
  setNextView?: (view: PersonnelView | null) => void; // For showing confirmation
  setIsDiscardChangesModalOpen?: (isOpen: boolean) => void; // For showing confirmation
  filteredList: BaseUser[];
}

export const useEmployeeHandlers = ({
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
  isCrewCreationFormDirty,
  setNextView,
  setIsDiscardChangesModalOpen,
  filteredList,
}: UseEmployeeHandlersProps) => {
  const handleEmployeeClick = useCallback(
    (employee: BaseUser) => {
      const targetView: PersonnelView =
        view.mode === "crew"
          ? { mode: "user+crew", userId: employee.id, crewId: view.crewId }
          : view.mode === "user+crew"
          ? employee.id === view.userId
            ? { mode: "crew", crewId: view.crewId }
            : { mode: "user+crew", userId: employee.id, crewId: view.crewId }
          : view.mode === "registerCrew"
          ? { mode: "registerCrew+user", userId: employee.id }
          : view.mode === "registerCrew+user"
          ? { mode: "registerCrew" }
          : { mode: "user", userId: employee.id };

      const isSameUser = view.mode === "user" && view.userId === employee.id;

      // Only show confirmation when we are:
      // 1. In crew mode with crew edits AND
      // 2. Switching from one crew to another crew (not from crew to user)
      const hasDirtyCrewEdits =
        isCrewEditStateDirty &&
        view.mode === "crew" &&
        "crewId" in view &&
        isCrewEditStateDirty(view.crewId);
      
      // Check if we need to show a confirmation dialog
      // We should only show it when:
      // 1. The user has unsaved changes in the user view, OR
      // 2. We're switching between crews (crew-to-crew) with unsaved changes, OR
      // 3. The user is in the registerUser mode with non-empty form fields
      const isCrewToUserView = 
        view.mode === "crew" && 
        (targetView.mode === "user" || targetView.mode === "user+crew");
      
      // Check for unsaved registration form changes
      const hasUnsavedRegistrationChanges = 
        (view.mode === "registerUser" || 
         view.mode === "registerUser+crew" || 
         view.mode === "registerBoth") && 
        isRegistrationFormDirty && 
        isRegistrationFormDirty();
        
      // Check for unsaved crew creation form changes
      const hasUnsavedCrewCreationChanges = 
        (view.mode === "registerCrew" || 
         view.mode === "registerCrew+user" || 
         view.mode === "registerBoth") && 
        isCrewCreationFormDirty && 
        isCrewCreationFormDirty();
      
      // Import to check registration state if available
      const needsConfirmation = 
        (view.mode === "user" && 
         "userId" in view && 
         isUserEditStateDirty && 
         isUserEditStateDirty(view.userId)) ||
        (hasDirtyCrewEdits && !isCrewToUserView) ||
        hasUnsavedRegistrationChanges ||
        hasUnsavedCrewCreationChanges;
      
      // Check if we need to show a confirmation dialog
      if (needsConfirmation && setNextView && setIsDiscardChangesModalOpen) {
        setNextView(isSameUser ? { mode: "default" } : targetView);
        setIsDiscardChangesModalOpen(true);
      } else {
        // No unsaved changes or switching from crew to user view, proceed with view change
        setView(isSameUser ? { mode: "default" } : targetView);
      }
    },
    [view, setView, isCrewEditStateDirty, isUserEditStateDirty, isRegistrationFormDirty, isCrewCreationFormDirty, setNextView, setIsDiscardChangesModalOpen]
  );

  const handleCrewLeadToggle = useCallback(
    (employeeId: string) => {
      console.log("handleCrewLeadToggle called with employeeId:", employeeId);
      const isMember = crewCreationState.selectedUsers.some(
        (u) => u.id === employeeId
      );
      console.log("Is member:", isMember);

      if (view.mode === "crew" && view.crewId) {
        const currentCrew = crewEditStates[view.crewId]?.crew;
        console.log("Current crew:", currentCrew);
        if (!currentCrew) return; // Ensure currentCrew is defined

        const updatedLeadId =
          currentCrew.leadId === employeeId ? "" : employeeId;

        updateCrewEditState(view.crewId, {
          crew: {
            ...currentCrew,
            leadId: updatedLeadId,
          },
          edited: {
            ...crewEditStates[view.crewId]?.edited,
            leadId: true,
          },
        });
      } else if (view.mode === "registerUser+crew" && view.crewId) {
        const currentCrew = crewEditStates[view.crewId]?.crew;
        console.log("Current crew:", currentCrew);
        if (!currentCrew) return; // Ensure currentCrew is defined

        const updatedLeadId =
          currentCrew.leadId === employeeId ? "" : employeeId;

        updateCrewEditState(view.crewId, {
          crew: {
            ...currentCrew,
            leadId: updatedLeadId,
          },
          edited: {
            ...crewEditStates[view.crewId]?.edited,
            leadId: true,
          },
        });
      } else if (view.mode === "user+crew" && view.crewId) {
        const currentCrew = crewEditStates[view.crewId]?.crew;
        console.log("Current crew:", currentCrew);
        if (!currentCrew) return; // Ensure currentCrew is defined

        const updatedLeadId =
          currentCrew.leadId === employeeId ? "" : employeeId;

        updateCrewEditState(view.crewId, {
          crew: {
            ...currentCrew,
            leadId: updatedLeadId,
          },
          edited: {
            ...crewEditStates[view.crewId]?.edited,
            leadId: true,
          },
        });
      } else {
        selectLead(
          crewCreationState.teamLead === employeeId ? null : employeeId
        );
      }
    },
    [view, crewEditStates, crewCreationState, updateCrewEditState, selectLead]
  );

  const handleEmployeeCheck = useCallback(
    (employee: BaseUser) => {
      if (view.mode === "crew" && view.crewId) {
        const currentUsers = crewEditStates[view.crewId].crew?.Users || [];
        const isSelected = currentUsers.some((u) => u.id === employee.id);

        const updatedUsers = isSelected
          ? currentUsers.filter((u) => u.id !== employee.id) // Remove the employee
          : [...currentUsers, employee]; // Add the employee

        updateCrewEditState(view.crewId, {
          crew: {
            ...crewEditStates[view.crewId].crew!,
            Users: updatedUsers,
          },
          edited: {
            ...crewEditStates[view.crewId].edited,
            users: true,
          },
        });
      } else if (view.mode === "user+crew" && view.crewId && view.userId) {
        const currentUsers = crewEditStates[view.crewId].crew?.Users || [];
        const isSelected = currentUsers.some((u) => u.id === employee.id);

        const updatedUsers = isSelected
          ? currentUsers.filter((u) => u.id !== employee.id) // Remove the employee
          : [...currentUsers, employee]; // Add the employee

        updateCrewEditState(view.crewId, {
          crew: {
            ...crewEditStates[view.crewId].crew!,
            Users: updatedUsers,
          },
          edited: {
            ...crewEditStates[view.crewId].edited,
            users: true,
          },
        });
      } else if (view.mode === "registerUser+crew" && view.crewId) {
        const currentUsers = crewEditStates[view.crewId].crew?.Users || [];
        const isSelected = currentUsers.some((u) => u.id === employee.id);

        const updatedUsers = isSelected
          ? currentUsers.filter((u) => u.id !== employee.id) // Remove the employee
          : [...currentUsers, employee]; // Add the employee

        updateCrewEditState(view.crewId, {
          crew: {
            ...crewEditStates[view.crewId].crew!,
            Users: updatedUsers,
          },
          edited: {
            ...crewEditStates[view.crewId].edited,
            users: true,
          },
        });
      } else {
        if (crewCreationState.selectedUsers.some((u) => u.id === employee.id)) {
          removeMembers([employee.id]);
        } else {
          addMembers([employee.id]);
        }
      }
    },
    [
      view,
      crewEditStates,
      crewCreationState,
      updateCrewEditState,
      addMembers,
      removeMembers,
    ]
  );

  return {
    handleEmployeeClick,
    handleCrewLeadToggle,
    handleEmployeeCheck,
  };
};
