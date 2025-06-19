import { Texts } from "@/components/(reusable)/texts";
import { TimesheetPagination } from "./TimesheetPagination";

interface TimesheetFooterProps {
  page: number;
  totalPages: number;
  total: number;
  pageSize: number;
  pageSizeOptions: number[];
  onPageSizeChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onPageChange: (page: number) => void;
  timesheetsLength: number;
}

export function TimesheetFooter({
  page,
  totalPages,
  total,
  pageSize,
  pageSizeOptions,
  onPageSizeChange,
  onPageChange,
  timesheetsLength,
}: TimesheetFooterProps) {
  return (
    <div className="flex min-w-0 flex-wrap items-center justify-between px-4  w-full border-t border-gray-200 rounded-b-lg bg-white">
      <Texts size="xs" text="black">
        Showing {timesheetsLength} of {total} timesheets (Page {page} of{" "}
        {totalPages})
      </Texts>
      <div className="flex gap-4 items-center min-w-0">
        <label htmlFor="pageSize" className="text-xs px-2 text-gray-700">
          Show:
        </label>
        <select
          id="pageSize"
          value={pageSize}
          onChange={onPageSizeChange}
          className="border rounded px-2 py-1 text-xs"
        >
          {pageSizeOptions.map((size) => (
            <option key={size} value={size}>
              {size} Rows
            </option>
          ))}
        </select>
        <div className="max-w-full">
          <TimesheetPagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </div>
      </div>
    </div>
  );
}
