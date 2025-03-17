import { useCallback, useEffect } from "react";
import { debounce } from "lodash";

export const useAutoSave = <T>(
  saveFunction: (data: T) => Promise<void>, // Use a generic type T for the data parameter
  delay: number
) => {
  const debouncedSave = useCallback(debounce(saveFunction, delay), [
    saveFunction,
    delay,
  ]);

  useEffect(() => {
    return () => {
      debouncedSave.cancel();
    };
  }, [debouncedSave]);

  return debouncedSave;
};
