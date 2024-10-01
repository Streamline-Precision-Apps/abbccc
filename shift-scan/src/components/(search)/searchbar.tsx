'use client';
import React, { ChangeEvent } from 'react';
import { Images } from '../(reusable)/images';

// defines the searchbar type for typescript
type SearchBarProps = {
  searchTerm: string;
  onSearchChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
}

// defines the searchbar component and what the input should look like
export default function SearchBar({ searchTerm, onSearchChange, placeholder }: SearchBarProps) {
  return (
    <div className="flex border-2 border-black rounded w-full flex-row p-2 w-full">
    <Images titleImg="/magnifyingGlass.svg" titleImgAlt="search" size={"10"} />
    <input 
      type="text"
      value={searchTerm}
      onChange={onSearchChange}
      placeholder={placeholder}
      className="w-full ml-2 p-2 placeholder-gray-500 border-none focus:outline-none" 
    />
    </div>
  );
};
