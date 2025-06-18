import { Combobox } from "@/components/ui/combobox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import React from "react";

export type MaintenanceLogDraft = {
  startTime: string;
  endTime: string;
  equipmentId: string;
  equipmentName: string;
};

type Props = {
  maintenanceLogs: MaintenanceLogDraft[];
  setMaintenanceLogs: React.Dispatch<
    React.SetStateAction<MaintenanceLogDraft[]>
  >;
  maintenanceEquipmentOptions: { value: string; label: string }[];
};

export function MaintenanceSection({
  maintenanceLogs,
  setMaintenanceLogs,
  maintenanceEquipmentOptions,
}: Props) {
  return (
    <div className="col-span-2 border-t-2 border-black pt-4 pb-2">
      <div className="mb-4">
        <h3 className="font-semibold text-xl mb-1">
          Additional Maintenance Details
        </h3>
        <p className="text-sm text-gray-600">
          Fill out the additional details for this timesheet to report more
          accurate maintenance logs.
        </p>
      </div>
      {maintenanceLogs.map((log, idx) => (
        <div key={idx} className="flex flex-col gap-6 mb-4 border-b pb-4">
          <div className="flex gap-4 items-end py-2">
            <Combobox
              label="Equipment"
              options={maintenanceEquipmentOptions}
              value={log.equipmentId}
              onChange={(val, option) => {
                const updated = [...maintenanceLogs];
                updated[idx].equipmentId = val;
                updated[idx].equipmentName = option ? option.label : "";
                setMaintenanceLogs(updated);
              }}
              placeholder="Select equipment"
              filterKeys={["label", "value"]}
            />
            <Input
              type="time"
              placeholder="Start Time"
              value={log.startTime}
              onChange={(e) => {
                const updated = [...maintenanceLogs];
                updated[idx].startTime = e.target.value;
                setMaintenanceLogs(updated);
              }}
              required
              className="w-[120px]"
            />
            <Input
              type="time"
              placeholder="End Time"
              value={log.endTime}
              onChange={(e) => {
                const updated = [...maintenanceLogs];
                updated[idx].endTime = e.target.value;
                setMaintenanceLogs(updated);
              }}
              className="w-[120px]"
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              onClick={() =>
                setMaintenanceLogs(maintenanceLogs.filter((_, i) => i !== idx))
              }
            >
              <img src="/trash.svg" alt="Delete" className="w-4 h-4" />
            </Button>
          </div>
        </div>
      ))}
      <Button
        type="button"
        onClick={() =>
          setMaintenanceLogs([
            ...maintenanceLogs,
            {
              startTime: "",
              endTime: "",
              equipmentId: "",
              equipmentName: "",
            },
          ])
        }
      >
        Add Maintenance Log
      </Button>
    </div>
  );
}
