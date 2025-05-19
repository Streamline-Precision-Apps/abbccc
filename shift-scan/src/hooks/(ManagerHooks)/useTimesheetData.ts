import { useState, useEffect } from "react";
import {
  TimesheetFilter,
  TimesheetHighlights,
  TruckingMileageData,
  TruckingEquipmentHaulLogData,
  TruckingMaterialHaulLogData,
  TruckingRefuelLogData,
  TruckingStateLogData,
  TascoHaulLogData,
  TascoRefuelLogData,
  EquipmentLogsData,
  EmployeeEquipmentLogWithRefuel,
} from "@/lib/types";

// Union type for all possible timesheet data
export type TimesheetDataUnion =
  | TimesheetHighlights[]
  | TruckingMileageData
  | TruckingEquipmentHaulLogData
  | TruckingMaterialHaulLogData
  | TruckingRefuelLogData
  | TruckingStateLogData
  | TascoHaulLogData
  | TascoRefuelLogData
  | EquipmentLogsData
  | EmployeeEquipmentLogWithRefuel[]
  | null;

interface TimesheetDataResponse {
  data: TimesheetDataUnion;
  setData: (data: TimesheetDataUnion) => void;
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
  const [data, setData] = useState<TimesheetDataUnion>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState(initialDate);
  const [currentFilter, setCurrentFilter] = useState<TimesheetFilter>(initialFilter);

  const fetchTimesheets = async () => {
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
  };

  const fetchTimesheetsForDate = async (newDate: string) => {
    setCurrentDate(newDate);
    // fetchTimesheets will be triggered by useEffect when currentDate changes
  };

  const updateFilter = async (newFilter: TimesheetFilter) => {
    setCurrentFilter(newFilter);
    // fetchTimesheets will be triggered by useEffect when currentFilter changes
  };

  useEffect(() => {
    fetchTimesheets();
  }, [employeeId, currentDate, currentFilter]);

  return {
    data,
    setData,
    loading,
    error,
    updateDate: fetchTimesheetsForDate,
    updateFilter,
  };
};