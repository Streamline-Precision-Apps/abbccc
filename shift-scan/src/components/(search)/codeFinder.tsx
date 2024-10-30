"use client";
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

type Option = {
  code: string;
  label: string;
};

type Props = {
  datatype: string;
};

export default function CodeFinder({ datatype }: Props) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOptions, setFilteredOptions] = useState<Option[]>([]);
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);
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

  useEffect(() => {
    const filtered = options;
    // Avoid state update if the new filtered options are the same as the current state
    if (JSON.stringify(filtered) !== JSON.stringify(filteredOptions)) {
      setFilteredOptions(filtered);
    }
  }, [options, filteredOptions]);

  const handleOptionSelect = (option: Option) => {
    setSelectedOption(option);

    if (datatype === "costcode") {
      localStorage.setItem("costCode", option.code);
      setCostCode(option.code);

      const selectedCode = costcodeResults.find((c) => c.name === option.code);
      if (selectedCode) addRecentlyUsedCostCode(selectedCode);
    }

    if (datatype === "jobsite") {
      localStorage.setItem("jobSite", option.code);
      setScanResult({ data: option.code });

      const selectedJobCode = jobsiteResults.find(
        (j) => j.qrId === option.code
      );
      if (selectedJobCode) addRecentlyUsedJobCode(selectedJobCode);
    }

    if (datatype === "equipment") {
      setscanEQResult({ data: option.code });
      localStorage.setItem("previousEquipment", option.code);

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

  return (
    <div>
      <SearchBar
        selected={false}
        placeholder={t(`search-${datatype}`)}
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
      />
      <CustomSelect
        options={filteredOptions}
        onOptionSelect={handleOptionSelect}
        selectedOption={selectedOption}
      />
    </div>
  );
}
