// hooks/useRegistrationState.ts
import { RegistrationState } from "@/app/(routes)/admins/personnel-old/components/types/personnel";
import { useState } from "react";

export const useRegistrationState = () => {
  const [state, setState] = useState<RegistrationState>({
    form: {
      firstName: "",
      lastName: "",
      username: "",
      password: "",
      // phoneNumber: "",
      // email: "",
      // emergencyContact: "",
      // emergencyContactNumber: "",
      // dateOfBirth: "",
      permissionLevel: "USER" as const,
      employmentStatus: "Active" as const,
      truckingView: false,
      tascoView: false,
      engineerView: false,
      generalView: false,
    },
    selectedCrews: [] as string[],
    isPending: false,
    isSuccess: false,
  });

  const updateForm = (updates: Partial<RegistrationState["form"]>) => {
    setState((prev) => ({ ...prev, form: { ...prev.form, ...updates } }));
  };

  const updateCrews = (crewIds: string[]) => {
    setState((prev) => ({ ...prev, selectedCrews: crewIds }));
  };

  const setPending = (isPending: boolean) => {
    setState((prev) => ({ ...prev, isPending }));
  };

  const reset = () => {
    setState({
      form: {
        username: "",
        password: "",
        firstName: "",
        lastName: "",
        // phoneNumber: "",
        // email: "",
        // emergencyContact: "",
        // emergencyContactNumber: "",
        // dateOfBirth: "",
        permissionLevel: "USER",
        employmentStatus: "Active",
        truckingView: false,
        tascoView: false,
        engineerView: false,
        generalView: false,
      },
      selectedCrews: [],
      isPending: false,
      isSuccess: false,
    });
  };

  const setSuccess = (isSuccess: boolean) => {
    setState((prev) => ({ ...prev, isSuccess }));
  };

  // Check if the registration form has any user-entered data
  const isRegistrationFormDirty = () => {
    // Check text fields
    const relevantFields = Object.entries(state.form)
      .filter(([key]) => !["permissionLevel", "employmentStatus"].includes(key))
      .map(([_, value]) => value);

    const hasTextContent = relevantFields.some(
      (value) => typeof value === "string" && value.trim() !== "",
    );

    // Check if any crews are selected
    const hasSelectedCrews = state.selectedCrews.length > 0;

    // Check if any view options are toggled
    const hasToggledViews =
      state.form.truckingView ||
      state.form.tascoView ||
      state.form.engineerView ||
      state.form.generalView;

    // Form is dirty if any of these conditions are true
    return hasTextContent || hasSelectedCrews || hasToggledViews;
  };

  return {
    registrationState: state,
    updateRegistrationForm: updateForm,
    updateRegistrationCrews: updateCrews,
    setRegistrationPending: setPending,
    setRegistrationSuccess: setSuccess,
    resetRegistrationState: reset,
    isRegistrationFormDirty,
  };
};
