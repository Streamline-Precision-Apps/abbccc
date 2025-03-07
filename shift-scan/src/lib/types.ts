// This file holds all the types that will be used in the app
import { Permission } from "@prisma/client"; // i removed the ebnum formSatus hope no breaks
// this imports the session types for the app, it works client and server-side
import { Session } from "next-auth";

//--------------------------------------------------------------------------------------
// example of using zod for types
// this synchronize the type needed and updates based on zod data validation.

import { z } from "zod";
import { clockInFormSchema } from "./validation";
// whatever i am looking for in the zod data validation will automatically update here

export type clockInForm = z.infer<typeof clockInFormSchema>;
// -------------------------------------------------------------------------------------
export enum TimeOffRequestType {
  FAMILY_MEDICAL = "FAMILY_MEDICAL",
  MILITARY = "MILITARY",
  PAID_VACATION = "PAID_VACATION",
  NON_PAID_PERSONAL = "NON_PAID_PERSONAL",
  SICK = "SICK",
}

export type EquipmentTags = "TRUCK" | "TRAILER" | "EQUIPMENT" | "VEHICLE";

export enum FormStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  DENIED = "DENIED",
  DRAFT = "DRAFT",
}

export enum WorkType {
  MECHANIC = "MECHANIC",
  LABOR = "LABOR",
  TASCO = "TASCO",
  TRUCK_DRIVER = "TRUCK_DRIVER",
}

export enum Priority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  PENDING = "PENDING",
  TODAY = "TODAY",
  repaired = "REPAIRED",
}

export type EquipmentStatus =
  | "OPERATIONAL"
  | "NEEDS_REPAIR"
  | "NEEDS_MAINTENANCE";

export type LogItem = {
  id: string;
  userId: string;
  submitted: boolean;
  type: "equipment" | "mechanic" | "Trucking Assistant";
} & (
  | {
      type: "equipment";
      equipment: {
        id: string;
        qrId: string;
        name: string;
      };
      maintenanceId?: never;
      laborType?: never;
      stateMileage?: never;
      refueled?: never;
      material?: never;
      equipmentHauled?: never;
    }
  | {
      type: "mechanic";
      maintenanceId: string;
      equipment?: never;
      laborType?: never;
      stateMileage?: never;
      refueled?: never;
      material?: never;
      equipmentHauled?: never;
    }
  | {
      type: "trucking";
      laborType: string;
      comment: string | null;
      endingMileage: number | null;
      stateMileage: boolean;
      refueled: boolean;
      material: boolean;
      equipmentHauled: boolean;
      equipment?: never;
      maintenanceId?: never;
    }
);

export type User = {
  id: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  permission?: Permission;
  DOB?: string;
  email?: string;
  phone?: string;
};

export type Employee = {
  id: string;
  firstName: string;
  lastName: string;
  email: string | null;
  signature?: string | null;
  image: string | null;
  imageUrl?: string | null;
};
export type Contact = {
  id: string;
  phoneNumber: string;
  emergencyContact: string;
  emergencyContactNumber: string;
};

export type UserTraining = {
  id: string;
  userId: string;
  trainingId: string;
  isCompleted: boolean;
};

export type SearchUser = {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  permission: Permission;
  DOB: string;
  truckView: boolean;
  mechanicView: boolean;
  laborView: boolean;
  tascoView: boolean;
  image: string | null;
  terminationDate: Date | null;
};

export type SearchCrew = {
  id: string;
  name: string;
  description: string;
};

export type CustomSession = {
  user?: User | null;
};

export type Logs = {
  id: string;
  userId: string;
  equipment: EquipmentCodes | null;
  submitted: boolean;
};

export type EmployeeEquipmentLogs = {
  id: string;
  date: Date;
  equipmentId: string;
  jobsiteId: string;
  employeeId: string;
  startTime: Date;
  endTime?: Date | null;
  duration?: number | null;
  isRefueled: boolean;
  fuelUsed?: number | null;
  comment?: string | null;
  createdAt: Date;
  updatedAt: Date;
  isCompleted: boolean;
  isFinished: boolean;
  status: FormStatus;
  equipment?: Equipment | null;
};
export type TimeSheetView = {
  submitDate?: string; // Changed to string since API returns string dates
  date?: string;
  id: string;
  userId?: string;
  jobsiteId?: string;
  costcode?: string;
  nu?: string;
  Fp?: string;
  startTime?: string | null;
  endTime?: string | null;
  duration?: number | null;
  comment?: string | null;
  statusComment?: string | null;
  status?: string;
};

export type PayPeriodTimesheets = {
  startTime: Date; // Correct field name
  endTime: Date;
};

export type inboxContent = {
  session: Session | null;
};

export type ReceivedContent = {
  id: string;
  name: string;
  requestedStartDate: Date;
  requestedEndDate: Date;
  requestType: string;
  comment: string;
  managerComment: string | null;
  status: string;
  createdAt: Date;
  decidedBy: string | null;
  employee: {
    id: string;
    firstName: string;
    lastName: string;
  };
};

