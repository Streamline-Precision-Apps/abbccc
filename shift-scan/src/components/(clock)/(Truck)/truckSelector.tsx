"use client";
import React, { useEffect, useState } from "react";
import NewCodeFinder from "../../(search)/newCodeFinder";

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

  // Initialize with the passed initialValue
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

  useEffect(() => {
    const fetchEquipmentListData = async () => {
      try {
        const res = await fetch("/api/getTruckData");
        const data = await res.json();

        if (Array.isArray(data)) {
          const options = data.map((item) => ({
            code: item.qrId,
            label: item.name,
          }));
          setTruckOptions(options);
        }
      } catch (error) {
        console.error("Error fetching truck data:", error);
      }
    };

    fetchEquipmentListData();
  }, []);

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
      placeholder="Search trucks..."
      label="Select a truck"
    />
  );
};

export default TruckSelector;
