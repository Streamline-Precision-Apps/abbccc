"use client";
import { Button } from "@/components/ui/button";
import SearchBar from "../personnel/components/SearchBar";

import TimesheetDescription from "./_components/ViewAll/Timesheet-Description";
import TimesheetViewAll from "./_components/ViewAll/Timesheet-ViewAll";
import { TimeSheetStatus, WorkType } from "@/lib/enums";
import { useEffect, useState } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { CreateTimesheetModal } from "./_components/Create/CreateTimesheetModal";
import { adminDeleteTimesheet } from "@/actions/records-timesheets";
import TimesheetDeleteModal from "./_components/ViewAll/TimesheetDeleteModal";
import { toast } from "sonner";

import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import { EditTimesheetModal } from "./_components/Edit/EditTimesheetModal";
import { ExportModal } from "./_components/Export/ExportModal";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
/**
 * Timesheet domain entity.
 * @property equipmentUsages - Array of equipment usage records for this timesheet.
 */
export type Timesheet = {
  id: string;
  date: Date | string;
  User: {
    id: string;
    firstName: string;
    lastName: string;
  };
  Jobsite: {
    id: string;
    name: string;
  };
  CostCode: {
    id: string;
    name: string;
  };
  nu: string;
  Fp: string;
  startTime: Date | string;
  endTime: Date | string | null;
  comment: string;
  status: TimeSheetStatus;
  workType: WorkType;
  createdAt: Date | string;
  updatedAt: Date | string;
  EmployeeEquipmentLogs: {
    id: string;
    equipmentId: string;
    startTime: Date | string;
    endTime: Date | string;
  }[];
};
type timesheetPending = {
  length: number;
};
// Updated CreateTimesheetModal with user/jobsite dropdowns and removed nu, Fp, location, status

