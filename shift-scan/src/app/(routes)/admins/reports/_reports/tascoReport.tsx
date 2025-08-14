"use client";

import { useState, useEffect } from "react";
import { TascoDataTable } from "../_components/ViewAll/TascoDataTable";
import { TascoReportRow } from "../_components/ViewAll/tascoReportTableColumns";
import { ExportReportModal } from "../ExportModal";
import { format } from "date-fns";

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

    const tableHeaders = [
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

    if (exportFormat === "csv") {
      const csvRows = [
        tableHeaders.join(","),
        ...exportData.map((row) =>
          [
            row.id,
            row.shiftType === "ABCD Shift"
              ? "TASCO - A, B, C, D Shift"
              : row.shiftType === "E Shift"
                ? "TASCO - E Shift Mud Conditioning"
                : row.shiftType,
            format(new Date(row.submittedDate), "yyyy-MM-dd"),
            row.employee,
            format(new Date(row.dateWorked), "yyyy-MM-dd"),
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
            format(new Date(row.startTime), "HH:mm") || "-",
            format(new Date(row.endTime), "HH:mm") || "-",
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
            "Submitted Date": format(new Date(row.submittedDate), "yyyy/MM/dd"),
            Employee: row.employee,
            "Date Worked": format(new Date(row.dateWorked), "yyyy/MM/dd"),
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
            "Start Time": format(new Date(row.startTime), "HH:mm") || "-",
            "End Time": format(new Date(row.endTime), "HH:mm") || "-",
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
      <TascoDataTable data={data} loading={loading} />

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
