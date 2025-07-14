"use client";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useSidebar } from "@/components/ui/sidebar";
import SearchBar from "../personnel/components/SearchBar";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { deleteCostCode } from "@/actions/AssetActions";
import {
  CostCodeSummary,
  useCostCodeData,
} from "./_components/useCostCodeData";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";
import Spinner from "@/components/(animations)/spinner";
import CostCodeTable from "./_components/CostCodeTable";
import CreateCostCodeModal from "./_components/CreateCostCodeModal";
import EditCostCodeModal from "./_components/EditCostCodeModal";
import { useTagData } from "./_components/useTagData";
import TagTable from "./_components/TagTable";

export default function CostCodePage() {
  const { setOpen, open } = useSidebar();
  const [searchTerm, setSearchTerm] = useState("");
  const {
    loading,
    CostCodeDetails,
    rerender,
    total,
    page,
    pageSize,
    setPage,
    setPageSize,
  } = useCostCodeData();

  const {
    loading: tagLoading,
    tagDetails,
    rerender: tagRerender,
    total: tagTotal,
    page: tagPage,
    pageSize: tagPageSize,
    setPage: setTagPage,
    setPageSize: setTagPageSize,
  } = useTagData();

  // Combine loading states for both cost codes and tags for a unified loading experience
  const loadingState = loading || tagLoading;

  const [pageState, setPageState] = useState<"CostCode" | "Tags">("CostCode");

  // State for modals
  const [editCostCodeModal, setEditCostCodeModal] = useState(false);
  const [createCostCodeModal, setCreateCostCodeModal] = useState(false);

  // State for pending edit tag modal
  const [pendingEditTagModal, setPendingEditTagModal] = useState(false);
  const [createTagModal, setCreateTagModal] = useState(false);

  // State for delete confirmation dialog
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [pendingEditId, setPendingEditId] = useState<string | null>(null);

  // State for tag management
  const [showDeleteTagDialog, setShowDeleteTagDialog] = useState(false);
  const [pendingTagEditId, setPendingTagEditId] = useState<string | null>(null);
  const [pendingTagDeleteId, setPendingTagDeleteId] = useState<string | null>(
    null
  );

  // Pagination state

  const openHandleEdit = (id: string) => {
    setPendingEditId(id);
    setEditCostCodeModal(true);
  };

  const openHandleTagEdit = (id: string) => {
    setPendingTagEditId(id);
    setPendingEditTagModal(true);
  };

  const openHandleDelete = (id: string) => {
    setPendingDeleteId(id);
    setShowDeleteDialog(true);
  };

  const openHandleTagDelete = (id: string) => {
    setPendingDeleteId(id);
    setShowDeleteTagDialog(true);
  };

  const confirmDelete = async () => {
    if (pendingDeleteId) {
      await deleteCostCode(pendingDeleteId);
      setShowDeleteDialog(false);
      setPendingDeleteId(null);
      rerender();
    }
  };

  const cancelDelete = () => {
    setShowDeleteDialog(false);
    setPendingDeleteId(null);
  };

  // Simple filter by cost code name
  const filteredCostCodes = CostCodeDetails.filter((costCode) =>
    costCode.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const totalCostCodes = filteredCostCodes.length;
  const totalPages = Math.ceil(totalCostCodes / pageSize);
  const paginatedCostCodes = filteredCostCodes.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const totalTags = tagDetails.length;
  const totalPagesTags = Math.ceil(totalTags / tagPageSize);
  const paginatedTags = tagDetails.slice(
    (tagPage - 1) * tagPageSize,
    tagPage * tagPageSize
  );

  // Reset to page 1 if search or filter changes
  useEffect(() => {
    setPage(1);
  }, [searchTerm]);

  return (
    <div className="w-full p-4 grid grid-rows-[3rem_2rem_1fr] gap-4">
      <div className="h-full row-span-1 max-h-12 w-full flex flex-row justify-between gap-4 ">
        <div className="w-full flex flex-row  ">
          <div className="flex items-center justify-center">
            <Button
              variant="ghost"
              size="icon"
              className={`h-8 w-8 p-0 hover:bg-slate-500 hover:bg-opacity-20 ${
                open ? "bg-slate-500 bg-opacity-20" : "bg-app-blue "
              }`}
              onClick={() => {
                setOpen(!open);
              }}
            >
              <img
                src={open ? "/condense-white.svg" : "/condense.svg"}
                alt="logo"
                className="w-4 h-auto object-contain "
              />
            </Button>
          </div>

          <div className="w-fit flex flex-col gap-1 ml-4">
            <p className="text-left w-fit text-base text-white font-bold">
              {pageState === "CostCode"
                ? "Cost Code Management"
                : "Tag Management"}
            </p>

            <p className="text-left text-xs text-white">
              Create, edit, and manage{" "}
              {pageState === "CostCode" ? "Cost Code" : "Tag"} details
            </p>
          </div>
        </div>
      </div>
      <div className="h-fit max-h-12  w-full flex flex-row justify-between gap-4 mb-2 ">
        <div className="flex flex-row w-full gap-4 mb-2">
          <div className="h-full w-full p-1 bg-white max-w-[450px] rounded-lg ">
            <SearchBar
              term={searchTerm}
              handleSearchChange={(e) => setSearchTerm(e.target.value)}
              placeholder={"Search by name..."}
              textSize="xs"
              imageSize="6"
            />
          </div>
        </div>
        <div className="flex flex-row justify-end w-full gap-4">
          <Button
            onClick={
              pageState === "CostCode"
                ? () => setPageState("Tags")
                : () => setPageState("CostCode")
            }
          >
            <img
              src="/statusOngoing-white.svg"
              alt="Add CostCode"
              className="w-4 h-4"
            />
            <div className="flex flex-row items-center gap-2">
              {pageState === "CostCode" ? "Tags" : "Cost Codes"}
            </div>
          </Button>
          {pageState === "CostCode" ? (
            <Button onClick={() => setCreateCostCodeModal(true)}>
              <img
                src="/plus-white.svg"
                alt="Add CostCode"
                className="w-4 h-4"
              />
              <p className="text-left text-xs text-white">New Cost Code</p>
            </Button>
          ) : (
            <Button onClick={() => setCreateTagModal(true)}>
              <img
                src="/plus-white.svg"
                alt="Add CostCode"
                className="w-4 h-4"
              />
              <p className="text-left text-xs text-white">New Tag</p>
            </Button>
          )}
        </div>
      </div>
      <div className="h-[85vh] rounded-lg  w-full relative bg-white">
        <ScrollArea
          alwaysVisible
          className="h-[80vh] w-full  bg-white rounded-t-lg  border border-slate-200 relative pr-2"
        >
          {/* Loading overlay */}
          {loadingState && (
            <div className="absolute inset-0 z-20 flex flex-row items-center gap-2 justify-center bg-white bg-opacity-70 rounded-lg">
              <Spinner size={20} />
              <span className="text-lg text-gray-500">Loading...</span>
            </div>
          )}
          {pageState === "CostCode" ? (
            <CostCodeTable
              costCodeDetails={paginatedCostCodes}
              openHandleDelete={openHandleDelete}
              openHandleEdit={openHandleEdit}
            />
          ) : (
            <TagTable
              tagDetails={paginatedTags}
              openHandleDelete={openHandleTagDelete}
              openHandleEdit={openHandleTagEdit}
            />
          )}
          <ScrollBar orientation="vertical" />
          <div className="h-1  absolute bottom-0 right-0 left-0">
            <ScrollBar
              orientation="horizontal"
              className="w-full h-3 ml-2 mr-2 rounded-full"
            />
          </div>
        </ScrollArea>
        {/* Pagination Controls */}
        {pageState === "CostCode" ? (
          <>
            {totalPages && (
              <div className="absolute bottom-0 h-[5vh] left-0 right-0 flex flex-row justify-between items-center mt-2 px-3 bg-white border-t border-gray-200 rounded-b-lg">
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
                            pointerEvents:
                              page === totalPages ? "none" : undefined,
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
          </>
        ) : (
          <>
            {totalPagesTags && (
              <div className="absolute bottom-0 h-[5vh] left-0 right-0 flex flex-row justify-between items-center mt-2 px-3 bg-white border-t border-gray-200 rounded-b-lg">
                <div className="text-xs text-gray-600">
                  Showing page {tagPage - 1} of {totalPagesTags - 1} (
                  {totalTags - 1} total)
                </div>
                <div className="flex flex-row gap-2 items-center">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={(e) => {
                            e.preventDefault();
                            setPage(Math.max(1, tagPage - 1));
                          }}
                          aria-disabled={tagPage === 1}
                          tabIndex={tagPage === 1 ? -1 : 0}
                          style={{
                            pointerEvents: tagPage === 1 ? "none" : undefined,
                            opacity: tagPage === 1 ? 0.5 : 1,
                          }}
                        />
                      </PaginationItem>
                      <PaginationItem>
                        <span className="text-xs border rounded py-1 px-2">
                          {tagPage || ""}
                        </span>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationNext
                          onClick={(e) => {
                            e.preventDefault();
                            setPage(Math.min(totalPagesTags, tagPage + 1));
                          }}
                          aria-disabled={tagPage === totalPagesTags}
                          tabIndex={tagPage === totalPagesTags ? -1 : 0}
                          style={{
                            pointerEvents:
                              tagPage === totalPagesTags ? "none" : undefined,
                            opacity: tagPage === totalPagesTags ? 0.5 : 1,
                          }}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                  <select
                    className="ml-2 px-1 py-1 rounded text-xs border"
                    value={tagPageSize}
                    onChange={(e) => {
                      setTagPageSize(Number(e.target.value));
                      setTagPage(1);
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
          </>
        )}
      </div>
      {editCostCodeModal && pendingEditId && (
        <EditCostCodeModal
          cancel={() => setEditCostCodeModal(false)}
          pendingEditId={pendingEditId}
          rerender={rerender}
        />
      )}
      {createCostCodeModal && (
        <CreateCostCodeModal
          cancel={() => setCreateCostCodeModal(false)}
          rerender={rerender}
        />
      )}

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Cost Code</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this Cost Code? All Cost Code data
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
