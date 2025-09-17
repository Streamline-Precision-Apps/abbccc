"use client";
import React, { useEffect, useState } from "react";
import NewCodeFinder from "@/components/(search)/newCodeFinder";
import { useEquipment } from "@/app/context/dbCodeContext";
import { useTranslations } from "next-intl";

type Option = {
  id: string; // Optional ID for compatibility
  code: string;
  label: string;
};

type EquipmentSelectorProps = {
  onEquipmentSelect: (equipment: Option | null) => void;
  initialValue?: Option; // Optional initial value
  useEquipmentId?: boolean;
};

export const EquipmentSelector = ({
  onEquipmentSelect,
  initialValue,
  useEquipmentId = false,
}: EquipmentSelectorProps) => {
  const [selectedEquipment, setSelectedEquipment] = useState<Option | null>(
    null,
  );
  const [equipmentOptions, setEquipmentOptions] = useState<Option[]>([]);
  const t = useTranslations("Clock");
  // The new hook only provides selectedEquipment, not a list
  const { selectedEquipment: selectedEquipmentFromHook } = useEquipment();

  useEffect(() => {
    // TODO: Implement proper equipment data fetching
    setEquipmentOptions([]);
  }, []);

  // Initialize with the passed initialValue, but avoid infinite loops
  useEffect(() => {
    if (initialValue && equipmentOptions.length > 0) {
      const foundOption = equipmentOptions.find(
        (opt) => opt.code === initialValue.code,
      );
      // Only update if different
      if (
        foundOption &&
        (!selectedEquipment || foundOption.code !== selectedEquipment.code)
      ) {
        setSelectedEquipment(foundOption);
      }
    }
  }, [initialValue, equipmentOptions]);

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
      placeholder={t("SearchBarPlaceholder")}
      label="Select an equipment"
    />
  );
};
