"use client";
import {
  CrewData,
  CrewEditState,
} from "@/app/(routes)/admins/personnel-old/components/types/personnel";
import { createContext, useContext, useState } from "react";

type CrewEditContextType = {
  crewEditStates: Record<string, CrewEditState>;

  initializeCrewEditState: (crewData: CrewData) => CrewEditState;

  updateCrewEditState: (
    crewId: string,
    updates: Partial<CrewEditState>,
  ) => void;
  retainOnlyCrewEditState: (crewId: string) => void;
  isCrewEditStateDirty: (crewId: string) => boolean;
  discardCrewEditChanges: (crewId: string) => void;
};

const CrewEditContext = createContext<CrewEditContextType | undefined>(
  undefined,
);

export const CrewEditProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [crewEditStates, setCrewEditStates] = useState<
    Record<string, CrewEditState>
  >({});

  const initializeCrewEditState = (crewData: CrewData) => {
    return {
      crew: crewData,
      originalCrew: { ...crewData },
      edited: {},
      loading: false,
      successfullyUpdated: false,
    };
  };

  const updateCrewEditState = (
    crewId: string,
    updates: Partial<CrewEditState>,
  ) => {
    setCrewEditStates((prev) => ({
      ...prev,
      [crewId]: {
        ...(prev[crewId] || {}),
        ...updates,
      },
    }));
  };

  const retainOnlyCrewEditState = (crewId: string) => {
    setCrewEditStates((prev) => {
      const crewState = prev[crewId];
      return crewState ? { [crewId]: crewState } : {};
    });
  };

  const isCrewEditStateDirty = (crewId: string): boolean => {
    const crewState = crewEditStates[crewId];
    if (!crewState || !crewState.edited) return false; // Add null check for edited
    return Object.values(crewState.edited).some(Boolean);
  };

  const discardCrewEditChanges = (crewId: string) => {
    setCrewEditStates((prev) => {
      const crewState = prev[crewId];
      if (!crewState) return prev;
      return {
        ...prev,
        [crewId]: {
          ...crewState,
          crew: { ...crewState.originalCrew } as CrewData,
          edited: {},
        },
      };
    });
  };

  return (
    <CrewEditContext.Provider
      value={{
        crewEditStates,
        initializeCrewEditState,
        updateCrewEditState,
        retainOnlyCrewEditState,
        isCrewEditStateDirty,
        discardCrewEditChanges,
      }}
    >
      {children}
    </CrewEditContext.Provider>
  );
};

export const useCrewEdit = () => {
  const context = useContext(CrewEditContext);
  if (!context)
    throw new Error("useCrewEdit must be used within a CrewEditProvider");
  return context;
};
