"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { MaintenanceSection } from "./MaintenanceSection";
import { TruckingSection } from "./TruckingSection";
import { TascoSection } from "./TascoSection";
import { LaborSection } from "./LaborSection";
import GeneralSection from "./GeneralSection";
import { adminCreateTimesheet } from "@/actions/records-timesheets";

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
      equipmentHauled: [
        { equipment: { id: "", name: "" }, jobsite: { id: "", name: "" } },
      ],
      materials: [],
      refuelLogs: [{ gallonsRefueled: "", milesAtFueling: "" }],
      stateMileages: [{ state: "", stateLineMileage: "" }],
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
      refuelLogs: [{ gallonsRefueled: "" }],
      equipment: [{ id: "", name: "" }],
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

  const fetchMaterialTypes = async () => {
    try {
      const res = await fetch("/api/getMaterialTypes");
      if (!res.ok) throw new Error("Failed to fetch material types");
      const data = await res.json();
      setMaterialTypes(data);
    } catch (error) {
      console.error(error);
      setMaterialTypes([]);
    }
  };

  const handleChange = async (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    // If the field is costcode and not using the Combobox, update as string fallback
    if (e.target.name === "costcode") {
      setForm({ ...form, costcode: { id: "", name: e.target.value } });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const data = {
      form,
      maintenanceLogs,
      truckingLogs,
      tascoLogs,
      laborLogs,
    };
    await adminCreateTimesheet(data);
    setSubmitting(false);
    onClose();
  };

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
          <GeneralSection
            form={form}
            setForm={setForm}
            handleChange={handleChange}
            userOptions={userOptions}
            jobsiteOptions={jobsiteOptions}
            costCodeOptions={costCodeOptions}
            workTypeOptions={workTypeOptions}
            datePickerOpen={datePickerOpen}
            setDatePickerOpen={setDatePickerOpen}
            users={users}
            jobsites={jobsites}
          />

          {/* Conditional log sections */}
          {form.workType === "MECHANIC" && (
            <MaintenanceSection
              maintenanceLogs={maintenanceLogs}
              setMaintenanceLogs={setMaintenanceLogs}
              maintenanceEquipmentOptions={maintenanceEquipmentOptions}
            />
          )}
          {form.workType === "TRUCK_DRIVER" && (
            <TruckingSection
              truckingLogs={truckingLogs}
              setTruckingLogs={setTruckingLogs}
              equipmentOptions={equipmentOptions}
              jobsiteOptions={jobsiteOptions}
            />
          )}
          {form.workType === "TASCO" && (
            <TascoSection
              tascoLogs={tascoLogs}
              setTascoLogs={setTascoLogs}
              materialTypes={materialTypes}
              equipmentOptions={equipmentOptions}
            />
          )}
          {form.workType === "LABOR" && (
            <LaborSection
              laborLogs={laborLogs}
              setLaborLogs={setLaborLogs}
              equipmentOptions={equipmentOptions}
            />
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
