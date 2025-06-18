"use client";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Combobox } from "@/components/ui/combobox";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

export function CreateTimesheetModal({
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
  const [materialTypes, setMaterialTypes] = useState<
    { id: string; name: string }[]
  >([]);
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
  type TruckingMaterialDraft = {
    location: string;
    name: string;
    materialWeight: string;
    lightWeight: string;
    grossWeight: string;
    loadType: "screened" | "unscreened" | "";
  };
  type TruckingLogDraft = {
    equipmentId: string;
    startingMileage: string;
    endingMileage: string;
    equipmentHauled: {
      equipment: { id: string; name: string };
      jobsite: { id: string; name: string };
    }[];
    materials: TruckingMaterialDraft[];
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
  // Tasco log type
  type TascoLogDraft = {
    shiftType: "ABCD Shift" | "E Shift" | "F Shift" | "";
    laborType: "Equipment Operator" | "Labor" | "";
    materialType: string; // id from materialTypes
    loadQuantity: string;
    refuelLogs: { gallonsRefueled: string }[];
    equipment: { id: string; name: string }[];
  };
  const [tascoLogs, setTascoLogs] = useState<TascoLogDraft[]>([
    {
      shiftType: "",
      laborType: "",
      materialType: "",
      loadQuantity: "",
      refuelLogs: [],
      equipment: [],
    },
  ]);
  // Labor log type
  type LaborLogDraft = {
    equipment: { id: string; name: string };
    startTime: string;
    endTime: string;
  };
  const [laborLogs, setLaborLogs] = useState<LaborLogDraft[]>([
    { equipment: { id: "", name: "" }, startTime: "", endTime: "" },
  ]);

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

  async function fetchMaterialTypes() {
    try {
      const res = await fetch("/api/getMaterialTypes");
      if (!res.ok) throw new Error("Failed to fetch material types");
      const data = await res.json();
      setMaterialTypes(data);
    } catch (error) {
      console.error(error);
      setMaterialTypes([]);
    }
  }

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
    // const result = await createTimesheet({
    //   ...form,
    //   maintenanceLogs,
    //   truckingLogs,
    //   tascoLogs,
    //   equipmentLogs,
    // });
    // onSubmit(result);
    setSubmitting(false);
    onClose();
  }

  // Fetch material types and equipment when TASCO is selected
  useEffect(() => {
    if (form.workType === "TASCO") {
      fetchMaterialTypes();
      // Optionally re-fetch equipment if needed
      if (equipment.length === 0) {
        fetch("/api/getAllEquipment").then(async (res) => {
          if (res.ok) setEquipment(await res.json());
        });
      }
    }
  }, [form.workType]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg p-6 min-w-[800px] max-h-[90vh] overflow-y-auto">
        <div className="mb-4">
          <h2 className="text-xl font-bold ">Submit a New Timesheet</h2>
          <p className="text-sm mb-1 text-gray-600">
            Use the form below to enter and submit a new timesheet on behalf of
            an employee.
            <br /> Ensure all required fields are accurate for payroll and
            recordkeeping purposes.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          {/* Date */}
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
          {/* User */}
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
          {/* Jobsite */}
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
          {/* Costcode */}
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
          {/* start time */}
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
          {/* end time */}
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
          {/* work type */}
          <div className="mb-4">
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
            <div className="col-span-2 border-t-2 border-black pt-4 pb-2">
              <div className="mb-4">
                <h3 className="font-semibold text-xl mb-1">
                  Additional Maintenance Details
                </h3>
                <p className="text-sm text-gray-600">
                  Fill out the additional details for this timesheet to report
                  more accurate maintenance logs.
                </p>
              </div>
              {maintenanceLogs.map((log, idx) => (
                <div
                  key={idx}
                  className="flex flex-col gap-6 mb-4 border-b pb-4"
                >
                  <div className="flex gap-4 items-end py-2">
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
                      placeholder="Start Time"
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
                      placeholder="End Time"
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
                      size="icon"
                      onClick={() =>
                        setMaintenanceLogs(
                          maintenanceLogs.filter((_, i) => i !== idx)
                        )
                      }
                    >
                      <img src="/trash.svg" alt="Delete" className="w-4 h-4" />
                    </Button>
                  </div>
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
            <div className="col-span-2 border-t-2 border-black pt-4 pb-2">
              <div className="mb-4">
                <h3 className="font-semibold text-xl mb-1">
                  Additional Trucking Details
                </h3>
                <p className="text-sm text-gray-600">
                  Fill out the additional details for this timesheet to report
                  more accurate trucking logs.
                </p>
              </div>
              {truckingLogs.map((log, idx) => (
                <div
                  key={idx}
                  className="flex flex-col gap-6 mb-4 border-b pb-4"
                >
                  <div className="flex gap-4 items-end py-2">
                    <Combobox
                      options={equipmentOptions}
                      value={log.equipmentId}
                      onChange={(val, option) => {
                        const updated = [...truckingLogs];
                        updated[idx].equipmentId = val;
                        setTruckingLogs(updated);
                      }}
                      placeholder={`Select Vehicle*`}
                      filterKeys={["label", "value"]}
                    />
                    <Input
                      type="number"
                      placeholder="Beginning Mileage*"
                      value={log.startingMileage}
                      onChange={(e) => {
                        const updated = [...truckingLogs];
                        updated[idx].startingMileage = e.target.value;
                        setTruckingLogs(updated);
                      }}
                      className="w-[200px]"
                    />
                    <Input
                      type="number"
                      placeholder="End Mileage*"
                      value={log.endingMileage}
                      onChange={(e) => {
                        const updated = [...truckingLogs];
                        updated[idx].endingMileage = e.target.value;
                        setTruckingLogs(updated);
                      }}
                      className="w-[200px]"
                    />
                  </div>
                  {/* Equipment Hauled */}
                  <div className="py-4 border-b mb-2">
                    <div className="flex flex-row justify-between items-center mb-2">
                      <label className="block font-semibold text-md">
                        Equipment Hauled
                      </label>
                      <div className="flex justify-end">
                        <Button
                          size="icon"
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
                          <img
                            src="/plus-white.svg"
                            alt="add"
                            className="w-4 h-4"
                          />
                        </Button>
                      </div>
                    </div>
                    {log.equipmentHauled.map((eq, eqIdx) => (
                      <div key={eqIdx} className="flex gap-4 mb-2">
                        <Combobox
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
                          size="icon"
                          onClick={() => {
                            const updated = [...truckingLogs];
                            updated[idx].equipmentHauled = updated[
                              idx
                            ].equipmentHauled.filter((_, i) => i !== eqIdx);
                            setTruckingLogs(updated);
                          }}
                        >
                          <img
                            src="/trash.svg"
                            alt="remove"
                            className="w-4 h-4"
                          />
                        </Button>
                      </div>
                    ))}
                  </div>
                  {/* Materials */}
                  <div className="py-4 border-b mb-2">
                    <div className="flex flex-row justify-between items-center mb-2">
                      <label className="block font-semibold text-md ">
                        Materials
                      </label>
                      <Button
                        size="icon"
                        type="button"
                        onClick={() => {
                          const updated = [...truckingLogs];
                          updated[idx].materials.push({
                            location: "",
                            name: "",
                            materialWeight: "",
                            lightWeight: "",
                            grossWeight: "",
                            loadType: "",
                          });
                          setTruckingLogs(updated);
                        }}
                      >
                        <img
                          src="/plus-white.svg"
                          alt="add"
                          className="w-4 h-4"
                        />
                      </Button>
                    </div>
                    {log.materials.map((mat, matIdx) => (
                      <div key={matIdx} className="mt-2 ">
                        <div className="flex flex-row gap-4 mb-2">
                          <Input
                            type="text"
                            placeholder="Location"
                            value={mat.location}
                            onChange={(e) => {
                              const updated = [...truckingLogs];
                              updated[idx].materials[matIdx].location =
                                e.target.value;
                              setTruckingLogs(updated);
                            }}
                            className="w-[200px]"
                          />
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
                          <Input
                            type="number"
                            placeholder="Material Weight"
                            value={mat.materialWeight}
                            onChange={(e) => {
                              const updated = [...truckingLogs];
                              updated[idx].materials[matIdx].materialWeight =
                                e.target.value;
                              setTruckingLogs(updated);
                            }}
                            className="w-[200px]"
                          />
                        </div>
                        <div className="flex flex-row gap-4 mb-2">
                          <Input
                            type="number"
                            placeholder="Light Weight"
                            value={mat.lightWeight}
                            onChange={(e) => {
                              const updated = [...truckingLogs];
                              updated[idx].materials[matIdx].lightWeight =
                                e.target.value;
                              setTruckingLogs(updated);
                            }}
                            className="w-[200px]"
                          />
                          <Input
                            type="number"
                            placeholder="Gross Weight"
                            value={mat.grossWeight}
                            onChange={(e) => {
                              const updated = [...truckingLogs];
                              updated[idx].materials[matIdx].grossWeight =
                                e.target.value;
                              setTruckingLogs(updated);
                            }}
                            className="w-[200px]"
                          />
                          <Select
                            value={mat.loadType}
                            onValueChange={(val) => {
                              const updated = [...truckingLogs];
                              updated[idx].materials[matIdx].loadType = val as
                                | "screened"
                                | "unscreened";
                              setTruckingLogs(updated);
                            }}
                          >
                            <SelectTrigger className="w-[200px]">
                              <SelectValue placeholder="Load Type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="screened">Screened</SelectItem>
                              <SelectItem value="unscreened">
                                Unscreened
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <div className="flex justify-end ">
                            <Button
                              type="button"
                              size="icon"
                              variant="destructive"
                              onClick={() => {
                                const updated = [...truckingLogs];
                                updated[idx].materials = updated[
                                  idx
                                ].materials.filter((_, i) => i !== matIdx);
                                setTruckingLogs(updated);
                              }}
                            >
                              <img
                                src="/trash.svg"
                                alt="remove"
                                className="w-4 h-4"
                              />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* Refuel Logs */}
                  <div className="py-4 border-b mb-2">
                    <div className="flex flex-row justify-between items-center mb-2">
                      <label className="block font-semibold text-md">
                        Refuel Logs
                      </label>
                      <Button
                        type="button"
                        size="icon"
                        onClick={() => {
                          const updated = [...truckingLogs];
                          updated[idx].refuelLogs.push({
                            gallonsRefueled: "",
                            milesAtFueling: "",
                          });
                          setTruckingLogs(updated);
                        }}
                      >
                        <img
                          src="/plus-white.svg"
                          alt="add"
                          className="w-4 h-4"
                        />
                      </Button>
                    </div>
                    {log.refuelLogs.map((ref, refIdx) => (
                      <div key={refIdx} className="flex gap-4 mb-2 items-end">
                        <Input
                          type="number"
                          placeholder="Total Gallons"
                          value={ref.gallonsRefueled}
                          onChange={(e) => {
                            const updated = [...truckingLogs];
                            updated[idx].refuelLogs[refIdx].gallonsRefueled =
                              e.target.value;
                            setTruckingLogs(updated);
                          }}
                          className="w-[200px]"
                        />
                        <Input
                          type="number"
                          placeholder="Current Mileage"
                          value={ref.milesAtFueling}
                          onChange={(e) => {
                            const updated = [...truckingLogs];
                            updated[idx].refuelLogs[refIdx].milesAtFueling =
                              e.target.value;
                            setTruckingLogs(updated);
                          }}
                          className="w-[200px]"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          onClick={() => {
                            const updated = [...truckingLogs];
                            updated[idx].refuelLogs = updated[
                              idx
                            ].refuelLogs.filter((_, i) => i !== refIdx);
                            setTruckingLogs(updated);
                          }}
                        >
                          <img
                            src="/trash.svg"
                            alt="remove"
                            className="w-4 h-4"
                          />
                        </Button>
                      </div>
                    ))}
                  </div>
                  {/* State Line Mileage */}
                  <div className="py-4 border-b mb-2">
                    <div className="flex flex-row justify-between items-center mb-2">
                      <label className="block font-semibold text-md">
                        State Line Mileage
                      </label>
                      <Button
                        type="button"
                        size="icon"
                        onClick={() => {
                          const updated = [...truckingLogs];
                          updated[idx].stateMileages.push({
                            state: "",
                            stateLineMileage: "",
                          });
                          setTruckingLogs(updated);
                        }}
                        className="ml-2"
                      >
                        <img
                          src="/plus-white.svg"
                          alt="add"
                          className="w-4 h-4"
                        />
                      </Button>
                    </div>
                    {log.stateMileages.map((sm, smIdx) => (
                      <div key={smIdx} className="flex gap-4 mb-2 items-end">
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
                          className="w-[200px]"
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
                          className="w-[200px]"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          onClick={() => {
                            const updated = [...truckingLogs];
                            updated[idx].stateMileages = updated[
                              idx
                            ].stateMileages.filter((_, i) => i !== smIdx);
                            setTruckingLogs(updated);
                          }}
                          className="ml-2"
                        >
                          <img
                            src="/trash.svg"
                            alt="remove"
                            className="w-4 h-4"
                          />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
          {form.workType === "TASCO" && (
            <div className="col-span-2 border-t-2 border-black pt-4 pb-2">
              <div className="mb-4">
                <h3 className="font-semibold text-xl mb-1">
                  Additional Tasco Details
                </h3>
                <p className="text-sm text-gray-600">
                  Fill out the additional details for this timesheet to report
                  more accurate Tasco logs.
                </p>
              </div>
              {tascoLogs.map((log, idx) => (
                <div key={idx} className="flex flex-col gap-6 mb-4  pb-4">
                  <div className="flex gap-4 items-end py-2">
                    <Select
                      value={log.shiftType}
                      onValueChange={(val) => {
                        const updated = [...tascoLogs];
                        updated[idx].shiftType =
                          val as TascoLogDraft["shiftType"];
                        setTascoLogs(updated);
                      }}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Shift Type*" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ABCD Shift">ABCD Shift</SelectItem>
                        <SelectItem value="E Shift">E Shift</SelectItem>
                        <SelectItem value="F Shift">F Shift</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select
                      value={log.laborType}
                      onValueChange={(val) => {
                        const updated = [...tascoLogs];
                        updated[idx].laborType =
                          val as TascoLogDraft["laborType"];
                        setTascoLogs(updated);
                      }}
                    >
                      <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Labor Type*" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Equipment Operator">
                          Equipment Operator
                        </SelectItem>
                        <SelectItem value="Labor">Labor</SelectItem>
                      </SelectContent>
                    </Select>
                    <Combobox
                      options={materialTypes.map((m) => ({
                        value: m.id,
                        label: m.name,
                      }))}
                      value={log.materialType}
                      onChange={(val) => {
                        const updated = [...tascoLogs];
                        updated[idx].materialType = val;
                        setTascoLogs(updated);
                      }}
                      placeholder="Material Type*"
                    />
                    <Input
                      type="number"
                      placeholder="Load Quantity*"
                      value={log.loadQuantity}
                      onChange={(e) => {
                        const updated = [...tascoLogs];
                        updated[idx].loadQuantity = e.target.value;
                        setTascoLogs(updated);
                      }}
                      className="w-[140px]"
                    />
                  </div>
                  {/* Equipment selection */}
                  <div className="py-4 border-b mb-2">
                    <div className="flex flex-row justify-between items-center mb-2">
                      <label className="block font-semibold text-md">
                        Equipment
                      </label>
                      <Button
                        type="button"
                        size="icon"
                        onClick={() => {
                          const updated = [...tascoLogs];
                          updated[idx].equipment.push({ id: "", name: "" });
                          setTascoLogs(updated);
                        }}
                      >
                        <img
                          src="/plus-white.svg"
                          alt="add"
                          className="w-4 h-4"
                        />
                      </Button>
                    </div>
                    <div className="flex gap-2 flex-wrap mb-2">
                      {log.equipment.map((eq, eqIdx) => (
                        <div
                          key={eq.id || eqIdx}
                          className="flex gap-1 items-center"
                        >
                          <Combobox
                            options={equipmentOptions}
                            value={eq.id}
                            onChange={(val, option) => {
                              const updated = [...tascoLogs];
                              updated[idx].equipment[eqIdx] = option
                                ? { id: option.value, name: option.label }
                                : { id: "", name: "" };
                              setTascoLogs(updated);
                            }}
                            placeholder="Select equipment"
                          />
                          <Button
                            type="button"
                            size="icon"
                            variant="destructive"
                            onClick={() => {
                              const updated = [...tascoLogs];
                              updated[idx].equipment = updated[
                                idx
                              ].equipment.filter((_, i) => i !== eqIdx);
                              setTascoLogs(updated);
                            }}
                          >
                            <img
                              src="/trash.svg"
                              alt="remove"
                              className="w-4 h-4"
                            />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* Refuel Logs */}
                  <div className="py-4 border-b mb-2">
                    <div className="flex flex-row justify-between items-center mb-2">
                      <label className="block font-semibold text-md">
                        Refuel Logs
                      </label>
                      <Button
                        type="button"
                        size="icon"
                        onClick={() => {
                          const updated = [...tascoLogs];
                          updated[idx].refuelLogs.push({
                            gallonsRefueled: "",
                          });
                          setTascoLogs(updated);
                        }}
                      >
                        <img
                          src="/plus-white.svg"
                          alt="add"
                          className="w-4 h-4"
                        />
                      </Button>
                    </div>
                    {log.refuelLogs.map((ref, refIdx) => (
                      <div key={refIdx} className="flex gap-4 mb-2 items-end">
                        <Input
                          type="number"
                          placeholder="Gallons Refueled"
                          value={ref.gallonsRefueled}
                          onChange={(e) => {
                            const updated = [...tascoLogs];
                            updated[idx].refuelLogs[refIdx].gallonsRefueled =
                              e.target.value;
                            setTascoLogs(updated);
                          }}
                          className="w-[140px]"
                        />

                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          onClick={() => {
                            const updated = [...tascoLogs];
                            updated[idx].refuelLogs = updated[
                              idx
                            ].refuelLogs.filter((_, i) => i !== refIdx);
                            setTascoLogs(updated);
                          }}
                        >
                          <img
                            src="/trash.svg"
                            alt="remove"
                            className="w-4 h-4"
                          />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
          {form.workType === "LABOR" && (
            <div className="col-span-2 border-t-2 border-black pt-4 pb-2">
              <div className="mb-4">
                <h3 className="font-semibold text-xl mb-1">
                  Additional Labor Details
                </h3>
                <p className="text-sm text-gray-600">
                  Fill out the additional details for this timesheet to report
                  more accurate labor logs.
                </p>
              </div>
              {laborLogs.map((log, idx) => (
                <div
                  key={idx}
                  className="flex gap-4 items-end py-2 mb-4 border-b pb-4"
                >
                  <Combobox
                    options={equipmentOptions}
                    value={log.equipment.id}
                    onChange={(val, option) => {
                      const updated = [...laborLogs];
                      updated[idx].equipment = option
                        ? { id: option.value, name: option.label }
                        : { id: "", name: "" };
                      setLaborLogs(updated);
                    }}
                    placeholder="Select Equipment"
                  />
                  <Input
                    type="time"
                    placeholder="Start Time"
                    value={log.startTime}
                    onChange={(e) => {
                      const updated = [...laborLogs];
                      updated[idx].startTime = e.target.value;
                      setLaborLogs(updated);
                    }}
                    className="w-[120px]"
                  />
                  <Input
                    type="time"
                    placeholder="End Time"
                    value={log.endTime}
                    onChange={(e) => {
                      const updated = [...laborLogs];
                      updated[idx].endTime = e.target.value;
                      setLaborLogs(updated);
                    }}
                    className="w-[120px]"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={() =>
                      setLaborLogs(laborLogs.filter((_, i) => i !== idx))
                    }
                  >
                    <img src="/trash.svg" alt="Delete" className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                onClick={() =>
                  setLaborLogs([
                    ...laborLogs,
                    {
                      equipment: { id: "", name: "" },
                      startTime: "",
                      endTime: "",
                    },
                  ])
                }
              >
                Add Labor Log
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
