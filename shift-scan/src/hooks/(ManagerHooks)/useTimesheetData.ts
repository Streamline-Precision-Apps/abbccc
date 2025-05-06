import { useState, useEffect, useCallback } from "react";
import { TimesheetFilter } from "@/lib/types";

interface TimesheetDataResponse {
  data: any;
  loading: boolean;
  error: Error | null;
  updateDate: (newDate: string) => void;
  updateFilter: (newFilter: TimesheetFilter) => void;
}

export const useTimesheetData = (
  employeeId: string | undefined,
  initialDate: string,
  initialFilter: TimesheetFilter
): TimesheetDataResponse => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
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
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
    } finally {
      setLoading(false);
    }
  }, [employeeId, currentDate, currentFilter]);

  useEffect(() => {
    fetchTimesheets();
  }, [fetchTimesheets]);

  const updateDate = useCallback((newDate: string) => {
    setCurrentDate(newDate);
  }, []);

  const updateFilter = useCallback((newFilter: TimesheetFilter) => {
    setCurrentFilter(newFilter);
  }, []);

  return {
    data,
    loading,
    error,
    updateDate,
    updateFilter,
  };
};