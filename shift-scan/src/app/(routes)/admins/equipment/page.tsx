"use client";
import { Button } from "@/components/ui/button";
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
import Spinner from "@/components/(animations)/spinner";
import SearchBarPopover from "../_pages/searchBarPopover";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { PageHeaderContainer } from "../_pages/PageHeaderContainer";
import { FooterPagination } from "../_pages/FooterPagination";
import { EquipmentDataTable } from "./_components/ViewAll/EquipmentDataTable";
import FilterPopover from "./_components/FilterPopover";

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
    setFilters,
    setUseFilters,
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
        <div className="flex flex-row gap-2">
          <SearchBarPopover
            term={searchTerm}
            handleSearchChange={(e) => setSearchTerm(e.target.value)}
            placeholder={"Search by name, make, or model..."}
            textSize="xs"
            imageSize="10"
          />
          <FilterPopover 
            onFilterChange={setFilters} 
            onUseFiltersChange={setUseFilters}
          />
        </div>

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
      <div className="h-[85vh] rounded-lg w-full relative bg-white overflow-hidden">
        {/* Loading overlay */}
        {loading && (
          <div className="absolute inset-0 z-20 flex flex-row items-center gap-2 justify-center bg-white bg-opacity-70 rounded-lg">
            <Spinner size={20} />
            <span className="text-lg text-gray-500">Loading...</span>
          </div>
        )}
        <div className="h-full w-full overflow-auto pb-10 border border-slate-200 rounded-t-lg">
          <EquipmentDataTable
            data={filteredEquipment}
            loading={loading}
            page={page}
            totalPages={totalPages}
            total={total}
            pageSize={pageSize}
            searchTerm={searchTerm}
            setPage={setPage}
            setPageSize={setPageSize}
            onEditClick={openHandleEdit}
            onDeleteClick={openHandleDelete}
            onQrClick={openHandleQr}
            showPendingOnly={showPendingOnly}
          />
        </div>

        <FooterPagination
          page={page}
          totalPages={totalPages}
          total={total || 0}
          pageSize={pageSize}
          setPage={setPage}
          setPageSize={setPageSize}
        />
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
