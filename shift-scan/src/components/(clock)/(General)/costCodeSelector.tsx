"use client";
import React, { useEffect, useState } from "react";
import { useDBCostcode } from "@/app/context/dbCodeContext";
import NewCodeFinder from "@/components/(search)/newCodeFinder";

type Option = {
  code: string;
  label: string;
};

type CostCodeSelectorProps = {
  onCostCodeSelect: (equipment: Option | null) => void;
  initialValue?: Option; // Optional initial value
};

export const CostCodeSelector = ({
  onCostCodeSelect,
  initialValue,
}: CostCodeSelectorProps) => {
  const [selectedCostCode, setSelectedCostCode] = useState<Option | null>(null);
  const [costCodeOptions, setCostCodeOptions] = useState<Option[]>([]);
  const { costcodeResults } = useDBCostcode();

  useEffect(() => {
    const options = costcodeResults.map((costcode) => ({
      code: costcode.name,
      label: costcode.name,
    }));
    setCostCodeOptions(options);
  }, [costcodeResults]);

  // Initialize with the passed initialValue
  useEffect(() => {
    if (initialValue && costCodeOptions.length > 0) {
      const foundOption = costCodeOptions.find(
        (opt) => opt.code === initialValue.code
      );
      if (foundOption) {
        setSelectedCostCode(foundOption);
      }
    }
  }, [initialValue, costCodeOptions]);

  // Handle selection changes and notify parent
  const handleSelect = (option: Option | null) => {
    setSelectedCostCode(option);
    onCostCodeSelect(option); // Pass just the code to parent
  };

  return (
    <NewCodeFinder
      options={costCodeOptions}
      selectedOption={selectedCostCode}
      onSelect={handleSelect}
      placeholder="Search Cost Code..."
      label="Select Cost Code"
    />
  );
};
