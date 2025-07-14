"use client";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useSidebar } from "@/components/ui/sidebar";
import SearchBar from "../personnel/components/SearchBar";
import { useState } from "react";
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
import { deleteEquipment } from "@/actions/AssetActions";
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

export default function EquipmentPage() {
  const { setOpen, open } = useSidebar();
  const [searchTerm, setSearchTerm] = useState("");
  const {
    loading,
    equipmentDetails,
    rerender,
    total,
    page,
    pageSize,
    totalPages,
    setTotal,
    setPage,
    setPageSize,
    setTotalPages,
  } = useEquipmentData();

  // State for modals
  const [editEquipmentModal, setEditEquipmentModal] = useState(false);
  const [createEquipmentModal, setCreateEquipmentModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [pendingEditId, setPendingEditId] = useState<string | null>(null);

  //Approval Button States
  const [showPendingOnly, setShowPendingOnly] = useState(false);

  const openHandleEdit = (id: string) => {
    setPendingEditId(id);
    setEditEquipmentModal(true);
  };

  const openHandleDelete = (id: string) => {
    setPendingDeleteId(id);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (pendingDeleteId) {
      await deleteEquipment(pendingDeleteId);
      setShowDeleteDialog(false);
      setPendingDeleteId(null);
      rerender();
    }
  };

  const cancelDelete = () => {
    setShowDeleteDialog(false);
    setPendingDeleteId(null);
  };

  // Count all pending items
  const pendingCount = equipmentDetails.filter(
    (item) => item.approvalStatus === "PENDING"
  ).length;

  // Filter equipment by name, make, or model, and by approval status if showPendingOnly is active
  const filteredEquipment = equipmentDetails.filter((item) => {
    if (showPendingOnly && item.approvalStatus !== "PENDING") return false;
    const term = searchTerm.trim().toLowerCase();
    if (!term) return true;
    const nameMatch = item.name.toLowerCase().includes(term);
    const makeMatch =
      item.equipmentVehicleInfo?.make?.toLowerCase().includes(term) ?? false;
    const modelMatch =
      item.equipmentVehicleInfo?.model?.toLowerCase().includes(term) ?? false;
    return nameMatch || makeMatch || modelMatch;
  });

  return (
    <div className="w-full p-4 grid grid-rows-[3rem_2rem_1fr] gap-4">
      <div className="h-full row-span-1 max-h-12 w-full flex flex-row justify-between gap-4 ">
        <div className="w-full flex flex-row gap-5 ">
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
          <div className="w-full flex flex-col gap-1">
            <p className="text-left w-fit text-base text-white font-bold">
              Equipment Management
            </p>
            <p className="text-left text-xs text-white">
              Create, edit, and manage equipment details
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
              placeholder={"Search by name, make, or model..."}
              textSize="xs"
              imageSize="6"
            />
          </div>
        </div>
        <div className="flex flex-row justify-end w-full gap-4">
          <Button onClick={() => setCreateEquipmentModal(true)}>
            <img
              src="/plus-white.svg"
              alt="Add Equipment"
              className="w-4 h-4"
            />
            <p className="text-left text-xs text-white">New Equipment</p>
          </Button>
          <Button
            onClick={() => setShowPendingOnly(!showPendingOnly)}
            className={`relative border-none w-fit h-fit px-4 bg-gray-900 hover:bg-gray-800 text-white ${
              showPendingOnly ? "ring-2 ring-red-400" : ""
            }`}
          >
            <div className="flex flex-row items-center">
              <img
                src="/inbox-white.svg"
                alt="Approval"
                className="h-4 w-4 mr-2"
              />
              <p className="text-white text-sm font-extrabold">Approval</p>
              {pendingCount > 0 && (
                <Badge className="absolute -top-2 -right-2 bg-red-500 text-white px-2 py-0.5 text-xs rounded-full">
                  {pendingCount}
                </Badge>
              )}
            </div>
          </Button>
        </div>
      </div>
      <div className="h-[85vh] rounded-lg  w-full relative bg-white">
        <ScrollArea
          alwaysVisible
          className="h-[80vh] w-full  bg-white rounded-t-lg  border border-slate-200 relative pr-2"
        >
          <EquipmentTable
            equipmentDetails={filteredEquipment}
            openHandleDelete={openHandleDelete}
            openHandleEdit={openHandleEdit}
          />
          <ScrollBar orientation="vertical" />
          <div className="h-1 absolute bottom-0 right-0 left-0">
            <ScrollBar
              orientation="horizontal"
              className="w-full h-3 ml-2 mr-2 rounded-full"
            />
          </div>
        </ScrollArea>
        {totalPages && (
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
