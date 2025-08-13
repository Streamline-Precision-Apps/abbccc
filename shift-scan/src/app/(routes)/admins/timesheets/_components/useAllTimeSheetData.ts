"use client";
import { ApprovalStatus, WorkType } from "@/lib/enums";
import { useEffect, useState } from "react";
import { adminUpdateTimesheetStatus } from "@/actions/records-timesheets";
import { toast } from "sonner";
import { adminDeleteTimesheet } from "@/actions/records-timesheets";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import { format } from "date-fns";
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
    code: string;
    name: string;
  };
  CostCode: {
    id: string;
    name: string;
    code: string;
  };
  nu: string;
  Fp: string;
  startTime: Date | string;
  endTime: Date | string | null;
  comment: string;
  status: ApprovalStatus;
  workType: WorkType;
  createdAt: Date | string;
  updatedAt: Date | string;
  EmployeeEquipmentLogs: {
    id: string;
    equipmentId: string;
    Equipment: {
      id: string;
      name: string;
    };
    startTime: Date | string;
    endTime: Date | string;
  }[];
  TruckingLogs: {
    truckNumber: string;
    startingMileage: number | null;
    endingMileage: number | null;
    RefuelLogs: {
      milesAtFueling: number | null;
    }[];
  }[];
};

export type timesheetPending = {
  length: number;
};

