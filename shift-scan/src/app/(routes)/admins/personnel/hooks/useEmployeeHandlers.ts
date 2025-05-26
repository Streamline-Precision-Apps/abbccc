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

      if (
        "userId" in view &&
        isUserEditStateDirty(view.userId) &&
        !isSameUser
      ) {
        setView({ mode: "default" });
      } else {
        setView(isSameUser ? { mode: "default" } : targetView);
      }
    },
    [view, setView, isUserEditStateDirty]
  );

  const handleCrewLeadToggle = useCallback(
    (employeeId: string) => {
      const isMember = crewCreationState.selectedUsers.some(
        (u) => u.id === employeeId
      );
      if (!isMember) return;

      if (view.mode === "crew" && view.crewId) {
        updateCrewEditState(view.crewId, {
          crew: {
            ...crewEditStates[view.crewId].crew!,
            leadId:
              crewEditStates[view.crewId].crew?.leadId === employeeId
                ? ""
                : employeeId,
          },
          edited: {
            ...crewEditStates[view.crewId].edited,
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
      const isSelected = crewCreationState.selectedUsers.some(
        (u) => u.id === employee.id
      );

      if (view.mode === "crew" && view.crewId) {
        const enrichedUsers = crewCreationState.selectedUsers.map((u) => {
          const fullUser = filteredList.find((user) => user.id === u.id);
          return {
            id: u.id,
            firstName: fullUser?.firstName || "",
            lastName: fullUser?.lastName || "",
          };
        });

        const updatedUsers = isSelected
          ? enrichedUsers.filter((u) => u.id !== employee.id)
          : [...enrichedUsers, employee];

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
        if (isSelected) {
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
