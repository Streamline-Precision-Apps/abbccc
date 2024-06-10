'use client';
import React, { ChangeEvent } from 'react';

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchTerm, onSearchChange }) => {
  return (
    <input
      type="text"
      value={searchTerm}
      onChange={onSearchChange}
      placeholder="Search..."
      className="custom-select-search"
    />
  );
};

export default SearchBar;