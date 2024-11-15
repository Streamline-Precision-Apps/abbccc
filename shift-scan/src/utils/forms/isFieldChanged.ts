// allows user to detect if a field has been modified
export const isFieldChanged = <T>(
  field: keyof T,
  editedData: T | null,
  initialData: T | null
) => {
  return editedData && initialData && editedData[field] !== initialData[field];
};
