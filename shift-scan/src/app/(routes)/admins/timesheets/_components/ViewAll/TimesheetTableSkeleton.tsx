import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

interface TimesheetTableSkeletonProps {
  headers: string[];
  pageSize: number;
}

export function TimesheetTableSkeleton({
  headers,
  pageSize,
}: TimesheetTableSkeletonProps) {
  return (
    <TableBody className="divide-y divide-gray-200 bg-white">
      {Array.from({ length: 10 }).map((_, rowIdx) => (
        <TableRow
          key={rowIdx}
          className={rowIdx % 2 === 0 ? "bg-white" : "bg-gray-100"}
        >
          {headers.map((_, colIdx) => (
            <TableCell
              key={colIdx}
              className="px-4 py-2 border-r border-gray-100"
            >
              <Skeleton className="h-4 w-3/4 mx-auto" />
            </TableCell>
          ))}
          <TableCell className="p-4 py-2 sticky right-0 bg-white border-l border-gray-200">
            <div className="flex gap-2 justify-center">
              <Skeleton className="h-6 w-6 rounded-full" />
              <Skeleton className="h-6 w-6 rounded-full" />
            </div>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  );
}
