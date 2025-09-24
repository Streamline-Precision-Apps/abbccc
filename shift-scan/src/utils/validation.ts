/**
 * Validation helpers for timesheet logs and nested logs.
 * All functions are pure and reusable across the timesheet editing UI.
 *
 * @module utils/validation
 */

import {
  FormStatus,
  Permission,
  Priority,
  WorkType,
} from "../../prisma/generated/prisma/client";

type StateMileage = {
  id: string;
  truckingLogId: string;
  state: string;
  stateLineMileage: number;
  createdAt: Date;

  // Relations
  truckingLog: TruckingLog | null;
};

type RefuelLog = {
  id: string;
  tascoLogId: string;
  gallonsRefueled: number;
};

type Material = {
  id: string;
  truckingLogId: string;
  name: string;
  createdAt: Date;

  // Relations
  truckingLog: TruckingLog | null;
};

type EquipmentHauled = {
  id: string;
  truckingLogId: string;
  equipmentId: string;
  createdAt: Date;

  // Relations
  truckingLog: TruckingLog | null;
  equipment: Equipment | null;
};

type Maintenance = {
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

type MaintenanceLog = {
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

type EmployeeEquipmentLog = {
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

type User = {
  id: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  permission?: Permission;
  DOB?: string;
  email?: string;
  phone?: string;
};

type CCTags = {
  id: string;
  name: string;
};

type Jobsite = {
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

type TruckingLog = {
  id: string;
  timeSheetId: string | null;
  equipmentId: string | null;
  taskName: string | null; // E.g., drive or operator
  startingMileage: number;
  endingMileage: number | null;
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

type TascoLog = {
  id: string;
  shiftType: string;
  equipmentId: string;
  laborType: string;
  materialType: string;
  loadsHauled: number;
  loads: Loads[];
  refueled: Refueled[];
  comment: string;
};

type Loads = {
  id: string;
  tascoLogId: string;
  loadType: string;
  loadWeight: number;
};

type Refueled = {
  id: string;
  tascoLogId: string;
  gallonsRefueled: number;
};

type Equipment = {
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

type TimeSheet = {
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
  Jobsite: {
    name: string;
  };
  tascoLogs?: TascoLog[] | null;
  truckingLogs?: TruckingLog[] | null;
  maintenanceLogs?: MaintenanceLog[] | null;
  employeeEquipmentLogs?: EmployeeEquipmentLog[] | null;
};

/** Checks if a maintenance log is complete. */
export function isMaintenanceLogComplete(log: MaintenanceLog): boolean {
  return !!(log.maintenanceId && log.startTime && log.endTime);
}

/** Checks if a trucking log is complete. */
export function isTruckingLogComplete(log: TruckingLog): boolean {
  return !!(
    log.equipmentId &&
    typeof log.startingMileage === "number" &&
    typeof log.endingMileage === "number"
  );
}

/** Checks if a Tasco log is complete. */
export function isTascoLogComplete(log: TascoLog): boolean {
  return !!(
    log.equipmentId &&
    typeof log.loadsHauled === "number" &&
    log.loadsHauled > 0
  );
}

/** Checks if an employee equipment log is complete. */
export function isEmployeeEquipmentLogComplete(
  log: EmployeeEquipmentLog,
): boolean {
  return !!(log.equipmentId && log.startTime && log.endTime);
}

/** Checks if an Equipment Hauled entry is complete. */
export function isEquipmentHauledComplete(eq: EquipmentHauled): boolean {
  return !!eq.equipmentId;
}

/** Checks if a Material entry is complete. */
export function isMaterialComplete(mat: Material): boolean {
  return !!mat.name;
}

/** Checks if a Refuel Log entry is complete (Trucking or Tasco). */
export function isRefuelLogComplete(ref: RefuelLog): boolean {
  return typeof ref.gallonsRefueled === "number" && ref.gallonsRefueled > 0;
}

/** Checks if a State Mileage entry is complete. */
export function isStateMileageComplete(sm: StateMileage): boolean {
  return !!(sm.state && sm.stateLineMileage);
}
