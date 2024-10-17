// this component is used in multiple places and takes the data from the database
//and stores it in a state to be searched and filtered. The main location is in QrGenerator.tsx as of now.
"use client";
import React, { useState, useEffect, ChangeEvent } from "react";
import SearchBar from "@/components/(search)/searchbar";
import { Holds } from "@/components/(reusable)/holds";
import { JobCodes, EquipmentCodes } from "@/lib/types";
import { useTranslations } from "next-intl";
import { Grids } from "@/components/(reusable)/grids";
import { Texts } from "../(reusable)/texts";
import { Buttons } from "../(reusable)/buttons";
import { Contents } from "../(reusable)/contents";
import { Titles } from "../(reusable)/titles";
import { set } from "zod";
import Spinner from "../(animations)/spinner";

type Props<T> = {
  datatype: string;
  loading: boolean;
  handleGenerate: () => void;
  options: T[];
  recentOptions: T[];
  onSelect: (option: T) => void;
};

function SearchSelect<T extends JobCodes | EquipmentCodes>({
  datatype,
  options,
  handleGenerate,
  recentOptions,
  onSelect,
  loading,
}: Props<T>) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOptions, setFilteredOptions] = useState<T[]>(options);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [recentFilteredOptions, setRecentFilteredOptions] =
    useState<T[]>(recentOptions);
  const [selectedTerm, setSelectedTerm] = useState(false);

  const t = useTranslations("Generator");

  // Recent Options
  useEffect(() => {
    setRecentFilteredOptions(recentOptions);
  }, [searchTerm, options]);

  // Update `filteredOptions` when `searchTerm` changes
  useEffect(() => {
    setFilteredOptions(
      options.filter(
        (option) =>
          option.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          option.qrId.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, options]);

  // Handle changes in search input
  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSelectedTerm(false);
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
    setSelectedTerm(true);
    onSelect(option); // Call the onSelect prop with the selected option
  };

  return (
    <Grids rows={"6"} className="border-[3px] border-black rounded-[10px]">
      <Holds className="h-full rounded-[10px] rounded-b-none border-b-[3px] border-black row-span-1">
        {/* Search bar for filtering */}
        <SearchBar
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          placeholder={`${datatype}...`}
          selected={selectedTerm}
        />
      </Holds>
      {loading ? (
        <Holds className="h-full row-span-5 my-auto">
          <Contents width={"section"} className="my-auto h-full">
            <Holds className="my-auto h-full justify-center items-center">
              <Spinner />
            </Holds>
          </Contents>
        </Holds>
      ) : (
        <Holds className="h-full row-span-5">
          {/* Dropdown menu for recent options */}
          {!searchTerm && (
            <ul className="h-full overflow-y-auto rounded-b-[10px] no-scrollbar">
              {recentFilteredOptions.map((recentOptions) => (
                <li
                  key={recentOptions.qrId}
                  onClick={() => handleOptionSelect(recentOptions)}
                  className="py-3 cursor-pointer last:border-0"
                >
                  <Holds>
                    <Contents width={"section"}>
                      <Buttons className="p-4">
                        <Texts size={"p4"}>
                          {recentOptions.name} - {recentOptions.qrId}
                        </Texts>
                      </Buttons>
                    </Contents>
                  </Holds>
                </li>
              ))}
            </ul>
          )}
          {/* Dropdown menu that displays when `isMenuOpen` is true */}
          {isMenuOpen && (
            <ul className="h-full overflow-y-auto rounded-b-[10px] no-scrollbar">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => (
                  <li
                    key={option.qrId}
                    onClick={() => handleOptionSelect(option)}
                    className="py-3 cursor-pointer last:border-0"
                  >
                    <Holds>
                      <Contents width={"section"}>
                        <Buttons className="p-4">
                          <Texts size={"p4"}>
                            {option.name} - {option.qrId}
                          </Texts>
                        </Buttons>
                      </Contents>
                    </Holds>
                  </li>
                ))
              ) : (
                <li className="p-2 h-28 text-black text-center flex items-center justify-center text-xl">
                  {t("NoResults")}
                </li>
              )}
            </ul>
          )}
          {searchTerm && !isMenuOpen && (
            <Holds className="h-full">
              <Holds size={"90"} className="my-[10%] h-full">
                <Buttons background={"orange"} onClick={handleGenerate}>
                  <Titles size={"h2"}>{t("GenerateCode")}</Titles>
                </Buttons>
              </Holds>
            </Holds>
          )}
        </Holds>
      )}
    </Grids>
  );
}

export default SearchSelect;
