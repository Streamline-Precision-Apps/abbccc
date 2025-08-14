"use client";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import React from "react";
import JobsiteTable from "./_components/jobsiteTable";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useJobsiteData } from "./_components/useJobsiteData";
import EditJobsiteModal from "./_components/EditJobsiteModal";
import CreateJobsiteModal from "./_components/CreateJobsiteModal";
import Spinner from "@/components/(animations)/spinner";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import SearchBarPopover from "../_pages/searchBarPopover";
import { PageHeaderContainer } from "../_pages/PageHeaderContainer";
import { FooterPagination } from "../_pages/FooterPagination";

export default function JobsitePage() {
  const {
    searchTerm,
    setSearchTerm,
    loading,
    rerender,
    total,
    page,
    pageSize,
    setPage,
    setPageSize,
    showPendingOnly,
    setShowPendingOnly,
    editJobsiteModal,
    setEditJobsiteModal,
    createJobsiteModal,
    setCreateJobsiteModal,
    showDeleteDialog,
    setShowDeleteDialog,
    pendingEditId,
    openHandleEdit,
    openHandleDelete,
    openHandleQr,
    confirmDelete,
    cancelDelete,
    pendingCount,
    totalPages,
    paginatedJobsites,
  } = useJobsiteData();

  return (
    <div className="w-full p-4 grid grid-rows-[3rem_2rem_1fr] gap-5">
      <PageHeaderContainer
        loading={loading}
        headerText="Jobsite Management"
        descriptionText="Create, edit, and manage jobsite details"
        refetch={() => {
          rerender();
        }}
      />
      <div className="h-10 w-full flex flex-row justify-between">
        <SearchBarPopover
          term={searchTerm}
          handleSearchChange={(e) => setSearchTerm(e.target.value)}
          placeholder={"Search by name or client..."}
          textSize="xs"
          imageSize="10"
        />

        <div className="flex flex-row justify-end w-full gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size={"icon"}
                onClick={() => setCreateJobsiteModal(true)}
                className="min-w-12 h-full"
              >
                <img
                  src="/plus-white.svg"
                  alt="Add Jobsite"
                  className="w-4 h-4"
                />
              </Button>
            </TooltipTrigger>
            <TooltipContent align="start" side="top">
              Create Jobsite
            </TooltipContent>
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

                  {pendingCount > 0 && (
                    <Badge className="absolute -top-2 -right-2 bg-red-500 text-white px-2 py-0.5 text-xs rounded-full">
                      {pendingCount}
                    </Badge>
                  )}
                </div>
              </Button>
            </TooltipTrigger>
            <TooltipContent align="end" side="top">
              Jobsite Approval
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
      <div className="h-[85vh] rounded-lg  w-full relative bg-white">
        <ScrollArea
          alwaysVisible
          className="h-[80vh] w-full  bg-white rounded-t-lg  border border-slate-200 relative pr-2"
        >
          {/* Loading overlay */}
          {loading && (
            <div className="absolute inset-0 z-20 flex flex-row items-center gap-2 justify-center bg-white bg-opacity-70 rounded-lg">
              <Spinner size={20} />
              <span className="text-lg text-gray-500">Loading...</span>
            </div>
          )}
          <JobsiteTable
            loading={loading}
            jobsiteDetails={paginatedJobsites}
            openHandleDelete={openHandleDelete}
            openHandleEdit={openHandleEdit}
            openHandleQr={openHandleQr}
            showPendingOnly={showPendingOnly}
          />
          <ScrollBar orientation="vertical" />
          <div className="h-1  absolute bottom-0 right-0 left-0">
            <ScrollBar
              orientation="horizontal"
              className="w-full h-3 ml-2 mr-2 rounded-full"
            />
          </div>
        </ScrollArea>
        {/* Pagination Controls */}
        {totalPages > 1 && (
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
      {editJobsiteModal && pendingEditId && (
        <EditJobsiteModal
          cancel={() => setEditJobsiteModal(false)}
          pendingEditId={pendingEditId}
          rerender={rerender}
        />
      )}
      {createJobsiteModal && (
        <CreateJobsiteModal
          cancel={() => setCreateJobsiteModal(false)}
          rerender={rerender}
        />
      )}

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Jobsite</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this jobsite? All jobsite data
              will be permanently deleted including Timesheets. This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={cancelDelete}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
