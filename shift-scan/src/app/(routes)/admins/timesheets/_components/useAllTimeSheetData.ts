"use client";
import {
  ApprovalStatus,
  WorkType,
} from "../../../../../../prisma/generated/prisma/client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { adminUpdateTimesheetStatus } from "@/actions/records-timesheets";
import { toast } from "sonner";
import { adminDeleteTimesheet } from "@/actions/records-timesheets";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import { format } from "date-fns";
import { EXPORT_FIELDS } from "@/app/(routes)/admins/timesheets/_components/Export/ExportModal";
import { useDashboardData } from "../../_pages/sidebar/DashboardDataContext";
import { useRouter } from "next/navigation";

/**
 * Timesheet domain entity.
 * @property equipmentUsages - Array of equipment usage records for this timesheet.
 */
export type Timesheet = {
  id: number;
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
  TascoLogs: {
    shiftType: string;
    LoadQuantity: number | null;
  }[];
  _count?: {
    ChangeLogs: number;
  };
};

export interface FilterOptions {
  jobsiteId: string[];
  costCode: string[];
  equipmentId: string[];
  dateRange: { from?: Date; to?: Date };
  status: string[];
  changes: string[];
  notificationId: string[];
  id: string[];
}

export default function useAllTimeSheetData({
  jobsiteId,
  costCode,
  id,
  notificationId,
}: {
  jobsiteId: string | null;
  costCode: string | null;
  id: string | null;
  notificationId: string | null;
}) {
  const router = useRouter();
  const { refresh } = useDashboardData();
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
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [showEditModal, setShowEditModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [approvalInbox, setApprovalInbox] = useState<number>(0);
  const [showPendingOnly, setShowPendingOnly] = useState(false);
  const [exportModal, setExportModal] = useState(false);
  // Loading state for status change
  const [statusLoading, setStatusLoading] = useState<
    Record<string, "APPROVED" | "REJECTED" | undefined>
  >({});

  const [notificationIds, setNotificationIds] = useState<string | null>(null);

  // set Filters  feature
  // Filter options state
  const [refilterKey, setRefilterKey] = useState(0);
  const [filters, setFilters] = useState<FilterOptions>({
    jobsiteId: [],
    costCode: [],
    equipmentId: [],
    dateRange: {},
    status: [],
    changes: [],
    id: [],
    notificationId: [],
  });
  const [costCodes, setCostCodes] = useState<{ code: string; name: string }[]>(
    [],
  );
  const [jobsites, setJobsites] = useState<{ code: string; name: string }[]>(
    [],
  );
  const [equipment, setEquipment] = useState<{ id: string; name: string }[]>(
    [],
  );

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchTerm(inputValue);
    }, 500);
    return () => clearTimeout(handler);
  }, [inputValue]);

  const rerender = useCallback(() => {
    setRefreshKey((k) => k + 1);
    refresh();
  }, [refresh]);

  const reFilterPage = useCallback(() => {
    setRefilterKey((k) => k + 1);
    refresh();
  }, [refresh]);

  /**
   * Build filter query params from all filters (including multi-select and date range)
   */
  const buildFilterQuery = () => {
    const params = new URLSearchParams();
    // JobsiteId (array)
    if (filters.jobsiteId && filters.jobsiteId.length > 0) {
      filters.jobsiteId.forEach((id) => params.append("jobsiteId", id));
    } else if (jobsiteId) {
      params.append("jobsiteId", jobsiteId);
    }
    // CostCode (array)
    if (filters.costCode && filters.costCode.length > 0) {
      filters.costCode.forEach((code) => params.append("costCode", code));
    } else if (costCode) {
      params.append("costCode", costCode);
    }
    // Equipment (array)
    if (filters.equipmentId && filters.equipmentId.length > 0) {
      filters.equipmentId.forEach((equipmentId) =>
        params.append("equipmentId", equipmentId),
      );
    }
    // Status (array)
    if (filters.status && filters.status.length > 0) {
      filters.status.forEach((status) => params.append("status", status));
    }
    // Changes (array)
    if (filters.changes && filters.changes.length > 0) {
      filters.changes.forEach((change) => params.append("changes", change));
    }
    // Date Range
    if (filters.dateRange && filters.dateRange.from) {
      params.append("dateFrom", filters.dateRange.from.toISOString());
    }
    if (filters.dateRange && filters.dateRange.to) {
      params.append("dateTo", filters.dateRange.to.toISOString());
    }
    // Id (array)
    if (filters.id && filters.id.length > 0) {
      filters.id.forEach((idVal) => params.append("id", idVal));
    } else if (id) {
      params.append("id", id);
    }
    // UserId (single)
    // if (userId) params.append("userId", userId);
    return params.toString();
  };

  useEffect(() => {
    const fetchCostCodes = async () => {
      // Replace with your API call
      const res = await fetch("/api/getCostCodeSummary");
      const data = await res.json();
      const filteredCostCodes = data
        .filter(
          (costCode: {
            id: string;
            code: string;
            name: string;
            isActive: boolean;
          }) => costCode.isActive === true,
        )
        .map((costCode: { code: string; name: string }) => ({
          code: costCode.code,
          name: costCode.name,
        }));
      setCostCodes(filteredCostCodes || []);
    };
    fetchCostCodes();
  }, []);

  useEffect(() => {
    const fetchJobsites = async () => {
      // Replace with your API call
      const res = await fetch("/api/getJobsiteSummary");
      const data = await res.json();
      const filteredJobsites = data
        .filter(
          (jobsite: {
            id: string;
            name: string;
            code: string;
            approvalStatus: ApprovalStatus;
          }) => jobsite.approvalStatus !== ApprovalStatus.REJECTED,
        )
        .map((jobsite: { code: string; name: string }) => ({
          code: jobsite.code,
          name: jobsite.name,
        }));
      setJobsites(filteredJobsites || []);
    };
    fetchJobsites();
  }, []);

  useEffect(() => {
    const fetchEquipment = async () => {
      // Replace with your API call
      const res = await fetch("/api/equipmentIdNameQrIdAndCode");
      const data = await res.json();
      const filteredEquipment = data.map(
        (equipment: { id: string; name: string }) => ({
          id: equipment.id,
          name: equipment.name,
        }),
      );
      setEquipment(filteredEquipment || []);
    };
    fetchEquipment();
  }, []);

  // On mount, apply jobsiteId/costCode from props to filters before first fetch
  useEffect(() => {
    if (jobsiteId || costCode || id || notificationId) {
      setNotificationIds(notificationId || null);
      setFilters((prev) => ({
        ...prev,
        jobsiteId: jobsiteId ? [jobsiteId] : prev.jobsiteId,
        costCode: costCode ? [costCode] : prev.costCode,
        id: id ? [id] : prev.id,
        notificationId: notificationId ? [notificationId] : prev.notificationId,
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobsiteId, costCode, id, notificationId]);

  // Fetch all timesheets (paginated) or all pending timesheets (no pagination)
  const fetchTimesheets = async () => {
    try {
      setLoading(true);

      const filterQuery = buildFilterQuery();
      const encodedSearch = encodeURIComponent(searchTerm.trim());

      const response = await fetch(
        `/api/getAllTimesheetInfo?status=${showPendingOnly ? "pending" : "all"}&page=${page}&pageSize=${pageSize}&search=${encodedSearch}${filterQuery ? `&${filterQuery}` : ""}`,
        {
          next: { tags: ["timesheets"] },
        },
      );
      const data = await response.json();
      setAllTimesheets(data.timesheets);
      setTotalPages(data.totalPages);
      setTotal(data.total);
      setApprovalInbox(data.pendingTimesheets || 0);
    } catch (error) {
      console.error("Error fetching timesheets:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch timesheets when page/pageSize, filters, or useFilters change
  useEffect(() => {
    fetchTimesheets();
  }, [page, pageSize, showPendingOnly, searchTerm, refreshKey, refilterKey]);

  // Filter timesheets based on searchTerm and date range
  const filteredTimesheets = useMemo(() => {
    return allTimesheets.filter((ts) => {
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
          id.toString().includes(term) ||
          firstName.toLowerCase().includes(term) ||
          lastName.toLowerCase().includes(term) ||
          jobsite.toLowerCase().includes(term) ||
          costCode.toLowerCase().includes(term),
      );

      return inDateRange && (terms.length === 0 || matches);
    });
  }, [allTimesheets, searchTerm, dateRange]);

  // Use filteredTimesheets, sorted by date descending
  const sortedTimesheets = useMemo(() => {
    return [...filteredTimesheets].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
  }, [filteredTimesheets]);

  // Approve or deny a timesheet (no modal)
  const handleApprovalAction = async (
    id: number,
    action: "APPROVED" | "REJECTED",
  ) => {
    setStatusLoading((prev) => ({ ...prev, [id]: action }));
    try {
      // add who approved/denied it
      const changes: Record<string, { old: unknown; new: unknown }> = {};

      changes["status"] = {
        old: "PENDING",
        new: action,
      };
      const res = await adminUpdateTimesheetStatus(id, action, changes);
      if (!res || res.success !== true)
        throw new Error("Failed to update timesheet status");
      setAllTimesheets((prev) =>
        prev.map((t) => (t.id === id ? { ...t, status: action } : t)),
      );
      toast.success(
        `Timesheet ${action === "APPROVED" ? "approved" : "denied"}!`,
        { duration: 3000 },
      );
      // Only update approval inbox count after approval/denial
      rerender();
    } catch (e) {
      toast.error(
        `Failed to ${action === "APPROVED" ? "approve" : "deny"} timesheet.`,
        { duration: 3000 },
      );
    } finally {
      setStatusLoading((prev) => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });
    }
  };

  const handleDeleteClick = (id: number) => {
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
      toast.success("Timesheet deleted successfully!", { duration: 3000 });
      refresh();
    } catch (e) {
      // Optionally show error
      console.error("Error deleting timesheet:", e);
      toast.error("Failed to delete timesheet. Please try again.", {
        duration: 3000,
      });
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
      return format(dateObj, "MM/dd/yyyy");
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
      Id: (ts) => String(ts.id),
      Date: (ts) => formatDateVal(ts.date),
      Employee: (ts) =>
        ts.User ? `${ts.User.firstName} ${ts.User.lastName}` : "",
      Jobsite: (ts) => `'${(ts.Jobsite?.code || "").trim()}'`, // Force text format to preserve leading zeros
      CostCode: (ts) => `'${(ts.CostCode?.code || "").trim()}'`, // Force text format to preserve leading zeros
      NU: () => "NU",
      FP: () => "FP",
      Start: (ts) => formatTimeVal(ts.startTime),
      End: (ts) => formatTimeVal(ts.endTime),
      Duration: (ts) => {
        if (!ts.startTime || !ts.endTime) return "";
        const start = new Date(ts.startTime);
        const end = new Date(ts.endTime);
        const durationMs = end.getTime() - start.getTime();
        const hours = durationMs / (1000 * 60 * 60);
        return hours.toFixed(1); // Return just the decimal number
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
        if (totalMs <= 0) return "0.0";
        const hours = totalMs / (1000 * 60 * 60);
        return hours.toFixed(1); // Return decimal hours to nearest tenth
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
      TascoABCDELoads: (ts) =>
        ts.TascoLogs?.filter(
          (log) =>
            log.shiftType === "ABCD Shift" || log.shiftType === "E Shift",
        )
          .map((log) => log.LoadQuantity)
          .join(", ") || "",
      TascoFLoads: (ts) =>
        ts.TascoLogs?.filter((log) => log.shiftType === "F Shift")
          .map((log) => log.LoadQuantity)
          .join(", ") || "",
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
      // Get the field labels mapping from the ExportModal's EXPORT_FIELDS
      const fieldLabels = Object.fromEntries(
        EXPORT_FIELDS.map((field) => [field.key, field.label]),
      );

      // Use labels in header instead of keys
      const header = filteredFields.map((f) => fieldLabels[f] || f).join(",");
      const rows = exportData
        .map((row) =>
          filteredFields
            .map((f) => {
              const value = String(row[f] ?? "");
              // Always use text qualifier to preserve formatting
              return `"${value.replace(/"/g, '""')}"`;
            })
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

  const handleClearFilters = async () => {
    const emptyFilters: FilterOptions = {
      jobsiteId: [],
      costCode: [],
      equipmentId: [],
      dateRange: {},
      status: [],
      changes: [],
      id: [],
      notificationId: [],
    };
    router.replace("/admins/timesheets");
    setFilters(emptyFilters);
    //avoids race condition with router.replace
    setTimeout(() => {
      reFilterPage();
    }, 500);
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
    // Filters
    filters,
    setFilters,
    reFilterPage,
    costCodes,
    jobsites,
    equipment,
    notificationIds,
    setNotificationIds,
    handleClearFilters,
  };
}
