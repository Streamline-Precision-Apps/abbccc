import React from 'react';
import "@/app/globals.css";
import { useTranslations } from 'next-intl';

interface Option {
  code: string;
  label: string;
}

interface CustomSelectProps {
  options: Option[];
  placeholder: string;
  onOptionSelect: (option: Option) => void;
  selectedOption: Option | null;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  options,
  placeholder,
  onOptionSelect,
  selectedOption,
}) => {
  const t = useTranslations('Clock');

  return (
    <div className="w-full overflow-y-auto text-center p-4 border-2 border-black mt-5 ">
      {options.length > 0 && (
        <div>
          <h2>{t("SearchedCodes")}</h2>
          <div className="border-t-2 border-black">
            {options.map((option) => (
              <div
                key={option.code}
                className="text-3xl p-4 hover:bg-gray-200 cursor-pointer even:bg-gray-100"
                onClick={() => onOptionSelect(option)}
              >
                {option.label}
              </div>
            ))}
          </div>
        </div>
      )}
      {options.length === 0 &&  <p>{t("noResults")}</p>}
    </div>
  );
};

export default CustomSelect;