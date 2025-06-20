import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { EditMaintenanceLogs } from "./EditMaintenanceLogs";
import { EditTruckingLogs } from "./EditTruckingLogs";
import { EditTascoLogs } from "./EditTascoLogs";
import { EditEmployeeEquipmentLogs } from "./EditEmployeeEquipmentLogs";

interface EditTimesheetModalProps {
  timesheetId: string;
  isOpen: boolean;
  onClose: () => void;
}

// Types for nested logs
interface MaintenanceLog {
  id: string;
  startTime: string;
  endTime: string;
  maintenanceId: string;
}
interface EquipmentHauled {
  id: string;
  equipmentId: string;
  jobSiteId: string;
}
interface Material {
  id: string;
  LocationOfMaterial: string;
  name: string;
  materialWeight: number;
  lightWeight: number;
  grossWeight: number;
  loadType: string;
}
interface RefuelLog {
  id: string;
  gallonsRefueled: number;
  milesAtFueling?: number;
}
interface StateMileage {
  id: string;
  state: string;
  stateLineMileage: number;
}
interface TruckingLog {
  id: string;
  equipmentId: string;
  startingMileage: number;
  endingMileage: number;
  EquipmentHauled: EquipmentHauled[];
  Materials: Material[];
  RefuelLogs: RefuelLog[];
  StateMileages: StateMileage[];
}
interface TascoLog {
  id: string;
  shiftType: string;
  laborType: string;
  materialType: string;
  LoadQuantity: number;
  RefuelLogs: RefuelLog[];
  Equipment: { id: string; name: string } | null;
}
interface EmployeeEquipmentLog {
  id: string;
  equipmentId: string;
  startTime: string;
  endTime: string;
  Equipment: { id: string; name: string } | null;
}

interface TimesheetData {
  id: string;
  date: string;
  user: { id: string; firstName: string; lastName: string };
  jobsite: { id: string; name: string };
  costcode: { id: string; name: string };
  startTime: string;
  endTime: string;
  workType: string;
  comment: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  MaintenanceLogs: MaintenanceLog[];
  TruckingLogs: TruckingLog[];
  TascoLogs: TascoLog[];
  EmployeeEquipmentLogs: EmployeeEquipmentLog[];
}

