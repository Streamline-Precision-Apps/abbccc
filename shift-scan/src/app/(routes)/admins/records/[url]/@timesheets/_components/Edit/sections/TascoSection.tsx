import { Combobox } from '@/components/ui/combobox';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select';
import React from 'react';

export type TascoLogDraft = {
  shiftType: 'ABCD Shift' | 'E Shift' | 'F Shift' | '';
  laborType: 'Equipment Operator' | 'Labor' | '';
  materialType: string;
  loadQuantity: string;
  refuelLogs: { gallonsRefueled: string }[];
  equipment: { id: string; name: string }[];
};

type Props = {
  tascoLogs: TascoLogDraft[];
  setTascoLogs: React.Dispatch<React.SetStateAction<TascoLogDraft[]>>;
  materialTypes: { id: string; name: string }[];
  equipmentOptions: { value: string; label: string }[];
};

export function TascoSection({
  tascoLogs,
  setTascoLogs,
  materialTypes,
  equipmentOptions,
}: Props) {
  return (
    <div className="col-span-2 border-t-2 border-black pt-4 pb-2">
      <div className="mb-4">
        <h3 className="font-semibold text-xl mb-1">Tasco Details</h3>
        <p className="text-sm text-gray-600">Edit or add Tasco logs for this timesheet.</p>
      </div>
      {tascoLogs.map((log, idx) => (
        <div key={idx} className="flex flex-col gap-6 mb-4 pb-4 border-b">
          <div className="flex gap-4 items-end py-2">
            <Select
              value={log.shiftType}
              onValueChange={val => {
                const updated = [...tascoLogs];
                updated[idx].shiftType = val as TascoLogDraft['shiftType'];
                setTascoLogs(updated);
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Shift Type*" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ABCD Shift">ABCD Shift</SelectItem>
                <SelectItem value="E Shift">E Shift</SelectItem>
                <SelectItem value="F Shift">F Shift</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={log.laborType}
              onValueChange={val => {
                const updated = [...tascoLogs];
                updated[idx].laborType = val as TascoLogDraft['laborType'];
                setTascoLogs(updated);
              }}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Labor Type*" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Equipment Operator">Equipment Operator</SelectItem>
                <SelectItem value="Labor">Labor</SelectItem>
              </SelectContent>
            </Select>
            <Combobox
              options={materialTypes.map(m => ({ value: m.name, label: m.name }))}
              value={log.materialType}
              onChange={val => {
                const updated = [...tascoLogs];
                updated[idx].materialType = val;
                setTascoLogs(updated);
              }}
              placeholder="Material Type*"
            />
            <Input
              type="number"
              placeholder="Load Quantity*"
              value={log.loadQuantity}
              onChange={e => {
                const updated = [...tascoLogs];
                updated[idx].loadQuantity = e.target.value;
                setTascoLogs(updated);
              }}
              className="w-[140px]"
            />
          </div>
          {/* Equipment selection */}
          <div className="py-4 border-b mb-2">
            <div className="flex flex-row justify-between items-center mb-2">
              <label className="block font-semibold text-md">Equipment</label>
              <Button
                type="button"
                size="icon"
                onClick={() => {
                  const updated = [...tascoLogs];
                  updated[idx].equipment.push({ id: '', name: '' });
                  setTascoLogs(updated);
                }}
              >
                <img src="/plus-white.svg" alt="add" className="w-4 h-4" />
              </Button>
            </div>
            {log.equipment.map((eq, eqIdx) => (
              <div key={eqIdx} className="flex gap-2 mb-2">
                <Combobox
                  options={equipmentOptions}
                  value={eq.id}
                  onChange={(val, option) => {
                    const updated = [...tascoLogs];
                    updated[idx].equipment[eqIdx] = option
                      ? { id: option.value, name: option.label }
                      : { id: '', name: '' };
                    setTascoLogs(updated);
                  }}
                  placeholder="Select Equipment"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  onClick={() => {
                    const updated = [...tascoLogs];
                    updated[idx].equipment = updated[idx].equipment.filter((_, i) => i !== eqIdx);
                    setTascoLogs(updated);
                  }}
                >
                  <img src="/trash.svg" alt="Delete" className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
          {/* Refuel logs */}
          <div className="py-4 border-b mb-2">
            <div className="flex flex-row justify-between items-center mb-2">
              <label className="block font-semibold text-md">Refuel Logs</label>
              <Button
                type="button"
                size="icon"
                onClick={() => {
                  const updated = [...tascoLogs];
                  updated[idx].refuelLogs.push({ gallonsRefueled: '' });
                  setTascoLogs(updated);
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
                  onChange={e => {
                    const updated = [...tascoLogs];
                    updated[idx].refuelLogs[rfIdx].gallonsRefueled = e.target.value;
                    setTascoLogs(updated);
                  }}
                  className="w-[140px]"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  onClick={() => {
                    const updated = [...tascoLogs];
                    updated[idx].refuelLogs = updated[idx].refuelLogs.filter((_, i) => i !== rfIdx);
                    setTascoLogs(updated);
                  }}
                >
                  <img src="/trash.svg" alt="Delete" className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
          <Button
            type="button"
            variant="destructive"
            size="icon"
            onClick={() => setTascoLogs(tascoLogs.filter((_, i) => i !== idx))}
          >
            <img src="/trash.svg" alt="Delete Tasco Log" className="w-4 h-4" />
          </Button>
        </div>
      ))}
      <Button
        type="button"
        onClick={() =>
          setTascoLogs([
            ...tascoLogs,
            {
              shiftType: '',
              laborType: '',
              materialType: '',
              loadQuantity: '',
              refuelLogs: [{ gallonsRefueled: '' }],
              equipment: [{ id: '', name: '' }],
            },
          ])
        }
      >
        Add Tasco Log
      </Button>
    </div>
  );
}
