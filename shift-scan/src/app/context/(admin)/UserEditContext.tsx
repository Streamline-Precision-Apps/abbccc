"use client";
import {
  UserData,
  UserEditState,
} from "@/app/(routes)/admins/personnel-old/components/types/personnel";
import { createContext, useContext, useState } from "react";

type UserEditContextType = {
  userEditStates: Record<string, UserEditState>;

  initializeUserEditState: (userData: UserData) => UserEditState;
  updateUserEditState: (
    userId: string,
    updates: Partial<UserEditState>,
  ) => void;
  retainOnlyUserEditState: (userId: string) => void;
  isUserEditStateDirty: (userId: string) => boolean;
  discardUserEditChanges: (userId: string) => void;
};

const UserEditContext = createContext<UserEditContextType | undefined>(
  undefined,
);

export const UserEditProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [userEditStates, setUserEditStates] = useState<
    Record<string, UserEditState>
  >({});

  const initializeUserEditState = (userData: UserData) => {
    const crewIds = userData.Crews.map((c) => c.id);

    // Initialize crew leads state - create an object mapping crew IDs to whether this user leads them
    const crewLeadsMap = userData.Crews.reduce(
      (acc, crew) => {
        acc[crew.id] = crew.leadId === userData.id;
        return acc;
      },
      {} as Record<string, boolean>,
    );
    console.log(crewLeadsMap);

    return {
      user: userData,
      originalUser: userData,
      selectedCrews: crewIds,
      originalCrews: crewIds,
      crewLeads: crewLeadsMap,
      originalCrewLeads: { ...crewLeadsMap }, // Create a copy for tracking changes
      edited: {},
      loading: false,
      successfullyUpdated: false,
    };
  };

  const updateUserEditState = (
    userId: string,
    updates: Partial<UserEditState>,
  ) => {
    setUserEditStates((prev) => ({
      ...prev,
      [userId]: {
        ...prev[userId],
        ...updates,
      },
    }));
  };

  // Retain only the user edit state for the specified user and delete other states to refresh the page
  const retainOnlyUserEditState = (userId: string) => {
    setUserEditStates((prev) => {
      const userState = prev[userId];
      const saved = userState ? { [userId]: userState } : {};
      return saved;
    });
  };

  const isUserEditStateDirty = (userId: string): boolean => {
    const state = userEditStates[userId];
    if (!state || !state.edited || typeof state.edited !== "object")
      return false;
    return Object.values(state.edited).some(Boolean);
  };

  const discardUserEditChanges = (userId: string) => {
    setUserEditStates((prev) => {
      const current = prev[userId];
      if (!current) return prev;

      return {
        ...prev,
        [userId]: {
          ...current,
          user: { ...current.originalUser } as UserData,
          selectedCrews: [...current.originalCrews],
          crewLeads: { ...current.originalCrewLeads },
          edited: {},
        },
      };
    });
  };

  return (
    <UserEditContext.Provider
      value={{
        userEditStates,
        initializeUserEditState,
        updateUserEditState,
        retainOnlyUserEditState,
        isUserEditStateDirty,
        discardUserEditChanges,
      }}
    >
      {children}
    </UserEditContext.Provider>
  );
};

export const useUserEdit = () => {
  const context = useContext(UserEditContext);
  if (!context)
    throw new Error("useUserEdit must be used within a UserEditProvider");
  return context;
};
