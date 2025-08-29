"use client";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import SubmissionTable from "./SubmissionTable";
import { FormIndividualTemplate } from "./hooks/types";
import { Dispatch, SetStateAction } from "react";

interface PageProps {
  loading: boolean;
  formTemplate?: FormIndividualTemplate;
  inputValue: string;
  setShowFormSubmission: Dispatch<SetStateAction<boolean>>;
  setSelectedSubmissionId: Dispatch<SetStateAction<number | null>>;
  openHandleDeleteSubmission: (id: number) => void;
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
  pageSize: number;
  setPageSize: Dispatch<SetStateAction<number>>;
}

export default function RenderTableSection({
  loading,
  formTemplate,
  inputValue,
  setShowFormSubmission,
  setSelectedSubmissionId,
  openHandleDeleteSubmission,
  page,
  setPage,
  pageSize,
  setPageSize,
}: PageProps) {
  if (loading) {
    // Match SubmissionTable columns: Submitted By, dynamic fields, Status, Submitted At, (Signature), Actions
    // We'll use 4 dynamic fields as a placeholder for skeletons
    const dynamicFieldCount = 4;
    const hasSignature = formTemplate?.isSignatureRequired;
    return (
      <Table className="w-full h-full bg-white relative rounded-xl">
        <TableHeader className="rounded-t-md ">
          <TableRow className="">
            <TableHead className="text-xs text-center rounded-tl-md min-w-[80px]">
              <Skeleton className="h-4 w-20 mx-auto" />
            </TableHead>
            {[...Array(dynamicFieldCount)].map((_, i) => (
              <TableHead key={i} className="text-xs text-center max-w-[200px]">
                <Skeleton className="h-4 w-20 mx-auto" />
              </TableHead>
            ))}
            <TableHead className="text-xs text-center ">
              <Skeleton className="h-4 w-12 mx-auto" />
            </TableHead>
            <TableHead className="text-xs text-center ">
              <Skeleton className="h-4 w-20 mx-auto" />
            </TableHead>
            {hasSignature && (
              <TableHead className="text-xs text-center ">
                <Skeleton className="h-4 w-20 mx-auto" />
              </TableHead>
            )}
            <TableHead className="text-xs text-center bg-gray-50 rounded-tr-lg sticky right-0 z-10 ">
              <Skeleton className="h-4 w-16 mx-auto" />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="bg-white h-full w-full text-center ">
          {[...Array(10)].map((_, rowIdx) => (
            <TableRow key={rowIdx}>
              <TableCell className="text-xs min-w-[80px] max-w-[180px] border border-slate-200 px-2 bg-slate-50/80">
                <Skeleton className="h-4 w-20 mx-auto" />
              </TableCell>
              {[...Array(dynamicFieldCount)].map((_, colIdx) => (
                <TableCell
                  key={colIdx}
                  className="text-xs min-w-[80px] max-w-[180px] border border-slate-200 px-2 bg-slate-50/80"
                >
                  <Skeleton className="h-4 w-20 mx-auto" />
                </TableCell>
              ))}
              <TableCell className="text-xs min-w-[80px] max-w-[180px] border border-slate-200 px-2 bg-slate-50/80">
                <Skeleton className="h-4 w-12 mx-auto" />
              </TableCell>
              <TableCell className="text-xs min-w-[80px] max-w-[180px] border border-slate-200 px-2 bg-slate-50/80">
                <Skeleton className="h-4 w-20 mx-auto" />
              </TableCell>
              {hasSignature && (
                <TableCell className="text-xs min-w-[80px] max-w-[180px] border border-slate-200 px-2 bg-slate-50/80">
                  <Skeleton className="h-4 w-20 mx-auto" />
                </TableCell>
              )}
              <TableCell className="text-xs border border-slate-200 px-2 bg-slate-50/80 bg-gray-50 sticky right-0 z-10">
                <div className="flex flex-row justify-center gap-2">
                  <Skeleton className="h-6 w-6 rounded-full" />
                  <Skeleton className="h-6 w-6 rounded-full" />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }

  if (formTemplate && formTemplate !== null) {
    // Filter submissions by searchTerm (case-insensitive, checks user name and submission id)
    const filteredSubmissions = (formTemplate.Submissions || []).filter(
      (submission) => {
        if (!inputValue) return true;
        const lower = inputValue.toLowerCase();
        // Check id
        if (
          submission.id &&
          submission.id.toString().toLowerCase().includes(lower)
        )
          return true;
        // Check user name
        if (submission.User) {
          const name =
            `${submission.User.firstName ?? ""} ${submission.User.lastName ?? ""}`.toLowerCase();
          if (name.includes(lower)) return true;
        }
        // Check createdAt or submittedAt
        if (
          submission.createdAt &&
          String(submission.createdAt).toLowerCase().includes(lower)
        )
          return true;
        if (
          submission.submittedAt &&
          String(submission.submittedAt).toLowerCase().includes(lower)
        )
          return true;
        // Check all field values
        if (submission.data && typeof submission.data === "object") {
          for (const val of Object.values(submission.data)) {
            if (val && String(val).toLowerCase().includes(lower)) return true;
          }
        }
        return false;
      },
    );
    return (
      <>
        <SubmissionTable
          groupings={formTemplate.FormGrouping}
          submissions={filteredSubmissions}
          setShowFormSubmission={setShowFormSubmission}
          setSelectedSubmissionId={setSelectedSubmissionId}
          onDeleteSubmission={openHandleDeleteSubmission}
          totalPages={formTemplate.totalPages || 1}
          page={page}
          setPage={setPage}
          setPageSize={setPageSize}
          pageSize={pageSize}
          loading={loading}
          isSignatureRequired={formTemplate.isSignatureRequired}
          searchTerm={inputValue}
        />
        {filteredSubmissions.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-xs text-muted-foreground select-none">
              No submissions found.
            </p>
          </div>
        )}
      </>
    );
  }

  return (
    <div className="bg-white bg-opacity-80 h-[85vh] pb-[1.5em] w-full flex items-center justify-center rounded-lg">
      <p className="text-sm font-bold text-red-500">
        Error: Form Template does not exist
      </p>
    </div>
  );
}
