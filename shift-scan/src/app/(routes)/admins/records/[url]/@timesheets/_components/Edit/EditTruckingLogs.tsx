import React from "react";
import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combobox";
import { Input } from "@/components/ui/input";
import { StateOptions } from "@/data/stateValues";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

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
  handleNestedLogChange: (
    logIndex: number,
    nestedType: string,
    nestedIndex: number,
    field: string,
    value: any
  ) => void;
  originalLogs?: TruckingLog[];
  onUndoLogField?: (idx: number, field: keyof TruckingLog) => void;
  equipmentOptions: {
    value: string;
    label: string;
  }[];
  jobsiteOptions: {
    value: string;
    label: string;
  }[];
  addEquipmentHauled: (logIdx: number) => void;
  deleteEquipmentHauled: (logIdx: number, eqIdx: number) => void;
  addMaterial: (logIdx: number) => void;
  deleteMaterial: (logIdx: number, matIdx: number) => void;
  addRefuelLog: (logIdx: number) => void;
  deleteRefuelLog: (logIdx: number, refIdx: number) => void;
  addStateMileage: (logIdx: number) => void;
  deleteStateMileage: (logIdx: number, stateIdx: number) => void;
}

export const EditTruckingLogs: React.FC<EditTruckingLogsProps> = ({
  logs,
  onLogChange,
  handleNestedLogChange,
  originalLogs = [],
  onUndoLogField,
  equipmentOptions = [],
  jobsiteOptions = [],
  addEquipmentHauled,
  deleteEquipmentHauled,
  addMaterial,
  deleteMaterial,
  addRefuelLog,
  deleteRefuelLog,
  addStateMileage,
  deleteStateMileage,
}) => {
  return (
    <div className="col-span-2 mt-4">
      <h3 className="font-semibold text-sm mb-2">Trucking Logs</h3>
      {logs.map((log, idx) => (
        <div key={log.id} className="border rounded p-2 mb-6">
          <div className="flex flex-row items-end  gap-3 mb-2">
            <div className="flex flex-row items-end gap-x-2">
              <div className="flex-1">
                <label className="block text-xs mb-1">Equipment ID</label>
                <Combobox
                  options={equipmentOptions}
                  value={log.equipmentId}
                  onChange={(val) => onLogChange(idx, "equipmentId", val)}
                  placeholder="Select equipment"
                  filterKeys={["label", "value"]}
                />
              </div>

              {originalLogs[idx] &&
                log.equipmentId !== originalLogs[idx].equipmentId &&
                onUndoLogField && (
                  <div className="w-fit mr-4">
                    <Button
                      type="button"
                      size="default"
                      className="w-fit"
                      onClick={() => onUndoLogField(idx, "equipmentId")}
                    >
                      Undo
                    </Button>
                  </div>
                )}
            </div>

            <div className="flex flex-row items-end gap-x-2">
              <div className="flex-1">
                <label className="block text-xs">Starting Mileage</label>
                <Input
                  type="number"
                  value={log.startingMileage}
                  onChange={(e) =>
                    onLogChange(idx, "startingMileage", Number(e.target.value))
                  }
                  className="w-[200px]"
                  onBlur={(e) => {
                    let value = e.target.value;
                    if (/^0+\d+/.test(value)) {
                      value = String(Number(value));
                      onLogChange(idx, "startingMileage", Number(value));
                      e.target.value = value;
                    }
                  }}
                />
              </div>
              {originalLogs[idx] &&
                log.startingMileage !== originalLogs[idx].startingMileage &&
                onUndoLogField && (
                  <div className="w-fit mr-4">
                    <Button
                      type="button"
                      size="sm"
                      className="w-fit"
                      onClick={() => onUndoLogField(idx, "startingMileage")}
                    >
                      Undo
                    </Button>
                  </div>
                )}
            </div>

            <div className="flex flex-row items-end gap-x-2">
              <div className="flex-1">
                <label className="block text-xs">Ending Mileage</label>
                <Input
                  type="number"
                  value={log.endingMileage}
                  onChange={(e) =>
                    onLogChange(idx, "endingMileage", Number(e.target.value))
                  }
                  className="w-[200px]"
                  onBlur={(e) => {
                    let value = e.target.value;
                    if (/^0+\d+/.test(value)) {
                      value = String(Number(value));
                      onLogChange(idx, "endingMileage", Number(value));
                      e.target.value = value;
                    }
                    if (Number(value) < log.startingMileage) {
                      e.target.setCustomValidity(
                        "Ending mileage cannot be less than starting mileage"
                      );
                    } else {
                      e.target.setCustomValidity("");
                    }
                  }}
                />
              </div>
              {originalLogs[idx] &&
                log.endingMileage !== originalLogs[idx].endingMileage &&
                onUndoLogField && (
                  <div className="w-fit ">
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => onUndoLogField(idx, "endingMileage")}
                    >
                      Undo
                    </Button>
                  </div>
                )}
            </div>
          </div>
          {log.startingMileage > log.endingMileage && (
            <p className="text-xs text-red-500 mt-1">
              Starting Mileage cannot be greater than Ending Mileage.
            </p>
          )}
          {/* Equipment Hauled */}
          <div className="flex flex-row justify-between items-center my-2">
            <div className="flex-1">
              <p className="block font-semibold text-sm">Equipment Hauled</p>
              <p className="text-xs text-gray-500 pt-1 ">
                This section logs the equipment hauled and the destination it
                was delivered to.
              </p>
            </div>
            <div className="flex justify-end">
              <Button
                size="icon"
                type="button"
                onClick={() => addEquipmentHauled(idx)}
              >
                <img src="/plus-white.svg" alt="add" className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <div className="border-b py-2">
            {log.EquipmentHauled.map((eq, eqIdx) => (
              <div key={eq.id || eqIdx} className="flex flex-row gap-4 mb-3">
                <div className="flex items-end">
                  <Combobox
                    font={"font-normal"}
                    label="Equipment ID"
                    options={equipmentOptions}
                    value={eq.equipmentId}
                    onChange={(val) =>
                      handleNestedLogChange(
                        idx,
                        "EquipmentHauled",
                        eqIdx,
                        "equipmentId",
                        val
                      )
                    }
                    placeholder="Select equipment"
                    filterKeys={["label", "value"]}
                  />
                </div>
                <div className="flex items-end">
                  <Combobox
                    font={"font-normal"}
                    label="Jobsite"
                    options={jobsiteOptions}
                    value={eq.jobSiteId}
                    onChange={(val) =>
                      handleNestedLogChange(
                        idx,
                        "EquipmentHauled",
                        eqIdx,
                        "jobSiteId",
                        val
                      )
                    }
                    placeholder="Select jobsite"
                    filterKeys={["label", "value"]}
                  />
                </div>
                <div className="flex items-end">
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={() => deleteEquipmentHauled(idx, eqIdx)}
                  >
                    <img src="/trash.svg" alt="remove" className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Materials */}

          <div className="flex flex-row justify-between items-center my-2">
            <div className="flex-1">
              <p className="block font-semibold text-sm">Materials Hauled</p>
              <p className="text-xs text-gray-500 pt-1 ">
                This section logs the materials hauled and where they were taken
                from.
              </p>
            </div>
            <div className="flex justify-end">
              <Button
                size="icon"
                type="button"
                onClick={() => addMaterial(idx)}
              >
                <img src="/plus-white.svg" alt="add" className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <div className="border-b py-2">
            {log.Materials.map((mat, matIdx) => (
              <div key={mat.id || matIdx} className="mt-2 ">
                <div className="flex flex-row gap-4 mb-2">
                  <Input
                    type="text"
                    placeholder="Location"
                    value={mat.LocationOfMaterial}
                    onChange={(e) =>
                      handleNestedLogChange(
                        idx,
                        "Materials",
                        matIdx,
                        "LocationOfMaterial",
                        e.target.value
                      )
                    }
                    className="w-[200px]"
                  />
                  <Input
                    type="text"
                    placeholder="Material Name"
                    value={mat.name}
                    onChange={(e) =>
                      handleNestedLogChange(
                        idx,
                        "Materials",
                        matIdx,
                        "name",
                        e.target.value
                      )
                    }
                    className="w-[200px]"
                  />
                  <Input
                    type="number"
                    placeholder="Material Weight"
                    value={mat.materialWeight}
                    onChange={(e) =>
                      handleNestedLogChange(
                        idx,
                        "Materials",
                        matIdx,
                        "materialWeight",
                        e.target.value
                      )
                    }
                    className="w-[200px]"
                  />
                </div>
                <div className="flex flex-row gap-4 mb-2">
                  <Input
                    type="number"
                    placeholder="Light Weight"
                    value={mat.lightWeight}
                    onChange={(e) =>
                      handleNestedLogChange(
                        idx,
                        "Materials",
                        matIdx,
                        "lightWeight",
                        e.target.value
                      )
                    }
                    className="w-[200px]"
                  />
                  <Input
                    type="number"
                    placeholder="Gross Weight"
                    value={mat.grossWeight}
                    onChange={(e) =>
                      handleNestedLogChange(
                        idx,
                        "Materials",
                        matIdx,
                        "grossWeight",
                        e.target.value
                      )
                    }
                    className="w-[200px]"
                  />
                  <Select
                    value={mat.loadType}
                    onValueChange={(val) =>
                      handleNestedLogChange(
                        idx,
                        "Materials",
                        matIdx,
                        "loadType",
                        val
                      )
                    }
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
                      onClick={() => deleteMaterial(idx, matIdx)}
                    >
                      <img src="/trash.svg" alt="remove" className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Refuel Logs */}

          <div className="flex flex-row justify-between items-center my-2">
            <div className="flex-1">
              <p className="block font-semibold text-sm">Refuel Logs</p>
              <p className="text-xs text-gray-500 pt-1 ">
                This section logs the refueling events and the associated
                mileage.
              </p>
            </div>
            <div className="flex justify-end">
              <Button
                size="icon"
                type="button"
                onClick={() => addRefuelLog(idx)}
              >
                <img src="/plus-white.svg" alt="add" className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <div className="border-b py-2">
            {log.RefuelLogs.map((ref, refIdx) => (
              <div key={ref.id || refIdx} className="flex gap-4 mb-2 items-end">
                <Input
                  type="number"
                  placeholder="Total Gallons"
                  value={ref.gallonsRefueled}
                  onChange={(e) =>
                    handleNestedLogChange(
                      idx,
                      "RefuelLogs",
                      refIdx,
                      "gallonsRefueled",
                      e.target.value
                    )
                  }
                  className="w-[200px]"
                />
                <Input
                  type="number"
                  placeholder="Current Mileage"
                  value={ref.milesAtFueling}
                  onChange={(e) =>
                    handleNestedLogChange(
                      idx,
                      "RefuelLogs",
                      refIdx,
                      "milesAtFueling",
                      e.target.value
                    )
                  }
                  className="w-[200px]"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  onClick={() => deleteRefuelLog(idx, refIdx)}
                >
                  <img src="/trash.svg" alt="remove" className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
          {/* State Line Mileage */}
          <div className="flex flex-row justify-between items-center my-2">
            <div className="flex-1">
              <p className="block font-semibold text-sm"> State Line Mileage</p>
              <p className="text-xs text-gray-500 pt-1 ">
                This section logs the state line mileage and where the truck
                crossed state lines.
              </p>
            </div>
            <div className="flex justify-end">
              <Button
                size="icon"
                type="button"
                onClick={() => addStateMileage(idx)}
              >
                <img src="/plus-white.svg" alt="add" className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <div className="pt-2">
            {log.StateMileages.map((sm, smIdx) => (
              <div key={sm.id || smIdx} className="flex gap-4 mb-2 items-end">
                <Select
                  value={sm.state}
                  onValueChange={(val) =>
                    handleNestedLogChange(
                      idx,
                      "StateMileages",
                      smIdx,
                      "state",
                      val
                    )
                  }
                >
                  <SelectTrigger className="w-[200px]">
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
                  onChange={(e) =>
                    handleNestedLogChange(
                      idx,
                      "StateMileages",
                      smIdx,
                      "stateLineMileage",
                      e.target.value
                    )
                  }
                  className="w-[200px]"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  onClick={() => deleteStateMileage(idx, smIdx)}
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
};
