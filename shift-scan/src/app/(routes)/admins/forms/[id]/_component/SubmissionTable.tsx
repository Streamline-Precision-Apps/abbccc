import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { format } from "date-fns";
import { Dispatch, SetStateAction } from "react";

interface FieldOption {
  id: string;
  fieldId: string;
  value: string;
}

interface Field {
  id: string;
  label: string;
  name: string;
  type: string;
  required: boolean;
  order: number;
  defaultValue?: string | null;
  placeholder?: string | null;
  maxLength?: number | null;
  helperText?: string | null;
  Options?: FieldOption[];
}

interface Grouping {
  id: string;
  title: string;
  order: number;
  Fields: Field[];
}

interface Submission {
  id: string;
  title: string;
  formTemplateId: string;
  userId: string;
  formType: string;
  data: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  submittedAt: string;
  status: string;
  User: {
    id: string;
    firstName: string;
    lastName: string;
  };
}

interface SubmissionTableProps {
  groupings: Grouping[];
  submissions: Submission[];
  totalPages: number;
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
  setPageSize: Dispatch<SetStateAction<number>>;
  pageSize: number;
  setShowFormSubmission: Dispatch<SetStateAction<boolean>>;
  setSelectedSubmissionId: Dispatch<SetStateAction<string | null>>;
}

/**
 * Renders a table where columns are field labels and rows are submissions.
 */
const SubmissionTable: React.FC<SubmissionTableProps> = ({
  groupings,
  submissions,
  totalPages,
  page,
  setPage,
  setPageSize,
  pageSize,
  setShowFormSubmission,
  setSelectedSubmissionId,
}) => {
  // Flatten all fields from all groupings, ordered
  const fields = groupings
    .flatMap((g) => g.Fields)
    .sort((a, b) => a.order - b.order);

  return (
    <ScrollArea className="bg-slate-50 w-full rounded-lg h-[85vh] relative">
      <Table className="bg-slate-50 w-full h-full">
        <TableHeader className="rounded-t-md">
          <TableRow>
            <TableHead className="text-xs rounded-tl-md">
              Submitted By
            </TableHead>
            {fields.map((field) => (
              <TableHead key={field.name} className="text-xs">
                {field.label}
              </TableHead>
            ))}
            <TableHead className="text-xs">Status</TableHead>
            <TableHead className="text-xs">Submitted At</TableHead>
            <TableHead className="text-xs text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="bg-white h-full w-full">
          {submissions && submissions.length > 0
            ? submissions.map((submission) =>
                submission == null ? null : (
                  <TableRow
                    key={submission.id}
                    className="bg-white hover:bg-gray-50"
                  >
                    <TableCell className="text-xs">
                      {submission.User.firstName} {submission.User.lastName}
                    </TableCell>
                    {fields.map((field) => {
                      const val = submission.data[field.id];
                      let display = val;
                      // If the field is a date or time, format it
                      if (
                        val &&
                        (field.type === "DATE" || field.type === "TIME")
                      ) {
                        try {
                          display = format(new Date(val), "P");
                        } catch {
                          display = val;
                        }
                      }
                      // If the value is an array (e.g., MULTISELECT), join with commas
                      if (Array.isArray(val)) {
                        display = val.join(", ");
                      }
                      return (
                        <TableCell key={field.id} className="text-xs">
                          {display ?? ""}
                        </TableCell>
                      );
                    })}
                    <TableCell className="text-xs">
                      {submission.status}
                    </TableCell>
                    <TableCell className="text-xs">
                      {format(new Date(submission.submittedAt), "PPp")}
                    </TableCell>
                    <TableCell className="w-[160px]">
                      <div className="flex flex-row justify-center">
                        <Button
                          variant="ghost"
                          size={"icon"}
                          onClick={() => {
                            setShowFormSubmission(true);
                            setSelectedSubmissionId(submission.id);
                          }}
                        >
                          <img
                            src="/formEdit.svg"
                            alt="Edit Form"
                            className="h-4 w-4 cursor-pointer"
                          />
                        </Button>
                        <Button
                          variant="ghost"
                          size={"icon"}
                          onClick={() => {
                            // Handle delete form action
                            console.log("Delete Form:", submission.id);
                          }}
                        >
                          <img
                            src="/trash-red.svg"
                            alt="Delete Form"
                            className="h-4 w-4 cursor-pointer"
                          />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              )
            : null}
        </TableBody>
      </Table>

      {submissions && submissions.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-xs text-muted-foreground select-none">
            No submissions found.
          </p>
        </div>
      )}

      {totalPages && (
        <div className="absolute bottom-0 h-10 left-0 right-0 flex flex-row justify-between items-center mt-2 px-2 bg-white border-t border-gray-200 rounded-b-lg">
          <div className="text-xs text-gray-600">
            Showing page {page} of {totalPages} ({submissions.length} total)
          </div>
          <div className="flex flex-row gap-2 items-center">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (page > 1) setPage(page - 1);
                    }}
                    aria-disabled={page === 1}
                  />
                </PaginationItem>
                {Array.from({ length: totalPages }, (_, i) => (
                  <PaginationItem key={i + 1}>
                    <PaginationLink
                      href="#"
                      isActive={page === i + 1}
                      onClick={(e) => {
                        e.preventDefault();
                        setPage(i + 1);
                      }}
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (page < (totalPages || 1)) setPage(page + 1);
                    }}
                    aria-disabled={page === totalPages}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
            <select
              className="ml-2 px-1 py-1 rounded text-xs border"
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPage(1);
              }}
            >
              {[5, 10, 20, 50].map((size) => (
                <option key={size} value={size}>
                  {size} Rows
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </ScrollArea>
  );
};

export default SubmissionTable;
