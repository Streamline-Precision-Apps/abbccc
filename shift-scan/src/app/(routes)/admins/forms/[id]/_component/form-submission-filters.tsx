import React, { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

interface DateRange {
  from?: Date;
  to?: Date;
}

interface FormSubmissionFiltersProps {
  onFilterChange?: (filters: { dateRange: DateRange; status: string }) => void;
}

const STATUS_OPTIONS = [
  { value: "ALL", label: "All" },
  { value: "PENDING", label: "Pending" },
  { value: "APPROVED", label: "Approved" },
  { value: "DENIED", label: "Denied" },
  { value: "DRAFT", label: "Draft" },
];

export default function FormSubmissionFilters({
  onFilterChange,
}: FormSubmissionFiltersProps) {
  const [dateRange, setDateRange] = useState<DateRange>({});
  const [status, setStatus] = useState<string>("ALL");
  const [open, setOpen] = useState(false);

  const handleApply = () => {
    if (onFilterChange) {
      onFilterChange({ dateRange, status });
    }
    setOpen(false);
  };

  const handleClear = () => {
    setDateRange({});
    setStatus("ALL");
    if (onFilterChange) {
      onFilterChange({ dateRange: {}, status: "ALL" });
    }
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="flex min-w-[40px] items-center px-2 h-full"
        >
          <img src="/filterFunnel.svg" alt="Filter" className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-80 p-4"
        align="start"
        side="bottom"
        sideOffset={5}
      >
        <div className="flex flex-col gap-4">
          <div>
            <h3 className="font-medium mb-2 text-sm">Status</h3>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <h3 className="font-medium mb-2 text-sm">Date Range</h3>
            <Calendar
              mode="range"
              selected={
                dateRange.from
                  ? { from: dateRange.from, to: dateRange.to }
                  : undefined
              }
              onSelect={(value) => {
                if (value?.from && !value?.to) {
                  const from = new Date(value.from);
                  from.setHours(0, 0, 0, 0);
                  const to = new Date(value.from);
                  to.setHours(23, 59, 59, 999);
                  setDateRange({ from, to });
                } else if (value?.from && value?.to) {
                  const from = new Date(value.from);
                  from.setHours(0, 0, 0, 0);
                  const to = new Date(value.to);
                  to.setHours(23, 59, 59, 999);
                  setDateRange({ from, to });
                } else {
                  setDateRange({});
                }
              }}
              autoFocus
            />
            <div className="flex items-center justify-center mt-2">
              <Button
                variant="ghost"
                size="icon"
                className="p-2 flex-shrink-0"
                onClick={() => setDateRange({})}
                aria-label="Clear date range"
              >
                clear
              </Button>
            </div>
          </div>
          <div className="flex justify-between pt-2 border-t border-slate-200 mt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleClear}
              className="text-xs"
            >
              Clear
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={handleApply}
              className="text-xs"
            >
              Apply Filters
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
