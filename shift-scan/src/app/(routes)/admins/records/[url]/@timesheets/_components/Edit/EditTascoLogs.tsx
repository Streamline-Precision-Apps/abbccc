import React from "react";
import { Button } from "@/components/ui/button";
import {
  TascoLog,
  TascoNestedType,
  TascoNestedTypeMap,
  RefuelLog,
} from "./types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MaterialType } from "@/lib/types";
import { Input } from "@/components/ui/input";

interface EditTascoLogsProps {
  logs: TascoLog[];
  onLogChange: (idx: number, field: keyof TascoLog, value: any) => void;
  onAddLog: () => void;
  onRemoveLog: (idx: number) => void;
  handleNestedLogChange: <T extends TascoNestedType>(
    logIndex: number,
    nestedType: T,
    nestedIndex: number,
    field: keyof TascoNestedTypeMap[T],
    value: any
  ) => void;
  originalLogs?: TascoLog[];
  onUndoLogField?: (idx: number, field: keyof TascoLog) => void;
  materialTypes: MaterialType[];
  equipmentOptions: {
    value: string;
    label: string;
  }[];
  addTascoRefuelLog: (logIdx: number) => void;
  deleteTascoRefuelLog: (logIdx: number, refIdx: number) => void;
}

export const EditTascoLogs: React.FC<EditTascoLogsProps> = ({
  logs,
  onLogChange,
  onAddLog,
  onRemoveLog,
  originalLogs = [],
  onUndoLogField,
  materialTypes,
  equipmentOptions,
  handleNestedLogChange,
  addTascoRefuelLog,
  deleteTascoRefuelLog,
}) => (
  <div className="col-span-2 border-t-2 border-black pt-4 pb-2">
    <div className="mb-4">
      <h3 className="font-semibold text-xl mb-1">Tasco Logs</h3>

      <div className="col-span-1 max-w-[350px] flex flex-row flex-wrap items-end">
        <p className="text-xs break-words text-gray-600">
          Fill out the additional details for this timesheet to report more
          accurate Tasco logs.
          <br />
        </p>
      </div>
    </div>
    {logs.map((log, idx) => (
      <div key={log.id} className="flex flex-col gap-6 border-b ">
        <div className="flex flex-col gap-4 py-4 border-b">
          {/* Equipment Combobox */}
          <div className="flex flex-row gap-2">
            <div className="flex-1 max-w-[180px]">
              <label htmlFor="equipmentId" className="block text-xs">
                Equipment
              </label>
              <Select
                name="equipmentId"
                value={log.Equipment?.id || ""}
                onValueChange={(val) => {
                  const selected = equipmentOptions.find(
                    (eq) => eq.value === val
                  );
                  onLogChange(
                    idx,
                    "Equipment",
                    selected
                      ? { id: selected.value, name: selected.label }
                      : null
                  );
                }}
              >
                <SelectTrigger className="border rounded px-2 py-1 w-full text-xs">
                  <SelectValue placeholder="Select Equipment" />
                </SelectTrigger>
                <SelectContent>
                  {equipmentOptions.map((eq) => (
                    <SelectItem key={eq.value} value={eq.value}>
                      {eq.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1 max-w-[180px]">
              <label htmlFor="shiftType" className="block text-xs">
                Shift Type
              </label>
              <Select
                name="shiftType"
                value={log.shiftType || ""}
                onValueChange={(val) => onLogChange(idx, "shiftType", val)}
              >
                <SelectTrigger className="border rounded px-2 py-1 w-full text-xs">
                  <SelectValue placeholder="Select Shift Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ABCD Shift">ABCD Shift</SelectItem>
                  <SelectItem value="E Shift">E Shift</SelectItem>
                  <SelectItem value="F Shift">F Shift</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1 max-w-[180px]">
              <label htmlFor="laborType" className="block text-xs">
                Labor Type
              </label>
              <Select
                name="laborType"
                value={log.laborType || ""}
                onValueChange={(val) => onLogChange(idx, "laborType", val)}
              >
                <SelectTrigger className="border rounded px-2 py-1 w-full text-xs">
                  <SelectValue placeholder="Select Labor Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Operator">Operator</SelectItem>
                  <SelectItem value="Manual Labor">Manual Labor</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex flex-row gap-2 ">
            <div className="flex-1 max-w-[180px]">
              <label htmlFor="materialType" className="block text-xs">
                Material Type
              </label>
              <Select
                name="materialType"
                value={log.materialType || ""}
                onValueChange={(val) => onLogChange(idx, "materialType", val)}
              >
                <SelectTrigger className="border rounded px-2 py-1 w-full text-xs">
                  <SelectValue placeholder="Select Material" />
                </SelectTrigger>
                <SelectContent>
                  {materialTypes.map((type) => (
                    <SelectItem key={type.id} value={type.name}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1 max-w-[180px]">
              <label className="block text-xs">Number of Loads</label>
              <Input
                type="number"
                placeholder={"Enter number of loads"}
                value={log.LoadQuantity ? log.LoadQuantity : ""}
                onChange={(e) =>
                  onLogChange(idx, "LoadQuantity", Number(e.target.value))
                }
                className="border rounded px-2 py-1 w-full text-xs"
              />
            </div>
          </div>
        </div>
        {/* Refuel Logs Section */}
        <div className="mb-2">
          <div className="flex flex-row justify-between ">
            <p className="text-base font-semibold">Refuel Logs</p>
            <Button
              type="button"
              size="icon"
              onClick={() => addTascoRefuelLog(idx)}
            >
              <img src="/plus-white.svg" alt="add" className="w-4 h-4" />
            </Button>
          </div>
          {log.RefuelLogs && log.RefuelLogs.length > 0 ? (
            log.RefuelLogs.map((ref, refIdx) => (
              <div
                key={ref.id || refIdx}
                className="flex gap-2 mb-2 pt-2 items-end"
              >
                <div>
                  <label className="block text-xs w-[120px]">
                    Gallons Refueled
                  </label>
                  <Input
                    type="number"
                    placeholder="Enter total gallons"
                    value={ref.gallonsRefueled > 0 ? ref.gallonsRefueled : ""}
                    onChange={(e) =>
                      handleNestedLogChange(
                        idx,
                        "RefuelLogs",
                        refIdx,
                        "gallonsRefueled",
                        Number(e.target.value)
                      )
                    }
                    className="w-[200px] text-xs"
                  />
                </div>

                <Button
                  type="button"
                  size="icon"
                  variant="destructive"
                  onClick={() => deleteTascoRefuelLog(idx, refIdx)}
                >
                  <img src="/trash.svg" alt="remove" className="w-4 h-4" />
                </Button>
              </div>
            ))
          ) : (
            <div className="text-xs text-gray-500 italic"></div>
          )}
        </div>
      </div>
    ))}
  </div>
);
