"use client";

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import React, { Dispatch, SetStateAction, useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { FormItem } from "./hooks/types";
import { formsTableColumns } from "./formsTableColumns";
import Link from "next/link";

interface FormsDataTableProps {
  data: FormItem[];
  loading: boolean;
  page: number;
  totalPages: number;
  total: number;
  pageSize: number;
  searchTerm: string;
  setPage: Dispatch<SetStateAction<number>>;
  setPageSize: Dispatch<SetStateAction<number>>;
  openHandleDelete: (id: string) => void;
  handleShowExportModal: (id: string) => void;
}

export function FormsDataTable({
  data,
  loading,
  page,
  totalPages,
  total,
  pageSize,
  searchTerm,
  setPage,
  setPageSize,
  openHandleDelete,
  handleShowExportModal,
}: FormsDataTableProps) {
  // Create column definitions with the action handlers
  const columns = useMemo(() => {
    // Copy the base columns
    const cols = [...formsTableColumns];

    // Find and update the actions column
    const actionsColumnIndex = cols.findIndex((col) => col.id === "actions");
    if (actionsColumnIndex >= 0) {
      // Replace with a new definition that includes our handlers
      cols[actionsColumnIndex] = {
        ...cols[actionsColumnIndex],
        cell: ({ row }) => {
          const form = row.original;
          return (
            <div className="flex flex-row justify-center">
              <Link href={`/admins/forms/${form.id}`}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size={"icon"}>
                      <img
                        src="/eye.svg"
                        alt="View Form"
                        className="h-4 w-4 cursor-pointer"
                      />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>View Submissions</TooltipContent>
                </Tooltip>
              </Link>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size={"icon"}
                    onClick={() => handleShowExportModal(form.id)}
                  >
                    <img
                      src="/export.svg"
                      alt="Export Form"
                      className="h-4 w-4 cursor-pointer"
                    />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Export Submissions</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href={`/admins/forms/edit/${form.id}`}>
                    <Button variant="ghost" size={"icon"}>
                      <img
                        src="/formEdit.svg"
                        alt="Edit Form"
                        className="h-4 w-4 cursor-pointer"
                      />
                    </Button>
                  </Link>
                </TooltipTrigger>
                <TooltipContent>Edit Form Template</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size={"icon"}
                    onClick={() => openHandleDelete(form.id)}
                  >
                    <img
                      src="/trash-red.svg"
                      alt="Delete Form"
                      className="h-4 w-4 cursor-pointer"
                    />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Delete Form Template</TooltipContent>
              </Tooltip>
            </div>
          );
        },
      };
    }

    return cols;
  }, [openHandleDelete, handleShowExportModal]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      pagination: {
        pageIndex: page - 1, // TanStack Table uses 0-indexed pages
        pageSize,
      },
    },
    manualPagination: true, // Tell TanStack Table we're handling pagination manually
    pageCount: totalPages, // Important for proper page count display
    onPaginationChange: (updater) => {
      const newState =
        typeof updater === "function"
          ? updater({ pageIndex: page - 1, pageSize })
          : updater;

      setPage(newState.pageIndex + 1);
      if (newState.pageSize !== pageSize) {
        setPageSize(newState.pageSize);
      }
    },
  });

  return (
    <div className="w-full h-full flex flex-col relative">
      <div className="flex-1 overflow-visible pb-[50px]">
        <div className="rounded-md w-full h-full">
          <Table className="w-full">
            <TableHeader className="sticky top-0 z-10 bg-gray-100">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="bg-muted">
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead
                        key={header.id}
                        className="whitespace-nowrap font-semibold text-gray-700 text-center border-r bg-gray-100 border-gray-200 last:border-r-0 text-xs sticky top-0"
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody className="h-full divide-y divide-gray-200 bg-white">
              {loading ? (
                // Skeleton loading state with customized widths
                Array.from({ length: 10 }).map((_, index) => (
                  <TableRow
                    key={`loading-row-${index}`}
                    className="odd:bg-white even:bg-gray-100 border-r border-gray-200 text-xs text-center py-2"
                  >
                    {/* Name & Description column */}
                    <TableCell className="text-xs text-left">
                      <Skeleton className="h-4 w-3/4 mb-1" />
                      <Skeleton className="h-3 w-1/2" />
                    </TableCell>
                    {/* Form Type column */}
                    <TableCell className="text-center text-xs">
                      <Skeleton className="h-6 w-2/3 mx-auto rounded-xl" />
                    </TableCell>
                    {/* Submissions column */}
                    <TableCell className="text-center text-xs">
                      <Skeleton className="h-4 w-1/2 mx-auto" />
                    </TableCell>
                    {/* Status column */}
                    <TableCell className="text-center text-xs">
                      <Skeleton className="h-6 w-8 mx-auto rounded-xl" />
                    </TableCell>
                    {/* Date Created column */}
                    <TableCell className="text-center text-xs">
                      <Skeleton className="h-4 w-2/3 mx-auto" />
                    </TableCell>
                    {/* Date Updated column */}
                    <TableCell className="text-center text-xs">
                      <Skeleton className="h-4 w-2/3 mx-auto" />
                    </TableCell>
                    {/* Actions column */}
                    <TableCell className="w-[160px]">
                      <div className="flex flex-row justify-center gap-4">
                        <Skeleton className="h-4 w-4 rounded-full" />
                        <Skeleton className="h-4 w-4 rounded-full" />
                        <Skeleton className="h-4 w-4 rounded-full" />
                        <Skeleton className="h-4 w-4 rounded-full" />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className="odd:bg-white even:bg-gray-100 border-r border-gray-200 text-xs text-center py-2"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className="whitespace-nowrap border-r border-gray-200 text-xs text-center px-3 py-2"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={formsTableColumns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
