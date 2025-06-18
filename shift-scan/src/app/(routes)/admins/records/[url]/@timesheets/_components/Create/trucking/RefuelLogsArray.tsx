import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface RefuelLog {
  gallonsRefueled: string;
  milesAtFueling: string;
}

interface Props {
  values: RefuelLog[];
  onChange: (values: RefuelLog[]) => void;
}

/**
 * Renders an addable/removable array of refuel log fields.
 */
export default function RefuelLogsArray({ values, onChange }: Props) {
  return (
    <div>
      <label className="block font-semibold text-xs">Refuel Logs</label>
      {values.map((ref, idx) => (
        <div key={idx} className="flex gap-2 mb-1">
          <Input
            type="number"
            placeholder="Gallons Refueled"
            value={ref.gallonsRefueled}
            onChange={(e) => {
              const updated = [...values];
              updated[idx].gallonsRefueled = e.target.value;
              onChange(updated);
            }}
            className="w-[120px]"
          />
          <Input
            type="number"
            placeholder="Miles at Fueling"
            value={ref.milesAtFueling}
            onChange={(e) => {
              const updated = [...values];
              updated[idx].milesAtFueling = e.target.value;
              onChange(updated);
            }}
            className="w-[120px]"
          />
          <Button
            type="button"
            variant="destructive"
            onClick={() => {
              const updated = values.filter((_, i) => i !== idx);
              onChange(updated);
            }}
          >
            Remove
          </Button>
        </div>
      ))}
      <Button
        type="button"
        onClick={() =>
          onChange([...values, { gallonsRefueled: "", milesAtFueling: "" }])
        }
      >
        Add Refuel Log
      </Button>
    </div>
  );
}
