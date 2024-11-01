"use client";
import React from "react";
import "@/app/globals.css";
import { useTranslations } from "next-intl";

type Option = {
  code: string;
  label: string;
};

type CustomSelectProps = {
  options: Option[];
  onOptionSelect: (option: Option) => void;
  selectedOption: Option | null;
};

const CustomSelect: React.FC<CustomSelectProps> = ({
  options,
  onOptionSelect,
  selectedOption,
}) => {
  const t = useTranslations("Clock");

  return (
    <div className=" overflow-y-auto no-scrollbar text-center ">
      {options.length > 0 && (
        <div>
          <h2>{t("SearchedCodes")}</h2>
          <div className="border-t-2 border-black">
            {options.map((option) => (
              <div
                key={option.code}
                className={`text-3xl p-4 hover:bg-gray-200 cursor-pointer ${
                  selectedOption?.code === option.code
                    ? "bg-gray-300"
                    : "even:bg-gray-100"
                }`}
                onClick={() => onOptionSelect(option)}
              >
                {option.label}
              </div>
            ))}
          </div>
        </div>
      )}
      {options.length === 0 && <p>{t("noResults")}</p>}
    </div>
  );
};

export default CustomSelect;
