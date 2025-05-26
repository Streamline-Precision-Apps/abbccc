export interface UserData {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  DOB: string;
  permission: string;
  truckView: boolean;
  tascoView: boolean;
  laborView: boolean;
  mechanicView: boolean;
  activeEmployee: boolean;
  startDate?: string;
  Contact: {
    phoneNumber: string;
    emergencyContact: string;
    emergencyContactNumber: string;
  };
  Crews: Array<{
    id: string;
    name: string;
    leadId: string;
  }>;
}

export interface EditState {
  user: UserData | null;
  originalUser: UserData | null;
  selectedCrews: string[];
  originalCrews: string[];
  crewLeads: Record<string, boolean>;
  originalCrewLeads: Record<string, boolean>;
  edited: { [key: string]: boolean };
  loading: boolean;
  successfullyUpdated: boolean;
}

export interface UseUserDataProps {
  userid: string;
  editState: EditState;
  updateEditState: (updates: Partial<EditState>) => void;
}

export interface CrewData {
  id: string;
  name: string;
  leadId: string;
  crewType: "MECHANIC" | "TRUCK_DRIVER" | "LABOR" | "TASCO" | "";
  Users: { id: string; firstName: string; lastName: string }[];
}

// BaseUser contains common properties
export interface BaseUser {
  id: string;
  firstName: string;
  lastName: string;
  permission?: string;
  supervisor?: boolean;
  image?: string;
}

// User edit state management
export interface UserEditState {
  user: UserData | null;
  originalUser: UserData | null;
  selectedCrews: string[];
  originalCrews: string[];
  crewLeads: Record<string, boolean>; // Track which crews this user leads
  originalCrewLeads: Record<string, boolean>;
  edited: { [key: string]: boolean };
  loading: boolean;
  successfullyUpdated: boolean;
}

// Crew edit/create state management (single source of truth for both modes)
export interface CrewEditState {
  crew: CrewData | null;
  originalCrew: CrewData | null;
  edited: { [key: string]: boolean };
  loading: boolean;
  successfullyUpdated: boolean;
}

// Registration state management
export interface RegistrationState {
  form: {
    username: string;
    password?: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
    emergencyContact: string;
    emergencyContactNumber: string;
    dateOfBirth: string;
    permissionLevel: "USER" | "MANAGER" | "ADMIN" | "SUPERADMIN"; // Use a union type for specific values
    employmentStatus: "Active" | "Inactive"; // Use a union type
    truckingView: boolean;
    tascoView: boolean;
    engineerView: boolean;
    generalView: boolean;
  };
  selectedCrews: string[];
  isPending: boolean;
  isSuccess: boolean;
}

// Unified view state
export type PersonnelView =
  | { mode: "default" }
  | { mode: "user"; userId: string }
  | { mode: "crew"; crewId: string }
  | { mode: "user+crew"; userId: string; crewId: string }
  | { mode: "registerUser+crew"; crewId: string }
  | { mode: "registerCrew+user"; userId: string }
  | { mode: "registerUser" }
  | { mode: "registerCrew" }
  | { mode: "registerBoth" };

export interface CrewCreationState {
  form: {
    crewName: string;
    crewType: "MECHANIC" | "TRUCK_DRIVER" | "LABOR" | "TASCO" | "";
  };
  selectedUsers: { id: string }[];
  teamLead: string | null;
  isPending: boolean;
  isSuccess: boolean;
}
