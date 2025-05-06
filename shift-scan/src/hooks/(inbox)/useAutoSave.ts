import { useCallback, useEffect } from "react";
import { debounce } from "lodash";

export const useAutoSave = <T>(
  saveFunction: (data: T) => Promise<void>,
  delay: number
) => {
  const debouncedSave = useCallback(
    debounce((data: T) => saveFunction(data), delay),
    [saveFunction, delay]
  );

  useEffect(() => {
    return () => {
      debouncedSave.cancel();
    };
  }, [debouncedSave]);

  return debouncedSave;
};
