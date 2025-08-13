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
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { CrewData } from "./useCrewsData";
import { format } from "date-fns";

export default function CrewTable({
  loading,
  crew = [],
  openHandleDelete,
  openHandleEdit,
  showInactive,
}: {
  loading: boolean;
  crew: CrewData[];
  openHandleDelete: (id: string) => void;
  openHandleEdit: (id: string) => void;
  showInactive: boolean;
}) {
  const header = [
    "Supervisor",
    "Crew Type",
    "Created On",
    "Number of Users",
    "Actions",
  ];
  const leadUser = (crew: CrewData) => {
    const firstName =
      crew.Users.find((u) => u.id === crew.leadId)?.firstName || "";
    const middleName =
      crew.Users.find((u) => u.id === crew.leadId)?.middleName || "";
    const lastName =
      crew.Users.find((u) => u.id === crew.leadId)?.lastName || "";
    const secondLastName =
      crew.Users.find((u) => u.id === crew.leadId)?.secondLastName || "";
    return `${firstName} ${middleName} ${lastName} ${secondLastName}`;
  };

  const crewType = (crew: CrewData) => {
    if (crew.crewType === "MECHANIC") return "Mechanic";
    if (crew.crewType === "TRUCK_DRIVER") return "Truck Driver";
    if (crew.crewType === "TASCO") return "TASCO";
    else return "General";
  };

  return (
    <>
      <Table className="w-full mb-5">
        <TableHeader>
          <TableRow>
            <TableHead className="sticky  text-center  top-0 z-10 bg-gray-100 border-r border-gray-200">
              Crew Name
            </TableHead>
            <TableHead className="sticky text-center  top-0 z-10 bg-gray-100 border-r border-gray-200">
              Supervisor
            </TableHead>
            <TableHead className="w-[150px] text-center  sticky top-0 z-10 bg-gray-100 border-r border-gray-200">
              Crew Type
            </TableHead>
            <TableHead className="w-[150px] text-center  sticky top-0 z-10 bg-gray-100 border-r border-gray-200">
              Created
            </TableHead>
            <TableHead className="w-[180px] text-center  sticky top-0 z-10 bg-gray-100 border-r border-gray-200">
              Total Crew Members
            </TableHead>
            <TableHead className="sticky text-center top-0 z-10 bg-gray-100 border-r border-gray-200 ">
              Actions
            </TableHead>
            {/* {header.map((h) => (
              <TableHead
                key={h}
                className="text-sm text-center border-r border-gray-200 bg-gray-100 sticky top-0 z-10"
              >
                {h}
              </TableHead>
            ))} */}
          </TableRow>
        </TableHeader>
        {loading ? (
          <TableBody className="divide-y divide-gray-200 bg-white">
            {Array.from({ length: 18 }).map((_, rowIdx) => (
              <TableRow
                key={rowIdx}
                className={rowIdx % 2 === 0 ? "bg-white" : "bg-gray-100"}
              >
                {/* Crew Name */}
                <TableCell className="border-r border-gray-200 text-xs text-center">
                  <Skeleton className="h-4 w-24 mx-auto rounded" />
                </TableCell>
                {/* Supervisor */}
                <TableCell className="border-r border-gray-200 text-xs text-center">
                  <Skeleton className="h-4 w-20 mx-auto rounded" />
                </TableCell>
                {/* Crew Type */}
                <TableCell className="border-r border-gray-200 text-xs text-center">
                  <Skeleton className="h-4 w-16 mx-auto rounded" />
                </TableCell>
                {/* Created On */}
                <TableCell className="border-r border-gray-200 text-xs text-center">
                  <Skeleton className="h-4 w-16 mx-auto rounded" />
                </TableCell>
                {/* Number of Users */}
                <TableCell className="border-r border-gray-200 text-xs text-center">
                  <Skeleton className="h-4 w-10 mx-auto rounded" />
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
          <TableBody className="divide-y divide-gray-200 bg-white">
            {crew.map((c) => (
              <TableRow
                className="odd:bg-white even:bg-gray-100 border-r border-gray-200 text-xs text-center py-2"
                key={c.id}
              >
                <TableCell className="border-r border-gray-200 text-xs text-left">
                  {c.name ? c.name : ""}
                </TableCell>
                <TableCell className="border-r border-gray-200 text-xs text-left">
                  {c.leadId ? leadUser(c) : ""}
                </TableCell>
                <TableCell className="border-r border-gray-200 text-xs text-left ">
                  <span className="bg-blue-300/70 px-3 py-1 rounded-xl ">
                    {c.crewType ? crewType(c) : ""}
                  </span>
                </TableCell>
                <TableCell className="border-r border-gray-200 text-xs text-center">
                  {c.createdAt ? format(c.createdAt, "MM/dd/yy") : ""}
                </TableCell>
                <TableCell className="border-r border-gray-200 text-sm text-center">
                  {c.Users ? (
                    <HoverCard>
                      <HoverCardTrigger asChild>
                        <span className="cursor-pointer text-blue-600 underline-offset-2 decoration-solid underline ">
                          {c.Users.length}
                        </span>
                      </HoverCardTrigger>
                      <HoverCardContent className=" p-0 min-w-[220px] max-w-[340px]">
                        {c.Users.length > 0 ? (
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead className="px-2 text-gray-700 text-center">
                                  <p className="font-bold text-sm">
                                    Crew Members
                                  </p>
                                </TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody className="divide-y divide-gray-200 bg-white border border-gray-200">
                              {c.Users.map((u) => (
                                <TableRow
                                  className="odd:bg-gray-100 even:bg-white "
                                  key={u.id}
                                >
                                  <TableCell className="px-2 py-1 whitespace-nowrap">
                                    {[
                                      u.firstName,
                                      u.middleName,
                                      u.lastName,
                                      u.secondLastName,
                                    ]
                                      .filter(Boolean)
                                      .join(" ")}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        ) : (
                          <div className="text-gray-400 italic text-xs">
                            No users in this crew.
                          </div>
                        )}
                      </HoverCardContent>
                    </HoverCard>
                  ) : (
                    ""
                  )}
                </TableCell>
                <TableCell className="text-xs text-center">
                  <div className="flex flex-row items-center justify-center ">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openHandleEdit(c.id)}
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
                          onClick={() => openHandleDelete(c.id)}
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
      {crew.length === 0 && !loading && (
        <div className="w-full h-full flex justify-center items-center absolute left-0 top-0 z-50  rounded-[10px]">
          {showInactive ? (
            <p className="text-gray-500 italic">No Inactive Crew.</p>
          ) : (
            <>
              <p className="text-gray-500 italic">No Crew found.</p>
              <p className="text-gray-500 italic">
                Click Plus to add new Crew.
              </p>
            </>
          )}
        </div>
      )}
    </>
  );
}
