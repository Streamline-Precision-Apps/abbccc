import { ColumnDef } from "@tanstack/react-table";
import { Notification } from "../../../../../prisma/generated/prisma/client";
import { format } from "date-fns";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FileSymlink } from "lucide-react";

export const notificationTableColumns: ColumnDef<Notification>[] = [
  {
    accessorKey: "createdAt",
    header: "Received At",
    cell: ({ row }) => (
      <div className="text-xs text-center">
        {row.original.createdAt
          ? format(new Date(row.original.createdAt), "Pp")
          : "-"}
      </div>
    ),
  },
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => (
      <div className="truncate max-w-[200px]">{row.original.title}</div>
    ),
  },
  {
    accessorKey: "body",
    header: "Body",
    cell: ({ row }) => (
      <div className="text-xs text-gray-600 truncate max-w-[320px]">
        {row.original.body || "-"}
      </div>
    ),
  },
  {
    accessorKey: "topic",
    header: "Topic",
    cell: ({ row }) => (
      <div className="text-xs text-center">{row.original.topic || "-"}</div>
    ),
  },

  {
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }) =>
      row.original.url ? (
        <div className="flex flex-row justify-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href={
                  row.original.url
                    ? row.original.url.includes("?")
                      ? `${row.original.url}&notificationId=${row.original.id}`
                      : `${row.original.url}?notificationId=${row.original.id}`
                    : "#"
                }
              >
                <Button variant="ghost" size={"icon"}>
                  <FileSymlink
                    className="h-4 w-4 cursor-pointer"
                    strokeWidth={2}
                  />
                </Button>
              </Link>
            </TooltipTrigger>
            <TooltipContent>Begin Task</TooltipContent>
          </Tooltip>
        </div>
      ) : (
        <span className="text-xs text-gray-400"></span>
      ),
  },
];
