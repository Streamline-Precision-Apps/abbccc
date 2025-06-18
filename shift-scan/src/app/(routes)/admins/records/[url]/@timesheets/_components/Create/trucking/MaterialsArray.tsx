import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Material {
  name: string;
}

interface Props {
  values: Material[];
  onChange: (values: Material[]) => void;
}

/**
 * Renders an addable/removable array of material fields.
 */
export default function MaterialsArray({ values, onChange }: Props) {
  return (
    <div>
      <label className="block font-semibold text-xs">Materials</label>
      {values.map((mat, idx) => (
        <div key={idx} className="flex gap-2 mb-1">
          <Input
            type="text"
            placeholder="Material Name"
            value={mat.name}
            onChange={(e) => {
              const updated = [...values];
              updated[idx].name = e.target.value;
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
      <Button type="button" onClick={() => onChange([...values, { name: "" }])}>
        Add Material
      </Button>
    </div>
  );
}
