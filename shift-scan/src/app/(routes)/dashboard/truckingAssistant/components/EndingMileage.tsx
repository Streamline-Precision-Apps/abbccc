import { Inputs } from "@/components/(reusable)/inputs";
import { useEffect, useRef } from "react";
import { updateTruckingMileage } from "@/actions/truckingActions";

export const EndingMileage = ({
  truckingLog,
  endMileage,
  setEndMileage,
}: {
  truckingLog: string | undefined;
  endMileage: number | null;
  setEndMileage: React.Dispatch<React.SetStateAction<number | null>>;
}) => {
  // Track Initial Load
  const isInitialRender = useRef(true);

  // Debounce Mileage and Skip Initial Load
  useEffect(() => {
    // Skip server action on initial load
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }

    // Trigger update only on data change
    const timeoutId = setTimeout(() => {
      const formData = new FormData();
      formData.append("endingMileage", endMileage?.toString() || "");
      formData.append("id", truckingLog ?? "");
      updateTruckingMileage(formData);
      console.log("Mileage Updated:", endMileage);
    }, 700);

    return () => clearTimeout(timeoutId);
  }, [endMileage, truckingLog]);

  return (
    <Inputs
      type="number"
      name="endingMileage"
      value={endMileage || ""}
      onChange={(e) => setEndMileage(parseInt(e.target.value) || null)}
      placeholder="Enter Ending Mileage Here..."
      className="h-full w-full border-black border-[3px] rounded-[10px] pl-3 text-base focus:outline-none focus:ring-transparent focus:border-current"
    />
  );
};
