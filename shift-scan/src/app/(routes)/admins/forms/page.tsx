"use client";
import SearchBar from "../personnel/components/SearchBar";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useFormsList } from "./_components/List/hooks/useFormsList";
import List from "./_components/List/List";
import { FormTemplateCategory } from "@/lib/enums";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { useSidebar } from "@/components/ui/sidebar";
import Link from "next/link";
import {
  deleteFormTemplate,
  getFormSubmissions,
  getFormTemplate,
} from "@/actions/records-forms";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ExportModal } from "./_components/List/exportModal";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import { format } from "date-fns";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

// Form field definition
interface FormField {
  id: string;
  label: string;
  type: string;
  required?: boolean;
  order?: number;
  placeholder?: string | null;
  minLength?: number | null;
  maxLength?: number | null;
  multiple?: boolean | null;
  content?: string | null;
  filter?: string | null;
  Options?: Array<{ id: string; fieldId: string; value: string }>;
}

// Search person type for form values
interface SearchPersonValue {
  name: string;
  [key: string]: unknown;
}

// Search asset type for form values
interface SearchAssetValue {
  name: string;
  [key: string]: unknown;
}

export interface FormItem {
  id: string;
  name: string;
  description: string | null;
  formType: string;
  _count: {
    Submissions: number;
  };
  isActive: "ACTIVE" | "DRAFT" | "ARCHIVED" | string;
  createdAt: string | Date;
  updatedAt: string | Date;
}



type DateRange = { from: Date | undefined; to: Date | undefined };

export default function Forms() {
  const { setOpen, open } = useSidebar();
  const router = useRouter();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportingFormId, setExportingFormId] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<DateRange>({
    from: undefined,
    to: undefined,
  });
  const {
    searchTerm,
    setSearchTerm,
    formType,
    setFormType,
    loading,
    page,
    pageSize,
    totalPages,
    total,
    setPage,
    setPageSize,
    filteredForms,
    refetch,
  } = useFormsList();

  // Helper to get enum values as array
  const formTemplateCategoryValues = Object.values(FormTemplateCategory);
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
      refetch();
    }
  };

  const cancelDelete = () => {
    setShowDeleteDialog(false);
    setPendingDeleteId(null);
  };

  const handleExport = async (exportFormat = "xlsx") => {
    if (exportingFormId) {
      try {
        const template = await getFormTemplate(exportingFormId);
        const submissions = await getFormSubmissions(exportingFormId, {
          from: dateRange.from,
          to: dateRange.to,
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
          const user = submission.User
            ? `${submission.User.firstName} ${submission.User.lastName}`
            : "";
          const submittedAt =
            (submission.submittedAt
              ? format(submission.submittedAt, "yyyy-MM-dd")
              : "") ||
            (submission.createdAt
              ? format(new Date(submission.createdAt), "yyyy-MM-dd")
              : "") ||
            "";
          return [
            submission.id,
            user,
            submittedAt,
            ...fields.map((field: FormField) => {
              const value =
                submission.data?.[field.id as keyof typeof submission.data] ??
                submission.data?.[
                  field.label as keyof typeof submission.data
                ] ??
                "";
              // Custom export logic for SEARCH_PERSON and SEARCH_ASSET
              if (field.type === "SEARCH_PERSON") {
                if (Array.isArray(value)) {
                  return value
                    .map((v: SearchPersonValue) => v?.name)
                    .filter(Boolean)
                    .join(", ");
                }
                if (typeof value === "object" && value !== null) {
                  return (value as SearchPersonValue).name || "";
                }
                return "";
              }
              if (field.type === "SEARCH_ASSET") {
                if (Array.isArray(value)) {
                  return value
                    .map((v: SearchAssetValue) => v?.name)
                    .filter(Boolean)
                    .join(", ");
                }
                if (typeof value === "object" && value !== null) {
                  return (value as SearchAssetValue).name || "";
                }
                return "";
              }
              // Default: handle objects/arrays as before
              if (typeof value === "object" && value !== null) {
                if (Array.isArray(value)) {
                  return (value as unknown[]).join(", ");
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
                .join(",")
            )
            .join("\n");
          const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
          saveAs(
            blob,
            `form_submissions_${new Date().toISOString().slice(0, 10)}.csv`
          );
        } else {
          const ws = XLSX.utils.aoa_to_sheet(exportData);
          const wb = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, "Form Submissions");
          const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
          const blob = new Blob([wbout], { type: "application/octet-stream" });
          saveAs(
            blob,
            `form_submissions_${new Date().toISOString().slice(0, 10)}.xlsx`
          );
        }

        toast.success("Export completed successfully");
      } catch (error) {
        console.error("Error exporting form template:", error);
        toast.error("Failed to export form template");
      } finally {
        setShowExportModal(false);
        setExportingFormId(null);
      }
    }
  };

  // Main render
  return (
    <div className="w-full p-4 grid grid-rows-[3rem_2rem_1fr] gap-4">
      <div className="h-full row-span-1 max-h-12 w-full flex flex-row justify-between gap-4 ">
        <div className="flex flex-row gap-5 ">
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
            <p className="text-left font-bold text-base text-white">
              Forms Management
            </p>
            <p className="text-left font-normal text-xs text-white">
              Create, manage, and track form templates and submissions
            </p>
          </div>
        </div>
        <div>
          {" "}
          <div className="h-fit flex flex-row ">
            <div className="flex flex-row gap-2">
              <Link href={`/admins/forms/create`}>
                <Button>
                  <img
                    src="/plus-white.svg"
                    alt="Create New Form"
                    className="h-4 w-4 mr-1"
                  />
                  <p>Form Template</p>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="h-fit max-h-12 w-full flex flex-row justify-between gap-4 mb-2 ">
        <div className="flex flex-row w-full gap-4 mb-2">
          <div className="h-full w-full p-1 bg-white max-w-[450px] rounded-lg ">
            <SearchBar
              term={searchTerm}
              handleSearchChange={(e) => setSearchTerm(e.target.value)}
              placeholder={"Search forms by name..."}
              textSize="xs"
              imageSize="6"
            />
          </div>
          <Select
            value={formType}
            onValueChange={(val) => setFormType(val as typeof formType)}
          >
            <SelectTrigger className="px-2 text-xs w-fit min-w-[150px] h-full bg-white border rounded-lg">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Categories</SelectItem>
              {formTemplateCategoryValues.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="h-[85vh] rounded-lg  w-full relative bg-white">
        <ScrollArea
          alwaysVisible
          className="h-[80vh] w-full  bg-white rounded-t-lg  border border-slate-200 relative pr-2"
        >
          <List
            forms={filteredForms}
            loading={loading}
            page={page}
            pageSize={pageSize}
            totalPages={totalPages}
            total={total}
            setPage={setPage}
            setPageSize={setPageSize}
            openHandleDelete={openHandleDelete}
            setPendingExportId={(id) => {
              setExportingFormId(id);
              setShowExportModal(true);
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

      {/* Export Modal */}
      {showExportModal && (
        <ExportModal
          setDateRange={setDateRange}
          dateRange={dateRange}
          onClose={() => {
            setShowExportModal(false);
            setExportingFormId(null);
          }}
          onExport={handleExport}
        />
      )}
    </div>
  );
}
