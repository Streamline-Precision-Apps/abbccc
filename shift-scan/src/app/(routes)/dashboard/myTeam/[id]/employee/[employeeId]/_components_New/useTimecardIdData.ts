import { updateTimesheetServerAction } from "@/actions/updateTimesheetServerAction";
import { useEffect, useState, useCallback } from "react";

// --- Types for Timesheet and related logs ---
export interface TimesheetResponse {
  timesheet: Timesheet | null;
}

export interface Timesheet {
  id: string;
  comment: string | null;
  startTime: Date;
  endTime: Date | null;
  Jobsite: {
    id: string;
    name: string;
  } | null;
  CostCode: {
    id: string;
    name: string;
  } | null;
}

export interface TruckingLog {
  id: string;
  truckNumber: string | null;
  trailerNumber: string | null;
  startingMileage: number | null;
  endingMileage: number | null;
  EquipmentHauled: EquipmentHauled[];
  RefuelLogs: RefuelLog[];
  Materials: Material[];
  StateMileages: StateMileage[];
}

export interface EquipmentHauled {
  id: string;
  startMileage: number | null;
  endMileage: number | null;
  Equipment: {
    id: string;
    name: string;
  } | null;
}

export interface RefuelLog {
  id: string;
  gallonsRefueled: number | null;
  milesAtFueling?: number | null; // present in TruckingLog, not in TascoLog/EmployeeEquipmentLog
}

export interface Material {
  id: string;
  name: string | null;
  LocationOfMaterial: string | null;
  quantity: number | null;
  unit: string | null;
  loadType: string | null;
}

export interface StateMileage {
  id: string;
  state: string | null;
  stateLineMileage: number | null;
}

export interface TascoLog {
  id: string;
  shiftType: string | null;
  laborType: string | null;
  LoadQuantity: number | null;
  Equipment: {
    id: string;
    name: string;
  } | null;
  RefuelLogs: {
    id: string;
    gallonsRefueled: number | null;
  }[];
}

export interface MaintenanceLog {
  id: string;
  startTime: string;
  endTime: string | null;
  comment: string | null;
  Maintenance: {
    id: string;
    equipmentIssue: string | null;
  } | null;
}

