/**
 * Custom hook for fetching and managing timesheet-related data (users, jobsites, equipment, cost codes, material types).
 * Keeps all data-fetching logic out of the main modal/component for maintainability.
 *
 * @module hooks/useTimesheetData
 */
import { useEffect, useState } from "react";
import { TimesheetData } from "../types";

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