export type sentContent = {
  id: string;
  date: Date;
  requestedStartDate: Date;
  requestedEndDate: Date;
  requestType: string;
  comment: string;
  managerComment: string | null;
  status: FormStatus;
  employeeId: string;
  createdAt: Date;
  updatedAt: Date;
  decidedBy: string | null;
};

export type LeaveRequest = {
  id: string;
  name: string;
  requestedStartDate: string;
  requestedEndDate: string;
  requestType: string;
  comment: string;
  managerComment: string;
  status: string;
  employeeId: string;
  createdAt: string;
  updatedAt: string;
  decidedBy: string;
  signature: string;
  employee: {
    id: string;
    firstName: string;
    lastName: string;
    image: string;
  };
};

export type TimeSheets = {
  startTime: Date;
  duration: number | null;
};

export type EquipmentLog = {
  id: string;
  employeeId: string;
  startTime: Date;
  endTime: Date | null;
  Equipment: EquipmentCodes;
};

export type EquipmentFetchEQ = {
  Equipment: {
    id: string;
    status: EquipmentStatus;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    qrId: string;
    description: string;
    equipmentTag: EquipmentTags;
    inUse: boolean;
  } | null;
  duration: number | null;
};

export type RequestForm = {
  session: Session | null;
};

// This is used in the admin section for assets.

export type UserSettings = {
  userId: string;
  language?: string;
  personalReminders?: boolean;
  generalReminders?: boolean;
  cameraAccess?: boolean;
  locationAccess?: boolean;
  cookiesAccess?: boolean;
};

// --------------------------------------
// this are used to get only the qr data, name, and description
export type JobCodes = {
  toLowerCase(): unknown;
  id: string;
  qrId: string;
  name: string;
};

export type JobCode = {
  id: string;
  qrId: string;
  name: string;
};

export type CostCodes = {
  id: string;
  name: string;
  description: string;
};

export type EquipmentCode = {
  id: string;
  qrId: string;
  name: string;
};

export type EquipmentCodes = {
  isActive: boolean;
  mileage: number | null;
  registrationExpiration: Date | null;
  licensePlate?: string | null;
  year?: string | null;
  model?: string | null;
  make?: string | null;
  updatedAt: Date;
  createdAt: Date;
  lastRepair: Date | null;
  lastInspection: Date | null;
  equipmentTag: EquipmentTags;
  description?: string;
  status?: string;
  id: string;
  qrId: string;
  name: string;
};

export type TimeSheet = {
  submitDate: string;
  date: Date | string;
  id: string;
  userId: string;
  jobsiteId: string;
  costcode: string;
  nu: string;
  Fp: string;
  startTime: Date | string;
  endTime: Date | string | null;
  comment: string | null;
  statusComment: string | null;
  location: string | null;
  status: FormStatus; // Enum: PENDING, APPROVED, etc.
  workType: WorkType; // Enum: Type of work

  // Relations
  tascoLogs?: TascoLog[] | null;
  truckingLogs?: TruckingLog[] | null;
  maintenanceLogs?: MaintenanceLog[] | null;
  employeeEquipmentLogs?: EmployeeEquipmentLog[] | null;
};

export type TascoLog = {
  id: string;
  timeSheetId: string;
  shiftType: string; // Task name for Tasco work
  startTime: Date;
  endTime: Date | null;
  equipmentId: string | null; // Linked equipment ID
  laborType: string | null; // E.g., manual labor or equipment work
  materialType: string | null; // Material being handled
  loadsHauled: number | null;
  loadType: string | null; // E.g., uncovered, screened
  loadWeight: number | null; // Weight of loads
  comment: string | null;
  createdAt: Date;
  completed: boolean; // Status of task completion

  // Relations
  refueled: Refueled[]; // Refueling logs
  equipment: Equipment | null; // Related equipment
  timeSheet: TimeSheet | null; // Related timesheet
};

export type EmployeeEquipmentLog = {
  id: string;
  equipmentId: string;
  jobsiteId: string;
  employeeId: string;
  startTime?: Date | null;
  endTime?: Date | null;
  comment?: string | null;
  createdAt: Date;
  updatedAt: Date;
  isFinished: boolean;
  status: FormStatus; // Enum: PENDING, APPROVED, etc.

  // Relations
  equipment: Equipment | null;
  jobsite: Jobsite | null;
  employee: User;
  timeSheet: TimeSheet | null;
};
export type MaintenanceLog = {
  id: string;
  timeSheetId: string;
  userId: string;
  maintenanceId: string;
  startTime: Date;
  endTime: Date | null;
  comment: string | null;

  // Relations
  user: User;
  timeSheet: TimeSheet | null;
  maintenance: Maintenance | null;
};

export type TruckingLog = {
  id: string;
  timeSheetId: string | null;
  equipmentId: string | null;
  taskName: string | null; // E.g., drive or operator
  startingMileage: number;
  endingMileage: number | null;
  startTime: Date;
  endTime: Date | null;
  netWeight: number | null;
  comment: string | null;
  createdAt: Date;

  // Relations
  stateMileage: StateMileage[];
  refueled: Refueled[];
  material: Material[];
  equipmentHauled: EquipmentHauled[];
  equipment: Equipment | null;
  timeSheet: TimeSheet | null;
};
export type StateMileage = {
  id: string;
  truckingLogId: string;
  state: string;
  stateLineMileage: number;
  createdAt: Date;

  // Relations
  truckingLog: TruckingLog | null;
};

