import React from "react";
import { Button } from "@/components/ui/button";
import type { TruckingLog } from "@/lib/types";

interface EditTruckingLogsProps {
  logs: TruckingLog[];
  onLogChange: (
    idx: number,
    field: keyof TruckingLog,
    value: TruckingLog[keyof TruckingLog]
  ) => void;
  onAddLog: () => void;
  onRemoveLog: (idx: number) => void;
  handleNestedLogChange: (
    logIndex: number,
    nestedType: keyof TruckingLog,
    nestedIndex: number,
    field: string,
    value: unknown
  ) => void;
  originalLogs?: TruckingLog[];
  onUndoLogField?: (idx: number, field: keyof TruckingLog) => void;
}

export const EditTruckingLogs: React.FC<EditTruckingLogsProps> = ({
  logs,
  onLogChange,
  onAddLog,
  onRemoveLog,
  handleNestedLogChange,
  originalLogs = [],
  onUndoLogField,
}) => (
  <div className="col-span-2 mt-4">
    <h3 className="font-semibold text-sm mb-2">Trucking Logs</h3>
    {logs.map((log, idx) => (
      <div
        key={log.id}
        className="border rounded p-2 mb-2 grid grid-cols-4 gap-2 items-end"
      >
        {/* Example: Equipment ID */}
        <div className="flex flex-row items-end">
          <div className="flex-1">
            <label className="block text-xs">Equipment ID</label>
            <input
              type="text"
              value={log.equipmentId ?? ""}
              onChange={(e) => onLogChange(idx, "equipmentId", e.target.value)}
              className="border rounded px-2 py-1 w-full"
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
        {/* Add more fields for TruckingLog as needed, using correct property names from the imported type */}
        <div>
          <Button
            type="button"
            variant="destructive"
            onClick={() => onRemoveLog(idx)}
          >
            Remove
          </Button>
        </div>
      </div>
    ))}
    <Button type="button" onClick={onAddLog} className="mt-2">
      Add Trucking Log
    </Button>
  </div>
);
