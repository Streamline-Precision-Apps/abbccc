"use Client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { PersonnelSummary } from "./usePersonnelData";
import { formatPhoneNumber } from "@/utils/phoneNumberFormater";
import { UserX } from "lucide-react";
import { format } from "date-fns";

export default function UserTable({
  loading,
  personnelDetails = [],
  openHandleDelete,
  openHandleEdit,
  showInactive,
}: {
  loading: boolean;
  personnelDetails: PersonnelSummary[];
  openHandleDelete: (id: string) => void;
  openHandleEdit: (id: string) => void;
  showInactive: boolean;
}) {
  const header = [
    "Employee",
    "Username",
    "Email",
    "Phone Number",
    "Date of Birth",
    "Emergency Contact",
    "Permission",
    "Current Roles",
    "Actions",
  ];

  return (
    <>
      <Table className="w-full mb-10">
        <TableHeader>
          <TableRow>
            {header.map((h) => (
              <TableHead
                key={h}
                className="text-sm text-center border-r border-gray-200 bg-gray-100 sticky top-0 z-10"
              >
                {h}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        {loading ? (
          <TableBody className="divide-y divide-gray-200 bg-white">
            {Array.from({ length: 12 }).map((_, rowIdx) => (
              <TableRow
                key={rowIdx}
                className={rowIdx % 2 === 0 ? "bg-white" : "bg-gray-100"}
              >
                {/* User cell skeleton (matches new layout) */}
                <TableCell className="border-r border-gray-200 text-xs text-center">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0">
                      <Skeleton className="h-10 w-10 rounded-full" />
                    </div>
                    <div className="flex flex-col items-start flex-1 min-w-0">
                      <Skeleton className="h-4 w-24 mb-1" />
                      <Skeleton className="h-3 w-12" />
                    </div>
                    <div className="ml-2">
                      <Skeleton className="h-4 w-4 rounded" />
                    </div>
                  </div>
                </TableCell>
                {/* Email */}
                <TableCell className="border-r border-gray-200 text-xs text-center">
                  <Skeleton className="h-4 w-20 mx-auto" />
                </TableCell>
                {/* Phone Number */}
                <TableCell className="border-r border-gray-200 text-xs text-center">
                  <Skeleton className="h-4 w-16 mx-auto" />
                </TableCell>
                {/* Emergency Contact */}
                <TableCell className="border-r border-gray-200 text-xs text-center">
                  <Skeleton className="h-4 w-20 mx-auto" />
                </TableCell>
                {/* Permission */}
                <TableCell className="border-r border-gray-200 text-xs text-center">
                  <Skeleton className="h-4 w-12 mx-auto" />
                </TableCell>
                {/* Current Roles */}
                <TableCell className="border-r border-gray-200 text-xs text-center">
                  <div className="flex flex-row gap-1 justify-center">
                    <Skeleton className="h-5 w-8 rounded-md" />
                    <Skeleton className="h-5 w-8 rounded-md" />
                    <Skeleton className="h-5 w-8 rounded-md" />
                  </div>
                </TableCell>
                {/* Account Setup */}
                <TableCell className="border-r border-gray-200 text-xs text-center">
                  <Skeleton className="h-4 w-8 mx-auto rounded" />
                </TableCell>
                {/* Actions */}
                <TableCell className="text-xs text-center">
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
            {personnelDetails.map((personnel) => (
              <TableRow
                className="odd:bg-white even:bg-gray-100 "
                key={personnel.id}
              >
                <TableCell className="border-r border-gray-200 text-xs text-center">
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
                        <TooltipContent side="top">
                          Account Not Set Up
                        </TooltipContent>
                      </Tooltip>
                    )}
                  </div>
                </TableCell>
                <TableCell className=" border-r border-gray-200 text-xs text-center">
                  {personnel.username ? personnel.username : ""}
                </TableCell>
                <TableCell className=" border-r border-gray-200 text-xs text-center">
                  {personnel.email ? personnel.email : ""}
                </TableCell>
                <TableCell className=" border-r border-gray-200 text-xs text-center">
                  {formatPhoneNumber(personnel.Contact.phoneNumber)}
                </TableCell>
                <TableCell className=" border-r border-gray-200 text-xs text-center">
                  {personnel.DOB ? format(personnel.DOB, "MM/dd/yyyy") : ""}
                </TableCell>
                <TableCell className=" border-r border-gray-200 text-xs text-center">
                  {`${personnel.Contact.emergencyContact ? personnel.Contact.emergencyContact + "-" : ""} ${personnel.Contact.emergencyContactNumber ? formatPhoneNumber(personnel.Contact.emergencyContactNumber) : ""}`}
                </TableCell>
                <TableCell className=" border-r border-gray-200 text-xs text-center">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="bg-emerald-300 px-2 py-1 rounded-md">
                        {personnel.permission.slice(0, 1)}
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      {personnel.permission.slice(0, 1) +
                        personnel.permission.slice(1).toLowerCase()}
                    </TooltipContent>
                  </Tooltip>
                </TableCell>
                <TableCell className=" border-r border-gray-200 text-xs text-center">
                  <div className="flex flex-row gap-1 justify-center">
                    {personnel.truckView && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="bg-blue-300 rounded-md px-2 py-1">
                            <p className="text-xs">{"TR"}</p>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>Trucking Role</TooltipContent>
                      </Tooltip>
                    )}
                    {personnel.tascoView && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="bg-blue-300 rounded-md px-2 py-1">
                            <p className="text-xs">{"TS"}</p>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>Tasco Role</TooltipContent>
                      </Tooltip>
                    )}
                    {personnel.mechanicView && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="bg-blue-300 rounded-md px-2 py-1">
                            <p className="text-xs">{"M"}</p>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>Mechanic Role</TooltipContent>
                      </Tooltip>
                    )}
                    {personnel.laborView && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="bg-blue-300 rounded-md px-2 py-1">
                            <p className="text-xs">{"G"}</p>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>General Role</TooltipContent>
                      </Tooltip>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-xs text-center">
                  <div className="flex flex-row items-center justify-center ">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openHandleEdit(personnel.id)}
                        >
                          <img
                            src="/formEdit.svg"
                            alt="Edit"
                            className="w-4 h-4"
                          />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Edit</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openHandleDelete(personnel.id)}
                        >
                          <img
                            src="/trash-red.svg"
                            alt="Delete"
                            className="w-4 h-4"
                          />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Delete</TooltipContent>
                    </Tooltip>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        )}
      </Table>
      {personnelDetails.length === 0 && !loading && (
        <div className="w-full h-full flex justify-center items-center absolute left-0 top-0 z-50  rounded-[10px]">
          {showInactive ? (
            <p className="text-gray-500 italic">No Inactive Personnel.</p>
          ) : (
            <>
              <p className="text-gray-500 italic">No Personnel found.</p>
              <p className="text-gray-500 italic">
                Click Plus to add new Personnel.
              </p>
            </>
          )}
        </div>
      )}
    </>
  );
}
