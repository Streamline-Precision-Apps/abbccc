import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { EditMaintenanceLogs } from "./EditMaintenanceLogs";
import { EditTruckingLogs } from "./EditTruckingLogs";
import { EditTascoLogs } from "./EditTascoLogs";
import { EditEmployeeEquipmentLogs } from "./EditEmployeeEquipmentLogs";
import { adminUpdateTimesheet } from "@/actions/records-timesheets";
import EditGeneralSection from "./EditGeneralSection";
import { isMaintenanceLogComplete } from "./EditMaintenanceLogs";

interface EditTimesheetModalProps {
  timesheetId: string;
  isOpen: boolean;
  onClose: () => void;
  onUpdated?: () => void; // Optional callback for parent to refetch
  isEditing: boolean;
  editingId: string | null;
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
  date: Date | string;
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

export const EditTimesheetModal: React.FC<EditTimesheetModalProps> = ({
  timesheetId,
  isOpen,
  onClose,
  onUpdated,
  isEditing,
  editingId,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
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
  const [equipment, setEquipment] = useState<{ id: string; name: string }[]>(
    []
  );

  const equipmentOptions = equipment.map((e) => ({
    value: e.id,
    label: e.name,
  }));

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

    fetch(`/api/getTimesheetById?id=${timesheetId}`)
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to fetch timesheet");
        return res.json();
      })
      .then((json) => {
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
      const equipmentRes = await fetch("/api/getAllEquipment");

      const users = await usersRes.json();
      const jobsite = await jobsitesRes.json();
      const equipment = await equipmentRes.json();

      const filteredJobsite = jobsite.filter(
        (j: { approvalStatus: string }) => j.approvalStatus === "APPROVED"
      );
      const filteredJobsites = filteredJobsite.map(
        (j: { id: string; name: string }) => ({ id: j.id, name: j.name })
      );
      setUsers(users);
      setJobsites(filteredJobsites);
      setEquipment(equipment as { id: string; name: string }[]);
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
    value: any,
    date?: string // pass the parent date if needed
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
        date: form.date,
        user: form.User, // ensure user is included
        jobsite: form.Jobsite, // ensure jobsite is included
        costcode: form.CostCode, // ensure costcode is included
        startTime: form.startTime || "",
        endTime: form.endTime || "",
        workType: form.workType,
        comment: form.comment,
      },
      maintenanceLogs: form.MaintenanceLogs.map((log) => ({
        startTime: log.startTime || "",
        endTime: log.endTime || "",
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
        startTime: log.startTime || "",
        endTime: log.endTime || "",
      })),
    };
  }

  // Submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;
    // Validation: all maintenance logs must be complete if visible
    if (
      showMaintenance &&
      form.MaintenanceLogs.some((log) => !isMaintenanceLogComplete(log))
    ) {
      setError(
        "Invalid Maintenance log submission. Please complete all fields before submitting again."
      );
      return;
    }
    // You can add similar validation for other log types if needed
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

  // Equipment/project options for maintenance logs
  const [maintenanceEquipmentOptions, setMaintenanceEquipmentOptions] =
    useState<{ value: string; label: string }[]>([]);

  useEffect(() => {
    async function fetchEquipment() {
      try {
        const res = await fetch("/api/getMechanicProjectSummary");
        if (!res.ok) return setMaintenanceEquipmentOptions([]);
        const data = await res.json();
        // Flatten to [{ value: id, label: Equipment.name }]
        const options = data.map((m: any) => ({
          value: m.id,
          label: `#${m.id}`,
        }));
        setMaintenanceEquipmentOptions(options);
      } catch {
        setMaintenanceEquipmentOptions([]);
      }
    }
    fetchEquipment();
  }, []);

  // For work types that should only have one log (Trucking, Tasco)
  const ensureSingleLog = (logType: "TruckingLogs" | "TascoLogs") => {
    if (!form) return;
    setForm((prev) => {
      if (!prev) return prev;
      // If no log exists, add one
      if (prev[logType].length === 0) {
        if (logType === "TruckingLogs") {
          return {
            ...prev,
            TruckingLogs: [
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
          };
        } else if (logType === "TascoLogs") {
          return {
            ...prev,
            TascoLogs: [
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
          };
        }
      }
      // If more than one log exists, keep only the first
      if (prev[logType].length > 1) {
        return {
          ...prev,
          [logType]: [prev[logType][0]],
        };
      }
      return prev;
    });
  };

  // Call ensureSingleLog when workType changes to TRUCK_DRIVER or TASCO
  useEffect(() => {
    if (!form) return;
    if (form.workType === "TRUCK_DRIVER") {
      ensureSingleLog("TruckingLogs");
    } else if (form.workType === "TASCO") {
      ensureSingleLog("TascoLogs");
    }
    // Optionally, clear the other log type if switching between them
    // ...
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form?.workType]);

  // Add helpers for nested arrays
  // Add Equipment Hauled
  const addEquipmentHauled = (logIdx: number) => {
    if (!form) return;
    setForm((prev) =>
      prev
        ? {
            ...prev,
            TruckingLogs: prev.TruckingLogs.map((log, idx) =>
              idx === logIdx
                ? {
                    ...log,
                    EquipmentHauled: [
                      ...log.EquipmentHauled,
                      {
                        id: Date.now().toString(),
                        equipmentId: "",
                        jobSiteId: "",
                      },
                    ],
                  }
                : log
            ),
          }
        : prev
    );
  };
  const deleteEquipmentHauled = (logIdx: number, eqIdx: number) => {
    if (!form) return;
    setForm((prev) =>
      prev
        ? {
            ...prev,
            TruckingLogs: prev.TruckingLogs.map((log, idx) =>
              idx === logIdx
                ? {
                    ...log,
                    EquipmentHauled: log.EquipmentHauled.filter(
                      (_, i) => i !== eqIdx
                    ),
                  }
                : log
            ),
          }
        : prev
    );
  };

  const addMaterial = (logIdx: number) => {
    if (!form) return;
    setForm((prev) =>
      prev
        ? {
            ...prev,
            TruckingLogs: prev.TruckingLogs.map((log, idx) =>
              idx === logIdx
                ? {
                    ...log,
                    Materials: [
                      ...log.Materials,
                      {
                        id: Date.now().toString(),
                        LocationOfMaterial: "",
                        name: "",
                        materialWeight: 0,
                        lightWeight: 0,
                        grossWeight: 0,
                        loadType: "",
                      },
                    ],
                  }
                : log
            ),
          }
        : prev
    );
  };
  const deleteMaterial = (logIdx: number, matIdx: number) => {
    if (!form) return;
    setForm((prev) =>
      prev
        ? {
            ...prev,
            TruckingLogs: prev.TruckingLogs.map((log, idx) =>
              idx === logIdx
                ? {
                    ...log,
                    Materials: log.Materials.filter((_, i) => i !== matIdx),
                  }
                : log
            ),
          }
        : prev
    );
  };

  const addRefuelLog = (logIdx: number) => {
    if (!form) return;
    setForm((prev) =>
      prev
        ? {
            ...prev,
            TruckingLogs: prev.TruckingLogs.map((log, idx) =>
              idx === logIdx
                ? {
                    ...log,
                    RefuelLogs: [
                      ...log.RefuelLogs,
                      {
                        id: Date.now().toString(),
                        gallonsRefueled: 0,
                        milesAtFueling: 0,
                      },
                    ],
                  }
                : log
            ),
          }
        : prev
    );
  };
  const deleteRefuelLog = (logIdx: number, refIdx: number) => {
    if (!form) return;
    setForm((prev) =>
      prev
        ? {
            ...prev,
            TruckingLogs: prev.TruckingLogs.map((log, idx) =>
              idx === logIdx
                ? {
                    ...log,
                    RefuelLogs: log.RefuelLogs.filter((_, i) => i !== refIdx),
                  }
                : log
            ),
          }
        : prev
    );
  };

  const addStateMileage = (logIdx: number) => {
    if (!form) return;
    setForm((prev) =>
      prev
        ? {
            ...prev,
            TruckingLogs: prev.TruckingLogs.map((log, idx) =>
              idx === logIdx
                ? {
                    ...log,
                    StateMileages: [
                      ...log.StateMileages,
                      {
                        id: Date.now().toString(),
                        state: "",
                        stateLineMileage: 0,
                      },
                    ],
                  }
                : log
            ),
          }
        : prev
    );
  };
  const deleteStateMileage = (logIdx: number, smIdx: number) => {
    if (!form) return;
    setForm((prev) =>
      prev
        ? {
            ...prev,
            TruckingLogs: prev.TruckingLogs.map((log, idx) =>
              idx === logIdx
                ? {
                    ...log,
                    StateMileages: log.StateMileages.filter(
                      (_, i) => i !== smIdx
                    ),
                  }
                : log
            ),
          }
        : prev
    );
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg min-w-[900px] max-h-[90vh] overflow-y-auto no-scrollbar">
        {error && (
          <div className=" text-xs text-red-600 mb-2 bg-red-400 bg-opacity-20 px-6 py-4 rounded">
            <span className="font-bold">Error:</span> {error}
          </div>
        )}
        <div className="p-6">
          <div className="mb-4">
            <h2 className="text-xl font-bold">Edit Timesheet</h2>
            <p className="text-sm mb-1 text-gray-600">
              Timesheet ID: {timesheetId}
            </p>
          </div>
          {loading && <div className="text-gray-500">Loading...</div>}
          {form && (
            <form className="grid grid-cols-2 gap-4" onSubmit={handleSubmit}>
              <EditGeneralSection
                form={form}
                setForm={setForm}
                userOptions={userOptions}
                jobsiteOptions={jobsiteOptions}
                costCodeOptions={costCodeOptions}
                users={users}
                jobsites={jobsites}
                originalForm={originalForm}
                handleUndoField={handleUndoField}
                handleChange={handleChange}
                workTypeOptions={workTypeOptions}
              />
              {/* Related logs - conditional rendering by workType */}

              {showMaintenance && (
                <EditMaintenanceLogs
                  maintenanceOptions={maintenanceEquipmentOptions}
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
                              [field]:
                                originalForm.MaintenanceLogs[idx]?.[field],
                            }
                          : log
                      ),
                    });
                  }}
                  disableAdd={
                    form.MaintenanceLogs.length > 0 &&
                    !isMaintenanceLogComplete(
                      form.MaintenanceLogs[form.MaintenanceLogs.length - 1]
                    )
                  }
                />
              )}

              {showTrucking && (
                <EditTruckingLogs
                  addEquipmentHauled={addEquipmentHauled}
                  deleteEquipmentHauled={deleteEquipmentHauled}
                  addMaterial={addMaterial}
                  deleteMaterial={deleteMaterial}
                  addRefuelLog={addRefuelLog}
                  deleteRefuelLog={deleteRefuelLog}
                  addStateMileage={addStateMileage}
                  deleteStateMileage={deleteStateMileage}
                  jobsiteOptions={jobsiteOptions}
                  equipmentOptions={equipmentOptions}
                  logs={form.TruckingLogs}
                  onLogChange={(idx, field, value) =>
                    handleLogChange<TruckingLog>(
                      "TruckingLogs",
                      idx,
                      field,
                      value
                    )
                  }
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
    </div>
  );
};
