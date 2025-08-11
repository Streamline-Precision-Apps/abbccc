"use client";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import SearchBar from "../../personnel-old/components/SearchBar";
import { useEffect, useState, useCallback, useMemo, use } from "react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useRouter } from "next/navigation";
import {
  FormIndividualTemplate,
  Submission,
  Fields as FormField,
} from "./_component/hooks/types";
import { Skeleton } from "@/components/ui/skeleton";

// Additional type definitions
// Using a type that's compatible with what's expected by the component
interface FormSubmission {
  id: string;
  title: string | null;
  formTemplateId: string;
  userId: string;
  formType: string | null;
  data: Record<string, unknown> | null;
  createdAt: string | Date;
  updatedAt: string | Date;
  submittedAt: string | Date | null;
  status: string;
  User: {
    id: string;
    firstName: string;
    lastName: string;
  };
}

interface PersonSearchResult {
  name: string;
  [key: string]: unknown;
}

interface AssetSearchResult {
  name: string;
  [key: string]: unknown;
}
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import SubmissionTable from "./_component/SubmissionTable";
import { toast } from "sonner";
import {
  archiveFormTemplate,
  deleteFormSubmission,
  deleteFormTemplate,
  draftFormTemplate,
  getFormSubmissions,
  getFormTemplate,
  publishFormTemplate,
} from "@/actions/records-forms";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import { FormStatus } from "@/lib/enums";
import { ExportModal } from "../_components/List/exportModal";
import EditFormSubmissionModal from "./_component/editFormSubmissionModal";
import CreateFormSubmissionModal from "./_component/CreateFormSubmissionModal";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { FormTemplate } from "../_components/List/hooks/types";
import Spinner from "@/components/(animations)/spinner";
import ReloadBtnSpinner from "@/components/(animations)/reload-btn-spinner";

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const FormPage = ({ params, searchParams }: PageProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
  const { setOpen, open } = useSidebar();
  const { id } = use(params);
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
  }, [id, page, pageSize, statusFilter, dateRange, refreshKey]);

  const returnToList = () => {
    router.push("/admins/forms");
  };

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

  // Memoize the action buttons to ensure they re-render on state change
  const renderActionButtons = useCallback(() => {
    return (
      <div className="flex flex-row gap-2 items-center">
        {formTemplate && (
          <Popover open={statusPopoverOpen} onOpenChange={setStatusPopoverOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className={`flex items-center gap-2 min-w-[120px] `}
                disabled={actionLoading !== null}
              >
                <span
                  className={`inline-block w-3 h-3 rounded-full ${currentStatus?.color} border border-gray-300`}
                />
                <span className="font-semibold text-xs">
                  {actionLoading
                    ? actionLoading === "archive"
                      ? "Archiving..."
                      : actionLoading === "publish"
                        ? "Publishing..."
                        : "Updating..."
                    : currentStatus?.label}
                </span>
                <svg
                  className="w-3 h-3 ml-1"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-40 p-0">
              <div className="py-1">
                {STATUS_OPTIONS.map((status) => (
                  <button
                    key={status.value}
                    className={`flex items-center w-full px-3 py-2 text-left text-xs hover:bg-gray-100 ${
                      formTemplate.isActive === status.value ? "bg-gray-50" : ""
                    }`}
                    onClick={() =>
                      handleStatusChange(
                        status.value as "ACTIVE" | "ARCHIVED" | "DRAFT",
                      )
                    }
                    disabled={
                      formTemplate.isActive === status.value ||
                      actionLoading !== null
                    }
                  >
                    <span
                      className={`inline-block w-3 h-3 rounded-full mr-2 ${status.color} border border-gray-300`}
                    />
                    <span className="flex-1">{status.label}</span>
                    {formTemplate.isActive === status.value && (
                      <svg
                        className="w-3 h-3 ml-2 text-emerald-500"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        )}
        <Button
          variant={"destructive"}
          size={"sm"}
          className="min-w-[120px] hover:bg-slate-500 hover:bg-opacity-20"
          onClick={() => {
            if (formTemplate) {
              openHandleDelete(formTemplate.id);
            }
          }}
        >
          <p className="text-xs font-semibold">Delete</p>
          <img src="/trash.svg" alt="Delete Form" className="h-4 w-4" />
        </Button>
      </div>
    );
  }, [
    formTemplate,
    actionLoading,
    statusPopoverOpen,
    currentStatus,
    STATUS_OPTIONS,
  ]);

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

  const renderTableSection = () => {
    if (loading) {
      return (
        <>
          <Table className="bg-white rounded-t-lg w-full h-full rounded-lg">
            <TableHeader className="rounded-t-md">
              <TableRow>
                <TableHead className="text-xs rounded-tl-md">
                  <Skeleton className="h-4 w-20" />
                </TableHead>
                {[...Array(4)].map((_, i) => (
                  <TableHead key={i} className="text-xs">
                    <Skeleton className="h-4 w-20" />
                  </TableHead>
                ))}
                <TableHead className="text-xs">
                  <Skeleton className="h-4 w-12" />
                </TableHead>
                <TableHead className="text-xs">
                  <Skeleton className="h-4 w-20" />
                </TableHead>
                <TableHead className="text-xs text-center">
                  <Skeleton className="h-4 w-16 mx-auto" />
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="bg-white h-full w-full">
              {[...Array(25)].map((_, rowIdx) => (
                <TableRow key={rowIdx} className="bg-white">
                  <TableCell className="text-xs">
                    <Skeleton className="h-4 w-20" />
                  </TableCell>
                  {[...Array(4)].map((_, colIdx) => (
                    <TableCell key={colIdx} className="text-xs">
                      <Skeleton className="h-4 w-20" />
                    </TableCell>
                  ))}
                  <TableCell className="text-xs">
                    <Skeleton className="h-4 w-12" />
                  </TableCell>
                  <TableCell className="text-xs">
                    <Skeleton className="h-4 w-20" />
                  </TableCell>
                  <TableCell className="w-[160px]">
                    <div className="flex flex-row justify-center gap-2">
                      <Skeleton className="h-6 w-6 rounded-full" />
                      <Skeleton className="h-6 w-6 rounded-full" />
                      <Skeleton className="h-6 w-6 rounded-full" />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="absolute bottom-0 h-10 left-0 right-0 flex flex-row justify-between items-center mt-2 px-2 bg-white border-t border-gray-200 rounded-b-lg">
            <Skeleton className="h-4 w-32" />
            <div className="flex flex-row gap-2 items-center">
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-8 w-20" />
            </div>
          </div>
        </>
      );
    }

    if (formTemplate && formTemplate !== null) {
      return (
        <>
          <SubmissionTable
            groupings={formTemplate.FormGrouping}
            submissions={formTemplate.Submissions}
            setShowFormSubmission={setShowFormSubmission}
            setSelectedSubmissionId={setSelectedSubmissionId}
            onDeleteSubmission={openHandleDeleteSubmission}
            totalPages={formTemplate.totalPages || 1}
            page={page}
            setPage={setPage}
            setPageSize={setPageSize}
            pageSize={pageSize}
            loading={loading}
            isSignatureRequired={formTemplate.isSignatureRequired}
          />
          {formTemplate.Submissions &&
            formTemplate.Submissions.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-xs text-muted-foreground select-none">
                  No submissions found.
                </p>
              </div>
            )}
        </>
      );
    }

    return (
      <div className="bg-white bg-opacity-80 h-[85vh] pb-[1.5em] w-full flex items-center justify-center rounded-lg">
        <p className="text-sm font-bold text-red-500">
          Error: Form Template does not exist
        </p>
      </div>
    );
  };

  return (
    <div className="w-full p-4 grid grid-rows-[3rem_2rem_1fr] gap-4">
      <div className="h-full row-span-1 max-h-12 w-full flex flex-row justify-between gap-4 ">
        <div className="w-full flex flex-row gap-5 mb-2">
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

          <div className="flex flex-col">
            {!loading && formTemplate ? (
              <p className="text-left font-bold text-base text-white">
                {formTemplate?.name}
              </p>
            ) : (
              <Skeleton className="h-3 w-32 mt-1" />
            )}
            {formTemplate && !loading ? (
              <p className="text-left text-xs text-white">
                Review and manage all form submissions.
              </p>
            ) : (
              <Skeleton className="h-2 w-40 mt-1" />
            )}
          </div>
          <div className="flex justify-end items-center ml-auto">
            {renderActionButtons()}
          </div>
        </div>
      </div>
      <div className="h-fit max-h-12  w-full flex flex-row justify-between gap-4 mb-2 ">
        <div className="w-full flex flex-row gap-4 ">
          <Button
            variant="outline"
            size="sm"
            className="h-full w-fit text-xs"
            onClick={returnToList}
          >
            <img
              src="/arrowBack.svg"
              alt="back"
              className="w-4 h-auto object-contain"
            />
            <p>Back</p>
          </Button>
          <div className="h-full w-full p-1 bg-white max-w-[450px] rounded-lg ">
            <SearchBar
              term={searchTerm}
              handleSearchChange={(e) => setSearchTerm(e.target.value)}
              placeholder={"Search forms by name..."}
              textSize="xs"
              imageSize="6"
            />
          </div>
          <div className="h-full w-full p-1 bg-white max-w-[200px] rounded-lg flex items-center">
            <select
              className="block w-full h-full rounded-md bg-white text-xs "
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(
                  e.target.value as "ALL" | keyof typeof FormStatus,
                )
              }
            >
              <option value="ALL">All Status</option>
              {Object.keys(FormStatus).map((status) => (
                <option key={status} value={status}>
                  {status.charAt(0) + status.slice(1).toLowerCase()}
                </option>
              ))}
            </select>
          </div>
          <div className="h-full w-full  bg-white max-w-[250px]  rounded-lg flex items-center">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full h-full flex justify-between items-center text-xs"
                >
                  <span>
                    {dateRange.start && dateRange.end
                      ? `${format(dateRange.start, "MMM d, yyyy")} - ${format(
                          dateRange.end,
                          "MMM d, yyyy",
                        )}`
                      : dateRange.start
                        ? `${format(dateRange.start, "MMM d, yyyy")} - ...`
                        : "Pick date range"}
                  </span>
                  <svg
                    className="w-4 h-4 ml-2"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </Button>
              </PopoverTrigger>
              <PopoverContent
                align="end"
                className="p-2 w-auto bg-white rounded-lg shadow-lg border"
              >
                <Calendar
                  mode="range"
                  selected={
                    dateRange.start && dateRange.end
                      ? { from: dateRange.start, to: dateRange.end }
                      : undefined
                  }
                  onSelect={(range) => {
                    setDateRange({
                      start: range?.from,
                      end: range?.to,
                    });
                  }}
                  numberOfMonths={2}
                  className="border-none shadow-none"
                />
                <div className="flex justify-end mt-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs"
                    onClick={() =>
                      setDateRange({ start: undefined, end: undefined })
                    }
                    disabled={!dateRange.start && !dateRange.end}
                  >
                    Clear
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex items-center ">
            <p className="font-light text-xs text-white">{`${formTemplate?.Submissions?.length} of ${formTemplate?.total} submissions`}</p>
          </div>
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
        <div className="flex justify-center items-center">
          <Button
            onClick={() => {
              setShowCreateModal(true);
            }}
            variant={"default"}
            size={"default"}
            className="px-6 py-1 rounded-lg  hover:bg-slate-800"
          >
            <img src="/plus-white.svg" alt="Export Form" className="h-4 w-4" />
            <p className="text-xs ">Create</p>
          </Button>
        </div>
        <ReloadBtnSpinner
          isRefreshing={loading}
          fetchData={() => setRefreshKey((k) => k + 1)}
        />
      </div>
      <div className="h-[85vh] rounded-lg  w-full relative bg-white">
        {loading && (
          <div className="absolute inset-0 z-20 flex flex-row items-center gap-2 justify-center bg-white bg-opacity-70 rounded-lg">
            <Spinner size={20} />
            <span className="text-lg text-gray-500">Loading...</span>
          </div>
        )}
        <ScrollArea
          alwaysVisible
          className="h-[80vh] w-full  bg-white rounded-t-lg  border border-slate-200 relative pr-2"
        >
          {renderTableSection()}
          <div className="h-1 bg-slate-100 border-y border-slate-200 absolute bottom-0 right-0 left-0">
            <ScrollBar
              orientation="horizontal"
              className="w-full h-3 ml-2 mr-2 rounded-full"
            />
          </div>
        </ScrollArea>
        {formTemplate && (
          <div className="absolute bottom-0 h-[5vh] left-0 right-0 flex flex-row justify-between items-center mt-2 px-3 bg-white border-t border-gray-200 rounded-b-lg">
            <div className="text-xs text-gray-600">
              Showing page {page} of {formTemplate.totalPages} (
              {formTemplate.total} total)
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
                        setPage(Math.min(formTemplate.totalPages, page + 1));
                      }}
                      aria-disabled={page === formTemplate.totalPages}
                      tabIndex={page === formTemplate.totalPages ? -1 : 0}
                      style={{
                        pointerEvents:
                          page === formTemplate.totalPages ? "none" : undefined,
                        opacity: page === formTemplate.totalPages ? 0.5 : 1,
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
      {/* Create Section Modal */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Form Template?</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this form template? All form data
              will be permanently deleted. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={cancelDelete}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Delete Submission Confirmation Dialog */}
      <Dialog
        open={showDeleteSubmissionDialog}
        onOpenChange={setShowDeleteSubmissionDialog}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Form Submission?</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this form submission? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={cancelSubmissionDelete}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmSubmissionDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {showExportModal && (
        <ExportModal
          setDateRange={setExportDateRange}
          dateRange={exportDateRange}
          onClose={() => {
            setShowExportModal(false);
          }}
          onExport={handleExport}
        />
      )}
      {showCreateModal && formTemplate && (
        <CreateFormSubmissionModal
          formTemplate={formTemplate}
          closeModal={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            triggerRerender();
          }}
        />
      )}
      {showFormSubmission && selectedSubmissionId && formTemplate && (
        <EditFormSubmissionModal
          id={selectedSubmissionId}
          formTemplate={formTemplate}
          closeModal={() => setShowFormSubmission(false)}
          onSuccess={() => {
            setShowFormSubmission(false);
            triggerRerender();
          }}
        />
      )}
    </div>
  );
};

export default FormPage;
