"use client";

import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Inputs } from "@/components/(reusable)/inputs";
import { useTranslations } from "next-intl";
import { Dispatch, SetStateAction } from "react";
import TruckSelector from "../(General)/truckSelector";
import { Buttons } from "@/components/(reusable)/buttons";
import { Titles } from "@/components/(reusable)/titles";
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
    <Grids rows={"7"} gap={"5"} className="h-full w-full">
      <Holds className="row-start-1 row-end-2 ">
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
      <Holds className="row-start-2 row-end-7 h-full w-full">
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
      <Holds className="row-start-7 row-end-8 w-full">
        <Buttons
          className="py-2"
          background={!startingMileage || !selectedOpt ? "darkGray" : "orange"}
          onClick={() => {
            handleNextStep();
          }}
          disabled={!selectedOpt || !startingMileage}
        >
          <Titles>{t("Continue")}</Titles>
        </Buttons>
      </Holds>
    </Grids>
  );
}
