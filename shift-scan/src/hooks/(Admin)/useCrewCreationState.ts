// hooks/useCrewCreationState.ts
"use client";
import { CrewCreationState } from "@/app/(routes)/admins/personnel/components/types/personnel";
import { useState } from "react";

export const useCrewCreationState = () => {
  const [state, setState] = useState<CrewCreationState>({
    form: {
      crewName: "",
      crewType: "",
    },
    selectedUsers: [] as { id: string }[],
    teamLead: null as string | null,
    isPending: false,
    isSuccess: false,
  });

  const updateForm = (updates: Partial<CrewCreationState["form"]>) => {
    setState((prev) => ({ ...prev, form: { ...prev.form, ...updates } }));
  };

  const setPending = (isPending: boolean) => {
    setState((prev) => ({ ...prev, isPending }));
  };

  const selectLead = (leadId: string | null) => {
    setState((prev) => {
      // If the new lead isn't in selectedUsers, don't set it
      if (leadId && !prev.selectedUsers.some((user) => user.id === leadId)) {
        return prev;
      }
      return { ...prev, teamLead: leadId };
    });
  };

  const addMembers = (userIds: string[]) => {
    setState((prev) => {
      const newUsers = userIds
        .filter((id) => !prev.selectedUsers.some((user) => user.id === id)) // Avoid duplicates
        .map((id) => ({ id }));

      return {
        ...prev,
        selectedUsers: [...prev.selectedUsers, ...newUsers],
      };
    });
  };

  const removeMembers = (userIds: string[]) => {
    setState((prev) => {
      const newUsers = prev.selectedUsers.filter(
        (user) => !userIds.includes(user.id)
      );

      // If we're removing the current team lead, clear it
      const shouldClearLead = userIds.includes(prev.teamLead || "");

      return {
        ...prev,
        selectedUsers: newUsers,
        teamLead: shouldClearLead ? null : prev.teamLead,
      };
    });
  };

  const setSuccess = (isSuccess: boolean) => {
    setState((prev) => ({ ...prev, isSuccess }));
  };

  const reset = () => {
    setState({
      form: {
        crewName: "",
        crewType: "",
      },
      selectedUsers: [],
      teamLead: null,
      isPending: false,
      isSuccess: false,
    });
  };

  return {
    crewCreationState: state,
    setCrewCreationState: setState,
    updateCrewForm: updateForm,
    setCrewCreationPending: setPending,
    resetCrewCreationState: reset,
    setCrewCreationSuccess: setSuccess,
    selectLead,
    addMembers,
    removeMembers,
  };
};
