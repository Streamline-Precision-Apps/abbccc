import { Buttons } from "@/components/(reusable)/buttons";
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
  onDeleteEquipment: () => void;
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
  onDeleteEquipment,
}: EquipmentHeaderActionsProps) {
  return (
    <Holds
      background="white"
      position="row"
      className="w-full h-full rounded-[10px] justify-between px-4 relative"
    >
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
          Register New Equipment
        </Texts>
      </Buttons>

      <Buttons
        background={"none"}
        shadow={"none"}
        onClick={hasUnsavedChanges ? onDiscardChanges : undefined}
        className="w-fit h-auto "
      >
        <Texts
          size="sm"
          text={"link"}
          className={hasUnsavedChanges ? "" : "text-app-dark-gray"}
        >
          Discard All Changes {hasUnsavedChanges && `(${changedFieldsCount})`}
        </Texts>
      </Buttons>

      <Buttons
        background={"none"}
        shadow={"none"}
        onClick={hasUnsavedChanges && !isSaving ? onSaveChanges : undefined}
        className="w-fit h-auto "
      >
        <Texts
          size="sm"
          text={"link"}
          className={hasUnsavedChanges ? "" : "text-app-dark-gray"}
        >
          {isSaving ? "Saving..." : "Save changes"}
        </Texts>
      </Buttons>

      <Buttons
        background={"none"}
        shadow={"none"}
        onClick={hasUnsavedChanges ? undefined : onDeleteEquipment}
        className="w-fit h-auto "
      >
        <Texts size="sm" text={"link"}>
          Delete Equipment
        </Texts>
      </Buttons>

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
