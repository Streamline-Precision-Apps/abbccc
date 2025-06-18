import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Props {
  values: string[];
  onChange: (values: string[]) => void;
}

/**
 * Renders an addable/removable array of equipment hauled fields.
 */
export default function EquipmentHauledArray({ values, onChange }: Props) {
  return (
    <div>
      <label className="block font-semibold text-xs">Equipment Hauled</label>
      {values.map((eq, idx) => (
        <div key={idx} className="flex gap-2 mb-1">
          <Input
            type="text"
            placeholder="Equipment Name/ID"
            value={eq}
            onChange={(e) => {
              const updated = [...values];
              updated[idx] = e.target.value;
              onChange(updated);
            }}
            className="w-[200px]"
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
      <Button type="button" onClick={() => onChange([...values, ""])}>
        Add Equipment Hauled
      </Button>
    </div>
  );
}
