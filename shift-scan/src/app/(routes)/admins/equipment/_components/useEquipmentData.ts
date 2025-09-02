"use client";
import { useState, useEffect, useCallback } from "react";
import QRCode from "qrcode";
import { deleteEquipment } from "@/actions/AssetActions";
import { useSidebar } from "@/components/ui/sidebar";

/**
 * EquipmentSummary type for equipment/vehicle/truck/trailer asset
 */
export interface EquipmentSummary {
  id: string;
  qrId: string;
  code?: string;
  name: string;
  description: string;
  memo?: string;
  ownershipType?: "OWNED" | "LEASED";
  equipmentTag: "TRUCK" | "TRAILER" | "VEHICLE" | "EQUIPMENT";
  approvalStatus: "PENDING" | "APPROVED" | "REJECTED" | "DRAFT";
  state: "AVAILABLE" | "IN_USE" | "MAINTENANCE" | "NEEDS_REPAIR" | "RETIRED";
  createdAt: string | Date;
  updatedAt: string | Date;
  // Direct vehicle/equipment properties
  make?: string;
  model?: string;
  year?: string;
  color?: string;
  serialNumber?: string;
  acquiredDate?: string | Date;
  acquiredCondition?: "NEW" | "USED";
  licensePlate?: string;
  licenseState?: string;
  registrationExpiration?: string | Date;
  isDisabledByAdmin?: boolean;
  createdVia?: "MOBILE" | "WEB" | "IMPORT";
  overWeight?: boolean;
  currentWeight?: number;
  creationReason?: string;
  createdBy: {
    firstName?: string;
    lastName?: string;
  };
}
export const useEquipmentData = () => {
  const [equipmentDetails, setEquipmentDetails] = useState<EquipmentSummary[]>(
    [],
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(25);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [pendingCount, setPendingCount] = useState<number>(0);
  // State for modals
  const [editEquipmentModal, setEditEquipmentModal] = useState(false);
  const [createEquipmentModal, setCreateEquipmentModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [pendingEditId, setPendingEditId] = useState<string | null>(null);
  const [pendingQrId, setPendingQrId] = useState<string | null>(null);

  //Approval Button States
  const [showPendingOnly, setShowPendingOnly] = useState(false);

  const rerender = () => setRefreshKey((k) => k + 1);

  useEffect(() => {
    const fetchEquipmentSummaries = async () => {
      try {
        setLoading(true);
        let url = "";
        if (showPendingOnly) {
          url = `/api/getEquipmentDetails?status=pending`;
        } else {
          url = `/api/getEquipmentDetails?page=${page}&pageSize=${pageSize}`;
        }
        const response = await fetch(url);
        const data = await response.json();
        if (!response.ok) {
          throw new Error(`HTTP error ${response.status}`);
        }
        setEquipmentDetails(data.equipment);
        setTotal(data.total);
        setTotalPages(data.totalPages);
        setPendingCount(
          data.equipment.filter(
            (item: EquipmentSummary) => item.approvalStatus === "PENDING",
          ).length,
        );
      } catch (error) {
        console.error("Failed to fetch equipment details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEquipmentSummaries();
  }, [refreshKey, page, pageSize, showPendingOnly]);

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

  useEffect(() => {
    setPage(1);
  }, [searchTerm, showPendingOnly]);

  const openHandleQr = (id: string) => {
    console.log("openHandleQr called with id:", id);
    setPendingQrId(id);
    const equipment = equipmentDetails.find((j) => j.id === id);
    if (equipment) {
      printQRCode(equipment);
    }
  };

  const printQRCode = async (equipment: EquipmentSummary) => {
    if (!pendingQrId) return;
    const url = await QRCode.toDataURL(equipment.qrId || "");
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
        <title>Print QR Code - ${equipment.name || "Equipment"}</title>
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
          <div class="equipment-name">${equipment.name || "N/A"}</div>
          <img src="${url}" alt="QR Code" class="qr-code" />
          <div class="equipment-id">ID: ${equipment.qrId || "N/A"}</div>
          <div class="equipment-description">${
            equipment.description
              ? `Brief Description:\n${equipment.description || ""}`
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

  const cancelDelete = () => {
    setShowDeleteDialog(false);
    setPendingDeleteId(null);
  };

  // Filter equipment by name, make, or model, and by approval status if showPendingOnly is active
  const filteredEquipment = equipmentDetails.filter((item) => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return true;
    const nameMatch = item.name.toLowerCase().includes(term);
    const makeMatch = item.make?.toLowerCase().includes(term) ?? false;
    const modelMatch = item.model?.toLowerCase().includes(term) ?? false;
    return nameMatch || makeMatch || modelMatch;
  });

  return {
    setEquipmentDetails,
    loading,
    setLoading,
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
  };
};
