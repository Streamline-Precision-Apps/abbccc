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
import Spinner from "@/components/(animations)/spinner";

/**
 * Props for the JobsiteSideBar component.
 */
interface JobsiteSideBarProps {
  assets: string;
  setAssets: Dispatch<SetStateAction<"Equipment" | "CostCode" | "Jobsite">>;
  jobsites: JobsiteSummary[];
  setSelectJobsite: (jobsite: JobsiteSummary | null) => void;
  selectJobsite: Jobsite | null;
  hasUnsavedChanges?: boolean;
  jobsiteUIState: "idle" | "creating" | "editing";
  setJobsiteUIState: Dispatch<SetStateAction<"idle" | "creating" | "editing">>;
  loading: boolean;
}

/**
 * Sidebar component for jobsite management.
 * Displays a searchable list of jobsites and handles selection.
 */
export default function JobsiteSideBar({
  assets,
  setAssets,
  jobsites,
  setSelectJobsite,
  selectJobsite,
  hasUnsavedChanges = false,
  jobsiteUIState,
  setJobsiteUIState,
  loading,
}: JobsiteSideBarProps) {
  const [term, setTerm] = useState("");

  // Handle jobsite selection with toggle functionality
  const handleJobsiteClick = useCallback(
    (jobsite: JobsiteSummary) => {
      // If the clicked jobsite is already selected, deselect it
      if (selectJobsite?.id === jobsite.id) {
        setSelectJobsite(null);
        setJobsiteUIState("idle");
      } else {
        // Otherwise, select the new jobsite
        setSelectJobsite(jobsite);
        setJobsiteUIState("editing");
      }
    },
    [selectJobsite, setSelectJobsite, setJobsiteUIState]
  );

  const filteredJobsites = useMemo(() => {
    // Create a sorted copy of the original array with PENDING items first
    const sortedJobsites = [...jobsites].sort((a, b) => {
      // First sort by approval status (PENDING first)
      if (a.approvalStatus === "PENDING" && b.approvalStatus !== "PENDING") {
        return -1; // a comes before b
      } else if (
        a.approvalStatus !== "PENDING" &&
        b.approvalStatus === "PENDING"
      ) {
        return 1; // b comes before a
      }

      // Then sort alphabetically by name
      return a.name.localeCompare(b.name);
    });

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
        placeholder="Search for jobsites here..."
        disabled={loading}
      />

      <Holds
        background={"white"}
        className={`${
          loading && "animate-pulse"
        } w-full h-full row-span-2 rounded-[10px] p-3 overflow-y-auto no-scrollbar`}
      >
        {loading ? (
          <Holds className="h-full w-full justify-center items-center">
            <Spinner />
          </Holds>
        ) : (
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
        )}
      </Holds>
    </>
  );
}
