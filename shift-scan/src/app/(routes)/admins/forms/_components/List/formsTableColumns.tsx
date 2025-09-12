import { ColumnDef } from "@tanstack/react-table";
import { FormItem } from "./hooks/types";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { highlight } from "../../../_pages/higlight";
import Link from "next/link";

// Define the column configuration for the forms table
export const formsTableColumns: ColumnDef<FormItem>[] = [
  {
    accessorKey: "nameAndDescription",
    header: "Name & Description",
    cell: ({ row }) => {
      const form = row.original;
      return (
        <div className="flex flex-col gap-1 text-left">
          <p>{highlight(form.name, "")}</p>
          <p className="text-[10px] text-gray-400 italic">
            {form.description || "No description"}
          </p>
        </div>
      );
    },
  },
  {
    accessorKey: "formType",
    header: "Form Type",
    cell: ({ row }) => {
      return (
        <div className="text-xs text-center">
          <span className="bg-sky-200 px-3 py-1 rounded-xl">
            {row.original.formType}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "submissions",
    header: "Submissions",
    cell: ({ row }) => {
      return (
        <div className="text-sm text-center">
          <Link
            href={`/admins/forms/${row.original.id}`}
            className="text-blue-600 underline-offset-2 decoration-solid underline hover:text-sky-600 cursor-pointer"
          >
            {row.original._count.Submissions}
          </Link>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      return (
        <div className="text-xs text-center">
          <Tooltip>
            <TooltipTrigger asChild>
              {row.original.isActive === "ACTIVE" ? (
                <span className="bg-green-300 px-2 py-1 rounded-xl">A</span>
              ) : row.original.isActive === "DRAFT" ? (
                <span className="bg-yellow-200 px-2 py-1 rounded-xl">D</span>
              ) : (
                <span className="bg-slate-100 px-2 py-1 rounded-xl">I</span>
              )}
            </TooltipTrigger>
            <TooltipContent>
              {row.original.isActive === "ACTIVE"
                ? "Active"
                : row.original.isActive === "DRAFT"
                  ? "Draft"
                  : "Inactive"}
            </TooltipContent>
          </Tooltip>
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Date Created",
    cell: ({ row }) => {
      return (
        <div className="text-xs text-center">
          {row.original.createdAt
            ? new Date(row.original.createdAt).toLocaleDateString()
            : "-"}
        </div>
      );
    },
  },
  {
    accessorKey: "updatedAt",
    header: "Date Updated",
    cell: ({ row }) => {
      return (
        <div className="text-xs text-center">
          {row.original.updatedAt
            ? new Date(row.original.updatedAt).toLocaleDateString()
            : "-"}
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const form = row.original;
      return (
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
                onClick={() => {}} // This would be implemented in the parent component
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
                onClick={() => {}} // This would be implemented in the parent component
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
      );
    },
  },
];
