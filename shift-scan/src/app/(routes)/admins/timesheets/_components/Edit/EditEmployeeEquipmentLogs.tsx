import React from "react";
import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combobox";
import { DateTimePicker } from "../DateTimePicker";

interface EmployeeEquipmentLog {
  id: string;
  equipmentId: string;
  startTime: string;
  endTime: string;
  Equipment: { id: string; name: string } | null;
}

interface EditEmployeeEquipmentLogsProps {
  logs: EmployeeEquipmentLog[];
  onLogChange: (
    idx: number,
    field: keyof EmployeeEquipmentLog,
    value: any
  ) => void;
  onAddLog: () => void;
  onRemoveLog: (idx: number) => void;
  originalLogs?: EmployeeEquipmentLog[];
  onUndoLogField?: (idx: number, field: keyof EmployeeEquipmentLog) => void;
  equipmentOptions: {
    value: string;
    label: string;
  }[];
}

export const EditEmployeeEquipmentLogs: React.FC<
  EditEmployeeEquipmentLogsProps
> = ({
  logs,
  onLogChange,
  onAddLog,
  onRemoveLog,
  originalLogs = [],
  onUndoLogField,
  equipmentOptions = [],
}) => {
  // Helper to check if a log is complete
  const isLogComplete = (log: EmployeeEquipmentLog) => {
    return !!log.equipmentId && !!log.startTime && !!log.endTime;
  };
  const canAdd = logs.length === 0 || isLogComplete(logs[logs.length - 1]);

  return (
    <div className="col-span-2 mt-4">
      <h3 className="font-semibold text-sm mb-2">Employee Equipment Logs</h3>
      {logs.map((log, idx) => (
        <div
          key={log.id}
          className="border rounded p-4 mb-2 flex flex-col gap-2 relative "
        >
          <div className="flex flex-row row-start-1 row-end-2 col-span-2 items-end">
            <div className="w-[350px]">
              <Combobox
                font={"font-normal"}
                label="Equipment ID"
                options={equipmentOptions}
                value={log.equipmentId}
                onChange={(val, option) => onLogChange(idx, "equipmentId", val)}
                placeholder="Select equipment ID"
                filterKeys={["value", "label"]}
              />
            </div>

            <div>
              {originalLogs[idx] &&
                log.equipmentId !== originalLogs[idx].equipmentId &&
                onUndoLogField && (
                  <Button
                    type="button"
                    size="sm"
                    className="ml-2"
                    onClick={() => onUndoLogField(idx, "equipmentId")}
                  >
                    Undo
                  </Button>
                )}
            </div>
          </div>

          <Button
            type="button"
            size={"icon"}
            variant="destructive"
            onClick={() => onRemoveLog(idx)}
            className="absolute top-2 right-2"
          >
            <img src="/trash.svg" alt="Delete" className="w-4 h-4" />
          </Button>

          <div className="flex flex-row items-end">
            <div>
              <DateTimePicker
                font={"font-normal"}
                value={log.startTime ? log.startTime : ""}
                onChange={(val) => onLogChange(idx, "startTime", val)}
                label="Start Time"
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
            <div>
              <DateTimePicker
                font={"font-normal"}
                value={log.endTime ? log.endTime : ""}
                onChange={(val) => onLogChange(idx, "endTime", val)}
                label="End Time"
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
        </div>
      ))}
      <Button
        type="button"
        className="mt-2"
        onClick={onAddLog}
        disabled={!canAdd}
      >
        Add Equipment Log
      </Button>
    </div>
  );
};
