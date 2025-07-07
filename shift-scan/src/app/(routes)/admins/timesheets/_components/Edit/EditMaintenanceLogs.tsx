import React from "react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { DateTimePicker } from "../DateTimePicker";
import { Combobox } from "@/components/ui/combobox";

interface MaintenanceLog {
  id: string;
  startTime: string;
  endTime: string;
  maintenanceId: string;
}

export function isMaintenanceLogComplete(log: MaintenanceLog) {
  return !!(log.maintenanceId && log.startTime && log.endTime);
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
  maintenanceOptions: { value: string; label: string }[];
  disableAdd?: boolean;
}

export const EditMaintenanceLogs: React.FC<EditMaintenanceLogsProps> = ({
  logs,
  onLogChange,
  onAddLog,
  onRemoveLog,
  originalLogs = [],
  onUndoLogField,
  maintenanceOptions,
  disableAdd = false,
}) => (
  <div className="col-span-2 mt-4">
    <h3 className="font-semibold text-lg mb-4">Maintenance Logs</h3>
    {logs.map((log, idx) => (
      <div
        key={log.id}
        className="border rounded p-4 mb-2 flex flex-col gap-2 relative "
      >
        <div className="flex items-end">
          <div className="min-w-[200px]">
            <Combobox
              label="Maintenance ID"
              options={maintenanceOptions}
              value={log.maintenanceId}
              onChange={(val, option) => onLogChange(idx, "maintenanceId", val)}
              placeholder="Select maintenance ID"
              filterKeys={["value", "label"]}
            />
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
        </div>
        <div className="flex flex-row items-end">
          <DateTimePicker
            value={log.startTime}
            onChange={(val) => onLogChange(idx, "startTime", val)}
            label="Start Time"
          />
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
          <DateTimePicker
            value={log.endTime}
            onChange={(val) => onLogChange(idx, "endTime", val)}
            label="End Time"
          />
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
        <Button
          size={"icon"}
          type="button"
          variant="destructive"
          onClick={() => onRemoveLog(idx)}
          className="absolute top-2 right-2"
        >
          <img src="/trash.svg" alt="Delete" className="w-4 h-4" />
        </Button>
      </div>
    ))}
    <Button
      type="button"
      className="mt-2"
      onClick={onAddLog}
      disabled={disableAdd}
    >
      <img src="/plus-white.svg" alt="Add" className="w-4 h-4 mr-2" />
      Add New Log
    </Button>
  </div>
);
