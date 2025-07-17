import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { CostCodeSummary } from "./useCostCodeData";
import { Skeleton } from "@/components/ui/skeleton";

export default function CostCodeTable({
  loading,
  costCodeDetails,
  openHandleDelete,
  openHandleEdit,
}: {
  loading: boolean;
  costCodeDetails: CostCodeSummary[];
  openHandleDelete: (id: string) => void;
  openHandleEdit: (id: string) => void;
}) {
  const header = [
    "ID",
    "Name",
    "Created At",
    "Active",
    "Updated At",
    "Actions",
  ];

  return (
    <Table className="w-full">
      <TableHeader>
        <TableRow>
          {header.map((h) => (
            <TableHead
              key={h}
              className="text-sm text-center border-r border-gray-200 bg-gray-100"
            >
              {h}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      {loading ? (
        <TableBody className="divide-y divide-gray-200 bg-white">
          {Array.from({ length: 20 }).map((_, rowIdx) => (
            <TableRow
              key={rowIdx}
              className={rowIdx % 2 === 0 ? "bg-white" : "bg-gray-100"}
            >
              {/* ID */}
              <TableCell className="border-r border-gray-200 text-xs text-center">
                <Skeleton className="h-4 w-2/3 mx-auto" />
              </TableCell>
              {/* Name */}
              <TableCell className="border-r border-gray-200 text-xs text-center">
                <Skeleton className="h-4 w-3/4 mx-auto" />
              </TableCell>
              {/* Created At */}
              <TableCell className="border-r border-gray-200 text-xs text-center">
                <Skeleton className="h-4 w-1/2 mx-auto" />
              </TableCell>
              {/* Active */}
              <TableCell className="border-r border-gray-200 text-xs text-center">
                <Skeleton className="h-4 w-1/2 mx-auto" />
              </TableCell>
              {/* Updated At */}
              <TableCell className="border-r border-gray-200 text-xs text-center">
                <Skeleton className="h-4 w-1/2 mx-auto" />
              </TableCell>
              {/* Actions (Edit/Delete buttons) */}
              <TableCell className="text-xs text-center">
                <div className="flex flex-row items-center justify-center gap-2">
                  <Skeleton className="h-6 w-6 rounded-full" />
                  <Skeleton className="h-6 w-6 rounded-full" />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      ) : (
        <TableBody className="divide-y divide-gray-200 bg-white">
          {costCodeDetails.map((costCode) => (
            <TableRow
              className="odd:bg-white even:bg-gray-100 "
              key={costCode.id}
            >
              <TableCell className=" border-r border-gray-200 text-xs text-center">
                {costCode.id || "-"}
              </TableCell>
              <TableCell className=" border-r border-gray-200 text-xs text-center">
                {costCode.name || "-"}
              </TableCell>

              <TableCell className=" border-r border-gray-200 text-xs text-center">
                {costCode.createdAt
                  ? format(new Date(costCode.createdAt), "MM/dd/yyyy")
                  : "-"}
              </TableCell>
              <TableCell className=" border-r border-gray-200 text-xs text-center">
                {costCode.isActive ? "Active" : "Inactive"}
              </TableCell>

              <TableCell className=" border-r border-gray-200 text-xs text-center">
                {costCode.updatedAt
                  ? format(new Date(costCode.updatedAt), "MM/dd/yyyy")
                  : "-"}
              </TableCell>
              <TableCell className="text-xs text-center">
                <div className="flex flex-row items-center justify-center ">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openHandleEdit(costCode.id)}
                  >
                    <img src="/formEdit.svg" alt="Edit" className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openHandleDelete(costCode.id)}
                  >
                    <img
                      src="/trash-red.svg"
                      alt="Delete"
                      className="w-4 h-4"
                    />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      )}
    </Table>
  );
}
