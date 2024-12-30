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
export type FormStatus = "PENDING" | "APPROVED" | "DENIED";

export type WorkType = "MECHANIC" | "TRUCK_DRIVER" | "LABOR" | "TASCO";

export type EquipmentTags = "TRUCK" | "TRAILER" | "EQUIPMENT" | "VEHICLE";

export type EquipmentStatus =
  | "OPERATIONAL"
  | "NEEDS_REPAIR"
  | "NEEDS_MAINTENANCE";

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
  isSubmitted: boolean;
  status: FormStatus;
  Equipment?: Equipment | null;
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

export type receivedContent = {
  employeeName: string | number | readonly string[] | undefined;
  id: string;
  date: Date;
  requestedStartDate: Date;
  requestedEndDate: Date;
  requestType: string;
  comment: string;
  managerComment: string | null;
  status: string;
  employeeId: string;
  createdAt: Date;
  updatedAt: Date;
  decidedBy: string | null;
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

export type TimeSheets = {
  startTime: Date;
  duration: number | null;
};

export type EquipmentLog = {
  id: string;
  employeeId: string;
  duration: string | null;
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
  approvedRequests?: boolean;
  timeOffRequests?: boolean;
  generalReminders?: boolean;
  biometric?: boolean;
  cameraAccess?: boolean;
  locationAccess?: boolean;
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

export type EquipmentCodes = {
  isActive: boolean;
  mileage: number;
  registrationExpiration: Date | null;
  licensePlate: string;
  year: string;
  model: string;
  make: string;
  updatedAt: Date;
  createdAt: Date;
  lastRepair: Date | null;
  lastInspection: Date | null;
  equipmentTag: string;
  description: string;
  status: string;
  id: string;
  qrId: string;
  name: string;
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

export type EmployeeEquipmentLog = {
  id?: number | null;
  startTime?: string;
  endTime?: string | null;
  duration?: number | null;
  isRefueled?: boolean | null;
  fuelUsed?: number | null;
  comment?: string | null;
  equipmentId?: number | null;
};

export type Jobsites = {
  selectedJobsite: CostCodes;
  costCode: CostCodes[]; // Array of CostCodes
  id: string;
  qrId: string;
  isActive: boolean;
  status: string;
  name: string;
  streetNumber: string | null;
  streetName: string;
  city: string;
  state: string | null;
  country: string;
  description: string | null;
  comment: string | null;
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
