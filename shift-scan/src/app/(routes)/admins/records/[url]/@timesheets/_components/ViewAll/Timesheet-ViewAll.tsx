import { Table, TableHeader } from "@/components/ui/table";
import { TimesheetTableHeader } from "./TimesheetTableHeader";
import { TimesheetTableBody } from "./TimesheetTableBody";
import { TimesheetTableSkeleton } from "./TimesheetTableSkeleton";
import { TimesheetFooter } from "./TimesheetFooter";
import { TimeSheetStatus, WorkType } from "@/lib/enums";
import { HorizontalScrollArea } from "@/components/ui/HorizontalScrollArea";

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
  onDeleteClick,
  deletingId,
  isDeleting,
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
  onDeleteClick?: (id: string) => void;
  deletingId?: string | null;
  isDeleting?: boolean;
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
    "Work Type",
    "Created At",
    "Last modified",
  ];

  if (loading) {
    return (
      <div className="h-full w-full flex flex-col grid-rows-[1fr_50px] rounded-lg border border-gray-200 shadow-sm bg-white">
        <HorizontalScrollArea className="h-[200px] w-[350px] rounded-lg border-2 pr-4 pb-4 overflow-hidden">
          <Table className="min-w-max w-full text-sm text-left">
            <TableHeader className="sticky top-0 z-10 bg-gray-50 border-b-2 border-gray-300">
              <TimesheetTableHeader headers={timesheetHeaders} loading />
            </TableHeader>
            <TimesheetTableSkeleton
              headers={timesheetHeaders}
              pageSize={pageSize}
            />
          </Table>
        </HorizontalScrollArea>
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
    <div className="h-full w-full flex flex-col grid-rows-[1fr_50px] rounded-lg  shadow-sm bg-white">
      <HorizontalScrollArea className="h-[200px] w-[350px] rounded-t-lg  pr-2  overflow-hidden">
        <Table className="min-w-max  text-left">
          <TableHeader className="sticky top-0 z-10 ">
            <TimesheetTableHeader headers={timesheetHeaders} />
          </TableHeader>
          <TimesheetTableBody
            timesheets={timesheets}
            onDeleteClick={onDeleteClick}
            deletingId={deletingId}
          />
        </Table>
      </HorizontalScrollArea>

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
