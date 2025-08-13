"use client";
import { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { FormStatus } from "@/lib/enums";
import { FormIndividualTemplate } from "./types";
import {
  archiveFormTemplate,
  deleteFormSubmission,
  deleteFormTemplate,
  draftFormTemplate,
  getFormSubmissions,
  getFormTemplate,
  publishFormTemplate,
} from "@/actions/records-forms";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import { Fields as FormField } from "./types";
export default function useSubmissionDataById(id: string) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  // Status filter state
  const [statusFilter, setStatusFilter] = useState<
    "ALL" | keyof typeof FormStatus
  >("ALL");
  // Date filter state
  const [dateRange, setDateRange] = useState<{
    start: Date | undefined;
    end: Date | undefined;
  }>({ start: undefined, end: undefined });

  const [showExportModal, setShowExportModal] = useState(false);
  const [exportDateRange, setExportDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });
  const [showDeleteSubmissionDialog, setShowDeleteSubmissionDialog] =
    useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formTemplate, setFormTemplate] = useState<FormIndividualTemplate>();
  const [loading, setLoading] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<
    "archive" | "publish" | "draft" | null
  >(null);
  const [statusPopoverOpen, setStatusPopoverOpen] = useState(false);
  const [showFormSubmission, setShowFormSubmission] = useState(false);
  const [selectedSubmissionId, setSelectedSubmissionId] = useState<
    string | null
  >(null);
  const [pendingSubmissionDeleteId, setPendingSubmissionDeleteId] = useState<
    string | null
  >(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchTerm(inputValue);
    }, 500);
    return () => clearTimeout(handler);
  }, [inputValue]);

  // Fetch form template data when component mounts or when formId, page, pageSize, or statusFilter changes
  useEffect(() => {
    const fetchFormTemplate = async () => {
      try {
        setLoading(true);
        let dateParams = "";
        if (dateRange.start)
          dateParams += `&startDate=${encodeURIComponent(
            format(dateRange.start, "yyyy-MM-dd"),
          )}`;
        if (dateRange.end)
          dateParams += `&endDate=${encodeURIComponent(
            format(dateRange.end, "yyyy-MM-dd"),
          )}`;
        const response = await fetch(
          `/api/getFormSubmissionsById/${id}?page=${page}&pageSize=${pageSize}&statusFilter=${statusFilter}${dateParams}`,
        );
        if (!response.ok) {
          throw new Error("Failed to fetch form template");
        }
        const data = await response.json();
        setFormTemplate(data);
        return data;
      } catch (error) {
        console.error("Error fetching form template:", error);
        return null;
      } finally {
        setLoading(false);
      }
    };
    fetchFormTemplate();
  }, [id, page, pageSize, statusFilter, dateRange, refreshKey, searchTerm]);

  //helper functions

  // Statuses and their display info
  const STATUS_OPTIONS = useMemo(
    () => [
      {
        value: "ACTIVE",
        label: "Active",
        color: "bg-emerald-500",
      },
      {
        value: "ARCHIVED",
        label: "Archived",
        color: "bg-gray-400",
      },
      {
        value: "DRAFT",
        label: "Draft",
        color: "bg-yellow-400",
      },
    ],
    [],
  );

  const currentStatus = useMemo(() => {
    if (!formTemplate) return null;
    return (
      STATUS_OPTIONS.find((s) => s.value === formTemplate.isActive) ||
      STATUS_OPTIONS[0]
    );
  }, [formTemplate, STATUS_OPTIONS]);

  const handleDelete = async (submissionId: string) => {
    try {
      const isDeleted = await deleteFormTemplate(submissionId);
      if (isDeleted) {
        // Optionally, you can show a success message or update the UI
        toast.success("Form template deleted successfully");
        router.push("/admins/forms");
      }
    } catch (error) {
      console.error("Error deleting form template:", error);
      toast.error("Failed to delete form template");
    }
  };

  const openHandleDelete = (id: string) => {
    setPendingDeleteId(id);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (pendingDeleteId) {
      await handleDelete(pendingDeleteId);
      setShowDeleteDialog(false);
      setPendingDeleteId(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteDialog(false);
    setPendingDeleteId(null);
  };
  //================================================
  // modal helper function for submission deletion
  const openHandleDeleteSubmission = (id: string) => {
    setPendingSubmissionDeleteId(id);
    setShowDeleteSubmissionDialog(true);
  };

  const confirmSubmissionDelete = async () => {
    if (pendingSubmissionDeleteId) {
      const isDeleted = await deleteFormSubmission(pendingSubmissionDeleteId);
      if (isDeleted) {
        toast.success("Form submission deleted successfully");
        setShowDeleteSubmissionDialog(false);
        setPendingSubmissionDeleteId(null);
        setRefreshKey((prev) => prev + 1);
      } else {
        toast.error("Failed to delete form submission");
      }
    }
  };

  const cancelSubmissionDelete = () => {
    setShowDeleteSubmissionDialog(false);
    setPendingSubmissionDeleteId(null);
  };

  const triggerRerender = () => setRefreshKey((k) => k + 1);

  const handleStatusChange = async (
    status: "ACTIVE" | "ARCHIVED" | "DRAFT",
  ) => {
    if (!formTemplate) return;
    if (formTemplate.isActive === status) return;
    try {
      setActionLoading(
        status === "ACTIVE"
          ? "publish"
          : status === "ARCHIVED"
            ? "archive"
            : "draft",
      );
      if (status === "ACTIVE") {
        const isPublished = await publishFormTemplate(formTemplate.id);
        if (isPublished) {
          toast.success("Form template published successfully");
          setFormTemplate((prev) =>
            prev ? { ...prev, isActive: "ACTIVE" } : prev,
          );
        }
      } else if (status === "ARCHIVED") {
        const isArchived = await archiveFormTemplate(formTemplate.id);
        if (isArchived) {
          toast.success("Form template archived successfully");
          setFormTemplate((prev) =>
            prev ? { ...prev, isActive: "ARCHIVED" } : prev,
          );
        }
      } else if (status === "DRAFT") {
        // Optionally implement draft logic if needed
        const isDrafted = await draftFormTemplate(formTemplate.id);
        if (isDrafted) {
          toast.success("Form template drafted successfully");
          setFormTemplate((prev) =>
            prev ? { ...prev, isActive: "DRAFT" } : prev,
          );
        }
      }
    } catch (error) {
      toast.error("Failed to update form template status");
    } finally {
      setActionLoading(null);
      setStatusPopoverOpen(false);
    }
  };

  const handleExport = async (exportFormat = "xlsx") => {
    if (id) {
      try {
        const template = await getFormTemplate(id);
        const submissions = await getFormSubmissions(id, {
          from: exportDateRange.from,
          to: exportDateRange.to,
        });

        if (!template || !template.FormGrouping) {
          toast.error("Form template or groupings not found");
          return;
        }
        const groupings = template.FormGrouping;
        const fields = groupings
          .flatMap((group) => (Array.isArray(group.Fields) ? group.Fields : []))
          .filter((field) => field && field.id && field.label);

        // Build headers: field labels, plus some submission metadata
        const headers = [
          "Submission ID",
          "Submitted By",
          "Submitted At",
          ...fields.map((field: FormField) => field.label),
        ];

        // Build rows from submissions
        const rows = (submissions || []).map((submission) => {
          const typedSubmission = submission as unknown as {
            id: string;
            User?: { firstName: string; lastName: string };
            submittedAt?: Date;
            createdAt: Date;
            data?: Record<string, unknown>;
          };

          const user = typedSubmission.User
            ? `${typedSubmission.User.firstName} ${typedSubmission.User.lastName}`
            : "";
          const submittedAt =
            (typedSubmission.submittedAt &&
              format(typedSubmission.submittedAt, "yyyy-MM-dd")) ||
            format(typedSubmission.createdAt, "yyyy-MM-dd") ||
            "";
          return [
            typedSubmission.id,
            user,
            submittedAt,
            ...fields.map((field: FormField) => {
              const data = typedSubmission.data as
                | Record<string, unknown>
                | undefined;
              const value = data?.[field.id] ?? data?.[field.label] ?? "";
              // Custom export logic for SEARCH_PERSON and SEARCH_ASSET
              if (field.type === "SEARCH_PERSON") {
                if (Array.isArray(value)) {
                  return value
                    .map((v) => {
                      const person = v as { name?: string };
                      return person?.name;
                    })
                    .filter(Boolean)
                    .join(", ");
                }
                if (typeof value === "object" && value !== null) {
                  const person = value as { name?: string };
                  return person.name || "";
                }
                return "";
              }
              if (field.type === "SEARCH_ASSET") {
                if (Array.isArray(value)) {
                  return value
                    .map((v) => {
                      const asset = v as { name?: string };
                      return asset?.name;
                    })
                    .filter(Boolean)
                    .join(", ");
                }
                if (typeof value === "object" && value !== null) {
                  const asset = value as { name?: string };
                  return asset.name || "";
                }
                return "";
              }
              // Default: handle objects/arrays as before
              if (typeof value === "object" && value !== null) {
                if (Array.isArray(value)) {
                  return value.join(", ");
                }
                return JSON.stringify(value);
              }
              return value;
            }),
          ];
        });

        const exportData = [headers, ...rows];

        if (exportFormat === "csv") {
          const csv = exportData
            .map((row) =>
              row
                .map((cell) => `"${String(cell ?? "").replace(/"/g, '""')}"`)
                .join(","),
            )
            .join("\n");
          const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
          saveAs(
            blob,
            `form_submissions_${exportDateRange.from
              ?.toISOString()
              .slice(0, 10)}_${exportDateRange.to
              ?.toISOString()
              .slice(0, 10)}.csv`,
          );
        } else {
          const ws = XLSX.utils.aoa_to_sheet(exportData);
          const wb = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, "Form Submissions");
          const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
          const blob = new Blob([wbout], { type: "application/octet-stream" });
          saveAs(
            blob,
            `form_submissions_${exportDateRange.from
              ?.toISOString()
              .slice(0, 10)}_${exportDateRange.to
              ?.toISOString()
              .slice(0, 10)}.xlsx`,
          );
        }

        toast.success("Export completed successfully");
      } catch (error) {
        console.error("Error exporting form template:", error);
        toast.error("Failed to export form template");
      } finally {
        setShowExportModal(false);
      }
    }
  };

  return {
    inputValue,
    setInputValue,
    page,
    setPage,
    pageSize,
    setPageSize,
    dateRange,
    setDateRange,
    statusFilter,
    setStatusFilter,
    showExportModal,
    setShowExportModal,
    exportDateRange,
    setExportDateRange,
    showDeleteSubmissionDialog,
    setShowDeleteSubmissionDialog,
    showCreateModal,
    setShowCreateModal,
    formTemplate,
    loading,
    setLoading,
    showDeleteDialog,
    setShowDeleteDialog,
    actionLoading,
    statusPopoverOpen,
    setStatusPopoverOpen,
    showFormSubmission,
    setShowFormSubmission,
    selectedSubmissionId,
    setSelectedSubmissionId,
    refreshKey,
    setRefreshKey,
    STATUS_OPTIONS,
    currentStatus,
    openHandleDelete,

    confirmDelete,
    cancelDelete,
    openHandleDeleteSubmission,
    confirmSubmissionDelete,
    cancelSubmissionDelete,
    triggerRerender,
    handleStatusChange,
    handleExport,
  };
}
