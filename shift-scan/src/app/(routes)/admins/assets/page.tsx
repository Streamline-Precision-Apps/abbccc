"use client";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import React, { useState, useCallback } from "react";
import { Selects } from "@/components/(reusable)/selects";
import {
  CostCodeSummary,
  EquipmentSummary,
  JobsiteSummary,
  TagSummary,
} from "./types";
import EquipmentSideBar from "./components/equipment/sidebar/EquipmentSideBar";
import DiscardChangesModal from "./components/shared/DiscardChangesModal";
import { ASSET_TYPES } from "./types";
import EquipmentMainContent from "./components/equipment/EquipmentMainContent";
import JobsiteMainContent from "./components/jobsite/JobsiteMainContent";
import JobsiteSideBar from "./components/jobsite/sidebar/JobsiteSideBar";
import CostCodeSideBar from "./components/costcode/sidebar/CostCodeSideBar";
import CostCodeMainContent from "./components/costcode/components/CostCodeMainContent";
import { useAssets } from "./hooks/useAssets";
import { useTagsForm } from "./components/costcode/hooks/useTagsForm";

export default function Assets() {
  const [assets, setAssets] = useState<"Equipment" | "CostCode" | "Jobsite">(
    "Equipment"
  );
  const [costCodeUIState, setCostCodeUIState] = useState<
    "idle" | "creating" | "editing" | "editingGroups" | "creatingGroups"
  >("idle");

  const [jobsiteUIState, setJobsiteUIState] = useState<
    "idle" | "creating" | "editing"
  >("idle");
  const [equipmentUIState, setEquipmentUIState] = useState<
    "idle" | "creating" | "editing"
  >("idle");
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
    loadingStates,

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
  } = useAssets({ assets });

  // UI state
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showAssetChangeModal, setShowAssetChangeModal] = useState(false);
  const [pendingAssetChange, setPendingAssetChange] = useState<
    "Equipment" | "CostCode" | "Jobsite" | null
  >(null);

  // Handler for asset type change with unsaved changes check
  const handleAssetChange = (
    newAssetType: "Equipment" | "CostCode" | "Jobsite"
  ) => {
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

  // Memoized handler for cost code selection
  const handleCostCodeSelection = useCallback(
    (costCode: CostCodeSummary | null) => {
      if (costCode) {
        handleCostCodeSelect(costCode.id);
      } else {
        setSelectCostCode(null);
      }
    },
    [handleCostCodeSelect, setSelectCostCode]
  );

  // Memoized handler for jobsite selection
  const handleJobsiteSelection = useCallback(
    (jobsite: JobsiteSummary | null) => {
      if (jobsite) {
        handleJobsiteSelect(jobsite.id);
      } else {
        setSelectJobsite(null);
      }
    },
    [handleJobsiteSelect, setSelectJobsite]
  );

  // Memoized handler for equipment selection
  const handleEquipmentSelection = useCallback(
    (equipment: EquipmentSummary | null) => {
      if (equipment) {
        handleEquipmentSelect(equipment.id);
      } else {
        setSelectEquipment(null);
      }
    },
    [handleEquipmentSelect, setSelectEquipment]
  );

  const handleTagSelection = useCallback(
    (tag: TagSummary | null) => {
      if (tag) {
        handleTagSelect(tag.id);
      } else {
        setSelectTag(null);
      }
    },
    [handleTagSelect, setSelectTag]
  );

  const tagFormHook = useTagsForm({
    selectTag,
    setSelectTag,
    setHasUnsavedChanges,
    refreshTags: fetchTagSummaries,
  });

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
                onChange={(e) =>
                  handleAssetChange(
                    e.target.value as "Equipment" | "CostCode" | "Jobsite"
                  )
                }
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
                  setSelectEquipment={handleEquipmentSelection}
                  isRegistrationFormOpen={isRegistrationFormOpen}
                  setIsRegistrationFormOpen={setIsRegistrationFormOpen}
                  hasUnsavedChanges={hasUnsavedChanges}
                  setHasUnsavedChanges={setHasUnsavedChanges}
                  setEquipmentUIState={setEquipmentUIState}
                  equipmentUIState={equipmentUIState}
                  loading={loadingStates.equipmentSummary}
                />
              ) : assets === "Jobsite" ? (
                <JobsiteSideBar
                  assets={assets}
                  setAssets={setAssets}
                  jobsites={jobsiteSummaries}
                  setSelectJobsite={handleJobsiteSelection}
                  selectJobsite={selectJobsite}
                  isRegistrationFormOpen={isRegistrationFormOpen}
                  setIsRegistrationFormOpen={setIsRegistrationFormOpen}
                  hasUnsavedChanges={hasUnsavedChanges}
                  jobsiteUIState={jobsiteUIState}
                  setJobsiteUIState={setJobsiteUIState}
                  loading={loadingStates.jobsiteSummary}
                />
              ) : assets === "CostCode" ? (
                <CostCodeSideBar
                  assets={assets}
                  setAssets={setAssets}
                  costCodes={costCodeSummaries}
                  setSelectCostCode={handleCostCodeSelection}
                  tagSummaries={tagSummaries}
                  selectTag={selectTag}
                  selectCostCode={selectCostCode}
                  isRegistrationFormOpen={isRegistrationFormOpen}
                  setIsRegistrationFormOpen={setIsRegistrationFormOpen}
                  hasUnsavedChanges={hasUnsavedChanges}
                  costCodeUIState={costCodeUIState}
                  setCostCodeUIState={setCostCodeUIState}
                  loading={loadingStates.costCodeSummary}
                  setSelectTag={handleTagSelection}
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
              loading={loadingStates.equipmentDetails}
              setEquipmentUIState={setEquipmentUIState}
              equipmentUIState={equipmentUIState}
              setHasUnsavedChanges={setHasUnsavedChanges}
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
              loading={loadingStates.jobsiteDetails}
              jobsiteUIState={jobsiteUIState}
              setJobsiteUIState={setJobsiteUIState}
              hasUnsavedChanges={hasUnsavedChanges}
              setHasUnsavedChanges={setHasUnsavedChanges}
            />
          ) : assets === "CostCode" ? (
            <CostCodeMainContent
              assets={assets}
              selectCostCode={selectCostCode}
              setSelectCostCode={setSelectCostCode}
              setHasUnsavedChanges={setHasUnsavedChanges}
              refreshCostCodes={fetchCostCodeSummaries}
              CostCodeLoading={loadingStates.costCodeDetails}
              TagLoading={loadingStates.tagDetails}
              tagSummaries={tagSummaries}
              setSelectTag={setSelectTag}
              costCodeUIState={costCodeUIState}
              setCostCodeUIState={setCostCodeUIState}
              tagFormHook={tagFormHook}
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
