// this component is used in multiple places and takes the data from the database 
//and stores it in a state to be searched and filtered. The main location is in QrGenerator.tsx as of now.
"use client";
import React, { useState, useEffect, ChangeEvent } from "react";
import SearchBar from "@/components/(search)/searchbar";
import { Holds } from "@/components/(reusable)/holds";
import { JobCodes, EquipmentCodes } from "@/lib/types";
import { useTranslations } from "next-intl";

type Props<T> = {
  datatype: string;
  options: T[];
  onSelect: (option: T) => void;
};

function SearchSelect<T extends JobCodes | EquipmentCodes>({ datatype, options, onSelect }: Props<T>) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOptions, setFilteredOptions] = useState<T[]>(options);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const t = useTranslations('SearchBar');

  // Update `filteredOptions` when `searchTerm` changes
  useEffect(() => {
    setFilteredOptions(
      options.filter((option) =>
        option.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        option.qrId.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, options]);

  // Handle changes in search input
  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
   if (value.trim() === "") {
      setIsMenuOpen(false); // Close menu if input is empty
    } else {
      setIsMenuOpen(true); // Open menu when typing
    }
  };

  // Handle selecting an option from the dropdown
  const handleOptionSelect = (option: T) => {
    setSearchTerm(option.name); // Set the search input to the selected option
    setIsMenuOpen(false); // Close the dropdown menu
    onSelect(option); // Call the onSelect prop with the selected option
  };

  return (
    <Holds className="relative">
      {/* Search bar for filtering */}
      <SearchBar
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        placeholder={`${datatype}...`}
      />

      {/* Dropdown menu that displays when `isMenuOpen` is true */}
      {isMenuOpen && (
       <ul className="absolute z-10 w-full max-h-28 mt-14 overflow-y-auto bg-white border-2 border-black rounded-b rounded-y shadow-lg no-scrollbar">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => (
              <li
                key={option.qrId}
                onClick={() => handleOptionSelect(option)}
                className="py-3 cursor-pointer text-center text-lg even:bg-gray-200 border-b-2 border-black last:border-0"
              >
                {option.name} - {option.qrId}
              </li>
            ))
          ) : (
            <li className="p-2 h-28 text-black text-center flex items-center justify-center text-xl">{t("NoResults")}</li>
          )}
        </ul>
      )}
    </Holds>
  );
}

export default SearchSelect;