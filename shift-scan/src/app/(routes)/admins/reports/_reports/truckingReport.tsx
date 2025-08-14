"use client";

import { useState, useEffect } from "react";
import { TruckingDataTable } from "../_components/ViewAll/TruckingDataTable";
import { TruckingReportRow } from "../_components/ViewAll/truckingReportTableColumns";
import { ExportReportModal } from "../ExportModal";
import { format } from "date-fns";

interface TruckingReportProps {
  showExportModal: boolean;
  setShowExportModal: (show: boolean) => void;
  registerReload?: (reloadFn: () => Promise<void>) => void;
  isRefreshing?: boolean;
}

type DateRange = { from: Date | undefined; to: Date | undefined };

export default function TruckingReport({
  showExportModal,
  setShowExportModal,
  registerReload,
  isRefreshing,
}: TruckingReportProps) {
  const [data, setData] = useState<TruckingReportRow[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [dateRange, setDateRange] = useState<DateRange>({
    from: undefined,
    to: undefined,
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/reports/trucking");
      const json = await response.json();
      if (!response.ok) {
        throw new Error(json.message || "Failed to fetch Trucking report data");
      }
      setData(json);
    } catch (error) {
      console.error("Error fetching Trucking report data:", error);
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
          const date = new Date(row.date);
          return date >= startOfDay && date <= endOfDay;
        });
      } else {
        exportData = data.filter((row) => {
          const date = new Date(row.date);
          return date >= dateRange.from! && date <= dateRange.to!;
        });
      }
    }

    const tableHeaders = [
      "Driver",
      "Date",
      "Truck #",
      "Trailer #",
      "Trailer Type",
      "Job #",
      "Starting Mileage",
      "Ending Mileage",
      "Equipment",
      "Material Hauled",
      "Refuel Details",
      "State Line Details",
      "Notes",
    ];

    if (exportFormat === "csv") {
      const csvRows = [
        tableHeaders.join(","),
        ...exportData.map((row) => {
          return [
            row.driver,
            format(new Date(row.date), "yyyy-MM-dd"),
            row.truckName || "-",
            row.trailerName || "-",
            row.trailerType || "-",
            row.jobId || "-",
            row.StartingMileage || "-",
            row.EndingMileage || "-",
            row.Equipment?.length || 0,
            row.Materials?.length || 0,
            row.Fuel?.length || 0,
            row.StateMileages?.length || 0,
            row.notes || "-",
          ]
            .map((cell) => {
              if (cell === null || cell === undefined) return "";
              const str = String(cell);
              // Always quote, and escape quotes inside
              return '"' + str.replace(/"/g, '""') + '"';
            })
            .join(",");
        }),
      ];

      const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "trucking-report.csv";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } else if (exportFormat === "xlsx") {
      import("xlsx").then((XLSX) => {
        const ws = XLSX.utils.json_to_sheet(
          exportData.map((row) => ({
            Driver: row.driver,
            Date: format(new Date(row.date), "yyyy/MM/dd"),
            "Truck #": row.truckName || "-",
            "Trailer #": row.trailerName || "-",
            "Trailer Type": row.trailerType || "-",
            "Job #": row.jobId || "-",
            "Starting Mileage": row.StartingMileage || "-",
            "Ending Mileage": row.EndingMileage || "-",
            "Equipment Count": row.Equipment?.length || 0,
            "Material Hauled Count": row.Materials?.length || 0,
            "Refuel Details Count": row.Fuel?.length || 0,
            "State Line Details Count": row.StateMileages?.length || 0,
            Notes: row.notes || "-",
          })),
        );
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Trucking Report");
        XLSX.writeFile(wb, "trucking-report.xlsx");
      });
    }
  };

  return (
    <>
      <TruckingDataTable data={data} loading={loading} />

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
