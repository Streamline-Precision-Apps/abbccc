"use client";
import React, { useEffect, useState } from "react";
import NewCodeFinder from "@/components/(search)/newCodeFinder";
import { useDBJobsite } from "@/app/context/dbCodeContext";

type Option = {
  code: string;
  label: string;
};

type EquipmentSelectorProps = {
  onJobsiteSelect: (equipment: Option | null) => void;
  initialValue?: Option; // Optional initial value
};

export const JobsiteSelector = ({
  onJobsiteSelect,
  initialValue,
}: EquipmentSelectorProps) => {
  const [selectedJobsite, setSelectedJobsite] = useState<Option | null>(null);
  const [jobsiteOptions, setJobsiteOptions] = useState<Option[]>([]);
  const { jobsiteResults } = useDBJobsite();

  useEffect(() => {
    const options = jobsiteResults.map((jobSite) => ({
      code: jobSite.qrId,
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
      placeholder="Search Job Sites..."
      label="Select Job Site"
    />
  );
};
