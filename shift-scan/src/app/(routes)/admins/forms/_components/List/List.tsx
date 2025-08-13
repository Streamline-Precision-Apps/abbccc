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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { highlight } from "../../../_pages/higlight";
export interface ListProps {
  forms: FormItem[];
  loading: boolean;
  openHandleDelete: (id: string) => void;
  setPendingExportId: Dispatch<SetStateAction<string | null>>;
  inputValue: string;
}

/**
 * Renders the paginated forms table and pagination controls.
 */
const List: React.FC<ListProps> = ({
  forms,
  loading,
  setPendingExportId,
  openHandleDelete,
  inputValue,
}) => {
  return (
    <>
      {loading ? (
        <Table className="w-full">
          <TableHeader className="sticky top-0 z-10 bg-gray-50 border-b-2 border-gray-300">
            <TableRow className="h-10">
              <TableHead className="rounded-tl-lg font-semibold text-gray-700  text-center border-r bg-gray-100 border-gray-200 text-xs w-1/5">
                <Skeleton className="h-4 w-3/4" />
              </TableHead>
              <TableHead className="rounded-tl-lg font-semibold text-gray-700  text-center border-r bg-gray-100 border-gray-200 text-xs w-1/6">
                <Skeleton className="h-4 w-2/3 mx-auto" />
              </TableHead>
              <TableHead className="rounded-tl-lg font-semibold text-gray-700  text-center border-r bg-gray-100 border-gray-200 text-xs w-1/12">
                <Skeleton className="h-4 w-1/2 mx-auto" />
              </TableHead>
              <TableHead className="rounded-tl-lg font-semibold text-gray-700  text-center border-r bg-gray-100 border-gray-200 text-xs w-1/12">
                <Skeleton className="h-4 w-2/3 mx-auto" />
              </TableHead>
              <TableHead className="rounded-tl-lg font-semibold text-gray-700  text-center border-r bg-gray-100 border-gray-200 text-xs w-1/6">
                <Skeleton className="h-4 w-2/3 mx-auto" />
              </TableHead>
              <TableHead className="rounded-tl-lg font-semibold text-gray-700  text-center border-r bg-gray-100 border-gray-200 text-xs w-1/6">
                <Skeleton className="h-4 w-2/3 mx-auto" />
              </TableHead>
              <TableHead className="w-[160px] text-right pr-6 rounded-tr-lg text-xs">
                <Skeleton className="h-4 w-1/2 ml-auto" />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-gray-200 bg-white">
            {[...Array(20)].map((_, i) => (
              <TableRow
                key={i}
                className="odd:bg-white even:bg-gray-100 border-r border-gray-200 text-xs text-center py-2"
              >
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
        <Table className="w-full">
          <TableHeader className="sticky top-0 z-10 bg-gray-50 border-b-2 border-gray-300">
            <TableRow>
              <TableHead className="font-semibold text-gray-700  text-left  border-r bg-gray-100 border-gray-200  text-xs">
                Name & Description
              </TableHead>
              <TableHead className="font-semibold text-gray-700  text-center  border-r bg-gray-100 border-gray-200  text-xs">
                Form Type
              </TableHead>
              <TableHead className="font-semibold text-gray-700  text-center  border-r bg-gray-100 border-gray-200  text-xs">
                Submissions
              </TableHead>
              <TableHead className="font-semibold text-gray-700  text-center  border-r bg-gray-100 border-gray-200  text-xs">
                Status
              </TableHead>
              <TableHead className="font-semibold text-gray-700  text-center  border-r bg-gray-100 border-gray-200  text-xs">
                Date Created
              </TableHead>
              <TableHead className="font-semibold text-gray-700  text-center  border-r bg-gray-100 border-gray-200  text-xs">
                Date Updated
              </TableHead>
              <TableHead className="font-semibold text-gray-700  text-center  border-r bg-gray-100 border-gray-200 last:border-r-0 text-xs w-[160px]  pr-6 rounded-tr-lg ">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-gray-200 bg-white">
            {forms.map((form) => (
              <TableRow
                key={form.id}
                className="odd:bg-white even:bg-gray-100 border-r border-gray-200 text-xs text-center py-2"
              >
                <TableCell className=" border-r border-gray-200 text-xs text-center">
                  <div className="flex flex-col gap-1 text-left">
                    <p>{highlight(form.name, inputValue)}</p>
                    <p className="text-[10px] text-gray-400 italic">
                      {form.description || "No description"}
                    </p>
                  </div>
                </TableCell>
                <TableCell className="border-r border-gray-200 text-xs text-center">
                  <span className="bg-sky-200 px-3 py-1 rounded-xl">
                    {form.formType}
                  </span>
                </TableCell>
                <TableCell className="border-r border-gray-200 text-sm text-center">
                  <Link
                    href={`/admins/forms/${form.id}`}
                    className="text-blue-600  underline-offset-2 decoration-solid underline hover:text-sky-600 cursor-pointer"
                  >
                    {form._count.Submissions}
                  </Link>
                </TableCell>
                <TableCell className="border-r border-gray-200 text-xs text-center">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      {form.isActive === "ACTIVE" ? (
                        <span className=" bg-green-300 px-2 py-1 rounded-xl ">
                          A
                        </span>
                      ) : form.isActive === "DRAFT" ? (
                        <span className=" bg-yellow-200 px-2 py-1 rounded-xl ">
                          D
                        </span>
                      ) : (
                        <span className=" bg-slate-100 px-2 py-1 rounded-xl">
                          I
                        </span>
                      )}
                    </TooltipTrigger>
                    <TooltipContent>
                      {form.isActive === "ACTIVE"
                        ? "Active"
                        : form.isActive === "DRAFT"
                          ? " Draft"
                          : " Inactive"}
                    </TooltipContent>
                  </Tooltip>
                </TableCell>
                <TableCell className="border-r border-gray-200 text-xs text-center">
                  {form.createdAt
                    ? new Date(form.createdAt).toLocaleDateString()
                    : "-"}
                </TableCell>
                <TableCell className="border-r border-gray-200 text-xs text-center">
                  {form.updatedAt
                    ? new Date(form.updatedAt).toLocaleDateString()
                    : "-"}
                </TableCell>
                <TableCell className=" text-xs text-center border-r">
                  <div className="flex flex-row justify-center">
                    <Link href={`/admins/forms/${form.id}`}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size={"icon"}>
                            <img
                              src="/eye.svg"
                              alt="View Form"
                              className="h-4 w-4 cursor-pointer"
                            />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>View Submissions</TooltipContent>
                      </Tooltip>
                    </Link>
                    <Tooltip>
                      <TooltipTrigger asChild>
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
                      </TooltipTrigger>
                      <TooltipContent>Export Submissions</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link href={`/admins/forms/edit/${form.id}`}>
                          <Button variant="ghost" size={"icon"}>
                            <img
                              src="/formEdit.svg"
                              alt="Edit Form"
                              className="h-4 w-4 cursor-pointer"
                            />
                          </Button>
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent>Edit Form Template</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
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
                      </TooltipTrigger>
                      <TooltipContent>Delete Form Template</TooltipContent>
                    </Tooltip>
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
