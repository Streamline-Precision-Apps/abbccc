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
import { JobsiteSummary } from "../useJobsiteData";
import { getJobsiteTableColumns } from "./jobsiteTableColumns";
import { useRouter } from "next/navigation";

interface JobsiteDataTableProps {
  data: JobsiteSummary[];
  loading: boolean;
  page: number;
  totalPages: number;
  total: number;
  pageSize: number;
  searchTerm: string;
  setPage: Dispatch<SetStateAction<number>>;
  setPageSize: Dispatch<SetStateAction<number>>;
  onEditClick?: (id: string) => void;
  onDeleteClick?: (id: string) => void;
  onQrClick?: (id: string) => void;
  showPendingOnly: boolean;
}

export function JobsiteDataTable({
  data,
  loading,
  page,
  totalPages,
  total,
  pageSize,
  searchTerm,
  setPage,
  setPageSize,
  onEditClick,
  onDeleteClick,
  onQrClick,
  showPendingOnly,
}: JobsiteDataTableProps) {
  const router = useRouter();
  // Create column definitions with the action handlers
  const columns = useMemo(() => {
    const cols = getJobsiteTableColumns(router);
    // Find and update the actions column
    const actionsColumnIndex = cols.findIndex((col) => col.id === "actions");
    if (actionsColumnIndex >= 0) {
      cols[actionsColumnIndex] = {
        ...cols[actionsColumnIndex],
        cell: ({ row }) => {
          const item = row.original;
          return (
            <div className="flex flex-row justify-center">
              {/* QR Code button */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onQrClick?.(item.id)}
                  >
                    <img
                      src="/qrCode.svg"
                      alt="QR Code"
                      className="h-4 w-4 cursor-pointer"
                    />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Print QR Code</TooltipContent>
              </Tooltip>

              {/* Edit button */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEditClick?.(item.id)}
                  >
                    <img
                      src="/formEdit.svg"
                      alt="Edit"
                      className="h-4 w-4 cursor-pointer"
                    />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Edit</TooltipContent>
              </Tooltip>

              {/* Delete button */}
              {row.original._count?.TimeSheets === 0 ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDeleteClick?.(item.id)}
                    >
                      <img
                        src="/trash-red.svg"
                        alt="Delete"
                        className="h-4 w-4 cursor-pointer"
                      />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Delete</TooltipContent>
                </Tooltip>
              ) : (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      className="opacity-50 "
                      variant="ghost"
                      size="icon"
                      onClick={() => {}}
                    >
                      <img
                        src="/trash-red.svg"
                        alt="Delete"
                        className="h-4 w-4 cursor-pointer"
                      />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="bg-white text-red-500 border border-red-300">
                    <span className="">Cannot delete:</span>
                    <br />
                    <span className="">linked timesheets</span>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
          );
        },
      };
    }
    return cols;
  }, [router, onEditClick, onDeleteClick, onQrClick]);

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
                    {/* Create skeleton cells for each column */}
                    {columns.map((col, colIndex) => (
                      <TableCell
                        key={`loading-cell-${colIndex}`}
                        className="whitespace-nowrap border-r border-gray-200 text-xs text-center"
                      >
                        <Skeleton className="h-4 w-16 mx-auto" />
                      </TableCell>
                    ))}
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
                        className="whitespace-nowrap border-r border-gray-200 text-xs text-center"
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
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    {showPendingOnly ? (
                      <p className="text-gray-500 italic">
                        No Jobsite to Approve.
                      </p>
                    ) : (
                      <p className="text-gray-500 italic">No jobsites found.</p>
                    )}
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
