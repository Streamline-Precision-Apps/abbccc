import { Combobox } from "@/components/ui/combobox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import React from "react";

export type TruckingMaterialDraft = {
  location: string;
  name: string;
  materialWeight: string;
  lightWeight: string;
  grossWeight: string;
  loadType: "screened" | "unscreened" | "";
};
export type TruckingLogDraft = {
  equipmentId: string;
  startingMileage: string;
  endingMileage: string;
  equipmentHauled: {
    equipment: { id: string; name: string };
    jobsite: { id: string; name: string };
  }[];
  materials: TruckingMaterialDraft[];
  refuelLogs: { gallonsRefueled: string; milesAtFueling: string }[];
  stateMileages: { state: string; stateLineMileage: string }[];
};

type Props = {
  truckingLogs: TruckingLogDraft[];
  setTruckingLogs: React.Dispatch<React.SetStateAction<TruckingLogDraft[]>>;
  equipmentOptions: { value: string; label: string }[];
  jobsiteOptions: { value: string; label: string }[];
};

export function TruckingSection({
  truckingLogs,
  setTruckingLogs,
  equipmentOptions,
  jobsiteOptions,
}: Props) {
  // ...existing code for rendering trucking logs UI, using the props above...
  // Copy the JSX and logic for the Trucking section from the main modal, replacing state/handlers with props
  return (
    <div className="col-span-2 border-t-2 border-black pt-4 pb-2">
      <div className="mb-4">
        <h3 className="font-semibold text-xl mb-1">
          Additional Trucking Details
        </h3>
        <p className="text-sm text-gray-600">
          Fill out the additional details for this timesheet to report more
          accurate trucking logs.
        </p>
      </div>
      {truckingLogs.map((log, idx) => (
        <div key={idx} className="flex flex-col gap-6 mb-4 border-b pb-4">
          <div className="flex gap-4 items-end py-2">
            <Combobox
              options={equipmentOptions}
              value={log.equipmentId}
              onChange={(val, option) => {
                const updated = [...truckingLogs];
                updated[idx].equipmentId = val;
                setTruckingLogs(updated);
              }}
              placeholder={`Select Vehicle*`}
              filterKeys={["label", "value"]}
            />
            <Input
              type="number"
              placeholder="Beginning Mileage*"
              value={log.startingMileage}
              onChange={(e) => {
                const updated = [...truckingLogs];
                updated[idx].startingMileage = e.target.value;
                setTruckingLogs(updated);
              }}
              className="w-[200px]"
            />
            <Input
              type="number"
              placeholder="End Mileage*"
              value={log.endingMileage}
              onChange={(e) => {
                const updated = [...truckingLogs];
                updated[idx].endingMileage = e.target.value;
                setTruckingLogs(updated);
              }}
              className="w-[200px]"
            />
          </div>
          {/* Equipment Hauled */}
          <div className="py-4 border-b mb-2">
            <div className="flex flex-row justify-between items-center mb-2">
              <label className="block font-semibold text-md">
                Equipment Hauled
              </label>
              <div className="flex justify-end">
                <Button
                  size="icon"
                  type="button"
                  onClick={() => {
                    const updated = [...truckingLogs];
                    updated[idx].equipmentHauled.push({
                      equipment: { id: "", name: "" },
                      jobsite: { id: "", name: "" },
                    });
                    setTruckingLogs(updated);
                  }}
                >
                  <img src="/plus-white.svg" alt="add" className="w-4 h-4" />
                </Button>
              </div>
            </div>
            {log.equipmentHauled.map((eq, eqIdx) => (
              <div key={eqIdx} className="flex gap-4 mb-2">
                <Combobox
                  options={equipmentOptions}
                  value={eq.equipment.id}
                  onChange={(val, option) => {
                    const updated = [...truckingLogs];
                    updated[idx].equipmentHauled[eqIdx].equipment = option
                      ? { id: option.value, name: option.label }
                      : { id: "", name: "" };
                    setTruckingLogs(updated);
                  }}
                  placeholder="Select equipment"
                  filterKeys={["label", "value"]}
                />
                <Combobox
                  options={jobsiteOptions}
                  value={eq.jobsite.id}
                  onChange={(val, option) => {
                    const updated = [...truckingLogs];
                    updated[idx].equipmentHauled[eqIdx].jobsite = option
                      ? { id: option.value, name: option.label }
                      : { id: "", name: "" };
                    setTruckingLogs(updated);
                  }}
                  placeholder="Select jobsite"
                  filterKeys={["label", "value"]}
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  onClick={() => {
                    const updated = [...truckingLogs];
                    updated[idx].equipmentHauled = updated[
                      idx
                    ].equipmentHauled.filter((_, i) => i !== eqIdx);
                    setTruckingLogs(updated);
                  }}
                >
                  <img src="/trash.svg" alt="remove" className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
          {/* Materials */}
          <div className="py-4 border-b mb-2">
            <div className="flex flex-row justify-between items-center mb-2">
              <label className="block font-semibold text-md ">Materials</label>
              <Button
                size="icon"
                type="button"
                onClick={() => {
                  const updated = [...truckingLogs];
                  updated[idx].materials.push({
                    location: "",
                    name: "",
                    materialWeight: "",
                    lightWeight: "",
                    grossWeight: "",
                    loadType: "",
                  });
                  setTruckingLogs(updated);
                }}
              >
                <img src="/plus-white.svg" alt="add" className="w-4 h-4" />
              </Button>
            </div>
            {log.materials.map((mat, matIdx) => (
              <div key={matIdx} className="mt-2 ">
                <div className="flex flex-row gap-4 mb-2">
                  <Input
                    type="text"
                    placeholder="Location"
                    value={mat.location}
                    onChange={(e) => {
                      const updated = [...truckingLogs];
                      updated[idx].materials[matIdx].location = e.target.value;
                      setTruckingLogs(updated);
                    }}
                    className="w-[200px]"
                  />
                  <Input
                    type="text"
                    placeholder="Material Name"
                    value={mat.name}
                    onChange={(e) => {
                      const updated = [...truckingLogs];
                      updated[idx].materials[matIdx].name = e.target.value;
                      setTruckingLogs(updated);
                    }}
                    className="w-[200px]"
                  />
                  <Input
                    type="number"
                    placeholder="Material Weight"
                    value={mat.materialWeight}
                    onChange={(e) => {
                      const updated = [...truckingLogs];
                      updated[idx].materials[matIdx].materialWeight =
                        e.target.value;
                      setTruckingLogs(updated);
                    }}
                    className="w-[200px]"
                  />
                </div>
                <div className="flex flex-row gap-4 mb-2">
                  <Input
                    type="number"
                    placeholder="Light Weight"
                    value={mat.lightWeight}
                    onChange={(e) => {
                      const updated = [...truckingLogs];
                      updated[idx].materials[matIdx].lightWeight =
                        e.target.value;
                      setTruckingLogs(updated);
                    }}
                    className="w-[200px]"
                  />
                  <Input
                    type="number"
                    placeholder="Gross Weight"
                    value={mat.grossWeight}
                    onChange={(e) => {
                      const updated = [...truckingLogs];
                      updated[idx].materials[matIdx].grossWeight =
                        e.target.value;
                      setTruckingLogs(updated);
                    }}
                    className="w-[200px]"
                  />
                  <Select
                    value={mat.loadType}
                    onValueChange={(val) => {
                      const updated = [...truckingLogs];
                      updated[idx].materials[matIdx].loadType = val as
                        | "screened"
                        | "unscreened";
                      setTruckingLogs(updated);
                    }}
                  >
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Load Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="screened">Screened</SelectItem>
                      <SelectItem value="unscreened">Unscreened</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="flex justify-end ">
                    <Button
                      type="button"
                      size="icon"
                      variant="destructive"
                      onClick={() => {
                        const updated = [...truckingLogs];
                        updated[idx].materials = updated[idx].materials.filter(
                          (_, i) => i !== matIdx
                        );
                        setTruckingLogs(updated);
                      }}
                    >
                      <img src="/trash.svg" alt="remove" className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* Refuel Logs */}
          <div className="py-4 border-b mb-2">
            <div className="flex flex-row justify-between items-center mb-2">
              <label className="block font-semibold text-md">Refuel Logs</label>
              <Button
                type="button"
                size="icon"
                onClick={() => {
                  const updated = [...truckingLogs];
                  updated[idx].refuelLogs.push({
                    gallonsRefueled: "",
                    milesAtFueling: "",
                  });
                  setTruckingLogs(updated);
                }}
              >
                <img src="/plus-white.svg" alt="add" className="w-4 h-4" />
              </Button>
            </div>
            {log.refuelLogs.map((ref, refIdx) => (
              <div key={refIdx} className="flex gap-4 mb-2 items-end">
                <Input
                  type="number"
                  placeholder="Total Gallons"
                  value={ref.gallonsRefueled}
                  onChange={(e) => {
                    const updated = [...truckingLogs];
                    updated[idx].refuelLogs[refIdx].gallonsRefueled =
                      e.target.value;
                    setTruckingLogs(updated);
                  }}
                  className="w-[200px]"
                />
                <Input
                  type="number"
                  placeholder="Current Mileage"
                  value={ref.milesAtFueling}
                  onChange={(e) => {
                    const updated = [...truckingLogs];
                    updated[idx].refuelLogs[refIdx].milesAtFueling =
                      e.target.value;
                    setTruckingLogs(updated);
                  }}
                  className="w-[200px]"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  onClick={() => {
                    const updated = [...truckingLogs];
                    updated[idx].refuelLogs = updated[idx].refuelLogs.filter(
                      (_, i) => i !== refIdx
                    );
                    setTruckingLogs(updated);
                  }}
                >
                  <img src="/trash.svg" alt="remove" className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
          {/* State Line Mileage */}
          <div className="py-4 border-b mb-2">
            <div className="flex flex-row justify-between items-center mb-2">
              <label className="block font-semibold text-md">
                State Line Mileage
              </label>
              <Button
                type="button"
                size="icon"
                onClick={() => {
                  const updated = [...truckingLogs];
                  updated[idx].stateMileages.push({
                    state: "",
                    stateLineMileage: "",
                  });
                  setTruckingLogs(updated);
                }}
                className="ml-2"
              >
                <img src="/plus-white.svg" alt="add" className="w-4 h-4" />
              </Button>
            </div>
            {log.stateMileages.map((sm, smIdx) => (
              <div key={smIdx} className="flex gap-4 mb-2 items-end">
                <Input
                  type="text"
                  placeholder="State"
                  value={sm.state}
                  onChange={(e) => {
                    const updated = [...truckingLogs];
                    updated[idx].stateMileages[smIdx].state = e.target.value;
                    setTruckingLogs(updated);
                  }}
                  className="w-[200px]"
                />
                <Input
                  type="number"
                  placeholder="State Line Mileage"
                  value={sm.stateLineMileage}
                  onChange={(e) => {
                    const updated = [...truckingLogs];
                    updated[idx].stateMileages[smIdx].stateLineMileage =
                      e.target.value;
                    setTruckingLogs(updated);
                  }}
                  className="w-[200px]"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  onClick={() => {
                    const updated = [...truckingLogs];
                    updated[idx].stateMileages = updated[
                      idx
                    ].stateMileages.filter((_, i) => i !== smIdx);
                    setTruckingLogs(updated);
                  }}
                  className="ml-2"
                >
                  <img src="/trash.svg" alt="remove" className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
