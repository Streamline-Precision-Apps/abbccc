import React from "react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

interface MaintenanceLog {
  id: string;
  startTime: string;
  endTime: string;
  maintenanceId: string;
}

interface EditMaintenanceLogsProps {
  logs: MaintenanceLog[];
  onLogChange: (
    idx: number,
    field: keyof MaintenanceLog,
    value: MaintenanceLog[keyof MaintenanceLog]
  ) => void;
  onAddLog: () => void;
  onRemoveLog: (idx: number) => void;
  originalLogs?: MaintenanceLog[];
  onUndoLogField?: (idx: number, field: keyof MaintenanceLog) => void;
}

export const EditMaintenanceLogs: React.FC<EditMaintenanceLogsProps> = ({
  logs,
  onLogChange,
  onAddLog,
  onRemoveLog,
  originalLogs = [],
  onUndoLogField,
}) => (
  <div className="col-span-2 mt-4">
    <h3 className="font-semibold text-sm mb-2">Maintenance Logs</h3>
    {logs.map((log, idx) => (
      <div
        key={log.id}
        className="border rounded p-2 mb-2 grid grid-cols-4 gap-2 items-end"
      >
        <div className="flex flex-row items-end">
          <div className="flex-1">
            <label className="block text-xs">Start Time</label>
            <input
              type="time"
              value={log.startTime ? format(log.startTime, "HH:mm") : ""}
              onChange={(e) => onLogChange(idx, "startTime", e.target.value)}
              className="border rounded px-2 py-1 w-full"
            />
          </div>
          <div>
            {originalLogs[idx] &&
              log.startTime !== originalLogs[idx].startTime &&
              onUndoLogField && (
                <Button
                  type="button"
                  size="sm"
                  className="ml-2"
                  onClick={() => onUndoLogField(idx, "startTime")}
                >
                  Undo
                </Button>
              )}
          </div>
        </div>
        <div className="flex flex-row items-end">
          <div className="flex-1">
            <label className="block text-xs">End Time</label>
            <input
              type="time"
              value={log.endTime ? format(log.endTime, "HH:mm") : ""}
              onChange={(e) => onLogChange(idx, "endTime", e.target.value)}
              className="border rounded px-2 py-1 w-full"
            />
          </div>
          <div>
            {originalLogs[idx] &&
              log.endTime !== originalLogs[idx].endTime &&
              onUndoLogField && (
                <Button
                  type="button"
                  size="sm"
                  className="ml-2"
                  onClick={() => onUndoLogField(idx, "endTime")}
                >
                  Undo
                </Button>
              )}
          </div>
        </div>
        <div className="flex flex-row items-end">
          <div className="flex-1">
            <label className="block text-xs">Maintenance ID</label>
            <input
              type="text"
              value={log.maintenanceId}
              onChange={(e) =>
                onLogChange(idx, "maintenanceId", e.target.value)
              }
              className="border rounded px-2 py-1 w-full"
            />
          </div>
          <div>
            {originalLogs[idx] &&
              log.maintenanceId !== originalLogs[idx].maintenanceId &&
              onUndoLogField && (
                <Button
                  type="button"
                  size="sm"
                  className="ml-2"
                  onClick={() => onUndoLogField(idx, "maintenanceId")}
                >
                  Undo
                </Button>
              )}
          </div>
        </div>
        <Button
          type="button"
          variant="destructive"
          onClick={() => onRemoveLog(idx)}
        >
          Remove
        </Button>
      </div>
    ))}
    <Button type="button" className="mt-2" onClick={onAddLog}>
      Add Maintenance Log
    </Button>
  </div>
);
