"use client";
import React, { useEffect, useState } from "react";
import NewCodeFinder from "@/components/(search)/newCodeFinder";
import { useDBJobsite } from "@/app/context/dbCodeContext";
import { useTranslations } from "next-intl";

type Option = {
  id?: string;
  code: string;
  label: string;
};

type EquipmentSelectorProps = {
  onJobsiteSelect: (equipment: Option | null) => void;
  initialValue?: Option; // Optional initial value
  useJobSiteId?: boolean; // Optional prop to use ID instead of code
};

export const JobsiteSelector = ({
  onJobsiteSelect,
  initialValue,
  useJobSiteId = false,
}: EquipmentSelectorProps) => {
  const [selectedJobsite, setSelectedJobsite] = useState<Option | null>(null);
  const [jobsiteOptions, setJobsiteOptions] = useState<Option[]>([]);
  const { jobsiteResults } = useDBJobsite();
  const t = useTranslations("Clock");
  useEffect(() => {
    const options = jobsiteResults.map((jobSite) => ({
      code: useJobSiteId ? jobSite.id : jobSite.qrId,
      label: jobSite.name,
    }));

    setJobsiteOptions(options);
  }, [jobsiteResults]);

  // Initialize with the passed initialValue
  useEffect(() => {
    if (initialValue && jobsiteOptions.length > 0) {
      const foundOption = jobsiteOptions.find(
        (opt) => opt.code === initialValue.code
      );
      if (foundOption) {
        setSelectedJobsite(foundOption);
      }
    }
  }, [initialValue, jobsiteOptions]);

  // Handle selection changes and notify parent
  const handleSelect = (option: Option | null) => {
    setSelectedJobsite(option);
    onJobsiteSelect(option); // Pass just the code to parent
  };

  return (
    <NewCodeFinder
      options={jobsiteOptions}
      selectedOption={selectedJobsite}
      onSelect={handleSelect}
      placeholder={t("SearchBarPlaceholder")}
      label="Select Job Site"
    />
  );
};
