"use client";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";

export default function RenderDateField({
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
        {field.label}{" "}
        {field.required && <span className="text-red-500">*</span>}
      </Label>
      <Popover>
        <PopoverTrigger asChild>
          <Input
            readOnly
            value={value ? format(new Date(value), "yyyy-MM-dd") : ""}
            onBlur={() => handleFieldTouch(field.id)}
            type="Date"
            placeholder="Select date"
            className={`border rounded px-2 py-1 cursor-pointer bg-white ${
              error && touchedFields[field.id] ? "border-red-500" : ""
            }`}
          />
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={value ? new Date(value) : undefined}
            onSelect={(date) => {
              if (date) {
                handleFieldChange(field.id, date.toISOString());
              }
            }}
          />
          {value && (
            <Button
              variant="outline"
              className="w-full text-xs text-blue-600 "
              onClick={() => handleFieldChange(field.id, "")}
              type="button"
            >
              Clear date
            </Button>
          )}
        </PopoverContent>
      </Popover>
      {error && touchedFields[field.id] && (
        <p className="text-xs text-red-500 mt-1">{error}</p>
      )}
    </div>
  );
}
