import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

// DateTimePicker component for date and time selection
export function DateTimePicker({
  value,
  onChange,
  label,
  font = "font-semibold",
}: {
  value?: string;
  onChange: (val: string) => void;
  label: string;
  font?: "font-semibold" | "font-bold" | "font-normal";
}) {
  // Always derive date and time from value prop
  const dateValue = value ? new Date(value) : undefined;
  const timeValue = value ? format(new Date(value), "HH:mm") : "";

  // Handlers update only the changed part and call onChange
  const handleDateChange = (date: Date | undefined) => {
    if (!date) return;
    const [hours, minutes] = timeValue ? timeValue.split(":") : ["00", "00"];
    date.setHours(Number(hours), Number(minutes), 0, 0);
    onChange(date.toISOString());
  };
  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = e.target.value;
    if (!dateValue) return;
    const [hours, minutes] = time.split(":");
    const newDate = new Date(dateValue);
    newDate.setHours(Number(hours), Number(minutes), 0, 0);
    onChange(newDate.toISOString());
  };

  return (
    <div>
      <label className={`block text-xs ${font} mb-1`}>{label}</label>
      <div className="flex gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-[160px] justify-start text-left font-normal"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateValue ? (
                <p className="text-xs">{format(dateValue, "PPP")}</p>
              ) : (
                <span>Pick a date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 ">
            <Calendar
              mode="single"
              selected={dateValue}
              onSelect={handleDateChange}
              autoFocus
            />
          </PopoverContent>
        </Popover>
        <input
          type="time"
          value={timeValue}
          onChange={handleTimeChange}
          className="border rounded px-2 py-1 text-xs"
        />
      </div>
    </div>
  );
}
