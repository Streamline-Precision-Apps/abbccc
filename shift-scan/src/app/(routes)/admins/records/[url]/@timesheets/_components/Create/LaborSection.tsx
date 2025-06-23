import { Combobox } from "@/components/ui/combobox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import React from "react";

export type LaborLogDraft = {
  equipment: { id: string; name: string };
  startTime: string;
  endTime: string;
};

type Props = {
  laborLogs: LaborLogDraft[];
  setLaborLogs: React.Dispatch<React.SetStateAction<LaborLogDraft[]>>;
  equipmentOptions: { value: string; label: string }[];
};

export function LaborSection({
  laborLogs,
  setLaborLogs,
  equipmentOptions,
}: Props) {
  // ...existing code for rendering labor logs UI, using the props above...
  // Copy the JSX and logic for the Labor section from the main modal, replacing state/handlers with props
  return (
    <div className="col-span-2 border-t-2 border-black pt-4 pb-2">
      <div className="mb-4">
        <h3 className="font-semibold text-xl mb-1">Additional Labor Details</h3>
        <p className="text-sm text-gray-600">
          Fill out the additional details for this timesheet to report more
          accurate labor logs.
        </p>
      </div>
      {laborLogs.map((log, idx) => (
        <div key={idx} className="flex gap-4 items-end py-2 mb-4 border-b pb-4">
          <Combobox
            options={equipmentOptions}
            value={log.equipment.id}
            onChange={(val, option) => {
              const updated = [...laborLogs];
              updated[idx].equipment = option
                ? { id: option.value, name: option.label }
                : { id: "", name: "" };
              setLaborLogs(updated);
            }}
            placeholder="Select Equipment"
          />
          <Input
            type="time"
            placeholder="Start Time"
            value={log.startTime}
            onChange={(e) => {
              const updated = [...laborLogs];
              updated[idx].startTime = e.target.value;
              setLaborLogs(updated);
            }}
            className="w-[120px]"
          />
          <Input
            type="time"
            placeholder="End Time"
            value={log.endTime}
            onChange={(e) => {
              const updated = [...laborLogs];
              updated[idx].endTime = e.target.value;
              setLaborLogs(updated);
            }}
            className="w-[120px]"
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            onClick={() => setLaborLogs(laborLogs.filter((_, i) => i !== idx))}
          >
            <img src="/trash.svg" alt="Delete" className="w-4 h-4" />
          </Button>
        </div>
      ))}
      <Button
        type="button"
        onClick={() =>
          setLaborLogs([
            ...laborLogs,
            {
              equipment: { id: "", name: "" },
              startTime: "",
              endTime: "",
            },
          ])
        }
      >
        Add Labor Log
      </Button>
    </div>
  );
}
