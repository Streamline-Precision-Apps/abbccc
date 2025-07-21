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
import { ExportTruckingReportModal } from "../ExportModalTrucking";
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "@/components/ui/hover-card";
import Spinner from "@/components/(animations)/spinner";
import { Skeleton } from "@/components/ui/skeleton";

const TABLE_HEADERS = [
  "Id",
  "Truck#",
  "Trailer#",
  "Date",
  "Job#",
  "Starting Mileage",
  "Ending Mileage",
  "Equipment Hauled",
  "Material Hauled",
  "Refuel Details",
  "State Line Details",
  "Notes",
];
interface EquipmentItem {
  id: string;
  name: string;
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
  id: string;
  milesAtFueling: number;
  gallonsRefueled: number;
}
interface StateMileageItem {
  id: string;
  state: string;
  stateLineMileage: number;
}
interface TruckingReportReportRow {
  id: string;
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
// [Date, Truck Id, Job#, Equipment, TruckingReport Start Odometer, TruckingReport End Odometer]

interface TruckingReportReportProps {
  showExportModal: boolean;
  setShowExportModal: (show: boolean) => void;
}

type DateRange = { from: Date | undefined; to: Date | undefined };

export default function TruckingReport({
  showExportModal,
  setShowExportModal,
}: TruckingReportReportProps) {
  const [data, setData] = useState<TruckingReportReportRow[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [dateRange, setDateRange] = useState<DateRange>({
    from: undefined,
    to: undefined,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/reports/truckingReport");
        const json = await response.json();
        if (!response.ok) {
          throw new Error(
            json.message || "Failed to fetch TruckingReport report data"
          );
        }
        setData(json);
      } catch (error) {
        console.error("Error fetching TruckingReport report data:", error);
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
      // Prepare all rows for each CSV
      const mainRows = exportData.map((row) => [
        row.id || "",
        row.truckId || "",
        row.trailerId || "",
        row.date ? format(new Date(row.date), "MM/dd/yy") : "",
        row.jobId || "",
        row.StartingMileage ?? "",
        row.EndingMileage ?? "",
        Array.isArray(row.Materials) ? row.Materials.length : 0,
        row.notes ?? "",
      ]);

      const equipmentRows = exportData.flatMap((row) =>
        Array.isArray(row.Equipment)
          ? row.Equipment.map((eq) => [
              row.id || "",
              eq.name,
              eq.startMileage,
              eq.endMileage,
            ])
          : []
      );

      const materialRows = exportData.flatMap((row) =>
        Array.isArray(row.Materials)
          ? row.Materials.map((mat) => [
              row.id || "",
              mat.name,
              mat.location,
              mat.quantity,
              mat.unit,
            ])
          : []
      );

      const refuelRows = exportData.flatMap((row) =>
        Array.isArray(row.Fuel)
          ? row.Fuel.map((f) => [
              row.id || "",
              f.milesAtFueling,
              f.gallonsRefueled,
            ])
          : []
      );

      const statelineRows = exportData.flatMap((row) =>
        Array.isArray(row.StateMileages)
          ? row.StateMileages.map((s) => [
              row.id || "",
              s.state,
              s.stateLineMileage,
            ])
          : []
      );

      // Helper to convert array of arrays to CSV string
      const toCsv = (header: string[], rows: (string | number)[][]): string =>
        [
          header.join(","),
          ...rows.map((r: (string | number)[]) =>
            r
              .map(
                (cell: string | number) =>
                  '"' + String(cell ?? "").replace(/"/g, '""') + '"'
              )
              .join(",")
          ),
        ].join("\n");

      // Download helper
      const downloadCsv = (csvString: string, filename: string): void => {
        const blob = new Blob([csvString], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      };

      // Helper to format date range for filenames
      const getDateRangeSuffix = (): string => {
        if (dateRange.from && dateRange.to) {
          const fromStr = format(dateRange.from, "MMddyy");
          const toStr = format(dateRange.to, "MMddyy");
          return `_${fromStr}-${toStr}`;
        } else if (dateRange.from) {
          return `_${format(dateRange.from, "MMddyy")}`;
        } else if (dateRange.to) {
          return `_${format(dateRange.to, "MMddyy")}`;
        }
        return "";
      };
      const dateSuffix = getDateRangeSuffix();

      // Only export selected categories
      if (!selectedFields || selectedFields.includes("general")) {
        downloadCsv(
          toCsv(
            [
              "ReportId",
              "Truck#",
              "Trailer#",
              "Date",
              "Job#",
              "Starting Mileage",
              "Ending Mileage",
              "# of Loads",
              "Notes",
            ],
            mainRows
          ),
          `tasco-report-summary${dateSuffix}.csv`
        );
      }
      if (!selectedFields || selectedFields.includes("equipment")) {
        downloadCsv(
          toCsv(
            [
              "ReportId",
              "Name",
              "Start Mileage Overweight",
              "End Mileage Overweight",
            ],
            equipmentRows
          ),
          `tasco-report-equipment${dateSuffix}.csv`
        );
      }
      if (!selectedFields || selectedFields.includes("materials")) {
        downloadCsv(
          toCsv(
            ["ReportId", "Name", "Location", "Quantity", "Unit"],
            materialRows
          ),
          `tasco-report-materials${dateSuffix}.csv`
        );
      }
      if (!selectedFields || selectedFields.includes("fuel")) {
        downloadCsv(
          toCsv(
            ["ReportId", "Miles At Fueling", "Gallons Refueled"],
            refuelRows
          ),
          `tasco-report-refuel${dateSuffix}.csv`
        );
      }
      if (!selectedFields || selectedFields.includes("stateline")) {
        downloadCsv(
          toCsv(["ReportId", "State", "State Line Mileage"], statelineRows),
          `tasco-report-stateline${dateSuffix}.csv`
        );
      }
    } else if (exportFormat === "xlsx") {
      import("xlsx").then((XLSX) => {
        // Use the OverWeightReportRow.id as the reference key
        const getDateRangeSuffix = (): string => {
          if (dateRange.from && dateRange.to) {
            const fromStr = format(dateRange.from, "MMddyy");
            const toStr = format(dateRange.to, "MMddyy");
            return `_${fromStr}-${toStr}`;
          } else if (dateRange.from) {
            return `_${format(dateRange.from, "MMddyy")}`;
          } else if (dateRange.to) {
            return `_${format(dateRange.to, "MMddyy")}`;
          }
          return "";
        };
        const dateSuffix = getDateRangeSuffix();

        // Prepare all data
        const mainRows = exportData.map((row) => ({
          ReportId: row.id || "",
          "Truck#": row.truckId || "",
          "Trailer#": row.trailerId || "",
          Date: row.date ? format(new Date(row.date), "MM/dd/yy") : "",
          "Job#": row.jobId || "",
          "Starting Mileage": row.StartingMileage ?? "",
          "Ending Mileage": row.EndingMileage ?? "",
          "# of Loads": Array.isArray(row.Materials) ? row.Materials.length : 0,
          Notes: row.notes ?? "",
        }));

        const equipmentRows = exportData.flatMap((row) =>
          Array.isArray(row.Equipment)
            ? row.Equipment.map((eq) => ({
                ReportId: row.id || "",
                Name: eq.name,
                "Start Mileage Overweight": eq.startMileage,
                "End Mileage Overweight": eq.endMileage,
              }))
            : []
        );

        const materialRows = exportData.flatMap((row) =>
          Array.isArray(row.Materials)
            ? row.Materials.map((mat) => ({
                ReportId: row.id || "",
                Name: mat.name,
                Location: mat.location,
                Quantity: mat.quantity,
                Unit: mat.unit,
              }))
            : []
        );

        const refuelRows = exportData.flatMap((row) =>
          Array.isArray(row.Fuel)
            ? row.Fuel.map((f) => ({
                ReportId: row.id || "",
                "Miles At Fueling": f.milesAtFueling,
                "Gallons Refueled": f.gallonsRefueled,
              }))
            : []
        );

        const statelineRows = exportData.flatMap((row) =>
          Array.isArray(row.StateMileages)
            ? row.StateMileages.map((s) => ({
                ReportId: row.id || "",
                State: s.state,
                "State Line Mileage": s.stateLineMileage,
              }))
            : []
        );

        const wb = XLSX.utils.book_new();
        // Only add selected sheets
        if (!selectedFields || selectedFields.includes("general")) {
          const wsMain = XLSX.utils.json_to_sheet(mainRows);
          XLSX.utils.book_append_sheet(wb, wsMain, "Summary");
        }
        if (!selectedFields || selectedFields.includes("equipment")) {
          const wsEquipment = XLSX.utils.json_to_sheet(equipmentRows);
          XLSX.utils.book_append_sheet(wb, wsEquipment, "Equipment Hauled");
        }
        if (!selectedFields || selectedFields.includes("materials")) {
          const wsMaterials = XLSX.utils.json_to_sheet(materialRows);
          XLSX.utils.book_append_sheet(wb, wsMaterials, "Material Hauled");
        }
        if (!selectedFields || selectedFields.includes("fuel")) {
          const wsRefuel = XLSX.utils.json_to_sheet(refuelRows);
          XLSX.utils.book_append_sheet(wb, wsRefuel, "Refuel Details");
        }
        if (!selectedFields || selectedFields.includes("stateline")) {
          const wsStateline = XLSX.utils.json_to_sheet(statelineRows);
          XLSX.utils.book_append_sheet(wb, wsStateline, "State Line Details");
        }
        XLSX.writeFile(wb, `tasco-report-${dateSuffix}.xlsx`);
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
        <TableBody className="divide-y divide-gray-200 bg-white">
          {loading ? (
            Array.from({ length: 20 }).map((_, rowIdx) => (
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
            ))
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
                  {row.id || "_"}
                </TableCell>
                <TableCell className="border-r border-gray-200 text-xs text-center">
                  {row.truckId || "-"}
                </TableCell>
                <TableCell className="border-r border-gray-200 text-xs text-center">
                  {row.trailerId || "-"}
                </TableCell>

                <TableCell className="border-r border-gray-200 text-xs text-center">
                  {row.date ? format(new Date(row.date), "MM/dd/yy") : "-"}
                </TableCell>
                <TableCell className="border-r border-gray-200 text-xs text-center">
                  {row.jobId || "-"}
                </TableCell>

                <TableCell className="border-r border-gray-200 text-xs text-center">
                  {/* Starting Mileage: use StartingMileage */}
                  {row.StartingMileage ?? "-"}
                </TableCell>
                <TableCell className="border-r border-gray-200 text-xs text-center">
                  {/* Ending Mileage: use EndingMileage */}
                  {row.EndingMileage ?? "-"}
                </TableCell>

                <TableCell className="border-r border-gray-200 text-xs text-center">
                  {/* Equipment: show count, hover for details */}
                  {Array.isArray(row.Equipment) && row.Equipment.length > 0 ? (
                    <HoverCard>
                      <HoverCardTrigger asChild>
                        <span className="cursor-pointer underline text-blue-600">
                          {row.Equipment.length}
                        </span>
                      </HoverCardTrigger>
                      <HoverCardContent className="p-2 w-[500px]">
                        <div className="overflow-x-auto">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead className="text-sm text-center border-r border-gray-200 bg-gray-100 ">
                                  Name
                                </TableHead>
                                <TableHead className="text-sm text-center border-r border-gray-200 bg-gray-100">
                                  Start Mileage Overweight
                                </TableHead>
                                <TableHead className="text-sm text-center border-r border-gray-200 bg-gray-100">
                                  End Mileage Overweight
                                </TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {row.Equipment.map(
                                (eq: EquipmentItem, rowIdx: number) => (
                                  <TableRow
                                    key={eq.id}
                                    className={
                                      rowIdx % 2 === 0
                                        ? "bg-white"
                                        : "bg-gray-100"
                                    }
                                  >
                                    <TableCell className="px-2 py-1 border-b">
                                      {eq.name}
                                    </TableCell>
                                    <TableCell className="px-2 py-1 border-b">
                                      {eq.startMileage}
                                    </TableCell>
                                    <TableCell className="px-2 py-1 border-b">
                                      {eq.endMileage}
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
                    "-"
                  )}
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
                      <HoverCardContent className="p-2 w-[300px]">
                        <div className="overflow-x-auto">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead className="text-sm text-center border-r border-gray-200 bg-gray-100">
                                  Name
                                </TableHead>
                                <TableHead className="text-sm text-center border-r border-gray-200 bg-gray-100">
                                  Location
                                </TableHead>
                                <TableHead className="text-sm text-center border-r border-gray-200 bg-gray-100">
                                  Qty
                                </TableHead>
                                <TableHead className="text-sm text-center border-r border-gray-200 bg-gray-100">
                                  Unit
                                </TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {row.Materials.map(
                                (mat: MaterialItem, rowIdx: number) => (
                                  <TableRow
                                    key={mat.id}
                                    className={
                                      rowIdx % 2 === 0
                                        ? "bg-white"
                                        : "bg-gray-100"
                                    }
                                  >
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
                                )
                              )}
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
                                <TableHead className="text-sm text-center border-r border-gray-200 bg-gray-100">
                                  Miles At Fueling
                                </TableHead>
                                <TableHead className="text-sm text-center border-r border-gray-200 bg-gray-100">
                                  Gallons Refueled
                                </TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {row.Fuel.map((f: FuelItem, idx: number) => (
                                <TableRow
                                  key={idx}
                                  className={
                                    idx % 2 === 0 ? "bg-white" : "bg-gray-100"
                                  }
                                >
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
                    "-"
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
                                <TableHead className="text-sm text-center border-r border-gray-200 bg-gray-100">
                                  State
                                </TableHead>
                                <TableHead className="text-sm text-center border-r border-gray-200 bg-gray-100">
                                  State Line Mileage
                                </TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {row.StateMileages.map(
                                (s: StateMileageItem, idx: number) => (
                                  <TableRow
                                    key={idx}
                                    className={
                                      idx % 2 === 0 ? "bg-white" : "bg-gray-100"
                                    }
                                  >
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
                    "-"
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
        <ExportTruckingReportModal
          onClose={() => setShowExportModal(false)}
          onExport={onExport}
          dateRange={{ from: dateRange.from, to: dateRange.to }}
          setDateRange={setDateRange}
        />
      )}
    </>
  );
}
