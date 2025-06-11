import {
  Equipment,
  Jobsite,
  CostCode,
  Tag,
  EquipmentSummary,
  JobsiteSummary,
  CostCodeSummary,
  TagSummary,
} from "../types";
import { Dispatch, SetStateAction } from "react";

// Equipment sidebar component props
export interface EquipmentSideBarProps {
  assets: string;
  setAssets: (value: string) => void;
  equipments: EquipmentSummary[];
  selectEquipment: Equipment | null;
  setSelectEquipment: (equipment: Equipment | null) => void;
  isRegistrationFormOpen: boolean;
  setIsRegistrationFormOpen: Dispatch<SetStateAction<boolean>>;
  hasUnsavedChanges?: boolean;
}

// Jobsite sidebar component props
export interface JobsiteSideBarProps {
  assets: string;
  setAssets: (value: string) => void;
  jobsites: JobsiteSummary[];
  selectJobsite: Jobsite | null;
  setSelectJobsite: (jobsite: Jobsite | null) => void;
  isRegistrationFormOpen: boolean;
  setIsRegistrationFormOpen: Dispatch<SetStateAction<boolean>>;
  hasUnsavedChanges?: boolean;
}

// Equipment main content component props
export interface EquipmentMainContentProps {
  assets: string;
  selectEquipment: Equipment | null;
  isRegistrationFormOpen: boolean;
  setIsRegistrationFormOpen: Dispatch<SetStateAction<boolean>>;
  setSelectEquipment: Dispatch<SetStateAction<Equipment | null>>;
  onUnsavedChangesChange: Dispatch<SetStateAction<boolean>>;
  refreshEquipments: () => Promise<void>;
  loading?: boolean;
}

// Jobsite main content component props
export interface JobsiteMainContentProps {
  assets: string;
  selectJobsite: Jobsite | null;
  isRegistrationFormOpen: boolean;
  setIsRegistrationFormOpen: Dispatch<SetStateAction<boolean>>;
  setSelectJobsite: Dispatch<SetStateAction<Jobsite | null>>;
  onUnsavedChangesChange: Dispatch<SetStateAction<boolean>>;
  refreshJobsites: () => Promise<void>;
  loading?: boolean;
}
