"use client";
/**
 * @component CodeFinder
 * @description A search and select component for various data types like cost codes, jobsites, and equipment.
 * Provides search and selection features for different options by datatype, storing and retrieving recent selections.
 *
 * @param {string} datatype - The type of data to search (e.g., 'costcode', 'jobsite', 'equipment')
 * @param {string} [savedCode] - Optional initial code to be preloaded in the search field.
 */

import React, { useState, useEffect, ChangeEvent, useMemo } from "react";
import CustomSelect from "@/components/(search)/customSelect";
import SearchBar from "@/components/(search)/searchbar";
import { useTranslations } from "next-intl";
import { useSavedCostCode } from "@/app/context/CostCodeContext";
import { CostCodeOptions } from "@/components/(search)/options";
import { useScanData } from "@/app/context/JobSiteScanDataContext";
import { useEQScanData } from "@/app/context/equipmentContext";
import {
  useDBJobsite,
  useDBCostcode,
  useDBEquipment,
} from "@/app/context/dbCodeContext";
import {
  useRecentDBJobsite,
  useRecentDBCostcode,
  useRecentDBEquipment,
} from "@/app/context/dbRecentCodesContext";
import { Holds } from "../(reusable)/holds";
import { Grids } from "../(reusable)/grids";

type Option = {
  code: string;
  label: string;
};

type Props = {
  datatype: string;
  savedCode?: string;
};

export default function CodeFinder({ datatype, savedCode }: Props) {
  const [searchTerm, setSearchTerm] = useState(savedCode || "");
  const [filteredOptions, setFilteredOptions] = useState<Option[]>([]);
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);
  const [selectedTerm, setSelectedTerm] = useState(false);
  const t = useTranslations("Clock");

  const { setScanResult } = useScanData();
  const { setCostCode } = useSavedCostCode();
  const { setscanEQResult } = useEQScanData();

  const { jobsiteResults } = useDBJobsite();
  const { addRecentlyUsedJobCode } = useRecentDBJobsite();

  const { costcodeResults } = useDBCostcode();
  const { addRecentlyUsedCostCode } = useRecentDBCostcode();

  const { equipmentResults } = useDBEquipment();
  const { addRecentlyUsedEquipment } = useRecentDBEquipment();

  // Use useMemo to avoid recalculating options unnecessarily
  const options = useMemo(
    () => CostCodeOptions(datatype, searchTerm),
    [datatype, searchTerm]
  );

  // Set default selected option if `storedCode` is found
  useEffect(() => {
    if (savedCode) {
      if (savedCode.toLowerCase().slice(0, 1) === "j") {
        const defaultOption = jobsiteResults.find(
          (opt) => opt.qrId === savedCode
        );
        if (defaultOption) {
          setSelectedOption({
            code: defaultOption.qrId,
            label: defaultOption.name,
          });
          setSearchTerm(defaultOption.name); // Update search term to display label in the search bar
        }
      } else {
        const defaultOption = options.find((opt) => opt.code === savedCode);
        if (defaultOption) {
          setSelectedOption(defaultOption);
          setSearchTerm(defaultOption.label); // Update search term to display label in the search bar
        }
      }
    }
  }, [savedCode, jobsiteResults, options, setSelectedOption, setSearchTerm]);

  useEffect(() => {
    const filtered = options;
    // Avoid state update if the new filtered options are the same as the current state
    if (JSON.stringify(filtered) !== JSON.stringify(filteredOptions)) {
      setFilteredOptions(filtered);
    }
  }, [options, filteredOptions]);

  const handleOptionSelect = (option: Option) => {
    setSelectedOption(option);
    setSelectedTerm(true);

    if (datatype === "costcode") {
      setCostCode(option.code);

      const selectedCode = costcodeResults.find((c) => c.name === option.code);
      if (selectedCode) addRecentlyUsedCostCode(selectedCode);
    }

    if (datatype === "jobsite") {
      setScanResult({ data: option.code });

      const selectedJobCode = jobsiteResults.find(
        (j) => j.qrId === option.code
      );
      if (selectedJobCode) addRecentlyUsedJobCode(selectedJobCode);
    }

    if (datatype === "jobsite-mechanic") {
      setScanResult({ data: option.code });

      const selectedJobCode = jobsiteResults.find(
        (j) => j.qrId === option.code
      );
      if (selectedJobCode) addRecentlyUsedJobCode(selectedJobCode);
    }
    if (datatype === "jobsite-tasco") {
      setScanResult({ data: option.code });

      const selectedJobCode = jobsiteResults.find(
        (j) => j.qrId === option.code
      );
      if (selectedJobCode) addRecentlyUsedJobCode(selectedJobCode);
    }

    if (datatype === "equipment") {
      setscanEQResult({ data: option.code });

      const selectedEquipment = equipmentResults.find(
        (e) => e.qrId === option.code
      );
      if (selectedEquipment) addRecentlyUsedEquipment(selectedEquipment);
    }
    setSearchTerm(option.label); // Set the search term to the selected option label
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const clearSelection = () => {
    setSelectedOption(null);
    setSearchTerm("");
    setSelectedTerm(false);
  };

  return (
    <Holds className="w-full h-full">
      <Grids rows={"5"} gap={"5"}>
        <Holds className="row-span-1 h-full">
          <SearchBar
            selected={selectedTerm}
            placeholder={t(`search-${datatype}`)}
            searchTerm={searchTerm}
            onSearchChange={handleSearchChange}
            setSearchTerm={setSearchTerm}
            setSelectedTerm={setSelectedTerm}
            clearSelection={clearSelection}
          />
        </Holds>

        <Holds className="row-span-4 h-full border-[3px] border-black rounded-[10px] ">
          <CustomSelect
            options={filteredOptions}
            onOptionSelect={handleOptionSelect}
            selectedOption={selectedOption}
            clearSelection={clearSelection}
          />
        </Holds>
      </Grids>
    </Holds>
  );
}
