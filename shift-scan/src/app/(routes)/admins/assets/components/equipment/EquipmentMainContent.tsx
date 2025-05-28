// filepath: /Users/devunfox/abbccc/shift-scan/src/app/(routes)/admins/assets/components/equipment/EquipmentMainContent.tsx
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Equipment } from "../../types";
import { useEquipmentForm } from "./hooks/useEquipmentForm";
import {
  EquipmentHeaderActions,
  EquipmentFormView,
  EquipmentEmptyState,
  EquipmentRegistrationView,
} from "./components";

interface EquipmentMainContentProps {
  /** Assets data */
  assets: string;
  /** Currently selected equipment */
  selectEquipment: Equipment | null;
  /** Whether the registration form is open */
  isRegistrationFormOpen: boolean;
  /** Handler to set registration form state */
  setIsRegistrationFormOpen: React.Dispatch<React.SetStateAction<boolean>>;
  /** Handler to set selected equipment */
  setSelectEquipment: React.Dispatch<React.SetStateAction<Equipment | null>>;
  /** Callback when unsaved changes state changes */
  onUnsavedChangesChange?: (hasChanges: boolean) => void;
}

/**
 * Main content component for equipment management.
 * Handles equipment viewing, editing, and registration using decomposed components.
 *
 * This component has been refactored from a 861-line monolithic component into
 * smaller, focused components following single responsibility principle.
 *
 * @param props - The component props
 * @returns JSX element containing the appropriate view based on current state
 */
export default function EquipmentMainContent({
  assets,
  selectEquipment,
  isRegistrationFormOpen,
  setIsRegistrationFormOpen,
  setSelectEquipment,
  onUnsavedChangesChange,
}: EquipmentMainContentProps) {
  const {
    formData,
    changedFields,
    hasUnsavedChanges,
    isSaving,
    successfullyUpdated,
    handleInputChange,
    handleSaveChanges,
    handleDiscardChanges,
    handleNewEquipmentSubmit,
    handleRevertField,
  } = useEquipmentForm({
    selectEquipment,
    setSelectEquipment,
    setIsRegistrationFormOpen,
    onUnsavedChangesChange,
  });

  // Handle opening registration form
  const handleOpenRegistration = () => {
    setIsRegistrationFormOpen(true);
  };

  // Handle canceling registration
  const handleCancelRegistration = () => {
    setIsRegistrationFormOpen(false);
  };

  // Show registration view when registration form is open and no equipment is selected
  if (!selectEquipment && isRegistrationFormOpen) {
    return (
      <EquipmentRegistrationView
        onSubmit={handleNewEquipmentSubmit}
        onCancel={handleCancelRegistration}
      />
    );
  }

  // Show empty state when no equipment is selected and registration form is closed
  if (!selectEquipment) {
    return <EquipmentEmptyState onOpenRegistration={handleOpenRegistration} />;
  }

  // Show equipment form view when equipment is selected
  return (
    <Holds className="w-full h-full col-span-4">
      <Grids className="w-full h-full grid-rows-[40px_1fr] gap-4">
        <EquipmentHeaderActions
          hasUnsavedChanges={hasUnsavedChanges}
          isSaving={isSaving}
          successfullyUpdated={successfullyUpdated}
          onRegisterNew={handleOpenRegistration}
          onDiscardChanges={handleDiscardChanges}
          onSaveChanges={handleSaveChanges}
          changedFieldsCount={changedFields.size}
        />

        <EquipmentFormView
          equipment={selectEquipment}
          formData={formData!}
          changedFields={changedFields}
          onInputChange={handleInputChange}
          onRevertField={handleRevertField}
          isSaving={isSaving}
        />
      </Grids>
    </Holds>
  );
}
