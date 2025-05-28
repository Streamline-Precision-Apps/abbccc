"use client";
import React, { createContext, useContext, useReducer } from "react";

// Define all your types explicitly
interface Contact {
  phoneNumber: string;
  emergencyContact: string;
  emergencyContactNumber: string;
}

interface Crew {
  id: string;
  name: string;
}

interface UserData {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  DOB: string;
  truckView: boolean;
  tascoView: boolean;
  laborView: boolean;
  mechanicView: boolean;
  permission: string;
  activeEmployee: boolean;
  startDate?: string;
  terminationDate?: string;
  Contact: Contact;
  Crews: Crew[];
  image?: string;
}

type UserState = {
  userData: UserData | null;
  originalUserData: UserData | null;
  selectedCrews: string[];
  originalCrews: string[];
  edited: Record<string, boolean>;
  loading: boolean;
  successfullyUpdated: boolean;
};

type UserAction =
  | { type: "SET_USER_DATA"; payload: UserData }
  | {
      type: "UPDATE_USER_DATA";
      payload: Partial<Omit<UserData, "Contact" | "Crews">>;
    }
  | { type: "UPDATE_CONTACT"; payload: Partial<Contact> }
  | { type: "TOGGLE_CREW"; payload: string }
  | { type: "SET_CREWS"; payload: string[] }
  | {
      type: "TOGGLE_VIEW";
      view: "truckView" | "tascoView" | "laborView" | "mechanicView";
    }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_SUCCESS"; payload: boolean }
  | { type: "RESET_EDITS" }
  | { type: "DISCARD_CHANGES" };

type SelectedUserContextType = {
  state: UserState;
  dispatch: React.Dispatch<UserAction>;
};

const SelectedUserState = createContext<SelectedUserContextType | undefined>(
  undefined
);

const initialState: UserState = {
  userData: null,
  originalUserData: null,
  selectedCrews: [],
  originalCrews: [],
  edited: {},
  loading: false,
  successfullyUpdated: false,
};

const userReducer = (state: UserState, action: UserAction): UserState => {
  switch (action.type) {
    case "SET_USER_DATA": {
      const crewIds = action.payload.Crews.map((c) => c.id);
      return {
        ...state,
        userData: action.payload,
        originalUserData: action.payload,
        selectedCrews: crewIds,
        originalCrews: crewIds,
        edited: {},
        loading: false,
      };
    }

    case "UPDATE_USER_DATA": {
      if (!state.userData) return state;

      const updatedUser = { ...state.userData, ...action.payload };
      const userEdited = { ...state.edited };

      if (state.originalUserData) {
        (
          Object.keys(action.payload) as Array<keyof typeof action.payload>
        ).forEach((key) => {
          userEdited[key] = updatedUser[key] !== state.originalUserData![key];
        });
      }

      return {
        ...state,
        userData: updatedUser,
        edited: userEdited,
      };
    }

    case "UPDATE_CONTACT": {
      if (!state.userData) return state;

      const updatedContact = { ...state.userData.Contact, ...action.payload };
      const contactEdited = { ...state.edited };

      if (state.originalUserData?.Contact) {
        (
          Object.keys(action.payload) as Array<keyof typeof action.payload>
        ).forEach((key) => {
          contactEdited[key] =
            updatedContact[key] !== state.originalUserData?.Contact[key];
        });
      }

      return {
        ...state,
        userData: { ...state.userData, Contact: updatedContact },
        edited: contactEdited,
      };
    }

    case "TOGGLE_CREW": {
      const newCrews = state.selectedCrews.includes(action.payload)
        ? state.selectedCrews.filter((id) => id !== action.payload)
        : [...state.selectedCrews, action.payload];

      const crewsEdited = {
        ...state.edited,
        crews: state.originalCrews
          ? JSON.stringify([...newCrews].sort()) !==
            JSON.stringify([...state.originalCrews].sort())
          : true,
      };

      return {
        ...state,
        selectedCrews: newCrews,
        edited: crewsEdited,
      };
    }

    case "SET_CREWS": {
      const crewsEdited = {
        ...state.edited,
        crews: state.originalCrews
          ? JSON.stringify([...action.payload].sort()) !==
            JSON.stringify([...state.originalCrews].sort())
          : true,
      };

      return {
        ...state,
        selectedCrews: action.payload,
        edited: crewsEdited,
      };
    }

    case "TOGGLE_VIEW": {
      if (!state.userData) return state;

      const toggledView = {
        ...state.userData,
        [action.view]: !state.userData[action.view],
      };

      const viewEdited = {
        ...state.edited,
        [action.view]: state.originalUserData
          ? toggledView[action.view] !== state.originalUserData[action.view]
          : true,
      };

      return {
        ...state,
        userData: toggledView,
        edited: viewEdited,
      };
    }

    case "SET_LOADING":
      return { ...state, loading: action.payload };

    case "SET_SUCCESS":
      return { ...state, successfullyUpdated: action.payload };

    case "RESET_EDITS":
      return {
        ...state,
        edited: {},
        originalUserData: state.userData,
        originalCrews: state.selectedCrews,
      };

    case "DISCARD_CHANGES":
      return state.originalUserData
        ? {
            ...state,
            userData: state.originalUserData,
            selectedCrews: state.originalCrews,
            edited: {},
          }
        : state;

    default:
      return state;
  }
};

export const SelectedUserStateProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, initialState);

  return (
    <SelectedUserState.Provider value={{ state, dispatch }}>
      {children}
    </SelectedUserState.Provider>
  );
};

export const useSelectedUserState = () => {
  const context = useContext(SelectedUserState);
  if (!context) {
    throw new Error(
      "useSelectedUserState must be used within a SelectedUserStateProvider"
    );
  }
  return context;
};
