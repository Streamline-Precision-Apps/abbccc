"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function RenderNumberField({
  field,
  value,
  handleFieldChange,
  handleFieldTouch,
  touchedFields,
  error,
}: {
  field: {
    id: string;
    label: string;
    required: boolean;
  };
  value: string;
  handleFieldChange: (id: string, value: string) => void;
  handleFieldTouch: (id: string) => void;
  touchedFields: Record<string, boolean>;
  error: string | null;
}) {
  return (
    <div key={field.id} className="flex flex-col">
      <Label className="text-sm font-medium mb-1">
        {field.label}
        {field.required && <span className="text-red-500">*</span>}
      </Label>
      <Input
        type="number"
        className={`border rounded px-2 py-1 ${
          touchedFields[field.id] && error ? "border-red-500" : ""
        }`}
        value={value}
        onChange={(e) => handleFieldChange(field.id, e.target.value)}
        onBlur={() => handleFieldTouch(field.id)}
      />
      {touchedFields[field.id] && error && (
        <p className="text-xs text-red-500 mt-1">{error}</p>
      )}
    </div>
  );
}
