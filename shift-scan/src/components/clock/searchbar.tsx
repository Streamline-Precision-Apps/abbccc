'use client';
import React, { ChangeEvent } from 'react';
import { useTranslations } from 'next-intl';

// defines the searchbar type for typescript
interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

// defines the searchbar component and what the input should look like
const SearchBar: React.FC<SearchBarProps> = ({ searchTerm, onSearchChange }) => {
  const t = useTranslations('page4');
  return (
    <input 
      type="text"
      value={searchTerm}
      onChange={onSearchChange}
      placeholder={t('lN1')}
      className="border-2 border-black p-2 w-1/4 m-4" 
    />
  );
};

export default SearchBar;