import { Session } from "next-auth";
import {
  Permission,
  WorkType,
  FormStatus,
  EquipmentState,
  EquipmentTags,
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

// --------------------------------------

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
  id: number;
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

export type EquipmentRefuelLogItem = {
  id: string;
  gallonsRefueled: number;
};

export type EmployeeEquipmentLogWithRefuel = {
  id: string;
  Equipment: EquipmentData;
  RefuelLogs: EquipmentRefuelLogItem[];
};

//--------------------------------------------

export type RefuelLogType = "tasco" | "equipment";

export interface RefuelLogBase {
  id: string;
  gallonsRefueled?: number;
  milesAtfueling?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UpdateRefuelLogParams extends RefuelLogBase {
  type: RefuelLogType;
}

export interface DeleteRefuelLogParams {
  type: RefuelLogType;
  id: string;
}

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
