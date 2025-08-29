import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { EditMaintenanceLogs } from "./EditMaintenanceLogs";
import { EditTruckingLogs } from "./EditTruckingLogs";
import { EditTascoLogs } from "./EditTascoLogs";
import { EditEmployeeEquipmentLogs } from "./EditEmployeeEquipmentLogs";
import { adminUpdateTimesheet } from "@/actions/records-timesheets";
import EditGeneralSection from "./EditGeneralSection";
import { SquareCheck, SquareXIcon, X } from "lucide-react";
import { isMaintenanceLogComplete } from "./utils/validation";
import {
  EditTimesheetModalProps,
  TimesheetData,
  useTimesheetData,
} from "./hooks/useTimesheetData";
import { useTimesheetLogs } from "./hooks/useTimesheetLogs";
import { toast } from "sonner";

export const EditTimesheetModal: React.FC<EditTimesheetModalProps> = ({
  timesheetId,
  isOpen,
  onClose,
  onUpdated,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<TimesheetData | null>(null);
  const [originalForm, setOriginalForm] = useState<TimesheetData | null>(null);

  // Fetch dropdown and related data
  const {
    users,
    jobsites,
    costCodes,
    equipment,
    trucks,
    trailers,
    materialTypes,
  } = useTimesheetData(form);

  // Log handlers
  const logs = useTimesheetLogs(form, setForm, originalForm);

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

  // Submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;
    try {
      setLoading(true);
      setError(null);
      const formData = new FormData();
      formData.append("id", timesheetId.toString());
      formData.append("data", JSON.stringify(form)); // 'form' is your TimesheetData object
      await adminUpdateTimesheet(formData);
      if (onUpdated) onUpdated();
      onClose();
      toast.success("Timesheet updated successfully");
    } catch (error) {
      toast.error(`Failed to update timesheet ${form.id}`);
      setError("Failed to update timesheet in admin records.");
    } finally {
      setLoading(false);
    }
  };

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
                truckNumber: "",
                trailerNumber: "",
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
  }, [form?.workType]);

  // Map dropdown data to { value, label } for child components
  const userOptions = users.map((u) => ({
    value: u.id,
    label: `${u.firstName} ${u.lastName}`,
  }));
  const jobsiteOptions = jobsites.map((j) => ({ value: j.id, label: j.name }));
  const costCodeOptions = costCodes.map((c) => ({
    value: c.value,
    label: c.label,
  }));
  const equipmentOptions = equipment.map((e) => ({
    value: e.id,
    label: e.name,
  }));

  const truckOptions = trucks.map((e) => ({
    value: e.id,
    label: e.name,
  }));

  const trailerOptions = trailers.map((e) => ({
    value: e.id,
    label: e.name,
  }));
  // If materialTypes come as string ids, map to number if needed
  const mappedMaterialTypes = materialTypes.map((m) => ({
    ...m,
    id: Number(m.id),
  }));

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg min-w-[700px]  max-h-[80vh] overflow-y-auto no-scrollbar">
        {error && (
          <div className=" text-xs text-red-600 mb-2 bg-red-400 bg-opacity-20 px-6 py-4 rounded max-w-[700px]">
            <span className="font-bold">Error:</span> {error}
          </div>
        )}
        <div className="p-6">
          <div className="mb-4 relative">
            <Button
              type="button"
              variant={"ghost"}
              size={"icon"}
              onClick={onClose}
              className="absolute top-0 right-0 cursor-pointer"
            >
              <X width={20} height={20} />
            </Button>
            <h2 className="text-xl font-bold">Edit Timesheet</h2>
            <p className="text-xs text-gray-600">Timesheet ID: {timesheetId}</p>
          </div>
          {loading && <div className="text-gray-500">Loading...</div>}
          {form && (
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <EditGeneralSection
                form={form}
                setForm={setForm}
                userOptions={userOptions}
                jobsiteOptions={jobsiteOptions}
                costCodeOptions={costCodeOptions}
                users={users}
                jobsites={jobsites}
                originalForm={originalForm}
                handleChange={logs.handleChange}
                handleUndoField={logs.handleUndoField}
                workTypeOptions={workTypeOptions}
              />
              {/* Related logs - conditional rendering by workType */}

              {showMaintenance && (
                <EditMaintenanceLogs
                  maintenanceOptions={equipmentOptions}
                  logs={form.MaintenanceLogs}
                  onLogChange={(idx, field, value) =>
                    logs.handleLogChange("MaintenanceLogs", idx, field, value)
                  }
                  onAddLog={logs.addMaintenanceLog}
                  onRemoveLog={logs.removeMaintenanceLog}
                  originalLogs={originalForm?.MaintenanceLogs || []}
                  disableAdd={
                    form.MaintenanceLogs.length > 0 &&
                    !isMaintenanceLogComplete(
                      form.MaintenanceLogs[form.MaintenanceLogs.length - 1],
                    )
                  }
                />
              )}

              {showTrucking && (
                <EditTruckingLogs
                  logs={form.TruckingLogs}
                  onLogChange={(idx, field, value) =>
                    logs.handleLogChange("TruckingLogs", idx, field, value)
                  }
                  handleNestedLogChange={(
                    logIndex,
                    nestedType,
                    nestedIndex,
                    field,
                    value,
                  ) =>
                    logs.handleNestedLogChange(
                      "TruckingLogs",
                      logIndex,
                      nestedType,
                      nestedIndex,
                      field,
                      value,
                    )
                  }
                  truckOptions={truckOptions}
                  trailerOptions={trailerOptions}
                  equipmentOptions={equipmentOptions}
                  jobsiteOptions={jobsiteOptions}
                  addEquipmentHauled={logs.addEquipmentHauled}
                  deleteEquipmentHauled={logs.deleteEquipmentHauled}
                  addMaterial={logs.addMaterial}
                  deleteMaterial={logs.deleteMaterial}
                  addRefuelLog={logs.addRefuelLog}
                  deleteRefuelLog={logs.deleteRefuelLog}
                  addStateMileage={logs.addStateMileage}
                  deleteStateMileage={logs.deleteStateMileage}
                  originalLogs={originalForm?.TruckingLogs || []}
                  onUndoLogField={logs.handleUndoTruckingLogField}
                  onUndoNestedLogField={logs.handleUndoTruckingNestedField}
                />
              )}
              {showTasco && (
                <EditTascoLogs
                  equipmentOptions={equipmentOptions}
                  materialTypes={mappedMaterialTypes}
                  logs={form.TascoLogs}
                  onLogChange={(idx, field, value) =>
                    logs.handleLogChange("TascoLogs", idx, field, value)
                  }
                  handleNestedLogChange={logs.handleTascoNestedLogChange}
                  addTascoRefuelLog={logs.addTascoRefuelLog}
                  deleteTascoRefuelLog={logs.deleteTascoRefuelLog}
                  originalLogs={originalForm?.TascoLogs || []}
                  onUndoLogField={logs.handleUndoTascoLogField}
                />
              )}
              {showEquipment && (
                <EditEmployeeEquipmentLogs
                  equipmentOptions={equipmentOptions}
                  logs={form.EmployeeEquipmentLogs}
                  onLogChange={(idx, field, value) =>
                    logs.handleLogChange(
                      "EmployeeEquipmentLogs",
                      idx,
                      field,
                      value,
                    )
                  }
                  onAddLog={logs.addEmployeeEquipmentLog}
                  onRemoveLog={logs.removeEmployeeEquipmentLog}
                  originalLogs={originalForm?.EmployeeEquipmentLogs || []}
                />
              )}
              {/* Actions */}
              <div className="col-span-2 flex justify-end gap-2 mt-4">
                {originalForm && originalForm.status === "PENDING" && (
                  <>
                    <Button
                      type="button"
                      variant="outline"
                      className={`bg-red-200 hover:bg-red-300 text-red-800 px-4 py-2 rounded ${
                        form.status !== "REJECTED"
                          ? "bg-opacity-50 "
                          : " border-red-800 hover:border-red-900 border-2"
                      }`}
                      onClick={() => setForm({ ...form, status: "REJECTED" })}
                      disabled={loading}
                    >
                      {form.status === "REJECTED" ? "" : "Reject Timesheet"}
                      {form.status === "REJECTED" && (
                        <SquareXIcon className="text-red-800" />
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className={`bg-green-400 hover:bg-green-300 text-green-800 px-4 py-2 rounded ${
                        form.status !== "APPROVED"
                          ? "bg-opacity-50 "
                          : " border-green-800 hover:border-green-900 border-2"
                      }`}
                      onClick={() => setForm({ ...form, status: "APPROVED" })}
                      disabled={loading}
                    >
                      <div className="flex flex-row items-center gap-2">
                        {form.status === "APPROVED" ? `` : "Approve Timesheet"}
                        {form.status === "APPROVED" && (
                          <SquareCheck className="text-green-800" />
                        )}
                      </div>
                    </Button>
                  </>
                )}

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
                  className={`bg-sky-500 hover:bg-sky-400 text-white px-4 py-2 rounded ${
                    loading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={loading}
                  title={
                    loading
                      ? "Please complete all required fields in the logs before submitting."
                      : ""
                  }
                >
                  {loading
                    ? "Saving..."
                    : `Save${
                        originalForm &&
                        originalForm.status === "PENDING" &&
                        form.status === "APPROVED"
                          ? " & Approve"
                          : originalForm &&
                              originalForm.status === "PENDING" &&
                              form.status === "REJECTED"
                            ? " & Reject "
                            : ""
                      }`}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
