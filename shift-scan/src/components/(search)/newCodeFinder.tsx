"use client";
import React, { useState, ChangeEvent, useMemo } from "react";
import { useTranslations } from "next-intl";
import { Holds } from "../(reusable)/holds";
import { Grids } from "../(reusable)/grids";
import { Titles } from "../(reusable)/titles";
import { Buttons } from "../(reusable)/buttons";
import { Texts } from "../(reusable)/texts";
import { Images } from "../(reusable)/images";

type Option = {
  id: string;
  code: string;
  label: string;
};

type CodeFinderProps = {
  options: Option[]; // Pass options directly instead of generating internally
  selectedOption: Option | null; // Controlled selected value
  onSelect: (option: Option | null) => void; // Selection handler
  placeholder?: string;
  label?: string;
  className?: string;
};

export default function CodeFinder({
  options,
  selectedOption,
  onSelect,
  placeholder = "Search...",
  label,
  className = "",
}: CodeFinderProps) {
  const t = useTranslations("Clock");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredOptions = useMemo(() => {
    return options
      .filter((option) =>
        option.label.toLowerCase().startsWith(searchTerm.toLowerCase())
      )
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [options, searchTerm]);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value.toUpperCase()); // Convert to uppercase
  };

  const clearSelection = () => {
    setSearchTerm("");
    onSelect(null);
  };

  return (
    <Grids rows={"8"} className={`h-full w-full `}>
      <Holds className="row-span-1 h-full">
        {selectedOption ? (
          <Holds
            background={"lightBlue"}
            className="h-full w-full border-[3px] border-b-none border-black rounded-b-none justify-center items-center"
            onClick={clearSelection}
          >
            <Titles size={"h4"} className="text-center text-black">
              {selectedOption.label.length > 21
                ? selectedOption.label.slice(0, 21) + "..."
                : selectedOption.label}
            </Titles>
          </Holds>
        ) : (
          <SearchBar
            searchTerm={searchTerm}
            onSearchChange={handleSearchChange}
            placeholder={placeholder}
            label={label}
          />
        )}
      </Holds>
      <Holds
        background={"darkBlue"}
        className="row-start-2 row-end-9 h-full border-[3px] border-black rounded-[10px] rounded-t-none overflow-y-auto no-scrollbar"
      >
        {filteredOptions.length > 0 ? (
          filteredOptions.map((option) => (
            <Holds key={option.code} className="p-2">
              <Buttons
                shadow={"none"}
                className={`p-2 cursor-pointer ${
                  selectedOption?.code === option.code
                    ? "bg-app-green"
                    : "bg-white"
                }`}
                onClick={() =>
                  selectedOption?.code === option.code
                    ? clearSelection()
                    : onSelect(option)
                }
              >
                <Titles size={"h4"}>{option.label}</Titles>
              </Buttons>
            </Holds>
          ))
        ) : (
          <Holds className="h-full w-full p-1.5 ">
            <Holds
              background={"white"}
              className="flex justify-center items-center h-full w-full opacity-10 relative"
            ></Holds>
          </Holds>
        )}
      </Holds>
    </Grids>
  );
}

// Simplified SearchBar component
const SearchBar = ({
  searchTerm,
  onSearchChange,
  placeholder,
  label,
}: {
  searchTerm: string;
  onSearchChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  label?: string;
}) => {
  return (
    <Holds
      position={"row"}
      className="px-4 border-[3px] border-black rounded-[10px] rounded-b-none h-full"
    >
      <Holds position={"row"} className="h-full w-full">
        <Holds size={"10"}>
          <Images
            titleImg="/searchLeft.svg"
            titleImgAlt="search"
            size={"full"}
          />
        </Holds>
        <Holds size={"80"} className="pl-4 text-xl">
          <input
            type="text"
            value={searchTerm}
            onChange={onSearchChange}
            placeholder={placeholder}
            className="w-full h-full text-center placeholder-gray-500 placeholder:text-xl focus:outline-none rounded-[10px] "
            aria-label={label}
          />
        </Holds>
        <Holds size={"10"}></Holds>
      </Holds>
    </Holds>
  );
};
