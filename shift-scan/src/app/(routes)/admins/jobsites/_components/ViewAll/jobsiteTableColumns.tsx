"use client";

import { ColumnDef } from "@tanstack/react-table";
import { JobsiteSummary } from "../useJobsiteData";
import { format } from "date-fns";
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
import { SquareCheck, SquareX } from "lucide-react";
import { highlight } from "@/app/(routes)/admins/_pages/higlight";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// Define the column configuration as a function that takes router
export const getJobsiteTableColumns = (
  router: ReturnType<typeof import("next/navigation").useRouter>,
): ColumnDef<JobsiteSummary>[] => [
  {
    accessorKey: "name",
    header: "Name & Description",
    cell: ({ row }) => {
      return (
        <div className="flex flex-col gap-1 text-left">
          <p>{highlight(row.original.name || "", "")}</p>
          <p className="text-[10px] text-gray-400 italic">
            {row.original.description || "No Description"}
          </p>
        </div>
      );
    },
  },

  {
    accessorKey: "Address",
    header: "Site Address",
    cell: ({ row }) => {
      return (
        <div className="text-xs text-center">
          {row.original.Address &&
            `${row.original.Address.street} ${row.original.Address.city}, ${row.original.Address.state} ${row.original.Address.zipCode}`}
        </div>
      );
    },
  },
  {
    accessorKey: "approvalStatus",
    header: "Status",
    cell: ({ row }) => {
      return (
        <div className="text-xs text-center min-w-[50px]">
          <HoverCard>
            <HoverCardTrigger asChild>
              {row.original.approvalStatus === "PENDING" ? (
                <span className="inline-flex items-center justify-center w-6 h-6 bg-yellow-300 rounded-full cursor-pointer font-semibold">
                  P
                </span>
              ) : row.original.approvalStatus === "DRAFT" ? (
                <span className="inline-flex items-center justify-center w-6 h-6 bg-sky-200 rounded-full cursor-pointer font-semibold">
                  P
                </span>
              ) : row.original.approvalStatus === "APPROVED" ? (
                <span className="inline-flex items-center justify-center w-6 h-6 bg-green-300 rounded-full cursor-pointer font-semibold">
                  A
                </span>
              ) : (
                <span className="inline-flex items-center justify-center w-6 h-6 bg-red-300 rounded-full cursor-pointer font-semibold">
                  R
                </span>
              )}
            </HoverCardTrigger>
            <HoverCardContent
              side="right"
              align="center"
              className="w-[120px] justify-center"
            >
              <div className="text-xs text-center">
                {row.original.approvalStatus === "PENDING"
                  ? "Pending"
                  : row.original.approvalStatus === "DRAFT"
                    ? "In Progress"
                    : row.original.approvalStatus === "APPROVED"
                      ? "Approved"
                      : "Rejected"}
              </div>
            </HoverCardContent>
          </HoverCard>
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
          {row.original._count?.TimeSheets > 0 ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href={`/admins/timesheets?jobsiteId=${row.original.code}`}
                  className="cursor-pointer underline decoration-dotted decoration-1 text-sm hover:text-blue-600"
                >
                  {row.original._count?.TimeSheets || 0}
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
    accessorKey: "isActive",
    header: "Active",
    cell: ({ row }) => {
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex justify-center">
              {row.original.isActive ? (
                <SquareCheck className="h-4 w-4 text-green-500" />
              ) : (
                <SquareX className="h-4 w-4 text-red-500" />
              )}
            </div>
          </TooltipTrigger>
          <TooltipContent>
            {row.original.isActive ? "Active" : "Inactive"}
          </TooltipContent>
        </Tooltip>
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
