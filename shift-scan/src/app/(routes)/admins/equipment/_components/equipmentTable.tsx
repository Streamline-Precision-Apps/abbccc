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

export default function EquipmentTable({
  equipmentDetails,
  openHandleDelete,
  openHandleEdit,
  openHandleQr,
}: {
  equipmentDetails: EquipmentSummary[];
  openHandleQr: (id: string) => void;
  openHandleDelete: (id: string) => void;
  openHandleEdit: (id: string) => void;
}) {
  const header = [
    "ID",
    "Name",
    "Description",
    "Vehicle Make",
    "Vehicle Model",
    "Vehicle Year",
    "Equipment Type",
    "Equipment State",
    "Approval Status",
    "Created At",
    "Updated At",
    "Actions",
  ];

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
      <TableBody>
        {equipmentDetails.map((equipment) => (
          <TableRow
            className="odd:bg-white even:bg-gray-100 "
            key={equipment.id}
          >
            <TableCell className=" border-r border-gray-200 text-xs text-center">
              {equipment.id}
            </TableCell>
            <TableCell className=" border-r border-gray-200 text-xs text-center">
              {equipment.name}
            </TableCell>
            <TableCell className=" border-r border-gray-200 text-xs text-center">
              {equipment.description}
            </TableCell>
            <TableCell className=" border-r border-gray-200 text-xs text-center">
              {equipment.equipmentVehicleInfo?.make}
            </TableCell>
            <TableCell className=" border-r border-gray-200 text-xs text-center">
              {equipment.equipmentVehicleInfo?.model}
            </TableCell>
            <TableCell className=" border-r border-gray-200 text-xs text-center">
              {equipment.equipmentVehicleInfo?.year}
            </TableCell>
            <TableCell className=" border-r border-gray-200 text-xs text-center">
              {equipment.equipmentTag}
            </TableCell>
            <TableCell className="border-r border-gray-200 text-xs text-center">
              {equipment.state}
            </TableCell>
            <TableCell className="text-xs border-r border-gray-200 text-center">
              {equipment.approvalStatus}
            </TableCell>
            <TableCell className="border-r border-gray-200  text-xs text-center">
              {format(equipment.createdAt, "MM/dd/yy")}
            </TableCell>
            <TableCell className="border-r border-gray-200 text-xs text-center">
              {format(equipment.updatedAt, "MM/dd/yy")}
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
                  <img src="/trash-red.svg" alt="Delete" className="w-4 h-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
