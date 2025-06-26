import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";

type DateRange = { from: Date | undefined; to: Date | undefined };

interface ExportModalProps {
  onClose: () => void;
  onExport: (
    exportFormat: "csv" | "xlsx",
    dateRange?: {
      from?: Date;
      to?: Date;
    },
    selectedFields?: string[]
  ) => void;
}

import { useMemo } from "react";

const EXPORT_FIELDS = [
  { key: "WorkType", label: "Work Type" },
  { key: "Employee", label: "Employee" },
  { key: "Date", label: "Date" },
  { key: "Jobsite", label: "Profit Id" },
  { key: "CostCode", label: "Cost Code" },
  { key: "NU", label: "NU" },
  { key: "FP", label: "FP" },
  { key: "Start", label: "Start Time" },
  { key: "End", label: "End Time" },
  { key: "Comment", label: "Job Description" },
  { key: "EquipmentId", label: "EQ ID" },
  { key: "EquipmentUsage", label: "EQ Usage" },
];

const ExportModal = ({ onClose, onExport }: ExportModalProps) => {
  const [dateRange, setDateRange] = useState<DateRange>({
    from: undefined,
    to: undefined,
  });
  const [selectedFields, setSelectedFields] = useState<string[]>(
    EXPORT_FIELDS.map((f) => f.key)
  );

  const allChecked = useMemo(
    () => selectedFields.length === EXPORT_FIELDS.length,
    [selectedFields]
  );
  const isIndeterminate = useMemo(
    () =>
      selectedFields.length > 0 && selectedFields.length < EXPORT_FIELDS.length,
    [selectedFields]
  );

  const handleFieldChange = (key: string) => {
    setSelectedFields((prev) =>
      prev.includes(key) ? prev.filter((f) => f !== key) : [...prev, key]
    );
  };

  const handleSelectAll = () => {
    if (allChecked) setSelectedFields([]);
    else setSelectedFields(EXPORT_FIELDS.map((f) => f.key));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg min-w-[350px] max-w-[90vw] max-h-[80vh] overflow-y-auto no-scrollbar p-8 flex flex-col items-center">
        <h2 className="text-xl font-bold mb-4">Export Timesheets</h2>
        <div className="flex flex-col gap-4 w-full items-center">
          <div className="w-full flex flex-col items-center mb-2">
            <label className="font-semibold mb-1">Date Range</label>
            <div className="flex flex-col items-center">
              <Calendar
                mode="range"
                selected={dateRange}
                onSelect={(value) =>
                  setDateRange({ from: value?.from, to: value?.to })
                }
                autoFocus
              />
              <div className="mt-2 text-xs text-muted-foreground">
                {dateRange.from && dateRange.to ? (
                  `${format(dateRange.from, "PPP")} - ${format(
                    dateRange.to,
                    "PPP"
                  )}`
                ) : dateRange.from ? (
                  `${format(dateRange.from, "PPP")} - ...`
                ) : (
                  <span>Pick a date range</span>
                )}
              </div>
              {(dateRange.from || dateRange.to) && (
                <button
                  className="mt-2 text-xs text-blue-600 hover:underline"
                  onClick={() =>
                    setDateRange({ from: undefined, to: undefined })
                  }
                  type="button"
                >
                  Clear date range
                </button>
              )}
            </div>
          </div>
          <div className="w-full flex flex-col items-center mb-2">
            <label className="font-semibold mb-1">Fields to Export</label>
            <div className="flex flex-col gap-1 w-full max-w-xs">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={allChecked}
                  ref={(el) => {
                    if (el) el.indeterminate = isIndeterminate;
                  }}
                  onChange={handleSelectAll}
                />
                <span className="font-medium">Select All</span>
              </label>
              {EXPORT_FIELDS.map((field) => (
                <label
                  key={field.key}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedFields.includes(field.key)}
                    onChange={() => handleFieldChange(field.key)}
                  />
                  <span>{field.label}</span>
                </label>
              ))}
            </div>
          </div>
          <button
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
            onClick={() => onExport("csv", dateRange, selectedFields)}
            disabled={selectedFields.length === 0}
          >
            Download as CSV
          </button>
          <button
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded"
            onClick={() => onExport("xlsx", dateRange, selectedFields)}
            disabled={selectedFields.length === 0}
          >
            Download as Excel (XLSX)
          </button>
          <button
            className="w-full bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded mt-2"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportModal;
