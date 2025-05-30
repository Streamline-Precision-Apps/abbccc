"use client";
import { Buttons } from "@/components/(reusable)/buttons";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Texts } from "@/components/(reusable)/texts";
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
    <Holds
      background="white"
      position="row"
      className="w-full h-full justify-between rounded-[10px] px-4"
    >
      <Holds className="">
        <Texts
          position="left"
          text={hasUnsavedChanges ? "gray" : "link"}
          size="sm"
          onClick={hasUnsavedChanges ? undefined : onRegisterNew}
          style={{
            pointerEvents: hasUnsavedChanges ? "none" : "auto",
            opacity: hasUnsavedChanges ? 0.5 : 1,
            cursor: hasUnsavedChanges ? "not-allowed" : "pointer",
          }}
        >
          Register New Jobsite
        </Texts>
      </Holds>

      <Holds
        position="row"
        className="h-full flex items-center justify-between"
      >
        <Texts
          onClick={hasUnsavedChanges ? onDiscardChanges : undefined}
          position="left"
          text={hasUnsavedChanges ? "link" : "gray"}
          size="sm"
          style={{
            pointerEvents: hasUnsavedChanges ? "auto" : "none",
            opacity: hasUnsavedChanges ? 1 : 0.5,
            cursor: hasUnsavedChanges ? "pointer" : "not-allowed",
          }}
        >
          Discard Changes
        </Texts>

        <Texts
          position="right"
          text={!hasUnsavedChanges || isSaving ? "gray" : "link"}
          size="sm"
          onClick={!hasUnsavedChanges || isSaving ? undefined : onSaveChanges}
          style={{
            pointerEvents: !hasUnsavedChanges || isSaving ? "none" : "auto",
            opacity: !hasUnsavedChanges || isSaving ? 0.5 : 1,
            cursor: !hasUnsavedChanges || isSaving ? "not-allowed" : "pointer",
          }}
        >
          {isSaving
            ? "Saving..."
            : successfullyUpdated
            ? "Saved!"
            : "Save Changes"}
        </Texts>
      </Holds>
    </Holds>
  );
}
