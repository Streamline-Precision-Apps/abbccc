'use client';
import React, { useState, useEffect, ChangeEvent } from 'react';
import CustomSelect from '@/components/(search)/customSelect';
import SearchBar from '@/components/(search)/searchbar';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useSavedCostCode } from '@/app/context/CostCodeContext';
import { setAuthStep } from '@/app/api/auth';
import {CostCodeOptions} from '@/components/(search)/options';
import { useScanData } from '@/app/context/JobSiteContext';
import { useEQScanData } from '@/app/context/equipmentContext';
// Option interface
    interface Option {
        code: string;
        label: string;
        }
        
        type props = {
        datatype: string
        
    }
    // Static options array
    export default function CodeFinder({datatype} : props) {
    
        const [searchTerm, setSearchTerm] = useState('');
        const [filteredOptions, setFilteredOptions] = useState<Option[]>([]);
        const [selectedOption, setSelectedOption] = useState<Option | null>(null);
        const router = useRouter();
        const t = useTranslations('clock');
        const { setScanResult } = useScanData();
        const { setscanEQResult} = useEQScanData();
        const { setCostCode } = useSavedCostCode();
        const options = CostCodeOptions(datatype);
        // Filter options based on search term
        useEffect(() => {
        setFilteredOptions(
            options
            .flat() // Flatten the nested array
            .filter((option) =>
                option.label.toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
        }, [searchTerm]);
    
        // Handle option selection
        const handleOptionSelect = (option: Option) => {
        setSelectedOption(option);
        if (datatype === 'costcode') {
            setCostCode(option.code);
        }
        if (datatype === 'jobsite') {
            if (localStorage.getItem('jobSite')) {
                localStorage.removeItem('jobSite');
            }
            setScanResult({ data: option.code });
            localStorage.setItem('jobSite', option.code);
        }
        if (datatype === 'equipment') {
            setscanEQResult({ data: option.code });
            const jobSite = localStorage.getItem('jobSite');
            const value = jobSite ? jobSite : '';
            setScanResult({ data: value});
        }

        setSearchTerm(option.label);
        };
        //  Handle search input change
        const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        };

        // Handle form submission
    
        return (
        <div className="flex flex-col items-center w-1/2 m-auto">
            <h1>{t(`title-${datatype}-bar`)}</h1>
            <SearchBar searchTerm={searchTerm} onSearchChange={handleSearchChange} />

            <CustomSelect options={filteredOptions} 
            placeholder={t('placeholder')} onOptionSelect={handleOptionSelect} 
            selectedOption={selectedOption} />
        </div>
        );
    };
