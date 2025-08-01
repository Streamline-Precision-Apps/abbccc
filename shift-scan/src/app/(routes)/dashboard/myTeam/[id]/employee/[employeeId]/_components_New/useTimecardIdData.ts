import { updateTimesheetServerAction } from "@/actions/updateTimesheetServerAction";
import { useEffect, useState, useCallback, useRef } from "react";

export interface Timesheet {
  id: string;
  comment: string | null;
  startTime: Date | string;
  endTime: Date | string | null;
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
    [],
  );
  const [jobSites, setJobSites] = useState<{ id: string; name: string }[]>([]);

  // Use a ref to track if we have an ongoing update
  const isUpdating = useRef(false);

  // Custom setter that prevents excessive updates
  const safeSetEdited = useCallback(
    (updater: React.SetStateAction<Timesheet | null>) => {
      if (isUpdating.current) return;

      isUpdating.current = true;
      setEdited(updater);

      // Reset the flag after a small delay
      setTimeout(() => {
        isUpdating.current = false;
      }, 50);
    },
    [],
  );

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

        // Ensure that dates are properly formatted as Date objects
        if (data.timesheet) {
          // Convert string dates to Date objects if needed
          if (
            data.timesheet.startTime &&
            typeof data.timesheet.startTime === "string"
          ) {
            data.timesheet.startTime = new Date(data.timesheet.startTime);
          }

          if (
            data.timesheet.endTime &&
            typeof data.timesheet.endTime === "string"
          ) {
            data.timesheet.endTime = new Date(data.timesheet.endTime);
          }
        }

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
          `/api/getAllCostCodesByJobSites?jobsiteId=${jobsiteId}`,
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
    try {
      const formData = new FormData();
      formData.append("id", id);

      // Only include fields that have values
      if (edited.startTime) {
        // Check if startTime is already a string or a Date object
        const startTimeStr =
          typeof edited.startTime === "string"
            ? edited.startTime
            : edited.startTime.toISOString();
        formData.append("startTime", startTimeStr);
      }

      if (edited.endTime) {
        // Check if endTime is already a string or a Date object
        const endTimeStr =
          typeof edited.endTime === "string"
            ? edited.endTime
            : edited.endTime.toISOString();
        formData.append("endTime", endTimeStr);
      }

      if (edited.Jobsite) {
        formData.append("Jobsite", edited.Jobsite.id);
      }

      if (edited.CostCode) {
        formData.append("CostCode", edited.CostCode.name);
      }

      if (edited.comment !== null) {
        formData.append("comment", edited.comment);
      }

      const result = await updateTimesheetServerAction(formData);

      // Update the original record with the saved changes
      if (result?.success) {
        setOriginal(edited);
      }

      return result;
    } catch (error) {
      console.error("Error saving timesheet:", error);
      return { success: false, error: String(error) };
    }
  }, [id, edited]);

  /**
   * Reset the edited state to the original state, discarding unsaved changes.
   */
  const reset = useCallback(() => {
    setEdited(original);
  }, [original]);

  return {
    data: edited,
    setEdited: safeSetEdited, // Use our safer setter
    loading,
    error,
    save,
    costCodes,
    jobSites,
    reset,
  };
}
