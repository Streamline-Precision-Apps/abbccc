"use client";
import React, { useEffect, useState } from "react";
import NewCodeFinder from "@/components/(search)/newCodeFinder";
import { useEquipment } from "@/app/context/dbCodeContext";
import { useTranslations } from "next-intl";

type Option = {
  id: string; // ID is now required
  code: string;
  label: string;
};

type TruckSelectorProps = {
  onTruckSelect: (truck: Option | null) => void;
  initialValue?: Option; // Optional initial value
};

const TruckSelector = ({ onTruckSelect, initialValue }: TruckSelectorProps) => {
  const [selectedTruck, setSelectedTruck] = useState<Option | null>(null);
  const [truckOptions, setTruckOptions] = useState<Option[]>([]);
  // The new hook only provides selectedEquipment, not a list
  const { selectedEquipment } = useEquipment();
  const t = useTranslations("Clock");
  // Initialize with the passed initialValue
  useEffect(() => {
    // TODO: Implement proper equipment data fetching for trucks
    setTruckOptions([]);
  }, []);

  useEffect(() => {
    if (initialValue && truckOptions.length > 0) {
      const foundOption = truckOptions.find(
        (opt) => opt.code === initialValue.code,
      );
      if (foundOption) {
        setSelectedTruck(foundOption);
      }
    }
  }, [initialValue, truckOptions]);

  // Handle selection changes and notify parent
  const handleSelect = (option: Option | null) => {
    setSelectedTruck(option);
    onTruckSelect(option); // Pass just the code to parent
  };

  return (
    <NewCodeFinder
      options={truckOptions}
      selectedOption={selectedTruck}
      onSelect={handleSelect}
      placeholder={t("SearchBarPlaceholder")}
      label="Select a truck"
    />
  );
};

export default TruckSelector;
