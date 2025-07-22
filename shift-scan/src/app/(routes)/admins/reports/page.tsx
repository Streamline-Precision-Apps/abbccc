"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
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
import TruckingReport from "./_reports/truckingReport";

export default function AdminReports() {
  const [showExportModal, setShowExportModal] = useState(false);
  const { setOpen, open } = useSidebar();
  const [selectedReportId, setSelectedReportId] = useState<string | undefined>(
    undefined
  );
  const reports = [
    {
      id: "tasco-report",
      label: "Tasco Report",
      description:
        "Sorts all Tasco data by date and shows,[ Id, shift Type, Submitted Date, Employee, Date worked, Labor Type, Equipment, Loads-ABCDE, Loads-F, Materials, Start Time, End Time, Screened or Unscreened]",
      render: () => (
        <TascoReport
          showExportModal={showExportModal}
          setShowExportModal={setShowExportModal}
        />
      ),
    },

    {
      id: "trucking-mileage-report",
      label: "Trucking Mileage Reports",
      description:
        "An exportable table of Trucking #, Trailer #, Date, Job #, Equipment Number if MOB, and start and end odometer for overweight loads",
      render: () => (
        <TruckingReport
          showExportModal={showExportModal}
          setShowExportModal={setShowExportModal}
        />
      ),
    },
  ];
  const selectedReport = reports.find((r) => r.id === selectedReportId);
  return (
    <div className="w-full p-4 grid grid-rows-[3rem_1fr] gap-4">
      <div className="h-full row-span-1 max-h-12 w-full flex flex-row justify-between gap-4 ">
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
        <div className="flex justify-center items-center">
          <Button
            onClick={() => {
              setShowExportModal(true);
            }}
            variant={"default"}
            size={"default"}
            className="px-6 py-1 rounded-lg hover:bg-slate-800 "
          >
            <img
              src="/export-white.svg"
              alt="Export Form"
              className="h-3 w-3 mr-1"
            />
            <p className="text-xs">Export</p>
          </Button>
        </div>
      </div>
      <div className="h-[90vh] rounded-lg  w-full relative bg-white">
        <ScrollArea
          alwaysVisible
          className="h-[85vh] w-full  bg-white rounded-t-lg  border border-slate-200 relative pr-2"
        >
          {selectedReport ? (
            selectedReport.render()
          ) : (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
              <p className="text-base text-slate-400 ">
                Select a report to view its details.
              </p>
            </div>
          )}

          <div className="h-1 bg-slate-100 border-y border-slate-200 absolute bottom-0 right-0 left-0">
            <ScrollBar
              orientation="horizontal"
              className="w-full h-1 ml-2 mr-2 rounded-full"
            />
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
