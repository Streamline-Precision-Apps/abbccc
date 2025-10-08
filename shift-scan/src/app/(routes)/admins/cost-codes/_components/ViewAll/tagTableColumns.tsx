import { ColumnDef } from "@tanstack/react-table";
import { TagSummary } from "../useTagData";
import { highlight } from "../../../_pages/highlight";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Define the column configuration
export const tagTableColumns: ColumnDef<TagSummary>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => {
      return (
        <div className="text-xs text-center">
          {highlight(row.original.id, "")}
        </div>
      );
    },
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      const isAllTag = row.original.name.toUpperCase() === "ALL";
      return (
        <div
          className={`text-xs text-center ${isAllTag ? "font-semibold" : ""}`}
        >
          {isAllTag ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="text-blue-600">
                  {highlight(row.original.name, "")}
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <p>System reserved tag - cannot be modified</p>
              </TooltipContent>
            </Tooltip>
          ) : (
            highlight(row.original.name, "")
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => {
      return (
        <div className="text-xs text-center">
          {highlight(row.original.description, "")}
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
