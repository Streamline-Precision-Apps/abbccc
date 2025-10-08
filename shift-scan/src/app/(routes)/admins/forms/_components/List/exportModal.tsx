import { Dispatch, SetStateAction, useState } from "react";
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
    selectedFields?: string[],
  ) => void;
  setDateRange: Dispatch<SetStateAction<DateRange>>;
  dateRange: DateRange;
}

import { ChevronDownIcon, Download, X } from "lucide-react";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

const ExportModal = ({
  onClose,
  onExport,
  setDateRange,
  dateRange,
}: ExportModalProps) => {
  const [exportFormat, setExportFormat] = useState<"csv" | "xlsx" | "">("");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg min-w-[700px] max-h-[80vh] overflow-y-auto no-scrollbar ">
        <div className=" flex flex-col gap-4 px-6 py-4 items-center w-full relative">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => {
              setDateRange({ from: undefined, to: undefined });
              setExportFormat("");
              onClose();
            }}
            className="absolute top-0 right-0 cursor-pointer"
          >
            <X width={20} height={20} />
          </Button>
          <div className="mb-6 relative w-full">
            <div className="flex flex-row gap-2 items-center mb-2">
              <Download className="h-5 w-5" />
              <h2 className="text-xl font-bold">Export Form Data</h2>
            </div>
            <p className="text-xs text-gray-600">
              Select a date range, apply filters, and choose your preferred
              export format
            </p>
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
              onClick={() => exportFormat && onExport(exportFormat, dateRange)}
              disabled={!exportFormat}
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
