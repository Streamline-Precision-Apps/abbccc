"use client";
import React, { ChangeEvent, useEffect } from "react";
import { Images } from "../(reusable)/images";
import { Holds } from "../(reusable)/holds";

// defines the searchbar type for typescript
type SearchBarProps = {
  searchTerm: string;
  onSearchChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  selected: boolean;
  setSearchTerm?: React.Dispatch<React.SetStateAction<string>>;
  setSelectedTerm?: React.Dispatch<React.SetStateAction<boolean>>;
  clearSelection: () => void;
};

// defines the searchbar component and what the input should look like
export default function SearchBar({
  searchTerm,
  onSearchChange,
  placeholder,
  selected,
  setSelectedTerm,
  clearSelection,
}: SearchBarProps) {
  const previousTermLength = searchTerm.length;

  useEffect(() => {
    if (setSelectedTerm && previousTermLength > 0 && searchTerm.length === 0) {
      // Clear selection when the search term is erased
      clearSelection();
    }
  }, [searchTerm, setSelectedTerm, clearSelection, previousTermLength]);
  return (
    <Holds
      position={"row"}
      className="px-4 border-[3px] border-black rounded-[10px] h-full"
    >
      <Holds size={"10"}>
        <Images
          titleImg="/magnifyingGlass.svg"
          titleImgAlt="search"
          size={"full"}
        />
      </Holds>
      <Holds size={"90"} className="rounded-[10px] pl-3">
        {selected ? (
          <Holds position={"row"} className="h-full w-full space-x-2">
            <input
              type="text"
              value={searchTerm}
              onChange={onSearchChange}
              className="w-full h-full py-3 bg-app-blue text-center text-bold border-2 border-black rounded-[10px] "
            />
          </Holds>
        ) : (
          <input
            type="text"
            value={searchTerm}
            onChange={onSearchChange}
            placeholder={placeholder}
            className="w-full h-full placeholder-gray-500 placeholder:text-xl focus:outline-none rounded-[10px]"
          />
        )}
      </Holds>
    </Holds>
  );
}
