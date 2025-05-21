// hooks/useCrewCreationState.ts
import { CrewCreationState } from "@/app/(routes)/admins/personnel/components/types/personnel";
import { useState } from "react";

export const useCrewCreationState = () => {
  const [state, setState] = useState<CrewCreationState>({
    form: {
      crewName: "",
      crewDescription: "",
    },
    selectedUsers: [] as { id: string }[],
    teamLead: null as string | null,
    toggledUsers: {} as Record<string, boolean>,
    toggledManager: {} as Record<string, boolean>,
    isPending: false,
  });

  const updateForm = (updates: Partial<CrewCreationState["form"]>) => {
    setState((prev) => ({ ...prev, form: { ...prev.form, ...updates } }));
  };

  const toggleUser = (id: string) => {
    setState((prev) => {
      const isToggled = !prev.toggledUsers[id];
      return {
        ...prev,
        selectedUsers: isToggled
          ? [...prev.selectedUsers, { id }]
          : prev.selectedUsers.filter((user) => user.id !== id),
        toggledUsers: { ...prev.toggledUsers, [id]: isToggled },
      };
    });
  };

  const toggleManager = (id: string) => {
    setState((prev) => {
      if (prev.teamLead === id) {
        return {
          ...prev,
          teamLead: null,
          toggledManager: { ...prev.toggledManager, [id]: false },
        };
      }

      const updatedToggledManager = { ...prev.toggledManager };
      Object.keys(updatedToggledManager).forEach((key) => {
        updatedToggledManager[key] = key === id;
      });

      return {
        ...prev,
        teamLead: id,
        toggledManager: updatedToggledManager,
      };
    });
  };

  const setPending = (isPending: boolean) => {
    setState((prev) => ({ ...prev, isPending }));
  };

  const reset = () => {
    setState({
      form: {
        crewName: "",
        crewDescription: "",
      },
      selectedUsers: [],
      teamLead: null,
      toggledUsers: {},
      toggledManager: {},
      isPending: false,
    });
  };

  return {
    crewCreationState: state,
    updateCrewForm: updateForm,
    toggleCrewUser: toggleUser,
    toggleCrewManager: toggleManager,
    setCrewCreationPending: setPending,
    resetCrewCreationState: reset,
  };
};
