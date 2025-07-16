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

export default function TagTable({
  tagDetails,
  openHandleDelete,
  openHandleEdit,
}: {
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
            <TableHead className="text-sm text-center border-r border-gray-200 bg-gray-100 w-[300px]">
              ID
            </TableHead>
            {header.map((h) => (
              <TableHead
                key={h}
                className="text-sm text-center border-r border-gray-200 bg-gray-100"
              >
                {h}
              </TableHead>
            ))}
            <TableHead className="text-sm text-center bg-gray-100 w-[150px]">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tagDetails.map((tag) => (
            <TableRow className="odd:bg-white even:bg-gray-100 " key={tag.id}>
              <>
                {tag.name !== "All" && (
                  <>
                    <TableCell className=" border-r border-gray-200 text-xs text-center w-[300px] ">
                      {tag.id || "-"}
                    </TableCell>
                    <TableCell className=" border-r border-gray-200 text-xs text-center">
                      {tag.name || "-"}
                    </TableCell>

                    <TableCell className=" border-r border-gray-200 text-xs text-center">
                      {tag.description || "-"}
                    </TableCell>

                    <TableCell className="text-xs text-center w-[150px]">
                      <div className="flex flex-row items-center justify-center ">
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
                      </div>
                    </TableCell>
                  </>
                )}
              </>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {/* Show message when no tags are except the default "All" tag */}
      {tagDetails.length === 1 && (
        <div className="w-full h-full flex justify-center items-center absolute left-0 top-0 z-50  rounded-[10px]">
          <p className="text-gray-500 italic">No tags created or found</p>
        </div>
      )}
    </>
  );
}
