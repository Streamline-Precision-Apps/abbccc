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
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => {
      const equipment = row.original;
      return (
        <div className="text-xs text-center min-w-[50px]">
          {equipment.code || " "}
        </div>
      );
    },
  },
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
    accessorKey: "memo",
    header: "Memo",
    cell: ({ row }) => {
      const equipment = row.original;
      return (
        <div className="text-xs text-center text-gray-400 italic min-w-[120px]">
          {equipment.memo || ""}
        </div>
      );
    },
  },
  {
    accessorKey: "ownershipType",
    header: "Ownership",
    cell: ({ row }) => {
      const ownershipType = row.original.ownershipType;
      return (
        <div className="text-xs text-center">
          <span
            className={`px-2 py-1 rounded-lg text-xs ${
              ownershipType === "OWNED"
                ? "bg-blue-100 text-blue-800"
                : ownershipType === "LEASED"
                  ? "bg-purple-100 text-purple-800"
                  : ""
            }`}
          >
            {ownershipType || " "}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "make",
    header: "Manufacturer",
    cell: ({ row }) => {
      return (
        <div className="text-xs text-center">{row.original.make || " "}</div>
      );
    },
  },
  {
    accessorKey: "model",
    header: "Model",
    cell: ({ row }) => {
      return (
        <div className="text-xs text-center">{row.original.model || " "}</div>
      );
    },
  },
  {
    accessorKey: "year",
    header: "Model Year",
    cell: ({ row }) => {
      return (
        <div className="text-xs text-center">{row.original.year || " "}</div>
      );
    },
  },
  {
    accessorKey: "color",
    header: "Color",
    cell: ({ row }) => {
      return (
        <div className="text-xs text-center">{row.original.color || " "}</div>
      );
    },
  },
  {
    accessorKey: "serialNumber",
    header: "Equipment Serial Number",
    cell: ({ row }) => {
      return (
        <div className="text-xs text-center">
          {row.original.serialNumber || " "}
        </div>
      );
    },
  },
  {
    accessorKey: "acquiredDate",
    header: "Acquired Date",
    cell: ({ row }) => {
      return (
        <div className="text-xs text-center">
          {row.original.acquiredDate
            ? format(new Date(row.original.acquiredDate), "MM/dd/yy")
            : " "}
        </div>
      );
    },
  },
  {
    accessorKey: "acquiredCondition",
    header: "Acquired Condition",
    cell: ({ row }) => {
      const condition = row.original.acquiredCondition;
      return (
        <div className="text-xs text-center">
          <span
            className={`px-2 py-1 rounded-lg text-xs ${
              condition === "NEW"
                ? "bg-green-100 text-green-800"
                : condition === "USED"
                  ? "bg-amber-100 text-amber-800"
                  : ""
            }`}
          >
            {condition || " "}
          </span>
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
    accessorKey: "licenseNumber",
    header: "License Number",
    cell: ({ row }) => {
      return (
        <div className="text-xs text-center">
          {row.original.licensePlate || " "}
        </div>
      );
    },
  },
  {
    accessorKey: "licenseState",
    header: "License State",
    cell: ({ row }) => {
      return (
        <div className="text-xs text-center">
          {row.original.licenseState || " "}
        </div>
      );
    },
  },

  {
    accessorKey: "state",
    header: "Equipment State",
    cell: ({ row }) => {
      const state = row.original.state;
      return (
        <div className="text-xs text-center">
          <Tooltip>
            <TooltipTrigger asChild>
              <span
                className={`px-2 py-1 rounded-lg text-xs ${
                  state === "AVAILABLE"
                    ? "bg-green-100 text-green-800"
                    : state === "IN_USE"
                      ? "bg-blue-100 text-blue-800"
                      : state === "MAINTENANCE"
                        ? "bg-yellow-100 text-yellow-800"
                        : state === "NEEDS_REPAIR"
                          ? "bg-orange-100 text-orange-800"
                          : "bg-red-100 text-red-800"
                }`}
              >
                {state ? state.replace("_", " ") : " "}
              </span>
            </TooltipTrigger>
            <TooltipContent>
              {state === "AVAILABLE"
                ? "Equipment is available for use"
                : state === "IN_USE"
                  ? "Equipment is currently in use"
                  : state === "MAINTENANCE"
                    ? "Equipment is under maintenance"
                    : state === "NEEDS_REPAIR"
                      ? "Equipment needs repair"
                      : "Equipment is retired"}
            </TooltipContent>
          </Tooltip>
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
