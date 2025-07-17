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

const TABLE_HEADERS = [
  "Date",
  "Truck Id",
  "Operator",
  "Equipment",
  "OverWeight Amount",
  "Total Mileage",
];
interface OverWeightReportRow {
  date: string;
  truckId: string;
  operator: string;
  equipment: string;
  overWeightAmount: number;
  totalMileage: number;
}
// [Date, Truck Id, Operator, Equipment, OverWeight Amount, Total Mileage]

interface OverWeightReportProps {
  showExportModal: boolean;
  setShowExportModal: (show: boolean) => void;
}

type DateRange = { from: Date | undefined; to: Date | undefined };

export default function OverWeightReport({
  showExportModal,
  setShowExportModal,
}: OverWeightReportProps) {
  const [data, setData] = useState<OverWeightReportRow[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [dateRange, setDateRange] = useState<DateRange>({
    from: undefined,
    to: undefined,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/reports/overWeight");
        const json = await response.json();
        if (!response.ok) {
          throw new Error(
            json.message || "Failed to fetch OverWeight report data"
          );
        }
        setData(json);
      } catch (error) {
        console.error("Error fetching OverWeight report data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const onExport = (
    exportFormat: "csv" | "xlsx",
    _dateRange?: { from?: Date; to?: Date },
    selectedFields?: string[]
  ) => {
    if (!data.length) return;
    // Filter by dateRange if set
    let exportData = data;
    if (dateRange.from && dateRange.to) {
      exportData = data.filter((row) => {
        const date = new Date(row.date);
        return date >= dateRange.from! && date <= dateRange.to!;
      });
    }
    if (exportFormat === "csv") {
      const csvRows = [
        TABLE_HEADERS.join(","),
        ...exportData.map((row) =>
          [
            row.date,
            row.truckId,
            row.operator,
            row.equipment,
            row.overWeightAmount,
            row.totalMileage,
          ]
            .map((cell) => {
              if (cell === null || cell === undefined) return "";
              const str = String(cell);
              // Always quote, and escape quotes inside
              return '"' + str.replace(/"/g, '""') + '"';
            })
            .join(",")
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
            Date: row.date ? format(row.date, "yyyy-MM-dd") : "",
            "Truck Id": row.truckId || "",
            Operator: row.operator || "",
            Equipment: row.equipment || "",
            "OverWeight Amount": row.overWeightAmount || "",
            "Total Mileage": row.totalMileage || "",
          }))
        );
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Tasco Report");
        XLSX.writeFile(wb, "tasco-report.xlsx");
      });
    }
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            {TABLE_HEADERS.map((header) => (
              <TableHead key={header} className="text-center min-w-[100px]">
                {header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={TABLE_HEADERS.length} className="text-center">
                Loading...
              </TableCell>
            </TableRow>
          ) : data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={TABLE_HEADERS.length} className="text-center">
                No data available for the selected criteria.
              </TableCell>
            </TableRow>
          ) : (
            data.map((row) => (
              <TableRow key={row.truckId}>
                <TableCell className="text-center">
                  {row.date ? format(row.date, "yyyy-MM-dd") : ""}
                </TableCell>
                <TableCell className="text-center">
                  {row.truckId || ""}
                </TableCell>
                <TableCell className="text-center">
                  {row.operator || ""}
                </TableCell>
                <TableCell className="text-center">
                  {row.equipment || ""}
                </TableCell>
                <TableCell className="text-center">
                  {row.overWeightAmount || ""}
                </TableCell>
                <TableCell className="text-center">
                  {row.totalMileage || ""}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
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
