"use client";

import { Holds } from "@/components/(reusable)/holds";
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

  function handleCreateSubmit(newTimesheet: Timesheet) {
    // Option 1: Add to state
    // setAllTimesheets((prev) => [newTimesheet, ...prev]);
    // Option 2: Refetch data
    setPage(1); // Go to first page
    setShowCreateModal(false);
    // Optionally, trigger a refetch here
  }

  useEffect(() => {
    const fetchTimesheets = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `/api/getAllTimesheetInfo?page=${page}&pageSize=${pageSize}`
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
    fetchTimesheets();
  }, [page, pageSize]);

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

  // Sort filteredTimesheets before pagination
  const sortedTimesheets = [...filteredTimesheets].sort((a, b) => {
    if (!sortField) return 0;
    let aValue = a[sortField];
    let bValue = b[sortField];
    // Handle nested fields
    if (sortField === "User") {
      aValue = a.User.firstName + " " + a.User.lastName;
      bValue = b.User.firstName + " " + b.User.lastName;
    } else if (sortField === "Jobsite") {
      aValue = a.Jobsite.name;
      bValue = b.Jobsite.name;
    } else if (sortField === "CostCode") {
      aValue = a.CostCode.name;
      bValue = b.CostCode.name;
    }
    if (aValue == null) return 1;
    if (bValue == null) return -1;
    if (typeof aValue === "string" && typeof bValue === "string") {
      if (sortDirection === "asc") {
        return aValue.localeCompare(bValue);
      } else {
        return bValue.localeCompare(aValue);
      }
    }
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
    return 0;
  });

  // implement timesheet deletion functionality

  const [approvalInbox, setApprovalInbox] = useState<timesheetPending | null>(
    null
  );

  useEffect(() => {
    const fetchTimesheetsPending = async () => {
      try {
        const response = await fetch(`/api/getAllTimesheetsPending`);
        const data = await response.json();
        setApprovalInbox(data);
      } catch (error) {
        console.error("Error fetching timesheets:", error);
      }
    };

    fetchTimesheetsPending();
  }, []);

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
    } catch (e) {
      // Optionally show error
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div>
      <Holds className="h-full w-full flex-col gap-4">
        <TimesheetDescription />
        {/*Timesheet search, filter and navigation*/}
        <Holds position={"row"} className="h-fit w-full px-4 gap-4">
          <Holds
            position={"left"}
            background={"white"}
            className="h-full w-full max-w-[450px] py-2"
          >
            <SearchBar
              term={searchTerm}
              handleSearchChange={(e) => setSearchTerm(e.target.value)}
              placeholder={"Search by id, employee, Profit Id or cost code..."}
              textSize="xs"
              imageSize="6"
            />
          </Holds>
          <Holds position={"row"} className="w-fit min-w-[40px] h-full">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="bg-white h-full w-full max-w-[40px] justify-center items-center"
                >
                  <img
                    src="/filterDials.svg"
                    alt="Filter"
                    className="h-4 w-4"
                  />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="min-w-[320px] p-4 ">
                <div className="">
                  <div className="flex items-center justify-between mb-2">
                    <label className="block mb-1 font-semibold">
                      Date Range
                    </label>
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
          </Holds>
          <Holds position={"row"} className="w-full max-w-[160px] h-full">
            <Texts
              position={"left"}
              size={"sm"}
              text={"white"}
              className="font-bold"
            >
              {/* {numOfTimesheets} of {numOfTimesheets} forms */}
            </Texts>
          </Holds>
          <Holds position={"row"} className="w-full justify-end h-full">
            <PageSelector />
            <Button
              className="border-none w-fit h-fit px-4 bg-sky-500 hover:bg-sky-400 text-white mr-2"
              onClick={() => setShowCreateModal(true)}
            >
              <Holds position={"row"} className="items-center">
                <img
                  src="/plus.svg"
                  alt="Create New Form"
                  className="h-4 w-4 mr-2"
                />
                <Texts size={"sm"} text={"black"} className="font-extrabold">
                  Create New Form
                </Texts>
              </Holds>
            </Button>
            {showCreateModal && (
              <CreateTimesheetModal
                onSubmit={handleCreateSubmit}
                onClose={() => setShowCreateModal(false)}
              />
            )}
            <Button className="relative border-none w-fit h-fit px-4 bg-gray-900 hover:bg-gray-800 text-white">
              <Holds position={"row"} className="items-center">
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
              </Holds>
            </Button>
          </Holds>
        </Holds>
        <Holds className="h-full w-full px-4 overflow-y-auto">
          <TimesheetViewAll
            timesheets={sortedTimesheets}
            loading={loading}
            page={page}
            totalPages={totalPages}
            total={total}
            pageSize={pageSize}
            pageSizeOptions={pageSizeOptions}
            onPageSizeChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              setPageSize(Number(e.target.value))
            }
            onPageChange={setPage}
            onDeleteClick={handleDeleteClick}
            deletingId={deletingId}
            isDeleting={isDeleting}
          />
        </Holds>
        <TimesheetDeleteModal
          isOpen={!!deletingId}
          onClose={handleDeleteCancel}
          onDelete={handleDeleteConfirm}
          isDeleting={isDeleting}
          itemName={deletingId || undefined}
        />
      </Holds>
    </div>
  );
}
