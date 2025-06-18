import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface StateMileage {
  state: string;
  stateLineMileage: string;
}

interface Props {
  values: StateMileage[];
  onChange: (values: StateMileage[]) => void;
}

/**
 * Renders an addable/removable array of state mileage fields.
 */
export default function StateMileagesArray({ values, onChange }: Props) {
  return (
    <div>
      <label className="block font-semibold text-xs">State Line Mileage</label>
      {values.map((sm, idx) => (
        <div key={idx} className="flex gap-2 mb-1">
          <Input
            type="text"
            placeholder="State"
            value={sm.state}
            onChange={(e) => {
              const updated = [...values];
              updated[idx].state = e.target.value;
              onChange(updated);
            }}
            className="w-[100px]"
          />
          <Input
            type="number"
            placeholder="State Line Mileage"
            value={sm.stateLineMileage}
            onChange={(e) => {
              const updated = [...values];
              updated[idx].stateLineMileage = e.target.value;
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
          onChange([...values, { state: "", stateLineMileage: "" }])
        }
      >
        Add State Line Mileage
      </Button>
    </div>
  );
}
