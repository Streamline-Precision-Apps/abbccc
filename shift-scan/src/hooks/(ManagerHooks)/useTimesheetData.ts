// hooks/useTimesheetData.ts
import { useState, useEffect, useCallback } from "react";
import {
  TimesheetHighlights,
  TruckingEquipmentHaulLogData,
  TruckingMaterialHaulLogData,
  TruckingMileageData,
  TruckingRefuelLogData,
  TruckingStateLogData,
  TascoRefuelLogData,
  TascoHaulLogData,
  EquipmentLogsData,
  EmployeeEquipmentLogWithRefuel,
} from "@/lib/types";

interface TimesheetData {
  highlightTimesheet: TimesheetHighlights[] | null;
  truckingEquipmentHaulLogs: TruckingEquipmentHaulLogData | null;
  truckingMaterialHaulLogs: TruckingMaterialHaulLogData | null;
  truckingMileage: TruckingMileageData | null;
  truckingRefuelLogs: TruckingRefuelLogData | null;
  truckingStateLogs: TruckingStateLogData | null;
  tascoRefuelLog: TascoRefuelLogData | null;
  tascoHaulLogs: TascoHaulLogData | null;
  equipmentLogs: EquipmentLogsData | null;
  equipmentRefuelLogs: EmployeeEquipmentLogWithRefuel[] | null;
  loading: boolean;
  error: any; // Consider a more specific error type
  updateDate: (newDate: string) => void;
  updateFilter: (newFilter: string) => void;
}

export const useTimesheetData = (
  employeeId: string | undefined,
  initialDate: string,
  initialFilter: string,
  onInitialDataLoaded?: (
    data: Omit<
      TimesheetData,
      "loading" | "error" | "updateDate" | "updateFilter"
    >
  ) => void
): TimesheetData => {
  const [highlightTimesheet, setHighlightTimesheet] = useState<
    TimesheetHighlights[] | null
  >(null);
  const [truckingEquipmentHaulLogs, setTruckingEquipmentHaulLogs] =
    useState<TruckingEquipmentHaulLogData | null>(null);
  const [truckingMaterialHaulLogs, setTruckingMaterialHaulLogs] =
    useState<TruckingMaterialHaulLogData | null>(null);
  const [truckingMileage, setTruckingMileage] =
    useState<TruckingMileageData | null>(null);
  const [truckingRefuelLogs, setTruckingRefuelLogs] =
    useState<TruckingRefuelLogData | null>(null);
  const [truckingStateLogs, setTruckingStateLogs] =
    useState<TruckingStateLogData | null>(null);
  const [tascoRefuelLog, setTascoRefuelLog] =
    useState<TascoRefuelLogData | null>(null);
  const [tascoHaulLogs, setTascoHaulLogs] = useState<TascoHaulLogData | null>(
    null
  );
  const [equipmentLogs, setEquipmentLogs] = useState<EquipmentLogsData | null>(
    null
  );
  const [equipmentRefuelLogs, setEquipmentRefuelLogs] = useState<
    EmployeeEquipmentLogWithRefuel[] | null
  >(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const [currentDate, setCurrentDate] = useState(initialDate);
  const [currentFilter, setCurrentFilter] = useState(initialFilter);

  const fetchTimesheets = useCallback(
    async (date: string, filter: string) => {
      if (!employeeId) {
        return;
      }
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `/api/getTimesheetsByDate?employeeId=${employeeId}&date=${date}&type=${filter}`
        );
        if (!response.ok) {
          const message = `An error occurred: ${response.status}`;
          throw new Error(message);
        }
        const data = await response.json();

        switch (filter) {
          case "timesheetHighlights":
            setHighlightTimesheet(data as TimesheetHighlights[]);
            break;
          case "truckingMileage":
            setTruckingMileage(data as TruckingMileageData);
            break;
          case "truckingEquipmentHaulLogs":
            setTruckingEquipmentHaulLogs(data as TruckingEquipmentHaulLogData);
            break;
          case "truckingMaterialHaulLogs":
            setTruckingMaterialHaulLogs(data as TruckingMaterialHaulLogData);
            break;
          case "truckingRefuelLogs":
            setTruckingRefuelLogs(data as TruckingRefuelLogData);
            break;
          case "truckingStateLogs":
            setTruckingStateLogs(data as TruckingStateLogData);
            break;
          case "tascoRefuelLogs":
            setTascoRefuelLog(data as TascoRefuelLogData);
            break;
          case "tascoHaulLogs":
            setTascoHaulLogs(data as TascoHaulLogData);
            break;
          case "equipmentLogs":
            setEquipmentLogs(data as EquipmentLogsData);
            break;
          case "equipmentRefuelLogs":
            setEquipmentRefuelLogs(data as EmployeeEquipmentLogWithRefuel[]);
            break;
          default:
            // Handle unknown filter or set a default state
            break;
        }
        if (onInitialDataLoaded) {
          onInitialDataLoaded({
            highlightTimesheet,
            truckingEquipmentHaulLogs,
            truckingMaterialHaulLogs,
            truckingMileage,
            truckingRefuelLogs,
            truckingStateLogs,
            tascoRefuelLog,
            tascoHaulLogs,
            equipmentLogs,
            equipmentRefuelLogs,
          });
        }
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    },
    [employeeId, onInitialDataLoaded]
  );

  useEffect(() => {
    fetchTimesheets(currentDate, currentFilter);
  }, [currentDate, currentFilter, fetchTimesheets]);

  const updateDate = useCallback((newDate: string) => {
    setCurrentDate(newDate);
  }, []);

  const updateFilter = useCallback((newFilter: string) => {
    setCurrentFilter(newFilter);
  }, []);

  return {
    highlightTimesheet,
    truckingEquipmentHaulLogs,
    truckingMaterialHaulLogs,
    truckingMileage,
    truckingRefuelLogs,
    truckingStateLogs,
    tascoRefuelLog,
    tascoHaulLogs,
    equipmentLogs,
    equipmentRefuelLogs,
    loading,
    error,
    updateDate,
    updateFilter,
  };
};
