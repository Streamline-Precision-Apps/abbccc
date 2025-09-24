"use client";
import React, { useEffect, useState } from "react";
import { useCostCode } from "@/app/context/dbCodeContext";
import NewCodeFinder from "@/components/(search)/newCodeFinder";
import { useTranslations } from "next-intl";
import { fetchWithOfflineCache } from "@/utils/offlineApi";

type Option = {
  id: string;
  code: string;
  label: string;
};

// Type for the API response
type CostCodeResult = {
  id: string;
  name: string;
  code: string;
  isActive: boolean;
};

type CostCodeSelectorProps = {
  onCostCodeSelect: (equipment: Option | null) => void;
  initialValue?: Option; // Optional initial value
};

export const CostCodeSelector = ({
  onCostCodeSelect,
  initialValue,
}: CostCodeSelectorProps) => {
  const [selectedCostCodeOption, setSelectedCostCodeOption] =
    useState<Option | null>(null);
  const [costCodeOptions, setCostCodeOptions] = useState<Option[]>([]);
  // The new hook only provides selectedCostCode, not a list
  const { selectedCostCode } = useCostCode();
  const t = useTranslations("Clock");

  // Fetch cost codes with offline support
  useEffect(() => {
    let isMounted = true;
    const loadCostCodes = async () => {
      try {
        const data = await fetchWithOfflineCache("getCostCodes", () =>
          fetch("/api/getCostCodes").then(
            (res) => res.json() as Promise<CostCodeResult[]>,
          ),
        );

        if (isMounted && data !== null) {
          if (Array.isArray(data)) {
            // Transform CostCodeResult to Option format
            const transformedOptions: Option[] = data.map((costCode) => ({
              id: costCode.id,
              code: costCode.name, // Use name as code for database connection
              label: costCode.name,
            }));
            console.log("Cost code options loaded:", transformedOptions);
            setCostCodeOptions(transformedOptions);
          } else {
            console.warn("Received non-array cost code data:", data);
            setCostCodeOptions([]);
          }
        } else if (data === null) {
          console.warn("No cached cost code data available offline");
          setCostCodeOptions([]);
        }
      } catch (err) {
        console.error("Failed to load cost codes", err);
        setCostCodeOptions([]);
      }
    };
    loadCostCodes();
    return () => {
      isMounted = false;
    };
  }, []);

  // Initialize with the passed initialValue
  useEffect(() => {
    if (initialValue && costCodeOptions.length > 0) {
      const foundOption = costCodeOptions.find(
        (opt) => opt.code === initialValue.code,
      );
      if (foundOption) {
        setSelectedCostCodeOption(foundOption);
      }
    }
  }, [initialValue, costCodeOptions]);

  // Handle selection changes and notify parent
  const handleSelect = (option: Option | null) => {
    console.log("Cost code selected:", option);
    setSelectedCostCodeOption(option);
    onCostCodeSelect(option); // Pass the option to parent
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
