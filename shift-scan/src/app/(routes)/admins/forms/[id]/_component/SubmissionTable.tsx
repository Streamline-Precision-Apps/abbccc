import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
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
import { Grouping, Submission } from "./hooks/types";

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
  onDeleteSubmission: (id: string) => void;
  loading: false;
  isSignatureRequired?: boolean;
}

/**
 * Renders a table where columns are field labels and rows are submissions.
 */
const SubmissionTable: React.FC<SubmissionTableProps> = ({
  groupings,
  submissions,
  setShowFormSubmission,
  setSelectedSubmissionId,
  onDeleteSubmission,
  isSignatureRequired = false,
}) => {
  // Flatten all fields from all groupings, ordered
  const fields = groupings
    .flatMap((g) => g.Fields)
    .sort((a, b) => a.order - b.order);

  return (
    <Table className="w-full h-full bg-white relative rounded-xl">
      <TableHeader className="rounded-t-md ">
        <TableRow className="">
          <TableHead className="text-xs text-center rounded-tl-md min-w-[80px]">
            Submitted By
          </TableHead>
          {fields.map((field) => (
            <TableHead
              key={field.label}
              className="text-xs text-center max-w-[200px]"
            >
              {field.label}
            </TableHead>
          ))}
          <TableHead className="text-xs text-center ">Status</TableHead>
          <TableHead className="text-xs text-center ">Submitted At</TableHead>
          {isSignatureRequired && (
            <TableHead className="text-xs text-center ">Signature</TableHead>
          )}
          <TableHead className="text-xs text-center bg-gray-50 rounded-tr-lg sticky right-0 z-10 ">
            Actions
          </TableHead>
        </TableRow>
      </TableHeader>

      <TableBody className="bg-white h-full w-full text-center ">
        {submissions && submissions.length > 0
          ? submissions.map((submission) =>
              submission == null ? null : (
                <TableRow key={submission.id}>
                  <TableCell className="text-xs min-w-[80px] max-w-[180px] border border-slate-200 px-2 bg-slate-50/80">
                    {submission.User.firstName} {submission.User.lastName}
                  </TableCell>
                  {fields.map((field) => {
                    const val = submission.data[field.id];

                    // If the field is a date or time, format it
                    let display = val;
                    let isObject = false;
                    let isArrayOfObjects = false;

                    if (
                      val &&
                      (field.type === "DATE" || field.type === "TIME")
                    ) {
                      try {
                        display = format(new Date(val), "P");
                      } catch {
                        display = val;
                      }
                    } else if (val && field.type === "CHECKBOX") {
                      display = val ? "Yes" : "No";
                    } else if (Array.isArray(val)) {
                      if (
                        val.length > 0 &&
                        typeof val[0] === "object" &&
                        val[0] !== null
                      ) {
                        // Array of objects
                        isArrayOfObjects = true;
                      } else {
                        display = val.join(", ");
                      }
                    } else if (val && typeof val === "object" && val !== null) {
                      // Single object
                      isObject = true;
                      display = val.name || "";
                    }

                    return (
                      <TableCell
                        key={field.id}
                        className="text-xs min-w-[80px] max-w-[180px] border border-slate-200 px-2 bg-slate-50/80"
                      >
                        {isArrayOfObjects ? (
                          val.length > 3 ? (
                            <Popover>
                              <PopoverTrigger asChild>
                                <button
                                  type="button"
                                  className="bg-blue-50 rounded px-2 py-1 border border-blue-200 text-xs text-blue-700 cursor-pointer min-w-[48px]"
                                >
                                  {val.length} submissions
                                </button>
                              </PopoverTrigger>
                              <PopoverContent className="w-64 max-h-64 overflow-y-auto">
                                <div className="flex flex-wrap gap-1 ">
                                  {val.map((item: any, idx: number) => (
                                    <div
                                      key={item.id || idx}
                                      className="bg-blue-50 rounded px-2 py-1 inline-block border border-blue-200 mb-1"
                                    >
                                      {item.name || ""}
                                    </div>
                                  ))}
                                </div>
                              </PopoverContent>
                            </Popover>
                          ) : (
                            <div className="flex flex-wrap gap-1">
                              {val.map((item: any, idx: number) => (
                                <div
                                  key={item.id || idx}
                                  className="bg-blue-50 rounded px-2 py-1 inline-block border border-blue-200"
                                >
                                  {item.name || ""}
                                </div>
                              ))}
                            </div>
                          )
                        ) : (
                          display ?? ""
                        )}
                      </TableCell>
                    );
                  })}
                  <TableCell className="text-xs min-w-[80px] max-w-[180px] border border-slate-200 px-2 bg-slate-50/80">
                    {submission.status}
                  </TableCell>
                  <TableCell className="text-xs min-w-[80px] max-w-[180px] border border-slate-200 px-2 bg-slate-50/80">
                    {format(new Date(submission.submittedAt), "PPp")}
                  </TableCell>
                  {isSignatureRequired && (
                    <TableCell className="text-xs min-w-[80px] max-w-[180px] border border-slate-200 px-2 bg-slate-50/80">
                      {/* Render signature info here, e.g. a checkmark or signature image if available */}
                      {submission.data.signature ? (
                        <span className="text-green-600 font-bold">Signed</span>
                      ) : (
                        <span className="text-red-500 font-bold">
                          Not Signed
                        </span>
                      )}
                    </TableCell>
                  )}
                  <TableCell className="text-xs border border-slate-200 px-2 bg-slate-50/80 bg-gray-50 sticky right-0 z-10">
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
                          onDeleteSubmission(submission.id);
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
  );
};

export default SubmissionTable;
