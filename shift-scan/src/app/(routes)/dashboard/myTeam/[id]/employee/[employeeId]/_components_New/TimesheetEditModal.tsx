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
type AppManagerEditTimesheetModalProps = {
  timesheetId: string;
  isOpen: boolean;
  onClose: () => void;
};

export default function AppManagerEditTimesheetModal(
  props: AppManagerEditTimesheetModalProps
) {
  const { timesheetId, isOpen, onClose } = props;
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div className="bg-white shadow-lg w-full max-w-md h-full flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-4 pt-3 border-b">
          <div className="flex items-center justify-between pb-1 relative">
            <h2 className="text-base font-semibold text-center absolute left-1/2 -translate-x-1/2 w-full pointer-events-none">
              Timesheet
            </h2>
            {/* Empty div for spacing/alignment */}
            <div className="w-8 h-8" />
          </div>
          <div className="flex flex-col items-center justify-center pb-2">
            <span className="text-xs text-muted-foreground mt-0.5 break-all">
              ID: {timesheetId}
            </span>
          </div>
        </div>
        {/* Content */}
        <div className="flex-1 overflow-y-auto px-4 pb-32 pt-4">
          {loading ? (
            <div className="flex flex-col gap-3 mt-2">
              <Skeleton className="h-4 w-24 rounded" />
              <Skeleton className="h-10 w-full rounded" />
              <Skeleton className="h-4 w-24 rounded mt-2" />
              <Skeleton className="h-10 w-full rounded" />
              <Skeleton className="h-4 w-24 rounded mt-2" />
              <Skeleton className="h-10 w-full rounded" />
              <Skeleton className="h-4 w-24 rounded mt-2" />
              <Skeleton className="h-10 w-full rounded" />
              <Skeleton className="h-4 w-24 rounded mt-2" />
              <Skeleton className="h-20 w-full rounded" />
              <Skeleton className="h-8 w-24 rounded self-end mt-2" />
            </div>
          ) : error ? (
            <div className="text-center text-xs text-red-500">{error}</div>
          ) : data ? (
            <div className="flex flex-col gap-3 mt-2">
              <label className="text-xs font-medium">Start Time</label>
              <Input
                type="time"
                value={format(data.startTime, "HH:mm")}
                onChange={(e) => updateField("startTime", e.target.value)}
                disabled={!editGeneral}
              />
              <label className="text-xs font-medium">End Time</label>
              <Input
                type="time"
                value={data.endTime ? format(data.endTime, "HH:mm") : ""}
                onChange={(e) => updateField("endTime", e.target.value)}
                disabled={!editGeneral}
              />
              <label className="text-xs font-medium">Jobsite</label>
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

              <label className="text-xs font-medium">Cost Code</label>
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
              <label className="text-xs font-medium">Comment</label>
              <div className="relative">
                <Textarea
                  value={data.comment ?? ""}
                  maxLength={40}
                  onChange={(e) => {
                    if (!editGeneral) return;
                    const val = e.target.value.slice(0, 40);
                    updateField("comment", val);
                  }}
                  disabled={true}
                />
                <div className="absolute bottom-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="text-xs text-muted-foreground">
                    {data.comment?.length ?? 0} / 40
                  </span>
                </div>
              </div>
              {/* Save/Cancel in-section for edit mode only */}
            </div>
          ) : null}
        </div>
        {/* Sticky Action Bar for Edit/Exit when not editing */}
        {!editGeneral ? (
          <div className="fixed bottom-0 left-0 w-full max-w-md bg-gray-50 border-t flex gap-2 px-4 py-3 z-50">
            <Button
              variant="outline"
              className="flex-1 flex items-center justify-center gap-2 min-h-[44px]"
              onClick={onClose}
              aria-label="Exit"
            >
              <img src="/arrowBack.svg" alt="Exit" className="w-5 h-5" />
            </Button>
            <Button
              variant="outline"
              className="flex-1 flex items-center justify-center gap-2 min-h-[44px] bg-app-orange"
              onClick={() => setEditGeneral(true)}
              aria-label="Edit"
            >
              <img src="/formEdit.svg" alt="Edit" className="w-5 h-5" />
            </Button>
          </div>
        ) : (
          <div className="fixed bottom-0 left-0 w-full max-w-md bg-gray-50 border-t flex gap-2 px-4 py-3 z-50">
            <Button
              variant="outline"
              className="flex-1 flex items-center justify-center gap-2 min-h-[44px] bg-white"
              onClick={() => {
                setEditGeneral(false);
                reset();
              }}
            >
              Cancel
            </Button>
            <Button
              className="flex-1 flex items-center justify-center gap-2 min-h-[44px] bg-app-green"
              onClick={save}
              disabled={!hasChanges}
            >
              Save
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
