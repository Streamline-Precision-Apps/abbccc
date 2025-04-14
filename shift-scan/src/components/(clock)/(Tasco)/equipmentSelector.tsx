"use client";
import React, { useEffect, useState } from "react";
import NewCodeFinder from "../../(search)/newCodeFinder";

type Option = {
  code: string;
  label: string;
};

type EquipmentSelectorProps = {
  onEquipmentSelect: (equipment: Option | null) => void;
  initialValue?: Option; // Optional initial value
};

export const EquipmentSelector = ({
  onEquipmentSelect,
  initialValue,
}: EquipmentSelectorProps) => {
  const [selectedEquipment, setSelectedEquipment] = useState<Option | null>(
    null
  );
  const [equipmentOptions, setEquipmentOptions] = useState<Option[]>([]);

  // Initialize with the passed initialValue
  useEffect(() => {
    if (initialValue && equipmentOptions.length > 0) {
      const foundOption = equipmentOptions.find(
        (opt) => opt.code === initialValue.code
      );
      if (foundOption) {
        setSelectedEquipment(foundOption);
      }
    }
  }, [initialValue, equipmentOptions]);

  useEffect(() => {
    const fetchTruckData = async () => {
      try {
        const res = await fetch("/api/getEquipmentList");
        const data = await res.json();

        if (Array.isArray(data)) {
          const options = data.map((item) => ({
            code: item.qrId,
            label: item.name,
          }));
          setEquipmentOptions(options);
        }
      } catch (error) {
        console.error("Error fetching truck data:", error);
      }
    };

    fetchTruckData();
  }, []);

  // Handle selection changes and notify parent
  const handleSelect = (option: Option | null) => {
    setSelectedEquipment(option);
    onEquipmentSelect(option); // Pass just the code to parent
  };

  return (
    <NewCodeFinder
      options={equipmentOptions}
      selectedOption={selectedEquipment}
      onSelect={handleSelect}
      placeholder="Search equipment..."
      label="Select an equipment"
    />
  );
};
