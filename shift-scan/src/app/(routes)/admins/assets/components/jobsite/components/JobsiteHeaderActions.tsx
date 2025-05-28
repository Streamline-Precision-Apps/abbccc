"use client";
import { Buttons } from "@/components/(reusable)/buttons";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Titles } from "@/components/(reusable)/titles";
import React from "react";

interface JobsiteHeaderActionsProps {
  onRegisterNew: () => void;
  onDiscardChanges: () => void;
  onSaveChanges: () => void;
  hasUnsavedChanges: boolean;
  isSaving: boolean;
  successfullyUpdated: boolean;
}

/**
 * Header actions component for jobsite management
 * Contains Register New, Discard Changes, and Save Changes buttons
 */
export default function JobsiteHeaderActions({
  onRegisterNew,
  onDiscardChanges,
  onSaveChanges,
  hasUnsavedChanges,
  isSaving,
  successfullyUpdated,
}: JobsiteHeaderActionsProps) {
  return (
    <Holds className="w-full h-full col-start-3 col-end-11">
      <Grids cols="6" gap="3" className="w-full h-full">
        <Holds className="col-start-1 col-end-3">
          <Buttons
            background="green"
            onClick={onRegisterNew}
            className="w-full h-full flex items-center justify-center"
          >
            <Titles size="h4" className="text-white">
              Register New Jobsite
            </Titles>
          </Buttons>
        </Holds>

        <Holds className="col-start-4 col-end-5">
          <Buttons
            background={hasUnsavedChanges ? "red" : "darkGray"}
            onClick={onDiscardChanges}
            disabled={!hasUnsavedChanges}
            className="w-full h-full flex items-center justify-center"
          >
            <Titles size="h4" className="text-white">
              Discard Changes
            </Titles>
          </Buttons>
        </Holds>

        <Holds className="col-start-5 col-end-7">
          <Buttons
            background={
              successfullyUpdated
                ? "green"
                : hasUnsavedChanges
                ? "lightBlue"
                : "darkGray"
            }
            onClick={onSaveChanges}
            disabled={!hasUnsavedChanges || isSaving}
            className="w-full h-full flex items-center justify-center"
          >
            <Titles size="h4" className="text-white">
              {isSaving
                ? "Saving..."
                : successfullyUpdated
                ? "Saved!"
                : "Save Changes"}
            </Titles>
          </Buttons>
        </Holds>
      </Grids>
    </Holds>
  );
}
