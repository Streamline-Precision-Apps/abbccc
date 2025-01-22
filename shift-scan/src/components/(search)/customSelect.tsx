"use client";
import React from "react";
import "@/app/globals.css";
import { useTranslations } from "next-intl";
import { Holds } from "../(reusable)/holds";
import { Texts } from "../(reusable)/texts";
import { Buttons } from "../(reusable)/buttons";

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
    <Holds className=" overflow-y-auto no-scrollbar text-center ">
      {options.length > 0 ? (
        <Holds>
          <Texts>{t("SearchedCodes")}</Texts>
          <Holds className="flex flex-col w-[95%]">
            {options.map((option) => (
              <Holds key={option.code} className="py-2">
                <Buttons
                  key={option.code}
                  className={`text-3xl p-2 cursor-pointer ${
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
                  <Texts>{option.label}</Texts>
                </Buttons>
              </Holds>
            ))}
          </Holds>
        </Holds>
      ) : (
        <Texts>{t("noResults")}</Texts>
      )}
    </Holds>
  );
};

export default CustomSelect;
