"use client";
import React, { useEffect, useState } from "react";
import NewCodeFinder from "@/components/(search)/newCodeFinder";
import { useJobSite } from "@/app/context/dbCodeContext";
import { useTranslations } from "next-intl";
import { fetchWithOfflineCache } from "@/utils/offlineApi";

type Option = {
  id: string;
  code: string;
  label: string;
};

// Minimal shape used from Jobsite summary API
type JobsiteResult = {
  id: string;
  name: string;
  qrId: string;
  approvalStatus: string;
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
  // The new hook only provides selectedJobSite, not a list
  const { selectedJobSite } = useJobSite();
  const t = useTranslations("Clock");

  // Fetch jobsites with offline support
  useEffect(() => {
    let isMounted = true;
    const loadJobsites = async () => {
      try {
        const data = await fetchWithOfflineCache("getJobsiteSummary", () =>
          fetch("/api/getJobsiteSummary").then(
            (res) => res.json() as Promise<JobsiteResult[]>,
          ),
        );

        if (isMounted && data !== null) {
          // Handle case when data is null (offline with no cache)
          if (Array.isArray(data)) {
            // Transform JobsiteResult to Option format
            const transformedOptions: Option[] = data.map((jobsite) => ({
              id: jobsite.id,
              code: jobsite.qrId,
              label: jobsite.name,
            }));
            console.log("Jobsite options loaded:", transformedOptions);
            setJobsiteOptions(transformedOptions);
          } else {
            console.warn("Received non-array jobsite data:", data);
            setJobsiteOptions([]);
          }
        } else if (data === null) {
          console.warn("No cached jobsite data available offline");
          setJobsiteOptions([]);
        }
      } catch (err) {
        console.error("Failed to load jobsite summary", err);
        setJobsiteOptions([]);
      }
    };
    loadJobsites();
    return () => {
      isMounted = false;
    };
  }, []);

  // Initialize with the passed initialValue
  useEffect(() => {
    if (initialValue && jobsiteOptions.length > 0) {
      const foundOption = jobsiteOptions.find(
        (opt) => opt.code === initialValue.code,
      );
      if (foundOption) {
        setSelectedJobsite(foundOption);
      }
    }
  }, [initialValue, jobsiteOptions]);

  // Handle selection changes and notify parent
  const handleSelect = (option: Option | null) => {
    console.log("Jobsite selected:", option);
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
