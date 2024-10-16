'use client';
import React, { ChangeEvent } from 'react';
import { Images } from '../(reusable)/images';
import { Holds } from '../(reusable)/holds';

// defines the searchbar type for typescript
type SearchBarProps = {
  searchTerm: string;
  onSearchChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
}

// defines the searchbar component and what the input should look like
export default function SearchBar({ searchTerm, onSearchChange, placeholder }: SearchBarProps) {
  return (
    <Holds position={"row"} className='p-3 rounded-[10px] h-full'>
      <Holds size={"10"} >
        <Images titleImg="/magnifyingGlass.svg" titleImgAlt="search"
        size={"full"}/>
      </Holds>
      <Holds size={"90"} className='h-full rounded-[10px] pl-3'>
        <input 
        type="text"
        value={searchTerm}
        onChange={onSearchChange}
        placeholder={placeholder}
        className="w-full h-full placeholder-gray-500 placeholder:text-xl focus:outline-none rounded-[10px]" 
        />
      </Holds>
    </Holds>
  );
};
