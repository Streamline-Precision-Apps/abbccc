'use client';
import React, { ChangeEvent } from 'react';
import { Images } from '../(reusable)/images';

// defines the searchbar type for typescript
interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
}

// defines the searchbar component and what the input should look like
const SearchBar: React.FC<SearchBarProps> = ({ searchTerm, onSearchChange, placeholder }) => {
  return (
    <div className="flex border-2 border-black rounded w-5/6 flex-row p-2">
    <Images titleImg="/search.svg" titleImgAlt="search" variant={"icon"} size={"lg"}/>
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

export default SearchBar;