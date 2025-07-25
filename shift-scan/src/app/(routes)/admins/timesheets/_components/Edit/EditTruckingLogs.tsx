import React from "react";
import { Button } from "@/components/ui/button";
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
import { SingleCombobox } from "@/components/ui/single-combobox";
import { Label } from "@/components/ui/label";

interface EditTruckingLogsProps {
  logs: TruckingLog[];
  onLogChange: (
    idx: number,
    field: keyof TruckingLog,
    value: string | number | null
  ) => void;
  handleNestedLogChange: <T extends TruckingNestedType>(
    logIndex: number,
    nestedType: T,
    nestedIndex: number,
    field: keyof TruckingNestedTypeMap[T],
    value: string | number | null
  ) => void;
  originalLogs?: TruckingLog[];
  onUndoLogField?: (idx: number, field: keyof TruckingLog) => void;
  equipmentOptions: {
    value: string;
    label: string;
  }[];
  truckOptions: {
    value: string;
    label: string;
  }[];
  trailerOptions: {
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
  truckOptions,
  trailerOptions,
  onLogChange,
  handleNestedLogChange,
  originalLogs = [],
  onUndoLogField,
  equipmentOptions = [],
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
  // Helper functions to check completeness of each nested log type
  const isEquipmentHauledComplete = (
    eq: TruckingNestedTypeMap["EquipmentHauled"]
  ) => !!eq.equipmentId;
  const isMaterialComplete = (mat: TruckingNestedTypeMap["Materials"]) =>
    !!(
      mat.LocationOfMaterial &&
      mat.name &&
      mat.quantity &&
      mat.unit &&
      mat.loadType
    );
  const isRefuelLogComplete = (ref: TruckingNestedTypeMap["RefuelLogs"]) =>
    !!(ref.gallonsRefueled && ref.milesAtFueling);
  const isStateMileageComplete = (sm: TruckingNestedTypeMap["StateMileages"]) =>
    !!(sm.state && sm.stateLineMileage);

  return (
    <div className="col-span-2 mt-4">
      <h3 className="font-semibold text-md mb-2">Trucking Logs</h3>
      {logs.map((log, idx) => (
        <div key={log.id} className=" rounded p-2 mb-6 ">
          <div className="flex flex-col gap-3 mb-2 border-b pb-3">
            <div className="flex flex-row items-end gap-x-2">
              <div className="min-w-[350px]">
                <label className="block text-xs">Truck</label>
                <SingleCombobox
                  font={"font-normal"}
                  options={truckOptions}
                  value={log.truckNumber}
                  onChange={(val) => onLogChange(idx, "truckNumber", val)}
                  placeholder="Select Truck*"
                  filterKeys={["label", "value"]}
                />
              </div>

              {originalLogs[idx] &&
                log.truckNumber !== originalLogs[idx].truckNumber &&
                onUndoLogField && (
                  <div className="w-fit mr-4">
                    <Button
                      type="button"
                      size="default"
                      className="w-fit "
                      onClick={() => onUndoLogField(idx, "truckNumber")}
                    >
                      <p className="text-xs">Undo</p>
                    </Button>
                  </div>
                )}
            </div>
            <div className="flex flex-row items-end gap-x-2">
              <div className="min-w-[350px]">
                <label className="block text-xs">Trailer</label>
                <SingleCombobox
                  font={"font-normal"}
                  options={[
                    { value: "", label: "No Trailer" },
                    ...trailerOptions,
                  ]}
                  value={
                    log.trailerNumber === null ? "" : log.trailerNumber || ""
                  }
                  onChange={(val) =>
                    onLogChange(idx, "trailerNumber", val === "" ? null : val)
                  }
                  placeholder="Select Trailer"
                  filterKeys={["label", "value"]}
                />
              </div>

              {originalLogs[idx] &&
                log.trailerNumber !== originalLogs[idx].trailerNumber &&
                onUndoLogField && (
                  <div className="w-fit mr-4">
                    <Button
                      type="button"
                      size="default"
                      className="w-fit "
                      onClick={() => onUndoLogField(idx, "trailerNumber")}
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
                disabled={
                  log.EquipmentHauled.length > 0 &&
                  !isEquipmentHauledComplete(
                    log.EquipmentHauled[log.EquipmentHauled.length - 1]
                  )
                }
                className={
                  log.EquipmentHauled.length > 0 &&
                  !isEquipmentHauledComplete(
                    log.EquipmentHauled[log.EquipmentHauled.length - 1]
                  )
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }
                title={
                  log.EquipmentHauled.length > 0 &&
                  !isEquipmentHauledComplete(
                    log.EquipmentHauled[log.EquipmentHauled.length - 1]
                  )
                    ? "Please complete the previous Equipment Hauled entry before adding another."
                    : ""
                }
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
                    <SingleCombobox
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
                          className="w-fit"
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

                <div className="flex flex-row items-end gap-x-2 ">
                  <div className="flex-1">
                    <label className="block text-xs">Source</label>
                    <Input
                      type="text"
                      value={eq.source || ""}
                      onChange={(e) =>
                        handleNestedLogChange(
                          idx,
                          "EquipmentHauled",
                          eqIdx,
                          "source",
                          e.target.value
                        )
                      }
                      className="w-[350px] text-xs"
                      onBlur={(e) => {
                        let value = e.target.value;
                        if (/^0+\d+/.test(value)) {
                          value = String(Number(value));
                          handleNestedLogChange(
                            idx,
                            "EquipmentHauled",
                            eqIdx,
                            "source",
                            e.target.value
                          );
                          e.target.value = value;
                        }
                      }}
                    />
                  </div>
                  {originalLogs[idx] &&
                    originalLogs[idx].EquipmentHauled?.[eqIdx]?.source !==
                      undefined &&
                    eq.source !==
                      originalLogs[idx].EquipmentHauled[eqIdx].source &&
                    onUndoNestedLogField && (
                      <div className="w-fit mr-4">
                        <Button
                          type="button"
                          size="default"
                          className="w-fit"
                          onClick={() =>
                            onUndoNestedLogField(
                              idx,
                              "EquipmentHauled",
                              eqIdx,
                              "source"
                            )
                          }
                        >
                          <p className="text-xs">Undo</p>
                        </Button>
                      </div>
                    )}
                </div>

                <div className="flex flex-row items-end gap-x-2 ">
                  <div className="flex-1">
                    <label className="block text-xs">Destination</label>
                    <Input
                      type="text"
                      value={eq.destination || ""}
                      onChange={(e) =>
                        handleNestedLogChange(
                          idx,
                          "EquipmentHauled",
                          eqIdx,
                          "destination",
                          e.target.value
                        )
                      }
                      className="w-[350px] text-xs"
                      onBlur={(e) => {
                        let value = e.target.value;
                        if (/^0+\d+/.test(value)) {
                          value = String(Number(value));
                          handleNestedLogChange(
                            idx,
                            "EquipmentHauled",
                            eqIdx,
                            "destination",
                            e.target.value
                          );
                          e.target.value = value;
                        }
                      }}
                    />
                  </div>
                  {originalLogs[idx] &&
                    originalLogs[idx].EquipmentHauled?.[eqIdx]?.destination !==
                      undefined &&
                    eq.destination !==
                      originalLogs[idx].EquipmentHauled[eqIdx].destination &&
                    onUndoNestedLogField && (
                      <div className="w-fit mr-4">
                        <Button
                          type="button"
                          size="default"
                          className="w-fit"
                          onClick={() =>
                            onUndoNestedLogField(
                              idx,
                              "EquipmentHauled",
                              eqIdx,
                              "destination"
                            )
                          }
                        >
                          <p className="text-xs">Undo</p>
                        </Button>
                      </div>
                    )}
                </div>

                <div className="flex flex-row items-end gap-x-2 ">
                  <div className="flex-1">
                    <label className="block text-xs">OW Starting Mileage</label>
                    <Input
                      type="number"
                      value={Number(eq.startMileage) || ""}
                      onChange={(e) =>
                        handleNestedLogChange(
                          idx,
                          "EquipmentHauled",
                          eqIdx,
                          "startMileage",
                          Number(e.target.value)
                        )
                      }
                      className="w-[160px] text-xs"
                      onBlur={(e) => {
                        let value = e.target.value;
                        if (/^0+\d+/.test(value)) {
                          value = String(Number(value));
                          handleNestedLogChange(
                            idx,
                            "EquipmentHauled",
                            eqIdx,
                            "startMileage",
                            Number(value)
                          );
                          e.target.value = value;
                        }
                      }}
                    />
                  </div>
                  {originalLogs[idx] &&
                    originalLogs[idx].EquipmentHauled?.[eqIdx]?.startMileage !==
                      undefined &&
                    eq.startMileage !==
                      originalLogs[idx].EquipmentHauled[eqIdx].startMileage &&
                    onUndoNestedLogField && (
                      <div className="w-fit mr-4">
                        <Button
                          type="button"
                          size="default"
                          className="w-fit"
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
                  <div className="flex-1">
                    <label className="block text-xs">OW Ending Mileage</label>
                    <Input
                      type="number"
                      value={eq.endMileage ? Number(eq.endMileage) : ""}
                      onChange={(e) =>
                        handleNestedLogChange(
                          idx,
                          "EquipmentHauled",
                          eqIdx,
                          "endMileage",
                          Number(e.target.value)
                        )
                      }
                      className="w-[160px]"
                      onBlur={(e) => {
                        let value = e.target.value;
                        if (/^0+\d+/.test(value)) {
                          value = String(Number(value));
                          handleNestedLogChange(
                            idx,
                            "EquipmentHauled",
                            eqIdx,
                            "endMileage",
                            Number(value)
                          );
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
                    originalLogs[idx].EquipmentHauled?.[eqIdx]?.startMileage !==
                      undefined &&
                    eq.startMileage !==
                      originalLogs[idx].EquipmentHauled[eqIdx].endMileage &&
                    onUndoNestedLogField && (
                      <div className="w-fit mr-4">
                        <Button
                          type="button"
                          size="default"
                          className="w-fit"
                          onClick={() =>
                            onUndoNestedLogField(
                              idx,
                              "EquipmentHauled",
                              eqIdx,
                              "endMileage"
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
                disabled={
                  log.Materials.length > 0 &&
                  !isMaterialComplete(log.Materials[log.Materials.length - 1])
                }
                className={
                  log.Materials.length > 0 &&
                  !isMaterialComplete(log.Materials[log.Materials.length - 1])
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }
                title={
                  log.Materials.length > 0 &&
                  !isMaterialComplete(log.Materials[log.Materials.length - 1])
                    ? "Please complete the previous Material entry before adding another."
                    : ""
                }
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
                      <label htmlFor="LocationOfMaterial" className="text-xs ">
                        Source of Material
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
                  <div className="flex flex-row gap-2 items-end">
                    <div className="flex flex-row gap-2 items-end">
                      <div>
                        <Label htmlFor="Quantity" className="text-xs ">
                          Quantity
                        </Label>
                        <Input
                          name="quantity"
                          type="number"
                          placeholder="Enter Quantity"
                          value={mat.quantity ? mat.quantity : ""}
                          onChange={(e) =>
                            handleNestedLogChange(
                              idx,
                              "Materials",
                              matIdx,
                              "quantity",
                              e.target.value
                            )
                          }
                          className="w-[120px] text-xs"
                        />
                      </div>
                      {originalLogs[idx] &&
                        originalLogs[idx].Materials?.[matIdx]?.quantity !==
                          undefined &&
                        mat.quantity !==
                          originalLogs[idx].Materials[matIdx].quantity &&
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
                                  "quantity"
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
                        <Label htmlFor="unit" className="text-xs ">
                          Unit
                        </Label>
                        <Select
                          value={mat.unit}
                          onValueChange={(val) =>
                            handleNestedLogChange(
                              idx,
                              "Materials",
                              matIdx,
                              "unit",
                              val
                            )
                          }
                        >
                          <SelectTrigger className="w-[120px] text-xs">
                            <SelectValue placeholder="Enter Unit Type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="TONS">TONS</SelectItem>
                            <SelectItem value="YARDS">YARDS</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      {originalLogs[idx] &&
                        originalLogs[idx].Materials?.[matIdx]?.unit !==
                          undefined &&
                        mat.unit !== originalLogs[idx].Materials[matIdx].unit &&
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
                                  "unit"
                                )
                              }
                            >
                              <p className="text-xs">Undo</p>
                            </Button>
                          </div>
                        )}
                    </div>
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
                disabled={
                  log.RefuelLogs.length > 0 &&
                  !isRefuelLogComplete(
                    log.RefuelLogs[log.RefuelLogs.length - 1]
                  )
                }
                className={
                  log.RefuelLogs.length > 0 &&
                  !isRefuelLogComplete(
                    log.RefuelLogs[log.RefuelLogs.length - 1]
                  )
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }
                title={
                  log.RefuelLogs.length > 0 &&
                  !isRefuelLogComplete(
                    log.RefuelLogs[log.RefuelLogs.length - 1]
                  )
                    ? "Please complete the previous Refuel Log entry before adding another."
                    : ""
                }
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
                disabled={
                  log.StateMileages.length > 0 &&
                  !isStateMileageComplete(
                    log.StateMileages[log.StateMileages.length - 1]
                  )
                }
                className={
                  log.StateMileages.length > 0 &&
                  !isStateMileageComplete(
                    log.StateMileages[log.StateMileages.length - 1]
                  )
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }
                title={
                  log.StateMileages.length > 0 &&
                  !isStateMileageComplete(
                    log.StateMileages[log.StateMileages.length - 1]
                  )
                    ? "Please complete the previous State Line Mileage entry before adding another."
                    : ""
                }
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
