"use client";
import React, { useEffect, useState } from "react";
import { useCostCode } from "@/app/context/dbCodeContext";
import NewCodeFinder from "@/components/(search)/newCodeFinder";
import { useTranslations } from "next-intl";

type Option = {
  id: string;
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
  const [selectedCostCodeOption, setSelectedCostCodeOption] = useState<Option | null>(null);
  const [costCodeOptions, setCostCodeOptions] = useState<Option[]>([]);
  // The new hook only provides selectedCostCode, not a list
  const { selectedCostCode } = useCostCode();
  const t = useTranslations("Clock");
  useEffect(() => {
    // TODO: Implement proper cost code data fetching
    setCostCodeOptions([]);
  }, []);

  // Initialize with the passed initialValue
  useEffect(() => {
    if (initialValue && costCodeOptions.length > 0) {
      const foundOption = costCodeOptions.find(
        (opt) => opt.code === initialValue.code
      );
      if (foundOption) {
        setSelectedCostCodeOption(foundOption);
      }
    }
  }, [initialValue, costCodeOptions]);

  // Handle selection changes and notify parent
  const handleSelect = (option: Option | null) => {
    setSelectedCostCodeOption(option);
    onCostCodeSelect(option); // Pass just the code to parent
  };

  return (
    <NewCodeFinder
      options={costCodeOptions}
      selectedOption={selectedCostCodeOption}
      onSelect={handleSelect}
      placeholder={t("SearchBarPlaceholder")}
      label="Select Cost Code"
    />
  );
};
