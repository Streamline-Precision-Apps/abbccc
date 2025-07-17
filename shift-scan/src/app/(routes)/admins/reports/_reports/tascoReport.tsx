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
}

type DateRange = { from: Date | undefined; to: Date | undefined };

export default function TascoReport({
  showExportModal,
  setShowExportModal,
}: TascoReportProps) {
  const [data, setData] = useState<TascoReportRow[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [dateRange, setDateRange] = useState<DateRange>({
    from: undefined,
    to: undefined,
  });

  useEffect(() => {
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
        const date = new Date(row.dateWorked);
        return date >= dateRange.from! && date <= dateRange.to!;
      });
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
      {loading ? (
        <Table className="w-full h-full bg-white rounded-lg">
          <TableHeader className="bg-gray-100 rounded-lg ">
            <TableRow className="h-10">
              {TABLE_HEADERS.map((header, idx) => (
                <TableHead key={header} className="text-center min-w-[100px]">
                  <Skeleton className="h-4 w-3/4 mx-auto" />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody className="bg-white pt-2">
            {[...Array(20)].map((_, i) => (
              <TableRow key={i}>
                {TABLE_HEADERS.map((_, idx) => (
                  <TableCell
                    key={idx}
                    className="text-center border border-slate-300"
                  >
                    <Skeleton className="h-8 w-full mx-auto" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
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
                <TableCell
                  colSpan={TABLE_HEADERS.length}
                  className="text-center"
                >
                  Loading...
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={TABLE_HEADERS.length}
                  className="text-center"
                >
                  No data available.
                </TableCell>
              </TableRow>
            ) : (
              data.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="text-center w-fit border border-slate-300">
                    {row.id}
                  </TableCell>
                  <TableCell className="text-center border border-slate-300">
                    {row.shiftType === "ABCD Shift"
                      ? "TASCO - A, B, C, D Shift"
                      : row.shiftType === "E shift"
                      ? "TASCO - E Shift Mud Conditioning"
                      : row.shiftType}
                  </TableCell>
                  <TableCell className="text-center border border-slate-300">
                    {format(row.submittedDate, "yyyy/MM/dd")}
                  </TableCell>
                  <TableCell className="text-center border border-slate-300">
                    {row.employee}
                  </TableCell>
                  <TableCell className="text-center border border-slate-300">
                    {format(row.dateWorked, "yyyy/MM/dd")}
                  </TableCell>
                  <TableCell className="text-center border border-slate-300">
                    {row.laborType === "tascoAbcdEquipment"
                      ? "Equipment Operator"
                      : row.laborType === "tascoEEquipment"
                      ? "-"
                      : row.laborType === "tascoAbcdLabor"
                      ? "Equipment Operator"
                      : "-"}
                  </TableCell>
                  <TableCell className="text-center border border-slate-300">
                    {row.equipment || "-"}
                  </TableCell>
                  <TableCell className="text-center border border-slate-300">
                    {row.loadsABCDE || "-"}
                  </TableCell>
                  <TableCell className="text-center border border-slate-300">
                    {row.loadsF || "-"}
                  </TableCell>
                  <TableCell className="text-center border border-slate-300">
                    {row.materials || "-"}
                  </TableCell>
                  <TableCell className="text-center border border-slate-300">
                    {format(row.startTime, "HH:mm") || "-"}
                  </TableCell>
                  <TableCell className="text-center border border-slate-300">
                    {format(row.endTime, "HH:mm") || "-"}
                  </TableCell>
                  <TableCell className="text-center border border-slate-300">
                    {row.LoadType === "SCREENED"
                      ? "Screened"
                      : row.LoadType === "UNSCREENED"
                      ? "Unscreened"
                      : "-"}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
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
