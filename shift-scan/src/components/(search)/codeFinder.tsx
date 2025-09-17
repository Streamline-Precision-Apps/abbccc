"use client";
import React, { useState, ChangeEvent } from "react";
import CustomSelect from "@/components/(search)/customSelect";
import SearchBar from "@/components/(search)/searchbar";
import { useTranslations } from "next-intl";
import { useSavedCostCode } from "@/app/context/CostCodeContext";
import { useCostCodeOptions } from "@/components/(search)/useCostCodeOptions"; // Updated import
import { useScanData } from "@/app/context/JobSiteScanDataContext";
import { useEQScanData } from "@/app/context/equipmentContext";
// Deprecated DB hooks removed; options come from useCostCodeOptions
// import {
//   useRecentDBJobsite,
//   useRecentDBCostcode,
//   useRecentDBEquipment,
// } from "@/app/context/dbRecentCodesContext";
import { Holds } from "../(reusable)/holds";
import { Grids } from "../(reusable)/grids";
import { useOperator } from "@/app/context/operatorContext";
import { Titles } from "../(reusable)/titles";
import {
  setJobSite,
  setCostCode as setCostCodeCookie,
  setEquipment,
  setTruck,
} from "@/actions/cookieActions";

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
    initialValue,
  );
  const [selectedTerm, setSelectedTerm] = useState(!!initialValue);
  const t = useTranslations("Clock");

  const { setScanResult } = useScanData();
  const { setCostCode } = useSavedCostCode();
  const { setscanEQResult } = useEQScanData();

  // Deprecated results removed; using useCostCodeOptions

  const { setEquipmentId } = useOperator();

  // Call the custom hook at the top level (it uses its own useMemo internally)
  const options = useCostCodeOptions(datatype, searchTerm);

  const handleOptionSelect = (option: Option) => {
    setSelectedOption(option);
    setSelectedTerm(true);
    setSelectedOpt(true);

    if (datatype === "costcode") {
      setCostCode(option.code);
  // Optionally resolve details via API if needed
      // if (selectedCode) addRecentlyUsedCostCode(selectedCode);
    }

    if (datatype === "jobsite") {
      setScanResult({
        qrCode: option.code,
        name: option.label, // You might want to provide a default name or get it from somewhere
      });
      // Optionally resolve details via API if needed
      // if (selectedJobCode) addRecentlyUsedJobCode(selectedJobCode);
    }

    if (
      datatype === "jobsite-mechanic" ||
      datatype === "jobsite-tasco" ||
      datatype === "jobsite-truck"
    ) {
      setScanResult({
        qrCode: option.code,
        name: option.label, // You might want to provide a default name or get it from somewhere
      });
      // Optionally resolve details via API if needed
      // if (selectedJobCode) addRecentlyUsedJobCode(selectedJobCode);
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
      // Optionally resolve details via API if needed
      // if (selectedEquipment) addRecentlyUsedEquipment(selectedEquipment);
    }

    setSelectTerm(option.label);
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const clearSelection = async () => {
    setSelectedOption(null);
    setSearchTerm("");
    setSelectTerm("");
    setSelectedTerm(false);
    setSelectedOpt(false);
    if (datatype === "equipment") {
      await setEquipment("");
    }
    if (datatype === "jobsite") {
      await setJobSite({ code: "", label: "" });
    }
    if (datatype === "costcode") {
      await setCostCodeCookie("");
    }
    if (
      datatype === "jobsite-mechanic" ||
      datatype === "jobsite-tasco" ||
      datatype === "jobsite-truck"
    ) {
      await setTruck("");
      await setEquipment("");
    }
  };

  return (
    <Grids rows={"8"} className="h-full w-full">
      <Holds className="row-span-1 h-full">
        {selectedOption ? (
          <Holds
            background={"green"}
            className="h-full w-full border-[3px] border-b-none border-black rounded-b-none justify-center items-center"
            onClick={clearSelection}
          >
            <Titles size={"h4"} className="text-center text-black">
              {selectTerm.length > 21
                ? selectTerm.slice(0, 21) + "..."
                : selectTerm}
            </Titles>
          </Holds>
        ) : (
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
        )}
      </Holds>
      <Holds
        background={"darkBlue"}
        className="row-span-7 h-full border-[3px]  border-black rounded-[10px] rounded-t-none overflow-y-auto no-scrollbar"
      >
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
