import { Input } from "@/components/ui/input";
import { Combobox } from "@/components/ui/combobox";
import { Button } from "@/components/ui/button";
import type { MaintenanceLogDraft } from "./CreateTimesheetModal";

interface Props {
  logs: MaintenanceLogDraft[];
  setLogs: (logs: MaintenanceLogDraft[]) => void;
  equipmentOptions: { value: string; label: string }[];
}

/**
 * MaintenanceLogsSection renders a list of maintenance log entries with equipment, start, and end time fields.
 */
export default function MaintenanceLogsSection({
  logs,
  setLogs,
  equipmentOptions,
}: Props) {
  return (
    <div className="col-span-2 border rounded p-4 mt-2">
      <h3 className="font-semibold mb-2">Maintenance Logs</h3>
      {logs.map((log, idx) => (
        <div key={idx} className="flex gap-2 mb-2 items-end">
          <Combobox
            label="Equipment"
            options={equipmentOptions}
            value={log.equipmentId}
            onChange={(val, option) => {
              const updated = [...logs];
              updated[idx].equipmentId = val;
              updated[idx].equipmentName = option ? option.label : "";
              setLogs(updated);
            }}
            placeholder="Select equipment"
            filterKeys={["label", "value"]}
          />
          <Input
            type="time"
            value={log.startTime}
            onChange={(e) => {
              const updated = [...logs];
              updated[idx].startTime = e.target.value;
              setLogs(updated);
            }}
            required
            className="w-[120px]"
          />
          <Input
            type="time"
            value={log.endTime}
            onChange={(e) => {
              const updated = [...logs];
              updated[idx].endTime = e.target.value;
              setLogs(updated);
            }}
            className="w-[120px]"
          />
          <Button
            type="button"
            variant="destructive"
            onClick={() => setLogs(logs.filter((_, i) => i !== idx))}
          >
            Remove
          </Button>
        </div>
      ))}
      <Button
        type="button"
        onClick={() =>
          setLogs([
            ...logs,
            { startTime: "", endTime: "", equipmentId: "", equipmentName: "" },
          ])
        }
      >
        Add Maintenance Log
      </Button>
    </div>
  );
}
