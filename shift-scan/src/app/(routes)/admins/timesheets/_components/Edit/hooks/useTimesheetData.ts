/**
 * Custom hook for fetching and managing timesheet-related data (users, jobsites, equipment, cost codes, material types).
 * Keeps all data-fetching logic out of the main modal/component for maintainability.
 *
 * @module hooks/useTimesheetData
 */
import { useEffect, useState } from "react";
import { ApprovalStatus } from "@/lib/enums";

export interface EditTimesheetModalProps {
  timesheetId: string;
  isOpen: boolean;
  onClose: () => void;
  onUpdated?: () => void; // Optional callback for parent to refetch
}

// Types for nested logs
export interface MaintenanceLog {
  id: string;
  startTime: string;
  endTime: string;
  maintenanceId: string;
}
export interface EquipmentHauled {
  id: string;
  equipmentId: string;
  jobSiteId: string;
}
export interface Material {
  id: string;
  LocationOfMaterial: string;
  name: string;
  quantity: string;
  unit: string;
  materialWeight: number;
  loadType: string;
}

export interface RefuelLog {
  id: string;
  gallonsRefueled: number;
  milesAtFueling?: number;
}
export interface StateMileage {
  id: string;
  state: string;
  stateLineMileage: number;
}
export interface TruckingLog {
  id: string;
  equipmentId: string;
  startingMileage: number;
  endingMileage: number;
  EquipmentHauled: EquipmentHauled[];
  Materials: Material[];
  RefuelLogs: RefuelLog[];
  StateMileages: StateMileage[];
}
export interface TascoLog {
  id: string;
  shiftType: string;
  laborType: string;
  materialType: string;
  LoadQuantity: number;
  RefuelLogs: RefuelLog[];
  Equipment: { id: string; name: string } | null;
}
export interface EmployeeEquipmentLog {
  id: string;
  equipmentId: string;
  startTime: string;
  endTime: string;
  Equipment: { id: string; name: string } | null;
}

// Union types for nested log arrays
// For TruckingLogs
export type TruckingNestedType =
  | "EquipmentHauled"
  | "Materials"
  | "RefuelLogs"
  | "StateMileages";
export type TruckingNestedItem =
  | EquipmentHauled
  | Material
  | RefuelLog
  | StateMileage;
// For TascoLogs
export type TascoNestedType = "RefuelLogs";
export type TascoNestedItem = RefuelLog;

// Mapping type for nested log types
export type TruckingNestedTypeMap = {
  EquipmentHauled: EquipmentHauled;
  Materials: Material;
  RefuelLogs: RefuelLog;
  StateMileages: StateMileage;
};
// Mapping type for Tasco nested log types
export type TascoNestedTypeMap = {
  RefuelLogs: RefuelLog;
};

export interface TimesheetData {
  id: string;
  date: Date | string;
  User: { id: string; firstName: string; lastName: string };
  Jobsite: { id: string; name: string };
  CostCode: { id: string; name: string };
  startTime: string;
  endTime: string;
  workType: string;
  comment: string;
  status: ApprovalStatus;
  createdAt: string;
  updatedAt: string;
  MaintenanceLogs: MaintenanceLog[];
  TruckingLogs: TruckingLog[];
  TascoLogs: TascoLog[];
  EmployeeEquipmentLogs: EmployeeEquipmentLog[];
}

interface UserOption {
  id: string;
  firstName: string;
  lastName: string;
}
interface JobsiteOption {
  id: string;
  name: string;
}
interface CostCodeOption {
  value: string;
  label: string;
}
interface EquipmentOption {
  id: string;
  name: string;
}
interface MaterialType {
  id: string;
  name: string;
}

export function useTimesheetData(form: TimesheetData | null) {
  const [users, setUsers] = useState<UserOption[]>([]);
  const [jobsites, setJobsites] = useState<JobsiteOption[]>([]);
  const [costCodes, setCostCodes] = useState<CostCodeOption[]>([]);
  const [equipment, setEquipment] = useState<EquipmentOption[]>([]);
  const [materialTypes, setMaterialTypes] = useState<MaterialType[]>([]);

  // Fetch users, jobsites, equipment
  useEffect(() => {
    async function fetchDropdowns() {
      const usersRes = await fetch("/api/getAllActiveEmployeeName");
      const jobsitesRes = await fetch("/api/getJobsiteSummary");
      const equipmentRes = await fetch("/api/getAllEquipment");
      const users = await usersRes.json();
      const jobsite = await jobsitesRes.json();
      const equipment = await equipmentRes.json();
      const filteredJobsites = jobsite
        .filter(
          (j: { approvalStatus: string }) => j.approvalStatus === "APPROVED"
        )
        .map((j: { id: string; name: string }) => ({ id: j.id, name: j.name }));
      setUsers(users);
      setJobsites(filteredJobsites);
      setEquipment(equipment as EquipmentOption[]);
    }
    fetchDropdowns();
  }, []);

  // Fetch cost codes when jobsite changes
  useEffect(() => {
    async function fetchCostCodes() {
      if (!form?.Jobsite?.id) {
        setCostCodes([]);
        return;
      }
      try {
        const res = await fetch(
          `/api/getAllCostCodesByJobSites?jobsiteId=${form.Jobsite.id}`
        );
        if (!res.ok) {
          setCostCodes([]);
          return;
        }
        const codes = await res.json();
        const options = codes.map((c: { id: string; name: string }) => ({
          value: c.id,
          label: c.name,
        }));
        setCostCodes(options);
      } catch {
        setCostCodes([]);
      }
    }
    fetchCostCodes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form?.Jobsite?.id]);

  // Fetch material types
  useEffect(() => {
    async function fetchMaterialTypes() {
      try {
        const res = await fetch("/api/getMaterialTypes");
        const data = await res.json();
        setMaterialTypes(data);
      } catch {
        setMaterialTypes([]);
      }
    }
    fetchMaterialTypes();
  }, []);

  return {
    users,
    jobsites,
    costCodes,
    equipment,
    materialTypes,
  };
}
