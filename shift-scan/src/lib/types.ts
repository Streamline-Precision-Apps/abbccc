import { Session } from "next-auth";
import {
  Permission,
  WorkType,
  FormStatus,
  EquipmentState,
  EquipmentTags,
  Priority,
} from "../lib/enums";

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
    status: EquipmentState;
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
};

export type EquipmentCode = {
  id: string;
  qrId: string;
  name: string;
  equipmentTag: EquipmentTags;
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

//--------------------------------------

export type TruckingEquipmentHaulLogData = TruckingEquipmentHaulLogItem[];

export type TruckingEquipmentHaulLogItem = {
  TruckingLogs: TruckingEquipmentHaulLog[];
};

export type TruckingEquipmentHaulLog = {
  id: string;
  Equipment: {
    name: string;
  };
  EquipmentHauled: EquipmentHauledItem[]; // Changed from object to array
};

export type EquipmentHauledItem = {
  id: string;
  Equipment: {
    id: string;
    name: string;
  };
  JobSite: {
    id: string;
    name: string;
  };
};

//--------------------------------------
export type TruckingMaterial = {
  id: string;
  name: string;
  LocationOfMaterial: string;
  materialWeight: number | null;
  lightWeight: number | null;
  grossWeight: number | null;
};

export type TruckingMaterialHaulLog = {
  id: string;
  Equipment: {
    id: string;
    name: string;
  };
  Materials: TruckingMaterial[];
};

export type TruckingMaterialHaulLogItem = {
  id: string;
  TruckingLogs: (TruckingMaterialHaulLog | null)[];
};

export type TruckingMaterialHaulLogData = TruckingMaterialHaulLogItem[];

//--------------------------------------
export type TruckingRefuelLogData = TruckingRefuelLogItem[];

export type TruckingRefuelLogItem = {
  TruckingLogs: TruckingRefuelLog[];
};
export type TruckingRefuelLog = {
  id: string;
  Equipment: {
    id: string;
    name: string;
  };
  RefuelLogs: TruckingRefuel[];
};

export type TruckingRefuel = {
  id: string;
  truckingLogId: string;
  gallonsRefueled: number;
  milesAtFueling: number;
};

//--------------------------------------

// Updated types to match your API response
export type StateMileageLog = {
  id: string;
  truckingLogId: string;
  state: string;
  stateLineMileage: number;
};
export type TruckingStateLog = {
  id: string;
  Equipment: {
    id: string;
    name: string;
  };
  StateMileages: StateMileageLog[];
};
export type TruckingStateLogItem = {
  TruckingLogs: (TruckingStateLog | null)[];
};
export type TruckingStateLogData = TruckingStateLogItem[];

//--------------------------------------
// export type TruckingMileageData = TruckingMileageItem[];

export type TruckingMileageItem = {
  TruckingLogs: TruckingMileage[];
};
// export type TruckingMileage = {
//   id: string;
//   timeSheetId: string | null;
//   equipmentId: string | null;
//   Equipment: {
//     name: string;
//   };
//   startingMileage: number;
//   endingMileage: number | null;
// };
//--------------------------------------

export type TimesheetHighlights = {
  submitDate: string;
  date: Date | string;
  id: string;
  userId: string;
  jobsiteId: string;
  costcode: string;
  startTime: Date | string;
  endTime: Date | string | null;
  status: FormStatus; // Enum: PENDING, APPROVED, etc.
  workType: WorkType; // Enum: Type of work
  Jobsite: {
    name: string;
  };
};
//--------------------------------------

export type TascoRefuelLogData = TascoRefuelLogItem[];

export type TascoRefuelLogItem = {
  TascoLogs: TascoRefuelLog[];
};

export type RefuelLog = {
  id: string;
  tascoLogId: string;
  gallonsRefueled: number;
};

export type TascoRefuelLog = {
  id: string;
  Equipment: {
    id: string;
    name: string;
  } | null;
  RefuelLogs: RefuelLog[];
};

//--------------------------------------
export type TascoHaulLogData = TascoHaulLogItem[];

export type TascoHaulLogItem = {
  TascoLogs: TascoHaulLogs[];
};

export type TascoHaulLogs = {
  id: string;
  timeSheetId: string;
  shiftType: string;
  equipmentId: string;
  laborType: string;
  materialType: string;
  LoadQuantity: number;
};

//--------------------------------------

export type EquipmentData = {
  id: string;
  name: string;
};

export type JobsiteData = {
  id: string;
  name: string;
};

export type EmployeeEquipmentLogData = {
  id: string;
  startTime: string | null; // JSON provides strings, not Date objects
  endTime: string | null; // JSON provides strings, not Date objects
  Jobsite: JobsiteData;
  employeeId: string;
  Equipment: EquipmentData | null; // Make Equipment nullable to match your filter
};

export type EquipmentLogsData = {
  EmployeeEquipmentLogs: EmployeeEquipmentLogData[];
}[];

export type FlattenedRefuelLog = {
  equipmentId: string;
  equipmentName: string;
  refuelLog: {
    id: string;
    gallonsRefueled: number;
  };
};

export type EquipmentRefuelLogItem = {
  id: string;
  gallonsRefueled: number;
};

export type EmployeeEquipmentLogWithRefuel = {
  id: string;
  Equipment: EquipmentData;
  RefuelLogs: EquipmentRefuelLogItem[];
};

// Processed type for your component's state
export type ProcessedEquipmentLog = {
  id: string;
  equipmentId: string;
  equipmentName: string;
  usageTime: string;
  startTime: string;
  endTime: string;
  jobsite: string;
  fullStartTime: string;
  fullEndTime: string;
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
  Jobsite: {
    name: string;
  };
  tascoLogs?: TascoLog[] | null;
  truckingLogs?: TruckingLog[] | null;
  maintenanceLogs?: MaintenanceLog[] | null;
  employeeEquipmentLogs?: EmployeeEquipmentLog[] | null;
};

export type TascoLog = {
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

export type Loads = {
  id: string;
  tascoLogId: string;
  loadType: string;
  loadWeight: number;
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
  tascoLogId: string;
  gallonsRefueled: number;
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

export type RefuelLogType = "tasco" | "equipment";

export interface RefuelLogBase {
  id: string;
  gallonsRefueled?: number;
  milesAtfueling?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateRefuelLogParams {
  type: RefuelLogType;
  parentId: string; // tascoLogId or employeeEquipmentLogId
}

export interface UpdateRefuelLogParams extends RefuelLogBase {
  type: RefuelLogType;
}

export interface DeleteRefuelLogParams {
  type: RefuelLogType;
  id: string;
}

export interface EmployeeEquipmentLogWithEquipment
  extends Omit<EmployeeEquipmentLog, "startTime" | "endTime"> {
  Equipment: {
    id: string;
    name: string;
    // Include other Equipment properties you need
  };
  startTime: Date; // Matching the base type
  endTime: Date; // Matching the base type
  Jobsite?: {
    id?: string;
    name?: string;
    // Include other Jobsite properties you need
  } | null;
  // Include any other properties you need from EmployeeEquipmentLog
}

export type TimesheetUpdate = {
  id: string;
  startTime?: string;
  endTime?: string | null;
  jobsiteId?: string;
  costcode?: string;
};

export type TruckingMileage = {
  id: string;
  timeSheetId: string | null;
  equipmentId: string | null;
  Equipment: {
    name: string;
  };
  startingMileage: number;
  endingMileage: number | null;
};

export type TruckingMileageUpdate = {
  id: string;
  startingMileage?: number;
  endingMileage?: number | null;
};

export type TruckingMileageData = {
  TruckingLogs: TruckingMileage[];
}[];

export interface TruckingEquipmentHaulUpdate {
  id: string;
  equipmentId?: string | null;
  jobSiteId?: string | null;
  editedByUserId?: string | null;
}

export type MaterialType = {
  id: number;
  name: string;
};

export type TimesheetFilter =
  | "timesheetHighlights"
  | "truckingMileage"
  | "truckingEquipmentHaulLogs"
  | "truckingMaterialHaulLogs"
  | "truckingRefuelLogs"
  | "truckingStateLogs"
  | "tascoHaulLogs"
  | "tascoRefuelLogs"
  | "equipmentLogs"
  | "equipmentRefuelLogs"
  | "mechanicLogs";

// Helper: Flatten EquipmentLogsData to array of { id, startTime, endTime }
export function flattenEquipmentLogs(
  logs: EquipmentLogsData
): { id: string; startTime: Date; endTime: Date }[] {
  return logs
    .flatMap((item) => item.EmployeeEquipmentLogs)
    .filter(
      (log): log is EmployeeEquipmentLogData =>
        !!log && typeof log.id === "string"
    )
    .map((log) => ({
      id: log.id,
      startTime: log.startTime ? new Date(log.startTime) : null,
      endTime: log.endTime ? new Date(log.endTime) : null,
    }))
    .filter((log) => log.startTime && log.endTime) as {
    id: string;
    startTime: Date;
    endTime: Date;
  }[];
}

// Helper: Flatten EquipmentRefuelLogs to array of { id, gallonsRefueled }
export function flattenEquipmentRefuelLogs(
  logs: EmployeeEquipmentLogWithRefuel[]
): { id: string; gallonsRefueled: number | null }[] {
  return logs.flatMap((log) =>
    (log.RefuelLogs ?? []).map((refuel) => ({
      id: refuel.id,
      gallonsRefueled:
        typeof refuel.gallonsRefueled === "number"
          ? refuel.gallonsRefueled
          : refuel.gallonsRefueled
          ? Number(refuel.gallonsRefueled)
          : null,
    }))
  );
}

// Type guard: is EquipmentLogsData
export function isEquipmentLogsData(data: unknown): data is EquipmentLogsData {
  return (
    Array.isArray(data) &&
    data.length > 0 &&
    typeof data[0] === "object" &&
    "EmployeeEquipmentLogs" in data[0]
  );
}

export type crewUsers = {
  id: string;
  firstName: string;
  lastName: string;
  clockedIn: boolean;
};

export type SearchCrew = {
  id: string;
  name: string;
  description: string;
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
