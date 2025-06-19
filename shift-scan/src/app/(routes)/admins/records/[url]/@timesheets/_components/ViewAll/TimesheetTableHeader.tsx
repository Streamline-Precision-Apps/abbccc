import { TableHead, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

interface TimesheetTableHeaderProps {
  headers: string[];
  loading?: boolean;
}

export function TimesheetTableHeader({
  headers,
  loading,
}: TimesheetTableHeaderProps) {
  return (
    <TableRow>
      {headers.map((header) => (
        <TableHead
          key={header}
          className="px-4 py-3 font-semibold text-gray-700 whitespace-nowrap border-r border-gray-200 last:border-r-0 text-xs"
        >
          {loading ? <Skeleton className="h-5 w-20" /> : header}
        </TableHead>
      ))}
      <TableHead className="px-4 py-3 font-semibold text-gray-700 sticky right-0 bg-gray-50 border-l border-gray-200">
        {loading ? <Skeleton className="h-5 w-16" /> : "Actions"}
      </TableHead>
    </TableRow>
  );
}
