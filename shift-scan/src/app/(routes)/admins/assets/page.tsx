"use client";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import React, { useEffect, useState } from "react";
import { Selects } from "@/components/(reusable)/selects";
import EquipmentSideBar from "./components/equipment/sidebar/EquipmentSideBar";
import DiscardChangesModal from "./components/shared/DiscardChangesModal";
import { Equipment, ASSET_TYPES, Jobsite } from "./types";
import EquipmentMainContent from "./components/equipment/EquipmentMainContent";
import JobsiteMainContent from "./components/jobsite/JobsiteMainContent";
import JobsiteSideBar from "./components/jobsite/sidebar/JobsiteSideBar";

export default function Assets() {
  const [assets, setAssets] = useState("Equipment");
  const [isRegistrationFormOpen, setIsRegistrationFormOpen] = useState(false);
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [jobsites, setJobsites] = useState<Jobsite[]>([]);
  const [selectEquipment, setSelectEquipment] = useState<Equipment | null>(
    null
  );
  const [selectJobsite, setSelectJobsite] = useState<Jobsite | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showAssetChangeModal, setShowAssetChangeModal] = useState(false);
  const [pendingAssetChange, setPendingAssetChange] = useState<string | null>(
    null
  );

  // Handler for asset type change with unsaved changes check
  const handleAssetChange = (newAssetType: string) => {
    if (hasUnsavedChanges && newAssetType !== assets) {
      // If there are unsaved changes, show confirmation modal
      setPendingAssetChange(newAssetType);
      setShowAssetChangeModal(true);
    } else {
      // Otherwise change asset type normally
      setAssets(newAssetType);
      setSelectEquipment(null); // Clear equipment selection when changing asset types
      setSelectJobsite(null); // Clear jobsite selection when changing asset types
    }
  };

  // Handle confirmation to discard changes and switch asset type
  const handleConfirmAssetChange = () => {
    if (pendingAssetChange) {
      setAssets(pendingAssetChange);
      setSelectEquipment(null); // Clear equipment selection
      setSelectJobsite(null); // Clear jobsite selection
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

  // Equipment fetch function extracted for reuse
  const fetchEquipments = async () => {
    try {
      const equipmentsData = await fetch("/api/getAllEquipment?filter=all", {
        next: { tags: ["equipment"] },
      }).then((res) => res.json());

      setEquipments(equipmentsData);
    } catch (error) {
      console.error(`Failed to fetch equipment data:`, error);
    }
  };

  useEffect(() => {
    fetchEquipments();
  }, []);

  // Jobsite fetch function extracted for reuse
  const fetchJobsites = async () => {
    try {
      const jobsiteData = await fetch("/api/getAllJobsites?filter=all", {
        next: { tags: ["jobsites"] },
      }).then((res) => res.json());

      setJobsites(jobsiteData);
    } catch (error) {
      console.error(`Failed to fetch jobsite data:`, error);
    }
  };

  useEffect(() => {
    fetchJobsites();
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
                  equipments={equipments}
                  selectEquipment={selectEquipment}
                  setSelectEquipment={setSelectEquipment}
                  isRegistrationFormOpen={isRegistrationFormOpen}
                  setIsRegistrationFormOpen={setIsRegistrationFormOpen}
                  hasUnsavedChanges={hasUnsavedChanges}
                />
              ) : assets === "Jobsite" ? (
                <JobsiteSideBar
                  assets={assets}
                  setAssets={setAssets}
                  jobsites={jobsites}
                  setSelectJobsite={setSelectJobsite}
                  selectJobsite={selectJobsite}
                  isRegistrationFormOpen={isRegistrationFormOpen}
                  setIsRegistrationFormOpen={setIsRegistrationFormOpen}
                  hasUnsavedChanges={hasUnsavedChanges}
                />
              ) : assets === "CostCode" ? (
                <></>
              ) : assets === "Tags" ? (
                <></>
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
              refreshEquipments={fetchEquipments}
            />
          ) : assets === "Jobsite" ? (
            <JobsiteMainContent
              assets={assets}
              selectJobsite={selectJobsite}
              isRegistrationFormOpen={isRegistrationFormOpen}
              setIsRegistrationFormOpen={setIsRegistrationFormOpen}
              setSelectJobsite={setSelectJobsite}
              onUnsavedChangesChange={setHasUnsavedChanges}
              refreshJobsites={fetchJobsites}
            />
          ) : assets === "CostCode" ? (
            <></>
          ) : assets === "Tags" ? (
            <></>
          ) : null}
        </Grids>
      </Holds>

      {/* Confirmation Modal for Asset Type Change */}
      <DiscardChangesModal
        isOpen={showAssetChangeModal}
        confirmDiscardChanges={handleConfirmAssetChange}
        cancelDiscard={handleCancelAssetChange}
        message="You have unsaved equipment changes. Switching asset types will discard them. Are you sure you want to continue?"
      />
    </Holds>
  );
}
