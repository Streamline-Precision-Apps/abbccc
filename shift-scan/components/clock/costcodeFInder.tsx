'use client';
import React, { useState, useEffect, ChangeEvent } from 'react';
import CustomSelect from './customSelect';
import SearchBar from './searchbar';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useSavedCostCode } from '../context/SavedCostCode';
import { setAuthStep } from '@/app/api/auth';

// define what the option values are
interface Option {
  value: string;
  label: string;
}

// define the seclected object/ costcodes here / eventually put in a db that will filter donw by scanned data
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
  // included 4 different states for the dropdown
  // search term allows the user to search for a costcode through text
  const [searchTerm, setSearchTerm] = useState('');
  // filtered options allows the user to filter through the costcodes via a text filter
  // you can type some code an then click the option to select it
  const [filteredOptions, setFilteredOptions] = useState<Option[]>([]);
  // makes a selection of a costcode
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);
  // opens and closes the dropdown menu to provide a condense list verse a long one on the app

  // this function allows us to move pages after confirming the cost code we want.
  const router = useRouter();
  // included the useTranslation hook for i18n
  const t = useTranslations('page4');

  const { setCostCode } = useSavedCostCode();
  
  // react hook to filter through the costcodes making them all lowercase to not have case issues
  useEffect(() => {
    setFilteredOptions(
      options.filter(option =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm]); // will reload when searchTerm changes

  // a function to hanle the changes in the searchterm state
  // allows a user to search for a costcode and or filter through the costcodes
  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }; 

  // a function to handle the selection of a costcode
  // add the setCostcode to save a context of its value. 
  const handleOptionSelect = (option: Option) => {
    setSelectedOption(option);
    setCostCode(option.value);
    setAuthStep("verify");
  };

  // a function to toggle the dropdown

  // a function to submit the costcode to the next page
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
      <SearchBar searchTerm={searchTerm} onSearchChange={handleSearchChange}  />
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