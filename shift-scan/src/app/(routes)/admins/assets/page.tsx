"use client";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import React, { useState } from "react";
import { Selects } from "@/components/(reusable)/selects";
import EquipmentSideBar from "./components/equipment/sidebar/EquipmentSideBar";
import DiscardChangesModal from "./components/shared/DiscardChangesModal";
import { ASSET_TYPES } from "./types";
import EquipmentMainContent from "./components/equipment/EquipmentMainContent";
import JobsiteMainContent from "./components/jobsite/JobsiteMainContent";
import JobsiteSideBar from "./components/jobsite/sidebar/JobsiteSideBar";
import CostCodeSideBar from "./components/costcode/sidebar/CostCodeSideBar";
import CostCodeMainContent from "./components/costcode/CostCodeMainContent";
import { useAssets } from "./hooks/useAssets";

export default function Assets() {
  const [assets, setAssets] = useState("Equipment");
  const [isRegistrationFormOpen, setIsRegistrationFormOpen] = useState(false);
  const [isRegistrationGroupFormOpen, setIsRegistrationGroupFormOpen] =
    useState(false);

  // Use the assets hook for data fetching and state management
  const {
    // Summary data
    equipmentSummaries,
    jobsiteSummaries,
    costCodeSummaries,
    tagSummaries,

    // Selected data
    selectEquipment,
    selectJobsite,
    selectCostCode,
    selectTag,

    // Loading state
    loading,

    // Setters
    setSelectEquipment,
    setSelectJobsite,
    setSelectCostCode,
    setSelectTag,

    // Fetch functions
    fetchEquipmentSummaries,
    fetchJobsiteSummaries,
    fetchCostCodeSummaries,
    fetchTagSummaries,

    // Selection handlers
    handleEquipmentSelect,
    handleJobsiteSelect,
    handleCostCodeSelect,
    handleTagSelect,

    // Utility functions
    clearAllSelections,
  } = useAssets();

  // UI state
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showAssetChangeModal, setShowAssetChangeModal] = useState(false);
  const [pendingAssetChange, setPendingAssetChange] = useState<string | null>(
    null
  );

  // Handler for asset type change with unsaved changes check
  const handleAssetChange = (newAssetType: string) => {
    const totalUnsavedChanges = hasUnsavedChanges;
    if (totalUnsavedChanges && newAssetType !== assets) {
      // If there are unsaved changes, show confirmation modal
      setPendingAssetChange(newAssetType);
      setShowAssetChangeModal(true);
    } else {
      // Otherwise change asset type normally
      setAssets(newAssetType);
      // Clear all selections when changing asset types
      clearAllSelections();
    }
  };

  // Handle confirmation to discard changes and switch asset type
  const handleConfirmAssetChange = () => {
    if (pendingAssetChange) {
      setAssets(pendingAssetChange);
      // Clear all selections using the utility function from useAssets
      clearAllSelections();
      setHasUnsavedChanges(false); // Reset unsaved changes state
    }
    setShowAssetChangeModal(false);
    setPendingAssetChange(null);
  };

  // Handle cancellation - stay on current asset type
  const handleCancelAssetChange = () => {
    setShowAssetChangeModal(false);
    setPendingAssetChange(null);
  };

  return (
    <Holds background={"white"} className="h-full w-full rounded-[10px]">
      <Holds background={"adminBlue"} className="h-full w-full rounded-[10px]">
        <Grids
          cols={"10"}
          gap={"5"}
          className="w-full h-full p-3 rounded-[10px]"
        >
          <Holds className="w-full h-full col-start-1 col-end-3">
            <Grids className="w-full h-full grid-rows-[40px_40px_40px_1fr] gap-4">
              <Selects
                onChange={(e) => handleAssetChange(e.target.value)}
                value={assets}
                className="w-full h-full text-center text-sm border-[2px] outline outline-[1px] outline-black outline-offset-0"
              >
                {ASSET_TYPES.map((asset) => (
                  <option key={asset.value} value={asset.value}>
                    {asset.name}
                  </option>
                ))}
              </Selects>
              {assets === "Equipment" ? (
                <EquipmentSideBar
                  setAssets={setAssets}
                  assets={assets}
                  equipments={equipmentSummaries}
                  selectEquipment={selectEquipment}
                  setSelectEquipment={(equipment) => {
                    if (equipment) {
                      handleEquipmentSelect(equipment.id);
                    } else {
                      setSelectEquipment(null);
                    }
                  }}
                  isRegistrationFormOpen={isRegistrationFormOpen}
                  setIsRegistrationFormOpen={setIsRegistrationFormOpen}
                  hasUnsavedChanges={hasUnsavedChanges}
                />
              ) : assets === "Jobsite" ? (
                <JobsiteSideBar
                  assets={assets}
                  setAssets={setAssets}
                  jobsites={jobsiteSummaries}
                  setSelectJobsite={(jobsite) => {
                    if (jobsite) {
                      handleJobsiteSelect(jobsite.id);
                    } else {
                      setSelectJobsite(null);
                    }
                  }}
                  selectJobsite={selectJobsite}
                  isRegistrationFormOpen={isRegistrationFormOpen}
                  setIsRegistrationFormOpen={setIsRegistrationFormOpen}
                  hasUnsavedChanges={hasUnsavedChanges}
                />
              ) : assets === "CostCode" ? (
                <CostCodeSideBar
                  assets={assets}
                  setAssets={setAssets}
                  costCodes={costCodeSummaries}
                  setSelectCostCode={(costCode) => {
                    if (costCode) {
                      handleCostCodeSelect(costCode.id);
                    } else {
                      setSelectCostCode(null);
                    }
                  }}
                  tagSummaries={tagSummaries}
                  setSelectTag={setSelectTag}
                  selectTag={selectTag}
                  selectCostCode={selectCostCode}
                  isRegistrationFormOpen={isRegistrationFormOpen}
                  setIsRegistrationFormOpen={setIsRegistrationFormOpen}
                  hasUnsavedChanges={hasUnsavedChanges}
                />
              ) : null}
            </Grids>
          </Holds>
          {assets === "Equipment" ? (
            <EquipmentMainContent
              assets={assets}
              selectEquipment={selectEquipment}
              isRegistrationFormOpen={isRegistrationFormOpen}
              setIsRegistrationFormOpen={setIsRegistrationFormOpen}
              setSelectEquipment={setSelectEquipment}
              onUnsavedChangesChange={setHasUnsavedChanges}
              refreshEquipments={fetchEquipmentSummaries}
              loading={loading}
            />
          ) : assets === "Jobsite" ? (
            <JobsiteMainContent
              assets={assets}
              selectJobsite={selectJobsite}
              isRegistrationFormOpen={isRegistrationFormOpen}
              setIsRegistrationFormOpen={setIsRegistrationFormOpen}
              setSelectJobsite={setSelectJobsite}
              onUnsavedChangesChange={setHasUnsavedChanges}
              refreshJobsites={fetchJobsiteSummaries}
              loading={loading}
            />
          ) : assets === "CostCode" ? (
            <CostCodeMainContent
              assets={assets}
              selectCostCode={selectCostCode}
              isRegistrationFormOpen={isRegistrationFormOpen}
              setIsRegistrationFormOpen={setIsRegistrationFormOpen}
              setSelectCostCode={setSelectCostCode}
              setHasUnsavedChanges={setHasUnsavedChanges}
              refreshCostCodes={fetchCostCodeSummaries}
              loading={loading}
              isRegistrationGroupFormOpen={isRegistrationGroupFormOpen}
              setIsRegistrationGroupFormOpen={setIsRegistrationGroupFormOpen}
              selectTag={selectTag}
              setSelectTag={setSelectTag}
            />
          ) : null}
        </Grids>
      </Holds>

      {/* Confirmation Modal for Asset Type Change */}
      <DiscardChangesModal
        isOpen={showAssetChangeModal}
        confirmDiscardChanges={handleConfirmAssetChange}
        cancelDiscard={handleCancelAssetChange}
        message="You have unsaved changes. Switching asset types will discard them. Are you sure you want to continue?"
      />
    </Holds>
  );
}
