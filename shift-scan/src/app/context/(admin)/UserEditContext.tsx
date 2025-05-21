"use client";
// context/UserEditContext.tsx
import {
  UserData,
  UserEditState,
} from "@/app/(routes)/admins/personnel/components/types/personnel";
import { createContext, useContext, useState } from "react";

type UserEditContextType = {
  userEditStates: Record<string, UserEditState>;
  initializeUserEditState: (userData: UserData) => UserEditState;
  updateUserEditState: (
    userId: string,
    updates: Partial<UserEditState>
  ) => void;
};

const UserEditContext = createContext<UserEditContextType | undefined>(
  undefined
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

  const updateUserEditState = (
    userId: string,
    updates: Partial<UserEditState>
  ) => {
    setUserEditStates((prev) => ({
      ...prev,
      [userId]: {
        ...prev[userId],
        ...updates,
      },
    }));
  };

  return (
    <UserEditContext.Provider
      value={{ userEditStates, initializeUserEditState, updateUserEditState }}
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
