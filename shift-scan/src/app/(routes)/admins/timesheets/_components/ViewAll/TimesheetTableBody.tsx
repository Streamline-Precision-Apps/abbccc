import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { Check, X } from "lucide-react";
import { highlight } from "../../../_pages/higlight";

interface Timesheet {
  id: string;
  date: Date | string;
  User: { id: string; firstName: string; lastName: string };
  Jobsite: { id: string; name: string; code: string };
  CostCode: { id: string; name: string; code: string };
  nu: string;
  Fp: string;
  startTime: Date | string;
  endTime: Date | string | null;
  comment: string;
  status: string;
  workType: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}
interface TimesheetTableBodyProps {
  timesheets: Timesheet[];
  onDeleteClick?: (id: string) => void;
  deletingId?: string | null;
  onEditClick?: (id: string) => void;
  editingId?: string | null;
  showPendingOnly: boolean;
  onApprovalAction?: (id: string, action: "APPROVED" | "REJECTED") => void;
  statusLoading?: Record<string, "APPROVED" | "REJECTED" | undefined>;
  searchTerm: string;
}

export function TimesheetTableBody({
  timesheets,
  onDeleteClick,
  deletingId,
  onEditClick,
  editingId,
  showPendingOnly,
  onApprovalAction,
  statusLoading = {},
  searchTerm,
}: TimesheetTableBodyProps) {
  if (timesheets.length === 0) {
    return (
      <TableBody className="divide-y divide-gray-200 bg-white">
        <TableRow>
          <TableCell
            colSpan={14}
            className="border-r border-gray-200 text-xs text-center"
          >
            {showPendingOnly ? (
              <div className=" justify-center flex flex-wrap ">
                <p className="text-sm ">
                  No Current Pending Timesheets requiring action.
                </p>
              </div>
            ) : (
              "No timesheets found."
            )}
          </TableCell>
        </TableRow>
      </TableBody>
    );
  }
  return (
    <TableBody className="divide-y divide-gray-200 bg-white">
      {timesheets.map((timesheet) => (
        <TableRow
          className="odd:bg-white even:bg-gray-100 border-r border-gray-200 text-xs text-center py-2"
          key={timesheet.id}
        >
          <TableCell className="border-r border-gray-200 text-xs text-center">
            {highlight(timesheet.id, searchTerm)}
          </TableCell>
          <TableCell className="border-r border-gray-200 text-xs text-center">
            {format(timesheet.date, "MM/dd/yy")}
          </TableCell>
          <TableCell className="border-r border-gray-200 text-xs text-center">
            {timesheet.workType === "TRUCK_DRIVER" ? (
              <span>Trucking</span>
            ) : timesheet.workType === "TASCO" ? (
              <span>Tasco</span>
            ) : timesheet.workType === "LABOR" ? (
              <span>General</span>
            ) : timesheet.workType === "MECHANIC" ? (
              <span>Mechanic</span>
            ) : null}
          </TableCell>
          <TableCell className="border-r border-gray-200 text-xs text-center">
            {highlight(
              `${timesheet.User.firstName} ${timesheet.User.lastName}`,
              searchTerm,
            )}
          </TableCell>
          <TableCell className="border-r border-gray-200 text-xs text-center">
            {timesheet.Jobsite ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="cursor-pointer text-blue-600 underline underline-offset-2 decoration-solid">
                    {highlight(timesheet.Jobsite.code, searchTerm)}
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="text-xs font-semibold">
                    {timesheet.Jobsite.name.split("-").slice(1).join(" ")}
                  </div>
                </TooltipContent>
              </Tooltip>
            ) : null}
          </TableCell>
          <TableCell className="border-r border-gray-200 text-xs text-center">
            {timesheet.CostCode ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="cursor-pointer text-blue-600 underline underline-offset-2 decoration-solid">
                    {highlight(timesheet.CostCode.code, searchTerm)}
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="text-xs font-semibold">
                    {timesheet.CostCode.name.split(" ").slice(1).join(" ")}
                  </div>
                </TooltipContent>
              </Tooltip>
            ) : null}
          </TableCell>
          <TableCell className="border-r border-gray-200 text-xs text-center">
            {format(timesheet.startTime, "hh:mm a")}
          </TableCell>
          <TableCell className="border-r border-gray-200 text-xs text-center">
            {timesheet.endTime ? format(timesheet.endTime, "hh:mm a") : ""}
          </TableCell>
          <TableCell className="border-r border-gray-200 text-xs text-center">
            {timesheet.comment}
          </TableCell>

          <TableCell className="border-r border-gray-200 text-xs text-center min-w-[50px]">
            <Tooltip>
              <TooltipTrigger asChild>
                {timesheet.status === "PENDING" ? (
                  <span className="inline-flex items-center justify-center w-6 h-6 bg-yellow-300 rounded-full cursor-pointer font-semibold">
                    P
                  </span>
                ) : timesheet.status === "DRAFT" ? (
                  <span className="inline-flex items-center justify-center w-6 h-6 bg-sky-200 rounded-full cursor-pointer font-semibold">
                    P
                  </span>
                ) : timesheet.status === "APPROVED" ? (
                  <span className="inline-flex items-center justify-center w-6 h-6 bg-green-300 rounded-full cursor-pointer font-semibold">
                    A
                  </span>
                ) : (
                  <span className="inline-flex items-center justify-center w-6 h-6 bg-red-300 rounded-full cursor-pointer font-semibold">
                    R
                  </span>
                )}
              </TooltipTrigger>
              <TooltipContent
                side="top"
                align="center"
                className="w-[120px] justify-center"
              >
                <div className="text-xs text-center">
                  {timesheet.status === "PENDING"
                    ? "Pending"
                    : timesheet.status === "DRAFT"
                      ? "In Progress"
                      : timesheet.status === "APPROVED"
                        ? "Approved"
                        : "Rejected"}
                </div>
              </TooltipContent>
            </Tooltip>
          </TableCell>
          <TableCell className="border-r border-gray-200 text-xs text-center">
            {format(timesheet.updatedAt, "MM/dd/yy")}
          </TableCell>
          <TableCell className=" sticky right-0 border-r border-gray-200 text-xs text-center">
            <div className="flex flex-row justify-center items-center">
              {showPendingOnly && (
                <>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size={"icon"}
                        variant={"link"}
                        className={`border-none w-fit h-full justify-center ${
                          statusLoading[timesheet.id] === "APPROVED"
                            ? "animate-pulse"
                            : ""
                        }`}
                        onClick={() =>
                          !statusLoading[timesheet.id] &&
                          onApprovalAction &&
                          onApprovalAction(timesheet.id, "APPROVED")
                        }
                        aria-label="Approve Timesheet"
                        disabled={statusLoading[timesheet.id] === "APPROVED"}
                      >
                        {statusLoading[timesheet.id] === "APPROVED" ? (
                          <span className="h-3 w-3 mr-4 flex items-center justify-center">
                            <svg
                              className="animate-spin h-4 w-4 text-green-600"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8v8z"
                              ></path>
                            </svg>
                          </span>
                        ) : (
                          <Check className="h-3 w-3 mr-4" color="green" />
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top">Approve</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size={"icon"}
                        variant={"link"}
                        className={`border-none w-fit h-full justify-center ${
                          statusLoading[timesheet.id] === "REJECTED"
                            ? "animate-pulse"
                            : ""
                        }`}
                        onClick={() =>
                          !statusLoading[timesheet.id] &&
                          onApprovalAction &&
                          onApprovalAction(timesheet.id, "REJECTED")
                        }
                        aria-label="Deny Timesheet"
                        disabled={statusLoading[timesheet.id] === "REJECTED"}
                      >
                        {statusLoading[timesheet.id] === "REJECTED" ? (
                          <span className="h-3 w-3 mr-4 flex items-center justify-center">
                            <svg
                              className="animate-spin h-4 w-4 text-red-600"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8v8z"
                              ></path>
                            </svg>
                          </span>
                        ) : (
                          <X className="h-3 w-3 mr-4" color="red" />
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top">Deny</TooltipContent>
                  </Tooltip>
                </>
              )}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={"link"}
                    size={"icon"}
                    className={`border-none w-fit h-full ${
                      editingId === timesheet.id ? "animate-pulse" : ""
                    }`}
                    onClick={() => onEditClick && onEditClick(timesheet.id)}
                    aria-label="Edit Timesheet"
                  >
                    <img
                      src="/formEdit.svg"
                      alt="Edit Form"
                      className="h-4 w-4 mr-4"
                    />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">Edit</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size={"icon"}
                    variant={"link"}
                    className={`border-none w-fit h-full justify-center ${
                      deletingId === timesheet.id ? "animate-pulse" : ""
                    }`}
                    onClick={() => onDeleteClick && onDeleteClick(timesheet.id)}
                    aria-label="Delete Timesheet"
                  >
                    <img
                      src="/trash-red.svg"
                      alt="Delete Form"
                      className="h-4 w-4 "
                    />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">Delete</TooltipContent>
              </Tooltip>
            </div>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  );
}
