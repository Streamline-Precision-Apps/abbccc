import React from "react";
import { Button } from "@/components/ui/button";
import type { TascoLog } from "@/lib/types";

interface EditTascoLogsProps {
  logs: TascoLog[];
  onLogChange: (
    idx: number,
    field: keyof TascoLog,
    value: TascoLog[keyof TascoLog]
  ) => void;
  onAddLog: () => void;
  onRemoveLog: (idx: number) => void;
  handleNestedLogChange: (
    logIndex: number,
    nestedType: keyof TascoLog,
    nestedIndex: number,
    field: string,
    value: unknown
  ) => void;
  originalLogs?: TascoLog[];
  onUndoLogField?: (idx: number, field: keyof TascoLog) => void;
}

export const EditTascoLogs: React.FC<EditTascoLogsProps> = ({
  logs,
  onLogChange,
  onAddLog,
  onRemoveLog,
  handleNestedLogChange,
  originalLogs = [],
  onUndoLogField,
}) => (
  <div className="col-span-2 mt-4">
    <h3 className="font-semibold text-sm mb-2">Tasco Logs</h3>
    {logs.map((log, idx) => (
      <div
        key={log.id}
        className="border rounded p-2 mb-2 grid grid-cols-4 gap-2 items-end"
      >
        <div className="flex flex-row items-end">
          <div className="flex-1">
            <label className="block text-xs">Shift Type</label>
            <input
              type="text"
              value={log.shiftType}
              onChange={(e) => onLogChange(idx, "shiftType", e.target.value)}
              className="border rounded px-2 py-1 w-full"
            />
          </div>
          <div>
            {originalLogs[idx] &&
              log.shiftType !== originalLogs[idx].shiftType &&
              onUndoLogField && (
                <Button
                  type="button"
                  size="sm"
                  className="ml-2"
                  onClick={() => onUndoLogField(idx, "shiftType")}
                >
                  Undo
                </Button>
              )}
          </div>
        </div>
        <div className="flex flex-row items-end">
          <div className="flex-1">
            <label className="block text-xs">Labor Type</label>
            <input
              type="text"
              value={log.laborType}
              onChange={(e) => onLogChange(idx, "laborType", e.target.value)}
              className="border rounded px-2 py-1 w-full"
            />
          </div>
          <div>
            {originalLogs[idx] &&
              log.laborType !== originalLogs[idx].laborType &&
              onUndoLogField && (
                <Button
                  type="button"
                  size="sm"
                  className="ml-2"
                  onClick={() => onUndoLogField(idx, "laborType")}
                >
                  Undo
                </Button>
              )}
          </div>
        </div>
        <div className="flex flex-row items-end">
          <div className="flex-1">
            <label className="block text-xs">Material Type</label>
            <input
              type="text"
              value={log.materialType}
              onChange={(e) => onLogChange(idx, "materialType", e.target.value)}
              className="border rounded px-2 py-1 w-full"
            />
          </div>
          <div>
            {originalLogs[idx] &&
              log.materialType !== originalLogs[idx].materialType &&
              onUndoLogField && (
                <Button
                  type="button"
                  size="sm"
                  className="ml-2"
                  onClick={() => onUndoLogField(idx, "materialType")}
                >
                  Undo
                </Button>
              )}
          </div>
        </div>
        <div className="flex flex-row items-end">
          <div className="flex-1">
            <label className="block text-xs">Load Quantity</label>
            <input
              type="number"
              value={log.loadsHauled}
              onChange={(e) =>
                onLogChange(idx, "loadsHauled", Number(e.target.value))
              }
              className="border rounded px-2 py-1 w-full"
            />
          </div>
          <div>
            {originalLogs[idx] &&
              log.loadsHauled !== originalLogs[idx].loadsHauled &&
              onUndoLogField && (
                <Button
                  type="button"
                  size="sm"
                  className="ml-2"
                  onClick={() => onUndoLogField(idx, "loadsHauled")}
                >
                  Undo
                </Button>
              )}
          </div>
        </div>
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
    <Button type="button" className="mt-2" onClick={onAddLog}>
      Add Tasco Log
    </Button>
  </div>
);
