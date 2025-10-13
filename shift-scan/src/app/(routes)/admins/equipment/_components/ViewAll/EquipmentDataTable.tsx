"use client";

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
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
import React, {
  Dispatch,
  SetStateAction,
  useMemo,
  useState,
  Suspense,
} from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { EquipmentSummary } from "../useEquipmentData";
import { equipmentTableColumns } from "./equipmentTableColumns";
import LoadingEquipmentTableState from "./loadingEquipmentTableState";

interface EquipmentDataTableProps {
  data: EquipmentSummary[];
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
  showPendingOnly?: boolean;
}

export function EquipmentDataTable({
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
}: EquipmentDataTableProps) {
  // Create column definitions with the action handlers
  const columns = useMemo(() => {
    // Copy the base columns
    const cols = [...equipmentTableColumns];

    // Find and update the actions column
    const actionsColumnIndex = cols.findIndex((col) => col.id === "actions");
    if (actionsColumnIndex >= 0) {
      // Replace with a new definition that includes our handlers
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
                    size={"icon"}
                    onClick={() => onQrClick?.(item.id)}
                  >
                    <img
                      src="/qrCode.svg"
                      alt="QR"
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
              {(() => {
                const totalTimesheetLogs =
                  (item._count?.EmployeeEquipmentLogs || 0) +
                  (item._count?.TascoLogs || 0) +
                  (item._count?.HauledInLogs || 0) +
                  (item._count?.UsedAsTrailer || 0) +
                  (item._count?.UsedAsTruck || 0) +
                  (item._count?.Maintenance || 0);

                return totalTimesheetLogs === 0 ? (
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
                ) : (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        className="opacity-50"
                        variant="ghost"
                        size={"icon"}
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
                );
              })()}
            </div>
          );
        },
      };
    }

    return cols;
  }, [onEditClick, onDeleteClick, onQrClick]);

  // Ensure data is always an array
  const safeData = Array.isArray(data) ? data : [];

  const table = useReactTable({
    data: safeData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: {
      sorting: [
        {
          // Use a column that actually exists in the table
          id: "nameAndDescription",
          desc: false,
        },
      ],
    },
    state: {
      pagination: {
        pageIndex: page - 1, // TanStack Table uses 0-indexed pages
        pageSize,
      },
    },
    meta: {
      searchTerm, // Pass the search term to the table meta
    },
    manualPagination: true, // Tell TanStack Table we're handling pagination manually
    pageCount: totalPages || 1, // Ensure we always have at least 1 page
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
                        className="whitespace-nowrap first:text-left  font-semibold text-gray-700 text-center border-r bg-gray-100 border-gray-200 last:border-r-0 text-xs sticky top-0"
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
              <Suspense
                fallback={<LoadingEquipmentTableState columns={columns} />}
              >
                {loading ? (
                  <LoadingEquipmentTableState columns={columns} />
                ) : table.getRowModel() &&
                  table.getRowModel().rows &&
                  table.getRowModel().rows.length > 0 ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                      className="odd:bg-white even:bg-gray-100 border-r border-gray-200 text-xs text-center py-2"
                    >
                      {row.getVisibleCells &&
                        row.getVisibleCells().map((cell) => (
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
                      {showPendingOnly
                        ? "No pending equipment found"
                        : "No equipment found"}
                    </TableCell>
                  </TableRow>
                )}
              </Suspense>
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
