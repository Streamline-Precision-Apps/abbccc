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

export default function JobsiteTable({
  jobsiteDetails,
  openHandleDelete,
  openHandleEdit,
}: {
  jobsiteDetails: JobsiteSummary[];
  openHandleDelete: (id: string) => void;
  openHandleEdit: (id: string) => void;
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
        {jobsiteDetails.map((jobsite) => (
          <TableRow className="odd:bg-white even:bg-gray-100 " key={jobsite.id}>
            <TableCell className=" border-r border-gray-200 text-xs text-center">
              {jobsite.id}
            </TableCell>
            <TableCell className=" border-r border-gray-200 text-xs text-center">
              {jobsite.name}
            </TableCell>
            <TableCell className=" border-r border-gray-200 text-xs text-center">
              {jobsite.description || "No description available"}
            </TableCell>
            <TableCell className=" border-r border-gray-200 text-xs text-center">
              {jobsite.createdAt
                ? format(new Date(jobsite.createdAt), "MM/dd/yyyy")
                : "N/A"}
            </TableCell>
            <TableCell className=" border-r border-gray-200 text-xs text-center">
              {jobsite.isActive ? "Active" : "Inactive"}
            </TableCell>
            <TableCell className=" border-r border-gray-200 text-xs text-center">
              {`${jobsite.Address.street} ${jobsite.Address.city}, ${jobsite.Address.state} ${jobsite.Address.zipCode}`}
            </TableCell>
            <TableCell className=" border-r border-gray-200 text-xs text-center">
              {jobsite.Client.name || "No client available"}
            </TableCell>
            <TableCell className=" border-r border-gray-200 text-xs text-center">
              {jobsite.approvalStatus.toLowerCase().slice(0, 1).toUpperCase() +
                jobsite.approvalStatus.slice(1).toLowerCase()}
            </TableCell>
            <TableCell className=" border-r border-gray-200 text-xs text-center">
              {jobsite.updatedAt
                ? format(new Date(jobsite.updatedAt), "MM/dd/yyyy")
                : "N/A"}
            </TableCell>
            <TableCell className="text-xs text-center">
              <div className="flex flex-row items-center justify-center ">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => openHandleEdit(jobsite.id)}
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
