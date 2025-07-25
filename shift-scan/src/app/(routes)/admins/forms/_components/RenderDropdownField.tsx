"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function RenderDropdownField({
  field,
  value,
  handleFieldChange,
  handleFieldTouch,
  touchedFields,
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
  value: string;
  handleFieldChange: (id: string, value: string) => void;
  handleFieldTouch: (id: string) => void;
  touchedFields: Record<string, boolean>;
  error: string | null;
}) {
  return (
    <div key={field.id} className="flex flex-col">
      <label className="text-sm font-medium mb-1">
        {field.label}{" "}
        {field.required && <span className="text-red-500">*</span>}
      </label>
      <Select
        value={value}
        onValueChange={(val) => handleFieldChange(field.id, val)}
      >
        <SelectTrigger
          onBlur={() => handleFieldTouch(field.id)}
          className={`border rounded px-2 py-1 bg-white ${
            error && touchedFields[field.id] ? "border-red-500" : ""
          }`}
        >
          <SelectValue placeholder="Select..." />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt.id} value={opt.value}>
              {opt.value}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && touchedFields[field.id] && (
        <p className="text-xs text-red-500 mt-1">{error}</p>
      )}
    </div>
  );
}
