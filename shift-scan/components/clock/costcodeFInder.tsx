'use client';
import React, { useState, useEffect, ChangeEvent } from 'react';
import CustomSelect from '../clock/customSelect';
import SearchBar from '../clock/searchbar';
import { useRouter } from 'next/navigation';

interface Option {
  value: string;
  label: string;
}

const CostCodeFinder: React.FC = () => {
  const options: Option[] = [
    { value: 'earthwork', label: 'Earthwork' },
    { value: 'foundation', label: 'Foundation' },
    { value: 'concrete', label: 'Concrete' },
    { value: 'masonry', label: 'Masonry' },
    { value: 'structural_steel', label: 'Structural Steel' },
    { value: 'carpentry', label: 'Carpentry' },
    { value: 'roofing', label: 'Roofing' },
    { value: 'windows_doors', label: 'Windows and Doors' },
    { value: 'drywall', label: 'Drywall' },
    { value: 'flooring', label: 'Flooring' },
    { value: 'painting', label: 'Painting' },
    { value: 'plumbing', label: 'Plumbing' },
    { value: 'hvac', label: 'HVAC' },
    { value: 'electrical', label: 'Electrical' },
    { value: 'landscaping', label: 'Landscaping' },
    { value: 'site_utilities', label: 'Site Utilities' },
    { value: 'fire_protection', label: 'Fire Protection' },
    { value: 'elevator', label: 'Elevator' },
    { value: 'security', label: 'Security' },
    { value: 'finishes', label: 'Finishes' },
  ];

  const [searchTerm, setSearchTerm] = useState('');
  const [filteredOptions, setFilteredOptions] = useState<Option[]>([]);
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setFilteredOptions(
      options.filter(option =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm]);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleOptionSelect = (option: Option) => {
    setSelectedOption(option);
    setIsDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleSubmit = () => {
    if (selectedOption) {
      router.push(`/clock/verify`);
    } else {
      alert('Please select a cost code');
    }
  };

  return (
    <div>
      <h1>Select a Cost Code:</h1>
      <SearchBar searchTerm={searchTerm} onSearchChange={handleSearchChange} />
      <CustomSelect
        options={filteredOptions}
        placeholder="Pick a Cost Code..."
        onOptionSelect={handleOptionSelect}
        isDropdownOpen={isDropdownOpen}
        toggleDropdown={toggleDropdown}
        selectedOption={selectedOption}
      />
      <button onClick={handleSubmit}>Submit</button>
      <style jsx>{`
        button {
          margin-top: 20px;
          padding: 10px 20px;
          font-size: 16px;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default CostCodeFinder;