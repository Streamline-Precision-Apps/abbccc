"use client";

import { Holds } from "@/components/(reusable)/holds";
import { Texts } from "@/components/(reusable)/texts";
import { Button } from "@/components/ui/button";
import SearchBar from "../../../personnel/components/SearchBar";
import PageSelector from "../pageSelector";
import TimesheetDescription from "./_components/ViewAll/Timesheet-Description";
import TimesheetViewAll from "./_components/ViewAll/Timesheet-ViewAll";
import { TimeSheetStatus, WorkType } from "@/lib/enums";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { Combobox } from "@/components/ui/combobox";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

export type Timesheet = {
  id: string;
  date: Date | string;
  User: {
    id: string;
    firstName: string;
    lastName: string;
  };
  Jobsite: {
    id: string;
    name: string;
  };
  CostCode: {
    id: string;
    name: string;
  };
  nu: string;
  Fp: string;
  startTime: Date | string;
  endTime: Date | string;
  comment: string;
  status: TimeSheetStatus;
  workType: WorkType;
  createdAt: Date | string;
  updatedAt: Date | string;
};
type timesheetPending = {
  length: number;
};

// Helper: Create Timesheet API call (mock, replace with real API call)
async function createTimesheet(data: any) {
  // Always set status to APPROVED
  const payload = { ...data, status: "APPROVED" };
  // Replace with actual API call
  // Example: await fetch('/api/timesheets', { method: 'POST', body: JSON.stringify(payload) })
  return {
    ...payload,
    id: Math.random().toString(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

// Updated CreateTimesheetModal with user/jobsite dropdowns and removed nu, Fp, location, status
function CreateTimesheetModal({
  onSubmit,
  onClose,
}: {
  onSubmit: (data: any) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState({
    date: "",
    user: { id: "", firstName: "", lastName: "" },
    jobsite: { id: "", name: "" },
    costcode: { id: "", name: "" },
    startTime: "",
    endTime: "",
    workType: "",
  });
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
  const [submitting, setSubmitting] = useState(false);
  const [datePickerOpen, setDatePickerOpen] = useState(false);

  // New states for logs
  type MaintenanceLogDraft = {
    startTime: string;
    endTime: string;
    equipmentId: string;
    equipmentName: string;
  };
  const [maintenanceLogs, setMaintenanceLogs] = useState<MaintenanceLogDraft[]>(
    [{ startTime: "", endTime: "", equipmentId: "", equipmentName: "" }]
  );
  // Trucking log type
  type TruckingLogDraft = {
    equipmentId: string;
    startingMileage: string;
    endingMileage: string;
    equipmentHauled: {
      equipment: { id: string; name: string };
      jobsite: { id: string; name: string };
    }[];
    materials: { name: string }[];
    refuelLogs: { gallonsRefueled: string; milesAtFueling: string }[];
    stateMileages: { state: string; stateLineMileage: string }[];
  };
  const [truckingLogs, setTruckingLogs] = useState<TruckingLogDraft[]>([
    {
      equipmentId: "",
      startingMileage: "",
      endingMileage: "",
      equipmentHauled: [],
      materials: [],
      refuelLogs: [],
      stateMileages: [],
    },
  ]);
  const [tascoLogs, setTascoLogs] = useState([{ description: "" }]);
  const [equipmentLogs, setEquipmentLogs] = useState([{ description: "" }]);

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
        const options = data
          .filter((m: any) => m.Equipment && m.Equipment.name)
          .map((m: any) => ({
            value: m.Equipment.id,
            label: m.Equipment.name,
          }));
        setMaintenanceEquipmentOptions(options);
      } catch {
        setMaintenanceEquipmentOptions([]);
      }
    }
    fetchEquipment();
  }, []);

  // Helper to map users/jobsites to combobox options
  const userOptions = users.map((u) => ({
    value: u.id,
    label: `${u.firstName} ${u.lastName}`,
  }));
  const jobsiteOptions = jobsites.map((j) => ({
    value: j.id,
    label: j.name,
  }));
  const costCodeOptions = costCode.map((c) => ({
    value: c.value,
    label: c.label,
  }));

  const equipmentOptions = equipment.map((e) => ({
    value: e.id,
    label: e.name,
  }));

  // Remove costCodeOptions dynamic logic (no costCodes on jobsites)
  const workTypeOptions = [
    { value: "MECHANIC", label: "Mechanic" },
    { value: "TRUCK_DRIVER", label: "Trucking" },
    { value: "LABOR", label: "General" },
    { value: "TASCO", label: "Tasco" },
  ];

  useEffect(() => {
    // Fetch users and jobsites for dropdowns using your real API endpoints
    async function fetchDropdowns() {
      const usersRes = await fetch("/api/getAllActiveEmployeeName");
      const jobsitesRes = await fetch("/api/getJobsiteSummary");
      const equipmentRes = await fetch("/api/getAllEquipment");

      const jobsite = await jobsitesRes.json();
      const filteredJobsite = jobsite.filter(
        (j: { approvalStatus: string }) => j.approvalStatus === "APPROVED"
      );
      const filteredJobsites = filteredJobsite.map(
        (j: { id: string; name: string }) => ({
          id: j.id,
          name: j.name,
        })
      );
      setEquipment(
        (await equipmentRes.json()) as { id: string; name: string }[]
      );
      setUsers(await usersRes.json());
      setJobsites(filteredJobsites);
    }
    fetchDropdowns();
  }, []);

  // Fetch cost codes when jobsite changes
  useEffect(() => {
    async function fetchCostCodes() {
      if (!form.jobsite.id) {
        setCostCode([]);
        setForm((prev) => ({ ...prev, costcode: { id: "", name: "" } }));
        return;
      }
      try {
        const res = await fetch(
          `/api/getAllCostCodesByJobSites?jobsiteId=${form.jobsite.id}`
        );
        if (!res.ok) {
          setCostCode([]);
          setForm((prev) => ({ ...prev, costcode: { id: "", name: "" } }));
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
          !options.find(
            (c: { value: string; label: string }) =>
              c.value === form.costcode.id
          )
        ) {
          setForm((prev) => ({ ...prev, costcode: { id: "", name: "" } }));
        }
      } catch (e) {
        setCostCode([]);
        setForm((prev) => ({ ...prev, costcode: { id: "", name: "" } }));
      }
    }
    fetchCostCodes();
  }, [form.jobsite.id]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    // If the field is costcode and not using the Combobox, update as string fallback
    if (e.target.name === "costcode") {
      setForm({ ...form, costcode: { id: "", name: e.target.value } });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    const result = await createTimesheet({
      ...form,
      maintenanceLogs,
      truckingLogs,
      tascoLogs,
      equipmentLogs,
    });
    onSubmit(result);
    setSubmitting(false);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg p-6 min-w-[800px] max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-bold mb-4">Create New Timesheet</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold mb-1">Date*</label>
            <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full justify-between"
                  onClick={() => setDatePickerOpen((v) => !v)}
                >
                  {form.date
                    ? format(new Date(form.date), "PPP")
                    : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={form.date ? new Date(form.date) : undefined}
                  onSelect={(date) => {
                    setForm({
                      ...form,
                      date: date ? date.toISOString().slice(0, 10) : "",
                    });
                    setDatePickerOpen(false);
                  }}
                  autoFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div>
            <Combobox
              label="User*"
              options={userOptions}
              value={form.user.id}
              onChange={(val, option) => {
                const selected = users.find((u) => u.id === val);
                setForm({
                  ...form,
                  user: selected || { id: "", firstName: "", lastName: "" },
                });
              }}
              placeholder="Select user"
              filterKeys={["value", "label"]} // Filter by both value and label
            />
          </div>
          <div>
            <Combobox
              label="Jobsite*"
              options={jobsiteOptions}
              value={form.jobsite.id}
              onChange={(val, option) => {
                const selected = jobsites.find((j) => j.id === val);
                setForm({
                  ...form,
                  jobsite: selected || { id: "", name: "" },
                  costcode: { id: "", name: "" }, // Reset cost code when jobsite changes
                });
              }}
              placeholder="Select jobsite"
              filterKeys={["value", "label"]} // Filter by both value and label
            />
          </div>
          <div>
            <Combobox
              label="Cost Code *"
              options={costCodeOptions}
              value={form.costcode.id}
              onChange={(val, option) => {
                // Map Combobox option to { id, name } structure
                setForm({
                  ...form,
                  costcode: option
                    ? { id: option.value, name: option.label }
                    : { id: "", name: "" },
                });
              }}
              placeholder="Select cost code"
              filterKeys={["value", "label"]} // Filter by both value and label
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Start Time*</label>
            <Input
              type="time"
              name="startTime"
              value={form.startTime}
              onChange={handleChange}
              required
              className="w-full"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">End Time</label>
            <Input
              type="time"
              name="endTime"
              value={form.endTime}
              onChange={handleChange}
              className="w-full"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Work Type*</label>
            <Select
              value={form.workType}
              onValueChange={(val) => setForm({ ...form, workType: val })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select work type" />
              </SelectTrigger>
              <SelectContent>
                {workTypeOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Conditional log sections */}
          {form.workType === "MECHANIC" && (
            <div className="col-span-2 border rounded p-4 mt-2">
              <h3 className="font-semibold mb-2">Maintenance Logs</h3>
              {maintenanceLogs.map((log, idx) => (
                <div key={idx} className="flex gap-2 mb-2 items-end">
                  <Combobox
                    label="Equipment"
                    options={maintenanceEquipmentOptions}
                    value={log.equipmentId}
                    onChange={(val, option) => {
                      const updated = [...maintenanceLogs];
                      updated[idx].equipmentId = val;
                      updated[idx].equipmentName = option ? option.label : "";
                      setMaintenanceLogs(updated);
                    }}
                    placeholder="Select equipment"
                    filterKeys={["label", "value"]}
                  />
                  <Input
                    type="time"
                    value={log.startTime}
                    onChange={(e) => {
                      const updated = [...maintenanceLogs];
                      updated[idx].startTime = e.target.value;
                      setMaintenanceLogs(updated);
                    }}
                    required
                    className="w-[120px]"
                  />
                  <Input
                    type="time"
                    value={log.endTime}
                    onChange={(e) => {
                      const updated = [...maintenanceLogs];
                      updated[idx].endTime = e.target.value;
                      setMaintenanceLogs(updated);
                    }}
                    className="w-[120px]"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() =>
                      setMaintenanceLogs(
                        maintenanceLogs.filter((_, i) => i !== idx)
                      )
                    }
                  >
                    Remove
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                onClick={() =>
                  setMaintenanceLogs([
                    ...maintenanceLogs,
                    {
                      startTime: "",
                      endTime: "",
                      equipmentId: "",
                      equipmentName: "",
                    },
                  ])
                }
              >
                Add Maintenance Log
              </Button>
            </div>
          )}

          {form.workType === "TRUCK_DRIVER" && (
            <div className="col-span-2 border rounded p-4 mt-2">
              <h3 className="font-semibold mb-2">Trucking Logs</h3>
              {truckingLogs.map((log, idx) => (
                <div
                  key={idx}
                  className="flex flex-col gap-2 mb-4 border-b pb-4"
                >
                  <div className="flex gap-2 items-end">
                    <Combobox
                      label="Equipment"
                      options={equipmentOptions}
                      value={log.equipmentId}
                      onChange={(val, option) => {
                        const updated = [...truckingLogs];
                        updated[idx].equipmentId = val;
                        setTruckingLogs(updated);
                      }}
                      placeholder="Select equipment"
                      filterKeys={["label", "value"]}
                    />
                    <Input
                      type="number"
                      placeholder="Starting Mileage"
                      value={log.startingMileage}
                      onChange={(e) => {
                        const updated = [...truckingLogs];
                        updated[idx].startingMileage = e.target.value;
                        setTruckingLogs(updated);
                      }}
                      className="w-[140px]"
                    />
                    <Input
                      type="number"
                      placeholder="Ending Mileage"
                      value={log.endingMileage}
                      onChange={(e) => {
                        const updated = [...truckingLogs];
                        updated[idx].endingMileage = e.target.value;
                        setTruckingLogs(updated);
                      }}
                      className="w-[140px]"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() =>
                        setTruckingLogs(
                          truckingLogs.filter((_, i) => i !== idx)
                        )
                      }
                    >
                      Remove
                    </Button>
                  </div>
                  {/* Equipment Hauled */}
                  <div>
                    <label className="block font-semibold text-xs">
                      Equipment Hauled
                    </label>
                    {log.equipmentHauled.map((eq, eqIdx) => (
                      <div key={eqIdx} className="flex gap-2 mb-1">
                        <Combobox
                          label="Equipment"
                          options={equipmentOptions}
                          value={eq.equipment.id}
                          onChange={(val, option) => {
                            const updated = [...truckingLogs];
                            updated[idx].equipmentHauled[eqIdx].equipment =
                              option
                                ? { id: option.value, name: option.label }
                                : { id: "", name: "" };
                            setTruckingLogs(updated);
                          }}
                          placeholder="Select equipment"
                          filterKeys={["label", "value"]}
                        />
                        <Combobox
                          label="Jobsite"
                          options={jobsiteOptions}
                          value={eq.jobsite.id}
                          onChange={(val, option) => {
                            const updated = [...truckingLogs];
                            updated[idx].equipmentHauled[eqIdx].jobsite = option
                              ? { id: option.value, name: option.label }
                              : { id: "", name: "" };
                            setTruckingLogs(updated);
                          }}
                          placeholder="Select jobsite"
                          filterKeys={["label", "value"]}
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          onClick={() => {
                            const updated = [...truckingLogs];
                            updated[idx].equipmentHauled = updated[
                              idx
                            ].equipmentHauled.filter((_, i) => i !== eqIdx);
                            setTruckingLogs(updated);
                          }}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      onClick={() => {
                        const updated = [...truckingLogs];
                        updated[idx].equipmentHauled.push({
                          equipment: { id: "", name: "" },
                          jobsite: { id: "", name: "" },
                        });
                        setTruckingLogs(updated);
                      }}
                    >
                      Add Equipment Hauled
                    </Button>
                  </div>
                  {/* Materials */}
                  <div>
                    <label className="block font-semibold text-xs">
                      Materials
                    </label>
                    {log.materials.map((mat, matIdx) => (
                      <div key={matIdx} className="flex gap-2 mb-1">
                        <Input
                          type="text"
                          placeholder="Material Name"
                          value={mat.name}
                          onChange={(e) => {
                            const updated = [...truckingLogs];
                            updated[idx].materials[matIdx].name =
                              e.target.value;
                            setTruckingLogs(updated);
                          }}
                          className="w-[200px]"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          onClick={() => {
                            const updated = [...truckingLogs];
                            updated[idx].materials = updated[
                              idx
                            ].materials.filter((_, i) => i !== matIdx);
                            setTruckingLogs(updated);
                          }}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      onClick={() => {
                        const updated = [...truckingLogs];
                        updated[idx].materials.push({ name: "" });
                        setTruckingLogs(updated);
                      }}
                    >
                      Add Material
                    </Button>
                  </div>
                  {/* Refuel Logs */}
                  <div>
                    <label className="block font-semibold text-xs">
                      Refuel Logs
                    </label>
                    {log.refuelLogs.map((ref, refIdx) => (
                      <div key={refIdx} className="flex gap-2 mb-1">
                        <Input
                          type="number"
                          placeholder="Gallons Refueled"
                          value={ref.gallonsRefueled}
                          onChange={(e) => {
                            const updated = [...truckingLogs];
                            updated[idx].refuelLogs[refIdx].gallonsRefueled =
                              e.target.value;
                            setTruckingLogs(updated);
                          }}
                          className="w-[120px]"
                        />
                        <Input
                          type="number"
                          placeholder="Miles at Fueling"
                          value={ref.milesAtFueling}
                          onChange={(e) => {
                            const updated = [...truckingLogs];
                            updated[idx].refuelLogs[refIdx].milesAtFueling =
                              e.target.value;
                            setTruckingLogs(updated);
                          }}
                          className="w-[120px]"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          onClick={() => {
                            const updated = [...truckingLogs];
                            updated[idx].refuelLogs = updated[
                              idx
                            ].refuelLogs.filter((_, i) => i !== refIdx);
                            setTruckingLogs(updated);
                          }}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      onClick={() => {
                        const updated = [...truckingLogs];
                        updated[idx].refuelLogs.push({
                          gallonsRefueled: "",
                          milesAtFueling: "",
                        });
                        setTruckingLogs(updated);
                      }}
                    >
                      Add Refuel Log
                    </Button>
                  </div>
                  {/* State Line Mileage */}
                  <div>
                    <label className="block font-semibold text-xs">
                      State Line Mileage
                    </label>
                    {log.stateMileages.map((sm, smIdx) => (
                      <div key={smIdx} className="flex gap-2 mb-1">
                        <Input
                          type="text"
                          placeholder="State"
                          value={sm.state}
                          onChange={(e) => {
                            const updated = [...truckingLogs];
                            updated[idx].stateMileages[smIdx].state =
                              e.target.value;
                            setTruckingLogs(updated);
                          }}
                          className="w-[100px]"
                        />
                        <Input
                          type="number"
                          placeholder="State Line Mileage"
                          value={sm.stateLineMileage}
                          onChange={(e) => {
                            const updated = [...truckingLogs];
                            updated[idx].stateMileages[smIdx].stateLineMileage =
                              e.target.value;
                            setTruckingLogs(updated);
                          }}
                          className="w-[120px]"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          onClick={() => {
                            const updated = [...truckingLogs];
                            updated[idx].stateMileages = updated[
                              idx
                            ].stateMileages.filter((_, i) => i !== smIdx);
                            setTruckingLogs(updated);
                          }}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      onClick={() => {
                        const updated = [...truckingLogs];
                        updated[idx].stateMileages.push({
                          state: "",
                          stateLineMileage: "",
                        });
                        setTruckingLogs(updated);
                      }}
                    >
                      Add State Line Mileage
                    </Button>
                  </div>
                </div>
              ))}
              <Button
                type="button"
                onClick={() =>
                  setTruckingLogs([
                    ...truckingLogs,
                    {
                      equipmentId: "",
                      startingMileage: "",
                      endingMileage: "",
                      equipmentHauled: [],
                      materials: [],
                      refuelLogs: [],
                      stateMileages: [],
                    },
                  ])
                }
              >
                Add Trucking Log
              </Button>
            </div>
          )}

          {form.workType === "TASCO" && (
            <div className="col-span-2 border rounded p-4 mt-2">
              <h3 className="font-semibold mb-2">Tasco Logs</h3>
              {tascoLogs.map((log, idx) => (
                <div key={idx} className="flex gap-2 mb-2">
                  <Input
                    type="text"
                    placeholder="Description"
                    value={log.description}
                    onChange={(e) => {
                      const updated = [...tascoLogs];
                      updated[idx].description = e.target.value;
                      setTascoLogs(updated);
                    }}
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() =>
                      setTascoLogs(tascoLogs.filter((_, i) => i !== idx))
                    }
                  >
                    Remove
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                onClick={() =>
                  setTascoLogs([...tascoLogs, { description: "" }])
                }
              >
                Add Tasco Log
              </Button>
            </div>
          )}

          {form.workType === "LABOR" && (
            <div className="col-span-2 border rounded p-4 mt-2">
              <h3 className="font-semibold mb-2">Equipment Logs</h3>
              {equipmentLogs.map((log, idx) => (
                <div key={idx} className="flex gap-2 mb-2">
                  <Input
                    type="text"
                    placeholder="Description"
                    value={log.description}
                    onChange={(e) => {
                      const updated = [...equipmentLogs];
                      updated[idx].description = e.target.value;
                      setEquipmentLogs(updated);
                    }}
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() =>
                      setEquipmentLogs(
                        equipmentLogs.filter((_, i) => i !== idx)
                      )
                    }
                  >
                    Remove
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                onClick={() =>
                  setEquipmentLogs([...equipmentLogs, { description: "" }])
                }
              >
                Add Equipment Log
              </Button>
            </div>
          )}

          <div className="col-span-2 flex justify-end gap-2 mt-4">
            <Button
              type="button"
              variant="outline"
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded"
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-sky-500 hover:bg-sky-400 text-white px-4 py-2 rounded"
              disabled={submitting}
            >
              Submit
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AdminTimesheets() {
  const [searchTerm, setSearchTerm] = useState("");
  const [allTimesheets, setAllTimesheets] = useState<Timesheet[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [pageSize, setPageSize] = useState(25);
  const pageSizeOptions = [25, 50, 75, 100];
  const [sortField, setSortField] = useState<keyof Timesheet | "">("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({ from: undefined, to: undefined });
  const [showCreateModal, setShowCreateModal] = useState(false);

  function handleCreateSubmit(newTimesheet: Timesheet) {
    // Option 1: Add to state
    // setAllTimesheets((prev) => [newTimesheet, ...prev]);
    // Option 2: Refetch data
    setPage(1); // Go to first page
    setShowCreateModal(false);
    // Optionally, trigger a refetch here
  }

  useEffect(() => {
    const fetchTimesheets = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `/api/getAllTimesheetInfo?page=${page}&pageSize=${pageSize}`
        );
        const data = await response.json();
        setAllTimesheets(data.timesheets);
        setTotalPages(data.totalPages);
        setTotal(data.total);
      } catch (error) {
        console.error("Error fetching timesheets:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTimesheets();
  }, [page, pageSize]);

  // Filter timesheets based on searchTerm and date range
  const filteredTimesheets = allTimesheets.filter((ts) => {
    const id = ts.id || "";
    const firstName = ts?.User?.firstName || "";
    const lastName = ts?.User?.lastName || "";
    const jobsite = ts?.Jobsite?.name || "";
    const costCode = ts?.CostCode?.name || "";
    const term = searchTerm.toLowerCase();
    // Date range filter
    let inDateRange = true;
    if (dateRange.from) {
      inDateRange = inDateRange && new Date(ts.date) >= dateRange.from;
    }
    if (dateRange.to) {
      inDateRange = inDateRange && new Date(ts.date) <= dateRange.to;
    }
    return (
      inDateRange &&
      (id.toLowerCase().includes(term) ||
        firstName.toLowerCase().includes(term) ||
        lastName.toLowerCase().includes(term) ||
        jobsite.toLowerCase().includes(term) ||
        costCode.toLowerCase().includes(term))
    );
  });

  // Sort filteredTimesheets before pagination
  const sortedTimesheets = [...filteredTimesheets].sort((a, b) => {
    if (!sortField) return 0;
    let aValue = a[sortField];
    let bValue = b[sortField];
    // Handle nested fields
    if (sortField === "User") {
      aValue = a.User.firstName + " " + a.User.lastName;
      bValue = b.User.firstName + " " + b.User.lastName;
    } else if (sortField === "Jobsite") {
      aValue = a.Jobsite.name;
      bValue = b.Jobsite.name;
    } else if (sortField === "CostCode") {
      aValue = a.CostCode.name;
      bValue = b.CostCode.name;
    }
    if (aValue == null) return 1;
    if (bValue == null) return -1;
    if (typeof aValue === "string" && typeof bValue === "string") {
      if (sortDirection === "asc") {
        return aValue.localeCompare(bValue);
      } else {
        return bValue.localeCompare(aValue);
      }
    }
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
    return 0;
  });

  // implement timesheet deletion functionality

  const [approvalInbox, setApprovalInbox] = useState<timesheetPending | null>(
    null
  );

  useEffect(() => {
    const fetchTimesheetsPending = async () => {
      try {
        const response = await fetch(`/api/getAllTimesheetsPending`);
        const data = await response.json();
        setApprovalInbox(data);
      } catch (error) {
        console.error("Error fetching timesheets:", error);
      }
    };

    fetchTimesheetsPending();
  }, []);

  // implement timesheet approval and rejection functionality
  // implement timesheet editing functionality
  // implement timesheet download / export functionality

  return (
    <div>
      <Holds className="h-full w-full flex-col gap-4">
        <TimesheetDescription />
        {/*Timesheet search, filter and navigation*/}
        <Holds position={"row"} className="h-fit w-full px-4 gap-4">
          <Holds
            position={"left"}
            background={"white"}
            className="h-full w-full max-w-[450px] py-2"
          >
            <SearchBar
              term={searchTerm}
              handleSearchChange={(e) => setSearchTerm(e.target.value)}
              placeholder={"Search by id, employee, Profit Id or cost code..."}
              textSize="xs"
              imageSize="6"
            />
          </Holds>
          <Holds position={"row"} className="w-fit min-w-[40px] h-full">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="bg-white h-full w-full max-w-[40px] justify-center items-center"
                >
                  <img
                    src="/filterDials.svg"
                    alt="Filter"
                    className="h-4 w-4"
                  />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="min-w-[320px] p-4 ">
                <div className="">
                  <div className="flex items-center justify-between mb-2">
                    <label className="block mb-1 font-semibold">
                      Date Range
                    </label>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="p-2 flex-shrink-0"
                      onClick={() =>
                        setDateRange({ from: undefined, to: undefined })
                      }
                      aria-label="Clear date range"
                    >
                      <img
                        src="/trash-red.svg"
                        alt="Clear date range"
                        className="h-5 w-5"
                      />
                    </Button>
                  </div>

                  <div className="mt-2 text-xs text-center text-muted-foreground">
                    {dateRange.from && dateRange.to ? (
                      `${format(dateRange.from, "PPP")} - ${format(
                        dateRange.to,
                        "PPP"
                      )}`
                    ) : dateRange.from ? (
                      `${format(dateRange.from, "PPP")} - ...`
                    ) : (
                      <span>Pick a date range</span>
                    )}
                  </div>
                  <div className="flex items-center justify-center gap-2 overflow-visible">
                    <Calendar
                      mode="range"
                      selected={dateRange}
                      onSelect={(value) =>
                        setDateRange({ from: value?.from, to: value?.to })
                      }
                      autoFocus
                    />
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </Holds>
          <Holds position={"row"} className="w-full max-w-[160px] h-full">
            <Texts
              position={"left"}
              size={"sm"}
              text={"white"}
              className="font-bold"
            >
              {/* {numOfTimesheets} of {numOfTimesheets} forms */}
            </Texts>
          </Holds>
          <Holds position={"row"} className="w-full justify-end h-full">
            <PageSelector />
            <Button
              className="border-none w-fit h-fit px-4 bg-sky-500 hover:bg-sky-400 text-white mr-2"
              onClick={() => setShowCreateModal(true)}
            >
              <Holds position={"row"} className="items-center">
                <img
                  src="/plus.svg"
                  alt="Create New Form"
                  className="h-4 w-4 mr-2"
                />
                <Texts size={"sm"} text={"black"} className="font-extrabold">
                  Create New Form
                </Texts>
              </Holds>
            </Button>
            {showCreateModal && (
              <CreateTimesheetModal
                onSubmit={handleCreateSubmit}
                onClose={() => setShowCreateModal(false)}
              />
            )}
            <Button className="relative border-none w-fit h-fit px-4 bg-gray-900 hover:bg-gray-800 text-white">
              <Holds position={"row"} className="items-center">
                <img
                  src="/inbox-white.svg"
                  alt="Approval"
                  className="h-4 w-4 mr-2"
                />
                <Texts size={"sm"} text={"white"} className="font-extrabold">
                  Approval
                </Texts>
                {approvalInbox && approvalInbox.length > 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-red-500 text-white px-2 py-0.5 text-xs rounded-full">
                    {approvalInbox.length}
                  </Badge>
                )}
              </Holds>
            </Button>
          </Holds>
        </Holds>
        <Holds className="h-full w-full px-4 overflow-y-auto">
          <TimesheetViewAll
            timesheets={sortedTimesheets}
            loading={loading}
            page={page}
            totalPages={totalPages}
            total={total}
            pageSize={pageSize}
            pageSizeOptions={pageSizeOptions}
            onPageSizeChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              setPageSize(Number(e.target.value))
            }
            onPageChange={setPage}
          />
        </Holds>
      </Holds>
    </div>
  );
}
