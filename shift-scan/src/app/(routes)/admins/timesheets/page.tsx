"use client";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import TimesheetViewAll from "./_components/ViewAll/Timesheet-ViewAll";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CreateTimesheetModal } from "./_components/Create/CreateTimesheetModal";
import { EditTimesheetModal } from "./_components/Edit/EditTimesheetModal";
import { ExportModal } from "./_components/Export/ExportModal";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Spinner from "@/components/(animations)/spinner";
import SearchBarPopover from "../_pages/searchBarPopover";
import { Badge } from "@/components/ui/badge";
import useAllTimeSheetData from "./_components/useAllTimeSheetData";
import { PageHeaderContainer } from "../_pages/PageHeaderContainer";
import { FooterPagination } from "../_pages/FooterPagination";

export default function AdminTimesheets() {
  const {
    inputValue,
    setInputValue,
    loading,
    page,
    setPage,
    totalPages,
    total,
    pageSize,
    pageSizeOptions,
    setPageSize,
    dateRange,
    setDateRange,
    showCreateModal,
    setShowCreateModal,
    deletingId,
    isDeleting,
    setIsDeleting,
    showEditModal,
    setShowEditModal,
    editingId,
    setEditingId,
    approvalInbox,
    showPendingOnly,
    setShowPendingOnly,
    exportModal,
    setExportModal,
    statusLoading,
    sortedTimesheets,
    rerender,
    handleApprovalAction,
    handleDeleteClick,
    handleDeleteCancel,
    handleDeleteConfirm,
    handlePageSizeChange,
    handleExport,
  } = useAllTimeSheetData();

  return (
    <div className="w-full p-4 grid grid-rows-[3rem_2rem_1fr] gap-5">
      <PageHeaderContainer
        loading={loading}
        headerText="Timesheets Management"
        descriptionText="Create, manage, and track timesheets"
        refetch={() => {
          rerender();
        }}
      />
      <div className="h-10 w-full flex flex-row justify-between gap-4">
        <div className="flex flex-row w-full gap-2">
          <SearchBarPopover
            term={inputValue}
            handleSearchChange={(e) => setInputValue(e.target.value)}
            placeholder={"Search by id, name, profit id, or cost code... "}
            textSize="xs"
            imageSize="10"
          />

          <div className="w-full min-w-[40px] max-h-10 flex flex-row">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="bg-white h-full w-full max-w-[40px] justify-center items-center"
                >
                  <img
                    src="/calendar.svg"
                    alt="Filter"
                    className="h-8 w-8 object-contain p-2 "
                  />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                align="start"
                side="right"
                className="min-w-[320px] p-4 "
              >
                <div className="">
                  <div className="flex items-center justify-center gap-2 overflow-visible">
                    <Calendar
                      mode="range"
                      selected={dateRange}
                      onSelect={(value) => {
                        if (value?.from && !value?.to) {
                          // Set from to start of day, to to end of day
                          const from = new Date(value.from);
                          from.setHours(0, 0, 0, 0);
                          const to = new Date(value.from);
                          to.setHours(23, 59, 59, 999);
                          setDateRange({ from, to });
                        } else if (value?.from && value?.to) {
                          // Set from to start of from day, to to end of to day
                          const from = new Date(value.from);
                          from.setHours(0, 0, 0, 0);
                          const to = new Date(value.to);
                          to.setHours(23, 59, 59, 999);
                          setDateRange({ from, to });
                        } else {
                          setDateRange({
                            from: undefined,
                            to: undefined,
                          });
                        }
                      }}
                      autoFocus
                    />
                  </div>
                  <div className="flex items-center justify-center ">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="p-2 flex-shrink-0"
                      onClick={() =>
                        setDateRange({ from: undefined, to: undefined })
                      }
                      aria-label="Clear date range"
                    >
                      clear
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <div className="w-full h-full flex flex-row justify-end items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={() => setExportModal(true)}
                size={"icon"}
                className=" relative border-none hover:bg-gray-800 min-w-12 h-full  text-white"
              >
                <div className="flex w-fit h-fit flex-row items-center">
                  <img
                    src="/export-white.svg"
                    alt="Export"
                    className="h-4 w-4"
                  />
                </div>
              </Button>
            </TooltipTrigger>
            <TooltipContent align="start" side="top">
              Export
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size={"icon"}
                className=" relative border-none hover:bg-gray-800 min-w-12 h-full  text-white"
                onClick={() => setShowCreateModal(true)}
              >
                <div className="flex w-fit h-fit flex-row items-center">
                  <img
                    src="/plus-white.svg"
                    alt="Create New Form"
                    className="h-4 w-4"
                  />
                </div>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">Create Timesheet</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size={"icon"}
                onClick={() => setShowPendingOnly(!showPendingOnly)}
                className={`relative border-none min-w-16 h-full  bg-gray-900 hover:bg-gray-800 text-white ${
                  showPendingOnly ? "ring-2 ring-red-400" : ""
                }`}
              >
                <div className="flex flex-row items-center">
                  <img
                    src="/inbox-white.svg"
                    alt="Approval"
                    className="h-4 w-4"
                  />
                  {/* <p className="text-white text-sm font-extrabold">Approval</p> */}
                  {approvalInbox && approvalInbox.length > 0 && (
                    <Badge className="absolute -top-2 -right-2 bg-red-500 text-white px-2 py-0.5 text-xs rounded-full">
                      {approvalInbox.length}
                    </Badge>
                  )}
                </div>
              </Button>
            </TooltipTrigger>
            <TooltipContent align="end" side="top">
              Timecard Approval
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
      {/* ...existing code... */}
      <div className="h-[85vh] rounded-lg  w-full relative bg-white">
        {loading && (
          <div className="absolute inset-0 z-20 flex flex-row items-center gap-2 justify-center bg-white bg-opacity-70 rounded-lg">
            <Spinner size={20} />
            <span className="text-lg text-gray-500">Loading...</span>
          </div>
        )}
        <ScrollArea
          alwaysVisible
          className="h-[80vh] w-full  bg-white rounded-t-lg  border border-slate-200 relative pr-2"
        >
          <TimesheetViewAll
            showPendingOnly={showPendingOnly}
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
            onApprovalAction={handleApprovalAction}
            statusLoading={statusLoading}
            searchTerm={inputValue}
          />
          <div className="h-1 bg-slate-100 border-y border-slate-200 absolute bottom-0 right-0 left-0">
            <ScrollBar
              orientation="horizontal"
              className="w-full h-3 ml-2 mr-2 rounded-full"
            />
          </div>
        </ScrollArea>
        {/* pagination component */}
        {!showPendingOnly && totalPages > 1 && (
          <FooterPagination
            page={page}
            totalPages={totalPages}
            total={total}
            pageSize={pageSize}
            setPage={setPage}
            setPageSize={setPageSize}
          />
        )}
      </div>

      {/*Modal Section*/}
      {showCreateModal && (
        <CreateTimesheetModal
          onClose={() => setShowCreateModal(false)}
          onCreated={rerender}
        />
      )}
      {/* Export Modal */}
      {exportModal && (
        <ExportModal
          onClose={() => setExportModal(false)}
          onExport={handleExport}
        />
      )}
      {/* ...existing code... */}
      {showEditModal && editingId && (
        <EditTimesheetModal
          timesheetId={editingId}
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          onUpdated={rerender}
        />
      )}
      <Dialog open={isDeleting} onOpenChange={setIsDeleting}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Timesheet</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this timesheet? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={handleDeleteCancel}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
