import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type DateRange = { from: Date | undefined; to: Date | undefined };

interface ExportModalProps {
  onClose: () => void;
  onExport: (
    exportFormat: "csv" | "xlsx",
    dateRange?: {
      from?: Date;
      to?: Date;
    },
    selectedFields?: string[],
  ) => void;
}

import { useMemo } from "react";
import { ChevronDownIcon, Download, X } from "lucide-react";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

export const EXPORT_FIELDS = [
  { key: "Id", label: "Id" },
  { key: "Date", label: "Date Worked" },
  { key: "Employee", label: "Employee" },
  { key: "Jobsite", label: "Profit Center" },
  { key: "CostCode", label: "Cost Code" },
  { key: "NU", label: "NU" },
  { key: "FP", label: "FP" },
  { key: "Start", label: "Start Time" },
  { key: "End", label: "End Time" },
  { key: "Duration", label: "Hours" },
  { key: "Comment", label: "Description" },
  { key: "EquipmentId", label: "Equipment" },
  { key: "EquipmentUsage", label: "Equipment Usage" },
  { key: "TruckNumber", label: "Trucking Number" },
  { key: "TruckStartingMileage", label: "Truck Starting Mileage" },
  { key: "TruckEndingMileage", label: "Truck Ending Mileage" },
  { key: "MilesAtFueling", label: "Miles at Fueling" },
  { key: "TascoABCDELoads", label: "ABCDE loads" },
  { key: "TascoFLoads", label: "F loads" },
];

const ExportModal = ({ onClose, onExport }: ExportModalProps) => {
  const [dateRange, setDateRange] = useState<DateRange>({
    from: undefined,
    to: undefined,
  });
  const [selectedFields, setSelectedFields] = useState<string[]>(
    EXPORT_FIELDS.map((f) => f.key),
  );
  const [exportFormat, setExportFormat] = useState<"csv" | "xlsx" | "">("");

  const allChecked = useMemo(
    () => selectedFields.length === EXPORT_FIELDS.length,
    [selectedFields],
  );
  const isIndeterminate = useMemo(
    () =>
      selectedFields.length > 0 && selectedFields.length < EXPORT_FIELDS.length,
    [selectedFields],
  );

  const handleFieldChange = (key: string) => {
    setSelectedFields((prev) =>
      prev.includes(key) ? prev.filter((f) => f !== key) : [...prev, key],
    );
  };

  const handleSelectAll = () => {
    if (allChecked) setSelectedFields([]);
    else setSelectedFields(EXPORT_FIELDS.map((f) => f.key));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg min-w-[700px] max-h-[80vh] overflow-y-auto no-scrollbar">
        <div className="px-6 py-4 flex flex-col gap-4 items-center w-full relative">
          <div className="relative w-full">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="absolute top-0 right-0 cursor-pointer"
            >
              <X width={20} height={20} />
            </Button>
            <div className="flex flex-col">
              <div className="flex flex-row gap-2 mb-2 items-center">
                <Download className="h-5 w-5" />
                <h2 className="text-xl font-bold">Export Timesheet Data</h2>
              </div>
              <p className="text-xs text-gray-600">
                Select a date range, apply filters, and choose your preferred
                export format
              </p>
              <p className="text-xs text-blue-600 italic">
                Exporting only includes timesheets that have been approved!
              </p>
            </div>
          </div>
          <div className="border rounded-lg p-4 bg-gray-50 w-full">
            <h3 className="font-semibold text-sm mb-2">Date Range</h3>
            <div className="flex flex-col gap-3">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    id="date"
                    className="w-full justify-between font-normal"
                  >
                    {dateRange.from && dateRange.to
                      ? `${format(dateRange.from, "PPP")} - ${format(dateRange.to, "PPP")}`
                      : "Select date range"}
                    <ChevronDownIcon />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-auto overflow-hidden p-0"
                  align="start"
                >
                  <div className="p-4 justify-center flex flex-col items-center">
                    <Calendar
                      mode="range"
                      selected={dateRange}
                      onSelect={(value) =>
                        setDateRange({ from: value?.from, to: value?.to })
                      }
                      autoFocus
                    />
                    {(dateRange.from || dateRange.to) && (
                      <Button
                        variant="outline"
                        className="w-1/2 text-xs text-blue-600 hover:underline"
                        onClick={() =>
                          setDateRange({ from: undefined, to: undefined })
                        }
                        type="button"
                      >
                        Clear date range
                      </Button>
                    )}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <div className="w-full flex flex-col items-center mb-2">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>
                  <span className="flex items-center gap-2 text-base font-semibold">
                    <svg
                      width="20"
                      height="20"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      className="text-blue-600"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    Advanced Exporting Options
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="w-full mb-4 flex items-center gap-2">
                    <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                      Customize
                    </span>
                    <p className="text-xs text-gray-600">
                      Select the fields you want to export.
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 w-full bg-slate-50 rounded-lg p-3 border border-gray-200">
                    <label className="flex items-center gap-2 cursor-pointer col-span-2 hover:bg-blue-50 rounded px-2 py-1 transition">
                      <input
                        type="checkbox"
                        checked={allChecked}
                        ref={(el) => {
                          if (el) el.indeterminate = isIndeterminate;
                        }}
                        onChange={handleSelectAll}
                        className="accent-blue-600"
                      />
                      <span className="font-medium text-blue-700">
                        {allChecked ? "Unselect All" : "Select All"}
                      </span>
                    </label>
                    {EXPORT_FIELDS.map((field) => (
                      <label
                        key={field.key}
                        className="flex items-center gap-2 cursor-pointer hover:bg-blue-50 rounded px-2 py-1 transition"
                      >
                        <input
                          type="checkbox"
                          checked={selectedFields.includes(field.key)}
                          onChange={() => handleFieldChange(field.key)}
                          className="accent-blue-600"
                        />
                        <span className="text-xs">{field.label}</span>
                      </label>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
          <div className="border rounded-lg p-4 bg-gray-50 mt-4 w-full">
            <h3 className="font-semibold text-sm mb-2">Export Format</h3>
            <div className="flex flex-row gap-4 mb-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="exportFormat"
                  value="csv"
                  checked={exportFormat === "csv"}
                  onChange={() => setExportFormat("csv")}
                  className="accent-blue-600"
                />
                <span className="text-xs">CSV</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="exportFormat"
                  value="xlsx"
                  checked={exportFormat === "xlsx"}
                  onChange={() => setExportFormat("xlsx")}
                  className="accent-green-600"
                />
                <span className="text-xs">Excel (XLSX)</span>
              </label>
            </div>
          </div>
          <div className="flex flex-row gap-3 w-full mb-2 mt-4">
            <Button
              size="sm"
              className="flex-1 bg-sky-500 hover:bg-sky-400 text-white px-4 py-2 rounded disabled:opacity-50"
              onClick={() =>
                exportFormat &&
                onExport(exportFormat, dateRange, selectedFields)
              }
              disabled={selectedFields.length === 0 || !exportFormat}
            >
              Export
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded"
              onClick={onClose}
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export { ExportModal };
