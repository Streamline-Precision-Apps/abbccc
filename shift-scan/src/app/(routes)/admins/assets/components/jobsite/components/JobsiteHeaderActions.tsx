"use client";
import { Buttons } from "@/components/(reusable)/buttons";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Texts } from "@/components/(reusable)/texts";
import React from "react";

interface JobsiteHeaderActionsProps {
  onRegisterNew: () => void;
  onDiscardChanges: () => void;
  onSaveChanges: () => void;
  onDeleteJobsite: () => void;
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
  onDeleteJobsite,
}: JobsiteHeaderActionsProps) {
  return (
    <Holds
      background="white"
      position="row"
      className="w-full h-full justify-between rounded-[10px] px-4 relative"
    >
      {successfullyUpdated && (
        <Holds
          background={"green"}
          className="w-full h-full absolute top-0 left-0 rounded-[10px] justify-center items-center z-10"
        >
          <Texts size="sm">Successfully Updated!</Texts>
        </Holds>
      )}
      <Buttons
        background={"none"}
        shadow={"none"}
        onClick={hasUnsavedChanges ? undefined : onRegisterNew}
        className="w-fit h-auto "
      >
        <Texts
          size="sm"
          text={"link"}
          className={hasUnsavedChanges ? "text-app-dark-gray" : ""}
        >
          Register New Jobsite
        </Texts>
      </Buttons>

      <Buttons
        background={"none"}
        shadow={"none"}
        onClick={hasUnsavedChanges && !isSaving ? onDiscardChanges : undefined}
        className="w-fit h-auto "
      >
        <Texts
          size="sm"
          text={"link"}
          className={!hasUnsavedChanges || isSaving ? "text-app-dark-gray" : ""}
        >
          Discard Changes
        </Texts>
      </Buttons>

      <Buttons
        background={"none"}
        shadow={"none"}
        onClick={!hasUnsavedChanges || isSaving ? undefined : onSaveChanges}
        className="w-fit h-auto "
      >
        <Texts
          size="sm"
          text={"link"}
          className={!hasUnsavedChanges || isSaving ? "text-app-dark-gray" : ""}
        >
          {isSaving ? "Saving..." : "Save Changes"}
        </Texts>
      </Buttons>

      <Buttons
        background={"none"}
        shadow={"none"}
        onClick={onDeleteJobsite}
        className="w-fit h-auto "
      >
        <Texts size="sm" text="link">
          Delete Jobsite
        </Texts>
      </Buttons>
    </Holds>
  );
}
