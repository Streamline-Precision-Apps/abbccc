import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useTimecardIdData } from "./useTimecardIdData";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
// Collapsible imports removed
import { Textarea } from "@/components/ui/textarea";
import { useTimesheetData } from "@/app/(routes)/admins/timesheets/_components/Edit/hooks/useTimesheetData";
import { format } from "date-fns";
import { on } from "events";
type AppManagerEditTimesheetModalProps = {
  timesheetId: string;
  isOpen: boolean;
  onClose: () => void;
  resetMainList: () => void;
};

export default function AppManagerEditTimesheetModal(
  props: AppManagerEditTimesheetModalProps
) {
  const { timesheetId, isOpen, onClose, resetMainList } = props;
  const {
    data,
    loading,
    error,
    updateField,
    save,
    hasChanges,
    costCodes,
    jobSites,
    reset,
  } = useTimecardIdData(timesheetId);
  const [editGeneral, setEditGeneral] = useState(false);
  const [showGeneral, setShowGeneral] = useState(true);
  if (!isOpen) return null;

  const onSave = async () => {
    await save();
    setEditGeneral(false);
    resetMainList();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div className="bg-white shadow-2xl rounded-2xl w-full max-w-md h-full flex flex-col overflow-hidden transition-all duration-300">
        {/* Header */}
        <div className="px-4 pt-4 border-b bg-gradient-to-tr from-app-dark-blue/20 to-app-blue/20">
          <div className="flex items-center justify-between pb-1 relative">
            <h2 className="text-lg font-bold text-center absolute left-1/2 -translate-x-1/2 w-full pointer-events-none tracking-wide">
              <span className="inline-flex items-center gap-2">
                <img src="/form.svg" alt="Timesheet" className="w-6 h-6" />
                Timesheet
              </span>
            </h2>
            <div className="w-8 h-8" />
          </div>
          <div className="flex flex-col items-center justify-center pb-2">
            <span className="text-xs text-muted-foreground mt-0.5 break-all">
              ID: {timesheetId}
            </span>
          </div>
        </div>
        {/* Content */}
        <div
          className="flex-1 overflow-y-auto px-4 pb-32 pt-4 transition-colors duration-300"
          style={{
            background: editGeneral ? "rgba(255, 243, 207, 0.15)" : "white",
          }}
        >
          {loading ? (
            <div className="flex flex-col gap-0 mt-2 animate-pulse">
              {/* Start Time Skeleton */}
              <div className="flex items-center gap-2 py-3 border-b">
                <Skeleton className="w-4 h-4 rounded bg-gray-200" />
                <Skeleton className="h-4 w-20 rounded bg-gray-200" />
                <Skeleton className="h-10 w-24 rounded bg-gray-200 ml-auto" />
              </div>
              {/* End Time Skeleton */}
              <div className="flex items-center gap-2 py-3 border-b">
                <Skeleton className="w-4 h-4 rounded bg-gray-200" />
                <Skeleton className="h-4 w-20 rounded bg-gray-200" />
                <Skeleton className="h-10 w-24 rounded bg-gray-200 ml-auto" />
              </div>
              {/* Jobsite Skeleton */}
              <div className="flex items-center gap-2 py-3 border-b">
                <Skeleton className="w-4 h-4 rounded bg-gray-200" />
                <Skeleton className="h-4 w-20 rounded bg-gray-200" />
                <Skeleton className="h-10 w-32 rounded bg-gray-200 ml-auto" />
              </div>
              {/* Cost Code Skeleton */}
              <div className="flex items-center gap-2 py-3 border-b">
                <Skeleton className="w-4 h-4 rounded bg-gray-200" />
                <Skeleton className="h-4 w-20 rounded bg-gray-200" />
                <Skeleton className="h-10 w-32 rounded bg-gray-200 ml-auto" />
              </div>
              {/* Comment Skeleton */}
              <div className="py-3">
                <div className="flex items-center gap-2 mb-1">
                  <Skeleton className="w-4 h-4 rounded bg-gray-200" />
                  <Skeleton className="h-4 w-20 rounded bg-gray-200" />
                </div>
                <Skeleton className="h-20 w-full rounded bg-gray-200" />
                <div className="flex justify-end mt-1">
                  <Skeleton className="h-3 w-12 rounded bg-gray-200" />
                </div>
              </div>
            </div>
          ) : error ? (
            <div className="text-center text-xs text-red-500">{error}</div>
          ) : data ? (
            <div className="flex flex-col gap-0 mt-2">
              {/* Start Time */}
              <div className="flex items-center gap-2 py-3 border-b">
                <img
                  src="/clock.svg"
                  alt="Start"
                  className="w-4 h-4 opacity-70"
                />
                <label className="text-xs font-semibold flex-1">
                  Start Time
                </label>
                <Input
                  type="time"
                  value={format(data.startTime, "HH:mm")}
                  onChange={(e) => updateField("startTime", e.target.value)}
                  disabled={!editGeneral}
                  className={editGeneral ? "ring-2 ring-app-orange" : ""}
                />
              </div>
              {/* End Time */}
              <div className="flex items-center gap-2 py-3 border-b">
                <img
                  src="/clock.svg"
                  alt="End"
                  className="w-4 h-4 opacity-70"
                />
                <label className="text-xs font-semibold flex-1">End Time</label>
                <Input
                  type="time"
                  value={data.endTime ? format(data.endTime, "HH:mm") : ""}
                  onChange={(e) => updateField("endTime", e.target.value)}
                  disabled={!editGeneral}
                  className={editGeneral ? "ring-2 ring-app-orange" : ""}
                />
              </div>
              {/* Jobsite */}
              <div className="flex items-center gap-2 py-3 border-b">
                <img
                  src="/jobsite.svg"
                  alt="Jobsite"
                  className="w-4 h-4 opacity-70"
                />
                <label className="text-xs font-semibold flex-1">Jobsite</label>
                <Select
                  value={data.Jobsite?.id ?? ""}
                  onValueChange={(val) => {
                    const selected = jobSites.find((j) => j.id === val);
                    updateField("Jobsite", selected ?? null);
                  }}
                  disabled={!editGeneral}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select jobsite" />
                  </SelectTrigger>
                  <SelectContent>
                    {jobSites.map((jobsite) => (
                      <SelectItem key={jobsite.id} value={jobsite.id}>
                        {jobsite.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {/* Cost Code */}
              <div className="flex items-center gap-2 py-3 border-b">
                <img
                  src="/number.svg"
                  alt="Cost Code"
                  className="w-4 h-4 opacity-70"
                />
                <label className="text-xs font-semibold flex-1">
                  Cost Code
                </label>
                <Select
                  value={data.CostCode?.id ?? ""}
                  onValueChange={(val) => {
                    const selected = costCodes.find((c) => c.id === val);
                    updateField("CostCode", selected ?? null);
                  }}
                  disabled={!editGeneral}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select cost code" />
                  </SelectTrigger>
                  <SelectContent>
                    {costCodes.map((code) => (
                      <SelectItem key={code.id} value={code.id}>
                        {code.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {/* Comment */}
              <div className="py-3">
                <div className="flex items-center gap-2 mb-1">
                  <img
                    src="/comment.svg"
                    alt="Comment"
                    className="w-4 h-4 opacity-70"
                  />
                  <label className="text-xs font-semibold flex-1">
                    Comment
                  </label>
                </div>
                <Textarea
                  value={data.comment ?? ""}
                  maxLength={40}
                  onChange={(e) => {
                    if (!editGeneral) return;
                    const val = e.target.value.slice(0, 40);
                    updateField("comment", val);
                  }}
                  disabled={true}
                  className={editGeneral ? "ring-2 ring-app-orange" : ""}
                />
                <div className="flex justify-end mt-1">
                  <span className="text-xs text-muted-foreground">
                    {data.comment?.length ?? 0} / 40
                  </span>
                </div>
              </div>
            </div>
          ) : null}
        </div>
        {/* Sticky Action Bar for Edit/Exit and Save/Cancel */}
        {!editGeneral ? (
          <div className="fixed bottom-0 left-0 w-full max-w-md bg-gradient-to-tr from-app-dark-blue/20 to-app-blue/20 border-t flex gap-2 px-4 py-3 z-50 shadow-lg">
            <Button
              variant="outline"
              className="flex-1 flex items-center justify-center gap-2 min-h-[48px] rounded-lg text-base font-medium"
              onClick={onClose}
              aria-label="Exit"
            >
              <img src="/arrowBack.svg" alt="Exit" className="w-5 h-5" />
            </Button>
            <Button
              variant="outline"
              className="flex-1 flex items-center justify-center gap-2 min-h-[48px] rounded-lg text-base font-medium bg-app-orange hover:bg-app-orange/80 text-black transition-colors"
              onClick={() => setEditGeneral(true)}
              aria-label="Edit"
            >
              <img src="/formEdit.svg" alt="Edit" className="w-5 h-5" />
              Edit
            </Button>
          </div>
        ) : (
          <div className="fixed bottom-0 left-0 w-full max-w-md bg-gradient-to-tr from-app-dark-blue/20 to-app-blue/20 border-t flex gap-2 px-4 py-3 z-50 shadow-lg animate-fade-in">
            <Button
              variant="outline"
              className="flex-1 flex items-center justify-center gap-2 min-h-[48px] rounded-lg text-base font-medium bg-white hover:bg-gray-100 transition-colors"
              onClick={() => {
                setEditGeneral(false);
                reset();
              }}
            >
              Cancel
            </Button>
            <Button
              className="flex-1 flex items-center justify-center gap-2 min-h-[48px] rounded-lg text-base font-semibold bg-app-green text-white shadow-md transition-colors"
              onClick={onSave}
              disabled={!hasChanges}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-5 h-5 mr-1"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.5 12.75l6 6 9-13.5"
                />
              </svg>
              Save
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
