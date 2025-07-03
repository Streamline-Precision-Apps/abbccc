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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export interface ListProps {
  forms: any[];
  loading: boolean;
  page: number;
  pageSize: number;
  totalPages: number;
  total: number;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  setFormId: Dispatch<SetStateAction<string | null>>;
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
  setFormId,
}) => {
  return (
    <div className="bg-white bg-opacity-80 h-[85vh] pb-[2.5em] w-full flex flex-col gap-4 rounded-lg relative">
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
          <TableBody className="bg-white pt-2">
            {[...Array(pageSize)].map((_, i) => (
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
          <TableBody className="bg-white pt-2">
            {forms.map((form) => (
              <TableRow key={form.id}>
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
                  {form._count.Submissions}
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
                      <Button
                        variant="ghost"
                        size={"icon"}
                        onClick={() => {
                          form.id;
                        }}
                      >
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
                      onClick={() => setFormId(form.id)}
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

                    <Button variant="ghost" size={"icon"} onClick={() => {}}>
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
      {/* Pagination Controls */}
      <div className="absolute bottom-0 h-10 left-0 right-0 flex flex-row justify-between items-center mt-2 px-2 bg-white border-t border-gray-200 rounded-b-lg">
        <div className="text-xs text-gray-600">
          Showing page {page} of {totalPages} ({total} total)
        </div>
        <div className="flex flex-row gap-2 items-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={(e) => {
                    e.preventDefault();
                    setPage(Math.max(1, page - 1));
                  }}
                  aria-disabled={page === 1}
                  tabIndex={page === 1 ? -1 : 0}
                  style={{
                    pointerEvents: page === 1 ? "none" : undefined,
                    opacity: page === 1 ? 0.5 : 1,
                  }}
                />
              </PaginationItem>
              <PaginationItem>
                <span className="text-xs border rounded py-1 px-2">{page}</span>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext
                  onClick={(e) => {
                    e.preventDefault();
                    setPage(Math.min(totalPages, page + 1));
                  }}
                  aria-disabled={page === totalPages}
                  tabIndex={page === totalPages ? -1 : 0}
                  style={{
                    pointerEvents: page === totalPages ? "none" : undefined,
                    opacity: page === totalPages ? 0.5 : 1,
                  }}
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
    </div>
  );
};

export default List;
