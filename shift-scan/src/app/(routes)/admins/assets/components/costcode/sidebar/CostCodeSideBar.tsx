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
import { Buttons } from "@/components/(reusable)/buttons";
import { CheckBox } from "@/components/(inputs)/checkBox";

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
  onCostCodeToggleAll,
  tagFormData,
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
  onCostCodeToggleAll?: (
    costCodes: CostCodeSummary[],
    selectAll: boolean
  ) => void;
  tagFormData?: Tag | null;
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
    // Check if we're in a group editing or creating mode
    const isGroupMode =
      costCodeUIState === "editingGroups" ||
      costCodeUIState === "creatingGroups";

    // Filter by search term first if there is one
    let filtered = [...costCodes];
    if (term.trim()) {
      const searchTerm = term.toLowerCase();
      filtered = filtered.filter((costCode) =>
        costCode.name.toLowerCase().includes(searchTerm)
      );
    }

    // Sort the filtered cost codes
    return filtered.sort((a, b) => {
      // First priority: selected status (selected codes first)
      const aIsSelected =
        isGroupMode && tagFormData?.CostCodes
          ? tagFormData.CostCodes.some((cc) => cc.id === a.id)
          : selectCostCode?.id === a.id;

      const bIsSelected =
        isGroupMode && tagFormData?.CostCodes
          ? tagFormData.CostCodes.some((cc) => cc.id === b.id)
          : selectCostCode?.id === b.id;

      if (aIsSelected && !bIsSelected) {
        return -1; // a (selected) comes before b (unselected)
      } else if (!aIsSelected && bIsSelected) {
        return 1; // b (selected) comes before a (unselected)
      }

      // Second priority: active status
      if (!a.isActive && b.isActive) {
        return 1; // Active items come before inactive when selection is the same
      } else if (a.isActive && !b.isActive) {
        return -1; // Active items come before inactive when selection is the same
      }

      // Last priority: alphabetical order by name
      return a.name.localeCompare(b.name);
    });
  }, [costCodes, term, costCodeUIState, tagFormData, selectCostCode]);

  const allCostCodesSelected =
    tagFormData &&
    filteredCostCodes.length > 0 &&
    filteredCostCodes.every(
      (cc) => tagFormData?.CostCodes?.some((c) => c.id === cc.id) || false
    );

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
        } w-full h-full row-span-2 rounded-[10px]   overflow-y-auto no-scrollbar`}
      >
        {loading ? (
          <Holds className="h-full w-full p-3 justify-center items-center">
            <Spinner />
          </Holds>
        ) : (
          <Holds className="w-full h-full p-3 overflow-y-auto no-scrollbar">
            {(costCodeUIState === "editingGroups" ||
              costCodeUIState === "creatingGroups") && (
              <Holds position={"row"} className="w-full h-[40px]  gap-2 mb-2">
                <Holds className="w-full h-full justify-center ">
                  <Texts size="sm" position={"right"} className="">
                    {allCostCodesSelected ? "Unselect All" : "Select All"}
                  </Texts>
                </Holds>
                <Holds className="w-fit h-full relative">
                  <CheckBox
                    height={30}
                    width={30}
                    shadow={false}
                    id={"select-all-cost-codes"}
                    name={"select-all-cost-codes"}
                    checked={allCostCodesSelected ?? false}
                    onChange={(e) => {
                      // Determine if we should select all or deselect all
                      const allSelected = allCostCodesSelected;

                      if (
                        onCostCodeToggleAll &&
                        onCostCodeToggleAll instanceof Function
                      ) {
                        // Use the toggle all function directly
                        onCostCodeToggleAll(filteredCostCodes, !allSelected);
                      } else if (
                        onCostCodeToggle &&
                        onCostCodeToggle instanceof Function
                      ) {
                        // Fallback to toggling one by one if toggleAll is not available
                        filteredCostCodes.forEach((costCode) => {
                          const isSelected =
                            tagFormData?.CostCodes?.some(
                              (c) => c.id === costCode.id
                            ) || false;
                          // Only toggle if the selection state doesn't match our target selection state
                          if (isSelected !== !allSelected) {
                            onCostCodeToggle(costCode.id, costCode.name);
                          }
                        });
                      }
                    }}
                  />
                </Holds>
              </Holds>
            )}
            <Holds className="w-full h-fit ">
              {filteredCostCodes.length > 0 ? (
                filteredCostCodes.map((costCode) => {
                  // For group modes, check if this cost code is already in the tag form data
                  const isInGroup =
                    costCodeUIState === "editingGroups" &&
                    tagFormData?.CostCodes
                      ? tagFormData.CostCodes.some(
                          (cc) => cc.id === costCode.id
                        )
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
          </Holds>
        )}
      </Holds>
    </>
  );
}
