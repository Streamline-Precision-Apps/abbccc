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
import { JobsiteSummary } from "./useJobsiteData";
import { Skeleton } from "@/components/ui/skeleton";

export default function JobsiteTable({
  loading,
  jobsiteDetails,
  openHandleDelete,
  openHandleEdit,
  openHandleQr,
}: {
  loading: boolean;
  jobsiteDetails: JobsiteSummary[];
  openHandleDelete: (id: string) => void;
  openHandleEdit: (id: string) => void;
  openHandleQr: (id: string) => void;
}) {
  const header = [
    "ID",
    "Name",
    "Description",
    "Created At",
    "Active",
    "Site Address",
    "Client Name",
    "Approval Status",
    "Updated At",
    "Actions",
  ];

  return (
    <Table className="w-full mb-10">
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
              {/* Created At */}
              <TableCell className="border-r border-gray-200 text-xs text-center">
                <Skeleton className="h-4 w-1/2 mx-auto" />
              </TableCell>
              {/* Active */}
              <TableCell className="border-r border-gray-200 text-xs text-center">
                <Skeleton className="h-4 w-1/2 mx-auto" />
              </TableCell>
              {/* Site Address */}
              <TableCell className="border-r border-gray-200 text-xs text-center">
                <Skeleton className="h-4 w-full mx-auto" />
              </TableCell>
              {/* Client Name */}
              <TableCell className="border-r border-gray-200 text-xs text-center">
                <Skeleton className="h-4 w-3/4 mx-auto" />
              </TableCell>
              {/* Approval Status */}
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
        <TableBody>
          {jobsiteDetails.map((jobsite) => (
            <TableRow
              className="odd:bg-white even:bg-gray-100 "
              key={jobsite.id}
            >
              <TableCell className=" border-r border-gray-200 text-xs text-center">
                {jobsite.id || "-"}
              </TableCell>
              <TableCell className=" border-r border-gray-200 text-xs text-center">
                {jobsite.name || "-"}
              </TableCell>
              <TableCell className=" border-r border-gray-200 text-xs text-center">
                {jobsite.description || "-"}
              </TableCell>
              <TableCell className=" border-r border-gray-200 text-xs text-center">
                {jobsite.createdAt
                  ? format(new Date(jobsite.createdAt), "MM/dd/yyyy")
                  : "-"}
              </TableCell>
              <TableCell className=" border-r border-gray-200 text-xs text-center">
                {jobsite.isActive ? "Active" : "Inactive"}
              </TableCell>
              <TableCell className=" border-r border-gray-200 text-xs text-center">
                {`${jobsite.Address.street} ${jobsite.Address.city}, ${jobsite.Address.state} ${jobsite.Address.zipCode}`}
              </TableCell>
              <TableCell className=" border-r border-gray-200 text-xs text-center">
                {jobsite.Client.name || "-"}
              </TableCell>
              <TableCell className=" border-r border-gray-200 text-xs text-center">
                {jobsite.approvalStatus
                  .toLowerCase()
                  .slice(0, 1)
                  .toUpperCase() +
                  jobsite.approvalStatus.slice(1).toLowerCase()}
              </TableCell>
              <TableCell className=" border-r border-gray-200 text-xs text-center">
                {jobsite.updatedAt
                  ? format(new Date(jobsite.updatedAt), "MM/dd/yyyy")
                  : "-"}
              </TableCell>
              <TableCell className="text-xs text-center">
                <div className="flex flex-row items-center justify-center ">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openHandleQr(jobsite.id)}
                  >
                    <img src="/qrCode.svg" alt="Edit" className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openHandleEdit(jobsite.id)}
                  >
                    <img src="/formEdit.svg" alt="Edit" className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openHandleDelete(jobsite.id)}
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
