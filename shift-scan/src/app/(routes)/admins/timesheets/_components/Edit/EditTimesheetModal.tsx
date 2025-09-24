import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EditMaintenanceLogs } from "./EditMaintenanceLogs";
import { EditTruckingLogs } from "./EditTruckingLogs";
import { EditTascoLogs } from "./EditTascoLogs";
import { EditEmployeeEquipmentLogs } from "./EditEmployeeEquipmentLogs";
import {
  adminSetNotificationToRead,
  adminUpdateTimesheet,
} from "@/actions/records-timesheets";
import EditGeneralSection from "./EditGeneralSection";
import { SquareCheck, SquareXIcon, X, ClockIcon } from "lucide-react";
import { isMaintenanceLogComplete } from "./utils/validation";
import {
  EditTimesheetModalProps,
  TimesheetData,
  useTimesheetData,
} from "./hooks/useTimesheetData";
import { useTimesheetLogs } from "./hooks/useTimesheetLogs";
import { toast } from "sonner";
import { TimeSheetHistory } from "./TimeSheetHistory";
import { useSession } from "next-auth/react";
import { Textarea } from "@/components/ui/textarea";
import { useDashboardData } from "../../../_pages/sidebar/DashboardDataContext";
import { parse } from "path";
import { set } from "lodash";

// Define types for change logs
interface ChangeLogEntry {
  id: string;
  changedBy: string;
  changedAt: string | Date;
  changes: Record<string, { old: unknown; new: unknown }>;
  changeReason?: string;
  User?: {
    firstName: string;
    lastName: string;
  };
}

