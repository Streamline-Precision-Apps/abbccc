"use client";

import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { ExportReportModal } from "../ExportModal";
import { Skeleton } from "@/components/ui/skeleton";
import Spinner from "@/components/(animations)/spinner";

const TABLE_HEADERS = [
  "Id",
  "Shift Type",
  "Submitted Date",
  "Employee",
  "Date Worked",
  "Labor Type",
  "Equipment",
  "Loads - ABCDE",
  "Loads - F",
  "Materials",
  "Start Time",
  "End Time",
  "Screened or Unscreened",
];

interface TascoReportRow {
  id: string;
  shiftType: string;
  submittedDate: string;
  employee: string;
  dateWorked: string;
  laborType: string;
  equipment: string;
  loadsABCDE: number;
  loadsF: number;
  materials: string;
  startTime: string;
  endTime: string;
  LoadType: string;
}

interface TascoReportProps {
  showExportModal: boolean;
  setShowExportModal: (show: boolean) => void;
  registerReload?: (reloadFn: () => Promise<void>) => void;
  isRefreshing?: boolean;
}

type DateRange = { from: Date | undefined; to: Date | undefined };

export default function TascoReport({
  showExportModal,
  setShowExportModal,
  registerReload,
  isRefreshing,
}: TascoReportProps) {
  const [data, setData] = useState<TascoReportRow[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [dateRange, setDateRange] = useState<DateRange>({
    from: undefined,
    to: undefined,
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/reports/tasco");
      const json = await response.json();
      if (!response.ok) {
        throw new Error(json.message || "Failed to fetch Tasco report data");
      }
      setData(json);
    } catch (error) {
      console.error("Error fetching Tasco report data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Register reload function on mount
  useEffect(() => {
    if (registerReload) {
      registerReload(fetchData);
    }
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [registerReload]);

  const onExport = (
    exportFormat: "csv" | "xlsx",
    _dateRange?: { from?: Date; to?: Date },
    selectedFields?: string[],
  ) => {
    if (!data.length) return;
    // Filter by dateRange if set
    let exportData = data;
    if (dateRange.from && dateRange.to) {
      // If from and to are the same day, filter by the full day
      const isSameDay =
        dateRange.from.toDateString() === dateRange.to.toDateString();
      if (isSameDay) {
        const startOfDay = new Date(dateRange.from);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(dateRange.from);
        endOfDay.setHours(23, 59, 59, 999);
        exportData = data.filter((row) => {
          const date = new Date(row.dateWorked);
          return date >= startOfDay && date <= endOfDay;
        });
      } else {
        exportData = data.filter((row) => {
          const date = new Date(row.dateWorked);
          return date >= dateRange.from! && date <= dateRange.to!;
        });
      }
    }
    if (exportFormat === "csv") {
      const csvRows = [
        TABLE_HEADERS.join(","),
        ...exportData.map((row) =>
          [
            row.id,
            row.shiftType === "ABCD Shift"
              ? "TASCO - A, B, C, D Shift"
              : row.shiftType === "E Shift"
                ? "TASCO - E Shift Mud Conditioning"
                : row.shiftType,
            format(row.submittedDate, "yyyy-MM-dd"),
            row.employee,
            format(row.dateWorked, "yyyy-MM-dd"),
            row.laborType === "tascoAbcdEquipment"
              ? "Equipment Operator"
              : row.laborType === "tascoEEquipment"
                ? "-"
                : row.laborType === "tascoAbcdLabor"
                  ? "Equipment Operator"
                  : "-",
            row.equipment || "-",
            row.loadsABCDE || "-",
            row.loadsF || "-",
            row.materials || "-",
            format(row.startTime, "HH:mm") || "-",
            format(row.endTime, "HH:mm") || "-",
            row.LoadType === "SCREENED"
              ? "Screened"
              : row.LoadType === "UNSCREENED"
                ? "Unscreened"
                : "-",
          ]
            .map((cell) => {
              if (cell === null || cell === undefined) return "";
              const str = String(cell);
              // Always quote, and escape quotes inside
              return '"' + str.replace(/"/g, '""') + '"';
            })
            .join(","),
        ),
      ];
      const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "tasco-report.csv";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } else if (exportFormat === "xlsx") {
      import("xlsx").then((XLSX) => {
        const ws = XLSX.utils.json_to_sheet(
          exportData.map((row) => ({
            Id: row.id,
            "Shift Type":
              row.shiftType === "ABCD Shift"
                ? "TASCO - A, B, C, D Shift"
                : row.shiftType === "E Shift"
                  ? "TASCO - E Shift Mud Conditioning"
                  : row.shiftType,
            "Submitted Date": format(row.submittedDate, "yyyy/MM/dd"),
            Employee: row.employee,
            "Date Worked": format(row.dateWorked, "yyyy/MM/dd"),
            "Labor Type":
              row.laborType === "tascoAbcdEquipment"
                ? "Equipment Operator"
                : row.laborType === "tascoEEquipment"
                  ? "-"
                  : row.laborType === "tascoAbcdLabor"
                    ? "Equipment Operator"
                    : "-",
            Equipment: row.equipment || "-",
            "Loads - ABCDE": row.loadsABCDE || "-",
            "Loads - F": row.loadsF || "-",
            Materials: row.materials || "-",
            "Start Time": format(row.startTime, "HH:mm") || "-",
            "End Time": format(row.endTime, "HH:mm") || "-",
            "Screened or Unscreened":
              row.LoadType === "SCREENED"
                ? "Screened"
                : row.LoadType === "UNSCREENED"
                  ? "Unscreened"
                  : "-",
          })),
        );
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Tasco Report");
        XLSX.writeFile(wb, "tasco-report.xlsx");
      });
    }
  };

  return (
    <>
      {loading && (
        <div className="absolute inset-0 z-20 flex flex-row items-center gap-2 justify-center bg-white bg-opacity-70 rounded-lg">
          <Spinner size={20} />
          <span className="text-lg text-gray-500">Loading...</span>
        </div>
      )}

      <Table>
        <TableHeader>
          <TableRow>
            {TABLE_HEADERS.map((header) => (
              <TableHead
                key={header}
                className="text-sm text-center border-r border-gray-200 bg-gray-100"
              >
                {header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        {loading ? (
          <TableBody className="divide-y divide-gray-200 bg-white">
            {Array.from({ length: 20 }).map((_, rowIdx) => (
              <TableRow
                key={rowIdx}
                className={rowIdx % 2 === 0 ? "bg-white" : "bg-gray-100"}
              >
                {TABLE_HEADERS.map((header, colIdx) => (
                  <TableCell
                    key={colIdx}
                    className="border-r border-gray-200 text-xs text-center"
                  >
                    <Skeleton className="h-4 w-3/4 mx-auto" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        ) : (
          <TableBody className="divide-y divide-gray-200 bg-white">
            {data.map((row, rowIdx) => (
              <TableRow
                key={row.id}
                className={rowIdx % 2 === 0 ? "bg-white" : "bg-gray-100"}
              >
                <TableCell className="border-r border-gray-200 text-xs text-center">
                  {row.id}
                </TableCell>
                <TableCell className="border-r border-gray-200 text-xs text-center">
                  {row.shiftType === "ABCD Shift"
                    ? "TASCO - A, B, C, D Shift"
                    : row.shiftType === "E shift"
                      ? "TASCO - E Shift Mud Conditioning"
                      : row.shiftType}
                </TableCell>
                <TableCell className="border-r border-gray-200 text-xs text-center">
                  {format(row.submittedDate, "yyyy/MM/dd")}
                </TableCell>
                <TableCell className="border-r border-gray-200 text-xs text-center">
                  {row.employee}
                </TableCell>
                <TableCell className="border-r border-gray-200 text-xs text-center">
                  {format(row.dateWorked, "yyyy/MM/dd")}
                </TableCell>
                <TableCell className="border-r border-gray-200 text-xs text-center">
                  {row.laborType === "tascoAbcdEquipment"
                    ? "Equipment Operator"
                    : row.laborType === "tascoEEquipment"
                      ? "-"
                      : row.laborType === "tascoAbcdLabor"
                        ? "Equipment Operator"
                        : "-"}
                </TableCell>
                <TableCell className="border-r border-gray-200 text-xs text-center">
                  {row.equipment || "-"}
                </TableCell>
                <TableCell className="border-r border-gray-200 text-xs text-center">
                  {row.loadsABCDE || "-"}
                </TableCell>
                <TableCell className="border-r border-gray-200 text-xs text-center">
                  {row.loadsF || "-"}
                </TableCell>
                <TableCell className="border-r border-gray-200 text-xs text-center">
                  {row.materials || "-"}
                </TableCell>
                <TableCell className="border-r border-gray-200 text-xs text-center">
                  {format(row.startTime, "HH:mm") || "-"}
                </TableCell>
                <TableCell className="border-r border-gray-200 text-xs text-center">
                  {format(row.endTime, "HH:mm") || "-"}
                </TableCell>
                <TableCell className="border-r border-gray-200 text-xs text-center">
                  {row.LoadType === "SCREENED"
                    ? "Screened"
                    : row.LoadType === "UNSCREENED"
                      ? "Unscreened"
                      : "-"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        )}
      </Table>
      {data.length === 0 && !loading && (
        <div className="w-full h-full flex justify-center items-center absolute left-0 top-0 z-50  rounded-[10px]">
          <p className="text-gray-500 italic">
            No data available for a TASCO Reports.
          </p>
        </div>
      )}

      {showExportModal && (
        <ExportReportModal
          onClose={() => setShowExportModal(false)}
          onExport={onExport}
          dateRange={{ from: dateRange.from, to: dateRange.to }}
          setDateRange={setDateRange}
        />
      )}
    </>
  );
}
