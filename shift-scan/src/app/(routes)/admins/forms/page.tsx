"use client";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useFormsList } from "./_components/List/hooks/useFormsList";
import { FormTemplateCategory } from "@/lib/enums";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
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
import Spinner from "@/components/(animations)/spinner";
import SearchBarPopover from "../_pages/searchBarPopover";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { PageHeaderContainer } from "../_pages/PageHeaderContainer";
import { FooterPagination } from "../_pages/FooterPagination";
import { FormsDataTable } from "./_components/List/FormsDataTable";

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
    inputValue,
    setInputValue,
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
        toast.success("Form template deleted successfully", { duration: 3000 });
        router.push("/admins/forms");
      }
    } catch (error) {
      console.error("Error deleting form template:", error);
      toast.error("Failed to delete form template", { duration: 3000 });
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

  // Helper function to show export modal and set exportingFormId
  const handleShowExportModal = (id: string) => {
    setExportingFormId(id);
    setShowExportModal(true);
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
          toast.error("Form template or groupings not found", {
            duration: 3000,
          });
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
                .join(","),
            )
            .join("\n");
          const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
          saveAs(
            blob,
            `form_submissions_${new Date().toISOString().slice(0, 10)}.csv`,
          );
        } else {
          const ws = XLSX.utils.aoa_to_sheet(exportData);
          const wb = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, "Form Submissions");
          const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
          const blob = new Blob([wbout], { type: "application/octet-stream" });
          saveAs(
            blob,
            `form_submissions_${new Date().toISOString().slice(0, 10)}.xlsx`,
          );
        }

        toast.success("Export completed successfully", { duration: 3000 });
      } catch (error) {
        console.error("Error exporting form template:", error);
        toast.error("Failed to export form template", { duration: 3000 });
      } finally {
        setShowExportModal(false);
        setExportingFormId(null);
      }
    }
  };

  // Main render
  return (
    <div className="w-full p-4 grid grid-rows-[3rem_2rem_1fr] gap-5">
      <PageHeaderContainer
        loading={loading}
        headerText="Forms Management"
        descriptionText="Create, manage, and track form templates and submissions"
        refetch={() => {
          refetch();
        }}
      />

      <div className="h-10 w-full flex flex-row justify-between gap-4">
        <div className="flex flex-row w-full gap-2">
          <SearchBarPopover
            term={inputValue}
            handleSearchChange={(e) => setInputValue(e.target.value)}
            placeholder={"Search by form name..."}
            textSize="xs"
            imageSize="10"
          />
          <div className="relative flex items-center">
            <Select
              value={formType}
              onValueChange={(val) => setFormType(val as typeof formType)}
            >
              <SelectTrigger className="px-2 text-xs w-full max-w-[150px] text-center h-full bg-white border rounded-lg">
                <SelectValue placeholder="Form Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Filter By Category</SelectItem>
                {formTemplateCategoryValues.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {formType !== "ALL" && (
              <Tooltip>
                <TooltipTrigger>
                  <Badge
                    variant="destructive"
                    className="h-4 w-4 absolute -top-1 -right-1 p-0.5 cursor-pointer hover:bg-red-400 hover:bg-opacity-100"
                    onClick={() => setFormType("ALL")}
                  >
                    <X className="h-4 w-4" />
                  </Badge>
                </TooltipTrigger>
                <TooltipContent sideOffset={10} side="right" align="end">
                  <p className="text-xs">Remove</p>
                </TooltipContent>
              </Tooltip>
            )}
          </div>
        </div>
        <div className="h-full flex flex-row gap-4 ">
          <Tooltip>
            <TooltipTrigger asChild>
              <Link href={`/admins/forms/create`}>
                <Button size={"icon"} className="min-w-12">
                  <img
                    src="/plus-white.svg"
                    alt="Create New Form"
                    className="h-4 w-4 "
                  />
                </Button>
              </Link>
            </TooltipTrigger>
            <TooltipContent>Create Form Template</TooltipContent>
          </Tooltip>
        </div>
      </div>

      <div className="h-[85vh] rounded-lg w-full relative bg-white overflow-hidden">
        <div className="h-full w-full overflow-auto pb-10">
          <FormsDataTable
            data={filteredForms}
            loading={loading}
            page={page}
            totalPages={totalPages}
            total={total}
            pageSize={pageSize}
            searchTerm={inputValue}
            setPage={setPage}
            setPageSize={setPageSize}
            openHandleDelete={openHandleDelete}
            handleShowExportModal={handleShowExportModal}
          />
          {loading && (
            <div className="absolute inset-0 z-20 flex flex-row items-center gap-2 justify-center bg-white bg-opacity-70 rounded-lg">
              <Spinner size={20} />
              <span className="text-lg text-gray-500">Loading...</span>
            </div>
          )}
          <div className="flex items-center justify-end space-x-2 py-4 ">
            <FooterPagination
              page={loading ? 1 : page}
              totalPages={loading ? 1 : totalPages}
              total={loading ? 0 : total}
              pageSize={pageSize}
              setPage={setPage}
              setPageSize={setPageSize}
            />
          </div>
        </div>
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