export default function AdminTimesheets() {
  const [searchTerm, setSearchTerm] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [allTimesheets, setAllTimesheets] = useState<Timesheet[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);
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
    null,
  );
  const [showPendingOnly, setShowPendingOnly] = useState(false);
  const [exportModal, setExportModal] = useState(false);
  // Loading state for status change
  const [statusLoading, setStatusLoading] = useState<
    Record<string, "APPROVED" | "REJECTED" | undefined>
  >({});

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchTerm(inputValue);
    }, 500);
    return () => clearTimeout(handler);
  }, [inputValue]);

  const rerender = () => setRefreshKey((k) => k + 1);

  // Fetch all timesheets (paginated) or all pending timesheets (no pagination)
  const fetchTimesheets = async (pendingOnly = false) => {
    try {
      setLoading(true);
      let response;
      if (pendingOnly) {
        const encodedSearch = encodeURIComponent(searchTerm.trim());
        response = await fetch(
          `/api/getAllTimesheetInfo?status=pending&search=${encodedSearch}`,
          {
            next: { tags: ["timesheets"] },
          },
        );
        const data = await response.json();
        // If API returns array, set as allTimesheets
        setAllTimesheets(data.timesheets || []);
        setTotalPages(data.totalPages);
        setTotal(data.total || 0);
      } else {
        const encodedSearch = encodeURIComponent(searchTerm.trim());
        response = await fetch(
          `/api/getAllTimesheetInfo?page=${page}&pageSize=${pageSize}&search=${encodedSearch}`,
          {
            next: { tags: ["timesheets"] },
          },
        );
        const data = await response.json();
        setAllTimesheets(data.timesheets);
        setTotalPages(data.totalPages);
        setTotal(data.total);
      }
    } catch (error) {
      console.error("Error fetching timesheets:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch count of pending timesheets for inbox badge
  const fetchTimesheetsPending = async () => {
    try {
      const response = await fetch(`/api/getAllTimesheetsPending`, {
        next: { tags: ["timesheets"] },
      });
      const data = await response.json();
      setApprovalInbox(Array.isArray(data) ? { length: data.length } : data);
    } catch (error) {
      console.error("Error fetching timesheets:", error);
    }
  };

  // Fetch timesheets when page/pageSize changes or when showPendingOnly toggles
  useEffect(() => {
    fetchTimesheets(showPendingOnly);
  }, [page, pageSize, showPendingOnly, searchTerm, refreshKey]);

  // Only update approval inbox count on initial mount and manual refresh
  useEffect(() => {
    fetchTimesheetsPending();
  }, [refreshKey]);

  // Filter timesheets based on searchTerm and date range
  const filteredTimesheets = allTimesheets.filter((ts) => {
    const id = ts.id || "";
    const firstName = ts?.User?.firstName || "";
    const lastName = ts?.User?.lastName || "";
    const jobsite = ts?.Jobsite?.name || "";
    const costCode = ts?.CostCode?.name || "";

    // Split search term into words, ignore empty
    const terms = searchTerm
      .toLowerCase()
      .split(" ")
      .filter((t) => t.trim().length > 0);

    // Date filter: support single date (entire day) or range
    let inDateRange = true;
    if (dateRange.from && !dateRange.to) {
      const fromStart = new Date(dateRange.from);
      fromStart.setHours(0, 0, 0, 0);
      const fromEnd = new Date(dateRange.from);
      fromEnd.setHours(23, 59, 59, 999);
      const tsDate = new Date(ts.date);
      inDateRange = tsDate >= fromStart && tsDate <= fromEnd;
    } else {
      if (dateRange.from) {
        inDateRange = inDateRange && new Date(ts.date) >= dateRange.from;
      }
      if (dateRange.to) {
        inDateRange = inDateRange && new Date(ts.date) <= dateRange.to;
      }
    }

    // Each term must match at least one field
    const matches = terms.every(
      (term) =>
        id.toLowerCase().includes(term) ||
        firstName.toLowerCase().includes(term) ||
        lastName.toLowerCase().includes(term) ||
        jobsite.toLowerCase().includes(term) ||
        costCode.toLowerCase().includes(term),
    );

    return inDateRange && (terms.length === 0 || matches);
  });

  // Use filteredTimesheets, sorted by date descending
  const sortedTimesheets = [...filteredTimesheets].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  // Approve or deny a timesheet (no modal)
  const handleApprovalAction = async (
    id: string,
    action: "APPROVED" | "REJECTED",
  ) => {
    setStatusLoading((prev) => ({ ...prev, [id]: action }));
    try {
      const res = await adminUpdateTimesheetStatus(id, action);
      if (!res || res.success !== true)
        throw new Error("Failed to update timesheet status");
      setAllTimesheets((prev) =>
        prev.map((t) => (t.id === id ? { ...t, status: action } : t)),
      );
      toast.success(
        `Timesheet ${action === "APPROVED" ? "approved" : "denied"}!`,
      );
      // Only update approval inbox count after approval/denial
      fetchTimesheetsPending();
    } catch (e) {
      toast.error(
        `Failed to ${action === "APPROVED" ? "approve" : "deny"} timesheet.`,
      );
    } finally {
      setStatusLoading((prev) => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });
    }
  };

  const handleDeleteClick = (id: string) => {
    setDeletingId(id);
    setIsDeleting(true);
  };

  const handleDeleteCancel = () => {
    setDeletingId(null);
    setIsDeleting(false);
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

  const handleExport = (
    exportFormat: "csv" | "xlsx",
    dateRange?: { from?: Date; to?: Date },
    selectedFields?: string[],
  ) => {
    let exportRows = sortedTimesheets.filter((ts) => ts.status === "APPROVED");
    if (dateRange?.from || dateRange?.to) {
      // Set from to 12:00am and to to 11:59:59pm
      const fromDate = dateRange.from
        ? new Date(dateRange.from.setHours(0, 0, 0, 0))
        : undefined;
      const toDate = dateRange.to
        ? new Date(dateRange.to.setHours(23, 59, 59, 999))
        : undefined;
      exportRows = exportRows.filter((ts) => {
        const tsDate = new Date(ts.date);
        if (fromDate && tsDate < fromDate) return false;
        if (toDate && tsDate > toDate) return false;
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
      Id: (ts) => ts.id,
      WorkType: (ts) => String(ts.workType),
      Date: (ts) => formatDateVal(ts.date),
      Employee: (ts) =>
        ts.User ? `${ts.User.firstName} ${ts.User.lastName}` : "",
      Jobsite: (ts) => ts.Jobsite?.code || "",
      CostCode: (ts) => ts.CostCode?.code || "",
      NU: () => "NU",
      FP: () => "FP",
      Start: (ts) => formatTimeVal(ts.startTime),
      End: (ts) => formatTimeVal(ts.endTime),
      Duration: (ts) => {
        if (!ts.startTime || !ts.endTime) return "";
        const start = new Date(ts.startTime);
        const end = new Date(ts.endTime);
        const durationMs = end.getTime() - start.getTime();
        const hours = Math.floor(durationMs / (1000 * 60 * 60));
        const minutes = Math.floor(
          (durationMs % (1000 * 60 * 60)) / (1000 * 60),
        );
        return `${hours} hr ${minutes} min`;
      },
      Comment: (ts) => ts.comment,
      EquipmentId: (ts) =>
        ts.EmployeeEquipmentLogs.map((log) => log.Equipment.name).join(", "),
      EquipmentUsage: (ts) => {
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
      TruckNumber: (ts) =>
        ts.TruckingLogs?.[0]?.truckNumber
          ? String(ts.TruckingLogs[0].truckNumber)
          : "",
      TruckStartingMileage: (ts) =>
        ts.TruckingLogs?.[0]?.startingMileage != null
          ? String(ts.TruckingLogs[0].startingMileage)
          : "",
      TruckEndingMileage: (ts) =>
        ts.TruckingLogs?.[0]?.endingMileage != null
          ? String(ts.TruckingLogs[0].endingMileage)
          : "",
      MilesAtFueling: (ts) =>
        ts.TruckingLogs?.[0]?.RefuelLogs?.[0]?.milesAtFueling != null
          ? String(ts.TruckingLogs[0].RefuelLogs[0].milesAtFueling)
          : "",
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
            .join(","),
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

  return {
    inputValue,
    setInputValue,
    allTimesheets,
    setAllTimesheets,
    loading,
    setLoading,
    page,
    setPage,
    totalPages,
    setTotalPages,
    total,
    setTotal,
    pageSize,
    pageSizeOptions,
    setPageSize,
    dateRange,
    setDateRange,
    showCreateModal,
    setShowCreateModal,
    deletingId,
    setDeletingId,
    isDeleting,
    setIsDeleting,
    showEditModal,
    setShowEditModal,
    editingId,
    setEditingId,
    approvalInbox,
    setApprovalInbox,
    showPendingOnly,
    setShowPendingOnly,
    exportModal,
    setExportModal,
    statusLoading,
    setStatusLoading,
    // Helper functions
    sortedTimesheets,
    rerender,
    handleApprovalAction,
    handleDeleteClick,
    handleDeleteCancel,
    handleDeleteConfirm,
    handlePageSizeChange,
    handleExport,
  };
}
