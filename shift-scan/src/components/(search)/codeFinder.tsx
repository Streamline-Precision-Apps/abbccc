"use client";
import React, { useState, useEffect, ChangeEvent } from 'react';
import CustomSelect from '@/components/(search)/customSelect';
import SearchBar from '@/components/(search)/searchbar';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useSavedCostCode } from '@/app/context/CostCodeContext';
import { CostCodeOptions } from '@/components/(search)/options';
import { useScanData } from '@/app/context/JobSiteContext';
import { useEQScanData } from '@/app/context/equipmentContext';

interface Option {
    code: string;
    label: string;
}

type Props = {
    datatype: string;
}

export default function CodeFinder({ datatype } : Props) {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredOptions, setFilteredOptions] = useState<Option[]>([]);
    const [selectedOption, setSelectedOption] = useState<Option | null>(null);
    const router = useRouter();
    const t = useTranslations('clock');
    const { setScanResult } = useScanData();
    const { setCostCode } = useSavedCostCode();
    const { setscanEQResult } = useEQScanData();
    const options = CostCodeOptions(datatype);

    useEffect(() => {
        setFilteredOptions(
            options.filter((option) =>
                option.label.toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
    }, [searchTerm, options]);

    const handleOptionSelect = (option: Option) => {
        setSelectedOption(option);
        if (datatype === 'costcode') {
            localStorage.setItem("costCode", option.code);
            setCostCode(option.code);
        }
        if (datatype === 'jobsite') {
            localStorage.setItem("jobSite", option.code);
            setScanResult({ data: option.code });
        }
        if (datatype === 'equipment') {
            setscanEQResult({ data: option.code });
            localStorage.setItem("previousEquipment", option.code);
        }
        setSearchTerm(option.label);
    };

    const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    return (
        <div className="flex flex-col items-center w-1/2 m-auto">
            <h1>{t(`title-${datatype}-bar`)}</h1>
            <SearchBar searchTerm={searchTerm} onSearchChange={handleSearchChange} />
            <CustomSelect options={filteredOptions} 
                placeholder={t('placeholder')} 
                onOptionSelect={handleOptionSelect} 
                selectedOption={selectedOption} />
        </div>
    );
}