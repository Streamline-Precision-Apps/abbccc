import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { StateOptions } from "@/data/stateValues";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import React from "react";
import { SingleCombobox } from "@/components/ui/single-combobox";

export type TruckingMaterialDraft = {
  location: string;
  name: string;
  quantity: string;
  unit: "TONS" | "YARDS" | "";
  // materialWeight: string;
  loadType: "SCREENED" | "UNSCREENED" | "";
};
export type TruckingLogDraft = {
  equipmentId: string;
  truckNumber: string;
  trailerNumber: string | null;
  startingMileage: string;
  endingMileage: string;
  equipmentHauled: {
    equipment: { id: string; name: string };
    source: string | null;
    destination: string | null;
    startMileage: string;
    endMileage: string;
  }[];
  materials: TruckingMaterialDraft[];
  refuelLogs: { gallonsRefueled: string; milesAtFueling: string }[];
  stateMileages: { state: string; stateLineMileage: string }[];
};

type Props = {
  truckingLogs: TruckingLogDraft[];
  setTruckingLogs: React.Dispatch<React.SetStateAction<TruckingLogDraft[]>>;
  equipmentOptions: { value: string; label: string }[];
  truckOptions: { value: string; label: string }[];
  trailerOptions: { value: string; label: string }[];
  jobsiteOptions: { value: string; label: string }[];
};

