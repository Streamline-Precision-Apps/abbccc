import { useState, useEffect } from "react";

export interface TimesheetEntry {
  id: string;
  startTime: string;
  endTime: string;
  status: string;
  workType: string;
  Jobsite?: { name: string };
  CostCode?: { name: string };
}

export interface TimesheetDataResponse {
  timesheetData: TimesheetEntry[];
  // add other fields if your API returns more
}
export const useTimesheetDataSimple = (
  employeeId: string | undefined,
  initialDate: string
): {
  data: TimesheetDataResponse | null;
  setData: (data: TimesheetDataResponse | null) => void;
  loading: boolean;
  error: string | null;
  updateDate: (newDate: string) => void;
} => {
  const [data, setData] = useState<TimesheetDataResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState(initialDate);

  const updateDate = (newDate: string) => {
    setCurrentDate(newDate);
  };

  useEffect(() => {
    const fetchTimesheets = async () => {
      if (!employeeId) return;
      setLoading(true);
      setError(null);
      try {
        const url = `/api/getTimesheetsByDateNew?employeeId=${employeeId}&date=${currentDate}`;
        const response = await fetch(url);
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
    };
    fetchTimesheets();
  }, [employeeId, currentDate]);

  return {
    data,
    setData,
    loading,
    error,
    updateDate,
  };
};
