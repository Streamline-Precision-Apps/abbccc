import React from "react";
import { Button } from "@/components/ui/button";

interface RefuelLog {
  id: string;
  gallonsRefueled: number;
  milesAtFueling?: number;
}
interface TascoLog {
  id: string;
  shiftType: string;
  laborType: string;
  materialType: string;
  LoadQuantity: number;
  RefuelLogs: RefuelLog[];
  Equipment: { id: string; name: string } | null;
}

interface EditTascoLogsProps {
  logs: TascoLog[];
  onLogChange: (idx: number, field: keyof TascoLog, value: any) => void;
  onAddLog: () => void;
  onRemoveLog: (idx: number) => void;
  handleNestedLogChange: (
    logIndex: number,
    nestedType: string,
    nestedIndex: number,
    field: string,
    value: any
  ) => void;
}

export const EditTascoLogs: React.FC<EditTascoLogsProps> = ({
  logs,
  onLogChange,
  onAddLog,
  onRemoveLog,
  handleNestedLogChange,
}) => (
  <div className="col-span-2 mt-4">
    <h3 className="font-semibold text-sm mb-2">Tasco Logs</h3>
    {logs.map((log, idx) => (
      <div
        key={log.id}
        className="border rounded p-2 mb-2 grid grid-cols-4 gap-2 items-end"
      >
        <div>
          <label className="block text-xs">Shift Type</label>
          <input
            type="text"
            value={log.shiftType}
            onChange={(e) => onLogChange(idx, "shiftType", e.target.value)}
            className="border rounded px-2 py-1 w-full"
          />
        </div>
        <div>
          <label className="block text-xs">Labor Type</label>
          <input
            type="text"
            value={log.laborType}
            onChange={(e) => onLogChange(idx, "laborType", e.target.value)}
            className="border rounded px-2 py-1 w-full"
          />
        </div>
        <div>
          <label className="block text-xs">Material Type</label>
          <input
            type="text"
            value={log.materialType}
            onChange={(e) => onLogChange(idx, "materialType", e.target.value)}
            className="border rounded px-2 py-1 w-full"
          />
        </div>
        <div>
          <label className="block text-xs">Load Quantity</label>
          <input
            type="number"
            value={log.LoadQuantity}
            onChange={(e) =>
              onLogChange(idx, "LoadQuantity", Number(e.target.value))
            }
            className="border rounded px-2 py-1 w-full"
          />
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
      Add Tasco Log
    </Button>
  </div>
);
