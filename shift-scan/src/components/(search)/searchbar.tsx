"use client";
import React, { ChangeEvent } from "react";
import { Images } from "../(reusable)/images";
import { Holds } from "../(reusable)/holds";
import { Buttons } from "../(reusable)/buttons";

// defines the searchbar type for typescript
type SearchBarProps = {
  searchTerm: string;
  onSearchChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  selected: boolean;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  setSelectedTerm: React.Dispatch<React.SetStateAction<boolean>>;
};

// defines the searchbar component and what the input should look like
export default function SearchBar({
  searchTerm,
  onSearchChange,
  placeholder,
  selected,
  setSearchTerm,
  setSelectedTerm,
}: SearchBarProps) {
  return (
    <Holds position={"row"} className="p-3 rounded-[10px] h-full">
      <Holds size={"10"}>
        <Images
          titleImg="/magnifyingGlass.svg"
          titleImgAlt="search"
          size={"full"}
        />
      </Holds>
      <Holds size={"90"} className="h-full rounded-[10px] pl-3">
        {selected ? (
          <Holds position={"row"} className="h-full w-full space-x-2">
            <input
              type="text"
              value={searchTerm}
              onChange={onSearchChange}
              className="w-full h-full bg-app-blue text-center text-bold border-2 border-black rounded-[10px] "
            />
            <Buttons
              background={"red"}
              size={"full"}
              onClick={() => {
                setSearchTerm("");
                setSelectedTerm(false);
              }}
              className="w-[50px] h-full  justify-center items-center rounded-[10px]"
            >
              X
            </Buttons>
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
