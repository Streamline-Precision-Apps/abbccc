"use client";
import React, { useEffect, useState } from "react";
import NewCodeFinder from "@/components/(search)/newCodeFinder";
import { useDBEquipment } from "@/app/context/dbCodeContext";
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
    null
  );
  const [equipmentOptions, setEquipmentOptions] = useState<Option[]>([]);
  const t = useTranslations("Clock");
  const { equipmentResults } = useDBEquipment();

  useEffect(() => {
    const options = equipmentResults.map((equipment) => ({
      id: equipment.id,
      code: equipment.qrId,
      label: equipment.name,
    }));
    setEquipmentOptions(options);
  }, [equipmentResults]);

  // Initialize with the passed initialValue
  useEffect(() => {
    if (initialValue) {
      // If options are available, find the matching one
      if (equipmentOptions.length > 0) {
        const foundOption = equipmentOptions.find(
          (opt) => opt.code === initialValue.code
        );
        setSelectedEquipment(foundOption || null);
        onEquipmentSelect(foundOption || null); // Keep parent in sync
      }
      // If options aren't loaded yet, set the initial value directly
      else if (initialValue.code && initialValue.label) {
        setSelectedEquipment(initialValue);
        onEquipmentSelect(initialValue); // Keep parent in sync
      }
    }
  }, [initialValue, equipmentOptions]);

  console.log("Selected Equipment:", selectedEquipment);

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
