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
import CostCodeRow from "./CostCodeRow";
import { CostCode, CostCodeSummary, Tag, TagSummary } from "../../../types";
import { Selects } from "@/components/(reusable)/selects";

export default function CostCodeSideBar({
  assets,
  setAssets,
  costCodes,
  setSelectCostCode,
  selectCostCode,
  hasUnsavedChanges = false,
  tagSummaries,
  setSelectTag,
  selectTag,
  setCostCodeUIState,
}: {
  assets: string;
  setAssets: Dispatch<SetStateAction<string>>;
  costCodes: CostCodeSummary[];
  setSelectCostCode: (costCode: CostCodeSummary | null) => void;
  selectCostCode: CostCode | null;
  isRegistrationFormOpen: boolean;
  setIsRegistrationFormOpen: React.Dispatch<React.SetStateAction<boolean>>;
  hasUnsavedChanges?: boolean;
  tagSummaries: TagSummary[];
  selectTag: Tag | null;
  setSelectTag: React.Dispatch<React.SetStateAction<Tag | null>>;
  costCodeUIState: "idle" | "creating" | "editing";
  setCostCodeUIState: React.Dispatch<
    React.SetStateAction<"idle" | "creating" | "editing">
  >;
}) {
  const [term, setTerm] = useState("");

  // Handle cost code selection with toggle functionality
  const handleCostCodeClick = useCallback(
    (costCode: CostCodeSummary) => {
      // If the clicked cost code is already selected, deselect it
      if (selectCostCode?.id === costCode.id) {
        setSelectCostCode(null);
        setCostCodeUIState("idle");
      } else {
        // Otherwise, select the new cost code
        setSelectCostCode(costCode);
        setCostCodeUIState("editing");
      }
    },
    [selectCostCode, setSelectCostCode]
  );

  const filteredCostCodes = useMemo(() => {
    // Create a sorted copy of the original array with inactive items first
    const sortedCostCodes = [...costCodes].sort((a, b) => {
      // First sort by active status (inactive first)
      if (!a.isActive && b.isActive) {
        return -1; // a comes before b
      } else if (a.isActive && !b.isActive) {
        return 1; // b comes before a
      }

      // Then sort alphabetically by name
      return a.name.localeCompare(b.name);
    });

    if (!term.trim()) {
      return sortedCostCodes;
    }

    const searchTerm = term.toLowerCase();
    return sortedCostCodes.filter((costCode) =>
      costCode.name.toLowerCase().includes(searchTerm)
    );
  }, [costCodes, term]);

  return (
    <>
      <Selects className="w-full h-full text-center text-sm p-0">
        <option>Select A Group</option>
        {tagSummaries.map((option) => (
          <option key={option.id} value={option.id}>
            {option.name}
          </option>
        ))}
      </Selects>

      <SearchBar
        term={term}
        handleSearchChange={(e) => setTerm(e.target.value)}
        placeholder="Search cost codes..."
        disabled={hasUnsavedChanges}
      />

      <Holds
        background={"white"}
        className="w-full h-full row-span-1 rounded-[10px] p-3 overflow-y-auto no-scrollbar"
      >
        <Holds>
          {filteredCostCodes.length > 0 ? (
            filteredCostCodes.map((costCode) => (
              <CostCodeRow
                key={costCode.id}
                costCode={costCode}
                isSelected={selectCostCode?.id === costCode.id}
                onClick={handleCostCodeClick}
                hasUnsavedChanges={hasUnsavedChanges}
              />
            ))
          ) : (
            <Texts size="p6" className="text-center">
              {term.trim()
                ? "No cost codes found matching your search"
                : "No cost codes available"}
            </Texts>
          )}
        </Holds>
      </Holds>
    </>
  );
}
