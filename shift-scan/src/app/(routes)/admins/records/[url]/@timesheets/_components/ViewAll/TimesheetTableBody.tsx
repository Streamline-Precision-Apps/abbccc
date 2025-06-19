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
  endTime: Date | string;
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
}

export function TimesheetTableBody({
  timesheets,
  onDeleteClick,
  deletingId,
}: TimesheetTableBodyProps) {
  if (timesheets.length === 0) {
    return (
      <TableBody>
        <TableRow>
          <TableCell colSpan={14} className="text-center py-4 text-gray-400">
            No timesheets found.
          </TableCell>
        </TableRow>
      </TableBody>
    );
  }
  return (
    <TableBody className="divide-y divide-gray-200 bg-white">
      {timesheets.map((timesheet) => (
        <TableRow
          className="hover:bg-gray-50 transition-colors text-xs"
          key={timesheet.id}
        >
          <TableCell className="px-4 py-2 border-r border-gray-100 ">
            {timesheet.id}
          </TableCell>
          <TableCell className="px-4 py-2 border-r border-gray-100">
            {format(timesheet.date, "MM/dd/yyyy")}
          </TableCell>
          <TableCell className="px-4 py-2 border-r border-gray-100">
            {timesheet.User.firstName} {timesheet.User.lastName}
          </TableCell>
          <TableCell className="px-4 py-2 border-r border-gray-100">
            {timesheet.Jobsite?.name}
          </TableCell>
          <TableCell className="px-4 py-2 border-r border-gray-100">
            {timesheet.CostCode?.name}
          </TableCell>
          <TableCell className="px-4 py-2 border-r border-gray-100">
            {format(timesheet.startTime, "hh:mm a")}
          </TableCell>
          <TableCell className="px-4 py-2 border-r border-gray-100">
            {format(timesheet.endTime, "hh:mm a")}
          </TableCell>
          <TableCell className="px-4 py-2 border-r border-gray-100">
            {timesheet.comment}
          </TableCell>
          <TableCell className="px-4 py-2 border-r border-gray-100">
            {timesheet.status}
          </TableCell>
          <TableCell className="px-4 py-2 border-r border-gray-100">
            {timesheet.workType}
          </TableCell>
          <TableCell className="px-4 py-2 border-r border-gray-100">
            {format(timesheet.createdAt, "MM/dd/yyyy")}
          </TableCell>
          <TableCell className="px-4 py-2 border-r border-gray-100">
            {format(timesheet.updatedAt, "MM/dd/yyyy")}
          </TableCell>
          <TableCell className="p-4 py-2 sticky right-0 bg-white border-l border-gray-200">
            <Button
              variant={"link"}
              size={"icon"}
              className="border-none w-fit h-full"
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
