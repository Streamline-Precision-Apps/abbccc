"use client";

//things to do:
// views :
// list view: display all forms and details in a table with pagination, search, and sorting
// 1) build export module to export forms as CSV or xlsx - done
// 2) create a table component to display forms with pagination - done
// 3) add search functionality to filter forms by name - done

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
          ...fields.map((field: any) => field.label),
        ];

        // Build rows from submissions
        const rows = (submissions || []).map((submission: any) => {
          const user = submission.User
            ? `${submission.User.firstName} ${submission.User.lastName}`
            : "";
          const submittedAt =
            submission.submittedAt || submission.createdAt || "";
          return [
            submission.id,
            user,
            submittedAt,
            ...fields.map((field: any) => {
              // Prefer field.id as key, fallback to label
              return (
                submission.data?.[field.id] ??
                submission.data?.[field.label] ??
                ""
              );
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
    <div className="h-full w-full flex flex-row p-4">
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
      <div className="h-full w-full relative">
        <div className="h-fit w-full flex flex-row justify-between mb-4">
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
        <div className="h-fit w-full flex flex-row justify-between gap-4 mb-2 ">
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
      </div>
    </div>
  );
}
