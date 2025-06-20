"use client";

import { Texts } from "@/components/(reusable)/texts";
import { Button } from "@/components/ui/button";
import SearchBar from "../../../personnel/components/SearchBar";
import PageSelector from "../pageSelector";
import TimesheetDescription from "./_components/ViewAll/Timesheet-Description";
import TimesheetViewAll from "./_components/ViewAll/Timesheet-ViewAll";
import { TimeSheetStatus, WorkType } from "@/lib/enums";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { CreateTimesheetModal } from "./_components/Create/CreateTimesheetModal";
import { adminDeleteTimesheet } from "@/actions/records-timesheets";
import TimesheetDeleteModal from "./_components/ViewAll/TimesheetDeleteModal";
import { toast } from "sonner";
import { EditTimesheetModal } from "./_components/Edit/EditTimesheetModal";

export type Timesheet = {
  id: string;
  date: Date | string;
  User: {
    id: string;
    firstName: string;
    lastName: string;
  };
  Jobsite: {
    id: string;
    name: string;
  };
  CostCode: {
    id: string;
    name: string;
  };
  nu: string;
  Fp: string;
  startTime: Date | string;
  endTime: Date | string;
  comment: string;
  status: TimeSheetStatus;
  workType: WorkType;
  createdAt: Date | string;
  updatedAt: Date | string;
};
type timesheetPending = {
  length: number;
};
// Updated CreateTimesheetModal with user/jobsite dropdowns and removed nu, Fp, location, status

