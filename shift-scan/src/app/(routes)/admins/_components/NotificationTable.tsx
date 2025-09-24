"use client";
import React, { useMemo } from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Notification } from "../../../../../prisma/generated/prisma/client";
import { notificationTableColumns } from "./notificationTableColumns";

interface NotificationTableProps {
  data: Notification[];
  totalCount: number;
  loading?: boolean;
}

export function NotificationTable({
  data,
  totalCount,
  loading,
}: NotificationTableProps) {
  const columns = useMemo(() => notificationTableColumns, []);
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="h-full w-full bg-white rounded-lg shadow-md">
      <div className="p-3  flex flex-col border-b border-gray-200">
        <div className="flex justify-center items-center">
          <h2 className="text-md">Needs Attention</h2>
        </div>
      </div>
      <div className="rounded-lg w-full h-full flex flex-col flex-1">
        <Table className="w-full h-full rounded-lg">
          <TableHeader className="sticky top-0 z-10 bg-gray-100 rounded-lg">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="bg-muted rounded-lg">
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="whitespace-nowrap font-semibold  text-gray-700 text-center border-r bg-gray-100 border-gray-200 last:border-r-0 text-xs sticky top-0 first:rounded-tl-lg last:rounded-tr-lg"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="h-full divide-y divide-gray-200 bg-white rounded-b-lg">
            {loading ? (
              Array.from({ length: 8 }).map((_, idx) => (
                <TableRow
                  key={`loading-row-${idx}`}
                  className="first:rounded-bl-lg last:rounded-br-lg"
                >
                  {columns.map((col, colIdx) => (
                    <TableCell
                      key={colIdx}
                      className="first:rounded-bl-lg last:rounded-br-lg"
                    >
                      <div className="h-4 w-3/4 bg-gray-200 first:rounded-bl-lg last:rounded-br-lg animate-pulse " />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="first:rounded-bl-lg last:rounded-br-lg"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="px-3 py-2 first:rounded-bl-lg last:rounded-br-lg text-center "
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
              <TableRow className="h-full first:rounded-bl-lg last:rounded-br-lg">
                <TableCell
                  colSpan={columns.length}
                  className="text-center h-full align-middle py-24 first:rounded-bl-lg last:rounded-br-lg "
                >
                  <div className="flex flex-col items-center justify-center h-full w-full ">
                    <span className="text-gray-400 text-lg">
                      No notifications found.
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
