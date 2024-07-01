'use client';
import React, { useState, useEffect, ChangeEvent } from 'react';
import CustomSelect from '@/app/(routes)/clock/costcode/customSelect';
import SearchBar from '@/components/searchbar';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useSavedCostCode } from '@/app/context/CostCodeContext';
import { setAuthStep } from '@/app/api/auth';

// Option interface
interface Option {
  value: string;
  label: string;
}

// Static options array
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

const CostCodeFinder: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredOptions, setFilteredOptions] = useState<Option[]>([]);
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);
  const router = useRouter();
  const t = useTranslations('page4');
  const { setCostCode } = useSavedCostCode();

  // Filter options based on search term
  useEffect(() => {
    setFilteredOptions(
      options.filter(option =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm]);

  // Handle search input change
  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Handle option selection
  const handleOptionSelect = (option: Option) => {
    setSelectedOption(option);
    setCostCode(option.value);
    setAuthStep("verify");
  };

  // Handle form submission
  const handleSubmit = () => {
    if (selectedOption) {
      router.push("/clock/verify");
    } else {
      console.log('No option selected, please select a cost code');
    }
  };

  return (
    <div className="flex flex-col items-center">
      <h1>{t('title')}</h1>
      <SearchBar searchTerm={searchTerm} onSearchChange={handleSearchChange} />
      <CustomSelect
        options={filteredOptions}
        placeholder={t('lN2')}
        onOptionSelect={handleOptionSelect}
        selectedOption={selectedOption}
      />
      <button className="bg-orange-500 text-black font-bold text-4xl p-2 rounded" onClick={handleSubmit}>{t('submit')}</button>
    </div>
  );
};

export default CostCodeFinder;
