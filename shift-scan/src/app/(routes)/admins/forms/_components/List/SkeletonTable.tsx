import React from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Renders a skeleton loading state for the forms table
 */
const SkeletonTable: React.FC = () => {
  return (
    <Table className="w-full">
      <TableHeader className="sticky top-0 z-10 bg-gray-50 border-b-2 border-gray-300">
        <TableRow className="h-10">
          <TableHead className="rounded-tl-lg font-semibold text-gray-700 text-center border-r bg-gray-100 border-gray-200 text-xs w-1/5">
            <Skeleton className="h-4 w-3/4" />
          </TableHead>
          <TableHead className="rounded-tl-lg font-semibold text-gray-700 text-center border-r bg-gray-100 border-gray-200 text-xs w-1/6">
            <Skeleton className="h-4 w-2/3 mx-auto" />
          </TableHead>
          <TableHead className="rounded-tl-lg font-semibold text-gray-700 text-center border-r bg-gray-100 border-gray-200 text-xs w-1/12">
            <Skeleton className="h-4 w-1/2 mx-auto" />
          </TableHead>
          <TableHead className="rounded-tl-lg font-semibold text-gray-700 text-center border-r bg-gray-100 border-gray-200 text-xs w-1/12">
            <Skeleton className="h-4 w-2/3 mx-auto" />
          </TableHead>
          <TableHead className="rounded-tl-lg font-semibold text-gray-700 text-center border-r bg-gray-100 border-gray-200 text-xs w-1/6">
            <Skeleton className="h-4 w-2/3 mx-auto" />
          </TableHead>
          <TableHead className="rounded-tl-lg font-semibold text-gray-700 text-center border-r bg-gray-100 border-gray-200 text-xs w-1/6">
            <Skeleton className="h-4 w-2/3 mx-auto" />
          </TableHead>
          <TableHead className="w-[160px] text-right pr-6 rounded-tr-lg text-xs">
            <Skeleton className="h-4 w-1/2 ml-auto" />
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="divide-y divide-gray-200 bg-white">
        {[...Array(10)].map((_, i) => (
          <TableRow
            key={i}
            className="odd:bg-white even:bg-gray-100 border-r border-gray-200 text-xs text-center py-2"
          >
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
  );
};

export default SkeletonTable;
