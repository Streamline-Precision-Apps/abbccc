"use client";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import EquipmentTable from "./_components/equipmentTable";
import { useEquipmentData } from "./_components/useEquipmentData";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import EditEquipmentModal from "./_components/EditEquipmentModal";
import CreateEquipmentModal from "./_components/CreateEquipmentModal";
import { Badge } from "@/components/ui/badge";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import Spinner from "@/components/(animations)/spinner";
import SearchBarPopover from "../_pages/searchBarPopover";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { PageHeaderContainer } from "../_pages/PageHeaderContainer";

export default function EquipmentPage() {
  const {
    loading,
    rerender,
    total,
    page,
    pageSize,
    totalPages,
    setPage,
    setPageSize,
    showPendingOnly,
    setShowPendingOnly,
    pendingCount,
    editEquipmentModal,
    setEditEquipmentModal,
    createEquipmentModal,
    setCreateEquipmentModal,
    showDeleteDialog,
    setShowDeleteDialog,
    pendingEditId,
    openHandleEdit,
    openHandleDelete,
    confirmDelete,
    openHandleQr,
    cancelDelete,
    filteredEquipment,
    searchTerm,
    setSearchTerm,
  } = useEquipmentData();

  return (
    <div className="w-full p-4 grid grid-rows-[3rem_2rem_1fr] gap-5">
      <PageHeaderContainer
        loading={loading}
        headerText="Equipment Management"
        descriptionText="Create, edit, and manage equipment details"
        refetch={() => {
          rerender();
        }}
      />
      <div className="h-10 w-full flex flex-row justify-between gap-4">
        <SearchBarPopover
          term={searchTerm}
          handleSearchChange={(e) => setSearchTerm(e.target.value)}
          placeholder={"Search by name, make, or model..."}
          textSize="xs"
          imageSize="10"
        />

        <div className="flex flex-row justify-end w-full gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={() => setCreateEquipmentModal(true)}
                className="min-w-12 h-full "
              >
                <img
                  src="/plus-white.svg"
                  alt="Add Equipment"
                  className="w-4 h-4"
                />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">Create Equipment</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={() => setShowPendingOnly(!showPendingOnly)}
                className={`relative border-none w-fit min-w-16 h-full px-4 bg-gray-900 hover:bg-gray-800 text-white ${
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
              Equipment Approval
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
      <div className="h-[85vh] rounded-lg  w-full relative bg-white">
        {/* Loading overlay */}
        {loading && (
          <div className="absolute inset-0 z-20 flex flex-row items-center gap-2 justify-center bg-white bg-opacity-70 rounded-lg">
            <Spinner size={20} />
            <span className="text-lg text-gray-500">Loading...</span>
          </div>
        )}
        <ScrollArea
          alwaysVisible
          className="h-[80vh] w-full  bg-slate-50 rounded-t-lg  border border-slate-200 relative pr-3 "
        >
          <EquipmentTable
            loading={loading}
            equipmentDetails={filteredEquipment}
            openHandleDelete={openHandleDelete}
            openHandleEdit={openHandleEdit}
            openHandleQr={openHandleQr}
            showPendingOnly={showPendingOnly}
          />
          <ScrollBar orientation="vertical" />
          <div className="h-1 absolute bottom-0 right-0 left-0">
            <ScrollBar
              orientation="horizontal"
              className="w-full h-3 ml-2 mr-2 rounded-full "
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
      {editEquipmentModal && pendingEditId && (
        <EditEquipmentModal
          cancel={() => setEditEquipmentModal(false)}
          pendingEditId={pendingEditId}
          rerender={rerender}
        />
      )}
      {createEquipmentModal && (
        <CreateEquipmentModal
          cancel={() => setCreateEquipmentModal(false)}
          rerender={rerender}
        />
      )}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Form Template?</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this form template? All form data
              will be permanently deleted. This action cannot be undone.
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
