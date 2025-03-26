import { Inputs } from "@/components/(reusable)/inputs";
import { updateTruckingMileage } from "@/actions/truckingActions";
import { useTranslations } from "next-intl";

export const EndingMileage = ({
  truckingLog,
  endMileage,
  setEndMileage,
}: {
  truckingLog: string | undefined;
  endMileage: number | null;
  setEndMileage: React.Dispatch<React.SetStateAction<number | null>>;
}) => {
  const t = useTranslations("TruckingAssistant");
  const updateEndingMileage = async () => {
    const formData = new FormData();
    formData.append("endingMileage", endMileage?.toString() || "");
    formData.append("id", truckingLog ?? "");
    updateTruckingMileage(formData);
    console.log("Mileage Updated:", endMileage);
  };

  return (
    <Inputs
      type="number"
      name="endingMileage"
      value={endMileage || ""}
      onChange={(e) => setEndMileage(parseInt(e.target.value) || null)}
      onBlur={updateEndingMileage}
      placeholder={t("EnterEndingMileageHere")}
      className={`h-full w-full ${
        endMileage === null ? "placeholder:text-app-red" : ""
      } border-black border-[3px] rounded-[10px] pl-3 text-base focus:outline-none focus:ring-transparent focus:border-current`}
    />
  );
};
