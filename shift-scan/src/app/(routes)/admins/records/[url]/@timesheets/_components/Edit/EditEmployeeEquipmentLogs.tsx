import React from "react";
import { Button } from "@/components/ui/button";

interface EmployeeEquipmentLog {
  id: string;
  equipmentId: string;
  startTime: string;
  endTime: string;
  Equipment: { id: string; name: string } | null;
}

interface EditEmployeeEquipmentLogsProps {
  logs: EmployeeEquipmentLog[];
  onLogChange: (idx: number, field: keyof EmployeeEquipmentLog, value: any) => void;
  onAddLog: () => void;
  onRemoveLog: (idx: number) => void;
}

export const EditEmployeeEquipmentLogs: React.FC<EditEmployeeEquipmentLogsProps> = ({
  logs,
  onLogChange,
  onAddLog,
  onRemoveLog,
}) => (
  <div className="col-span-2 mt-4">
    <h3 className="font-semibold text-sm mb-2">Employee Equipment Logs</h3>
    {logs.map((log, idx) => (
      <div key={log.id} className="border rounded p-2 mb-2 grid grid-cols-4 gap-2 items-end">
        <div>
          <label className="block text-xs">Equipment ID</label>
          <input
            type="text"
            value={log.equipmentId}
            onChange={e => onLogChange(idx, "equipmentId", e.target.value)}
            className="border rounded px-2 py-1 w-full"
          />
        </div>
        <div>
          <label className="block text-xs">Start Time</label>
          <input
            type="time"
            value={log.startTime ? log.startTime.slice(11, 16) : ""}
            onChange={e => onLogChange(idx, "startTime", e.target.value)}
            className="border rounded px-2 py-1 w-full"
          />
        </div>
        <div>
          <label className="block text-xs">End Time</label>
          <input
            type="time"
            value={log.endTime ? log.endTime.slice(11, 16) : ""}
            onChange={e => onLogChange(idx, "endTime", e.target.value)}
            className="border rounded px-2 py-1 w-full"
          />
        </div>
        <Button type="button" variant="destructive" onClick={() => onRemoveLog(idx)}>
          Remove
        </Button>
      </div>
    ))}
    <Button type="button" className="mt-2" onClick={onAddLog}>
      Add Equipment Log
    </Button>
  </div>
);