export type Material = {
  id: string;
  truckingLogId: string;
  name: string;
  createdAt: Date;

  // Relations
  truckingLog: TruckingLog | null;
};

export type EquipmentHauled = {
  id: string;
  truckingLogId: string;
  equipmentId: string;
  createdAt: Date;

  // Relations
  truckingLog: TruckingLog | null;
  equipment: Equipment | null;
};

export type Maintenance = {
  id: string;
  equipmentId: string;
  equipmentIssue: string | null;
  problemDiagnosis: string | null;
  solution: string | null;
  totalHoursLaboured: number | null;
  createdAt: Date;
  priority: Priority; // Enum: Priority level
  delay: Date | null; // Deadline for maintenance
  repaired: boolean; // Status of repair

  // Relations
  equipment: Equipment;
  maintenanceLogs: MaintenanceLog[];
};

export type Refueled = {
  id: string;
  date: Date;
  gallonsRefueled: number | null;
  tascoLogID: string | null;
};
//--------------------------------------------

export type Equipment = {
  id: string;
  qrId: string;
  name: string;
  description?: string;
  equipmentTag: string;
  lastInspection?: Date | null;
  lastRepair?: Date | null;
  status?: string;
  make?: string | null;
  model?: string | null;
  year?: string | null;
  licensePlate?: string | null;
  registrationExpiration?: Date | null;
  mileage?: number | null | undefined;
  isActive?: boolean;
  inUse?: boolean;
};

export type CompleteListEquipment = {
  id: string;
  qrId: string;
  name: string;
  description?: string;
  equipmentTag: "TRUCK" | "TRAILER" | "EQUIPMENT" | "VEHICLE";
  lastInspection?: string | null;
  nextInspection?: string | null;
  nextInspectionComment?: string | null;
  lastRepair?: string | null;
  status: "OPERATIONAL" | "NEEDS_REPAIR" | "NEEDS_MAINTENANCE";
  createdAt: string;
  updatedAt: string;
  make?: string | null;
  model?: string | null;
  year?: string | null;
  licensePlate?: string | null;
  registrationExpiration?: string | null;
  mileage?: number | null;
  isActive: boolean;
  inUse: boolean;
  jobsiteId?: string | null;
  overWeight?: boolean;
  currentWeight?: number | null;
};

export type Jobsite = {
  id: string;
  qrId: string; // Uniquely generated QR code ID
  name: string; // Name of the job site
  description: string; // Description of the job
  isActive: boolean; // Whether the job site is active
  status: FormStatus; // Enum to track the status (e.g., PENDING, APPROVED)
  address: string; // Street address of the job site
  city: string; // City where the job site is located
  state: string; // State where the job site is located
  zipCode: string; // ZIP code of the job site
  country: string; // Country, defaults to "US"
  comment?: string | null; // Optional comment for admin usage
  createdAt: Date; // Timestamp of when the job site was created
  updatedAt: Date; // Timestamp of when the job site was last updated
  archiveDate?: Date | null; // Date when the job site was archived, null if unarchived

  // Relations
  employeeEquipmentLogs: EmployeeEquipmentLog[]; // List of equipment logs related to this job site
  timeSheets: TimeSheet[]; // List of timesheets associated with this job site
  CCTags: CCTags[]; // List of cost code tags for filtering job sites
  equipment: Equipment[]; // List of equipment at the job site
};

export type JobsiteWithCost = {
  id: string;
  qrId: string;
  isActive?: boolean;
  status?: string;
  name: string;
  streetNumber?: string | null;
  streetName?: string;
  city?: string;
  state?: string | null;
  country?: string;
  description?: string | null;
  comment?: string | null;
  costCode: {
    id: string;
    name: string;
  };
};

export type costCodes = {
  id: string;
  name: string;
  description: string;
  type: string;
  isActive?: boolean;
};
export { Permission };
///
export type UserProfile = {
  DOB: string;
  activeEmployee: boolean;
  email: string;
  firstName: string;
  id: string;
  image: string;
  laborView: boolean;
  lastName: string;
  mechanicView: boolean;
  permission: Permission;
  signature: string;
  startDate: string;
  tascoView: boolean;
  terminationDate: string;
  truckView: boolean;
  username: string;
};

export type EmployeeContactInfo = {
  id: string;
  employeeId: string;
  phoneNumber: string;
  emergencyContact: string | null;
  emergencyContactNumber: string | null;
};

// tag section of app
export type JobTags = {
  id: string;
  qrId: string;
  name: string;
};
export type costCodesTag = {
  id: string;
  name: string;
  description: string;
};

export type CCTags = {
  id: string;
  name: string;
};

export type AssetJobsite = {
  id: string;
  streetNumber: string;
  streetName: string;
  city: string;
  state: string;
  country: string;
  comment: string;
};
