"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { TagSummary } from "./useTagData";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function TagTable({
  loading,
  tagDetails,
  openHandleDelete,
  openHandleEdit,
}: {
  loading: boolean;
  tagDetails: TagSummary[];
  openHandleDelete: (id: string) => void;
  openHandleEdit: (id: string) => void;
}) {
  const header = ["Name", "Description"];

  return (
    <>
      <Table className="w-full border border-gray-200">
        <TableHeader>
          <TableRow>
            <TableHead className="text-sm text-center border-r border-gray-200 bg-gray-100 w-[300px] sticky top-0 z-10">
              ID
            </TableHead>
            {header.map((h) => (
              <TableHead
                key={h}
                className="text-sm text-center border-r border-gray-200 bg-gray-100 sticky top-0 z-10"
              >
                {h}
              </TableHead>
            ))}
            <TableHead className="text-sm text-center bg-gray-100 w-[150px] sticky top-0 z-10">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        {loading ? (
          <TableBody className="divide-y divide-gray-200 bg-white">
            {Array.from({ length: 10 }).map((_, rowIdx) => (
              <TableRow
                key={rowIdx}
                className={rowIdx % 2 === 0 ? "bg-white" : "bg-gray-100"}
              >
                {/* ID */}
                <TableCell className="border-r border-gray-200 text-xs text-center w-[300px]">
                  <Skeleton className="h-4 w-2/3 mx-auto" />
                </TableCell>
                {/* Name */}
                <TableCell className="border-r border-gray-200 text-xs text-center">
                  <Skeleton className="h-4 w-3/4 mx-auto" />
                </TableCell>
                {/* Description */}
                <TableCell className="border-r border-gray-200 text-xs text-center">
                  <Skeleton className="h-4 w-3/4 mx-auto" />
                </TableCell>
                {/* Actions (Edit/Delete buttons) */}
                <TableCell className="text-xs text-center w-[150px]">
                  <div className="flex flex-row items-center justify-center gap-2">
                    <Skeleton className="h-6 w-6 rounded-full" />
                    <Skeleton className="h-6 w-6 rounded-full" />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        ) : (
          <TableBody>
            {tagDetails.map((tag) => (
              <TableRow
                className={`odd:bg-white even:bg-gray-100 ${tag.name.toUpperCase() === "ALL" ? "bg-blue-50 hover:bg-blue-100" : ""}`}
                key={tag.id}
              >
                <TableCell className=" border-r border-gray-200 text-xs text-center w-[300px] ">
                  {tag.id || "-"}
                </TableCell>
                <TableCell className=" border-r border-gray-200 text-xs text-center">
                  {tag.name.toUpperCase() === "ALL" ? (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="text-blue-600 font-semibold">
                          {tag.name || "-"}
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>System reserved tag - cannot be modified</p>
                      </TooltipContent>
                    </Tooltip>
                  ) : (
                    tag.name || "-"
                  )}
                </TableCell>

                <TableCell className=" border-r  border-gray-200 text-xs text-center">
                  {tag.description || "-"}
                </TableCell>

                <TableCell className="text-xs text-center w-[150px]">
                  <div className="flex flex-row items-center justify-center ">
                    {/* Check if it's the ALL tag to disable buttons */}
                    {tag.name.toUpperCase() === "ALL" ? (
                      // Protected ALL tag
                      <>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              disabled={true}
                              className="opacity-30 cursor-not-allowed"
                            >
                              <img
                                src="/formEdit.svg"
                                alt="Edit"
                                className="w-4 h-4"
                              />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>This tag cannot be edited</p>
                          </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              disabled={true}
                              className="opacity-30 cursor-not-allowed"
                            >
                              <img
                                src="/trash-red.svg"
                                alt="Delete"
                                className="w-4 h-4"
                              />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>This tag cannot be deleted</p>
                          </TooltipContent>
                        </Tooltip>
                      </>
                    ) : (
                      // Regular tags
                      <>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openHandleEdit(tag.id)}
                            >
                              <img
                                src="/formEdit.svg"
                                alt="Edit"
                                className="w-4 h-4"
                              />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Edit</p>
                          </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openHandleDelete(tag.id)}
                            >
                              <img
                                src="/trash-red.svg"
                                alt="Delete"
                                className="w-4 h-4"
                              />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Delete</p>
                          </TooltipContent>
                        </Tooltip>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        )}
      </Table>
      {/* Show message when no tags are found except the "ALL" tag */}
      {tagDetails.length === 0 ||
        (tagDetails.length === 1 &&
          tagDetails[0].name.toUpperCase() === "ALL" &&
          !loading && (
            <div className="w-full h-full flex justify-center items-center absolute left-0 top-0 z-50  rounded-[10px]">
              <p className="text-gray-500 italic">No tags created or found</p>
            </div>
          ))}
    </>
  );
}
