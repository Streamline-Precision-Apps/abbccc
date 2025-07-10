import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function EquipmentTable() {
  return (
    <Table className="w-full">
      <TableHeader>
        <TableRow>
          <TableHead>Equipment ID</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Last Updated</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>{/* Map through equipment data here */}</TableBody>
    </Table>
  );
}
