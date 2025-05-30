import { Holds } from "@/components/(reusable)/holds";
import { Texts } from "@/components/(reusable)/texts";

interface EquipmentHeaderActionsProps {
  hasUnsavedChanges: boolean;
  isSaving: boolean;
  successfullyUpdated: boolean;
  changedFieldsCount: number;
  onRegisterNew: () => void;
  onDiscardChanges: () => void;
  onSaveChanges: () => void;
}

/**
 * Header actions component for equipment view
 * Displays register new, discard changes, and save changes buttons
 */
export default function EquipmentHeaderActions({
  hasUnsavedChanges,
  isSaving,
  successfullyUpdated,
  changedFieldsCount,
  onRegisterNew,
  onDiscardChanges,
  onSaveChanges,
}: EquipmentHeaderActionsProps) {
  return (
    <Holds
      background="white"
      position="row"
      className="w-full h-full rounded-[10px] justify-between px-4 relative"
    >
      <Holds className="w-full h-full flex justify-center">
        <Texts
          position="left"
          size="sm"
          text="link"
          className={`cursor-pointer ${
            hasUnsavedChanges
              ? "opacity-50 cursor-not-allowed"
              : "hover:underline"
          }`}
          onClick={hasUnsavedChanges ? undefined : onRegisterNew}
        >
          Register New Equipment
        </Texts>
      </Holds>

      <Holds
        position="row"
        className="h-full flex items-center justify-between"
      >
        <Texts
          size="sm"
          text="link"
          className={`cursor-pointer ${
            !hasUnsavedChanges
              ? "opacity-50 cursor-not-allowed"
              : "hover:underline"
          }`}
          onClick={hasUnsavedChanges ? onDiscardChanges : undefined}
        >
          Discard All Changes {hasUnsavedChanges && `(${changedFieldsCount})`}
        </Texts>

        <Texts
          size="sm"
          text="link"
          className={`cursor-pointer ${
            !hasUnsavedChanges || isSaving
              ? "opacity-50 cursor-not-allowed"
              : "hover:underline font-semibold"
          }`}
          onClick={hasUnsavedChanges && !isSaving ? onSaveChanges : undefined}
        >
          {isSaving ? "Saving..." : "Save changes"}
        </Texts>
      </Holds>

      {successfullyUpdated && (
        <Holds
          background="green"
          className="w-full h-full absolute left-0 top-0 z-50 rounded-[10px] flex items-center justify-center"
        >
          <Texts size="sm" className="text-center">
            Successfully Updated Equipment!
          </Texts>
        </Holds>
      )}
    </Holds>
  );
}