export const EditTimesheetModal: React.FC<EditTimesheetModalProps> = ({
  timesheetId,
  isOpen,
  onClose,
  onUpdated,
  notificationIds,
  setNotificationIds,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<TimesheetData | null>(null);
  const [originalForm, setOriginalForm] = useState<TimesheetData | null>(null);
  const [changeLogs, setChangeLogs] = useState<ChangeLogEntry[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [changeReason, setChangeReason] = useState("");
  const { data: session } = useSession();
  const { refresh } = useDashboardData();

  const editor = session?.user?.id;

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

    // Fetch timesheet data
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

    // Fetch change logs separately
    fetch(`/api/getTimesheetChangeLogs?timeSheetId=${timesheetId}`)
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to fetch change logs");
        return res.json();
      })
      .then((json) => {
        setChangeLogs(json);
      })
      .catch((e) => {
        console.error("Error fetching change logs:", e);
        // Don't set the error state for this, as it's not critical
      });
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
    if (!form || !originalForm) return;

    // Validate that a change reason is provided
    if (!changeReason.trim()) {
      toast.error("Please provide a reason for the changes", {
        duration: 3000,
      });
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Generate changes record by comparing original form with current form
      const changes: Record<string, { old: unknown; new: unknown }> = {};
      let wasStatusChanged = false;
      let numberOfChanges = 0;

      // Check basic fields
      if (form.startTime !== originalForm.startTime) {
        changes["startTime"] = {
          old: originalForm.startTime,
          new: form.startTime,
        };
        numberOfChanges++;
      }

      if (form.endTime !== originalForm.endTime) {
        changes["endTime"] = {
          old: originalForm.endTime,
          new: form.endTime,
        };
        numberOfChanges++;
      }

      if (JSON.stringify(form.date) !== JSON.stringify(originalForm.date)) {
        changes["date"] = {
          old: originalForm.date,
          new: form.date,
        };
        numberOfChanges++;
      }

      if (form.workType !== originalForm.workType) {
        changes["workType"] = {
          old: originalForm.workType,
          new: form.workType,
        };
        numberOfChanges++;
      }

      if (form.status !== originalForm.status) {
        changes["status"] = {
          old: originalForm.status,
          new: form.status,
        };
        wasStatusChanged = true;
        numberOfChanges++;
      }

      // Check relations
      if (form.User?.id !== originalForm.User?.id) {
        changes["User"] = {
          old: originalForm.User
            ? `${originalForm.User.firstName} ${originalForm.User.lastName}`
            : null,
          new: form.User
            ? `${form.User.firstName} ${form.User.lastName}`
            : null,
        };
        numberOfChanges++;
      }

      if (form.Jobsite?.id !== originalForm.Jobsite?.id) {
        changes["Jobsite"] = {
          old: originalForm.Jobsite?.name,
          new: form.Jobsite?.name,
        };
        numberOfChanges++;
      }

      if (form.CostCode?.name !== originalForm.CostCode?.name) {
        changes["CostCode"] = {
          old: originalForm.CostCode?.name,
          new: form.CostCode?.name,
        };
        numberOfChanges++;
      }

      // If no changes were made, inform the user
      if (Object.keys(changes).length === 0) {
        toast.info("No changes were made to the timesheet", { duration: 3000 });
        setLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append("id", timesheetId.toString());
      formData.append("data", JSON.stringify(form));
      formData.append("changes", JSON.stringify(changes));
      formData.append("editorId", editor || "");
      formData.append("changeReason", changeReason);
      formData.append("wasStatusChanged", wasStatusChanged.toString());
      formData.append("numberOfChanges", numberOfChanges.toString());

      const result = await adminUpdateTimesheet(formData);
      if (result.success) {
        const response = await fetch("/api/notifications/send-multicast", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            topic: "timecards-changes",
            title: "Timecard Modified ",
            message: `${result.editorFullName} made ${numberOfChanges} changes to ${result.userFullname}'s timesheet #${timesheetId}.`,
            link: `/admins/timesheets?id=${timesheetId}`,
          }),
        });
        await response.json();
        await refresh();
      }

      if (onUpdated) onUpdated();
      onClose();
      toast.success("Timesheet updated successfully", { duration: 3000 });
    } catch (error) {
      toast.error(`Failed to update timesheet ${form.id}`, { duration: 3000 });
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

  const setNotificationToRead = async (notificationId: number) => {
    try {
      if (!editor) return;

      const result = await adminSetNotificationToRead(
        notificationId,
        editor,
        "Verified",
      );
      if (result.success) {
        setNotificationIds(null);
      }
    } catch (error) {
      console.error("Error setting notification to read:", error);
    }
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg min-w-[700px]  max-h-[80vh] overflow-y-auto no-scrollbar">
        {error && (
          <div className=" text-xs text-red-600 mb-2 bg-red-400 bg-opacity-20 px-6 py-4 rounded max-w-[700px]">
            <span className="font-bold">Error:</span> {error}
          </div>
        )}
        <div className="px-6 py-4">
          <div className="mb-6 relative">
            <Button
              type="button"
              variant={"ghost"}
              size={"icon"}
              onClick={onClose}
              className="absolute top-0 right-0 cursor-pointer"
            >
              <X width={20} height={20} />
            </Button>
            <div className="gap-2 flex flex-col">
              <h2 className="text-xl font-bold">
                {`Edit Timesheet # ${timesheetId}`}
              </h2>
              <p className="text-xs text-gray-600">
                Edit any details below. Providing a reason for changes is
                required. <br /> Your name will be recorded in the Timesheets
                Changes History.
              </p>
            </div>
          </div>
          {loading && <div className="text-gray-500">Loading...</div>}
          {form && (
            <form
              className="w-full flex flex-col gap-4"
              onSubmit={handleSubmit}
            >
              {changeLogs && (
                <div className="">
                  <div className="flex  items-center mb-2">
                    <div className="relative">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setShowHistory(!showHistory);
                          if (notificationIds) {
                            setNotificationToRead(parseInt(notificationIds));
                          }
                        }}
                        className="flex items-center gap-1 px-6 py-1 rounded-md hover:bg-gray-50"
                      >
                        <ClockIcon size={16} />
                        {showHistory
                          ? "Hide Changes History"
                          : "Show Changes History"}
                      </Button>
                      {changeLogs.length > 0 && (
                        <Badge
                          variant="secondary"
                          className="absolute rounded-full px-2 py-1 -top-2 -right-2 bg-blue-500 text-white hover:bg-blue-500"
                        >
                          {changeLogs.length}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {showHistory && changeLogs.length > 0 && (
                    <div className="border rounded-lg p-3 bg-gray-50">
                      <TimeSheetHistory changeLogs={changeLogs} users={users} />
                    </div>
                  )}

                  {showHistory && changeLogs.length === 0 && (
                    <div className="text-gray-500 italic p-3 border text-xs rounded-lg">
                      No changes have been recorded for this timesheet
                    </div>
                  )}
                </div>
              )}
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

              {/* Change Reason Section */}
              <div className="border rounded-lg p-4 bg-gray-50 mt-4">
                <h3 className="font-semibold text-sm mb-2">
                  Reason for Changes <span className="text-red-500">*</span>
                </h3>
                <p className="text-xs text-gray-600 mb-2">
                  Please provide a reason for the changes you&apos;re making to
                  this timesheet.
                </p>
                <Textarea
                  value={changeReason}
                  onChange={(e) => setChangeReason(e.target.value)}
                  placeholder="Enter change reason (required)"
                  className={`w-full ${!changeReason.trim() ? "border-red-300 focus:ring-red-500 focus:border-red-500" : ""}`}
                  required
                />
                {!changeReason.trim() && (
                  <p className="text-xs text-red-500 mt-1">
                    A reason is required before saving changes
                  </p>
                )}
              </div>

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
                    loading || !changeReason.trim()
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                  disabled={loading || !changeReason.trim()}
                  title={
                    loading
                      ? "Please complete all required fields in the logs before submitting."
                      : !changeReason.trim()
                        ? "Please provide a reason for the changes"
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
