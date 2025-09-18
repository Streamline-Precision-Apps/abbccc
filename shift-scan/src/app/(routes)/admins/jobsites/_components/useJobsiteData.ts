"use client";
import { ApprovalStatus } from "@/lib/enums";
import { useState, useEffect } from "react";
import { deleteJobsite } from "@/actions/AssetActions";
import QRCode from "qrcode";
import { useDashboardData } from "../../_pages/sidebar/DashboardDataContext";

export type JobsiteSummary = {
  id: string;
  code: string;
  name: string;
  qrId: string;
  description: string;
  isActive: boolean;
  approvalStatus: ApprovalStatus;
  createdAt: Date;
  updatedAt: Date;
  Address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  _count: {
    TimeSheets: number;
  };
};

export const useJobsiteData = () => {
  const { refresh } = useDashboardData();
  const [searchTerm, setSearchTerm] = useState("");
  const [jobsiteDetails, setJobsiteDetails] = useState<JobsiteSummary[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(25);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [showPendingOnly, setShowPendingOnly] = useState(false);
  // State for modals
  const [editJobsiteModal, setEditJobsiteModal] = useState(false);
  const [createJobsiteModal, setCreateJobsiteModal] = useState(false);

  // State for delete confirmation dialog
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [pendingEditId, setPendingEditId] = useState<string | null>(null);
  const [pendingQrId, setPendingQrId] = useState<string | null>(null);

  const rerender = () => setRefreshKey((k) => k + 1);

  useEffect(() => {
    const fetchEquipmentSummaries = async () => {
      try {
        setLoading(true);
        let url = "";
        if (showPendingOnly) {
          url = `/api/jobsiteManager?status=pending`;
        } else {
          url = `/api/jobsiteManager?page=${page}&pageSize=${pageSize}`;
        }
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error ${response.status}`);
        }
        const data = await response.json();
        setJobsiteDetails(data.jobsites);
        setTotal(data.total);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error("Failed to fetch jobsite details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEquipmentSummaries();
  }, [refreshKey, page, pageSize, showPendingOnly]);

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
      refresh();
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

  return {
    searchTerm,
    setSearchTerm,
    setJobsiteDetails,
    loading,
    setLoading,
    rerender,
    // Pagination state
    total,
    page,
    pageSize,
    totalPages,
    // Pagination handlers
    setTotal,
    setPage,
    setPageSize,
    setTotalPages,
    // Show pending only
    showPendingOnly,
    setShowPendingOnly,
    editJobsiteModal,
    setEditJobsiteModal,
    createJobsiteModal,
    setCreateJobsiteModal,
    showDeleteDialog,
    setShowDeleteDialog,
    pendingEditId,
    openHandleEdit,
    openHandleDelete,
    openHandleQr,
    confirmDelete,
    cancelDelete,
    pendingCount,
    paginatedJobsites,
  };
};
