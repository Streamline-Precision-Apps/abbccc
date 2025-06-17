import { Table, TableHeader } from "@/components/ui/table";
import { TimesheetTableHeader } from "./TimesheetTableHeader";
import { TimesheetTableBody } from "./TimesheetTableBody";
import { TimesheetTableSkeleton } from "./TimesheetTableSkeleton";
import { TimesheetFooter } from "./TimesheetFooter";
import { TimeSheetStatus, WorkType } from "@/lib/enums";

export type Timesheet = {
  id: string;
  date: Date | string;
  User: {
    id: string;
    firstName: string;
    lastName: string;
  };
  Jobsite: {
    id: string;
    name: string;
  };
  CostCode: {
    id: string;
    name: string;
  };
  nu: string;
  Fp: string;
  startTime: Date | string;
  endTime: Date | string;
  comment: string;
  status: TimeSheetStatus;
  workType: WorkType;
  createdAt: Date | string;
  updatedAt: Date | string;
};

export default function ViewAllTimesheets({
  timesheets,
  loading,
  page,
  totalPages,
  total,
  pageSize,
  pageSizeOptions,
  onPageSizeChange,
  onPageChange,
}: {
  timesheets: Timesheet[];
  loading: boolean;
  page: number;
  totalPages: number;
  total: number;
  pageSize: number;
  pageSizeOptions: number[];
  onPageSizeChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onPageChange: (page: number) => void;
}) {
  const timesheetHeaders = [
    "ID",
    "Date",
    "Employee Name",
    "Profit Id",
    "Cost Code",
    "Start Time",
    "End Time",
    "Comment",
    "Status",
    "Created At",
    "Last modified",
  ];

  if (loading) {
    return (
      <div className="h-full w-full grid grid-rows-[1fr_60px] rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto overflow-y-auto">
          <Table className="min-w-max w-full text-sm text-left">
            <TableHeader className="sticky top-0 z-10 bg-gray-50 border-b-2 border-gray-300">
              <TimesheetTableHeader headers={timesheetHeaders} loading />
            </TableHeader>
            <TimesheetTableSkeleton
              headers={timesheetHeaders}
              pageSize={pageSize}
            />
          </Table>
        </div>
        <TimesheetFooter
          page={page}
          totalPages={totalPages}
          total={total}
          pageSize={pageSize}
          pageSizeOptions={pageSizeOptions}
          onPageSizeChange={onPageSizeChange}
          onPageChange={onPageChange}
          timesheetsLength={pageSize}
        />
      </div>
    );
  }

  return (
    <div className="h-full w-full bg-gray-200 grid grid-rows-[1fr_60px] rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      <Table className="min-w-max text-sm text-left overflow-x-auto">
        <TableHeader className="sticky top-0 z-10 bg-gray-50 border-b-2 border-gray-300">
          <TimesheetTableHeader headers={timesheetHeaders} />
        </TableHeader>
        <TimesheetTableBody timesheets={timesheets} />
      </Table>
      <TimesheetFooter
        page={page}
        totalPages={totalPages}
        total={total}
        pageSize={pageSize}
        pageSizeOptions={pageSizeOptions}
        onPageSizeChange={onPageSizeChange}
        onPageChange={onPageChange}
        timesheetsLength={timesheets.length}
      />
    </div>
  );
}
