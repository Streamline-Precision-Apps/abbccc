"use client";
import { Holds } from "@/components/(reusable)/holds";
import { Texts } from "@/components/(reusable)/texts";
import React, { useState } from "react";
import { Jobsite, JobsiteSummary } from "../../../types";
import DiscardChangesModal from "../../shared/DiscardChangesModal";

interface JobsiteRowProps {
  jobsite: JobsiteSummary;
  isSelected?: boolean;
  onClick: (jobsite: JobsiteSummary) => void;
  hasUnsavedChanges?: boolean;
}

/**
 * Individual jobsite row component for the sidebar list
 * Displays jobsite name and qrId with selection state
 */
export default function JobsiteRow({
  jobsite,
  isSelected = false,
  onClick,
  hasUnsavedChanges = false,
}: JobsiteRowProps) {
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleJobsiteClick = () => {
    if (hasUnsavedChanges) {
      setShowConfirmModal(true);
    } else {
      onClick(jobsite);
    }
  };

  const handleConfirmNavigation = () => {
    setShowConfirmModal(false);
    onClick(jobsite);
  };

  const handleCancelNavigation = () => {
    setShowConfirmModal(false);
  };
  return (
    <>
      <Holds
        background={
          jobsite.approvalStatus === "PENDING" ? "orange" : "lightGray"
        }
        className={`w-full h-[40px] justify-center flex  hover:opacity-80 cursor-pointer relative ${
          isSelected && "outline outline-[2px] outline-black"
        } rounded-[10px] my-1 px-4`}
        onClick={handleJobsiteClick}
      >
        <Texts position="left" size="xs">
          {`${jobsite.name} ${
            jobsite.approvalStatus === "PENDING" ? "(pending)" : ""
          }`}
        </Texts>
      </Holds>
      <DiscardChangesModal
        isOpen={showConfirmModal}
        confirmDiscardChanges={handleConfirmNavigation}
        cancelDiscard={handleCancelNavigation}
      />
    </>
  );
}
