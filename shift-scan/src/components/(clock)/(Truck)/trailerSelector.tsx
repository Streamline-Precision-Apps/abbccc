"use client";
import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import NewCodeFinder from "@/components/(search)/newCodeFinder";

type Option = {
  id: string;
  code: string;
  label: string;
};

type TrailerSelectorProps = {
  onTrailerSelect: (trailer: Option | null) => void;
  initialValue?: Option;
};

const TrailerSelector = ({ onTrailerSelect, initialValue }: TrailerSelectorProps) => {
  const [selectedTrailer, setSelectedTrailer] = useState<Option | null>(null);
  const [trailerOptions, setTrailerOptions] = useState<Option[]>([]);
  const t = useTranslations("Clock");

  useEffect(() => {
    // Fetch all equipment (since trailer type is not yet in DB)
    fetch("/api/getAllEquipment")
      .then((res) => res.json())
      .then((data: { id: string; qrId?: string; name: string }[]) => {
        const noTrailerOption: Option = { id: "none", code: "none", label: t("NoTrailerOption", { default: "No Trailer" }) };
        const options: Option[] = data
          .map((item) => ({
            id: item.qrId || item.id,
            code: item.qrId || item.id,
            label: item.name,
          }))
          .filter((item: Option) => item.id !== "none")
          .sort((a: Option, b: Option) => a.label.localeCompare(b.label));
        // Pin 'No Trailer' to the top
        options.unshift(noTrailerOption);
        setTrailerOptions(options);
      })
      .catch(() => {
        setTrailerOptions([
          { id: "none", code: "none", label: t("NoTrailerOption", { default: "No Trailer" }) },
        ]);
      });
  }, [t]);

  useEffect(() => {
    if (initialValue && trailerOptions.length > 0) {
      const foundOption = trailerOptions.find(opt => opt.code === initialValue.code);
      if (foundOption) {
        setSelectedTrailer(foundOption);
      }
    }
  }, [initialValue, trailerOptions]);

  const handleSelect = (option: Option | null) => {
    setSelectedTrailer(option);
    onTrailerSelect(option);
  };

  return (
    <NewCodeFinder
      options={trailerOptions}
      selectedOption={selectedTrailer}
      onSelect={handleSelect}
      placeholder={t("SearchBarPlaceholder")}
      label={t("Trailer-label")}
    />
  );
};

export default TrailerSelector;
