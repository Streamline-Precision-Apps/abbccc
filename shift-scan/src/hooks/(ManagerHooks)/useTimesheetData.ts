import { useState, useEffect, useCallback } from "react";
import { TimesheetFilter } from "@/lib/types";

interface TimesheetDataResponse {
  data: any;
  loading: boolean;
  error: string | null;
  updateDate: (newDate: string) => Promise<void>;
  updateFilter: (newFilter: TimesheetFilter) => Promise<void>;
}

export const useTimesheetData = (
  employeeId: string | undefined,
  initialDate: string,
  initialFilter: TimesheetFilter
): TimesheetDataResponse => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState(initialDate);
  const [currentFilter, setCurrentFilter] = useState<TimesheetFilter>(initialFilter);

  const fetchTimesheets = useCallback(async () => {
    if (!employeeId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/getTimesheetsByDate?employeeId=${employeeId}&date=${currentDate}&type=${currentFilter}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(`Failed to fetch timesheets: ${err}`);
    } finally {
      setLoading(false);
    }
  }, [employeeId, currentDate, currentFilter]);

  const fetchTimesheetsForDate = useCallback(async (newDate: string) => {
    setCurrentDate(newDate);
    await fetchTimesheets();
  }, [fetchTimesheets]);

  const updateFilter = useCallback(async (newFilter: TimesheetFilter) => {
    setCurrentFilter(newFilter);
    await fetchTimesheets();
  }, [fetchTimesheets]);

  useEffect(() => {
    fetchTimesheets();
  }, [fetchTimesheets]);

  return {
    data,
    loading,
    error,
    updateDate: fetchTimesheetsForDate,
    updateFilter,
  };
};