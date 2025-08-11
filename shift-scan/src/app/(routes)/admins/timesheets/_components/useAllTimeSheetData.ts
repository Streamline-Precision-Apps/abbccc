"use client";
import { ApprovalStatus, WorkType } from "@/lib/enums";
import { useEffect, useState } from "react";
import { adminUpdateTimesheetStatus } from "@/actions/records-timesheets";
import { toast } from "sonner";

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
  };
}
