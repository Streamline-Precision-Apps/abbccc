import { updateTimesheetServerAction } from "@/actions/updateTimesheetServerAction";
import { se } from "date-fns/locale";
import { useEffect, useState, useCallback } from "react";

export interface Timesheet {
  id: string;
  comment: string | null;
  startTime: string;
  endTime: string | null;
  Jobsite: {
    id: string;
    name: string;
  } | null;
  CostCode: {
    id: string;
    name: string;
  } | null;
}
/**
 * Hook to fetch timesheet data by ID, track changes, and prepare changed fields for submission.
 * @param id Timesheet ID
 */
export function useTimecardIdData(id: string) {
  const [original, setOriginal] = useState<Timesheet | null>(null);
  const [edited, setEdited] = useState<Timesheet | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [costCodes, setCostCodes] = useState<{ id: string; name: string }[]>(
    []
  );
  const [jobSites, setJobSites] = useState<{ id: string; name: string }[]>([]);

  // Fetch timesheet data and jobsites by timesheetId
  useEffect(() => {
    if (!id) return;
    let isMounted = true;
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        // Fetch timesheet
        const res = await fetch(`/api/getTimesheetDetailsManager/${id}`);
        if (!res.ok) throw new Error(await res.text());
        const data = await res.json();
        if (!isMounted) return;
        setOriginal(data.timesheet ?? null);
        setEdited(data.timesheet ?? null);

        // Fetch jobsites for this timesheetId
        const jobsitesRes = await fetch(`/api/getJobsiteSummary`);
        if (jobsitesRes.ok) {
          const jobsites = await jobsitesRes.json();
          setJobSites(jobsites);
        } else {
          setJobSites([]);
        }
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("Failed to fetch timesheet");
        }
      } finally {
        setLoading(false);
      }
    }
    fetchData();
    return () => {
      isMounted = false;
    };
  }, [id]);

  // Fetch cost codes when Jobsite changes
  useEffect(() => {
    async function fetchCostCodes() {
      const jobsiteId = edited?.Jobsite?.id;
      if (!jobsiteId) {
        setCostCodes([]);
        return;
      }
      try {
        const res = await fetch(
          `/api/getAllCostCodesByJobSites?jobsiteId=${jobsiteId}`
        );
        if (!res.ok) {
          setCostCodes([]);
          return;
        }
        const codes = await res.json();
        setCostCodes(codes);
      } catch {
        setCostCodes([]);
      }
    }
    fetchCostCodes();
  }, [edited?.Jobsite?.id]);

  // Save the entire edited form to the server
  const save = useCallback(async () => {
    if (!id || !edited) return;
    const formData = new FormData();
    formData.append("id", id);
    formData.append("startTime", edited.startTime || "");
    if (edited.endTime) {
      formData.append("endTime", edited.endTime);
    }
    formData.append("Jobsite", edited.Jobsite ? edited.Jobsite.id : "");
    formData.append("CostCode", edited.CostCode ? edited.CostCode.name : "");
    return updateTimesheetServerAction(formData);
  }, [id, edited]);

  /**
   * Reset the edited state to the original state, discarding unsaved changes.
   */
  const reset = useCallback(() => {
    setEdited(original);
  }, [original]);

  return {
    data: edited,
    setEdited,
    loading,
    error,
    save,
    costCodes,
    jobSites,
    reset,
  };
}
