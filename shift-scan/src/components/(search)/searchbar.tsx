'use client';
import React, { ChangeEvent } from 'react';
import { Images } from '../(reusable)/images';
import { Inputs } from '../(reusable)/inputs';
import { Contents } from '../(reusable)/contents';

// defines the searchbar type for typescript
interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
}

// defines the searchbar component and what the input should look like
const SearchBar: React.FC<SearchBarProps> = ({ searchTerm, onSearchChange, placeholder }) => {
  return (
    <Contents size={"listTitle"} variant={"widgetButtonRow"}>
    <Images titleImg="/search.svg" titleImgAlt="search" variant={"icon"} size={"logo"}/>
    <Inputs 
      type="text"
      value={searchTerm}
      onChange={onSearchChange}
      placeholder={placeholder}
    />
    </Contents>
  );
};

export default SearchBar;