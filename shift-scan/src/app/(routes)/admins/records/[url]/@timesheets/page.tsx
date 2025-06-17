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

export default function AdminTimesheets() {
  //todo: Implement search functionality
  // State: searchTerm
  // Handler: onSearchChange
  // Filter timesheets based on searchTerm
  const [searchTerm, setSearchTerm] = useState("");
  const [allTimesheets, setAllTimesheets] = useState<Timesheet[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [pageSize, setPageSize] = useState(25);
  const pageSizeOptions = [25, 50, 75, 100];

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

  // Filter timesheets based on searchTerm
  const filteredTimesheets = allTimesheets.filter((ts) => {
    const id = ts.id || "";
    const firstName = ts?.User?.firstName || "";
    const lastName = ts?.User?.lastName || "";
    const jobsite = ts?.Jobsite?.name || "";
    const costCode = ts?.CostCode?.name || "";
    const term = searchTerm.toLowerCase();
    return (
      id.toLowerCase().includes(term) ||
      firstName.toLowerCase().includes(term) ||
      lastName.toLowerCase().includes(term) ||
      jobsite.toLowerCase().includes(term) ||
      costCode.toLowerCase().includes(term)
    );
  });

  //todo: Implement pagination functionality
  // State: currentPage, pageSize
  // Handler: onPageChange
  // Calculate paginatedTimesheets
  // const paginatedTimesheets = filteredTimesheets.slice(
  //   (currentPage - 1) * pageSize,
  //   currentPage * pageSize
  // );
  // <PageSelector currentPage={currentPage} totalPages={Math.ceil(filteredTimesheets.length / pageSize)} onPageChange={setCurrentPage} />

  //todo: Implement sorting functionality
  // State: sortField, sortDirection
  // Handler: onSortChange
  // Sort filteredTimesheets before pagination
  // const [sortField, setSortField] = useState("date");
  // const [sortDirection, setSortDirection] = useState("asc");
  // const sortedTimesheets = [...filteredTimesheets].sort((a, b) => {
  //   // compare a[sortField] and b[sortField] based on sortDirection
  // });
  // <TableHeader onClick={() => setSortField("date")} />

  // implement timesheet creation functionality
  // State: showCreateModal
  // Handler: onCreateSubmit
  // Add new timesheet to state or refetch data
  const [showCreateModal, setShowCreateModal] = useState(false);
  // <Button onClick={() => setShowCreateModal(true)}>Create New Form</Button>
  // {showCreateModal && <CreateTimesheetModal onSubmit={handleCreateSubmit} />}

  // implement timesheet deletion functionality
  // Handler: onDelete
  // Remove timesheet from state or refetch data
  // <Button onClick={() => handleDelete(timesheet.id)}>Delete</Button>
  // function handleDelete(id) {
  //   // confirm deletion
  //   // call API to delete
  //   // update state or refetch
  // }

  // implement timesheet approval and rejection functionality
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

  // Handler: onApprove, onReject
  // Update timesheet status
  // <Button onClick={() => handleApprove(timesheet.id)}>Approve</Button>
  // <Button onClick={() => handleReject(timesheet.id)}>Reject</Button>
  // function handleApprove(id) {
  //   // call API to approve
  //   // update state or refetch
  // }
  // function handleReject(id) {
  //   // call API to reject
  //   // update state or refetch
  // }

  // implement timesheet editing functionality
  // State: showEditModal, editingTimesheet
  // Handler: onEditSubmit
  // <Button onClick={() => setEditingTimesheet(timesheet)}>Edit</Button>
  // {editingTimesheet && <EditTimesheetModal timesheet={editingTimesheet} onSubmit={handleEditSubmit} />}

  // implement timesheet download / export functionality
  // Handler: onExport
  // Convert timesheet data to CSV or PDF and trigger download
  // <Button onClick={handleExport}>Export</Button>
  // function handleExport() {
  //   // format timesheets as CSV
  //   // create blob and trigger download
  // }

  return (
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
          <Holds
            position={"left"}
            background={"white"}
            className="h-full w-full max-w-[40px] justify-center items-center"
          >
            <img src="/filterDials.svg" alt="Filter" className="h-4 w-4 " />
          </Holds>
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
          <Button className="border-none w-fit h-fit px-4 bg-sky-500 hover:bg-sky-400 text-white mr-2">
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
          timesheets={filteredTimesheets}
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
        />
      </Holds>
    </Holds>
  );
}
