"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSidebar } from "@/components/ui/sidebar";
import TascoReport from "./_reports/tascoReport";
import { useState } from "react";

export const reports = [
  {
    id: "tasco-report",
    label: "Tasco Report",
    description:
      "Sorts all Tasco data by date and shows,[ Id, shift Type, Submitted Date, Employee, Date worked, Labor Type, Equipment, Loads-ABCDE, Loads-F, Materials, Start Time, End Time, Screened or Unscreened]",
    render: () => <TascoReport />,
  },
  {
    id: "ifta-report",
    label: "IFTA Report",
    description: "Shows details of IFTA...",
    render: () => <></>,
  },
  {
    id: "overweight-report",
    label: "OverWeight Report",
    description:
      "Sorts by truck and date, showing [Date, Truck Id, Operator, Equipment, OverWeight Amount, Total Mileage]",
    render: () => <></>,
  },
];

export default function AdminReports() {
  const { setOpen, open } = useSidebar();
  const [selectedReportId, setSelectedReportId] = useState<string | undefined>(
    undefined
  );
  const selectedReport = reports.find((r) => r.id === selectedReportId);
  return (
    <div className="w-full p-4 grid grid-rows-[3rem_1fr] gap-4">
      <div className="h-full row-span-1 max-h-12 w-full flex flex-row justify-between ">
        <div className="w-full flex flex-row gap-5 ">
          <div className="flex items-center justify-center">
            <Button
              variant="ghost"
              size="icon"
              className={`h-8 w-8 p-0 hover:bg-slate-500 hover:bg-opacity-20 ${
                open ? "bg-slate-500 bg-opacity-20" : "bg-app-blue "
              }`}
              onClick={() => {
                setOpen(!open);
              }}
            >
              <img
                src={open ? "/condense-white.svg" : "/condense.svg"}
                alt="logo"
                className="w-4 h-auto object-contain "
              />
            </Button>
          </div>
          <div className="w-full flex flex-col gap-1">
            <p className="text-left w-fit text-base text-white font-bold">
              Reports
            </p>
            <p className="text-left text-xs text-white">
              Run select reports and download them in CSV or Excel reports
            </p>
          </div>
        </div>
        <div className="flex flex-col justify-center">
          <Label htmlFor="report" className="w-[180px] mb-1 text-white">
            Select a report
          </Label>
          <Select
            name="report"
            onValueChange={setSelectedReportId}
            value={selectedReportId}
          >
            <SelectTrigger className="w-[180px] bg-white">
              <SelectValue placeholder="Select a report" />
            </SelectTrigger>
            <SelectContent>
              {reports.map((report) => (
                <SelectItem key={report.id} value={report.id}>
                  {report.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <ScrollArea className="h-full w-full row-span-1 bg-white rounded-lg border border-slate-200 relative">
        {selectedReport ? (
          selectedReport.render()
        ) : (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
            <p className="text-sm text-slate-400 ">
              Select a report to view its details.
            </p>
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
