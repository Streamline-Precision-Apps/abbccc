import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { sub } from "date-fns";

interface FieldOption {
  id: string;
  fieldId: string;
  value: string;
}

interface Field {
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
}

/**
 * Renders a table where columns are field labels and rows are submissions.
 */
const SubmissionTable: React.FC<SubmissionTableProps> = ({
  groupings,
  submissions,
}) => {
  // Flatten all fields from all groupings, ordered
  const fields = groupings
    .flatMap((g) => g.Fields)
    .sort((a, b) => a.order - b.order);

  return (
    <div className="overflow-x-auto w-full">
      <Table className="bg-white rounded-t-lg w-full h-full">
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
          {submissions && submissions.length > 0 ? (
            submissions.map((submission) =>
              submission == null ? null : (
                <TableRow
                  key={submission.id}
                  className="bg-white hover:bg-gray-50"
                >
                  <TableCell className="text-xs">
                    {submission.User.firstName} {submission.User.lastName}
                  </TableCell>
                  {fields.map((field) => (
                    <TableCell key={field.name} className="text-xs">
                      {submission.data[field.name] ?? ""}
                    </TableCell>
                  ))}
                  <TableCell className="text-xs">{submission.status}</TableCell>
                  <TableCell className="text-xs">
                    {new Date(submission.submittedAt).toLocaleString()}
                  </TableCell>
                  <TableCell className="w-[160px]">
                    <div className="flex flex-row justify-center">
                      <Button
                        variant="ghost"
                        size={"icon"}
                        onClick={() => {
                          // Handle view form action
                          console.log("View Form:", submission.id);
                        }}
                      >
                        <img
                          src="/eye.svg"
                          alt="View Form"
                          className="h-4 w-4 cursor-pointer"
                        />
                      </Button>
                      <Button
                        variant="ghost"
                        size={"icon"}
                        onClick={() => {
                          // Handle export form action
                          console.log("Export Form:", submission.id);
                        }}
                      >
                        <img
                          src="/export.svg"
                          alt="Export Form"
                          className="h-4 w-4 cursor-pointer"
                        />
                      </Button>
                      <Button
                        variant="ghost"
                        size={"icon"}
                        onClick={() => {
                          // Handle edit form action
                          console.log("Edit Form:", submission.id);
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
          ) : (
            <>
              <TableRow className="bg-white h-full">
                <TableCell
                  colSpan={fields.length + 3 + 1}
                  className="text-center text-gray-500"
                >
                  No submissions found.
                </TableCell>
              </TableRow>
            </>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default SubmissionTable;
