"use client";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useSidebar } from "@/components/ui/sidebar";
import React, { useEffect, useState } from "react";
import JobsiteTable from "./_components/jobsiteTable";
import QRCode from "qrcode";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { deleteJobsite } from "@/actions/AssetActions";

import { Badge } from "@/components/ui/badge";
import { JobsiteSummary, useJobsiteData } from "./_components/useJobsiteData";
import EditJobsiteModal from "./_components/EditJobsiteModal";
import CreateJobsiteModal from "./_components/CreateJobsiteModal";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";
import Spinner from "@/components/(animations)/spinner";
import ReloadBtnSpinner from "@/components/(animations)/reload-btn-spinner";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import SearchBarPopover from "../_pages/searchBarPopover";

export default function JobsitePage() {
  const { setOpen, open } = useSidebar();
  const [searchTerm, setSearchTerm] = useState("");
  const {
    loading,
    jobsiteDetails,
    rerender,
    total,
    page,
    pageSize,
    setPage,
    setPageSize,
    showPendingOnly,
    setShowPendingOnly,
  } = useJobsiteData();

  // State for modals
  const [editJobsiteModal, setEditJobsiteModal] = useState(false);
  const [createJobsiteModal, setCreateJobsiteModal] = useState(false);

  // State for delete confirmation dialog
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [pendingEditId, setPendingEditId] = useState<string | null>(null);
  const [pendingQrId, setPendingQrId] = useState<string | null>(null);

  // Pagination state

  const openHandleEdit = (id: string) => {
    setPendingEditId(id);
    setEditJobsiteModal(true);
  };

  const openHandleDelete = (id: string) => {
    setPendingDeleteId(id);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (pendingDeleteId) {
      await deleteJobsite(pendingDeleteId);
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
  const pendingCount = jobsiteDetails.filter(
    (item) => item.approvalStatus === "PENDING",
  ).length;

  // Filter job sites by name or client name and by approval status if showPendingOnly is active
  const filteredJobsites = jobsiteDetails.filter((item) => {
    const term = searchTerm.trim().toLowerCase();
    if (!term || term.length < 3) return true;
    const jobsiteName = item.name?.toLowerCase() || "";
    return jobsiteName.includes(term);
  });

  // Pagination logic
  const totalJobsites = filteredJobsites.length;
  const totalPages = Math.ceil(totalJobsites / pageSize);
  const paginatedJobsites = filteredJobsites.slice(
    (page - 1) * pageSize,
    page * pageSize,
  );

  // Reset to page 1 if search or filter changes
  useEffect(() => {
    setPage(1);
  }, [searchTerm, showPendingOnly]);

  const openHandleQr = (id: string) => {
    setPendingQrId(id);
    const jobsite = jobsiteDetails.find((j) => j.id === id);
    if (jobsite) {
      printQRCode(jobsite);
    }
  };

  const printQRCode = async (jobsite: JobsiteSummary) => {
    if (!pendingQrId) return;
    const url = await QRCode.toDataURL(jobsite.qrId || "");
    // Open a new window for printing
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      alert("Please allow popups to print the QR code");
      return;
    }

    // Write HTML content to the new window
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Print QR Code - ${jobsite.name || "Jobsite"}</title>
        <style>
          body {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100vh;
            margin: 0;
            padding: 20px;
            box-sizing: border-box;
            font-family: Arial, sans-serif;
          }
          .qr-code-container {
            text-align: center;
          }
          .qr-code {
            width: 300px;
            height: 300px;
            border: 4px solid black;
            border-radius: 10px;
            margin-bottom: 20px;
          }
          .equipment-name {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 10px;
          }
          .equipment-id {
            font-size: 16px;
            color: #555;
            margin-bottom: 8px;
          }
          .equipment-description {
            font-size: 16px;
            color: #555;
            max-width: 350px;
            padding: 0 20px;
            line-height: 1.4;
            margin-top: 8px;
            white-space: pre-wrap;
            overflow-wrap: break-word;
          }
          @media print {
            body {
              -webkit-print-color-adjust: exact;
              color-adjust: exact;
            }
          }
        </style>
      </head>
      <body>
        <div class="qr-code-container">
          <div class="equipment-name">${jobsite.name || "N/A"}</div>
          <img src="${url}" alt="QR Code" class="qr-code" />
          <div class="equipment-id">ID: ${jobsite.qrId || "N/A"}</div>
          <div class="equipment-description">${
            jobsite.description
              ? `Brief Description:\n${jobsite.description || ""}`
              : ""
          }</div>
        </div>
        <script>
          // Print and close window when loaded
          window.onload = function() {
            window.print();
            // Close after printing is done or canceled
            setTimeout(() => window.close());
          };
        </script>
      </body>
      </html>
    `);

    printWindow.document.close();
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
              Jobsite Management
            </p>
            <p className="text-left text-xs text-white">
              Create, edit, and manage jobsite details
            </p>
          </div>
        </div>
        <ReloadBtnSpinner isRefreshing={loading} fetchData={rerender} />
      </div>
      <div className="h-fit max-h-12  w-full flex flex-row justify-between gap-4 mb-2 ">
        <div className="flex flex-row w-full gap-4 mb-2">
          <div className="h-full w-fit p-1 bg-white rounded-lg ">
            <SearchBarPopover
              term={searchTerm}
              handleSearchChange={(e) => setSearchTerm(e.target.value)}
              placeholder={"Search by name or client..."}
              textSize="xs"
              imageSize="6"
            />
          </div>
        </div>
        <div className="flex flex-row justify-end w-full gap-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size={"icon"}
                onClick={() => setCreateJobsiteModal(true)}
                className="min-w-12"
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
                className={`relative border-none min-w-16  bg-gray-900 hover:bg-gray-800 text-white ${
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