export function TruckingSection({
  truckOptions,
  trailerOptions,
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
          <div className="flex flex-col gap-4 py-2">
            <div className="w-[350px]">
              <SingleCombobox
                options={truckOptions}
                value={log.truckNumber}
                onChange={(val, option) => {
                  const updated = [...truckingLogs];
                  updated[idx].truckNumber = val;
                  setTruckingLogs(updated);
                }}
                placeholder={`Select Truck*`}
                filterKeys={["label", "value"]}
              />
            </div>
            <div className="w-[350px]">
              <SingleCombobox
                options={trailerOptions}
                value={log.trailerNumber || ""}
                onChange={(val, option) => {
                  const updated = [...truckingLogs];
                  updated[idx].trailerNumber = val;
                  setTruckingLogs(updated);
                }}
                placeholder={`Select Trailer`}
                filterKeys={["label", "value"]}
              />
            </div>
            <Input
              type="number"
              placeholder="Beginning Mileage*"
              value={log.startingMileage}
              onChange={(e) => {
                const updated = [...truckingLogs];
                updated[idx].startingMileage = e.target.value;
                setTruckingLogs(updated);
              }}
              className="w-[300px]"
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
              className="w-[300px]"
            />
          </div>
          {/* Equipment Hauled */}
          <div className="py-4 border-b mb-2">
            <div className="flex flex-row justify-between items-center mb-4">
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
                      source: "",
                      destination: "",
                      startMileage: "",
                      endMileage: "",
                    });
                    setTruckingLogs(updated);
                  }}
                >
                  <img src="/plus-white.svg" alt="add" className="w-4 h-4" />
                </Button>
              </div>
            </div>
            {log.equipmentHauled.map((eq, eqIdx) => (
              <div
                key={eqIdx}
                className="flex flex-col gap-4 mb-2 rounded p-4 border relative"
              >
                <div className="w-[350px]">
                  <SingleCombobox
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
                </div>
                <Input
                  type="text"
                  placeholder="Source Location"
                  value={eq.source || ""}
                  onChange={(e) => {
                    const updated = [...truckingLogs];
                    updated[idx].equipmentHauled[eqIdx].source = e.target.value;
                    setTruckingLogs(updated);
                  }}
                  className="w-[350px]"
                />

                <Input
                  type="text"
                  placeholder="Destination Location"
                  value={eq.destination || ""}
                  onChange={(e) => {
                    const updated = [...truckingLogs];
                    updated[idx].equipmentHauled[eqIdx].destination =
                      e.target.value;
                    setTruckingLogs(updated);
                  }}
                  className="w-[350px]"
                />

                <Input
                  type="number"
                  placeholder="Starting Overweight Mileage*"
                  value={eq.startMileage}
                  onChange={(e) => {
                    const updated = [...truckingLogs];
                    updated[idx].equipmentHauled[eqIdx].startMileage =
                      e.target.value;
                    setTruckingLogs(updated);
                  }}
                  className="w-[350px]"
                />
                <Input
                  type="number"
                  placeholder="Ending Overweight Mileage*"
                  value={eq.endMileage}
                  onChange={(e) => {
                    const updated = [...truckingLogs];
                    updated[idx].equipmentHauled[eqIdx].endMileage =
                      e.target.value;
                    setTruckingLogs(updated);
                  }}
                  className="w-[350px]"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2"
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
            <div className="flex flex-row justify-between items-center mb-4">
              <label className="block font-semibold text-md ">Materials</label>
              <Button
                size="icon"
                type="button"
                onClick={() => {
                  const updated = [...truckingLogs];
                  updated[idx].materials.push({
                    location: "",
                    name: "",
                    quantity: "",
                    unit: "",
                    loadType: "",
                  });
                  setTruckingLogs(updated);
                }}
              >
                <img src="/plus-white.svg" alt="add" className="w-4 h-4" />
              </Button>
            </div>
            {log.materials.map((mat, matIdx) => (
              <div key={matIdx} className="mt-2 rounded p-4 border relative">
                <div className="flex flex-col gap-4 mb-2">
                  <Input
                    type="text"
                    placeholder="Material Name"
                    value={mat.name}
                    onChange={(e) => {
                      const updated = [...truckingLogs];
                      updated[idx].materials[matIdx].name = e.target.value;
                      setTruckingLogs(updated);
                    }}
                    className="w-[350px]"
                  />
                  <Input
                    type="text"
                    placeholder="Source of Material"
                    value={mat.location}
                    onChange={(e) => {
                      const updated = [...truckingLogs];
                      updated[idx].materials[matIdx].location = e.target.value;
                      setTruckingLogs(updated);
                    }}
                    className="w-[350px]"
                  />

                  <div className="flex gap-2 items-center">
                    <Input
                      type="number"
                      placeholder="Quantity"
                      value={mat.quantity}
                      onChange={(e) => {
                        const updated = [...truckingLogs];
                        updated[idx].materials[matIdx].quantity =
                          e.target.value;
                        setTruckingLogs(updated);
                      }}
                      className="w-[120px]"
                    />
                    <Select
                      value={mat.unit}
                      onValueChange={(val) => {
                        const updated = [...truckingLogs];
                        updated[idx].materials[matIdx].unit = val as
                          | "TONS"
                          | "YARDS"
                          | "";
                        setTruckingLogs(updated);
                      }}
                    >
                      <SelectTrigger className="w-[130px]">
                        <SelectValue placeholder="Unit" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="TONS">Tons</SelectItem>
                        <SelectItem value="YARDS">Yards</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Select
                    value={mat.loadType}
                    onValueChange={(val) => {
                      const updated = [...truckingLogs];
                      updated[idx].materials[matIdx].loadType = val as
                        | "SCREENED"
                        | "UNSCREENED"
                        | "";
                      setTruckingLogs(updated);
                    }}
                  >
                    <SelectTrigger className="w-[300px]">
                      <SelectValue placeholder="Load Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SCREENED">Screened</SelectItem>
                      <SelectItem value="UNSCREENED">Unscreened</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button
                    type="button"
                    size="icon"
                    variant="destructive"
                    className="absolute top-2 right-2"
                    onClick={() => {
                      const updated = [...truckingLogs];
                      updated[idx].materials = updated[idx].materials.filter(
                        (_, i) => i !== matIdx,
                      );
                      setTruckingLogs(updated);
                    }}
                  >
                    <img src="/trash.svg" alt="remove" className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          {/* Refuel Logs */}
          <div className="py-4 border-b mb-2">
            <div className="flex flex-row justify-between items-center mb-4">
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
              <div
                key={refIdx}
                className="flex flex-col gap-4 mb-2 border p-4 relative"
              >
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
                  className="w-[350px]"
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
                  className="w-[350px]"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={() => {
                    const updated = [...truckingLogs];
                    updated[idx].refuelLogs = updated[idx].refuelLogs.filter(
                      (_, i) => i !== refIdx,
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
          <div className="py-4  mb-2">
            <div className="flex flex-row justify-between items-center mb-4">
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
              <div
                key={smIdx}
                className="flex flex-col gap-4 mb-2 relative border p-4 rounded"
              >
                <Select
                  value={sm.state}
                  onValueChange={(val) => {
                    const updated = [...truckingLogs];
                    updated[idx].stateMileages[smIdx].state = val;
                    setTruckingLogs(updated);
                  }}
                >
                  <SelectTrigger className="w-[350px]">
                    <SelectValue placeholder="State" />
                  </SelectTrigger>
                  <SelectContent>
                    {StateOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                  className="w-[350px]"
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
                  className="absolute top-2 right-2"
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
