"use client";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCostCodeData } from "./_components/useCostCodeData";
import Spinner from "@/components/(animations)/spinner";
import CostCodeTable from "./_components/CostCodeTable";
import CreateCostCodeModal from "./_components/CreateCostCodeModal";
import EditCostCodeModal from "./_components/EditCostCodeModal";
import { useTagData } from "./_components/useTagData";
import TagTable from "./_components/TagTable";
import CreateTagModal from "./_components/CreateTagModal";
import EditTagModal from "./_components/EditTagModal";
import SearchBarPopover from "../_pages/searchBarPopover";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Tags } from "lucide-react";
import { PageHeaderContainer } from "../_pages/PageHeaderContainer";
import { FooterPagination } from "../_pages/FooterPagination";

export default function CostCodePage() {
  const [pageState, setPageState] = useState<"CostCode" | "Tags">("CostCode");
  const {
    loading,
    CostCodeDetails,
    rerender,
    total,
    page,
    totalPages,
    pageSize,
    setPage,
    setPageSize,
    inputValue,
    setInputValue,
    editCostCodeModal,
    setEditCostCodeModal,
    createCostCodeModal,
    setCreateCostCodeModal,
    pendingEditId,
    showDeleteDialog,
    setShowDeleteDialog,
    openHandleEdit,
    confirmDelete,
    openHandleDelete,
    cancelDelete,
    filteredCostCodes,
  } = useCostCodeData();

  const {
    createTagModal,
    setCreateTagModal,
    editTagModal,
    setEditTagModal,
    showDeleteTagDialog,
    setShowDeleteTagDialog,
    pendingTagEditId,
    loading: tagLoading,
    rerender: tagRerender,
    inputValue: searchTag,
    setInputValue: setSearchTag,
    confirmTagDelete,
    cancelTagDelete,
    openHandleTagEdit,
    openHandleTagDelete,
    totalPages: totalPagesTags,
    filteredTags,
  } = useTagData();

  return (
    <div className="w-full p-4 grid grid-rows-[3rem_2rem_1fr] gap-5">
      <PageHeaderContainer
        loading={pageState === "CostCode" ? loading : tagLoading}
        headerText={
          pageState === "CostCode" ? "Cost Code Management" : "Tag Management"
        }
        descriptionText={`Create, edit, and manage 
              ${pageState === "CostCode" ? "Cost Code" : "Tag"} details
              `}
        refetch={pageState === "CostCode" ? rerender : tagRerender}
      />

      <div className="h-10 w-full flex flex-row justify-between">
        {pageState === "CostCode" ? (
          <SearchBarPopover
            term={inputValue}
            handleSearchChange={(e) => setInputValue(e.target.value)}
            placeholder={"Search by name..."}
            textSize="xs"
            imageSize="10"
          />
        ) : (
          <SearchBarPopover
            term={searchTag}
            handleSearchChange={(e) => setSearchTag(e.target.value)}
            placeholder={"Search by name..."}
            textSize="xs"
            imageSize="10"
          />
        )}

        <div className="flex flex-row justify-end w-full gap-2">
          {pageState === "CostCode" ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  className="min-w-12 h-full"
                  onClick={() => setCreateCostCodeModal(true)}
                >
                  <img
                    src="/plus-white.svg"
                    alt="Add CostCode"
                    className="w-4 h-4"
                  />
                </Button>
              </TooltipTrigger>
              <TooltipContent align="center" side="top">
                Create Cost Code
              </TooltipContent>
            </Tooltip>
          ) : (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  className="min-w-12 h-full"
                  onClick={() => setCreateTagModal(true)}
                >
                  <img
                    src="/plus-white.svg"
                    alt="Add CostCode"
                    className="w-4 h-4"
                  />
                </Button>
              </TooltipTrigger>
              <TooltipContent align="center" side="top">
                Create Tag
              </TooltipContent>
            </Tooltip>
          )}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                className="min-w-12 h-full"
                size={"icon"}
                onClick={
                  pageState === "CostCode"
                    ? () => setPageState("Tags")
                    : () => setPageState("CostCode")
                }
              >
                {pageState !== "CostCode" ? (
                  <img src="/qrCode-white.svg" alt="Tags" className="w-4 h-4" />
                ) : (
                  <Tags className="w-4 h-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent align="center" side="top">
              {pageState === "CostCode" ? "Tags" : "Cost Codes"}
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
          {filteredTags.length === 0 &&
            pageState === "Tags" &&
            loading === false && (
              <div className="absolute inset-0 z-20 flex flex-row items-center gap-2 justify-center rounded-lg">
                <span className="text-lg text-gray-500">No Results found</span>
              </div>
            )}
          {filteredCostCodes.length === 0 &&
            pageState === "CostCode" &&
            loading === false && (
              <div className="absolute inset-0 z-20 flex flex-row items-center gap-2 justify-center rounded-lg">
                <span className="text-lg text-gray-500">No Results found</span>
              </div>
            )}

          {loading && !tagLoading && (
            <div className="absolute inset-0 z-20 flex flex-row items-center gap-2 justify-center bg-white bg-opacity-70 rounded-lg">
              <Spinner size={20} />
              <span className="text-lg text-gray-500">Loading...</span>
            </div>
          )}
          {tagLoading && !loading && (
            <div className="absolute inset-0 z-20 flex flex-row items-center gap-2 justify-center bg-white bg-opacity-70 rounded-lg">
              <Spinner size={20} />
              <span className="text-lg text-gray-500">Loading...</span>
            </div>
          )}
          {pageState === "CostCode" ? (
            <CostCodeTable
              loading={loading}
              costCodeDetails={filteredCostCodes}
              openHandleDelete={openHandleDelete}
              openHandleEdit={openHandleEdit}
              inputValue={inputValue}
            />
          ) : (
            <TagTable
              loading={tagLoading}
              tagDetails={filteredTags}
              openHandleDelete={openHandleTagDelete}
              openHandleEdit={openHandleTagEdit}
            />
          )}
          <ScrollBar orientation="vertical" />
          <div className="h-1 bg-slate-100 border-y border-slate-200 absolute bottom-0 right-0 left-0">
            <ScrollBar
              orientation="horizontal"
              className="w-full h-3 ml-2 mr-2 rounded-full"
            />
          </div>
        </ScrollArea>
        {/* Pagination Controls */}
        {pageState === "CostCode" ? (
          <>
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
          </>
        ) : (
          <>
            {totalPagesTags > 1 && (
              <FooterPagination
                page={page}
                totalPages={totalPages}
                total={total}
                pageSize={pageSize}
                setPage={setPage}
                setPageSize={setPageSize}
                hideItems={1}
              />
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
      {createTagModal && (
        <CreateTagModal
          cancel={() => setCreateTagModal(false)}
          rerender={tagRerender}
        />
      )}
      {editTagModal && pendingTagEditId && (
        <EditTagModal
          cancel={() => setEditTagModal(false)}
          pendingEditId={pendingTagEditId}
          rerender={tagRerender}
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

      <Dialog open={showDeleteTagDialog} onOpenChange={setShowDeleteTagDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Tag</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this Tag? All Tag data will be
              permanently deleted including Timesheets. This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={cancelTagDelete}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmTagDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
