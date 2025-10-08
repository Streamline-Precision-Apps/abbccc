import { ColumnDef } from "@tanstack/react-table";
import { TagSummary } from "../useTagData";
import { highlight } from "../../../_pages/higlight";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

// Define the column configuration
export const tagTableColumns: ColumnDef<TagSummary>[] = [
  {
    accessorKey: "nameAndDescription",
    header: "Tag Summary",
    cell: ({ row }) => {
      const isAllTag = row.original.name.toUpperCase() === "ALL";
      return (
        <div className="text-sm text-left">
          <div className="w-full h-full flex flex-col">
            {isAllTag ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <p className="text-blue-600 font-semibold">
                    {highlight(row.original.name, "")}
                  </p>
                </TooltipTrigger>
                <TooltipContent>
                  <p>System reserved tag - cannot be modified</p>
                </TooltipContent>
              </Tooltip>
            ) : (
              <p className="">{highlight(row.original.name, "")}</p>
            )}
            <p className="text-[10px] text-gray-400 italic">
              {row.original.description || "No description provided."}
            </p>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "CostCodes",
    header: "Cost Codes",
    cell: ({ row }) => {
      const costCodes = row.original.CostCodes || [];
      return (
        <div className="text-sm text-center">
          {costCodes.length > 0 ? (
            <HoverCard>
              <HoverCardTrigger asChild>
                <span className="cursor-pointer text-blue-600 underline-offset-2 decoration-solid underline">
                  {costCodes.length}
                </span>
              </HoverCardTrigger>
              <HoverCardContent className="p-4 min-w-[500px] max-w-[720px] w-[720px]">
                <div className="space-y-2">
                  <p className="font-bold text-sm text-gray-700 mb-3">
                    Associated Cost Codes
                  </p>
                  {costCodes.length > 0 ? (
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      {costCodes.map((costCode) => (
                        <span
                          key={costCode.id}
                          className={`inline-block px-4 py-1 rounded-full text-xs whitespace-nowrap text-center ${
                            costCode.isActive
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {costCode.name}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <div className="text-gray-400 italic text-xs">
                      No cost codes associated with this tag.
                    </div>
                  )}
                </div>
              </HoverCardContent>
            </HoverCard>
          ) : (
            <span className="text-gray-400">0</span>
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
