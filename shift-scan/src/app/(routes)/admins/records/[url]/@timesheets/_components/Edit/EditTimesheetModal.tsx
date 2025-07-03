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
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type {
  TruckingLog,
  TascoLog,
  EmployeeEquipmentLog,
  MaintenanceLog,
} from "@/lib/types";
import type { TimesheetSubmission } from "@/actions/records-timesheets";

// Define TimesheetData type for form state
export type TimesheetData = {
  date: Date | string;
  User: { id: string; firstName: string; lastName: string };
  Jobsite: { id: string; name: string };
  CostCode: { id: string; name: string };
  startTime: Date | null;
  endTime: Date | null;
  workType: string;
  MaintenanceLogs: Array<{
    id: string;
    startTime: string;
    endTime: string;
    maintenanceId: string;
  }>;
  TruckingLogs: TruckingLog[];
  TascoLogs: TascoLog[];
  EmployeeEquipmentLogs: EmployeeEquipmentLog[];
  [key: string]: unknown;
};

interface EditTimesheetModalProps {
  timesheetId: string;
  isOpen: boolean;
  onClose: () => void;
  onUpdated?: () => void; // Optional callback for parent to refetch
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

    setForm({ ...form, [name]: value });
  };

  // Log field change handler (for nested logs)
  const handleLogChange = <T extends object>(
    logType: keyof TimesheetData,
    logIndex: number,
    field: keyof T,
    value: T[keyof T],
    date?: string
  ) => {
    if (!form) return;
    setForm({
      ...form,
      [logType]: (form[logType] as T[]).map((log, idx) =>
        idx === logIndex
          ? {
              ...log,
              [field]: value,
            }
          : log
      ),
    });
  };
  const handleNestedLogChange = <T extends object>(
    logType: keyof TimesheetData,
    logIndex: number,
    nestedType: keyof T,
    nestedIndex: number,
    field: keyof T,
    value: T[keyof T]
  ) => {
    if (!form) return;
    setForm({
      ...form,
      [logType]: (form[logType] as T[]).map((log, idx) =>
        idx === logIndex
          ? {
              ...log,
              [nestedType]: Array.isArray(log[nestedType])
                ? (log[nestedType] as T[]).map((item, nidx) =>
                    nidx === nestedIndex ? { ...item, [field]: value } : item
                  )
                : log[nestedType],
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
      MaintenanceLogs: form.MaintenanceLogs.filter((_, i: number) => i !== idx),
    });
  };

  // Fix: Use correct property names and types for log creation and manipulation
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
          equipmentHauled: [],
          material: [],
          refueled: [],
          stateMileage: [],
          comment: null,
          netWeight: null,
          taskName: null,
          createdAt: new Date(),
          timeSheetId: null,
          equipment: null,
          timeSheet: null,
        } as TruckingLog,
      ],
    });
  };
  const removeTruckingLog = (idx: number) => {
    if (!form) return;
    setForm({
      ...form,
      TruckingLogs: form.TruckingLogs.filter((_, i: number) => i !== idx),
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
          loadsHauled: 0,
          loads: [],
          refueled: [],
          comment: "",
          equipmentId: "",
        } as TascoLog,
      ],
    });
  };
  const removeTascoLog = (idx: number) => {
    if (!form) return;
    setForm({
      ...form,
      TascoLogs: form.TascoLogs.filter((_, i: number) => i !== idx),
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
          jobsiteId: "",
          employeeId: "",
          startTime: null,
          endTime: null,
          comment: null,
          createdAt: new Date(),
          updatedAt: new Date(),
          isFinished: false,
          status: "PENDING",
          equipment: null,
          jobsite: null,
          employee: { id: "", firstName: "", lastName: "" },
          timeSheet: null,
        } as EmployeeEquipmentLog,
      ],
    });
  };
  const removeEmployeeEquipmentLog = (idx: number) => {
    if (!form) return;
    setForm({
      ...form,
      EmployeeEquipmentLogs: form.EmployeeEquipmentLogs.filter(
        (_, i: number) => i !== idx
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
  // Fix: Convert Date | null to { date: string; time: string } for TimesheetSubmission
  function toSubmission(form: TimesheetData): TimesheetSubmission {
    const toDateTimeObj = (dt: Date | null): { date: string; time: string } => {
      if (!dt) return { date: "", time: "" };
      const iso = dt.toISOString();
      return {
        date: iso.slice(0, 10),
        time: iso.slice(11, 16),
      };
    };
    return {
      form: {
        date: form.date instanceof Date ? form.date : new Date(form.date),
        user: form.User,
        jobsite: form.Jobsite,
        costcode: form.CostCode,
        startTime: toDateTimeObj(form.startTime),
        endTime: toDateTimeObj(form.endTime),
        workType: form.workType,
        // comment: form.comment, // Remove if not in TimesheetSubmission
      },
      maintenanceLogs: form.MaintenanceLogs.map((log) => ({
        startTime: log.startTime,
        endTime: log.endTime,
        maintenanceId: log.maintenanceId,
      })),
      truckingLogs: form.TruckingLogs.map((log) => ({
        equipmentId: log.equipmentId ?? "",
        startingMileage: String(log.startingMileage ?? ""),
        endingMileage: String(log.endingMileage ?? ""),
        equipmentHauled: (log.equipmentHauled || []).map((eq) => ({
          equipment: { id: eq.equipmentId, name: "" },
          jobsite: { id: "", name: "" }, // Provide empty jobsite to match expected type
        })),
        materials: (log.material || []).map((mat) => ({
          name: mat.name,
          location: "",
          materialWeight: "",
          lightWeight: "",
          grossWeight: "",
          loadType: "",
        })),
        refuelLogs: (log.refueled || []).map((ref) => ({
          gallonsRefueled: String(ref.gallonsRefueled ?? ""),
          milesAtFueling: "", // Provide empty string to match expected type
        })),
        stateMileages: (log.stateMileage || []).map((sm) => ({
          state: sm.state,
          stateLineMileage: String(sm.stateLineMileage ?? ""),
        })),
      })),
      tascoLogs: form.TascoLogs.map((log) => ({
        shiftType: log.shiftType as "" | "ABCD Shift" | "E Shift" | "F Shift",
        laborType: log.laborType as "" | "Equipment Operator" | "Labor",
        materialType: log.materialType,
        loadQuantity: String(log.loadsHauled ?? ""),
        refuelLogs: (log.refueled || []).map((ref) => ({
          gallonsRefueled: String(ref.gallonsRefueled ?? ""),
        })),
        equipment: log.equipmentId ? [{ id: log.equipmentId, name: "" }] : [],
      })),
      laborLogs: form.EmployeeEquipmentLogs.map((log) => ({
        equipment: log.equipment
          ? { id: log.equipment.id, name: log.equipment.name }
          : { id: log.equipmentId, name: "" },
        startTime: String(log.startTime ?? ""),
        endTime: String(log.endTime ?? ""),
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
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "Failed to update timesheet");
      } else {
        setError("Failed to update timesheet");
      }
    } finally {
      setLoading(false);
    }
  };

  // DateTimePicker component for date and time selection
  function DateTimePicker({
    value,
    onChange,
    label,
  }: {
    value?: Date | null;
    onChange: (val: Date | null) => void;
    label: string;
  }) {
    const dateValue = value ?? undefined;
    const timeValue = value ? format(value, "HH:mm") : "";
    const handleDateChange = (date: Date | undefined) => {
      if (!date) return;
      const [hours, minutes] = timeValue ? timeValue.split(":") : ["00", "00"];
      date.setHours(Number(hours), Number(minutes), 0, 0);
      onChange(date);
    };
    const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const time = e.target.value;
      if (!dateValue) return;
      const [hours, minutes] = time.split(":");
      const newDate = new Date(dateValue);
      newDate.setHours(Number(hours), Number(minutes), 0, 0);
      onChange(newDate);
    };
    return (
      <div>
        <label className="block text-xs font-semibold mb-1">{label}</label>
        <div className="flex gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-[160px] justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateValue ? (
                  format(dateValue, "PPP")
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={dateValue}
                onSelect={handleDateChange}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <input
            type="time"
            value={timeValue}
            onChange={handleTimeChange}
            className="border rounded px-2 py-1"
          />
        </div>
      </div>
    );
  }

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
            <div className="flex flex-row items-end col-span-2">
              <div className="flex-1">
                <label className="block text-xs font-semibold mb-1">
                  Created On
                </label>
                <input
                  type="date"
                  name="date"
                  value={form.date ? form.date.toString().slice(0, 10) : ""}
                  disabled
                  className="border rounded px-2 py-1 w-full bg-gray-100 cursor-not-allowed"
                />
              </div>
            </div>
            <EditGeneralSection
              form={form}
              setForm={(f) =>
                setForm((prev) => ({ ...prev, ...f } as TimesheetData))
              }
              userOptions={userOptions}
              jobsiteOptions={jobsiteOptions}
              costCodeOptions={costCodeOptions}
              users={users}
              jobsites={jobsites}
            />
            {/* General fields */}

            <DateTimePicker
              label="Start Time"
              value={form.startTime}
              onChange={(val) => setForm({ ...form, startTime: val })}
            />
            <DateTimePicker
              label="End Time"
              value={form.endTime}
              onChange={(val) => setForm({ ...form, endTime: val })}
            />
            <div className="flex flex-row items-end">
              <div className="flex-1">
                <label className="block text-xs font-semibold mb-1">
                  Work Type
                </label>
                <select
                  name="workType"
                  value={form.workType || ""}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    handleChange(e)
                  }
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
                  value={typeof form.comment === "string" ? form.comment : ""}
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
                    value,
                    typeof form.date === "string"
                      ? form.date
                      : form.date.toISOString().slice(0, 10)
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
                    field as keyof TruckingLog,
                    value as TruckingLog[keyof TruckingLog]
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
                  handleNestedLogChange<TruckingLog>(
                    "TruckingLogs",
                    logIndex,
                    nestedType,
                    nestedIndex,
                    field as keyof TruckingLog,
                    value as TruckingLog[keyof TruckingLog]
                  )
                }
                originalLogs={
                  originalForm?.TruckingLogs?.map((log) => ({
                    ...log,
                    equipmentHauled: log.equipmentHauled || [],
                    material: log.material || [],
                    refueled: log.refueled || [],
                    stateMileage: log.stateMileage || [],
                  })) || []
                }
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
                  handleLogChange<TascoLog>(
                    "TascoLogs",
                    idx,
                    field as keyof TascoLog,
                    value as TascoLog[keyof TascoLog]
                  )
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
                  handleNestedLogChange<TascoLog>(
                    "TascoLogs",
                    logIndex,
                    nestedType,
                    nestedIndex,
                    field as keyof TascoLog,
                    value as TascoLog[keyof TascoLog]
                  )
                }
                originalLogs={
                  originalForm?.TascoLogs?.map((log) => ({
                    ...log,
                    loadsHauled: log.loadsHauled || 0,
                    loads: log.loads || [],
                    refueled: log.refueled || [],
                    equipmentId: log.equipmentId || "",
                    comment: log.comment || "",
                  })) || []
                }
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
