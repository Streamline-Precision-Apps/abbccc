import React, { Dispatch, SetStateAction } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FormItem } from "./hooks/types";

export interface ListProps {
  forms: FormItem[];
  loading: boolean;
  page: number;
  pageSize: number;
  totalPages: number;
  total: number;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  openHandleDelete: (id: string) => void;
  setPendingExportId: Dispatch<SetStateAction<string | null>>;
}

/**
 * Renders the paginated forms table and pagination controls.
 */
const List: React.FC<ListProps> = ({
  forms,
  loading,
  page,
  pageSize,
  totalPages,
  total,
  setPage,
  setPageSize,
  setPendingExportId,
  openHandleDelete,
}) => {
  return (
    <>
      {loading ? (
        <Table className="w-full h-full bg-white rounded-lg">
          <TableHeader className="bg-gray-100 rounded-lg ">
            <TableRow className="h-10">
              <TableHead className="rounded-tl-lg text-xs w-1/5">
                <Skeleton className="h-4 w-3/4" />
              </TableHead>
              <TableHead className="text-center text-xs w-1/6">
                <Skeleton className="h-4 w-2/3 mx-auto" />
              </TableHead>
              <TableHead className="text-center text-xs w-1/12">
                <Skeleton className="h-4 w-1/2 mx-auto" />
              </TableHead>
              <TableHead className="text-center text-xs w-1/12">
                <Skeleton className="h-4 w-2/3 mx-auto" />
              </TableHead>
              <TableHead className="text-center text-xs w-1/6">
                <Skeleton className="h-4 w-2/3 mx-auto" />
              </TableHead>
              <TableHead className="text-center text-xs w-1/6">
                <Skeleton className="h-4 w-2/3 mx-auto" />
              </TableHead>
              <TableHead className="w-[160px] text-right pr-6 rounded-tr-lg text-xs">
                <Skeleton className="h-4 w-1/2 ml-auto" />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-gray-200 bg-white">
            {[...Array(20)].map((_, i) => (
              <TableRow key={i}>
                <TableCell className="text-xs">
                  <Skeleton className="h-4 w-3/4 mb-1" />
                  <Skeleton className="h-3 w-1/2" />
                </TableCell>
                <TableCell className="text-center text-xs">
                  <Skeleton className="h-4 w-2/3 mx-auto" />
                </TableCell>
                <TableCell className="text-center text-xs">
                  <Skeleton className="h-4 w-1/2 mx-auto" />
                </TableCell>
                <TableCell className="text-center text-xs">
                  <Skeleton className="h-4 w-2/3 mx-auto" />
                </TableCell>
                <TableCell className="text-center text-xs">
                  <Skeleton className="h-4 w-2/3 mx-auto" />
                </TableCell>
                <TableCell className="text-center text-xs">
                  <Skeleton className="h-4 w-2/3 mx-auto" />
                </TableCell>
                <TableCell className="w-[160px]">
                  <div className="flex flex-row justify-center gap-4">
                    <Skeleton className="h-4 w-4 rounded-full" />
                    <Skeleton className="h-4 w-4 rounded-full" />
                    <Skeleton className="h-4 w-4 rounded-full" />
                    <Skeleton className="h-4 w-4 rounded-full" />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <Table className="w-full h-full bg-white rounded-lg">
          <TableHeader className="bg-gray-100 rounded-lg">
            <TableRow className="h-10">
              <TableHead className="rounded-tl-lg text-xs">
                Name & Description
              </TableHead>
              <TableHead className="text-center text-xs">Form Type</TableHead>
              <TableHead className="text-center text-xs">Submissions</TableHead>
              <TableHead className="text-center text-xs">Status</TableHead>
              <TableHead className="text-center text-xs">
                Date Created
              </TableHead>
              <TableHead className="text-center text-xs">
                Date Updated
              </TableHead>
              <TableHead className="w-[160px] text-right pr-6 rounded-tr-lg text-xs">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-gray-200 bg-white">
            {forms.map((form) => (
              <TableRow key={form.id} className="odd:bg-white even:bg-gray-100">
                <TableCell className="text-xs">
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-semibold">{form.name}</span>
                    <span className="text-xs text-gray-500">
                      {form.description || "No description"}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-center text-xs">
                  <span className="bg-sky-200 px-3 py-1 rounded-xl">
                    {form.formType}
                  </span>
                </TableCell>
                <TableCell className="text-center text-xs text-sky-900 underline hover:text-sky-600 cursor-pointer">
                  <Link href={`/admins/forms/${form.id}`}>
                    {form._count.Submissions}
                  </Link>
                </TableCell>
                <TableCell className="text-center text-xs">
                  {form.isActive === "ACTIVE" ? (
                    <span className=" bg-green-300 px-3 py-1 rounded-xl ">
                      Active
                    </span>
                  ) : form.isActive === "DRAFT" ? (
                    <span className=" bg-yellow-200 px-3 py-1 rounded-xl ">
                      Draft
                    </span>
                  ) : (
                    <span className=" bg-slate-100 px-3 py-1 rounded-xl">
                      Inactive
                    </span>
                  )}
                </TableCell>
                <TableCell className="text-center text-xs">
                  {form.createdAt
                    ? new Date(form.createdAt).toLocaleDateString()
                    : "-"}
                </TableCell>
                <TableCell className="text-center text-xs">
                  {form.updatedAt
                    ? new Date(form.updatedAt).toLocaleDateString()
                    : "-"}
                </TableCell>
                <TableCell className="w-[160px]">
                  <div className="flex flex-row justify-center">
                    <Link href={`/admins/forms/${form.id}`}>
                      <Button variant="ghost" size={"icon"}>
                        <img
                          src="/eye.svg"
                          alt="View Form"
                          className="h-4 w-4 cursor-pointer"
                        />
                      </Button>
                    </Link>

                    <Button
                      variant="ghost"
                      size={"icon"}
                      onClick={() => setPendingExportId(form.id)}
                    >
                      <img
                        src="/export.svg"
                        alt="Export Form"
                        className="h-4 w-4 cursor-pointer"
                      />
                    </Button>

                    <Link href={`/admins/forms/edit/${form.id}`}>
                      <Button variant="ghost" size={"icon"}>
                        <img
                          src="/formEdit.svg"
                          alt="Edit Form"
                          className="h-4 w-4 cursor-pointer"
                        />
                      </Button>
                    </Link>

                    <Button
                      variant="ghost"
                      size={"icon"}
                      onClick={() => {
                        openHandleDelete(form.id);
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
            ))}
          </TableBody>
        </Table>
      )}
    </>
  );
};

export default List;
