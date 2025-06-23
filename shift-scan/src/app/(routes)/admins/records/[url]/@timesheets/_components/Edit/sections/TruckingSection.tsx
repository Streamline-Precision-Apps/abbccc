import { Combobox } from "@/components/ui/combobox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
  return (
    <div className="col-span-2 border-t-2 border-black pt-4 pb-2">
      <div className="mb-4">
        <h3 className="font-semibold text-xl mb-1">Trucking Details</h3>
        <p className="text-sm text-gray-600">
          Edit or add trucking logs for this timesheet.
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
            <Button
              type="button"
              variant="destructive"
              size="icon"
              onClick={() =>
                setTruckingLogs(truckingLogs.filter((_, i) => i !== idx))
              }
            >
              <img
                src="/trash.svg"
                alt="Delete Trucking Log"
                className="w-4 h-4"
              />
            </Button>
          </div>
          {/* Equipment Hauled */}
          <div className="py-4 border-b mb-2">
            <div className="flex flex-row justify-between items-center mb-2">
              <label className="block font-semibold text-md">Equipment Hauled</label>
              <Button
                size="icon"
                type="button"
                onClick={() => {
                  const updated = [...truckingLogs];
                  if (!updated[idx].equipmentHauled) updated[idx].equipmentHauled = [];
                  updated[idx].equipmentHauled.push({
                    equipment: { id: '', name: '' },
                    jobsite: { id: '', name: '' },
                  });
                  setTruckingLogs(updated);
                }}
              >
                <img src="/plus-white.svg" alt="add" className="w-4 h-4" />
              </Button>
            </div>
            {(log.equipmentHauled || []).map((eh, ehIdx) => (
              <div key={ehIdx} className="flex gap-2 mb-2">
                <Combobox
                  options={equipmentOptions}
                  value={eh.equipment.id}
                  onChange={(val, option) => {
                    const updated = [...truckingLogs];
                    updated[idx].equipmentHauled[ehIdx].equipment = option
                      ? { id: option.value, name: option.label }
                      : { id: "", name: "" };
                    setTruckingLogs(updated);
                  }}
                  placeholder="Select Equipment"
                />
                <Combobox
                  options={jobsiteOptions}
                  value={eh.jobsite.id}
                  onChange={(val, option) => {
                    const updated = [...truckingLogs];
                    updated[idx].equipmentHauled[ehIdx].jobsite = option
                      ? { id: option.value, name: option.label }
                      : { id: "", name: "" };
                    setTruckingLogs(updated);
                  }}
                  placeholder="Select Jobsite"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  onClick={() => {
                    const updated = [...truckingLogs];
                    updated[idx].equipmentHauled = updated[
                      idx
                    ].equipmentHauled.filter((_, i) => i !== ehIdx);
                    setTruckingLogs(updated);
                  }}
                >
                  <img src="/trash.svg" alt="Delete" className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
          {/* Materials */}
          <div className="py-4 border-b mb-2">
            <div className="flex flex-row justify-between items-center mb-2">
              <label className="block font-semibold text-md">Materials</label>
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
              <div key={matIdx} className="flex gap-2 mb-2">
                <Input
                  type="text"
                  placeholder="Name"
                  value={mat.name}
                  onChange={(e) => {
                    const updated = [...truckingLogs];
                    updated[idx].materials[matIdx].name = e.target.value;
                    setTruckingLogs(updated);
                  }}
                  className="w-[120px]"
                />
                <Input
                  type="text"
                  placeholder="Location"
                  value={mat.location}
                  onChange={(e) => {
                    const updated = [...truckingLogs];
                    updated[idx].materials[matIdx].location = e.target.value;
                    setTruckingLogs(updated);
                  }}
                  className="w-[120px]"
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
                  className="w-[120px]"
                />
                <Input
                  type="number"
                  placeholder="Light Weight"
                  value={mat.lightWeight}
                  onChange={(e) => {
                    const updated = [...truckingLogs];
                    updated[idx].materials[matIdx].lightWeight = e.target.value;
                    setTruckingLogs(updated);
                  }}
                  className="w-[120px]"
                />
                <Input
                  type="number"
                  placeholder="Gross Weight"
                  value={mat.grossWeight}
                  onChange={(e) => {
                    const updated = [...truckingLogs];
                    updated[idx].materials[matIdx].grossWeight = e.target.value;
                    setTruckingLogs(updated);
                  }}
                  className="w-[120px]"
                />
                <Combobox
                  options={[
                    { value: "screened", label: "Screened" },
                    { value: "unscreened", label: "Unscreened" },
                  ]}
                  value={mat.loadType}
                  onChange={(val) => {
                    const updated = [...truckingLogs];
                    updated[idx].materials[matIdx].loadType = val as
                      | ""
                      | "screened"
                      | "unscreened";
                    setTruckingLogs(updated);
                  }}
                  placeholder="Load Type"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  onClick={() => {
                    const updated = [...truckingLogs];
                    updated[idx].materials = updated[idx].materials.filter(
                      (_, i) => i !== matIdx
                    );
                    setTruckingLogs(updated);
                  }}
                >
                  <img src="/trash.svg" alt="Delete" className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
          {/* Refuel Logs */}
          <div className="py-4 border-b mb-2">
            <div className="flex flex-row justify-between items-center mb-2">
              <label className="block font-semibold text-md">Refuel Logs</label>
              <Button
                size="icon"
                type="button"
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
            {log.refuelLogs.map((rf, rfIdx) => (
              <div key={rfIdx} className="flex gap-2 mb-2">
                <Input
                  type="number"
                  placeholder="Gallons Refueled"
                  value={rf.gallonsRefueled}
                  onChange={(e) => {
                    const updated = [...truckingLogs];
                    updated[idx].refuelLogs[rfIdx].gallonsRefueled =
                      e.target.value;
                    setTruckingLogs(updated);
                  }}
                  className="w-[120px]"
                />
                <Input
                  type="number"
                  placeholder="Miles at Fueling"
                  value={rf.milesAtFueling}
                  onChange={(e) => {
                    const updated = [...truckingLogs];
                    updated[idx].refuelLogs[rfIdx].milesAtFueling =
                      e.target.value;
                    setTruckingLogs(updated);
                  }}
                  className="w-[120px]"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  onClick={() => {
                    const updated = [...truckingLogs];
                    updated[idx].refuelLogs = updated[idx].refuelLogs.filter(
                      (_, i) => i !== rfIdx
                    );
                    setTruckingLogs(updated);
                  }}
                >
                  <img src="/trash.svg" alt="Delete" className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
          {/* State Mileages */}
          <div className="py-4 border-b mb-2">
            <div className="flex flex-row justify-between items-center mb-2">
              <label className="block font-semibold text-md">
                State Mileages
              </label>
              <Button
                size="icon"
                type="button"
                onClick={() => {
                  const updated = [...truckingLogs];
                  updated[idx].stateMileages.push({
                    state: "",
                    stateLineMileage: "",
                  });
                  setTruckingLogs(updated);
                }}
              >
                <img src="/plus-white.svg" alt="add" className="w-4 h-4" />
              </Button>
            </div>
            {log.stateMileages.map((sm, smIdx) => (
              <div key={smIdx} className="flex gap-2 mb-2">
                <Combobox
                  options={jobsiteOptions}
                  value={sm.state}
                  onChange={(val, option) => {
                    const updated = [...truckingLogs];
                    updated[idx].stateMileages[smIdx].state = val;
                    setTruckingLogs(updated);
                  }}
                  placeholder="State"
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
                  className="w-[120px]"
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
                >
                  <img src="/trash.svg" alt="Delete" className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      ))}
      <Button
        type="button"
        onClick={() =>
          setTruckingLogs([
            ...truckingLogs,
            {
              equipmentId: "",
              startingMileage: "",
              endingMileage: "",
              equipmentHauled: [
                {
                  equipment: { id: "", name: "" },
                  jobsite: { id: "", name: "" },
                },
              ],
              materials: [],
              refuelLogs: [{ gallonsRefueled: "", milesAtFueling: "" }],
              stateMileages: [{ state: "", stateLineMileage: "" }],
            },
          ])
        }
      >
        Add Trucking Log
      </Button>
    </div>
  );
}
