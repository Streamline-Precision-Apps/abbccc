"use client";

import { ColumnDef } from "@tanstack/react-table";
import { EquipmentSummary } from "../useEquipmentData";
import { format } from "date-fns";
import Link from "next/link";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { highlight } from "@/app/(routes)/admins/_pages/highlight";

// Define the column configuration
export const equipmentTableColumns: ColumnDef<EquipmentSummary>[] = [
  {
    accessorKey: "code",
    header: "ID",
    cell: ({ row, table }) => {
      const equipment = row.original;
      // Get searchTerm from table options (passed as meta)
      const searchTerm = table.options.meta?.searchTerm || "";
      return (
        <div
          className={`text-xs text-center min-w-[50px] ${equipment.code ? "" : "italic text-red-400"}`}
        >
          {highlight(equipment.code || "Pending Registration", searchTerm)}
        </div>
      );
    },
  },
  {
    accessorKey: "nameAndDescription",
    header: "Equipment Summary",
    cell: ({ row, table }) => {
      const equipment = row.original;
      const tag = equipment.equipmentTag;
      const os = equipment.ownershipType;
      const condition = equipment.acquiredCondition;
      const searchTerm = table.options.meta?.searchTerm || "";
      const status = equipment.state;
      const approvalStatus = equipment.approvalStatus;

      return (
        <div className="w-full flex flex-row gap-4 items-center">
          <div className="text-sm flex-1">
            <div className="w-full h-full flex flex-col">
              <div className="flex flex-row gap-4 items-center">
                <p className="">
                  {highlight(equipment.name || "", searchTerm)}
                </p>
                <div className="flex flex-row gap-2 items-center">
                  {/* Approval Status Badge */}
                  {approvalStatus === "APPROVED" ? (
                    <span className="bg-green-100 text-green-600 px-2 py-1 rounded-lg text-xs">
                      Approved
                    </span>
                  ) : approvalStatus === "PENDING" ? (
                    <span className="bg-yellow-100 text-yellow-600 px-2 py-1 rounded-lg text-xs">
                      Pending
                    </span>
                  ) : approvalStatus === "DRAFT" ? (
                    <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded-lg text-xs">
                      Draft
                    </span>
                  ) : (
                    <span className="bg-red-100 text-red-600 px-2 py-1 rounded-lg text-xs">
                      Rejected
                    </span>
                  )}

                  {/* Status Badge */}
                  {status === "AVAILABLE" ? (
                    <span className="bg-green-100 text-green-600 px-2 py-1 rounded-lg text-xs">
                      Available
                    </span>
                  ) : status === "IN_USE" ? (
                    <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded-lg text-xs">
                      In Use
                    </span>
                  ) : status === "MAINTENANCE" ? (
                    <span className="bg-yellow-100 text-yellow-600 px-2 py-1 rounded-lg text-xs">
                      Maintenance
                    </span>
                  ) : status === "NEEDS_REPAIR" ? (
                    <span className="bg-orange-100 text-orange-600 px-2 py-1 rounded-lg text-xs">
                      Needs Repair
                    </span>
                  ) : (
                    <span className="bg-red-100 text-red-600 px-2 py-1 rounded-lg text-xs">
                      Retired
                    </span>
                  )}
                </div>
              </div>

              {/* Equipment tags row */}
              <div className="flex flex-row gap-2 pt-2">
                <div className="text-xs text-left justify-start">
                  <span
                    className={`${
                      tag === "VEHICLE"
                        ? "text-sky-600 bg-sky-100"
                        : tag === "TRUCK"
                          ? "text-blue-600 bg-blue-100"
                          : tag === "TRAILER"
                            ? "text-green-600 bg-green-100"
                            : tag === "EQUIPMENT"
                              ? "text-orange-600 bg-orange-100"
                              : ""
                    } px-2 py-1 text-[10px] rounded-xl`}
                  >
                    {tag ? tag.charAt(0) + tag.slice(1).toLowerCase() : " "}
                  </span>
                </div>
                {condition && (
                  <div className="text-xs text-center">
                    <span
                      className={`px-2 py-1 rounded-lg text-[10px] ${
                        condition === "NEW"
                          ? "bg-green-100 text-green-800"
                          : condition === "USED"
                            ? "bg-amber-100 text-amber-600"
                            : ""
                      }`}
                    >
                      {condition
                        ? condition.charAt(0) + condition.slice(1).toLowerCase()
                        : " "}
                    </span>
                  </div>
                )}
                <div className="text-xs text-left">
                  <span
                    className={`px-2 py-0.5 text-[10px] rounded-lg ${
                      os === "OWNED"
                        ? "bg-indigo-100 text-indigo-600"
                        : os === "LEASED"
                          ? "bg-purple-100 text-purple-600"
                          : os === "RENTAL"
                            ? "bg-cyan-100 text-cyan-600"
                            : ""
                    }`}
                  >
                    {os ? os.charAt(0) + os.slice(1).toLowerCase() : " "}
                  </span>
                </div>
              </div>

              <p className="truncate max-w-[750px] text-[10px] text-left text-gray-400 italic">
                {equipment.description || "No description provided."}
              </p>
            </div>
          </div>
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
        <div className="text-xs text-center text-gray-400 italic max-w-[100px]">
          <Tooltip>
            <TooltipTrigger asChild>
              <p className="whitespace-normal break-words overflow-hidden text-ellipsis line-clamp-2">
                {equipment.memo || ""}
              </p>
            </TooltipTrigger>
            <TooltipContent className="max-w-[300px] whitespace-normal break-words">
              {equipment.memo || ""}
            </TooltipContent>
          </Tooltip>
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
    accessorKey: "linkedTimesheets",
    header: "Linked Timesheets",
    cell: ({ row }) => {
      const equipment = row.original;
      // Calculate total timesheet-related logs
      const totalLogs =
        (equipment._count?.EmployeeEquipmentLogs || 0) +
        (equipment._count?.TascoLogs || 0) +
        (equipment._count?.HauledInLogs || 0) +
        (equipment._count?.UsedAsTrailer || 0) +
        (equipment._count?.UsedAsTruck || 0) +
        (equipment._count?.Maintenance || 0);

      return (
        <div className="text-xs text-center">
          {totalLogs > 0 ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href={`/admins/timesheets?equipmentId=${equipment.id}`}
                  className="cursor-pointer underline decoration-dotted decoration-1 text-sm hover:text-blue-600"
                >
                  {totalLogs}
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">See All Entries</p>
              </TooltipContent>
            </Tooltip>
          ) : (
            "-"
          )}
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
