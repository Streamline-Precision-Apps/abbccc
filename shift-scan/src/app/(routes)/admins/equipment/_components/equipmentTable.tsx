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

export default function EquipmentTable({
  loading,
  equipmentDetails,
  openHandleDelete,
  openHandleEdit,
}: {
  loading: boolean;
  equipmentDetails: EquipmentSummary[];
  openHandleQr: (id: string) => void;
  openHandleDelete: (id: string) => void;
  openHandleEdit: (id: string) => void;
}) {
  const header = [
    "ID",
    "Name",
    "Description",
    "Make",
    "Model",
    "Year",
    "Equipment Type",
    "Equipment State",
    "Approval Status",
    "Created At",
    "Updated At",
    "Actions",
  ];

  function openHandleQr(id: string): void {
    throw new Error("Function not implemented.");
  }

  return (
    <Table className="w-full">
      <TableHeader>
        <TableRow>
          {header.map((h) => (
            <TableHead
              key={h}
              className="text-sm text-center border-r border-gray-200 bg-gray-100"
            >
              {h}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      {loading ? (
        <TableBody className="divide-y divide-gray-200 bg-white">
          {Array.from({ length: 20 }).map((_, rowIdx) => (
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
              {/* Equipment Type */}
              <TableCell className="border-r border-gray-200 text-xs text-center">
                <Skeleton className="h-4 w-3/4 mx-auto" />
              </TableCell>
              {/* Equipment State */}
              <TableCell className="border-r border-gray-200 text-xs text-center">
                <Skeleton className="h-4 w-3/4 mx-auto" />
              </TableCell>
              {/* Approval Status */}
              <TableCell className="border-r border-gray-200 text-xs text-center">
                <Skeleton className="h-4 w-1/2 mx-auto" />
              </TableCell>
              {/* Created At */}
              <TableCell className="border-r border-gray-200 text-xs text-center">
                <Skeleton className="h-4 w-1/2 mx-auto" />
              </TableCell>
              {/* Updated At */}
              <TableCell className="border-r border-gray-200 text-xs text-center">
                <Skeleton className="h-4 w-1/2 mx-auto" />
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
                {equipment.id || "-"}
              </TableCell>
              <TableCell className=" border-r border-gray-200 text-xs text-center">
                {equipment.name || "-"}
              </TableCell>
              <TableCell className=" border-r border-gray-200 text-xs text-center">
                {equipment.description || "-"}
              </TableCell>
              <TableCell className=" border-r border-gray-200 text-xs text-center">
                {equipment.equipmentVehicleInfo?.make || "-"}
              </TableCell>
              <TableCell className=" border-r border-gray-200 text-xs text-center">
                {equipment.equipmentVehicleInfo?.model || "-"}
              </TableCell>
              <TableCell className=" border-r border-gray-200 text-xs text-center">
                {equipment.equipmentVehicleInfo?.year || "-"}
              </TableCell>
              <TableCell className=" border-r border-gray-200 text-xs text-center">
                {equipment.equipmentTag || "-"}
              </TableCell>
              <TableCell className="border-r border-gray-200 text-xs text-center">
                {equipment.state || "-"}
              </TableCell>
              <TableCell className="text-xs border-r border-gray-200 text-center">
                {equipment.approvalStatus || "-"}
              </TableCell>
              <TableCell className="border-r border-gray-200  text-xs text-center">
                {format(equipment.createdAt, "MM/dd/yy") || "-"}
              </TableCell>
              <TableCell className="border-r border-gray-200 text-xs text-center">
                {format(equipment.updatedAt, "MM/dd/yy") || "-"}
              </TableCell>
              <TableCell className="text-xs text-center">
                <div className="flex flex-row ">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openHandleQr(equipment.id)}
                  >
                    <img src="/qrCode.svg" alt="Edit" className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openHandleEdit(equipment.id)}
                  >
                    <img src="/formEdit.svg" alt="Edit" className="w-4 h-4" />
                  </Button>
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
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      )}
    </Table>
  );
}
