import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { EditMaintenanceLogs } from "./EditMaintenanceLogs";
import { EditTruckingLogs } from "./EditTruckingLogs";
import { EditTascoLogs } from "./EditTascoLogs";
import { EditEmployeeEquipmentLogs } from "./EditEmployeeEquipmentLogs";
import { adminUpdateTimesheet } from "@/actions/records-timesheets";
import EditGeneralSection, {
  type EditGeneralSectionProps,
} from "./EditGeneralSection";

interface EditTimesheetModalProps {
  timesheetId: string;
  isOpen: boolean;
  onClose: () => void;
  onUpdated?: () => void; // Optional callback for parent to refetch
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
  User: { id: string; firstName: string; lastName: string };
  Jobsite: { id: string; name: string };
  CostCode: { id: string; name: string };
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

// Utility to merge a new HH:mm time into a date string, but keep the value as 'YYYY-MM-DDTHH:mm' (no Z/ISO)
function mergeTimeIntoDateString(dateStr: string, time: string) {
  const dateObj = new Date(dateStr);
  const [hours, minutes] = time.split(":");
  dateObj.setHours(Number(hours), Number(minutes), 0, 0);
  // Return as 'YYYY-MM-DDTHH:mm' (local, no seconds, no Z)
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${dateObj.getFullYear()}-${pad(dateObj.getMonth() + 1)}-${pad(
    dateObj.getDate()
  )}T${pad(dateObj.getHours())}:${pad(dateObj.getMinutes())}`;
}

export const EditTimesheetModal: React.FC<EditTimesheetModalProps> = ({
  timesheetId,
  isOpen,
  onClose,
  onUpdated,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<TimesheetData | null>(null);
  const [form, setForm] = useState<TimesheetData | null>(null);
  const [originalForm, setOriginalForm] = useState<TimesheetData | null>(null);

  // Dropdown state for users, jobsites, cost codes
  const [users, setUsers] = useState<
    { id: string; firstName: string; lastName: string }[]
  >([]);
  const [jobsites, setJobsites] = useState<{ id: string; name: string }[]>([]);
  const [costCode, setCostCode] = useState<{ value: string; label: string }[]>(
    []
  );

  // Options for comboboxes
  const userOptions = users.map((u) => ({
    value: u.id,
    label: `${u.firstName} ${u.lastName}`,
  }));
  const jobsiteOptions = jobsites.map((j) => ({ value: j.id, label: j.name }));
  const costCodeOptions = costCode.map((c) => ({
    value: c.value,
    label: c.label,
  }));

  // Fetch cost codes when jobsite changes
  useEffect(() => {
    async function fetchCostCodes() {
      if (!form?.Jobsite?.id) {
        setCostCode([]);
        if (form)
          setForm(
            (prev) => prev && { ...prev, CostCode: { id: "", name: "" } }
          );
        return;
      }
      try {
        const res = await fetch(
          `/api/getAllCostCodesByJobSites?jobsiteId=${form.Jobsite.id}`
        );
        if (!res.ok) {
          setCostCode([]);
          if (form)
            setForm(
              (prev) => prev && { ...prev, CostCode: { id: "", name: "" } }
            );
          return;
        }
        const codes = await res.json();
        const options = codes.map((c: { id: string; name: string }) => ({
          value: c.id,
          label: c.name,
        }));
        setCostCode(options);
        // Optionally reset costcode if not in new list
        if (
          form &&
          !options.find(
            (c: { value: string; label: string }) =>
              c.value === form.CostCode.id
          )
        ) {
          setForm(
            (prev) => prev && { ...prev, CostCode: { id: "", name: "" } }
          );
        }
      } catch (e) {
        setCostCode([]);
        if (form)
          setForm(
            (prev) => prev && { ...prev, CostCode: { id: "", name: "" } }
          );
      }
    }
    fetchCostCodes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form?.Jobsite?.id]);

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
        setOriginalForm(json); // Store original for undo
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [isOpen, timesheetId]);

  // Fetch users and jobsites for dropdowns
  useEffect(() => {
    async function fetchDropdowns() {
      const usersRes = await fetch("/api/getAllActiveEmployeeName");
      const jobsitesRes = await fetch("/api/getJobsiteSummary");
      const users = await usersRes.json();
      const jobsite = await jobsitesRes.json();
      const filteredJobsite = jobsite.filter(
        (j: { approvalStatus: string }) => j.approvalStatus === "APPROVED"
      );
      const filteredJobsites = filteredJobsite.map(
        (j: { id: string; name: string }) => ({ id: j.id, name: j.name })
      );
      setUsers(users);
      setJobsites(filteredJobsites);
    }
    fetchDropdowns();
  }, []);

  // General field change handler
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    if (!form) return;
    const { name, value } = e.target;
    if ((name === "startTime" || name === "endTime") && form.date) {
      // Use the current value or fallback to the date
      const base = form[name] || form.date;
      setForm({ ...form, [name]: mergeTimeIntoDateString(base, value) });
    } else {
      setForm({ ...form, [name]: value });
    }
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
        {
          id: Date.now().toString(),
          startTime: "",
          endTime: "",
          maintenanceId: "",
        },
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
      EmployeeEquipmentLogs: form.EmployeeEquipmentLogs.filter(
        (_, i) => i !== idx
      ),
    });
  };

  // Work type options and log section mapping
  const workTypeOptions = [
    { value: "MECHANIC", label: "Maintenance" },
    { value: "TRUCK_DRIVER", label: "Trucking" },
    { value: "TASCO", label: "Tasco" },
    { value: "LABOR", label: "General" },
  ];
  const showMaintenance = form?.workType === "MECHANIC";
  const showTrucking = form?.workType === "TRUCK_DRIVER";
  const showTasco = form?.workType === "TASCO";
  const showEquipment = form?.workType === "LABOR";

  // Undo handler for general fields
  const handleUndoField = (field: keyof TimesheetData) => {
    if (!form || !originalForm) return;
    setForm({ ...form, [field]: originalForm[field] });
  };

  // Transform TimesheetData to TimesheetSubmission
  function toSubmission(form: TimesheetData): any {
    return {
      form: {
        date: new Date(form.date),
        user: form.User, // ensure user is included
        jobsite: form.Jobsite, // ensure jobsite is included
        costcode: form.CostCode, // ensure costcode is included
        startTime: form.startTime?.slice(11, 16) || "",
        endTime: form.endTime?.slice(11, 16) || "",
        workType: form.workType,
        comment: form.comment,
      },
      maintenanceLogs: form.MaintenanceLogs.map((log) => ({
        startTime: log.startTime?.slice(11, 16) || "",
        endTime: log.endTime?.slice(11, 16) || "",
        maintenanceId: log.maintenanceId,
      })),
      truckingLogs: form.TruckingLogs.map((log) => ({
        equipmentId: log.equipmentId,
        startingMileage: log.startingMileage?.toString() || "",
        endingMileage: log.endingMileage?.toString() || "",
        equipmentHauled: log.EquipmentHauled.map((eq) => ({
          equipment: { id: eq.equipmentId, name: "" },
          jobsite: { id: eq.jobSiteId, name: "" },
        })),
        materials: log.Materials.map((mat) => ({
          location: mat.LocationOfMaterial,
          name: mat.name,
          materialWeight: mat.materialWeight?.toString() || "",
          lightWeight: mat.lightWeight?.toString() || "",
          grossWeight: mat.grossWeight?.toString() || "",
          loadType: mat.loadType || "",
        })),
        refuelLogs: log.RefuelLogs.map((ref) => ({
          gallonsRefueled: ref.gallonsRefueled?.toString() || "",
          milesAtFueling: ref.milesAtFueling?.toString() || "",
        })),
        stateMileages: log.StateMileages.map((sm) => ({
          state: sm.state,
          stateLineMileage: sm.stateLineMileage?.toString() || "",
        })),
      })),
      tascoLogs: form.TascoLogs.map((log) => ({
        shiftType: log.shiftType,
        laborType: log.laborType,
        materialType: log.materialType,
        loadQuantity: log.LoadQuantity?.toString() || "",
        refuelLogs: log.RefuelLogs.map((ref) => ({
          gallonsRefueled: ref.gallonsRefueled?.toString() || "",
        })),
        equipment: log.Equipment
          ? [{ id: log.Equipment.id, name: log.Equipment.name }]
          : [],
      })),
      laborLogs: form.EmployeeEquipmentLogs.map((log) => ({
        equipment: log.Equipment
          ? { id: log.Equipment.id, name: log.Equipment.name }
          : { id: log.equipmentId, name: "" },
        startTime: log.startTime?.slice(11, 16) || "",
        endTime: log.endTime?.slice(11, 16) || "",
      })),
    };
  }

  // Submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;
    setLoading(true);
    setError(null);
    try {
      await adminUpdateTimesheet(timesheetId, toSubmission(form));
      if (onUpdated) onUpdated();
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to update timesheet");
    } finally {
      setLoading(false);
    }
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
          <form className="grid grid-cols-2 gap-4" onSubmit={handleSubmit}>
            {/* General fields: user, jobsite, costcode */}
            <EditGeneralSection
              form={form}
              setForm={setForm}
              userOptions={userOptions}
              jobsiteOptions={jobsiteOptions}
              costCodeOptions={costCodeOptions}
              users={users}
              jobsites={jobsites}
            />
            {/* General fields */}
            <div className="flex flex-row items-end">
              <div className="flex-1">
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
                {originalForm && form.date !== originalForm.date && (
                  <Button
                    type="button"
                    size="sm"
                    className="ml-2"
                    onClick={() => handleUndoField("date")}
                  >
                    Undo
                  </Button>
                )}
              </div>
            </div>
            <div className="flex flex-row items-end">
              <div className="flex-1">
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
                {originalForm && form.startTime !== originalForm.startTime && (
                  <Button
                    type="button"
                    size="sm"
                    className="ml-2"
                    onClick={() => handleUndoField("startTime")}
                  >
                    Undo
                  </Button>
                )}
              </div>
            </div>
            <div className="flex flex-row items-end">
              <div className="flex-1">
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
                {originalForm && form.endTime !== originalForm.endTime && (
                  <Button
                    type="button"
                    size="sm"
                    className="ml-2"
                    onClick={() => handleUndoField("endTime")}
                  >
                    Undo
                  </Button>
                )}
              </div>
            </div>
            <div className="flex flex-row items-end">
              <div className="flex-1">
                <label className="block text-xs font-semibold mb-1">
                  Work Type
                </label>
                <select
                  name="workType"
                  value={form.workType || ""}
                  onChange={(e) => handleChange(e as any)}
                  className="border rounded px-2 py-1 w-full"
                >
                  <option value="">Select work type</option>
                  {workTypeOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                {originalForm && form.workType !== originalForm.workType && (
                  <Button
                    type="button"
                    size="sm"
                    className="ml-2"
                    onClick={() => handleUndoField("workType")}
                  >
                    Undo
                  </Button>
                )}
              </div>
            </div>
            <div className="flex flex-row items-end col-span-2">
              <div className="flex-1">
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
              <div>
                {originalForm && form.comment !== originalForm.comment && (
                  <Button
                    type="button"
                    size="sm"
                    className="ml-2"
                    onClick={() => handleUndoField("comment")}
                  >
                    Undo
                  </Button>
                )}
              </div>
            </div>
            {/* Related logs - conditional rendering by workType */}
            {showMaintenance && (
              <EditMaintenanceLogs
                logs={form.MaintenanceLogs}
                onLogChange={(idx, field, value) =>
                  handleLogChange<MaintenanceLog>(
                    "MaintenanceLogs",
                    idx,
                    field,
                    value
                  )
                }
                onAddLog={addMaintenanceLog}
                onRemoveLog={removeMaintenanceLog}
                originalLogs={originalForm?.MaintenanceLogs || []}
                onUndoLogField={(idx, field) => {
                  if (!form || !originalForm) return;
                  setForm({
                    ...form,
                    MaintenanceLogs: form.MaintenanceLogs.map((log, i) =>
                      i === idx
                        ? {
                            ...log,
                            [field]: originalForm.MaintenanceLogs[idx]?.[field],
                          }
                        : log
                    ),
                  });
                }}
              />
            )}
            {showTrucking && (
              <EditTruckingLogs
                logs={form.TruckingLogs}
                onLogChange={(idx, field, value) =>
                  handleLogChange<TruckingLog>(
                    "TruckingLogs",
                    idx,
                    field,
                    value
                  )
                }
                onAddLog={addTruckingLog}
                onRemoveLog={removeTruckingLog}
                handleNestedLogChange={(
                  logIndex,
                  nestedType,
                  nestedIndex,
                  field,
                  value
                ) =>
                  handleNestedLogChange<any>(
                    "TruckingLogs",
                    logIndex,
                    nestedType,
                    nestedIndex,
                    field,
                    value
                  )
                }
                originalLogs={originalForm?.TruckingLogs || []}
                onUndoLogField={(idx, field) => {
                  if (!form || !originalForm) return;
                  setForm({
                    ...form,
                    TruckingLogs: form.TruckingLogs.map((log, i) =>
                      i === idx
                        ? {
                            ...log,
                            [field]: originalForm.TruckingLogs[idx]?.[field],
                          }
                        : log
                    ),
                  });
                }}
              />
            )}
            {showTasco && (
              <EditTascoLogs
                logs={form.TascoLogs}
                onLogChange={(idx, field, value) =>
                  handleLogChange<TascoLog>("TascoLogs", idx, field, value)
                }
                onAddLog={addTascoLog}
                onRemoveLog={removeTascoLog}
                handleNestedLogChange={(
                  logIndex,
                  nestedType,
                  nestedIndex,
                  field,
                  value
                ) =>
                  handleNestedLogChange<any>(
                    "TascoLogs",
                    logIndex,
                    nestedType,
                    nestedIndex,
                    field,
                    value
                  )
                }
                originalLogs={originalForm?.TascoLogs || []}
                onUndoLogField={(idx, field) => {
                  if (!form || !originalForm) return;
                  setForm({
                    ...form,
                    TascoLogs: form.TascoLogs.map((log, i) =>
                      i === idx
                        ? {
                            ...log,
                            [field]: originalForm.TascoLogs[idx]?.[field],
                          }
                        : log
                    ),
                  });
                }}
              />
            )}
            {showEquipment && (
              <EditEmployeeEquipmentLogs
                logs={form.EmployeeEquipmentLogs}
                onLogChange={(idx, field, value) =>
                  handleLogChange<EmployeeEquipmentLog>(
                    "EmployeeEquipmentLogs",
                    idx,
                    field,
                    value
                  )
                }
                onAddLog={addEmployeeEquipmentLog}
                onRemoveLog={removeEmployeeEquipmentLog}
                originalLogs={originalForm?.EmployeeEquipmentLogs || []}
                onUndoLogField={(idx, field) => {
                  if (!form || !originalForm) return;
                  setForm({
                    ...form,
                    EmployeeEquipmentLogs: form.EmployeeEquipmentLogs.map(
                      (log, i) =>
                        i === idx
                          ? {
                              ...log,
                              [field]:
                                originalForm.EmployeeEquipmentLogs[idx]?.[
                                  field
                                ],
                            }
                          : log
                    ),
                  });
                }}
              />
            )}
            {/* Actions */}
            <div className="col-span-2 flex justify-end gap-2 mt-4">
              <Button
                type="button"
                variant="outline"
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-sky-500 hover:bg-sky-400 text-white px-4 py-2 rounded"
                disabled={loading}
              >
                {loading ? "Saving..." : "Save"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
