"use client";
import { Button } from "@/components/ui/button";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Spinner from "@/components/(animations)/spinner";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import SearchBarPopover from "../_pages/searchBarPopover";
import { usePersonnelData } from "./_components/usePersonnelData";
import CreateUserModal from "./_components/createUser";
import EditUserModal from "./_components/editUser";
import { PageHeaderContainer } from "../_pages/PageHeaderContainer";
import { FooterPagination } from "../_pages/FooterPagination";
import { PersonnelDataTable } from "./_components/PersonnelDataTable";

export default function JobsitePage() {
  const {
    loading,
    personnelDetails,
    rerender,
    total,
    totalPages,
    page,
    pageSize,
    setPage,
    setPageSize,
    showInactive,
    searchTerm,
    setSearchTerm,
    editUserModal,
    setEditUserModal,
    createUserModal,
    setCreateUserModal,
    showDeleteDialog,
    setShowDeleteDialog,
    openHandleEdit,
    openHandleDelete,
    confirmDelete,
    cancelDelete,
    pendingEditId,
  } = usePersonnelData();

  return (
    <div className="w-full p-4 grid grid-rows-[3rem_2rem_1fr] gap-5">
      <PageHeaderContainer
        loading={loading}
        headerText=" Personnel Management"
        descriptionText="Create, edit, and manage personnel details"
        refetch={() => {
          rerender();
        }}
      />

      <div className="h-10 w-full flex flex-row justify-between gap-4">
        <SearchBarPopover
          term={searchTerm}
          handleSearchChange={(e) => setSearchTerm(e.target.value)}
          placeholder={"Search by name, username, or number..."}
          textSize="xs"
          imageSize="10"
        />

        <div className="w-full h-full flex flex-row justify-end items-center">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size={"icon"}
                onClick={() => setCreateUserModal(true)}
                className="min-w-12 h-full"
              >
                <img src="/plus-white.svg" alt="Add User" className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent align="start" side="top">
              Create User
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
          <PersonnelDataTable
            data={personnelDetails}
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
            showInactive={showInactive}
          />
        </div>
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
      {editUserModal && pendingEditId && (
        <EditUserModal
          cancel={() => setEditUserModal(false)}
          pendingEditId={pendingEditId}
          rerender={rerender}
        />
      )}
      {createUserModal && (
        <CreateUserModal
          cancel={() => setCreateUserModal(false)}
          rerender={rerender}
        />
      )}

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this user? All user data will be
              permanently deleted including Timesheets. This action cannot be
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
