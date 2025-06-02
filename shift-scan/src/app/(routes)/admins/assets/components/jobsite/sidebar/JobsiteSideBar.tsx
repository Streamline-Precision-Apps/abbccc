"use client";
import { Holds } from "@/components/(reusable)/holds";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
  useState,
} from "react";
import SearchBar from "../../../../personnel/components/SearchBar";
import { Texts } from "@/components/(reusable)/texts";
import JobsiteRow from "./JobsiteRow";
import { Jobsite, JobsiteSummary } from "../../../types";

export default function JobsiteSideBar({
  assets,
  setAssets,
  jobsites,
  setSelectJobsite,
  selectJobsite,
  hasUnsavedChanges = false,
}: {
  assets: string;
  setAssets: Dispatch<SetStateAction<string>>;
  jobsites: JobsiteSummary[];
  setSelectJobsite: (jobsite: JobsiteSummary | null) => void;
  selectJobsite: Jobsite | null;
  isRegistrationFormOpen: boolean;
  setIsRegistrationFormOpen: React.Dispatch<React.SetStateAction<boolean>>;
  hasUnsavedChanges?: boolean;
}) {
  const [term, setTerm] = useState("");

  // Handle jobsite selection with toggle functionality
  const handleJobsiteClick = useCallback(
    (jobsite: JobsiteSummary) => {
      // If the clicked jobsite is already selected, deselect it
      if (selectJobsite?.id === jobsite.id) {
        setSelectJobsite(null);
      } else {
        // Otherwise, select the new jobsite
        setSelectJobsite(jobsite);
      }
    },
    [selectJobsite, setSelectJobsite]
  );

  const filteredJobsites = useMemo(() => {
    // Create a sorted copy of the original array
    const sortedJobsites = [...jobsites].sort((a, b) =>
      a.name.localeCompare(b.name)
    );

    if (!term.trim()) {
      return sortedJobsites;
    }

    const searchTerm = term.toLowerCase();
    return sortedJobsites.filter((jobsite) =>
      jobsite.name.toLowerCase().includes(searchTerm)
    );
  }, [jobsites, term]);

  return (
    <>
      <SearchBar
        term={term}
        handleSearchChange={(e) => setTerm(e.target.value)}
        placeholder="Search jobsites..."
        disabled={hasUnsavedChanges}
      />

      <Holds
        background={"white"}
        className="w-full h-full row-span-2 rounded-[10px] p-3 overflow-y-auto no-scrollbar"
      >
        <Holds>
          {filteredJobsites.length > 0 ? (
            filteredJobsites.map((jobsite) => (
              <JobsiteRow
                key={jobsite.id}
                jobsite={jobsite}
                isSelected={selectJobsite?.id === jobsite.id}
                onClick={handleJobsiteClick}
                hasUnsavedChanges={hasUnsavedChanges}
              />
            ))
          ) : (
            <Texts size="p6" className="text-center">
              {term.trim()
                ? "No jobsites found matching your search"
                : "No jobsites available"}
            </Texts>
          )}
        </Holds>
      </Holds>
    </>
  );
}
