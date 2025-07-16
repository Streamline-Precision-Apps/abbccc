"use client";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useSidebar } from "@/components/ui/sidebar";
import SearchBar from "../personnel/components/SearchBar";
import { useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useClientData } from "./_component/useClientData";
import { deleteClient } from "@/actions/AssetActions";
import ClientTable from "./_component/clientTable";
import Spinner from "@/components/(animations)/spinner";
import { Badge } from "@/components/ui/badge";
import CreateClientModal from "./_component/CreateClientModal";
import EditClientModal from "./_component/EditClientModal";
import { set } from "date-fns";

export default function ClientsPage() {
  const { setOpen, open } = useSidebar();
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [pendingEditId, setPendingEditId] = useState<string | null>(null);
  const [showPendingOnly, setShowPendingOnly] = useState(false);
  const [createClientModal, setCreateClientModal] = useState(false);
  const [editClientModal, setEditClientModal] = useState(false);
  const {
    loading,
    ClientDetails,
    rerender,
    total,
    page,
    pageSize,
    setPage,
    setPageSize,
  } = useClientData();

  const pendingCount = ClientDetails.filter(
    (item) => item.approvalStatus === "PENDING"
  ).length;

  const filteredClientDetails = ClientDetails.filter((client) => {
    if (showPendingOnly && client.approvalStatus !== "PENDING") return false;
    const term = searchTerm.toLowerCase();
    return (
      client.id.toLowerCase().includes(term) ||
      client.name.toLowerCase().includes(term) ||
      (client.description?.toLowerCase() || "").includes(term) ||
      [
        client.Address?.street,
        client.Address?.city,
        client.Address?.state,
        client.Address?.zipCode,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(term) ||
      (client.contactPerson?.toLowerCase() || "").includes(term) ||
      (client.contactEmail?.toLowerCase() || "").includes(term) ||
      (client.contactPhone?.toLowerCase() || "").includes(term)
    );
  });

  const totalClientDetails = filteredClientDetails.length;
  const totalPages = Math.ceil(totalClientDetails / pageSize);
  const paginatedClientDetails = filteredClientDetails.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  // Helper Function
  const openHandleEdit = (id: string) => {
    setPendingEditId(id);
    setEditClientModal(true);
  };
  const confirmDelete = async () => {
    if (pendingDeleteId) {
      await deleteClient(pendingDeleteId);
      setShowDeleteDialog(false);
      setPendingDeleteId(null);
      rerender();
    }
  };
  const cancelDelete = () => {
    setShowDeleteDialog(false);
    setPendingDeleteId(null);
  };
  const openHandleDelete = (id: string) => {
    setPendingDeleteId(id);
    setShowDeleteDialog(true);
  };

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
              Client Management
            </p>
            <p className="text-left text-xs text-white">
              Create, edit, and manage Client details
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
          <Button onClick={() => setCreateClientModal(true)}>
            <img src="/plus-white.svg" alt="Add Client" className="w-4 h-4" />
            <p className="text-left text-xs text-white">New Client</p>
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
          {loading && (
            <div className="absolute inset-0 z-20 flex flex-row items-center gap-2 justify-center bg-white bg-opacity-70 rounded-lg">
              <Spinner size={20} />
              <span className="text-lg text-gray-500">Loading...</span>
            </div>
          )}
          <ClientTable
            clientDetails={paginatedClientDetails}
            openHandleEdit={openHandleEdit}
            openHandleDelete={openHandleDelete}
          />
          <div className="h-1 bg-slate-100 border-y border-slate-200 absolute bottom-0 right-0 left-0">
            <ScrollBar
              orientation="horizontal"
              className="w-full h-3 ml-2 mr-2 rounded-full"
            />
          </div>
        </ScrollArea>
        {totalPages > 1 && (
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
      {/* Create Modal */}
      {createClientModal && (
        <CreateClientModal
          cancel={() => setCreateClientModal(false)}
          rerender={rerender}
        />
      )}

      {editClientModal && pendingEditId && (
        <EditClientModal
          cancel={() => setEditClientModal(false)}
          pendingEditId={pendingEditId}
          rerender={rerender}
        />
      )}

      {/* Delete Confirmation Modal */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Client</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this Client? All Client data will
              be permanently deleted including Timesheets. This action cannot be
              undone.
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
