import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EquipmentSummary } from "./useEquipmentData";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function EquipmentTable({
  loading,
  equipmentDetails,
  openHandleQr,
  openHandleDelete,
  openHandleEdit,
  showPendingOnly,
}: {
  loading: boolean;
  equipmentDetails: EquipmentSummary[];
  openHandleQr: (id: string) => void;
  openHandleDelete: (id: string) => void;
  openHandleEdit: (id: string) => void;
  showPendingOnly: boolean;
}) {
  const header = [
    // "ID",
    "Name & Description",
    "Created",
    "Make",
    "Model",
    "Year",
    "Updated At",
    "Eq. Type",
    "Eq. State",
    "Status",
    "Actions",
  ];

  return (
    <>
      <Table className="w-full">
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
            {Array.from({ length: 10 }).map((_, rowIdx) => (
              <TableRow
                key={rowIdx}
                className={rowIdx % 2 === 0 ? "bg-white" : "bg-gray-100"}
              >
                {/* Name & Description */}
                <TableCell className="border-r border-gray-200 text-xs text-center">
                  <div className="flex flex-col gap-1">
                    <Skeleton className="h-4 w-3/4 mx-auto" />
                    <Skeleton className="h-4 w-1/2 mx-auto" />
                  </div>
                </TableCell>
                {/* Created */}
                <TableCell className="border-r border-gray-200 text-xs text-center">
                  <Skeleton className="h-4 w-1/2 mx-auto" />
                </TableCell>
                {/* Make */}
                <TableCell className="border-r border-gray-200 text-xs text-center">
                  <Skeleton className="h-4 w-3/4 mx-auto" />
                </TableCell>
                {/* Model */}
                <TableCell className="border-r border-gray-200 text-xs text-center">
                  <Skeleton className="h-4 w-3/4 mx-auto" />
                </TableCell>
                {/* Year */}
                <TableCell className="border-r border-gray-200 text-xs text-center">
                  <Skeleton className="h-4 w-1/2 mx-auto" />
                </TableCell>
                {/* Updated At */}
                <TableCell className="border-r border-gray-200 text-xs text-center">
                  <Skeleton className="h-4 w-1/2 mx-auto" />
                </TableCell>
                {/* Equipment Type */}
                <TableCell className="border-r border-gray-200 text-xs text-center">
                  <Skeleton className="h-5 w-20 rounded-md mx-auto" />
                </TableCell>
                {/* Equipment State */}
                <TableCell className="border-r border-gray-200 text-xs text-center">
                  <Skeleton className="h-5 w-20 rounded-md mx-auto" />
                </TableCell>
                {/* Status */}
                <TableCell className="border-r border-gray-200 text-xs text-center">
                  <Skeleton className="h-5 w-5 rounded-full mx-auto" />
                </TableCell>
                {/* Actions (QR, Edit, Delete buttons) */}
                <TableCell className="text-xs text-center">
                  <div className="flex flex-row items-center justify-center gap-2">
                    <Skeleton className="h-6 w-6 rounded-full" />
                    <Skeleton className="h-6 w-6 rounded-full" />
                    <Skeleton className="h-6 w-6 rounded-full" />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        ) : (
          <TableBody className="divide-y divide-gray-200 bg-white">
            {equipmentDetails.map((equipment) => (
              <TableRow
                className="odd:bg-white even:bg-gray-100 "
                key={equipment.id}
              >
                <TableCell className=" border-r border-gray-200 text-xs text-center">
                  <div className="flex flex-col gap-1 text-left">
                    <p>{equipment.name || " "}</p>
                    <p className="text-[10px] text-gray-400 italic">
                      {equipment.description || "No description available"}
                    </p>
                  </div>
                </TableCell>
                <TableCell className="border-r border-gray-200  text-xs text-center">
                  {format(equipment.createdAt, "MM/dd/yy") || " "}
                </TableCell>
                <TableCell className=" border-r border-gray-200 text-xs text-center">
                  {equipment.equipmentVehicleInfo?.make || " "}
                </TableCell>
                <TableCell className=" border-r border-gray-200 text-xs text-center">
                  {equipment.equipmentVehicleInfo?.model || " "}
                </TableCell>
                <TableCell className=" border-r border-gray-200 text-xs text-center">
                  {equipment.equipmentVehicleInfo?.year || " "}
                </TableCell>

                <TableCell className="border-r border-gray-200 text-xs text-center">
                  {format(equipment.updatedAt, "MM/dd/yy") || " "}
                </TableCell>
                <TableCell className=" border-r border-gray-200 text-xs text-center">
                  <span className="bg-orange-300 px-3 py-1 rounded-xl">
                    {equipment.equipmentTag
                      ? equipment.equipmentTag.charAt(0) +
                        equipment.equipmentTag.slice(1).toLowerCase()
                      : " "}
                  </span>
                </TableCell>
                <TableCell className="border-r border-gray-200 text-xs text-center">
                  {equipment.state === "AVAILABLE" ? (
                    <span className="bg-blue-300/70 px-3 py-1 rounded-xl">
                      {equipment.state.slice(0, 1) +
                        equipment.state.slice(1).toLowerCase()}
                    </span>
                  ) : equipment.state === "MAINTENANCE" ? (
                    <span className="bg-blue-400/70 px-3 py-1 rounded-xl">
                      {equipment.state.slice(0, 1) +
                        equipment.state.slice(1).toLowerCase()}
                    </span>
                  ) : equipment.state === "IN_USE" ? (
                    <span className="bg-orange-200 px-3 py-1 rounded-xl">
                      {equipment.state.slice(0, 1) +
                        equipment.state.slice(1).toLowerCase()}
                    </span>
                  ) : equipment.state === "NEEDS_REPAIR" ? (
                    <span className="bg-red-300/90 px-3 py-1 rounded-xl">
                      {equipment.state.slice(0, 1) +
                        equipment.state.slice(1).toLowerCase()}
                    </span>
                  ) : (
                    <span className="bg-slate-300 px-3 py-1 rounded-xl">
                      {equipment.state.slice(0, 1) +
                        equipment.state.slice(1).toLowerCase()}
                    </span>
                  )}
                </TableCell>
                <TableCell className="border-r border-gray-200 text-xs text-center min-w-[50px]">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      {equipment.approvalStatus === "PENDING" ? (
                        <span className="inline-flex items-center justify-center w-6 h-6 bg-yellow-300 rounded-full cursor-pointer font-semibold">
                          P
                        </span>
                      ) : equipment.approvalStatus === "DRAFT" ? (
                        <span className="inline-flex items-center justify-center w-6 h-6 bg-sky-200 rounded-full cursor-pointer font-semibold">
                          P
                        </span>
                      ) : equipment.approvalStatus === "APPROVED" ? (
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
                      {equipment.approvalStatus === "PENDING"
                        ? "Pending"
                        : equipment.approvalStatus === "DRAFT"
                          ? "In Progress"
                          : equipment.approvalStatus === "APPROVED"
                            ? "Approved"
                            : "Rejected"}
                    </TooltipContent>
                  </Tooltip>
                </TableCell>
                <TableCell className="text-xs text-center">
                  <div className="flex flex-row justify-center ">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openHandleQr(equipment.id)}
                        >
                          <img
                            src="/qrCode.svg"
                            alt="Edit"
                            className="w-4 h-4"
                          />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Print QR Code</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openHandleEdit(equipment.id)}
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
                          onClick={() => openHandleDelete(equipment.id)}
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
      {equipmentDetails.length === 0 && !loading && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
          {showPendingOnly && (
            <p className="text-base text-slate-400 ">
              No pending equipment found
            </p>
          )}
          {!showPendingOnly && (
            <p className="text-base text-slate-400 ">No equipment found</p>
          )}
        </div>
      )}
    </>
  );
}
