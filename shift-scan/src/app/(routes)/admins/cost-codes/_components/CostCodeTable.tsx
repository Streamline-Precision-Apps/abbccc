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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { highlight } from "../../_pages/higlight";
import { SquareCheck, SquareX } from "lucide-react";

export default function CostCodeTable({
  loading,
  costCodeDetails,
  openHandleDelete,
  openHandleEdit,
  inputValue,
}: {
  loading: boolean;
  costCodeDetails: CostCodeSummary[];
  openHandleDelete: (id: string) => void;
  openHandleEdit: (id: string) => void;
  inputValue: string;
}) {
  const header = ["Name", "Created At", "Active", "Updated At", "Actions"];

  return (
    <>
      <Table className="w-full">
        <TableHeader>
          <TableRow>
            {header.map((h) => (
              <TableHead
                key={h}
                className="text-sm text-center border-r border-gray-200 bg-gray-100 sticky top-0 z-10"
              >
                {h}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        {loading ? (
          <TableBody className="divide-y divide-gray-200 bg-white">
            {Array.from({ length: 10 }).map((_, rowIdx) => (
              <TableRow
                key={rowIdx}
                className={rowIdx % 2 === 0 ? "bg-white" : "bg-gray-100"}
              >
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
                  <Skeleton className="h-5 w-5 mx-auto rounded" />
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
                  {highlight(costCode.name, inputValue) || "-"}
                </TableCell>

                <TableCell className=" border-r border-gray-200 text-xs text-center">
                  {costCode.createdAt
                    ? format(new Date(costCode.createdAt), "MM/dd/yyyy")
                    : "-"}
                </TableCell>
                <TableCell className="border-r border-gray-200 text-xs text-center">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex justify-center">
                        {costCode.isActive ? (
                          <SquareCheck className="h-4 w-4 text-green-500" />
                        ) : (
                          <SquareX className="h-4 w-4 text-red-500" />
                        )}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      {costCode.isActive ? "Active" : "Inactive"}
                    </TooltipContent>
                  </Tooltip>
                </TableCell>

                <TableCell className=" border-r border-gray-200 text-xs text-center">
                  {costCode.updatedAt
                    ? format(new Date(costCode.updatedAt), "MM/dd/yyyy")
                    : "-"}
                </TableCell>
                <TableCell className="text-xs text-center">
                  <div className="flex flex-row items-center justify-center ">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openHandleEdit(costCode.id)}
                        >
                          <img
                            src="/formEdit.svg"
                            alt="Edit"
                            className="w-4 h-4"
                          />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Edit</p>
                      </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
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
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Delete</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        )}
      </Table>
      {/* Show message when no cost codes are except the default "All" tag */}
      {costCodeDetails.length === 0 && !loading && (
        <div className="w-full h-full flex justify-center items-center absolute left-0 top-0 z-50  rounded-[10px]">
          <p className="text-gray-500 italic">No cost codes created or found</p>
        </div>
      )}
    </>
  );
}
