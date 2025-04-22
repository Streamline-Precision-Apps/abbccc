"use client";
import React, { useState, ChangeEvent } from "react";
import CustomSelect from "@/components/(search)/customSelect";
import SearchBar from "@/components/(search)/searchbar";
import { useTranslations } from "next-intl";
import { useSavedCostCode } from "@/app/context/CostCodeContext";
import { useCostCodeOptions } from "@/components/(search)/useCostCodeOptions"; // Updated import
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
import { useOperator } from "@/app/context/operatorContext";
// import { intialEquipment } from "@/data/dataValues";

type Option = {
  code: string;
  label: string;
};

type Props = {
  datatype: string;
  setSelectedOpt: React.Dispatch<React.SetStateAction<boolean>>;
  setScannedId?: React.Dispatch<React.SetStateAction<string | null>>;
  initialValue?: Option | null; // Add this prop
  initialSearchTerm?: string; // Add this prop
};

export default function CodeFinder({
  datatype,
  setSelectedOpt,
  setScannedId,
  initialValue = null,
  initialSearchTerm = "",
}: Props) {
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [selectTerm, setSelectTerm] = useState(initialSearchTerm);
  const [selectedOption, setSelectedOption] = useState<Option | null>(
    initialValue
  );
  const [selectedTerm, setSelectedTerm] = useState(!!initialValue);
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

  const { setEquipmentId } = useOperator();

  // Call the custom hook at the top level (it uses its own useMemo internally)
  const options = useCostCodeOptions(datatype, searchTerm);

  const handleOptionSelect = (option: Option) => {
    setSelectedOption(option);
    setSelectedTerm(true);
    setSelectedOpt(true);

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

    if (
      datatype === "jobsite-mechanic" ||
      datatype === "jobsite-tasco" ||
      datatype === "jobsite-truck"
    ) {
      setScanResult({ data: option.code });
      const selectedJobCode = jobsiteResults.find(
        (j) => j.qrId === option.code
      );
      if (selectedJobCode) addRecentlyUsedJobCode(selectedJobCode);
    }

    if (datatype === "equipment-operator") {
      setEquipmentId(option.code);
      console.log(option.code);
    }

    if (datatype === "equipment") {
      if (setScannedId) {
        setScannedId(option.code);
      } else {
        setscanEQResult({ data: option.code });
      }
      const selectedEquipment = equipmentResults.find(
        (e) => e.qrId === option.code
      );
      if (selectedEquipment) addRecentlyUsedEquipment(selectedEquipment);
    }

    setSelectTerm(option.label);
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const clearSelection = () => {
    setSelectedOption(null);
    setSearchTerm("");
    setSelectTerm("");
    setSelectedTerm(false);
  };

  return (
    <Grids rows={"5"} gap={"5"} className="h-full w-full">
      <Holds className="row-span-1 h-full">
        <SearchBar
          selected={selectedTerm}
          placeholder={t(`search-${datatype}`)}
          searchTerm={searchTerm}
          selectTerm={selectTerm}
          onSearchChange={handleSearchChange}
          setSearchTerm={setSearchTerm}
          setSelectedTerm={setSelectedTerm}
          clearSelection={clearSelection}
        />
      </Holds>
      <Holds className="row-span-4 h-full border-[3px] border-black rounded-[10px] overflow-y-auto no-scrollbar">
        <CustomSelect
          options={options}
          onOptionSelect={handleOptionSelect}
          selectedOption={selectedOption}
          clearSelection={clearSelection}
        />
      </Holds>
    </Grids>
  );
}
