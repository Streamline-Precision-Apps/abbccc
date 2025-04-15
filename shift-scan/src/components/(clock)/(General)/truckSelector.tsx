"use client";
import React, { useEffect, useState } from "react";
import NewCodeFinder from "@/components/(search)/newCodeFinder";
import { useDBEquipment } from "@/app/context/dbCodeContext";

type Option = {
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
  const { equipmentResults } = useDBEquipment();
  // Initialize with the passed initialValue
  useEffect(() => {
    const options = equipmentResults
      .filter((equipment) => equipment.equipmentTag === "TRUCK")
      .map((equipment) => ({
        code: equipment.qrId,
        label: equipment.name,
      }));
    setTruckOptions(options);
  }, [equipmentResults]);

  useEffect(() => {
    if (initialValue && truckOptions.length > 0) {
      const foundOption = truckOptions.find(
        (opt) => opt.code === initialValue.code
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
      placeholder="Type here..."
      label="Select a truck"
    />
  );
};

export default TruckSelector;