export default function AdminTimesheets() {
  const [searchTerm, setSearchTerm] = useState("");
  const [allTimesheets, setAllTimesheets] = useState<Timesheet[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [pageSize, setPageSize] = useState(25);
  const pageSizeOptions = [25, 50, 75, 100];
  const [sortField, setSortField] = useState<keyof Timesheet | "">("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({ from: undefined, to: undefined });
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [showEditModal, setShowEditModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const [approvalInbox, setApprovalInbox] = useState<timesheetPending | null>(
    null
  );

  // Move fetch functions out for reuse
  const fetchTimesheets = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/getAllTimesheetInfo?page=${page}&pageSize=${pageSize}`,
        {
          next: {
            tags: ["timesheets"],
          },
        }
      );
      const data = await response.json();
      setAllTimesheets(data.timesheets);
      setTotalPages(data.totalPages);
      setTotal(data.total);
    } catch (error) {
      console.error("Error fetching timesheets:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTimesheetsPending = async () => {
    try {
      const response = await fetch(`/api/getAllTimesheetsPending`, {
        next: {
          tags: ["timesheets"],
        },
      });
      const data = await response.json();
      setApprovalInbox(data);
    } catch (error) {
      console.error("Error fetching timesheets:", error);
    }
  };

  // Refetch both after creation
  const refetchAll = async () => {
    await fetchTimesheets();
    await fetchTimesheetsPending();
  };

  useEffect(() => {
    fetchTimesheets();
  }, [page, pageSize]);

  useEffect(() => {
    fetchTimesheetsPending();
  }, [allTimesheets]);

  // Filter timesheets based on searchTerm and date range
  const filteredTimesheets = allTimesheets.filter((ts) => {
    const id = ts.id || "";
    const firstName = ts?.User?.firstName || "";
    const lastName = ts?.User?.lastName || "";
    const jobsite = ts?.Jobsite?.name || "";
    const costCode = ts?.CostCode?.name || "";
    const term = searchTerm.toLowerCase();
    // Date range filter
    let inDateRange = true;
    if (dateRange.from) {
      inDateRange = inDateRange && new Date(ts.date) >= dateRange.from;
    }
    if (dateRange.to) {
      inDateRange = inDateRange && new Date(ts.date) <= dateRange.to;
    }
    return (
      inDateRange &&
      (id.toLowerCase().includes(term) ||
        firstName.toLowerCase().includes(term) ||
        lastName.toLowerCase().includes(term) ||
        jobsite.toLowerCase().includes(term) ||
        costCode.toLowerCase().includes(term))
    );
  });

  // Use filteredTimesheets, sorted by date descending
  const sortedTimesheets = [...filteredTimesheets].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  // implement timesheet approval and rejection functionality
  // implement timesheet editing functionality
  // implement timesheet download / export functionality

  const handleDeleteClick = (id: string) => {
    setDeletingId(id);
  };
  const handleDeleteCancel = () => {
    setDeletingId(null);
  };
  const handleDeleteConfirm = async () => {
    if (!deletingId) return;
    setIsDeleting(true);
    try {
      await adminDeleteTimesheet(deletingId);
      setAllTimesheets((prev) => prev.filter((t) => t.id !== deletingId));
      setDeletingId(null);
      toast.success("Timesheet deleted successfully!");
    } catch (e) {
      // Optionally show error
      console.error("Error deleting timesheet:", e);
      toast.error("Failed to delete timesheet. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  // Handler to reset page to 1 when page size changes
  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPage(1);
    setPageSize(Number(e.target.value));
  };

  return (
    <div className="h-full w-full flex flex-col gap-4">
      <TimesheetDescription />
      {/*Timesheet search, filter and navigation*/}
      <div className="h-fit w-full flex flex-row px-4 gap-4">
        <div className="bg-white rounded-lg h-full w-full max-w-[450px] py-2">
          <SearchBar
            term={searchTerm}
            handleSearchChange={(e) => setSearchTerm(e.target.value)}
            placeholder={"Search by id, employee, Profit Id or cost code..."}
            textSize="xs"
            imageSize="6"
          />
        </div>
        <div className="w-fit min-w-[40px] h-full flex flex-row">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="bg-white h-full w-full max-w-[40px] justify-center items-center"
              >
                <img src="/filterDials.svg" alt="Filter" className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="min-w-[320px] p-4 ">
              <div className="">
                <div className="flex items-center justify-between mb-2">
                  <label className="block mb-1 font-semibold">Date Range</label>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="p-2 flex-shrink-0"
                    onClick={() =>
                      setDateRange({ from: undefined, to: undefined })
                    }
                    aria-label="Clear date range"
                  >
                    <img
                      src="/trash-red.svg"
                      alt="Clear date range"
                      className="h-5 w-5"
                    />
                  </Button>
                </div>

                <div className="mt-2 text-xs text-center text-muted-foreground">
                  {dateRange.from && dateRange.to ? (
                    `${format(dateRange.from, "PPP")} - ${format(
                      dateRange.to,
                      "PPP"
                    )}`
                  ) : dateRange.from ? (
                    `${format(dateRange.from, "PPP")} - ...`
                  ) : (
                    <span>Pick a date range</span>
                  )}
                </div>
                <div className="flex items-center justify-center gap-2 overflow-visible">
                  <Calendar
                    mode="range"
                    selected={dateRange}
                    onSelect={(value) =>
                      setDateRange({ from: value?.from, to: value?.to })
                    }
                    autoFocus
                  />
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
        <div className=" w-[300px] h-full items-center flex text-xs text-white">
          {pageSize === sortedTimesheets.length && (
            <>
              {pageSize} of {total} rows
            </>
          )}
        </div>
        <div className="w-full flex flex-row max-w-[160px] h-full">
          <Texts
            position={"left"}
            size={"sm"}
            text={"white"}
            className="font-bold"
          >
            {/* {numOfTimesheets} of {numOfTimesheets} forms */}
          </Texts>
        </div>
        <div className="w-full flex flex-row justify-end h-full">
          <PageSelector />
          <Button
            size={"icon"}
            className=" relative border-none hover:bg-gray-800 text-white mr-2"
          >
            <div className="flex w-fit h-fit flex-row items-center">
              <img src="/export-white.svg" alt="Export" className="h-4 w-4 " />
            </div>
          </Button>
          <Button
            className="border-none w-fit h-fit px-4  hover:bg-gray-800 text-white mr-2"
            onClick={() => setShowCreateModal(true)}
          >
            <div className="items-center flex flex-row">
              <img
                src="/plus-white.svg"
                alt="Create New Form"
                className="h-4 w-4 mr-2"
              />
              <Texts size={"sm"} text={"white"} className="font-extrabold">
                New Timesheet
              </Texts>
            </div>
          </Button>
          {showCreateModal && (
            <CreateTimesheetModal
              onClose={() => setShowCreateModal(false)}
              onCreated={refetchAll}
            />
          )}
          <Button className="relative border-none w-fit h-fit px-4 bg-gray-900 hover:bg-gray-800 text-white ">
            <div className="flex flex-row items-center">
              <img
                src="/inbox-white.svg"
                alt="Approval"
                className="h-4 w-4 mr-2"
              />
              <Texts size={"sm"} text={"white"} className="font-extrabold">
                Approval
              </Texts>
              {approvalInbox && approvalInbox.length > 0 && (
                <Badge className="absolute -top-2 -right-2 bg-red-500 text-white px-2 py-0.5 text-xs rounded-full">
                  {approvalInbox.length}
                </Badge>
              )}
            </div>
          </Button>
        </div>
      </div>
      <div className="h-full w-full px-4 overflow-auto ">
        <TimesheetViewAll
          timesheets={sortedTimesheets}
          loading={loading}
          page={page}
          totalPages={totalPages}
          total={total}
          pageSize={pageSize}
          pageSizeOptions={pageSizeOptions}
          onPageSizeChange={handlePageSizeChange}
          onPageChange={setPage}
          onDeleteClick={handleDeleteClick}
          deletingId={deletingId}
          isDeleting={isDeleting}
          onEditClick={(id: string) => {
            setEditingId(id);
            setShowEditModal(true);
          }}
        />
      </div>
      {showEditModal && (
        <EditTimesheetModal
          timesheetId={editingId || ""}
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          onUpdated={refetchAll}
        />
      )}
      <TimesheetDeleteModal
        isOpen={!!deletingId}
        onClose={handleDeleteCancel}
        onDelete={handleDeleteConfirm}
        isDeleting={isDeleting}
        itemName={deletingId || undefined}
      />
    </div>
  );
}