export default function AdminTimesheets() {
  const [searchTerm, setSearchTerm] = useState("");
  const [allTimesheets, setAllTimesheets] = useState<Timesheet[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [pageSize, setPageSize] = useState(25);
  const pageSizeOptions = [25, 50, 75, 100];
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({ from: undefined, to: undefined });
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [showEditModal, setShowEditModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [approvalInbox, setApprovalInbox] = useState<timesheetPending | null>(
    null
  );
  const [showPendingOnly, setShowPendingOnly] = useState(false);
  const [exportModal, setExportModal] = useState(false);

  // Move fetch functions out for reuse
  const fetchTimesheets = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/getAllTimesheetInfo?page=${page}&pageSize=${pageSize}`,
        {
          next: {
            tags: ["timesheets"],
          },
        }
      );
      const data = await response.json();
      setAllTimesheets(data.timesheets);
      setTotalPages(data.totalPages);
      setTotal(data.total);
    } catch (error) {
      console.error("Error fetching timesheets:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTimesheetsPending = async () => {
    try {
      const response = await fetch(`/api/getAllTimesheetsPending`, {
        next: {
          tags: ["timesheets"],
        },
      });
      const data = await response.json();
      setApprovalInbox(data);
    } catch (error) {
      console.error("Error fetching timesheets:", error);
    }
  };

  // Refetch both after creation
  const refetchAll = async () => {
    await fetchTimesheets();
    await fetchTimesheetsPending();
  };

  useEffect(() => {
    fetchTimesheets();
  }, [page, pageSize]);

  useEffect(() => {
    fetchTimesheetsPending();
  }, [allTimesheets]);

  // Filter timesheets based on searchTerm and date range
  let filteredTimesheets = allTimesheets.filter((ts) => {
    const id = ts.id || "";
    const firstName = ts?.User?.firstName || "";
    const lastName = ts?.User?.lastName || "";
    const jobsite = ts?.Jobsite?.name || "";
    const costCode = ts?.CostCode?.name || "";
    const term = searchTerm.toLowerCase();
    // Date range filter
    let inDateRange = true;
    if (dateRange.from) {
      inDateRange = inDateRange && new Date(ts.date) >= dateRange.from;
    }
    if (dateRange.to) {
      inDateRange = inDateRange && new Date(ts.date) <= dateRange.to;
    }
    return (
      inDateRange &&
      (id.toLowerCase().includes(term) ||
        firstName.toLowerCase().includes(term) ||
        lastName.toLowerCase().includes(term) ||
        jobsite.toLowerCase().includes(term) ||
        costCode.toLowerCase().includes(term))
    );
  });

  if (showPendingOnly) {
    filteredTimesheets = filteredTimesheets.filter(
      (ts) => ts.status === "PENDING" && ts.endTime !== null
    );
  }

  // Use filteredTimesheets, sorted by date descending
  const sortedTimesheets = [...filteredTimesheets].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  const handleDeleteClick = (id: string) => {
    setDeletingId(id);
  };
  const handleDeleteCancel = () => {
    setDeletingId(null);
  };
  const handleDeleteConfirm = async () => {
    if (!deletingId) return;
    setIsDeleting(true);
    try {
      await adminDeleteTimesheet(deletingId);
      setAllTimesheets((prev) => prev.filter((t) => t.id !== deletingId));
      setDeletingId(null);
      toast.success("Timesheet deleted successfully!");
    } catch (e) {
      // Optionally show error
      console.error("Error deleting timesheet:", e);
      toast.error("Failed to delete timesheet. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  // Handler to reset page to 1 when page size changes
  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPage(1);
    setPageSize(Number(e.target.value));
  };

  /**
   * Handles exporting timesheets as CSV or XLSX, with optional date range and field selection.
   * Dates are formatted as MM-DD-YYYY, times as hh:mm a.
   * @param exportFormat Export format: 'csv' or 'xlsx'.
   * @param dateRange Optional date range to filter export.
   * @param selectedFields Array of field keys to include in export.
   */
  /**
   * Handles exporting timesheets as CSV or XLSX, with optional date range and field selection.
   * Only APPROVED timesheets are exported. Dates are formatted as MM-DD-YYYY, times as hh:mm a.
   * @param exportFormat Export format: 'csv' or 'xlsx'.
   * @param dateRange Optional date range to filter export.
   * @param selectedFields Array of field keys to include in export.
   */
  const handleExport = (
    exportFormat: "csv" | "xlsx",
    dateRange?: { from?: Date; to?: Date },
    selectedFields?: string[]
  ) => {
    let exportRows = sortedTimesheets.filter((ts) => ts.status === "APPROVED");
    if (dateRange?.from || dateRange?.to) {
      exportRows = exportRows.filter((ts) => {
        const tsDate = new Date(ts.date);
        if (dateRange.from && tsDate < dateRange.from) return false;
        if (dateRange.to && tsDate > dateRange.to) return false;
        return true;
      });
    }
    const formatDateVal = (d: Date | string | undefined | null) => {
      if (!d) return "";
      const dateObj = typeof d === "string" ? new Date(d) : d;
      if (isNaN(dateObj.getTime())) return "";
      return format(dateObj, "MM-dd-yyyy");
    };
    const formatTimeVal = (d: Date | string | undefined | null) => {
      if (!d) return "";
      const dateObj = typeof d === "string" ? new Date(d) : d;
      if (isNaN(dateObj.getTime())) return "";
      return format(dateObj, "hh:mm a");
    };
    // All possible fields (Status removed from export)
    /**
     * Field mapping for export. Includes EquipmentId and EquipmentUsage aggregation.
     */
    const allFields: Record<string, (ts: Timesheet) => string> = {
      ID: (ts) => ts.id,
      Date: (ts) => formatDateVal(ts.date),
      Employee: (ts) =>
        ts.User ? `${ts.User.firstName} ${ts.User.lastName}` : "",
      Jobsite: (ts) => ts.Jobsite?.name || "",
      CostCode: (ts) => ts.CostCode?.name || "",
      Start: (ts) => formatTimeVal(ts.startTime),
      End: (ts) => formatTimeVal(ts.endTime),
      WorkType: (ts) => String(ts.workType),
      Comment: (ts) => ts.comment.slice(0, 40),
      EquipmentId: (ts) => {
        return ts.EmployeeEquipmentLogs.map((log) => log.equipmentId).join(
          ", "
        );
      },
      EquipmentUsage: (ts) => {
        // Sum total duration for all equipment logs, output as "X hr Y min"
        if (
          !Array.isArray(ts.EmployeeEquipmentLogs) ||
          ts.EmployeeEquipmentLogs.length === 0
        )
          return "";
        let totalMs = 0;
        ts.EmployeeEquipmentLogs.forEach((log) => {
          if (log.startTime && log.endTime) {
            const start = new Date(log.startTime).getTime();
            const end = new Date(log.endTime).getTime();
            if (!isNaN(start) && !isNaN(end) && end > start) {
              totalMs += end - start;
            }
          }
        });
        if (totalMs <= 0) return "0 min";
        const totalMinutes = Math.round(totalMs / (1000 * 60));
        const hours = Math.floor(totalMinutes / 60);
        const mins = totalMinutes % 60;
        if (hours > 0 && mins > 0) return `${hours} hr ${mins} min`;
        if (hours > 0) return `${hours} hr`;
        return `${mins} min`;
      },
    };
    // Remove 'Status' from selectedFields if present
    const filteredFields =
      selectedFields && selectedFields.length > 0
        ? selectedFields.filter((f) => f !== "Status")
        : Object.keys(allFields);
    const exportData = exportRows.map((ts) => {
      const row: Record<string, string> = {};
      filteredFields.forEach((f) => {
        row[f] = allFields[f] ? allFields[f](ts) : "";
      });
      return row;
    });
    if (exportFormat === "csv") {
      const header = filteredFields.join(",");
      const rows = exportData
        .map((row) =>
          filteredFields
            .map((f) => `"${String(row[f] ?? "").replace(/"/g, '""')}"`)
            .join(",")
        )
        .join("\n");
      const csv = `${header}\n${rows}`;
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      saveAs(blob, `timesheets_${new Date().toISOString().slice(0, 10)}.csv`);
    } else {
      // XLSX
      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Timesheets");
      const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
      const blob = new Blob([wbout], { type: "application/octet-stream" });
      saveAs(blob, `timesheets_${new Date().toISOString().slice(0, 10)}.xlsx`);
    }
  };

  return (
    <div className="w-full p-4 grid grid-rows-[3rem_2rem_1fr] gap-4">
      <TimesheetDescription
        setShowCreateModal={setShowCreateModal}
        setExportModal={setExportModal}
        setShowPendingOnly={setShowPendingOnly}
        showPendingOnly={showPendingOnly}
        approvalInbox={approvalInbox}
      />
      <div className="h-fit max-h-12  w-full flex flex-row justify-between gap-4 mb-2 ">
        <div className="flex flex-row w-full gap-4 mb-2">
          <div className="bg-white rounded-lg h-full max-h-8 w-full max-w-[450px] py-2">
            <SearchBar
              term={searchTerm}
              handleSearchChange={(e) => setSearchTerm(e.target.value)}
              placeholder={"Search by id, employee, Profit Id or cost code..."}
              textSize="xs"
              imageSize="6"
            />
          </div>
          <div className="w-fit min-w-[40px] h-full max-h-8 flex flex-row">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="bg-white h-full max-h-8 w-full max-w-[40px] justify-center items-center"
                >
                  <img
                    src="/filterDials.svg"
                    alt="Filter"
                    className="h-full w-full object-contain p-2 "
                  />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="min-w-[320px] p-4 ">
                <div className="">
                  <div className="flex items-center justify-between mb-2">
                    <label className="block mb-1 font-semibold">
                      Date Range
                    </label>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="p-2 flex-shrink-0"
                      onClick={() =>
                        setDateRange({ from: undefined, to: undefined })
                      }
                      aria-label="Clear date range"
                    >
                      <img
                        src="/trash-red.svg"
                        alt="Clear date range"
                        className="h-5 w-5"
                      />
                    </Button>
                  </div>

                  <div className="mt-2 text-xs text-center text-muted-foreground">
                    {dateRange.from && dateRange.to ? (
                      `${format(dateRange.from, "PPP")} - ${format(
                        dateRange.to,
                        "PPP"
                      )}`
                    ) : dateRange.from ? (
                      `${format(dateRange.from, "PPP")} - ...`
                    ) : (
                      <span>Pick a date range</span>
                    )}
                  </div>
                  <div className="flex items-center justify-center gap-2 overflow-visible">
                    <Calendar
                      mode="range"
                      selected={dateRange}
                      onSelect={(value) =>
                        setDateRange({ from: value?.from, to: value?.to })
                      }
                      autoFocus
                    />
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
          <div className=" w-[300px] h-full max-h-8  my-auto items-center flex text-xs text-white">
            {pageSize === sortedTimesheets.length && (
              <>
                {pageSize} of {total} rows
              </>
            )}
          </div>
        </div>
      </div>
      {/* ...existing code... */}
      <div className="h-[85vh] rounded-lg  w-full relative bg-white">
        <ScrollArea
          alwaysVisible
          className="h-[80vh] w-full  bg-white rounded-t-lg  border border-slate-200 relative pr-2"
        >
          <TimesheetViewAll
            showPendingOnly={showPendingOnly}
            timesheets={sortedTimesheets}
            loading={loading}
            page={page}
            totalPages={totalPages}
            total={total}
            pageSize={pageSize}
            pageSizeOptions={pageSizeOptions}
            onPageSizeChange={handlePageSizeChange}
            onPageChange={setPage}
            onDeleteClick={handleDeleteClick}
            deletingId={deletingId}
            isDeleting={isDeleting}
            onEditClick={(id: string) => {
              setEditingId(id);
              setShowEditModal(true);
            }}
          />
          <div className="h-1 bg-slate-100 border-y border-slate-200 absolute bottom-0 right-0 left-0">
            <ScrollBar
              orientation="horizontal"
              className="w-full h-3 ml-2 mr-2 rounded-full"
            />
          </div>
        </ScrollArea>
        {totalPages > 1 && (
          <div className="absolute bottom-0 h-[5vh] left-0 right-0 flex flex-row justify-between items-center mt-2 px-3 bg-white border-t border-gray-200 rounded-b-lg">
            <div className="text-xs text-gray-600">
              Showing page {page} of {totalPages} ({total} total)
            </div>
            <div className="flex flex-row gap-2 items-center">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={(e) => {
                        e.preventDefault();
                        setPage(Math.max(1, page - 1));
                      }}
                      aria-disabled={page === 1}
                      tabIndex={page === 1 ? -1 : 0}
                      style={{
                        pointerEvents: page === 1 ? "none" : undefined,
                        opacity: page === 1 ? 0.5 : 1,
                      }}
                    />
                  </PaginationItem>
                  <PaginationItem>
                    <span className="text-xs border rounded py-1 px-2">
                      {page}
                    </span>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext
                      onClick={(e) => {
                        e.preventDefault();
                        setPage(Math.min(totalPages, page + 1));
                      }}
                      aria-disabled={page === totalPages}
                      tabIndex={page === totalPages ? -1 : 0}
                      style={{
                        pointerEvents: page === totalPages ? "none" : undefined,
                        opacity: page === totalPages ? 0.5 : 1,
                      }}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
              <select
                className="ml-2 px-1 py-1 rounded text-xs border"
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setPage(1);
                }}
              >
                {[25, 50, 75, 100].map((size) => (
                  <option key={size} value={size}>
                    {size} Rows
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>
      {showCreateModal && (
        <CreateTimesheetModal
          onClose={() => setShowCreateModal(false)}
          onCreated={refetchAll}
        />
      )}
      {/* Export Modal */}
      {exportModal && (
        <ExportModal
          onClose={() => setExportModal(false)}
          onExport={handleExport}
        />
      )}
      {/* ...existing code... */}
      {showEditModal && (
        <EditTimesheetModal
          timesheetId={editingId || ""}
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          onUpdated={refetchAll}
        />
      )}
      <TimesheetDeleteModal
        isOpen={!!deletingId}
        onClose={handleDeleteCancel}
        onDelete={handleDeleteConfirm}
        isDeleting={isDeleting}
        itemName={deletingId || undefined}
      />
    </div>
  );
}
