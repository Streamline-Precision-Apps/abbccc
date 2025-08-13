"use client";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";
import Spinner from "@/components/(animations)/spinner";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import SearchBarPopover from "../_pages/searchBarPopover";
import { useCrewsData } from "./_component/useCrewsData";
import CrewTable from "./_component/CrewTable";
import CreateCrewModal from "./_component/createCrewModal";
import EditCrewModal from "./_component/editCrewModal";
import { PageHeaderContainer } from "../_pages/PageHeaderContainer";

export default function CrewPage() {
  const {
    loading,
    crew,
    total,
    totalPages,
    page,
    pageSize,
    setPage,
    setPageSize,
    showInactive,
    searchTerm,
    setSearchTerm,
    rerender,
    editCrewModal,
    setEditCrewModal,
    createCrewModal,
    setCreateCrewModal,
    pendingEditId,
    showDeleteDialog,
    setShowDeleteDialog,
    openHandleEdit,
    openHandleDelete,
    confirmDelete,
    cancelDelete,
  } = useCrewsData();

  return (
    <div className="w-full p-4 grid grid-rows-[3rem_2rem_1fr] gap-5">
      <PageHeaderContainer
        loading={loading}
        headerText="Crew Management"
        descriptionText="Create, edit, and manage crew details"
        refetch={() => {
          rerender();
        }}
      />
      <div className="h-10 w-full flex flex-row justify-between gap-4">
        <div className="flex flex-row w-full gap-2">
          <SearchBarPopover
            term={searchTerm}
            handleSearchChange={(e) => setSearchTerm(e.target.value)}
            placeholder={"Search by name, username, or number..."}
            textSize="xs"
            imageSize="10"
          />
        </div>
        <div className="w-full h-full flex flex-row justify-end items-center">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size={"icon"}
                onClick={() => setCreateCrewModal(true)}
                className="min-w-12 h-full"
              >
                <img src="/plus-white.svg" alt="Add Crew" className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent align="start" side="top">
              Create Crew
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
          <CrewTable
            loading={loading}
            crew={crew}
            openHandleDelete={openHandleDelete}
            openHandleEdit={openHandleEdit}
            showInactive={showInactive}
          />
          <ScrollBar orientation="vertical" />
          <div className="h-1  absolute bottom-0 right-0 left-0">
            <ScrollBar
              orientation="horizontal"
              className="w-full h-3 ml-2 mr-2 rounded-full"
            />
          </div>
        </ScrollArea>
        {totalPages > 1 && (
          <div className="absolute bottom-0 h-[5vh] left-0 right-0 flex flex-row justify-between items-center mt-2 px-2 bg-white border-t border-gray-200 rounded-b-lg">
            <div className="text-xs text-gray-600">
              Showing page {page} of {totalPages} ({total} total)
            </div>
            <div className="flex flex-row gap-2 items-center">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={(e) => {
                        e.preventDefault();
                        setPage(Math.max(1, page - 1));
                      }}
                      aria-disabled={page === 1}
                      tabIndex={page === 1 ? -1 : 0}
                      style={{
                        pointerEvents: page === 1 ? "none" : undefined,
                        opacity: page === 1 ? 0.5 : 1,
                      }}
                    />
                  </PaginationItem>
                  <PaginationItem>
                    <span className="text-xs border rounded py-1 px-2">
                      {page}
                    </span>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext
                      onClick={(e) => {
                        e.preventDefault();
                        setPage(Math.min(totalPages, page + 1));
                      }}
                      aria-disabled={page === totalPages}
                      tabIndex={page === totalPages ? -1 : 0}
                      style={{
                        pointerEvents: page === totalPages ? "none" : undefined,
                        opacity: page === totalPages ? 0.5 : 1,
                      }}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
              <select
                className="ml-2 px-1 py-1 rounded text-xs border"
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setPage(1);
                }}
              >
                {[25, 50, 75, 100].map((size) => (
                  <option key={size} value={size}>
                    {size} Rows
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>
      {editCrewModal && pendingEditId && (
        <EditCrewModal
          cancel={() => setEditCrewModal(false)}
          pendingEditId={pendingEditId}
          rerender={rerender}
        />
      )}
      {createCrewModal && (
        <CreateCrewModal
          cancel={() => setCreateCrewModal(false)}
          rerender={rerender}
        />
      )}

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Crew</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this crew? All crew data will be
              permanently deleted. This action cannot be undone.
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
