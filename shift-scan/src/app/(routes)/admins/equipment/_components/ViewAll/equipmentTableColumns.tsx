"use client";

import { ColumnDef } from "@tanstack/react-table";
import { EquipmentSummary } from "../useEquipmentData";
import { format } from "date-fns";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

// Define the column configuration
export const equipmentTableColumns: ColumnDef<EquipmentSummary>[] = [
  {
    accessorKey: "name",
    header: "Name & Description",
    cell: ({ row }) => {
      const equipment = row.original;
      return (
        <div className="flex flex-col gap-1 text-left">
          <p className="text-xs">{equipment.name || " "}</p>
          <p className="text-[10px] text-gray-400 italic">
            {equipment.description || "No description available"}
          </p>
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) => {
      return (
        <div className="text-xs text-center">
          {format(new Date(row.original.createdAt), "MM/dd/yy") || " "}
        </div>
      );
    },
  },
  {
    accessorKey: "equipmentVehicleInfo.make",
    header: "Make",
    cell: ({ row }) => {
      return (
        <div className="text-xs text-center">
          {row.original.equipmentVehicleInfo?.make || " "}
        </div>
      );
    },
  },
  {
    accessorKey: "equipmentVehicleInfo.model",
    header: "Model",
    cell: ({ row }) => {
      return (
        <div className="text-xs text-center">
          {row.original.equipmentVehicleInfo?.model || " "}
        </div>
      );
    },
  },
  {
    accessorKey: "equipmentVehicleInfo.year",
    header: "Year",
    cell: ({ row }) => {
      return (
        <div className="text-xs text-center">
          {row.original.equipmentVehicleInfo?.year || " "}
        </div>
      );
    },
  },
  {
    accessorKey: "updatedAt",
    header: "Updated At",
    cell: ({ row }) => {
      return (
        <div className="text-xs text-center">
          {format(new Date(row.original.updatedAt), "MM/dd/yy") || " "}
        </div>
      );
    },
  },
  {
    accessorKey: "equipmentTag",
    header: "Eq. Type",
    cell: ({ row }) => {
      const tag = row.original.equipmentTag;
      return (
        <div className="text-xs text-center">
          <span className="bg-orange-300 px-3 py-1 rounded-xl">
            {tag ? tag.charAt(0) + tag.slice(1).toLowerCase() : " "}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "state",
    header: "Eq. State",
    cell: ({ row }) => {
      const state = row.original.state;
      return (
        <div className="text-xs text-center">
          {state === "AVAILABLE" ? (
            <span className="bg-blue-300/70 px-3 py-1 rounded-xl">
              {state.slice(0, 1) + state.slice(1).toLowerCase()}
            </span>
          ) : state === "MAINTENANCE" ? (
            <span className="bg-blue-400/70 px-3 py-1 rounded-xl">
              {state.slice(0, 1) + state.slice(1).toLowerCase()}
            </span>
          ) : state === "IN_USE" ? (
            <span className="bg-orange-200 px-3 py-1 rounded-xl">
              {state.slice(0, 1) + state.slice(1).toLowerCase()}
            </span>
          ) : state === "NEEDS_REPAIR" ? (
            <span className="bg-red-300/90 px-3 py-1 rounded-xl">
              {state.slice(0, 1) + state.slice(1).toLowerCase()}
            </span>
          ) : (
            <span className="bg-slate-300 px-3 py-1 rounded-xl">
              {state.slice(0, 1) + state.slice(1).toLowerCase()}
            </span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "approvalStatus",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.approvalStatus;
      return (
        <div className="text-xs text-center min-w-[50px]">
          <Tooltip>
            <TooltipTrigger asChild>
              {status === "PENDING" ? (
                <span className="inline-flex items-center justify-center w-6 h-6 bg-yellow-300 rounded-full cursor-pointer font-semibold">
                  P
                </span>
              ) : status === "DRAFT" ? (
                <span className="inline-flex items-center justify-center w-6 h-6 bg-sky-200 rounded-full cursor-pointer font-semibold">
                  P
                </span>
              ) : status === "APPROVED" ? (
                <span className="inline-flex items-center justify-center w-6 h-6 bg-green-300 rounded-full cursor-pointer font-semibold">
                  A
                </span>
              ) : (
                <span className="inline-flex items-center justify-center w-6 h-6 bg-red-300 rounded-full cursor-pointer font-semibold">
                  R
                </span>
              )}
            </TooltipTrigger>
            <TooltipContent>
              {status === "PENDING"
                ? "Pending"
                : status === "DRAFT"
                  ? "In Progress"
                  : status === "APPROVED"
                    ? "Approved"
                    : "Rejected"}
            </TooltipContent>
          </Tooltip>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      // This is a placeholder - actual implementation will be in the DataTable component
      return (
        <div className="flex flex-row justify-center items-center">
          {/* Action buttons will be replaced */}
        </div>
      );
    },
  },
];
