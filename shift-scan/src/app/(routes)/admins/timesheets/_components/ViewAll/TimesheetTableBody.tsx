import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";

interface Timesheet {
  id: string;
  date: Date | string;
  User: { id: string; firstName: string; lastName: string };
  Jobsite: { id: string; name: string };
  CostCode: { id: string; name: string };
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
}

export function TimesheetTableBody({
  timesheets,
  onDeleteClick,
  deletingId,
  onEditClick,
  editingId,
  showPendingOnly,
}: TimesheetTableBodyProps) {
  if (timesheets.length === 0) {
    return (
      <TableBody>
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
          className="border-r border-gray-200 text-xs text-center"
          key={timesheet.id}
        >
          <TableCell className="border-r border-gray-200 text-xs text-center">
            {timesheet.id}
          </TableCell>
          <TableCell className="border-r border-gray-200 text-xs text-center">
            {format(timesheet.date, "MM/dd/yyyy")}
          </TableCell>
          <TableCell className="border-r border-gray-200 text-xs text-center">
            {timesheet.User.firstName} {timesheet.User.lastName}
          </TableCell>
          <TableCell className="border-r border-gray-200 text-xs text-center">
            {timesheet.Jobsite?.name}
          </TableCell>
          <TableCell className="border-r border-gray-200 text-xs text-center">
            {timesheet.CostCode?.name}
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

          <TableCell className="border-r border-gray-200 text-xs text-center">
            {timesheet.status === "PENDING" ? (
              <span className=" bg-yellow-300 px-3 py-1 rounded-xl ">
                Pending
              </span>
            ) : timesheet.status === "DRAFT" ? (
              <span className=" bg-sky-200 px-3 py-1 rounded-xl ">
                In Progress
              </span>
            ) : timesheet.status === "APPROVED" ? (
              <span className=" bg-green-300 px-3 py-1 rounded-xl">
                Approved
              </span>
            ) : (
              <span className="bg-red-300 px-3 py-1 rounded-xl ">Rejected</span>
            )}
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
            {format(timesheet.createdAt, "MM/dd/yyyy")}
          </TableCell>
          <TableCell className="border-r border-gray-200 text-xs text-center">
            {format(timesheet.updatedAt, "MM/dd/yyyy")}
          </TableCell>
          <TableCell className=" sticky right-0 border-r border-gray-200 text-xs text-center">
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
            <Button
              size={"icon"}
              variant={"link"}
              className={`border-none w-fit h-full justify-center ${
                deletingId === timesheet.id ? "animate-pulse" : ""
              }`}
              onClick={() => onDeleteClick && onDeleteClick(timesheet.id)}
              aria-label="Delete Timesheet"
            >
              <img src="/trash-red.svg" alt="Delete Form" className="h-4 w-4" />
            </Button>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  );
}
