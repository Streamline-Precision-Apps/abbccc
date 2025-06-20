import React from "react";
import { Button } from "@/components/ui/button";

interface EquipmentHauled {
  id: string;
  equipmentId: string;
  jobSiteId: string;
}
interface Material {
  id: string;
  LocationOfMaterial: string;
  name: string;
  materialWeight: number;
  lightWeight: number;
  grossWeight: number;
  loadType: string;
}
interface RefuelLog {
  id: string;
  gallonsRefueled: number;
  milesAtFueling?: number;
}
interface StateMileage {
  id: string;
  state: string;
  stateLineMileage: number;
}
interface TruckingLog {
  id: string;
  equipmentId: string;
  startingMileage: number;
  endingMileage: number;
  EquipmentHauled: EquipmentHauled[];
  Materials: Material[];
  RefuelLogs: RefuelLog[];
  StateMileages: StateMileage[];
}

interface EditTruckingLogsProps {
  logs: TruckingLog[];
  onLogChange: (idx: number, field: keyof TruckingLog, value: any) => void;
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

export const EditTruckingLogs: React.FC<EditTruckingLogsProps> = ({
  logs,
  onLogChange,
  onAddLog,
  onRemoveLog,
  handleNestedLogChange,
}) => (
  <div className="col-span-2 mt-4">
    <h3 className="font-semibold text-sm mb-2">Trucking Logs</h3>
    {logs.map((log, idx) => (
      <div key={log.id} className="border rounded p-2 mb-2">
        <div className="grid grid-cols-4 gap-2 mb-2 items-end">
          <div>
            <label className="block text-xs">Equipment ID</label>
            <input
              type="text"
              value={log.equipmentId}
              onChange={(e) => onLogChange(idx, "equipmentId", e.target.value)}
              className="border rounded px-2 py-1 w-full"
            />
          </div>
          <div>
            <label className="block text-xs">Starting Mileage</label>
            <input
              type="number"
              value={log.startingMileage}
              onChange={(e) =>
                onLogChange(idx, "startingMileage", Number(e.target.value))
              }
              className="border rounded px-2 py-1 w-full"
            />
          </div>
          <div>
            <label className="block text-xs">Ending Mileage</label>
            <input
              type="number"
              value={log.endingMileage}
              onChange={(e) =>
                onLogChange(idx, "endingMileage", Number(e.target.value))
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
        {/* Nested arrays (EquipmentHauled, Materials, RefuelLogs, StateMileages) can be handled similarly if needed */}
      </div>
    ))}
    <Button type="button" className="mt-2" onClick={onAddLog}>
      Add Trucking Log
    </Button>
  </div>
);
