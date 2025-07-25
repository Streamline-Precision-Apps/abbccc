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
  endTime: Date | string | null;
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
  editingId,
  onEditClick,
  isDeleting,
  isEditing,
  showPendingOnly,
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
  onEditClick?: (id: string) => void;
  editingId?: string | null;
  isEditing?: boolean;
  showPendingOnly: boolean;
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
      <Table className="w-full">
        <TableHeader className="sticky top-0 z-10 bg-gray-50 border-b-2 border-gray-300">
          <TimesheetTableHeader headers={timesheetHeaders} loading />
        </TableHeader>
        <TimesheetTableSkeleton
          headers={timesheetHeaders}
          pageSize={pageSize}
        />
      </Table>
    );
  }

  return (
    <Table className="w-full">
      <TableHeader className="sticky top-0 z-10 ">
        <TimesheetTableHeader headers={timesheetHeaders} />
      </TableHeader>
      <TimesheetTableBody
        timesheets={timesheets}
        onDeleteClick={onDeleteClick}
        deletingId={deletingId}
        onEditClick={onEditClick}
        editingId={editingId}
        showPendingOnly={showPendingOnly}
      />
    </Table>
  );
}
