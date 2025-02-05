"use client";
import React from "react";
import "@/app/globals.css";
import { useTranslations } from "next-intl";
import { Holds } from "../(reusable)/holds";
import { Texts } from "../(reusable)/texts";
import { Buttons } from "../(reusable)/buttons";
import { Contents } from "../(reusable)/contents";

type Option = {
  code: string;
  label: string;
};

type CustomSelectProps = {
  options: Option[];
  onOptionSelect: (option: Option) => void;
  selectedOption: Option | null;
  clearSelection: () => void;
};

const CustomSelect: React.FC<CustomSelectProps> = ({
  options,
  onOptionSelect,
  selectedOption,
  clearSelection,
}) => {
  const t = useTranslations("Clock");

  return (
    <Holds className="h-full w-full">
      {options.length > 0 ? (
        <Contents width={"section"} className="h-full">
          {/* <Texts>{t("SearchedCodes")}</Texts> */}
          {options.map((option) => (
            <Holds key={option.code} className="py-2">
              <Buttons
                key={option.code}
                className={` p-2 cursor-pointer ${
                  selectedOption?.code === option.code
                    ? "border-[3px] border-app-green"
                    : ""
                }`}
                onClick={
                  () =>
                    selectedOption?.code === option.code
                      ? clearSelection() // Deselect if it's already selected
                      : onOptionSelect(option) // Select the option
                }
              >
                <Texts size={"p3"}>{option.label}</Texts>
              </Buttons>
            </Holds>
          ))}
        </Contents>
      ) : (
        <Texts>{t("noResults")}</Texts>
      )}
    </Holds>
  );
};

export default CustomSelect;
