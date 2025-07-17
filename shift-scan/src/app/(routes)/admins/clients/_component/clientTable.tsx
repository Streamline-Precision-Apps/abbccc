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
import { Skeleton } from "@/components/ui/skeleton";
export default function ClientTable({
  clientDetails,
  openHandleDelete,
  openHandleEdit,
  loading,
}: {
  clientDetails: ClientSummary[];
  openHandleDelete: (id: string) => void;
  openHandleEdit: (id: string) => void;
  loading: boolean;
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
    <>
      {loading ? (
        <Table className="w-full h-full bg-white rounded-lg">
          <TableHeader className="bg-gray-100 rounded-lg ">
            <TableRow className="h-10">
              {header.map((header, idx) => (
                <TableHead key={header} className="text-center min-w-[100px]">
                  <Skeleton className="h-4 w-3/4 mx-auto" />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody className="bg-white pt-2">
            {[...Array(12)].map((_, i) => (
              <TableRow
                key={i}
                className={i % 2 === 0 ? "bg-white" : "bg-gray-100"}
              >
                {/* ID */}
                <TableCell className="border-r border-gray-200 text-xs text-center">
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
                {/* Address */}
                <TableCell className="border-r border-gray-200 text-xs text-center">
                  <Skeleton className="h-4 w-full mx-auto" />
                </TableCell>
                {/* Contact Person */}
                <TableCell className="border-r border-gray-200 text-xs text-center">
                  <Skeleton className="h-4 w-2/3 mx-auto" />
                </TableCell>
                {/* Contact Email */}
                <TableCell className="border-r border-gray-200 text-xs text-center">
                  <Skeleton className="h-4 w-3/4 mx-auto" />
                </TableCell>
                {/* Contact Phone */}
                <TableCell className="border-r border-gray-200 text-xs text-center">
                  <Skeleton className="h-4 w-2/3 mx-auto" />
                </TableCell>
                {/* Created At */}
                <TableCell className="border-r border-gray-200 text-xs text-center">
                  <Skeleton className="h-4 w-1/2 mx-auto" />
                </TableCell>
                {/* All Jobs (HoverCard + Button) */}
                <TableCell className="border-r border-gray-200 text-xs text-center">
                  <div className="flex flex-row items-center justify-center">
                    <Skeleton className="h-6 w-10 rounded" />
                  </div>
                </TableCell>
                {/* Approval Status */}
                <TableCell className="border-r border-gray-200 text-xs text-center">
                  <Skeleton className="h-4 w-2/3 mx-auto" />
                </TableCell>
                {/* Updated At */}
                <TableCell className="border-r border-gray-200 text-xs text-center">
                  <Skeleton className="h-4 w-1/2 mx-auto" />
                </TableCell>
                {/* Actions (Edit/Delete buttons) */}
                <TableCell className="text-xs text-center">
                  <div className="flex flex-row items-center justify-center gap-2">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <Skeleton className="h-8 w-8 rounded-full" />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
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
              <TableRow
                className="odd:bg-white even:bg-gray-100 "
                key={client.id}
              >
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
                          <div className="text-xs text-gray-500">
                            No Jobsites
                          </div>
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
                    {client.Jobsites.length === 0 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openHandleDelete(client.id)}
                      >
                        <img
                          src="/trash-red.svg"
                          alt="Delete"
                          className="w-4 h-4"
                        />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </>
  );
}
