"use client";
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
import { JobsiteSummary } from "./useJobsiteData";
import { Skeleton } from "@/components/ui/skeleton";
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

export default function JobsiteTable({
  loading,
  jobsiteDetails,
  openHandleDelete,
  openHandleEdit,
  openHandleQr,
  showPendingOnly,
}: {
  loading: boolean;
  jobsiteDetails: JobsiteSummary[];
  openHandleDelete: (id: string) => void;
  openHandleEdit: (id: string) => void;
  openHandleQr: (id: string) => void;
  showPendingOnly: boolean;
}) {
  return (
    <>
      <Table className="w-full mb-10">
        <TableHeader>
          <TableRow>
            <TableHead className="text-sm text-center border-r border-gray-200 bg-gray-100">
              Name & Description
            </TableHead>
            <TableHead className="text-sm text-center border-r border-gray-200 bg-gray-100">
              Created
            </TableHead>
            <TableHead className="text-sm text-center border-r border-gray-200 bg-gray-100">
              Active
            </TableHead>

            <TableHead className="text-sm text-center border-r border-gray-200 bg-gray-100">
              Site Address
            </TableHead>
            <TableHead className="text-sm text-center border-r border-gray-200 bg-gray-100">
              Status
            </TableHead>
            <TableHead className="text-sm text-center border-r border-gray-200 bg-gray-100">
              Updated At
            </TableHead>
            <TableHead className="text-sm text-center border-r border-gray-200 bg-gray-100">
              Actions
            </TableHead>
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
                {/* <TableCell className="border-r border-gray-200 text-xs text-center w-[300px]">
                  <Skeleton className="h-4 w-2/3 mx-auto" />
                </TableCell> */}
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
                  <Skeleton className="h-4 w-4 mx-auto" />
                </TableCell>
                {/* Site Address */}
                <TableCell className="border-r border-gray-200 text-xs text-center">
                  <Skeleton className="h-4 w-full mx-auto" />
                </TableCell>

                {/* Approval Status */}
                <TableCell className="border-r border-gray-200 text-xs text-center">
                  <Skeleton className="h-4 w-1/2 mx-auto" />
                </TableCell>
                {/* Updated At */}
                <TableCell className="border-r border-gray-200 text-xs text-center">
                  <Skeleton className="h-4 w-1/2 mx-auto" />
                </TableCell>
                {/* Actions (QR, Edit, Delete buttons) */}
                <TableCell className="text-xs text-center">
                  <div className="flex flex-row items-center justify-center gap-2">
                    <Skeleton className="h-6 w-6 rounded-full" />
                    <Skeleton className="h-6 w-6 rounded-full" />
                    <Skeleton className="h-6 w-6 rounded-full" />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        ) : (
          <TableBody>
            {jobsiteDetails.map((jobsite) => (
              <TableRow
                className="odd:bg-white even:bg-gray-100 "
                key={jobsite.id}
              >
                <TableCell className=" border-r border-gray-200 text-xs text-left">
                  <div className="flex flex-col gap-1 text-left">
                    <p>{jobsite.name || " "}</p>
                    <p className="text-[10px] text-gray-400 italic">
                      {jobsite.description || "No Description"}
                    </p>
                  </div>
                </TableCell>

                <TableCell className=" border-r border-gray-200 text-xs text-center">
                  {jobsite.createdAt
                    ? format(new Date(jobsite.createdAt), "MM/dd/yyyy")
                    : " "}
                </TableCell>
                <TableCell className=" border-r border-gray-200 text-xs text-center">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex justify-center">
                        {jobsite.isActive ? (
                          <SquareCheck className="h-4 w-4 text-green-500" />
                        ) : (
                          <SquareX className="h-4 w-4 text-red-500" />
                        )}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      {jobsite.isActive ? "Active" : "Inactive"}
                    </TooltipContent>
                  </Tooltip>
                </TableCell>
                <TableCell className=" border-r border-gray-200 text-xs text-center">
                  {jobsite.Address &&
                    `${jobsite.Address.street} ${jobsite.Address.city}, ${jobsite.Address.state} ${jobsite.Address.zipCode}`}
                </TableCell>
                <TableCell className="border-r border-gray-200 text-xs text-center min-w-[50px]">
                  <HoverCard>
                    <HoverCardTrigger asChild>
                      {jobsite.approvalStatus === "PENDING" ? (
                        <span className="inline-flex items-center justify-center w-6 h-6 bg-yellow-300 rounded-full cursor-pointer font-semibold">
                          P
                        </span>
                      ) : jobsite.approvalStatus === "DRAFT" ? (
                        <span className="inline-flex items-center justify-center w-6 h-6 bg-sky-200 rounded-full cursor-pointer font-semibold">
                          P
                        </span>
                      ) : jobsite.approvalStatus === "APPROVED" ? (
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
                        {jobsite.approvalStatus === "PENDING"
                          ? "Pending"
                          : jobsite.approvalStatus === "DRAFT"
                            ? "In Progress"
                            : jobsite.approvalStatus === "APPROVED"
                              ? "Approved"
                              : "Rejected"}
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                </TableCell>
                <TableCell className=" border-r border-gray-200 text-xs text-center">
                  {jobsite.updatedAt
                    ? format(new Date(jobsite.updatedAt), "MM/dd/yyyy")
                    : " "}
                </TableCell>
                <TableCell className="text-xs text-center">
                  <div className="flex flex-row items-center justify-center ">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openHandleQr(jobsite.id)}
                        >
                          <img
                            src="/qrCode.svg"
                            alt="Edit"
                            className="w-4 h-4"
                          />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Print QR Code</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openHandleEdit(jobsite.id)}
                        >
                          <img
                            src="/formEdit.svg"
                            alt="Edit"
                            className="w-4 h-4"
                          />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Edit</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openHandleDelete(jobsite.id)}
                        >
                          <img
                            src="/trash-red.svg"
                            alt="Delete"
                            className="w-4 h-4"
                          />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Delete</TooltipContent>
                    </Tooltip>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        )}
      </Table>
      {jobsiteDetails.length === 0 && !loading && (
        <div className="w-full h-full flex justify-center items-center absolute left-0 top-0 z-50  rounded-[10px]">
          {showPendingOnly ? (
            <p className="text-gray-500 italic">No Jobsite to Approve.</p>
          ) : (
            <p className="text-gray-500 italic">No jobsites found.</p>
          )}
        </div>
      )}
    </>
  );
}
