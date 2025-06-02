"use client";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import React, { useEffect, useState } from "react";
import { Selects } from "@/components/(reusable)/selects";
import EquipmentSideBar from "./components/equipment/sidebar/EquipmentSideBar";
import DiscardChangesModal from "./components/shared/DiscardChangesModal";
import {
  Equipment,
  ASSET_TYPES,
  Jobsite,
  CostCode,
  Tag,
  EquipmentSummary,
  JobsiteSummary,
  CostCodeSummary,
  TagSummary,
} from "./types";
import EquipmentMainContent from "./components/equipment/EquipmentMainContent";
import JobsiteMainContent from "./components/jobsite/JobsiteMainContent";
import JobsiteSideBar from "./components/jobsite/sidebar/JobsiteSideBar";
import CostCodeSideBar from "./components/costcode/sidebar/CostCodeSideBar";
import CostCodeMainContent from "./components/costcode/CostCodeMainContent";

export default function Assets() {
  const [assets, setAssets] = useState("Equipment");
  const [isRegistrationFormOpen, setIsRegistrationFormOpen] = useState(false);
  const [isRegistrationGroupFormOpen, setIsRegistrationGroupFormOpen] =
    useState(false);

  // Summary state (for sidebar lists)
  const [equipmentSummaries, setEquipmentSummaries] = useState<
    EquipmentSummary[]
  >([]);
  const [jobsiteSummaries, setJobsiteSummaries] = useState<JobsiteSummary[]>(
    []
  );
  const [costCodeSummaries, setCostCodeSummaries] = useState<CostCodeSummary[]>(
    []
  );
  const [tagSummaries, setTagSummaries] = useState<TagSummary[]>([]);

  // Detailed state (for selected items)
  const [selectEquipment, setSelectEquipment] = useState<Equipment | null>(
    null
  );
  const [selectJobsite, setSelectJobsite] = useState<Jobsite | null>(null);
  const [selectCostCode, setSelectCostCode] = useState<CostCode | null>(null);
  const [selectTag, setSelectTag] = useState<Tag | null>(null);

  // UI state
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [hasRegistrationFormChanges, setHasRegistrationFormChanges] =
    useState(false);
  const [showAssetChangeModal, setShowAssetChangeModal] = useState(false);
  const [pendingAssetChange, setPendingAssetChange] = useState<string | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(false);

  // Handler for asset type change with unsaved changes check
  const handleAssetChange = (newAssetType: string) => {
    const totalUnsavedChanges = hasUnsavedChanges || hasRegistrationFormChanges;
    if (totalUnsavedChanges && newAssetType !== assets) {
      // If there are unsaved changes, show confirmation modal
      setPendingAssetChange(newAssetType);
      setShowAssetChangeModal(true);
    } else {
      // Otherwise change asset type normally
      setAssets(newAssetType);
      // Clear all selections when changing asset types
      setSelectEquipment(null);
      setSelectJobsite(null);
      setSelectCostCode(null);
      setSelectTag(null);
    }
  };

  // Handle confirmation to discard changes and switch asset type
  const handleConfirmAssetChange = () => {
    if (pendingAssetChange) {
      setAssets(pendingAssetChange);
      // Clear all selections
      setSelectEquipment(null);
      setSelectJobsite(null);
      setSelectCostCode(null);
      setSelectTag(null);
      setHasUnsavedChanges(false); // Reset unsaved changes state
      setHasRegistrationFormChanges(false); // Reset registration form changes state
    }
    setShowAssetChangeModal(false);
    setPendingAssetChange(null);
  };

  // Handle cancellation - stay on current asset type
  const handleCancelAssetChange = () => {
    setShowAssetChangeModal(false);
    setPendingAssetChange(null);
  };

  // Equipment summary fetch function
  const fetchEquipmentSummaries = async () => {
    try {
      const response = await fetch("/api/getEquipmentSummary");
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      const data = await response.json();
      setEquipmentSummaries(data);
    } catch (error) {
      console.error(`Failed to fetch equipment summaries:`, error);
    }
  };

  // Jobsite summary fetch function
  const fetchJobsiteSummaries = async () => {
    try {
      const response = await fetch("/api/getJobsiteSummary");
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      const data = await response.json();
      setJobsiteSummaries(data);
    } catch (error) {
      console.error(`Failed to fetch jobsite summaries:`, error);
    }
  };

  // Cost code summary fetch function
  const fetchCostCodeSummaries = async () => {
    try {
      const response = await fetch("/api/getCostCodeSummary");
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      const data = await response.json();
      setCostCodeSummaries(data);
    } catch (error) {
      console.error(`Failed to fetch cost code summaries:`, error);
    }
  };

  // Tag summary fetch function
  const fetchTagSummaries = async () => {
    try {
      const response = await fetch("/api/getTagSummary");
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      const data = await response.json();
      setTagSummaries(data);
    } catch (error) {
      console.error(`Failed to fetch tag summaries:`, error);
    }
  };

  // Fetch detailed equipment data when an equipment is selected
  const fetchEquipmentDetails = async (equipmentId: string) => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/getEquipmentByEquipmentId/${equipmentId}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      const data = await response.json();
      setSelectEquipment(data);
    } catch (error) {
      console.error(`Failed to fetch equipment details:`, error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch detailed jobsite data when a jobsite is selected
  const fetchJobsiteDetails = async (jobsiteId: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/getJobsiteById/${jobsiteId}`);
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      const data = await response.json();
      setSelectJobsite(data);
    } catch (error) {
      console.error(`Failed to fetch jobsite details:`, error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch detailed cost code data when a cost code is selected
  const fetchCostCodeDetails = async (costCodeId: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/getCostCodeById/${costCodeId}`);
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      const data = await response.json();
      setSelectCostCode(data);
    } catch (error) {
      console.error(`Failed to fetch cost code details:`, error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch detailed tag data when a tag is selected
  const fetchTagDetails = async (tagId: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/getTagById/${tagId}`);
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      const data = await response.json();
      setSelectTag(data);
    } catch (error) {
      console.error(`Failed to fetch tag details:`, error);
    } finally {
      setLoading(false);
    }
  };

  // Handler for equipment selection
  const handleEquipmentSelect = (equipmentId: string) => {
    fetchEquipmentDetails(equipmentId);
  };

  // Handler for jobsite selection
  const handleJobsiteSelect = (jobsiteId: string) => {
    fetchJobsiteDetails(jobsiteId);
  };

  // Handler for cost code selection
  const handleCostCodeSelect = (costCodeId: string) => {
    fetchCostCodeDetails(costCodeId);
  };

  // Handler for tag selection
  const handleTagSelect = (tagId: string) => {
    fetchTagDetails(tagId);
  };

  // Fetch all summaries on component mount
  useEffect(() => {
    fetchEquipmentSummaries();
    fetchJobsiteSummaries();
    fetchCostCodeSummaries();
    fetchTagSummaries();
  }, []);

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
                className="w-full h-full text-center text-sm border-none outline outline-[3px] outline-black outline-offset-0"
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
                  hasUnsavedChanges={
                    hasUnsavedChanges || hasRegistrationFormChanges
                  }
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
                  hasUnsavedChanges={
                    hasUnsavedChanges || hasRegistrationFormChanges
                  }
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
              onRegistrationFormChangesChange={setHasRegistrationFormChanges}
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
              onRegistrationFormChangesChange={setHasRegistrationFormChanges}
            />
          ) : assets === "CostCode" ? (
            <CostCodeMainContent
              assets={assets}
              selectCostCode={selectCostCode}
              isRegistrationFormOpen={isRegistrationFormOpen}
              setIsRegistrationFormOpen={setIsRegistrationFormOpen}
              setSelectCostCode={setSelectCostCode}
              onUnsavedChangesChange={setHasUnsavedChanges}
              refreshCostCodes={fetchCostCodeSummaries}
              loading={loading}
              isRegistrationGroupFormOpen={isRegistrationGroupFormOpen}
              setIsRegistrationGroupFormOpen={setIsRegistrationGroupFormOpen}
              onRegistrationFormChangesChange={setHasRegistrationFormChanges}
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
