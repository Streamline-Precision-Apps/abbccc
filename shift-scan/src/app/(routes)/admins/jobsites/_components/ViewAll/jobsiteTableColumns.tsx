"use client";

import { ColumnDef } from "@tanstack/react-table";
import { JobsiteSummary } from "../useJobsiteData";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { highlight } from "@/app/(routes)/admins/_pages/highlight";
import Link from "next/link";
import { format } from "date-fns";

// Define the column configuration as a function that takes router
export const getJobsiteTableColumns = (
  router: ReturnType<typeof import("next/navigation").useRouter>,
): ColumnDef<JobsiteSummary>[] => [
  {
    accessorKey: "nameAndDescription",
    header: "Jobsite Summary",
    cell: ({ row }) => {
      const jobsite = row.original;
      return (
        <div className="w-full flex flex-row gap-4 items-center">
          <div className="text-sm flex-1">
            <div className="w-full h-full flex flex-col">
              <div className="flex flex-row gap-4 items-center">
                <p className="">{highlight(jobsite.name || "", "")}</p>
                <div className="flex flex-row gap-2 items-center">
                  {jobsite.status === "ACTIVE" ? (
                    <span className="bg-green-100 text-green-600 px-2 py-1 rounded-lg text-xs">
                      Active
                    </span>
                  ) : jobsite.status === "DRAFT" ? (
                    <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded-lg text-xs">
                      Draft
                    </span>
                  ) : (
                    <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded-lg text-xs">
                      Inactive
                    </span>
                  )}
                  {jobsite.approvalStatus === "APPROVED" ? (
                    <span className="bg-green-100 text-green-600 px-2 py-1 rounded-lg text-xs">
                      Approved
                    </span>
                  ) : jobsite.approvalStatus === "PENDING" ? (
                    <span className="bg-yellow-100 text-yellow-600 px-2 py-1 rounded-lg text-xs">
                      Pending
                    </span>
                  ) : jobsite.approvalStatus === "DRAFT" ? (
                    <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded-lg text-xs">
                      Draft
                    </span>
                  ) : (
                    <span className="bg-red-100 text-red-600 px-2 py-1 rounded-lg text-xs">
                      Rejected
                    </span>
                  )}
                  <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-lg text-xs">
                    Updated: {format(new Date(jobsite.updatedAt), "MM/dd/yy")}
                  </span>
                </div>
              </div>
              <p className="truncate max-w-[750px] text-[10px] text-left text-gray-400 italic">
                {jobsite.description || "No description provided."}
              </p>
            </div>
          </div>
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
