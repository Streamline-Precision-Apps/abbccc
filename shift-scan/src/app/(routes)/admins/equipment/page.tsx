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

export default function EquipmentPage() {
  const { setOpen, open } = useSidebar();
  const [searchTerm, setSearchTerm] = useState("");
  const { loading, equipmentDetails, rerender } = useEquipmentData();

  // State for modals
  const [editEquipmentModal, setEditEquipmentModal] = useState(false);
  const [createEquipmentModal, setCreateEquipmentModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [pendingEditId, setPendingEditId] = useState<string | null>(null);

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

  // Filter equipment by name, make, or model
  const filteredEquipment = equipmentDetails.filter((item) => {
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
          <Button>
            <img
              src="/plus-white.svg"
              alt="Add Equipment"
              className="w-4 h-4"
            />
            <p className="text-left text-xs text-white">Approve</p>
          </Button>
          <Button onClick={() => setCreateEquipmentModal(true)}>
            <img
              src="/plus-white.svg"
              alt="Add Equipment"
              className="w-4 h-4"
            />
            <p className="text-left text-xs text-white">Create Equipment</p>
          </Button>
        </div>
      </div>

      <ScrollArea
        alwaysVisible
        className="h-[85vh] w-full  bg-white rounded-lg  border border-slate-200 relative pr-2"
      >
        <EquipmentTable
          equipmentDetails={filteredEquipment}
          openHandleDelete={openHandleDelete}
          openHandleEdit={openHandleEdit}
        />
        <ScrollBar orientation="vertical" />
        <div className="h-1 bg-slate-100 border-y border-slate-200 absolute bottom-0 right-0 left-0">
          <ScrollBar
            orientation="horizontal"
            className="w-full h-3 ml-2 mr-2 rounded-full"
          />
        </div>
      </ScrollArea>
      {editEquipmentModal && pendingEditId && (
        <EditEquipmentModal
          cancel={() => setEditEquipmentModal(false)}
          pendingEditId={pendingEditId}
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
