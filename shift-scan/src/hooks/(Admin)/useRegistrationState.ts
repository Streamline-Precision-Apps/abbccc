// hooks/useRegistrationState.ts
import { RegistrationState } from "@/app/(routes)/admins/personnel/components/types/personnel";
import { useState } from "react";

export const useRegistrationState = () => {
  const [state, setState] = useState<RegistrationState>({
    form: {
      username: "",
      password: "",
      firstName: "",
      lastName: "",
      phoneNumber: "",
      email: "",
      emergencyContact: "",
      emergencyContactNumber: "",
      dateOfBirth: "",
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
        phoneNumber: "",
        email: "",
        emergencyContact: "",
        emergencyContactNumber: "",
        dateOfBirth: "",
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

  return {
    registrationState: state,
    updateRegistrationForm: updateForm,
    updateRegistrationCrews: updateCrews,
    setRegistrationPending: setPending,
    setRegistrationSuccess: setSuccess,
    resetRegistrationState: reset,
  };
};
