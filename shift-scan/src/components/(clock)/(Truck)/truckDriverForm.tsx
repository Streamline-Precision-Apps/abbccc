"use client";

import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Inputs } from "@/components/(reusable)/inputs";
import { useTranslations } from "next-intl";
import { Dispatch, SetStateAction } from "react";
import TruckSelector from "../(General)/truckSelector";
type Option = {
  label: string;
  code: string;
};
type TruckDriverFormProps = {
  displayValue: string;
  setDisplayValue: Dispatch<SetStateAction<string>>;
  startingMileage: number;
  setStartingMileage: Dispatch<SetStateAction<number>>;
  truck: Option;
  setTruck: React.Dispatch<React.SetStateAction<Option>>;
  selectedOpt: boolean;
  setSelectedOpt: React.Dispatch<React.SetStateAction<boolean>>;
  handleNextStep: () => void;
};
export default function TruckDriverForm({
  displayValue,
  setDisplayValue,
  startingMileage,
  setStartingMileage,
  truck,
  setTruck,
  selectedOpt,
  setSelectedOpt,
  handleNextStep,
}: TruckDriverFormProps) {
  const t = useTranslations("Clock");
  return (
    <Holds className="row-start-2 row-end-8 h-full w-full">
      <Grids rows={"7"} className="h-full w-full">
        <Holds className="row-start-1 row-end-2 w-full">
          <Inputs
            type="text"
            name={"startingMileage"}
            value={displayValue}
            placeholder={t("StartingMileage")}
            onChange={(e) => {
              // Strip non-numeric characters
              const numericValue = e.target.value.replace(/[^0-9]/g, "");
              const number = Number(numericValue);

              // Update display value with commas
              setDisplayValue(number.toLocaleString());
              setStartingMileage(number);
            }}
            onBlur={() => {
              if (startingMileage) {
                setDisplayValue(`${startingMileage.toLocaleString()} Miles`);
              }
            }}
            onFocus={() => {
              // Remove commas when focusing to allow easy editing
              setDisplayValue(startingMileage?.toString() || "");
            }}
            className="text-center placeholder:text-sm"
          />
        </Holds>
        <Holds className="row-start-2 row-end-8 h-full w-full">
          <TruckSelector
            onTruckSelect={(selectedTruck) => {
              if (selectedTruck) {
                setTruck(selectedTruck); // Update the truck state with the full Option object
              } else {
                setTruck({ code: "", label: "" }); // Reset if null
              }
              setSelectedOpt(!!selectedTruck);
            }}
            initialValue={truck}
          />
        </Holds>
      </Grids>
    </Holds>
  );
}
