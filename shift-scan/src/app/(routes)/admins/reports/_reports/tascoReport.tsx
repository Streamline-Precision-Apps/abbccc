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

const formatDate = (dateString: string) =>
  dateString ? new Date(dateString).toLocaleString() : "";

export default function TascoReport() {
  const [data, setData] = useState<TascoReportRow[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

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

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {TABLE_HEADERS.map((header) => (
            <TableHead key={header} className="text-center  min-w-[160px]">
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
              No data available.
            </TableCell>
          </TableRow>
        ) : (
          data.map((row) => (
            <TableRow key={row.id}>
              <TableCell className="text-center">{row.id}</TableCell>
              <TableCell className="text-center">
                {row.shiftType === "ABCD Shift"
                  ? "TASCO - A, B, C, D Shift"
                  : row.shiftType === "E Shift"
                  ? "TASCO - E Shift Mud Conditioning"
                  : row.shiftType}
              </TableCell>
              <TableCell className="text-center">
                {format(row.submittedDate, "yyyy/MM/dd")}
              </TableCell>
              <TableCell className="text-center">{row.employee}</TableCell>
              <TableCell className="text-center">
                {format(row.dateWorked, "yyyy/MM/dd")}
              </TableCell>
              <TableCell className="text-center">
                {row.laborType === "tascoAbcdEquipment"
                  ? "Equipment Operator"
                  : row.laborType === "tascoEEquipment"
                  ? "-"
                  : row.laborType === "tascoAbcdLabor"
                  ? "Equipment Operator"
                  : "-"}
              </TableCell>
              <TableCell className="text-center">
                {row.equipment || "-"}
              </TableCell>
              <TableCell className="text-center">
                {row.loadsABCDE || "-"}
              </TableCell>
              <TableCell className="text-center">{row.loadsF || "-"}</TableCell>
              <TableCell className="text-center">
                {row.materials || "-"}
              </TableCell>
              <TableCell className="text-center">
                {format(row.startTime, "HH:mm") || "-"}
              </TableCell>
              <TableCell className="text-center">
                {format(row.endTime, "HH:mm") || "-"}
              </TableCell>
              <TableCell className="text-center">
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
  );
}
