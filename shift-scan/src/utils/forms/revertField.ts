// allows user to trigger a button and revert a field to previous value
export const revertField = <T>(
  field: keyof T,
  setEditedData: React.Dispatch<React.SetStateAction<T | null>>,
  initialData: T | null
) => {
  setEditedData((prevData) =>
    prevData && initialData
      ? { ...prevData, [field]: initialData[field] }
      : prevData
  );
};
