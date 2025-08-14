"use client";

import { ColumnDef } from "@tanstack/react-table";
import { PersonnelSummary } from "../usePersonnelData";
import { format } from "date-fns";
import { formatPhoneNumber } from "@/utils/phoneNumberFormater";
import { UserX } from "lucide-react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

// Define the column configuration
export const personnelTableColumns: ColumnDef<PersonnelSummary>[] = [
  {
    accessorKey: "name",
    header: "Employee",
    cell: ({ row }) => {
      const personnel = row.original;
      return (
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="flex-shrink-0">
            {personnel.image ? (
              <img
                src={personnel.image}
                alt={`${personnel.firstName} ${personnel.lastName}`}
                className="h-10 w-10 rounded-full border border-slate-300 object-cover"
              />
            ) : (
              <div className="h-10 w-10 rounded-full border border-slate-300 flex items-center justify-center bg-gray-50">
                <span className="text-[10px] text-gray-400 text-center leading-tight whitespace-pre-line">
                  {"No\nImg"}
                </span>
              </div>
            )}
          </div>
          {/* Info & Status */}
          <div className="flex flex-col items-start flex-1 min-w-0">
            <span className="text-black text-sm truncate">
              {`${personnel.firstName} ${personnel.middleName ? personnel.middleName : ""} ${personnel.lastName} ${personnel.secondLastName ? personnel.secondLastName : ""}`
                .replace(/\s+/g, " ")
                .trim()}
            </span>
            <span
              className={`block ${personnel.terminationDate ? "text-gray-500" : "text-emerald-600"} text-[10px]`}
            >
              {personnel.terminationDate ? "Inactive" : "Active"}
            </span>
          </div>

          {!personnel.accountSetup && (
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="ml-2 bg-white border border-gray-300 rounded-md px-2 py-1 flex items-center">
                  <UserX className="h-4 w-4 text-red-400" />
                </div>
              </TooltipTrigger>
              <TooltipContent side="top">Account Not Set Up</TooltipContent>
            </Tooltip>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "username",
    header: "Username",
    cell: ({ row }) => {
      return (
        <div className="text-xs text-center">
          {row.original.username ? row.original.username : ""}
        </div>
      );
    },
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => {
      return (
        <div className="text-xs text-center">
          {row.original.email ? row.original.email : ""}
        </div>
      );
    },
  },
  {
    accessorKey: "Contact.phoneNumber",
    header: "Phone Number",
    cell: ({ row }) => {
      return (
        <div className="text-xs text-center">
          {formatPhoneNumber(row.original.Contact.phoneNumber)}
        </div>
      );
    },
  },
  {
    accessorKey: "DOB",
    header: "Date of Birth",
    cell: ({ row }) => {
      return (
        <div className="text-xs text-center">
          {row.original.DOB
            ? format(new Date(row.original.DOB), "MM/dd/yyyy")
            : ""}
        </div>
      );
    },
  },
  {
    accessorKey: "Contact.emergencyContact",
    header: "Emergency Contact",
    cell: ({ row }) => {
      const personnel = row.original;
      return (
        <div className="text-xs text-center">
          {`${personnel.Contact.emergencyContact ? personnel.Contact.emergencyContact + "-" : ""} ${personnel.Contact.emergencyContactNumber ? formatPhoneNumber(personnel.Contact.emergencyContactNumber) : ""}`}
        </div>
      );
    },
  },
  {
    accessorKey: "permission",
    header: "Access Level",
    cell: ({ row }) => {
      const permission = row.original.permission;
      return (
        <div className="text-xs text-left">
          {permission.slice(0, 1) + permission.slice(1).toLowerCase()}
        </div>
      );
    },
  },
  {
    accessorKey: "roles",
    header: "Role(s)",
    cell: ({ row }) => {
      const personnel = row.original;
      return (
        <div className="flex flex-row gap-1 justify-center">
          {personnel.truckView && (
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="bg-emerald-300 rounded-full px-2 py-1">
                  <p className="text-xs">{"T"}</p>
                </div>
              </TooltipTrigger>
              <TooltipContent>Trucking</TooltipContent>
            </Tooltip>
          )}
          {personnel.tascoView && (
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="bg-red-300 rounded-full px-2 py-1">
                  <p className="text-xs">{"TS"}</p>
                </div>
              </TooltipTrigger>
              <TooltipContent>Tasco</TooltipContent>
            </Tooltip>
          )}
          {personnel.mechanicView && (
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="bg-blue-400 rounded-full px-2 py-1">
                  <p className="text-xs">{"M"}</p>
                </div>
              </TooltipTrigger>
              <TooltipContent>Mechanic</TooltipContent>
            </Tooltip>
          )}
          {personnel.laborView && (
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="bg-sky-300 rounded-full px-2 py-1">
                  <p className="text-xs">{"G"}</p>
                </div>
              </TooltipTrigger>
              <TooltipContent>General</TooltipContent>
            </Tooltip>
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
