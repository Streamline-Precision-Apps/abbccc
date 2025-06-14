import { CostCode, CostCodeSummary, Tag, TagSummary } from "../../types";
import { NewCostCodeData } from "./hooks/useCostCodeRegistrationForm";

/**
 * Type for the UI state of the Cost Code management interface
 */
export type CostCodeUIState = "idle" | "creating" | "editing";

/**
 * Props for the CostCodeSideBar component
 */
export interface CostCodeSideBarProps {
  assets: string;
  setAssets: React.Dispatch<React.SetStateAction<string>>;
  costCodes: CostCodeSummary[];
  setSelectCostCode: (costCode: CostCodeSummary | null) => void;
  selectCostCode: CostCode | null;
  isRegistrationFormOpen: boolean;
  setIsRegistrationFormOpen: React.Dispatch<React.SetStateAction<boolean>>;
  hasUnsavedChanges?: boolean;
  tagSummaries: TagSummary[];
  selectTag: Tag | null;
  setSelectTag: React.Dispatch<React.SetStateAction<Tag | null>>;
  costCodeUIState: CostCodeUIState;
  setCostCodeUIState: React.Dispatch<React.SetStateAction<CostCodeUIState>>;
}

/**
 * Props for the CostCodeMainContent component
 */
export interface CostCodeMainContentProps {
  assets: string;
  selectCostCode: CostCode | null;
  isRegistrationFormOpen: boolean;
  setIsRegistrationFormOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isRegistrationGroupFormOpen: boolean;
  setIsRegistrationGroupFormOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectCostCode: React.Dispatch<React.SetStateAction<CostCode | null>>;
  refreshCostCodes: () => Promise<void>;
  loading?: boolean;
  selectTag: Tag | null;
  setSelectTag: React.Dispatch<React.SetStateAction<Tag | null>>;
  setHasUnsavedChanges: React.Dispatch<React.SetStateAction<boolean>>;
  costCodeUIState: CostCodeUIState;
  setCostCodeUIState: React.Dispatch<React.SetStateAction<CostCodeUIState>>;
}

/**
 * Props for the CostCodeRow component
 */
export interface CostCodeRowProps {
  costCode: CostCodeSummary;
  isSelected?: boolean;
  onClick: (costCode: CostCodeSummary) => void;
  hasUnsavedChanges?: boolean;
  costCodeUIState:
    | "idle"
    | "creating"
    | "editing"
    | "editingGroups"
    | "creatingGroups";
  onToggleCostCode?: (costCodeId: string, costCodeName: string) => void;
}

/**
 * Props for the CostCodeFormView component
 */
export interface CostCodeFormViewProps {
  formData: CostCode;
  changedFields: Set<keyof CostCode>;
  onInputChange: (
    fieldName: keyof CostCode,
    value: string | boolean | Array<{ id: string; name: string }>
  ) => void;
  onRevertField: (fieldName: keyof CostCode) => void;
  onRegisterNew: () => void;
  onDiscardChanges: () => void;
  onSaveChanges: () => Promise<{ success: boolean; error?: string }>;
  onDeleteCostCode: () => Promise<{ success: boolean; error?: string }>;
  hasUnsavedChanges: boolean;
  isSaving: boolean;
  isDeleting: boolean;
  successfullyUpdated: boolean;
  error?: string | null;
  tagSummaries: TagSummary[];
  closeForm: () => void;
}

/**
 * Props for the CostCodeBasicFields component
 */
export interface CostCodeBasicFieldsProps {
  formData: CostCode;
  changedFields: Set<keyof CostCode>;
  onInputChange: (fieldName: keyof CostCode, value: string | boolean) => void;
  onRevertField: (fieldName: keyof CostCode) => void;
}

/**
 * Props for the CostCodeEmptyState component
 */
export interface CostCodeEmptyStateProps {
  error: string | null;
  successMessage: string | null;
  onRegisterNew: () => void;
  onRegisterNewGroup: () => void;
}

/**
 * Type definition for cost code registration result
 */
export interface RegistrationResult {
  success: boolean;
  error?: string;
}

/**
 * Props for the CostCodeRegistrationView component
 */
export interface CostCodeRegistrationViewProps {
  formData: NewCostCodeData;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  isSubmitting: boolean;
  successfullyRegistered: string | null;
  registrationError: string | null;
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  handleBlur: (
    e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  handleTagToggle: (tagId: string, tagName: string) => void;
  handleSubmit: () => Promise<void>;
  resetForm: () => void;
  hasChanged: boolean;
  isFormValid: boolean;
  tagSummaries?: TagSummary[];
  refreshCostCodes: () => Promise<void>;
  onCancel: () => void;
}

/**
 * Props for the DeleteCostCodeModal component
 */
export interface DeleteCostCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
  costCodeName?: string;
  isDeleting?: boolean;
}
