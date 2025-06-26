"use client";

//things to do:
// views :
// list view: display all forms and details in a table with pagination, search, and sorting
// 1) build a api call to fetch all forms and their details
// 2) create a table component to display forms with pagination
// 3) add search functionality to filter forms by name or type
// 4) add sorting functionality to sort forms by name, type, or date created
// 5) in the table add actions to view, edit, or delete forms the edit will open the form in the builder view, the delete will delete the form, the view will open the form in the individual view

// builder view : display form builder with options to create new forms
// approval view : display forms awaiting approval
// individual view : display individual form details and submissions

import SearchBar from "../../../personnel/components/SearchBar";
import PageSelector from "../_components/pageSelector";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";

// ...existing code...
import { Skeleton } from "@/components/ui/skeleton";

export interface FormFieldOptions {
  id: string;
  fieldId: string;
  value: string;
}

export interface FormField {
  id: string;
  label: string;
  name: string;
  type: string;
  required: boolean;
  order: number;
  defaultValue?: string;
  placeholder?: string;
  maxLength?: number;
  helperText?: string;
  options?: FormFieldOptions[];
}

export interface FormGrouping {
  id: string;
  title: string;
  order: number;
  fields: FormField[];
}

export interface FormTemplate {
  _count: {
    Submissions: number;
  };
  id: string;
  name: string;
  formType?: string;
  isActive?: boolean;
  isSignatureRequired?: boolean;
  groupings: FormGrouping[];
  createdAt?: string;
  updatedAt?: string;
}

