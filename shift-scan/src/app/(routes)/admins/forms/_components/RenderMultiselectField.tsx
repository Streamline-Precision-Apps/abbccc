"use client";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function RenderMultiselectField({
  field,
  value,
  handleFieldChange,
  error,
  options,
}: {
  field: {
    id: string;
    label: string;
    required: boolean;
  };
  options: {
    id: string;
    value: string;
  }[];
  value: string | string[];
  handleFieldChange: (id: string, value: string | string[]) => void;
  handleFieldTouch: (id: string) => void;
  touchedFields: Record<string, boolean>;
  error: string | null;
}) {
  return (
    <div key={field.id} className="flex flex-col">
      <Label className="text-sm font-medium mb-1">
        {field.label}{" "}
        {field.required && <span className="text-red-500">*</span>}
      </Label>
      <div className="flex flex-col gap-1 border rounded px-2 py-2 bg-white">
        {options.map((opt) => (
          <label
            key={opt.id}
            className="flex items-center gap-2 cursor-pointer select-none"
          >
            <Checkbox
              checked={Array.isArray(value) && value.includes(opt.value)}
              onCheckedChange={(checked) => {
                const updatedValue = checked
                  ? [...(Array.isArray(value) ? value : []), opt.value]
                  : (Array.isArray(value) ? value : []).filter(
                      (v) => v !== opt.value
                    );
                handleFieldChange(field.id, updatedValue);
              }}
              id={`${field.id}-${opt.id}`}
            />
            <span>{opt.value}</span>
          </label>
        ))}
      </div>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}
