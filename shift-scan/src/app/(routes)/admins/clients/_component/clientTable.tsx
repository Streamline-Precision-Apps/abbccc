import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { ClientSummary } from "./useClientData";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
export default function ClientTable({
  clientDetails,
  openHandleDelete,
  openHandleEdit,
}: {
  clientDetails: ClientSummary[];
  openHandleDelete: (id: string) => void;
  openHandleEdit: (id: string) => void;
}) {
  const header = [
    "ID",
    "Name",
    "Description",
    "Address",
    "Contact Person",
    "Contact Email",
    "Contact Phone",
    "Created At",
    "All Jobs",
    "Approval Status",
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
        {clientDetails.map((client) => (
          <TableRow className="odd:bg-white even:bg-gray-100 " key={client.id}>
            <TableCell className=" border-r border-gray-200 text-xs text-center">
              {client.id || "-"}
            </TableCell>
            <TableCell className=" border-r border-gray-200 text-xs text-center">
              {client.name || "-"}
            </TableCell>
            <TableCell className=" border-r border-gray-200 text-xs text-center">
              {client.description || "-"}
            </TableCell>
            <TableCell className=" border-r border-gray-200 text-xs text-center">
              {`${client.Address.street || "-"}, ${
                client.Address.city || "-"
              }, ${client.Address.state || "-"} ${
                client.Address.zipCode || "-"
              }`}
            </TableCell>

            <TableCell className=" border-r border-gray-200 text-xs text-center">
              {client.contactPerson || "-"}
            </TableCell>
            <TableCell className=" border-r border-gray-200 text-xs text-center">
              {client.contactEmail || "-"}
            </TableCell>
            <TableCell className=" border-r border-gray-200 text-xs text-center">
              {client.contactPhone || "-"}
            </TableCell>
            <TableCell className=" border-r border-gray-200 text-xs text-center">
              {client.createdAt
                ? format(new Date(client.createdAt), "MM/dd/yyyy")
                : "-"}
            </TableCell>
            <TableCell className=" border-r border-gray-200 text-xs text-center">
              <HoverCard openDelay={200}>
                <HoverCardTrigger asChild>
                  <Button variant="link">
                    {client.Jobsites?.length >= 1
                      ? `${client.Jobsites?.length}`
                      : "-"}
                  </Button>
                </HoverCardTrigger>
                <HoverCardContent side="right" align="start">
                  <div className="flex flex-col gap-2">
                    {client.Jobsites && client.Jobsites.length > 0 ? (
                      client.Jobsites.map((js) => (
                        <div
                          key={js.id}
                          className="text-xs bg-emerald-300 p-1 py-2 rounded"
                        >
                          {js.name}
                        </div>
                      ))
                    ) : (
                      <div className="text-xs text-gray-500">No Jobsites</div>
                    )}
                  </div>
                </HoverCardContent>
              </HoverCard>
            </TableCell>
            <TableCell className=" border-r border-gray-200 text-xs text-center">
              {client.approvalStatus || "-"}
            </TableCell>
            <TableCell className=" border-r border-gray-200 text-xs text-center">
              {client.updatedAt
                ? format(new Date(client.updatedAt), "MM/dd/yyyy")
                : "-"}
            </TableCell>

            <TableCell className="text-xs text-center">
              <div className="flex flex-row items-center justify-center ">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => openHandleEdit(client.id)}
                >
                  <img src="/formEdit.svg" alt="Edit" className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => openHandleDelete(client.id)}
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
