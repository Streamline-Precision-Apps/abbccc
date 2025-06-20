import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

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
            {form.MaintenanceLogs.length > 0 && (
              <div className="col-span-2 mt-4">
                <h3 className="font-semibold text-sm mb-2">Maintenance Logs</h3>
                {form.MaintenanceLogs.map((log, idx) => (
                  <div
                    key={log.id}
                    className="border rounded p-2 mb-2 grid grid-cols-4 gap-2"
                  >
                    <div>
                      <label className="block text-xs">Start Time</label>
                      <input
                        type="time"
                        value={log.startTime ? log.startTime.slice(11, 16) : ""}
                        onChange={(e) =>
                          handleLogChange<MaintenanceLog>(
                            "MaintenanceLogs",
                            idx,
                            "startTime",
                            e.target.value
                          )
                        }
                        className="border rounded px-2 py-1 w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-xs">End Time</label>
                      <input
                        type="time"
                        value={log.endTime ? log.endTime.slice(11, 16) : ""}
                        onChange={(e) =>
                          handleLogChange<MaintenanceLog>(
                            "MaintenanceLogs",
                            idx,
                            "endTime",
                            e.target.value
                          )
                        }
                        className="border rounded px-2 py-1 w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-xs">Maintenance ID</label>
                      <input
                        type="text"
                        value={log.maintenanceId}
                        onChange={(e) =>
                          handleLogChange<MaintenanceLog>(
                            "MaintenanceLogs",
                            idx,
                            "maintenanceId",
                            e.target.value
                          )
                        }
                        className="border rounded px-2 py-1 w-full"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
            {/* Trucking Logs */}
            {form.TruckingLogs.length > 0 && (
              <div className="col-span-2 mt-4">
                <h3 className="font-semibold text-sm mb-2">Trucking Logs</h3>
                {form.TruckingLogs.map((log, idx) => (
                  <div key={log.id} className="border rounded p-2 mb-2">
                    <div className="grid grid-cols-4 gap-2 mb-2">
                      <div>
                        <label className="block text-xs">Equipment ID</label>
                        <input
                          type="text"
                          value={log.equipmentId}
                          onChange={(e) =>
                            handleLogChange<TruckingLog>(
                              "TruckingLogs",
                              idx,
                              "equipmentId",
                              e.target.value
                            )
                          }
                          className="border rounded px-2 py-1 w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-xs">
                          Starting Mileage
                        </label>
                        <input
                          type="number"
                          value={log.startingMileage}
                          onChange={(e) =>
                            handleLogChange<TruckingLog>(
                              "TruckingLogs",
                              idx,
                              "startingMileage",
                              Number(e.target.value)
                            )
                          }
                          className="border rounded px-2 py-1 w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-xs">Ending Mileage</label>
                        <input
                          type="number"
                          value={log.endingMileage}
                          onChange={(e) =>
                            handleLogChange<TruckingLog>(
                              "TruckingLogs",
                              idx,
                              "endingMileage",
                              Number(e.target.value)
                            )
                          }
                          className="border rounded px-2 py-1 w-full"
                        />
                      </div>
                    </div>
                    {/* Equipment Hauled */}
                    {log.EquipmentHauled.length > 0 && (
                      <div className="mb-2">
                        <div className="font-semibold text-xs">
                          Equipment Hauled
                        </div>
                        {log.EquipmentHauled.map((eq, nidx) => (
                          <div
                            key={eq.id}
                            className="grid grid-cols-2 gap-2 mb-1"
                          >
                            <input
                              type="text"
                              value={eq.equipmentId}
                              onChange={(e) =>
                                handleNestedLogChange<EquipmentHauled>(
                                  "TruckingLogs",
                                  idx,
                                  "EquipmentHauled",
                                  nidx,
                                  "equipmentId",
                                  e.target.value
                                )
                              }
                              className="border rounded px-2 py-1 w-full"
                              placeholder="Equipment ID"
                            />
                            <input
                              type="text"
                              value={eq.jobSiteId}
                              onChange={(e) =>
                                handleNestedLogChange<EquipmentHauled>(
                                  "TruckingLogs",
                                  idx,
                                  "EquipmentHauled",
                                  nidx,
                                  "jobSiteId",
                                  e.target.value
                                )
                              }
                              className="border rounded px-2 py-1 w-full"
                              placeholder="Jobsite ID"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                    {/* Materials */}
                    {log.Materials.length > 0 && (
                      <div className="mb-2">
                        <div className="font-semibold text-xs">Materials</div>
                        {log.Materials.map((mat, nidx) => (
                          <div
                            key={mat.id}
                            className="grid grid-cols-3 gap-2 mb-1"
                          >
                            <input
                              type="text"
                              value={mat.name}
                              onChange={(e) =>
                                handleNestedLogChange<Material>(
                                  "TruckingLogs",
                                  idx,
                                  "Materials",
                                  nidx,
                                  "name",
                                  e.target.value
                                )
                              }
                              className="border rounded px-2 py-1 w-full"
                              placeholder="Name"
                            />
                            <input
                              type="number"
                              value={mat.materialWeight}
                              onChange={(e) =>
                                handleNestedLogChange<Material>(
                                  "TruckingLogs",
                                  idx,
                                  "Materials",
                                  nidx,
                                  "materialWeight",
                                  Number(e.target.value)
                                )
                              }
                              className="border rounded px-2 py-1 w-full"
                              placeholder="Weight"
                            />
                            <input
                              type="text"
                              value={mat.LocationOfMaterial}
                              onChange={(e) =>
                                handleNestedLogChange<Material>(
                                  "TruckingLogs",
                                  idx,
                                  "Materials",
                                  nidx,
                                  "LocationOfMaterial",
                                  e.target.value
                                )
                              }
                              className="border rounded px-2 py-1 w-full"
                              placeholder="Location"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                    {/* Refuel Logs */}
                    {log.RefuelLogs.length > 0 && (
                      <div className="mb-2">
                        <div className="font-semibold text-xs">Refuel Logs</div>
                        {log.RefuelLogs.map((rf, nidx) => (
                          <div
                            key={rf.id}
                            className="grid grid-cols-2 gap-2 mb-1"
                          >
                            <input
                              type="number"
                              value={rf.gallonsRefueled}
                              onChange={(e) =>
                                handleNestedLogChange<RefuelLog>(
                                  "TruckingLogs",
                                  idx,
                                  "RefuelLogs",
                                  nidx,
                                  "gallonsRefueled",
                                  Number(e.target.value)
                                )
                              }
                              className="border rounded px-2 py-1 w-full"
                              placeholder="Gallons"
                            />
                            <input
                              type="number"
                              value={rf.milesAtFueling || ""}
                              onChange={(e) =>
                                handleNestedLogChange<RefuelLog>(
                                  "TruckingLogs",
                                  idx,
                                  "RefuelLogs",
                                  nidx,
                                  "milesAtFueling",
                                  Number(e.target.value)
                                )
                              }
                              className="border rounded px-2 py-1 w-full"
                              placeholder="Miles at Fueling"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                    {/* State Mileages */}
                    {log.StateMileages.length > 0 && (
                      <div className="mb-2">
                        <div className="font-semibold text-xs">
                          State Mileages
                        </div>
                        {log.StateMileages.map((sm, nidx) => (
                          <div
                            key={sm.id}
                            className="grid grid-cols-2 gap-2 mb-1"
                          >
                            <input
                              type="text"
                              value={sm.state}
                              onChange={(e) =>
                                handleNestedLogChange<StateMileage>(
                                  "TruckingLogs",
                                  idx,
                                  "StateMileages",
                                  nidx,
                                  "state",
                                  e.target.value
                                )
                              }
                              className="border rounded px-2 py-1 w-full"
                              placeholder="State"
                            />
                            <input
                              type="number"
                              value={sm.stateLineMileage}
                              onChange={(e) =>
                                handleNestedLogChange<StateMileage>(
                                  "TruckingLogs",
                                  idx,
                                  "StateMileages",
                                  nidx,
                                  "stateLineMileage",
                                  Number(e.target.value)
                                )
                              }
                              className="border rounded px-2 py-1 w-full"
                              placeholder="Mileage"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
            {/* Tasco Logs */}
            {form.TascoLogs.length > 0 && (
              <div className="col-span-2 mt-4">
                <h3 className="font-semibold text-sm mb-2">Tasco Logs</h3>
                {form.TascoLogs.map((log, idx) => (
                  <div
                    key={log.id}
                    className="border rounded p-2 mb-2 grid grid-cols-4 gap-2"
                  >
                    <div>
                      <label className="block text-xs">Shift Type</label>
                      <input
                        type="text"
                        value={log.shiftType}
                        onChange={(e) =>
                          handleLogChange<TascoLog>(
                            "TascoLogs",
                            idx,
                            "shiftType",
                            e.target.value
                          )
                        }
                        className="border rounded px-2 py-1 w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-xs">Labor Type</label>
                      <input
                        type="text"
                        value={log.laborType}
                        onChange={(e) =>
                          handleLogChange<TascoLog>(
                            "TascoLogs",
                            idx,
                            "laborType",
                            e.target.value
                          )
                        }
                        className="border rounded px-2 py-1 w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-xs">Material Type</label>
                      <input
                        type="text"
                        value={log.materialType}
                        onChange={(e) =>
                          handleLogChange<TascoLog>(
                            "TascoLogs",
                            idx,
                            "materialType",
                            e.target.value
                          )
                        }
                        className="border rounded px-2 py-1 w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-xs">Load Quantity</label>
                      <input
                        type="number"
                        value={log.LoadQuantity}
                        onChange={(e) =>
                          handleLogChange<TascoLog>(
                            "TascoLogs",
                            idx,
                            "LoadQuantity",
                            Number(e.target.value)
                          )
                        }
                        className="border rounded px-2 py-1 w-full"
                      />
                    </div>
                    {/* Refuel Logs */}
                    {log.RefuelLogs.length > 0 && (
                      <div className="col-span-4 mt-2">
                        <div className="font-semibold text-xs">Refuel Logs</div>
                        {log.RefuelLogs.map((rf, nidx) => (
                          <div
                            key={rf.id}
                            className="grid grid-cols-2 gap-2 mb-1"
                          >
                            <input
                              type="number"
                              value={rf.gallonsRefueled}
                              onChange={(e) =>
                                handleNestedLogChange<RefuelLog>(
                                  "TascoLogs",
                                  idx,
                                  "RefuelLogs",
                                  nidx,
                                  "gallonsRefueled",
                                  Number(e.target.value)
                                )
                              }
                              className="border rounded px-2 py-1 w-full"
                              placeholder="Gallons"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
            {/* Employee Equipment Logs */}
            {form.EmployeeEquipmentLogs.length > 0 && (
              <div className="col-span-2 mt-4">
                <h3 className="font-semibold text-sm mb-2">
                  Employee Equipment Logs
                </h3>
                {form.EmployeeEquipmentLogs.map((log, idx) => (
                  <div
                    key={log.id}
                    className="border rounded p-2 mb-2 grid grid-cols-4 gap-2"
                  >
                    <div>
                      <label className="block text-xs">Equipment ID</label>
                      <input
                        type="text"
                        value={log.equipmentId}
                        onChange={(e) =>
                          handleLogChange<EmployeeEquipmentLog>(
                            "EmployeeEquipmentLogs",
                            idx,
                            "equipmentId",
                            e.target.value
                          )
                        }
                        className="border rounded px-2 py-1 w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-xs">Start Time</label>
                      <input
                        type="time"
                        value={log.startTime ? log.startTime.slice(11, 16) : ""}
                        onChange={(e) =>
                          handleLogChange<EmployeeEquipmentLog>(
                            "EmployeeEquipmentLogs",
                            idx,
                            "startTime",
                            e.target.value
                          )
                        }
                        className="border rounded px-2 py-1 w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-xs">End Time</label>
                      <input
                        type="time"
                        value={log.endTime ? log.endTime.slice(11, 16) : ""}
                        onChange={(e) =>
                          handleLogChange<EmployeeEquipmentLog>(
                            "EmployeeEquipmentLogs",
                            idx,
                            "endTime",
                            e.target.value
                          )
                        }
                        className="border rounded px-2 py-1 w-full"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
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
