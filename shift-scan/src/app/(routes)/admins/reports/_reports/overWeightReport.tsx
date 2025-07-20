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
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "@/components/ui/hover-card";

const TABLE_HEADERS = [
  "Truck#",
  "Trailer#",
  "Date",
  "Job#",
  "Equipment",
  "Starting Mileage",
  "Ending Mileage",
  "Material Hauled",
  "Fuel Gallons",
  "Refuel Details",
  "Stateline Mileage",
  "Notes",
];
interface EquipmentItem {
  name: string;
  id: string;
  startMileage: number;
  endMileage: number;
}
interface MaterialItem {
  id: string;
  name: string;
  location: string;
  quantity: number;
  unit: string;
}
interface FuelItem {
  milesAtFueling: number;
  gallonsRefueled: number;
}
interface StateMileageItem {
  state: string;
  stateLineMileage: number;
}
interface OverWeightReportRow {
  truckId: string | null;
  trailerId: string | null;
  trailerType?: string | null;
  date: string;
  jobId: string | null;
  Equipment: EquipmentItem[];
  Materials: MaterialItem[];
  StartingMileage: number;
  Fuel: FuelItem[];
  StateMileages: StateMileageItem[];
  EndingMileage: number;
  notes?: string;
}
// [Date, Truck Id, Job#, Equipment, OverWeight Start Odometer, OverWeight End Odometer]

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
            row.truckId,
            row.trailerId,
            row.date,
            row.jobId,
            Array.isArray(row.Equipment)
              ? row.Equipment.map((eq: EquipmentItem) => eq.name).join(", ")
              : "",
            row.StartingMileage ?? "",
            Array.isArray(row.Equipment)
              ? row.Equipment.map((eq: EquipmentItem) => eq.endMileage).join(
                  ", "
                )
              : "",
            Array.isArray(row.Materials)
              ? row.Materials.map((mat: MaterialItem) => mat.name).join(", ")
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
            "Truck Id": row.truckId || "",
            "Trailer Id": row.trailerId || "",
            Date: row.date ? format(row.date, "yyyy-MM-dd") : "",
            "Job Id": row.jobId || "",
            Equipment: Array.isArray(row.Equipment)
              ? row.Equipment.map((eq: EquipmentItem) => eq.name).join(", ")
              : "",
            "OverWeight Start Odometer": row.StartingMileage ?? "",
            "OverWeight End Odometer": Array.isArray(row.Equipment)
              ? row.Equipment.map((eq: EquipmentItem) => eq.endMileage).join(
                  ", "
                )
              : "",
            "Material Hauled": Array.isArray(row.Materials)
              ? row.Materials.map((mat: MaterialItem) => mat.name).join(", ")
              : 0,
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
              <TableHead
                key={header}
                className="text-sm text-center border-r border-gray-200 bg-gray-100"
              >
                {header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody className="divide-y divide-gray-200 bg-white">
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
            data.map((row, rowIdx) => (
              <TableRow
                key={`${row.truckId}-${row.date}-${row.StartingMileage}-${row.EndingMileage}-${row.jobId}`}
                className={rowIdx % 2 === 0 ? "bg-white" : "bg-gray-100"}
              >
                <TableCell className="border-r border-gray-200 text-xs text-center">
                  {row.truckId || ""}
                </TableCell>
                <TableCell className="border-r border-gray-200 text-xs text-center">
                  {row.trailerId || ""}
                </TableCell>

                <TableCell className="border-r border-gray-200 text-xs text-center">
                  {row.date ? format(new Date(row.date), "MM/dd/yy") : ""}
                </TableCell>
                <TableCell className="border-r border-gray-200 text-xs text-center">
                  {row.jobId || ""}
                </TableCell>
                <TableCell className="border-r border-gray-200 text-xs text-center">
                  {/* Equipment: join all names if array exists */}
                  {Array.isArray(row.Equipment)
                    ? row.Equipment.map((eq: EquipmentItem) => eq.name).join(
                        ", "
                      )
                    : ""}
                </TableCell>
                <TableCell className="border-r border-gray-200 text-xs text-center">
                  {/* Starting Mileage: use StartingMileage */}
                  {row.StartingMileage ?? ""}
                </TableCell>
                <TableCell className="border-r border-gray-200 text-xs text-center">
                  {/* Ending Mileage: use EndingMileage */}
                  {row.EndingMileage ?? ""}
                </TableCell>

                <TableCell className="border-r border-gray-200 text-xs text-center">
                  {/* Material Hauled: show count, hover for details */}
                  {Array.isArray(row.Materials) && row.Materials.length > 0 ? (
                    <HoverCard>
                      <HoverCardTrigger asChild>
                        <span className="cursor-pointer underline text-blue-600">
                          {row.Materials.length}
                        </span>
                      </HoverCardTrigger>
                      <HoverCardContent className="p-2">
                        <div className="overflow-x-auto">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead className="px-2 py-1 border-b">
                                  Name
                                </TableHead>
                                <TableHead className="px-2 py-1 border-b">
                                  Location
                                </TableHead>
                                <TableHead className="px-2 py-1 border-b">
                                  Qty
                                </TableHead>
                                <TableHead className="px-2 py-1 border-b">
                                  Unit
                                </TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {row.Materials.map((mat: MaterialItem) => (
                                <TableRow key={mat.id}>
                                  <TableCell className="px-2 py-1 border-b">
                                    {mat.name}
                                  </TableCell>
                                  <TableCell className="px-2 py-1 border-b">
                                    {mat.location}
                                  </TableCell>
                                  <TableCell className="px-2 py-1 border-b">
                                    {mat.quantity}
                                  </TableCell>
                                  <TableCell className="px-2 py-1 border-b">
                                    {mat.unit}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </HoverCardContent>
                    </HoverCard>
                  ) : (
                    "-"
                  )}
                </TableCell>

                <TableCell className="border-r border-gray-200 text-xs text-center">
                  {/* Fuel Gallons: show count, hover for details */}
                  {Array.isArray(row.Fuel) && row.Fuel.length > 0 ? (
                    <HoverCard>
                      <HoverCardTrigger asChild>
                        <span className="cursor-pointer underline text-blue-600">
                          {row.Fuel.length}
                        </span>
                      </HoverCardTrigger>
                      <HoverCardContent className="p-2">
                        <div className="overflow-x-auto">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead className="px-2 py-1 border-b">
                                  Miles At Fueling
                                </TableHead>
                                <TableHead className="px-2 py-1 border-b">
                                  Gallons Refueled
                                </TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {row.Fuel.map((f: FuelItem, idx: number) => (
                                <TableRow key={idx}>
                                  <TableCell className="px-2 py-1 border-b">
                                    {f.milesAtFueling}
                                  </TableCell>
                                  <TableCell className="px-2 py-1 border-b">
                                    {f.gallonsRefueled}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </HoverCardContent>
                    </HoverCard>
                  ) : (
                    ""
                  )}
                </TableCell>
                <TableCell className="border-r border-gray-200 text-xs text-center">
                  {/* Refuel Details: show count, hover for details */}
                  {Array.isArray(row.Fuel) && row.Fuel.length > 0 ? (
                    <HoverCard>
                      <HoverCardTrigger asChild>
                        <span className="cursor-pointer underline text-blue-600">
                          {row.Fuel.length}
                        </span>
                      </HoverCardTrigger>
                      <HoverCardContent className="p-2">
                        <div className="overflow-x-auto">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead className="px-2 py-1 border-b">
                                  Miles At Fueling
                                </TableHead>
                                <TableHead className="px-2 py-1 border-b">
                                  Gallons Refueled
                                </TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {row.Fuel.map((f: FuelItem, idx: number) => (
                                <TableRow key={idx}>
                                  <TableCell className="px-2 py-1 border-b">
                                    {f.milesAtFueling}
                                  </TableCell>
                                  <TableCell className="px-2 py-1 border-b">
                                    {f.gallonsRefueled}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </HoverCardContent>
                    </HoverCard>
                  ) : (
                    ""
                  )}
                </TableCell>
                <TableCell className="border-r border-gray-200 text-xs text-center">
                  {/* Stateline Mileage: show count, hover for details */}
                  {Array.isArray(row.StateMileages) &&
                  row.StateMileages.length > 0 ? (
                    <HoverCard>
                      <HoverCardTrigger asChild>
                        <span className="cursor-pointer underline text-blue-600">
                          {row.StateMileages.length}
                        </span>
                      </HoverCardTrigger>
                      <HoverCardContent className="p-2">
                        <div className="overflow-x-auto">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead className="px-2 py-1 border-b">
                                  State
                                </TableHead>
                                <TableHead className="px-2 py-1 border-b">
                                  State Line Mileage
                                </TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {row.StateMileages.map(
                                (s: StateMileageItem, idx: number) => (
                                  <TableRow key={idx}>
                                    <TableCell className="px-2 py-1 border-b">
                                      {s.state}
                                    </TableCell>
                                    <TableCell className="px-2 py-1 border-b">
                                      {s.stateLineMileage}
                                    </TableCell>
                                  </TableRow>
                                )
                              )}
                            </TableBody>
                          </Table>
                        </div>
                      </HoverCardContent>
                    </HoverCard>
                  ) : (
                    ""
                  )}
                </TableCell>

                <TableCell className="border-r border-gray-200 text-xs text-center">
                  {row.notes}
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