export interface EmployeeEquipmentLog {
  id: string;
  startTime: string;
  endTime: string | null;
  comment: string | null;
  RefuelLog: {
    id: string;
    gallonsRefueled: number | null;
  } | null;
  Equipment: {
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

  // Deep clone utility
  function deepClone<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj));
  }

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
        const data: TimesheetResponse = await res.json();
        if (!isMounted) return;
        setOriginal(data.timesheet ?? null);
        setEdited(deepClone(data.timesheet ?? null));

        // Fetch jobsites for this timesheetId
        const jobsitesRes = await fetch(`/api/getJobsiteSummary`);
        if (jobsitesRes.ok) {
          const jobsites = await jobsitesRes.json();
          setJobSites(jobsites);
        } else {
          setJobSites([]);
        }
      } catch (err: any) {
        setError(err.message || "Failed to fetch timesheet");
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

  /**
   * Utility to set a value by path (e.g., 'timesheet.comment')
   * @param obj The object to mutate
   * @param path The string path (dot/bracket notation)
   * @param value The value to set
   */
  function setByPath<T extends object>(
    obj: T,
    path: string,
    value: unknown
  ): void {
    const keys = path.replace(/\[(\d+)\]/g, ".$1").split(".");
    let curr: any = obj;
    for (let i = 0; i < keys.length - 1; i++) {
      if (!(keys[i] in curr)) curr[keys[i]] = {};
      curr = curr[keys[i]];
    }
    curr[keys[keys.length - 1]] = value;
  }

  /**
   * Update the edited state as user types
   * @param field Path to the field (dot/bracket notation)
   * @param value Value to set
   */
  const updateEditedField = useCallback((field: string, value: unknown) => {
    setEdited((prev) => {
      if (!prev) return prev;
      const copy = deepClone(prev);
      // Special handling for time fields to preserve date
      if (
        (field === "startTime" || field === "endTime") &&
        typeof value === "string"
      ) {
        // Get the current Date or fallback to today
        const current = field === "startTime" ? prev.startTime : prev.endTime;
        let dateObj: Date;
        if (current instanceof Date) {
          dateObj = new Date(current);
        } else if (
          typeof current === "string" &&
          current &&
          (current as string).length >= 5
        ) {
          // Try to parse as ISO or fallback to today
          const parsed = new Date(current as string);
          dateObj = isNaN(parsed.getTime()) ? new Date() : parsed;
        } else {
          dateObj = new Date();
        }
        // value is 'HH:mm'
        const [hours, minutes] = value.split(":").map(Number);
        if (!isNaN(hours) && !isNaN(minutes)) {
          dateObj.setHours(hours, minutes, 0, 0);
          (copy as any)[field] = dateObj;
        } else {
          (copy as any)[field] = value;
        }
      } else {
        setByPath(copy, field, value);
      }
      return copy;
    });
  }, []);

  /**
   * Deep diff utility: returns a flat object of changed fields
   * @param orig The original object
   * @param edit The edited object
   * @param path The current path (for recursion)
   */
  function deepDiff<T>(orig: T, edit: T, path = ""): Record<string, unknown> {
    let changes: Record<string, unknown> = {};
    if (typeof orig !== typeof edit) {
      changes[path] = edit;
      return changes;
    }
    if (Array.isArray(orig) && Array.isArray(edit)) {
      for (let i = 0; i < Math.max(orig.length, edit.length); i++) {
        const subPath = path ? `${path}[${i}]` : `[${i}]`;
        if (i >= orig.length) {
          changes[subPath] = edit[i];
        } else if (i >= edit.length) {
          changes[subPath] = undefined;
        } else {
          Object.assign(changes, deepDiff(orig[i], edit[i], subPath));
        }
      }
      return changes;
    }
    if (typeof orig === "object" && orig && edit) {
      for (const key of new Set([
        ...(Object.keys(orig) as Array<keyof T>),
        ...(Object.keys(edit) as Array<keyof T>),
      ])) {
        const subPath = path ? `${path}.${String(key)}` : String(key);
        const origIsObj = typeof orig === "object" && orig !== null;
        const editIsObj = typeof edit === "object" && edit !== null;
        if (!(key in orig)) {
          changes[subPath] = editIsObj ? (edit as any)[key] : undefined;
        } else if (!editIsObj || !(key in (edit as object))) {
          changes[subPath] = undefined;
        } else if ((orig as any)[key] !== (edit as any)[key]) {
          if (
            typeof (orig as any)[key] === "object" &&
            (orig as any)[key] &&
            typeof (edit as any)[key] === "object" &&
            (edit as any)[key]
          ) {
            Object.assign(
              changes,
              deepDiff((orig as any)[key], (edit as any)[key], subPath)
            );
          } else {
            changes[subPath] = (edit as any)[key];
          }
        }
      }
      return changes;
    }
    if (orig !== edit) {
      changes[path] = edit;
    }
    return changes;
  }

  // Save only changed fields using server action
  const save = useCallback(async () => {
    if (!id || !original || !edited) return;
    const changes = deepDiff(original, edited);
    // Remove empty path keys
    delete changes[""];
    if (Object.keys(changes).length === 0) return;
    return updateTimesheetServerAction(id, changes);
  }, [id, original, edited]);

  // Has changes
  const hasChanges =
    original && edited && Object.keys(deepDiff(original, edited)).length > 0;

  /**
   * Reset the edited state to the original state, discarding unsaved changes.
   */
  const reset = useCallback(() => {
    setEdited(original ? deepClone(original) : null);
  }, [original]);

  return {
    data: edited,
    setEdited,
    loading,
    error,
    updateField: updateEditedField,
    save,
    hasChanges,
    costCodes,
    jobSites,
    reset,
  };
}
