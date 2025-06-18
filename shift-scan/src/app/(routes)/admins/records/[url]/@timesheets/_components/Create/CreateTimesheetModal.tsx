import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Combobox } from "@/components/ui/combobox";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import MaintenanceLogsSection from "./MaintenanceLogsSection";
import TruckingLogsSection from "./TruckingLogsSection";
import TascoLogsSection from "./TascoLogsSection";
import EquipmentLogsSection from "./EquipmentLogsSection";

export type MaintenanceLogDraft = {
  startTime: string;
  endTime: string;
  equipmentId: string;
  equipmentName: string;
};
export type TruckingLogDraft = {
  equipmentId: string;
  startingMileage: string;
  endingMileage: string;
  equipmentHauled: string[];
  materials: { name: string }[];
  refuelLogs: { gallonsRefueled: string; milesAtFueling: string }[];
  stateMileages: { state: string; stateLineMileage: string }[];
};

export default function CreateTimesheetModal({
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
  const [submitting, setSubmitting] = useState(false);
  const [datePickerOpen, setDatePickerOpen] = useState(false);

  // Log states
  const [maintenanceLogs, setMaintenanceLogs] = useState<MaintenanceLogDraft[]>(
    [{ startTime: "", endTime: "", equipmentId: "", equipmentName: "" }]
  );
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

  // Equipment/project options for maintenance/trucking logs
  const [mechanicEquipmentOptions, setMechanicEquipmentOptions] = useState<
    { value: string; label: string }[]
  >([]);
  useEffect(() => {
    async function fetchEquipment() {
      try {
        const res = await fetch("/api/getMechanicProjectSummary");
        if (!res.ok) return setMechanicEquipmentOptions([]);
        const data = await res.json();
        const options = data
          .filter((m: any) => m.Equipment && m.Equipment.name)
          .map((m: any) => ({
            value: m.Equipment.id,
            label: m.Equipment.name,
          }));
        setMechanicEquipmentOptions(options);
      } catch {
        setMechanicEquipmentOptions([]);
      }
    }
    fetchEquipment();
  }, []);

  // Helper to map users/jobsites to combobox options
  const userOptions = users.map((u) => ({
    value: u.id,
    label: `${u.firstName} ${u.lastName}`,
  }));
  const jobsiteOptions = jobsites.map((j) => ({ value: j.id, label: j.name }));
  const costCodeOptions = costCode.map((c) => ({
    value: c.value,
    label: c.label,
  }));
  const workTypeOptions = [
    { value: "MECHANIC", label: "Mechanic" },
    { value: "TRUCK_DRIVER", label: "Trucking" },
    { value: "LABOR", label: "General" },
    { value: "TASCO", label: "Tasco" },
  ];

  useEffect(() => {
    async function fetchDropdowns() {
      const usersRes = await fetch("/api/getAllActiveEmployeeName");
      const jobsitesRes = await fetch("/api/getJobsiteSummary");
      const jobsite = await jobsitesRes.json();
      const filteredJobsite = jobsite.filter(
        (j: { approvalStatus: string }) => j.approvalStatus === "APPROVED"
      );
      const filteredJobsites = filteredJobsite.map(
        (j: { id: string; name: string }) => ({ id: j.id, name: j.name })
      );
      setUsers(await usersRes.json());
      setJobsites(filteredJobsites);
    }
    fetchDropdowns();
  }, []);

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
    if (e.target.name === "costcode") {
      setForm({ ...form, costcode: { id: "", name: e.target.value } });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    const result = {
      ...form,
      maintenanceLogs,
      truckingLogs,
      tascoLogs,
      equipmentLogs,
    };
    onSubmit(result);
    setSubmitting(false);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg p-6 min-w-[800px] max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-bold mb-4">Create New Timesheet</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          {/* ...date, user, jobsite, costcode, start/end time, workType fields... */}
          {/* ...existing code for main fields... */}
          {form.workType === "MECHANIC" && (
            <MaintenanceLogsSection
              logs={maintenanceLogs}
              setLogs={setMaintenanceLogs}
              equipmentOptions={mechanicEquipmentOptions}
            />
          )}
          {form.workType === "TRUCK_DRIVER" && (
            <TruckingLogsSection
              logs={truckingLogs}
              setLogs={setTruckingLogs}
              equipmentOptions={mechanicEquipmentOptions}
            />
          )}
          {form.workType === "TASCO" && (
            <TascoLogsSection logs={tascoLogs} setLogs={setTascoLogs} />
          )}
          {form.workType === "LABOR" && (
            <EquipmentLogsSection
              logs={equipmentLogs}
              setLogs={setEquipmentLogs}
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
