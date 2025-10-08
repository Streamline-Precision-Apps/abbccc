import { ColumnDef } from "@tanstack/react-table";
import { CostCodeSummary } from "../useCostCodeData";
import { format } from "date-fns";
import { highlight } from "../../../_pages/highlight";
import { SquareCheck, SquareX } from "lucide-react";
import Link from "next/link";

// Define the column configuration
export const costCodeTableColumns: ColumnDef<CostCodeSummary>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      return (
        <div className="text-xs text-center">
          {highlight(row.original.name, "")}
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => {
      return (
        <div className="text-xs text-center">
          {format(new Date(row.original.createdAt), "MM/dd/yy")}
        </div>
      );
    },
  },
  {
    accessorKey: "isActive",
    header: "Active",
    cell: ({ row }) => {
      return (
        <div className="flex justify-center">
          {row.original.isActive ? (
            <SquareCheck className="h-4 w-4 text-green-600" />
          ) : (
            <SquareX className="h-4 w-4 text-red-600" />
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "CCTags",
    header: "Tags",
    cell: ({ row }) => {
      const tags = row.original.CCTags || [];
      const filteredTags = tags.filter(
        (tag) => tag.name.toLowerCase() !== "all",
      );

      return (
        <div className="text-xs text-center">
          {filteredTags.length > 0 ? (
            <div className="flex flex-wrap gap-1 justify-center">
              {filteredTags.map((tag, index) => (
                <span
                  key={tag.id}
                  className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs"
                >
                  {tag.name}
                </span>
              ))}
            </div>
          ) : (
            <span className="text-gray-400">-</span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "updatedAt",
    header: "Updated At",
    cell: ({ row }) => {
      return (
        <div className="text-xs text-center">
          {format(new Date(row.original.updatedAt), "MM/dd/yy")}
        </div>
      );
    },
  },
  {
    accessorKey: "timecardCount",
    header: "Linked Timesheets",
    cell: ({ row }) => {
      return (
        <div className="text-xs text-center">
          {row.original._count?.Timesheets > 0 ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href={`/admins/timesheets?costCode=${row.original.code}`}
                  className="cursor-pointer underline decoration-dotted decoration-1 text-sm hover:text-blue-600"
                >
                  {row.original._count?.Timesheets || 0}
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">See All Entries</p>
              </TooltipContent>
            </Tooltip>
          ) : (
            "-"
          )}
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      // This is a placeholder - actual implementation will be in the DataTable component
      return (
        <div className="flex flex-row justify-center items-center">
          {/* Action buttons will be replaced */}
        </div>
      );
    },
  },
];
