"use client";

import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { useEffect, useState } from "react";

export default function TascoReport() {
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
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/reports/tasco");
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch Tasco report data");
        }
        // Process the data as needed
        setData(data); // Assuming data is an array of objects
        console.log("Tasco report data:", data);
        // You can set state here to render the data in the table
      } catch (error) {
        console.error("Error fetching Tasco report data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {tableHeaders.map((header) => (
            <TableHead key={header} className="text-center">
              {header}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {/* Data rows will go here */}
        <TableRow>
          {tableHeaders.map((_, idx) => (
            <TableCell
              key={idx}
              className="text-center odd:bg-gray-100 even:bg-gray-50"
            ></TableCell>
          ))}
        </TableRow>
      </TableBody>
    </Table>
  );
}
