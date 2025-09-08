"use client";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function RenderRadioField({
  field,
  value,
  handleFieldChange,
  handleFieldTouch,
  touchedFields,
  error,
  options,
  disabled,
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
  value: string;
  handleFieldChange: (id: string, value: string) => void;
  handleFieldTouch: (id: string) => void;
  touchedFields: Record<string, boolean>;
  error: string | null;
  disabled?: boolean;
}) {
  return (
    <div key={field.id} className="flex flex-col">
      <Label className="text-sm font-medium mb-1">
        {field.label}{" "}
        {field.required && <span className="text-red-500">*</span>}
      </Label>
      <RadioGroup
        value={value}
        onValueChange={(val) => handleFieldChange(field.id, val)}
        onBlur={() => handleFieldTouch(field.id)}
        className="flex flex-row gap-2"
        disabled={disabled}
      >
        {options.map((opt) => (
          <Label
            key={opt.id}
            className="flex items-center gap-1 cursor-pointer select-none"
          >
            <RadioGroupItem
              value={opt.value}
              id={`${field.id}-radio-${opt.id}`}
            />
            <span>{opt.value}</span>
          </Label>
        ))}
      </RadioGroup>
      {error && touchedFields[field.id] && (
        <p className="text-xs text-red-500 mt-1">{error}</p>
      )}
    </div>
  );
}
