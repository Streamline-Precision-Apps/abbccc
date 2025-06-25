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
import {
  TruckingLog,
  TruckingNestedType,
  TruckingNestedTypeMap,
} from "./types";

interface EditTruckingLogsProps {
  logs: TruckingLog[];
  onLogChange: (idx: number, field: keyof TruckingLog, value: any) => void;
  handleNestedLogChange: <T extends TruckingNestedType>(
    logIndex: number,
    nestedType: T,
    nestedIndex: number,
    field: keyof TruckingNestedTypeMap[T],
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
  onUndoNestedLogField: <
    T extends TruckingNestedType,
    K extends keyof TruckingNestedTypeMap[T]
  >(
    logIdx: number,
    nestedType: T,
    nestedIdx: number,
    field: K
  ) => void;
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
  onUndoNestedLogField,
}) => {
  return (
    <div className="col-span-2 mt-4">
      <h3 className="font-semibold text-md mb-2">Trucking Logs</h3>
      {logs.map((log, idx) => (
        <div key={log.id} className=" rounded p-2 mb-6 ">
          <div className="flex flex-col gap-3 mb-2 border-b pb-3">
            <div className="flex flex-row items-end gap-x-2">
              <div className="min-w-[350px]">
                <label className="block text-xs">Equipment ID</label>
                <Combobox
                  font={"font-normal"}
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
                      className="w-fit "
                      onClick={() => onUndoLogField(idx, "equipmentId")}
                    >
                      <p className="text-xs">Undo</p>
                    </Button>
                  </div>
                )}
            </div>
            <div className="flex flex-row items-end gap-x-2">
              <div className="flex flex-row items-end gap-x-2 ">
                <div className="flex-1">
                  <label className="block text-xs">Starting Mileage</label>
                  <Input
                    type="number"
                    value={log.startingMileage > 0 ? log.startingMileage : ""}
                    onChange={(e) =>
                      onLogChange(
                        idx,
                        "startingMileage",
                        Number(e.target.value)
                      )
                    }
                    className="w-[160px] text-xs"
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
                        <p className="text-xs">Undo</p>
                      </Button>
                    </div>
                  )}
              </div>

              <div className="flex flex-row items-end gap-x-2">
                <div className="flex-1">
                  <label className="block text-xs">Ending Mileage</label>
                  <Input
                    type="number"
                    value={log.endingMileage > 0 ? log.endingMileage : ""}
                    onChange={(e) =>
                      onLogChange(idx, "endingMileage", Number(e.target.value))
                    }
                    className="w-[160px]"
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
                        <p className="text-xs">Undo</p>
                      </Button>
                    </div>
                  )}
              </div>
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
              <p className="block font-semibold text-base">Equipment Hauled</p>
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
              <div
                key={eq.id || eqIdx}
                className="flex flex-col gap-4 mb-3 border p-2 rounded relative"
              >
                <div className="flex flex-row items-end gap-x-2">
                  <div className="min-w-[350px] w-fit items-end">
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
                  {originalLogs[idx] &&
                    originalLogs[idx].EquipmentHauled?.[eqIdx]?.equipmentId !==
                      undefined &&
                    eq.equipmentId !==
                      originalLogs[idx].EquipmentHauled[eqIdx].equipmentId &&
                    onUndoNestedLogField && (
                      <div className="w-fit mr-4">
                        <Button
                          type="button"
                          size="default"
                          className="w-fit "
                          onClick={() =>
                            onUndoNestedLogField(
                              idx,
                              "EquipmentHauled",
                              eqIdx,
                              "equipmentId"
                            )
                          }
                        >
                          <p className="text-xs">Undo</p>
                        </Button>
                      </div>
                    )}
                </div>
                <div className="flex flex-row items-end gap-x-2">
                  <div className="min-w-[350px] w-fit items-end">
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
                  {originalLogs[idx] &&
                    originalLogs[idx].EquipmentHauled?.[eqIdx]?.jobSiteId !==
                      undefined &&
                    eq.jobSiteId !==
                      originalLogs[idx].EquipmentHauled[eqIdx].jobSiteId &&
                    onUndoNestedLogField && (
                      <div className="w-fit mr-4">
                        <Button
                          type="button"
                          size="default"
                          className="w-fit "
                          onClick={() =>
                            onUndoNestedLogField(
                              idx,
                              "EquipmentHauled",
                              eqIdx,
                              "jobSiteId"
                            )
                          }
                        >
                          <p className="text-xs">Undo</p>
                        </Button>
                      </div>
                    )}
                </div>
                <div className="flex items-end absolute right-2 top-2">
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
              <div
                key={mat.id || matIdx}
                className="mt-2 border p-2 rounded relative"
              >
                <div className="flex flex-col gap-4 mb-2">
                  <div className="flex flex-row gap-1 items-end">
                    <div>
                      <label htmlFor="LocationOfMaterial" className="text-xs ">
                        Location of Material
                      </label>
                      <Input
                        name="LocationOfMaterial"
                        type="text"
                        placeholder="Enter name of location"
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
                        className="w-[350px] text-xs"
                      />
                    </div>
                    {originalLogs[idx] &&
                      originalLogs[idx].Materials?.[matIdx]
                        ?.LocationOfMaterial !== undefined &&
                      mat.LocationOfMaterial !==
                        originalLogs[idx].Materials[matIdx]
                          .LocationOfMaterial &&
                      onUndoNestedLogField && (
                        <div className="w-fit ">
                          <Button
                            type="button"
                            size="default"
                            className="w-fit "
                            onClick={() =>
                              onUndoNestedLogField(
                                idx,
                                "Materials",
                                matIdx,
                                "LocationOfMaterial"
                              )
                            }
                          >
                            <p className="text-xs">Undo</p>
                          </Button>
                        </div>
                      )}
                  </div>
                  <div className="flex flex-row gap-1 items-end">
                    <div>
                      <label htmlFor="lightWeight" className="text-xs ">
                        Material Name
                      </label>
                      <Input
                        type="text"
                        placeholder="Enter Name"
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
                        className="w-[350px] text-xs"
                      />
                    </div>
                    {originalLogs[idx] &&
                      originalLogs[idx].Materials?.[matIdx]?.name !==
                        undefined &&
                      mat.name !== originalLogs[idx].Materials[matIdx].name &&
                      onUndoNestedLogField && (
                        <div className="w-fit ">
                          <Button
                            type="button"
                            size="default"
                            className="w-fit "
                            onClick={() =>
                              onUndoNestedLogField(
                                idx,
                                "Materials",
                                matIdx,
                                "name"
                              )
                            }
                          >
                            <p className="text-xs">Undo</p>
                          </Button>
                        </div>
                      )}
                  </div>
                  <div className="flex flex-row gap-1 items-end">
                    <div>
                      <label htmlFor="materialWeight" className="text-xs ">
                        Material Weight
                      </label>
                      <Input
                        name="materialWeight"
                        type="number"
                        placeholder="Enter Weight"
                        value={mat.materialWeight > 0 ? mat.materialWeight : ""}
                        onChange={(e) =>
                          handleNestedLogChange(
                            idx,
                            "Materials",
                            matIdx,
                            "materialWeight",
                            e.target.value
                          )
                        }
                        className="w-[350px] text-xs"
                      />
                    </div>
                    {originalLogs[idx] &&
                      originalLogs[idx].Materials?.[matIdx]?.materialWeight !==
                        undefined &&
                      mat.materialWeight !==
                        originalLogs[idx].Materials[matIdx].materialWeight &&
                      onUndoNestedLogField && (
                        <div className="w-fit ">
                          <Button
                            type="button"
                            size="default"
                            className="w-fit "
                            onClick={() =>
                              onUndoNestedLogField(
                                idx,
                                "Materials",
                                matIdx,
                                "materialWeight"
                              )
                            }
                          >
                            <p className="text-xs">Undo</p>
                          </Button>
                        </div>
                      )}
                  </div>
                  <div className="flex items-end right-2 top-2 absolute">
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
                <div className="flex flex-col gap-4 mb-2">
                  <div className="flex flex-row gap-1 items-end">
                    <div>
                      <label htmlFor="lightWeight" className="text-xs ">
                        Light Weight
                      </label>
                      <Input
                        name="lightWeight"
                        type="number"
                        placeholder="Enter Weight"
                        value={mat.lightWeight > 0 ? mat.lightWeight : ""}
                        onChange={(e) =>
                          handleNestedLogChange(
                            idx,
                            "Materials",
                            matIdx,
                            "lightWeight",
                            e.target.value
                          )
                        }
                        className="w-[350px] text-xs"
                      />
                    </div>
                    {originalLogs[idx] &&
                      originalLogs[idx].Materials?.[matIdx]?.lightWeight !==
                        undefined &&
                      mat.lightWeight !==
                        originalLogs[idx].Materials[matIdx].lightWeight &&
                      onUndoNestedLogField && (
                        <div className="w-fit ">
                          <Button
                            type="button"
                            size="default"
                            className="w-fit "
                            onClick={() =>
                              onUndoNestedLogField(
                                idx,
                                "Materials",
                                matIdx,
                                "lightWeight"
                              )
                            }
                          >
                            <p className="text-xs">Undo</p>
                          </Button>
                        </div>
                      )}
                  </div>
                  <div className="flex flex-row gap-1 items-end">
                    <div>
                      <label htmlFor="grossWeight" className="text-xs ">
                        Gross Weight
                      </label>
                      <Input
                        name="grossWeight"
                        type="number"
                        placeholder="Enter Weight"
                        value={mat.grossWeight > 0 ? mat.grossWeight : ""}
                        onChange={(e) =>
                          handleNestedLogChange(
                            idx,
                            "Materials",
                            matIdx,
                            "grossWeight",
                            e.target.value
                          )
                        }
                        className="w-[350px] text-xs"
                      />
                    </div>
                    {originalLogs[idx] &&
                      originalLogs[idx].Materials?.[matIdx]?.grossWeight !==
                        undefined &&
                      mat.grossWeight !==
                        originalLogs[idx].Materials[matIdx].grossWeight &&
                      onUndoNestedLogField && (
                        <div className="w-fit ">
                          <Button
                            type="button"
                            size="default"
                            className="w-fit "
                            onClick={() =>
                              onUndoNestedLogField(
                                idx,
                                "Materials",
                                matIdx,
                                "grossWeight"
                              )
                            }
                          >
                            <p className="text-xs">Undo</p>
                          </Button>
                        </div>
                      )}
                  </div>
                  <div className="flex flex-row gap-1 items-end">
                    <div>
                      <label htmlFor="loadType" className="text-xs ">
                        Load Type
                      </label>
                      <Select
                        name="loadType"
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
                        <SelectTrigger className="w-[350px] text-xs">
                          <SelectValue placeholder="Load Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="SCREENED">Screened</SelectItem>
                          <SelectItem value="UNSCREENED">Unscreened</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {originalLogs[idx] &&
                      originalLogs[idx].Materials?.[matIdx]?.loadType !==
                        undefined &&
                      mat.loadType !==
                        originalLogs[idx].Materials[matIdx].loadType &&
                      onUndoNestedLogField && (
                        <div className="w-fit ">
                          <Button
                            type="button"
                            size="default"
                            className="w-fit "
                            onClick={() =>
                              onUndoNestedLogField(
                                idx,
                                "Materials",
                                matIdx,
                                "loadType"
                              )
                            }
                          >
                            <p className="text-xs">Undo</p>
                          </Button>
                        </div>
                      )}
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
              <div
                key={ref.id || refIdx}
                className="flex flex-col gap-4 mb-2  border p-2 rounded relative"
              >
                <div className="flex flex-row gap-1 items-end">
                  <div>
                    <label htmlFor="gallonsRefueled" className="text-xs ">
                      Total Gallons Refueled
                    </label>
                    <Input
                      name="gallonsRefueled"
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
                      className="w-[350px] text-xs"
                    />
                  </div>
                  {originalLogs[idx] &&
                    originalLogs[idx].RefuelLogs?.[refIdx]?.gallonsRefueled !==
                      undefined &&
                    ref.gallonsRefueled !==
                      originalLogs[idx].RefuelLogs[refIdx].gallonsRefueled &&
                    onUndoNestedLogField && (
                      <div className="w-fit ">
                        <Button
                          type="button"
                          size="default"
                          className="w-fit "
                          onClick={() =>
                            onUndoNestedLogField(
                              idx,
                              "RefuelLogs",
                              refIdx,
                              "gallonsRefueled"
                            )
                          }
                        >
                          <p className="text-xs">Undo</p>
                        </Button>
                      </div>
                    )}
                </div>
                <div className="flex flex-row gap-1 items-end">
                  <div>
                    <label htmlFor="milesAtFueling" className="text-xs ">
                      Mileage at Refuel
                    </label>
                    <Input
                      type="number"
                      placeholder="Current Mileage"
                      value={ref.milesAtFueling ? ref.milesAtFueling : ""}
                      onChange={(e) =>
                        handleNestedLogChange(
                          idx,
                          "RefuelLogs",
                          refIdx,
                          "milesAtFueling",
                          e.target.value
                        )
                      }
                      className="w-[350px] text-xs"
                    />
                  </div>
                  {originalLogs[idx] &&
                    originalLogs[idx].RefuelLogs?.[refIdx]?.milesAtFueling !==
                      undefined &&
                    ref.milesAtFueling !==
                      originalLogs[idx].RefuelLogs[refIdx].milesAtFueling &&
                    onUndoNestedLogField && (
                      <div className="w-fit ">
                        <Button
                          type="button"
                          size="default"
                          className="w-fit "
                          onClick={() =>
                            onUndoNestedLogField(
                              idx,
                              "RefuelLogs",
                              refIdx,
                              "milesAtFueling"
                            )
                          }
                        >
                          <p className="text-xs">Undo</p>
                        </Button>
                      </div>
                    )}
                </div>
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  onClick={() => deleteRefuelLog(idx, refIdx)}
                  className="absolute top-2 right-2"
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
                Log all states truck traveled through and the mileage at each
                state line.
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
              <div
                key={sm.id || smIdx}
                className="flex flex-col gap-4 mb-2 border p-2 rounded relative"
              >
                <div className="flex flex-row gap-1 items-end">
                  <div>
                    <label htmlFor="state" className="text-xs ">
                      State
                    </label>
                    <Select
                      name="state"
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
                      <SelectTrigger className="w-[350px] text-xs">
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
                  </div>
                  {originalLogs[idx] &&
                    originalLogs[idx].StateMileages?.[smIdx]?.state !==
                      undefined &&
                    sm.state !== originalLogs[idx].StateMileages[smIdx].state &&
                    onUndoNestedLogField && (
                      <div className="w-fit ">
                        <Button
                          type="button"
                          size="default"
                          className="w-fit "
                          onClick={() =>
                            onUndoNestedLogField(
                              idx,
                              "StateMileages",
                              smIdx,
                              "state"
                            )
                          }
                        >
                          <p className="text-xs">Undo</p>
                        </Button>
                      </div>
                    )}
                </div>
                <div className="flex flex-row gap-1 items-end">
                  <div>
                    <label htmlFor="stateLineMileage" className="text-xs ">
                      State Line Mileage
                    </label>
                    <Input
                      name="stateLineMileage"
                      type="number"
                      placeholder="State Line Mileage"
                      value={sm.stateLineMileage > 0 ? sm.stateLineMileage : ""}
                      onChange={(e) =>
                        handleNestedLogChange(
                          idx,
                          "StateMileages",
                          smIdx,
                          "stateLineMileage",
                          e.target.value
                        )
                      }
                      className="w-[350px] text-xs"
                    />
                  </div>
                  {originalLogs[idx] &&
                    originalLogs[idx].StateMileages?.[smIdx]
                      ?.stateLineMileage !== undefined &&
                    sm.stateLineMileage !==
                      originalLogs[idx].StateMileages[smIdx].stateLineMileage &&
                    onUndoNestedLogField && (
                      <div className="w-fit ">
                        <Button
                          type="button"
                          size="default"
                          className="w-fit "
                          onClick={() =>
                            onUndoNestedLogField(
                              idx,
                              "StateMileages",
                              smIdx,
                              "stateLineMileage"
                            )
                          }
                        >
                          <p className="text-xs">Undo</p>
                        </Button>
                      </div>
                    )}
                </div>
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  onClick={() => deleteStateMileage(idx, smIdx)}
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
};
