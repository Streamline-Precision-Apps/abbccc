import { Input } from "@/components/ui/input";
import { Combobox } from "@/components/ui/combobox";
import { Button } from "@/components/ui/button";
import type { TruckingLogDraft } from "./CreateTimesheetModal";

interface Props {
  logs: TruckingLogDraft[];
  setLogs: (logs: TruckingLogDraft[]) => void;
  equipmentOptions: { value: string; label: string }[];
}

/**
 * TruckingLogsSection renders a list of trucking log entries with equipment, mileage, and nested arrays for equipment hauled, materials, refuel logs, and state line mileage.
 */
export default function TruckingLogsSection({
  logs,
  setLogs,
  equipmentOptions,
}: Props) {
  return (
    <div className="col-span-2 border rounded p-4 mt-2">
      <h3 className="font-semibold mb-2">Trucking Logs</h3>
      {logs.map((log, idx) => (
        <div key={idx} className="flex flex-col gap-2 mb-4 border-b pb-4">
          <div className="flex gap-2 items-end">
            <Combobox
              label="Equipment"
              options={equipmentOptions}
              value={log.equipmentId}
              onChange={(val, option) => {
                const updated = [...logs];
                updated[idx].equipmentId = val;
                setLogs(updated);
              }}
              placeholder="Select equipment"
              filterKeys={["label", "value"]}
            />
            <Input
              type="number"
              placeholder="Starting Mileage"
              value={log.startingMileage}
              onChange={(e) => {
                const updated = [...logs];
                updated[idx].startingMileage = e.target.value;
                setLogs(updated);
              }}
              className="w-[140px]"
            />
            <Input
              type="number"
              placeholder="Ending Mileage"
              value={log.endingMileage}
              onChange={(e) => {
                const updated = [...logs];
                updated[idx].endingMileage = e.target.value;
                setLogs(updated);
              }}
              className="w-[140px]"
            />
            <Button
              type="button"
              variant="destructive"
              onClick={() => setLogs(logs.filter((_, i) => i !== idx))}
            >
              Remove
            </Button>
          </div>
          {/* Equipment Hauled */}
          <div>
            <label className="block font-semibold text-xs">
              Equipment Hauled
            </label>
            {log.equipmentHauled.map((eq, eqIdx) => (
              <div key={eqIdx} className="flex gap-2 mb-1">
                <Input
                  type="text"
                  placeholder="Equipment Name/ID"
                  value={eq}
                  onChange={(e) => {
                    const updated = [...logs];
                    updated[idx].equipmentHauled[eqIdx] = e.target.value;
                    setLogs(updated);
                  }}
                  className="w-[200px]"
                />
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => {
                    const updated = [...logs];
                    updated[idx].equipmentHauled = updated[
                      idx
                    ].equipmentHauled.filter((_, i) => i !== eqIdx);
                    setLogs(updated);
                  }}
                >
                  Remove
                </Button>
              </div>
            ))}
            <Button
              type="button"
              onClick={() => {
                const updated = [...logs];
                updated[idx].equipmentHauled.push("");
                setLogs(updated);
              }}
            >
              Add Equipment Hauled
            </Button>
          </div>
          {/* Materials */}
          <div>
            <label className="block font-semibold text-xs">Materials</label>
            {log.materials.map((mat, matIdx) => (
              <div key={matIdx} className="flex gap-2 mb-1">
                <Input
                  type="text"
                  placeholder="Material Name"
                  value={mat.name}
                  onChange={(e) => {
                    const updated = [...logs];
                    updated[idx].materials[matIdx].name = e.target.value;
                    setLogs(updated);
                  }}
                  className="w-[200px]"
                />
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => {
                    const updated = [...logs];
                    updated[idx].materials = updated[idx].materials.filter(
                      (_, i) => i !== matIdx
                    );
                    setLogs(updated);
                  }}
                >
                  Remove
                </Button>
              </div>
            ))}
            <Button
              type="button"
              onClick={() => {
                const updated = [...logs];
                updated[idx].materials.push({ name: "" });
                setLogs(updated);
              }}
            >
              Add Material
            </Button>
          </div>
          {/* Refuel Logs */}
          <div>
            <label className="block font-semibold text-xs">Refuel Logs</label>
            {log.refuelLogs.map((ref, refIdx) => (
              <div key={refIdx} className="flex gap-2 mb-1">
                <Input
                  type="number"
                  placeholder="Gallons Refueled"
                  value={ref.gallonsRefueled}
                  onChange={(e) => {
                    const updated = [...logs];
                    updated[idx].refuelLogs[refIdx].gallonsRefueled =
                      e.target.value;
                    setLogs(updated);
                  }}
                  className="w-[120px]"
                />
                <Input
                  type="number"
                  placeholder="Miles at Fueling"
                  value={ref.milesAtFueling}
                  onChange={(e) => {
                    const updated = [...logs];
                    updated[idx].refuelLogs[refIdx].milesAtFueling =
                      e.target.value;
                    setLogs(updated);
                  }}
                  className="w-[120px]"
                />
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => {
                    const updated = [...logs];
                    updated[idx].refuelLogs = updated[idx].refuelLogs.filter(
                      (_, i) => i !== refIdx
                    );
                    setLogs(updated);
                  }}
                >
                  Remove
                </Button>
              </div>
            ))}
            <Button
              type="button"
              onClick={() => {
                const updated = [...logs];
                updated[idx].refuelLogs.push({
                  gallonsRefueled: "",
                  milesAtFueling: "",
                });
                setLogs(updated);
              }}
            >
              Add Refuel Log
            </Button>
          </div>
          {/* State Line Mileage */}
          <div>
            <label className="block font-semibold text-xs">
              State Line Mileage
            </label>
            {log.stateMileages.map((sm, smIdx) => (
              <div key={smIdx} className="flex gap-2 mb-1">
                <Input
                  type="text"
                  placeholder="State"
                  value={sm.state}
                  onChange={(e) => {
                    const updated = [...logs];
                    updated[idx].stateMileages[smIdx].state = e.target.value;
                    setLogs(updated);
                  }}
                  className="w-[100px]"
                />
                <Input
                  type="number"
                  placeholder="State Line Mileage"
                  value={sm.stateLineMileage}
                  onChange={(e) => {
                    const updated = [...logs];
                    updated[idx].stateMileages[smIdx].stateLineMileage =
                      e.target.value;
                    setLogs(updated);
                  }}
                  className="w-[120px]"
                />
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => {
                    const updated = [...logs];
                    updated[idx].stateMileages = updated[
                      idx
                    ].stateMileages.filter((_, i) => i !== smIdx);
                    setLogs(updated);
                  }}
                >
                  Remove
                </Button>
              </div>
            ))}
            <Button
              type="button"
              onClick={() => {
                const updated = [...logs];
                updated[idx].stateMileages.push({
                  state: "",
                  stateLineMileage: "",
                });
                setLogs(updated);
              }}
            >
              Add State Line Mileage
            </Button>
          </div>
        </div>
      ))}
      <Button
        type="button"
        onClick={() =>
          setLogs([
            ...logs,
            {
              equipmentId: "",
              startingMileage: "",
              endingMileage: "",
              equipmentHauled: [],
              materials: [],
              refuelLogs: [],
              stateMileages: [],
            },
          ])
        }
      >
        Add Trucking Log
      </Button>
    </div>
  );
}
