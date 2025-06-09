"use client";
import { Buttons } from "@/components/(reusable)/buttons";
import { Holds } from "@/components/(reusable)/holds";
import { Texts } from "@/components/(reusable)/texts";
import React from "react";

interface CostCodeHeaderActionsProps {
  onRegisterNew: () => void;
  onDiscardChanges: () => void;
  onSaveChanges: () => void;
  onDeleteCostCode: () => void;
  hasUnsavedChanges: boolean;
  isSaving: boolean;
  successfullyUpdated: boolean;
}

/**
 * Header actions component for cost code management
 * Contains Register New, Discard Changes, and Save Changes buttons
 */
export default function CostCodeHeaderActions({
  onRegisterNew,
  onDiscardChanges,
  onSaveChanges,
  onDeleteCostCode,
  hasUnsavedChanges,
  isSaving,
  successfullyUpdated,
}: CostCodeHeaderActionsProps) {
  return (
    <Holds
      background="white"
      position="row"
      className="w-full h-full justify-between rounded-[10px] px-4"
    >
      <Holds
        position="row"
        className="h-full flex items-center justify-between"
      >
        <Buttons
          background={"none"}
          shadow={"none"}
          onClick={hasUnsavedChanges ? undefined : onRegisterNew}
          className="w-fit h-auto"
        >
          <Texts
            size="sm"
            text={"link"}
            className={hasUnsavedChanges ? "text-app-dark-gray" : ""}
          >
            Register New
          </Texts>
        </Buttons>

        <Buttons
          background={"none"}
          shadow={"none"}
          onClick={onDiscardChanges}
          disabled={isSaving || !hasUnsavedChanges}
          className="w-fit h-auto px-2"
        >
          <Texts
            size="sm"
            text="link"
            className={!hasUnsavedChanges ? "text-app-dark-gray" : ""}
          >
            Discard Changes
          </Texts>
        </Buttons>

        {/* Save Changes button shows saved indicator when successful */}
        {successfullyUpdated ? (
          <Holds
            background={"green"}
            className="rounded-[10px] px-4 py-2 text-center"
          >
            <Texts size="sm" className="text-white">
              Changes Saved Successfully!
            </Texts>
          </Holds>
        ) : (
          <Buttons
            background={"none"}
            shadow={"none"}
            onClick={onSaveChanges}
            disabled={!hasUnsavedChanges || isSaving}
            className="w-fit h-auto px-2"
          >
            <Texts
              size="sm"
              text="link"
              className={!hasUnsavedChanges ? "text-app-dark-gray" : ""}
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </Texts>
          </Buttons>
        )}

        <Buttons
          background={"none"}
          shadow={"none"}
          onClick={onDeleteCostCode}
          disabled={isSaving}
          className="w-fit h-auto px-2"
        >
          <Texts text="link" size="sm">
            Delete
          </Texts>
        </Buttons>
      </Holds>
    </Holds>
  );
}
