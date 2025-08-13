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
          className="font-semibold text-gray-700  text-center  border-r bg-gray-100 border-gray-200 last:border-r-0 text-xs"
        >
          {loading ? <Skeleton className="h-5 w-20" /> : header}
        </TableHead>
      ))}
      <TableHead className="font-semibold text-gray-700 sticky right-0 text-center  bg-gray-100 border-l border-gray-200">
        {loading ? <Skeleton className="h-5 w-16" /> : "Actions"}
      </TableHead>
    </TableRow>
  );
}
