import { Table, TableHeader } from "@/components/ui/table";
import { TimesheetTableHeader } from "./TimesheetTableHeader";
import { TimesheetTableBody } from "./TimesheetTableBody";
import { TimesheetTableSkeleton } from "./TimesheetTableSkeleton";
import { ApprovalStatus, WorkType } from "@/lib/enums";

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
    code: string;
  };
  CostCode: {
    id: string;
    name: string;
    code: string;
  };
  nu: string;
  Fp: string;
  startTime: Date | string;
  endTime: Date | string | null;
  comment: string;
  status: ApprovalStatus;
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
  onApprovalAction,
  statusLoading,
  searchTerm,
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
  onApprovalAction?: (id: string, action: "APPROVED" | "REJECTED") => void;
  statusLoading?: Record<string, "APPROVED" | "REJECTED" | undefined>;
  searchTerm: string;
}) {
  const timesheetHeaders = [
    "ID",
    "Date",
    "Work Type",
    "Employee Name",
    "Profit Id",
    "Cost Code",
    "Start Time",
    "End Time",
    "Comment",
    "Status",
    "Last modified",
  ];

  if (loading) {
    return (
      <Table className="w-full">
        <TableHeader className="sticky top-0 z-10 ">
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
    <div className="overflow-hidden rounded-md border">
      <Table className="h-full">
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
          onApprovalAction={onApprovalAction}
          statusLoading={statusLoading}
          searchTerm={searchTerm}
        />
      </Table>
    </div>
  );
}