export const EditTimesheetModal: React.FC<EditTimesheetModalProps> = ({
  timesheetId,
  isOpen,
  onClose,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<TimesheetData | null>(null);
  const [form, setForm] = useState<TimesheetData | null>(null);

  useEffect(() => {
    if (!isOpen || !timesheetId) return;
    setLoading(true);
    setError(null);
    setData(null);
    fetch(`/api/getTimesheetById?id=${timesheetId}`)
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to fetch timesheet");
        return res.json();
      })
      .then((json) => {
        setData(json);
        setForm(json); // Pre-populate form
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [isOpen, timesheetId]);

  // General field change handler
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (!form) return;
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Log field change handler (for nested logs)
  const handleLogChange = <T extends object>(
    logType: keyof TimesheetData,
    logIndex: number,
    field: keyof T,
    value: any
  ) => {
    if (!form) return;
    setForm({
      ...form,
      [logType]: (form[logType] as T[]).map((log, idx) =>
        idx === logIndex ? { ...log, [field]: value } : log
      ),
    });
  };

  // Nested array change handler (e.g., Materials in TruckingLogs)
  const handleNestedLogChange = <T extends object>(
    logType: keyof TimesheetData,
    logIndex: number,
    nestedType: string,
    nestedIndex: number,
    field: keyof T,
    value: any
  ) => {
    if (!form) return;
    setForm({
      ...form,
      [logType]: (form[logType] as any[]).map((log, idx) =>
        idx === logIndex
          ? {
              ...log,
              [nestedType]: log[nestedType].map((item: T, nidx: number) =>
                nidx === nestedIndex ? { ...item, [field]: value } : item
              ),
            }
          : log
      ),
    });
  };

  // Add/Remove handlers for each log type
  const addMaintenanceLog = () => {
    if (!form) return;
    setForm({
      ...form,
      MaintenanceLogs: [
        ...form.MaintenanceLogs,
        { id: Date.now().toString(), startTime: "", endTime: "", maintenanceId: "" },
      ],
    });
  };
  const removeMaintenanceLog = (idx: number) => {
    if (!form) return;
    setForm({
      ...form,
      MaintenanceLogs: form.MaintenanceLogs.filter((_, i) => i !== idx),
    });
  };

  const addTruckingLog = () => {
    if (!form) return;
    setForm({
      ...form,
      TruckingLogs: [
        ...form.TruckingLogs,
        {
          id: Date.now().toString(),
          equipmentId: "",
          startingMileage: 0,
          endingMileage: 0,
          EquipmentHauled: [],
          Materials: [],
          RefuelLogs: [],
          StateMileages: [],
        },
      ],
    });
  };
  const removeTruckingLog = (idx: number) => {
    if (!form) return;
    setForm({
      ...form,
      TruckingLogs: form.TruckingLogs.filter((_, i) => i !== idx),
    });
  };

  const addTascoLog = () => {
    if (!form) return;
    setForm({
      ...form,
      TascoLogs: [
        ...form.TascoLogs,
        {
          id: Date.now().toString(),
          shiftType: "",
          laborType: "",
          materialType: "",
          LoadQuantity: 0,
          RefuelLogs: [],
          Equipment: null,
        },
      ],
    });
  };
  const removeTascoLog = (idx: number) => {
    if (!form) return;
    setForm({
      ...form,
      TascoLogs: form.TascoLogs.filter((_, i) => i !== idx),
    });
  };

  const addEmployeeEquipmentLog = () => {
    if (!form) return;
    setForm({
      ...form,
      EmployeeEquipmentLogs: [
        ...form.EmployeeEquipmentLogs,
        {
          id: Date.now().toString(),
          equipmentId: "",
          startTime: "",
          endTime: "",
          Equipment: null,
        },
      ],
    });
  };
  const removeEmployeeEquipmentLog = (idx: number) => {
    if (!form) return;
    setForm({
      ...form,
      EmployeeEquipmentLogs: form.EmployeeEquipmentLogs.filter((_, i) => i !== idx),
    });
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg p-6 min-w-[900px] max-h-[90vh] overflow-y-auto">
        <div className="mb-4">
          <h2 className="text-xl font-bold">Edit Timesheet</h2>
          <p className="text-sm mb-1 text-gray-600">
            Timesheet ID: {timesheetId}
          </p>
        </div>
        {loading && <div className="text-gray-500">Loading...</div>}
        {error && <div className="text-red-500">{error}</div>}
        {form && (
          <form className="grid grid-cols-2 gap-4">
            {/* General fields */}
            <div>
              <label className="block text-xs font-semibold mb-1">Date</label>
              <input
                type="date"
                name="date"
                value={form.date ? form.date.toString().slice(0, 10) : ""}
                onChange={handleChange}
                className="border rounded px-2 py-1 w-full"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">
                Start Time
              </label>
              <input
                type="time"
                name="startTime"
                value={form.startTime ? form.startTime.slice(11, 16) : ""}
                onChange={handleChange}
                className="border rounded px-2 py-1 w-full"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">
                End Time
              </label>
              <input
                type="time"
                name="endTime"
                value={form.endTime ? form.endTime.slice(11, 16) : ""}
                onChange={handleChange}
                className="border rounded px-2 py-1 w-full"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">
                Work Type
              </label>
              <input
                type="text"
                name="workType"
                value={form.workType || ""}
                onChange={handleChange}
                className="border rounded px-2 py-1 w-full"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-semibold mb-1">
                Comment
              </label>
              <textarea
                name="comment"
                value={form.comment || ""}
                onChange={handleChange}
                className="border rounded px-2 py-1 w-full"
              />
            </div>
            {/* Related logs */}
            {/* Maintenance Logs */}
            <EditMaintenanceLogs
              logs={form.MaintenanceLogs}
              onLogChange={(idx, field, value) => handleLogChange<MaintenanceLog>("MaintenanceLogs", idx, field, value)}
              onAddLog={addMaintenanceLog}
              onRemoveLog={removeMaintenanceLog}
            />
            {/* Trucking Logs */}
            <EditTruckingLogs
              logs={form.TruckingLogs}
              onLogChange={(idx, field, value) => handleLogChange<TruckingLog>("TruckingLogs", idx, field, value)}
              onAddLog={addTruckingLog}
              onRemoveLog={removeTruckingLog}
              handleNestedLogChange={(logIndex, nestedType, nestedIndex, field, value) =>
                handleNestedLogChange<any>("TruckingLogs", logIndex, nestedType, nestedIndex, field, value)
              }
            />
            {/* Tasco Logs */}
            <EditTascoLogs
              logs={form.TascoLogs}
              onLogChange={(idx, field, value) => handleLogChange<TascoLog>("TascoLogs", idx, field, value)}
              onAddLog={addTascoLog}
              onRemoveLog={removeTascoLog}
              handleNestedLogChange={(logIndex, nestedType, nestedIndex, field, value) =>
                handleNestedLogChange<any>("TascoLogs", logIndex, nestedType, nestedIndex, field, value)
              }
            />
            {/* Employee Equipment Logs */}
            <EditEmployeeEquipmentLogs
              logs={form.EmployeeEquipmentLogs}
              onLogChange={(idx, field, value) => handleLogChange<EmployeeEquipmentLog>("EmployeeEquipmentLogs", idx, field, value)}
              onAddLog={addEmployeeEquipmentLog}
              onRemoveLog={removeEmployeeEquipmentLog}
            />
            {/* Actions */}
            <div className="col-span-2 flex justify-end gap-2 mt-4">
              <Button
                type="button"
                variant="outline"
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                type="button"
                className="bg-sky-500 hover:bg-sky-400 text-white px-4 py-2 rounded"
                disabled
              >
                Save
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
