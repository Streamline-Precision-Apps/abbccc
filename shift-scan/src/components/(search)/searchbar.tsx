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
    <div className="flex border-2 border-black rounded w-5/6 flex-row p-2 w-full">
    <Images titleImg="/search.svg" titleImgAlt="search" variant={"icon"} size={"icon"}/>
    <input 
      type="text"
      value={searchTerm}
      onChange={onSearchChange}
      placeholder={placeholder}
      className="w-full" 
    />
    </div>
  );
};