export default function Forms() {
  const [ViewMode, setViewMode] = useState<
    "list" | "individual" | "builder" | "approval"
  >("list");
  const [forms, setForms] = useState<FormTemplate[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Pagination state
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    async function fetchForms() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `/api/getAllForms?page=${page}&pageSize=${pageSize}`
        );
        if (!res.ok) throw new Error("Failed to fetch forms");
        const result = await res.json();
        setForms(result.data as FormTemplate[]);
        setTotalPages(result.totalPages || 1);
        setTotal(result.total || 0);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Failed to load forms");
      } finally {
        setLoading(false);
      }
    }
    fetchForms();
  }, [page, pageSize]);

  // Client-side search (optional: could be server-side for large data)
  const filteredForms = searchTerm.trim()
    ? forms.filter((form) =>
        form.name.toLowerCase().includes(searchTerm.trim().toLowerCase())
      )
    : forms;

  return (
    <div className="h-screen w-full flex-col gap-4">
      <div className="h-[10vh] w-full flex flex-row justify-between gap-1 p-4">
        <div className="flex flex-col gap-1 mb-4">
          <p className="text-left font-bold text-lg text-white">
            Forms Management
          </p>
          <p className="text-left font-bold text-xs text-white">
            Create, manage, and track form templates and submissions
          </p>
        </div>
        <div>
          <div className="flex flex-row ">
            <PageSelector />
            <div className="flex flex-row gap-2">
              {ViewMode === "approval" && (
                <Button size={"icon"}>
                  <img
                    src="/export-white.svg"
                    alt="Create New Form"
                    className="h-4 w-4"
                  />
                </Button>
              )}
              <Button>Form Builder</Button>
              {ViewMode === "approval" && (
                <>
                  <Button>Create Submission</Button>
                  <Button>Approval</Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="h-[4vh] flex flex-row w-full  gap-4 mb-2">
        <div className="h-full w-full bg-white max-w-[450px] py-2 rounded-lg">
          <SearchBar
            term={searchTerm}
            handleSearchChange={(e) => setSearchTerm(e.target.value)}
            placeholder={"Search forms..."}
            textSize="xs"
            imageSize="6"
          />
        </div>
      </div>
      <div className="bg-white bg-opacity-80 h-fit pb-[2.5em] w-full flex flex-col gap-4 rounded-lg relative">
        {loading ? (
          <Table className="w-full h-full bg-white rounded-lg">
            <TableHeader className="bg-gray-100 rounded-lg ">
              <TableRow className="h-24">
                <TableHead className="rounded-tl-lg text-xs w-1/5">
                  <Skeleton className="h-4 w-3/4" />
                </TableHead>
                <TableHead className="text-center text-xs w-1/6">
                  <Skeleton className="h-4 w-2/3 mx-auto" />
                </TableHead>
                <TableHead className="text-center text-xs w-1/12">
                  <Skeleton className="h-4 w-1/2 mx-auto" />
                </TableHead>
                <TableHead className="text-center text-xs w-1/12">
                  <Skeleton className="h-4 w-2/3 mx-auto" />
                </TableHead>
                <TableHead className="text-center text-xs w-1/6">
                  <Skeleton className="h-4 w-2/3 mx-auto" />
                </TableHead>
                <TableHead className="text-center text-xs w-1/6">
                  <Skeleton className="h-4 w-2/3 mx-auto" />
                </TableHead>
                <TableHead className="w-[160px] text-right pr-6 rounded-tr-lg text-xs">
                  <Skeleton className="h-4 w-1/2 ml-auto" />
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="bg-white pt-2">
              {[...Array(pageSize)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell className="text-xs">
                    <Skeleton className="h-4 w-3/4 mb-1" />
                    <Skeleton className="h-3 w-1/2" />
                  </TableCell>
                  <TableCell className="text-center text-xs">
                    <Skeleton className="h-4 w-2/3 mx-auto" />
                  </TableCell>
                  <TableCell className="text-center text-xs">
                    <Skeleton className="h-4 w-1/2 mx-auto" />
                  </TableCell>
                  <TableCell className="text-center text-xs">
                    <Skeleton className="h-4 w-2/3 mx-auto" />
                  </TableCell>
                  <TableCell className="text-center text-xs">
                    <Skeleton className="h-4 w-2/3 mx-auto" />
                  </TableCell>
                  <TableCell className="text-center text-xs">
                    <Skeleton className="h-4 w-2/3 mx-auto" />
                  </TableCell>
                  <TableCell className="w-[160px]">
                    <div className="flex flex-row justify-center gap-4">
                      <Skeleton className="h-4 w-4 rounded-full" />
                      <Skeleton className="h-4 w-4 rounded-full" />
                      <Skeleton className="h-4 w-4 rounded-full" />
                      <Skeleton className="h-4 w-4 rounded-full" />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <Table className="w-full h-full bg-white rounded-lg">
            <TableHeader className="bg-gray-100 rounded-lg">
              <TableRow>
                <TableHead className="rounded-tl-lg text-xs">
                  Name & Description
                </TableHead>
                <TableHead className="text-center text-xs">Form Type</TableHead>
                <TableHead className="text-center text-xs">
                  Submissions
                </TableHead>
                <TableHead className="text-center text-xs">Status</TableHead>
                <TableHead className="text-center text-xs">
                  Date Created
                </TableHead>
                <TableHead className="text-center text-xs">
                  Date Updated
                </TableHead>
                <TableHead className="w-[160px] text-right pr-6 rounded-tr-lg text-xs">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="bg-white pt-2">
              {filteredForms.map((form) => (
                <TableRow key={form.id}>
                  <TableCell className="text-xs">{form.name}</TableCell>
                  <TableCell className="text-center text-xs">
                    <span className="bg-sky-200 px-3 py-1 rounded-xl">
                      {form.formType}
                    </span>
                  </TableCell>
                  <TableCell className="text-center text-xs text-sky-900 underline hover:text-sky-600 cursor-pointer">
                    {form._count.Submissions}
                  </TableCell>
                  <TableCell className="text-center text-xs">
                    {form.isActive ? (
                      <span className=" bg-green-300 px-3 py-1 rounded-xl ">
                        Active
                      </span>
                    ) : (
                      <span className=" bg-slate-100 px-3 py-1 rounded-xl">
                        Inactive
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-center text-xs">
                    {form.createdAt
                      ? new Date(form.createdAt).toLocaleDateString()
                      : "-"}
                  </TableCell>
                  <TableCell className="text-center text-xs">
                    {form.updatedAt
                      ? new Date(form.updatedAt).toLocaleDateString()
                      : "-"}
                  </TableCell>
                  <TableCell className="w-[160px]">
                    <div className="flex flex-row justify-center gap-4">
                      <img
                        src="/eye.svg"
                        alt="View Form"
                        className="h-4 w-4 cursor-pointer"
                      />
                      <img
                        src="/export.svg"
                        alt="Export Form"
                        className="h-4 w-4 cursor-pointer"
                      />
                      <img
                        src="/formEdit.svg"
                        alt="Edit Form"
                        className="h-4 w-4 cursor-pointer"
                      />
                      <img
                        src="/trash-red.svg"
                        alt="Delete Form"
                        className="h-4 w-4 cursor-pointer"
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        {/* Pagination Controls */}
        <div className="absolute bottom-0 h-10 left-0 right-0 flex flex-row justify-between items-center mt-2 px-2 bg-white border-t border-gray-200 rounded-b-lg">
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
                      setPage((p) => Math.max(1, p - 1));
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
                      setPage((p) => Math.min(totalPages, p + 1));
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
              {[5, 10, 20, 50].map((size) => (
                <option key={size} value={size}>
                  {size} Rows
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
