import { Table, TableHeader } from "@/components/ui/table";
import { TimesheetTableHeader } from "./TimesheetTableHeader";
import { TimesheetTableBody } from "./TimesheetTableBody";
import { TimesheetTableSkeleton } from "./TimesheetTableSkeleton";
import { TimesheetFooter } from "./TimesheetFooter";
import { TimeSheetStatus, WorkType } from "@/lib/enums";
import { useEffect, useState } from "react";

type Timesheet = {
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

export default function ViewAllTimesheets() {
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
  const [loading, setLoading] = useState(true);
  const [allTimesheets, setAllTimesheets] = useState<Timesheet[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [pageSize, setPageSize] = useState(25);
  const pageSizeOptions = [25, 50, 75, 100];

  useEffect(() => {
    const fetchTimesheets = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `/api/getAllTimesheetInfo?page=${page}&pageSize=${pageSize}`
        );
        const data = await response.json();
        setAllTimesheets(data.timesheets);
        setTotalPages(data.totalPages);
        setTotal(data.total);
      } catch (error) {
        console.error("Error fetching timesheets:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTimesheets();
  }, [page, pageSize]);

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPageSize(Number(e.target.value));
    setPage(1); // Reset to first page when page size changes
  };

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
          onPageSizeChange={handlePageSizeChange}
          onPageChange={setPage}
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
        <TimesheetTableBody timesheets={allTimesheets} />
      </Table>
      <TimesheetFooter
        page={page}
        totalPages={totalPages}
        total={total}
        pageSize={pageSize}
        pageSizeOptions={pageSizeOptions}
        onPageSizeChange={handlePageSizeChange}
        onPageChange={setPage}
        timesheetsLength={allTimesheets.length}
      />
    </div>
  );
}
