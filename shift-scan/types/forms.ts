/**
 * Types for FormTemplate, FormGrouping, and FormField for admin forms list view.
 * These match the API and Prisma schema for forms.
 */

export interface FormField {
  id: string;
  label: string;
  name: string;
  type: string;
  required: boolean;
  order: number;
  defaultValue?: string;
  placeholder?: string;
  maxLength?: number;
  helperText?: string;
  options?: string[];
}

export interface FormGrouping {
  id: string;
  title: string;
  order: number;
  fields: FormField[];
}

export interface FormTemplate {
  id: string;
  name: string;
  formType?: string;
  isActive?: boolean;
  isSignatureRequired?: boolean;
  groupings: FormGrouping[];
  createdAt?: string;
}

/**
 * Minimal type for displaying in the list view
 */
export interface FormListItem {
  id: string;
  name: string;
  formType?: string;
  createdAt?: string;
}
