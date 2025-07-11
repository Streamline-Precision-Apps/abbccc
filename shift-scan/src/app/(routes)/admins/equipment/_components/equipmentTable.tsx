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
}: {
  equipmentDetails: EquipmentSummary[];
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
        <TableRow className="text-sm">
          {header.map((h) => (
            <TableHead key={h}>{h}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {equipmentDetails.map((equipment) => (
          <TableRow
            className="text-xs odd:bg-gray-100 even:bg-white"
            key={equipment.id}
          >
            <TableCell className="">{equipment.id}</TableCell>
            <TableCell>{equipment.name}</TableCell>
            <TableCell>{equipment.description}</TableCell>
            <TableCell>{equipment.equipmentVehicleInfo?.make}</TableCell>
            <TableCell>{equipment.equipmentVehicleInfo?.model}</TableCell>
            <TableCell>{equipment.equipmentVehicleInfo?.year}</TableCell>
            <TableCell>{equipment.equipmentTag}</TableCell>
            <TableCell>{equipment.state}</TableCell>
            <TableCell>{equipment.approvalStatus}</TableCell>
            <TableCell>{format(equipment.createdAt, "MM/dd/yy")}</TableCell>
            <TableCell>{format(equipment.updatedAt, "MM/dd/yy")}</TableCell>
            <TableCell>
              <div className="flex flex-row ">
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
