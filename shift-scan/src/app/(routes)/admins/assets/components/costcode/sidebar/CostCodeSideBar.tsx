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
import Spinner from "@/components/(animations)/spinner";
import { set } from "date-fns";

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
  loading,
  costCodeUIState,
  onCostCodeToggle,
}: {
  assets: string;
  setAssets: Dispatch<SetStateAction<"Equipment" | "CostCode" | "Jobsite">>;
  costCodes: CostCodeSummary[];
  setSelectCostCode: (costCode: CostCodeSummary | null) => void;
  selectCostCode: CostCode | null;
  isRegistrationFormOpen: boolean;
  setIsRegistrationFormOpen: Dispatch<SetStateAction<boolean>>;
  hasUnsavedChanges?: boolean;
  tagSummaries: TagSummary[];
  selectTag: Tag | null;
  setSelectTag: (tag: TagSummary | null) => void;
  costCodeUIState:
    | "idle"
    | "creating"
    | "editing"
    | "editingGroups"
    | "creatingGroups";
  setCostCodeUIState: Dispatch<
    SetStateAction<
      "idle" | "creating" | "editing" | "editingGroups" | "creatingGroups"
    >
  >;
  loading: boolean;
  onCostCodeToggle?: (costCodeId: string, costCodeName: string) => void;
}) {
  const [term, setTerm] = useState("");

  // Handle cost code selection with toggle functionality
  const handleCostCodeClick = useCallback(
    (costCode: CostCodeSummary) => {
      if (selectCostCode?.id === costCode.id) {
        setSelectCostCode(null);
        setSelectTag(null);
        setCostCodeUIState("idle");
      } else {
        // Otherwise, select the new cost code
        setSelectCostCode(costCode);
        setSelectTag(null);
        setCostCodeUIState("editing");
      }
    },
    [selectCostCode, setSelectCostCode, costCodeUIState, onCostCodeToggle]
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
      <Selects
        disabled={loading}
        onChange={(event) => {
          // Set UI state to editing groups
          setCostCodeUIState("editingGroups");

          // Find the selected tag by ID from the tagSummaries array
          const selectedTagId = event.target.value;
          if (selectedTagId === "") {
            setSelectTag(null);
            setSelectCostCode(null);
            setCostCodeUIState("idle");
          } else {
            setSelectTag(
              tagSummaries.find((tag) => tag.id === selectedTagId) || null
            );
          }
        }}
        value={
          selectTag
            ? selectTag.id
            : "Select A Group" /* Default value when no tag is selected */
        }
        className="w-full h-full text-center text-sm p-0"
      >
        <option value="">Select A Group</option>
        {tagSummaries.map((option) => (
          <option key={option.id} value={option.id}>
            {option.name}
          </option>
        ))}
      </Selects>

      <SearchBar
        term={term}
        handleSearchChange={(e) => setTerm(e.target.value)}
        placeholder="Search cost codes here..."
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
            {filteredCostCodes.length > 0 ? (
              filteredCostCodes.map((costCode) => {
                // For group modes, check if this cost code is already in the tag
                const isInGroup =
                  costCodeUIState === "editingGroups" && selectTag?.CostCodes
                    ? selectTag.CostCodes.some((cc) => cc.id === costCode.id)
                    : false;

                return (
                  <CostCodeRow
                    key={costCode.id}
                    costCode={costCode}
                    isSelected={
                      costCodeUIState === "editingGroups" ||
                      costCodeUIState === "creatingGroups"
                        ? isInGroup
                        : selectCostCode?.id === costCode.id
                    }
                    onClick={handleCostCodeClick}
                    hasUnsavedChanges={hasUnsavedChanges}
                    costCodeUIState={costCodeUIState}
                    onToggleCostCode={onCostCodeToggle}
                  />
                );
              })
            ) : (
              <Texts size="p6" className="text-center">
                {term.trim()
                  ? "No cost codes found matching your search"
                  : "No cost codes available"}
              </Texts>
            )}
          </Holds>
        )}
      </Holds>
    </>
  );
}
