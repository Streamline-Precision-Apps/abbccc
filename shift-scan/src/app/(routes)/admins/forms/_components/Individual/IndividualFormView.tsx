import { Dispatch, SetStateAction, useEffect, useState } from "react";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { FormIndividualTemplate } from "./hooks/types";

export default function IndividualFormView({
  formId,
  page,
  pageSize,
  formTemplate,
  loading,
  setPage,
  setPageSize,
}: {
  formId: string | null;
  page: number;
  pageSize: number;
  formTemplate: FormIndividualTemplate | null;
  setPage: Dispatch<SetStateAction<number>>;
  setPageSize: Dispatch<SetStateAction<number>>;
  loading: boolean;
  error: string | null;
}) {
  if (!formId)
    return <div className="text-xs text-gray-500">No form selected.</div>;

  if (loading) {
    // Skeleton UI for loading state using the Table UI and ScrollArea
    return (
      <div className="bg-white bg-opacity-80 h-[800px] pb-[1.5em] w-full flex flex-col gap-4 rounded-lg relative">
        <ScrollArea className="w-full h-full rounded-lg">
          <Table className="bg-white rounded-t-lg w-full h-full">
            <TableHeader className="rounded-t-md">
              <TableRow>
                <TableHead className="text-xs rounded-tl-md">
                  <Skeleton className="h-4 w-20" />
                </TableHead>
                {[...Array(4)].map((_, i) => (
                  <TableHead key={i} className="text-xs">
                    <Skeleton className="h-4 w-20" />
                  </TableHead>
                ))}
                <TableHead className="text-xs">
                  <Skeleton className="h-4 w-12" />
                </TableHead>
                <TableHead className="text-xs">
                  <Skeleton className="h-4 w-20" />
                </TableHead>
                <TableHead className="text-xs text-center">
                  <Skeleton className="h-4 w-16 mx-auto" />
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="bg-white h-full w-full">
              {[...Array(25)].map((_, rowIdx) => (
                <TableRow key={rowIdx} className="bg-white">
                  <TableCell className="text-xs">
                    <Skeleton className="h-4 w-20" />
                  </TableCell>
                  {[...Array(4)].map((_, colIdx) => (
                    <TableCell key={colIdx} className="text-xs">
                      <Skeleton className="h-4 w-20" />
                    </TableCell>
                  ))}
                  <TableCell className="text-xs">
                    <Skeleton className="h-4 w-12" />
                  </TableCell>
                  <TableCell className="text-xs">
                    <Skeleton className="h-4 w-20" />
                  </TableCell>
                  <TableCell className="w-[160px]">
                    <div className="flex flex-row justify-center gap-2">
                      <Skeleton className="h-6 w-6 rounded-full" />
                      <Skeleton className="h-6 w-6 rounded-full" />
                      <Skeleton className="h-6 w-6 rounded-full" />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
        <div className="absolute bottom-0 h-10 left-0 right-0 flex flex-row justify-between items-center mt-2 px-2 bg-white border-t border-gray-200 rounded-b-lg">
          <Skeleton className="h-4 w-32" />
          <div className="flex flex-row gap-2 items-center">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-8 w-20" />
          </div>
        </div>
      </div>
    );
  }
  if (!formTemplate)
    return <div className="text-xs text-gray-500">No data found.</div>;

  return (
    <SubmissionTable
      groupings={formTemplate.FormGrouping}
      submissions={formTemplate.Submissions}
      totalPages={formTemplate.totalPages || 1}
      page={page}
      setPage={setPage}
      pageSize={pageSize}
      setPageSize={setPageSize}
    />
  );
}
