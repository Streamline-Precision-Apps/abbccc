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
import { PersonnelSummary } from "../usePersonnelData";
import { personnelTableColumns } from "./personnelTableColumns";

interface PersonnelDataTableProps {
  data: PersonnelSummary[];
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
  showInactive?: boolean;
}

export function PersonnelDataTable({
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
  showInactive,
}: PersonnelDataTableProps) {
  // Create column definitions with the action handlers
  const columns = useMemo(() => {
    // Copy the base columns
    const cols = [...personnelTableColumns];

    // Find and update the actions column
    const actionsColumnIndex = cols.findIndex((col) => col.id === "actions");
    if (actionsColumnIndex >= 0) {
      // Replace with a new definition that includes our handlers
      cols[actionsColumnIndex] = {
        ...cols[actionsColumnIndex],
        cell: ({ row }) => {
          const item = row.original;
          return (
            <div className="flex flex-row items-center justify-center">
              {/* Edit button */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size={"icon"}
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
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size={"icon"}
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
            </div>
          );
        },
      };
    }

    return cols;
  }, [onEditClick, onDeleteClick]);

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
          <Table className="w-full mb-10">
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
                    {/* User cell skeleton (matches new layout) */}
                    <TableCell className="border-r border-gray-200 text-xs text-center">
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0">
                          <Skeleton className="h-10 w-10 rounded-full" />
                        </div>
                        <div className="flex flex-col items-start flex-1 min-w-0">
                          <Skeleton className="h-4 w-24 mb-1" />
                          <Skeleton className="h-3 w-12" />
                        </div>
                        <div className="ml-2">
                          <Skeleton className="h-4 w-4 rounded" />
                        </div>
                      </div>
                    </TableCell>
                    {/* Create other skeleton cells for each column */}
                    {Array.from({ length: columns.length - 1 }).map(
                      (_, colIndex) => (
                        <TableCell
                          key={`loading-cell-${colIndex}`}
                          className="whitespace-nowrap border-r border-gray-200 text-xs text-center"
                        >
                          <Skeleton className="h-4 w-16 mx-auto" />
                        </TableCell>
                      ),
                    )}
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
                    {showInactive ? (
                      <p className="text-gray-500 italic">
                        No Inactive Personnel.
                      </p>
                    ) : (
                      <p className="text-gray-500 italic">
                        No Personnel found. Click Plus to add new Personnel.
                      </p>
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
