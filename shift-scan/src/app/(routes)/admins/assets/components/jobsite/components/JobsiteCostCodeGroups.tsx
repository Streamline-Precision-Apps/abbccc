"use client";
import { Holds } from "@/components/(reusable)/holds";
import { Texts } from "@/components/(reusable)/texts";
import { CheckBox } from "@/components/(inputs)/checkBox";
import { Jobsite, TagSummary } from "../../../types";
import { Titles } from "@/components/(reusable)/titles";

interface JobsiteCostCodeGroupsProps {
  /** Form data for existing jobsite (used in edit mode) or null for new jobsite */
  formData?: Jobsite | null;
  /** Available tag summaries to display */
  tagSummaries: TagSummary[];
  /** Function to check if a tag is currently selected */
  isTagSelected: (tagId: string) => boolean;
  /** Function to handle toggling of tags */
  handleTagToggle: (tagId: string, tagName: string) => void;
  /** Optional callback for input changes (used in edit mode) */
  onInputChange?: (
    fieldName: string,
    value:
      | string
      | boolean
      | Array<{
          id: string;
          name: string;
        }>
  ) => void;
  /** Optional set of changed fields for visual feedback */
  changedFields?: Set<string>;
}

/**
 * Reusable component for managing cost code groups (CCTags) associated with a jobsite
 *
 * This component works in two scenarios:
 * 1. **Create Mode**: Used in JobsiteRegistrationView with functions from useJobsiteRegistrationForm hook
 * 2. **Update Mode**: Used in JobsiteBasicFields with functions from useJobsiteForm hook
 *
 * The component receives `isTagSelected` and `handleTagToggle` functions as props,
 * making it agnostic to the underlying state management implementation.
 *
 * @param props - JobsiteCostCodeGroupsProps containing tag data and handler functions
 */
export default function JobsiteCostCodeGroups({
  tagSummaries,
  isTagSelected,
  handleTagToggle,
}: JobsiteCostCodeGroupsProps) {
  return (
    <Holds className="w-full h-full flex flex-col">
      <Holds className="w-full flex-1 overflow-y-auto no-scrollbar">
        {tagSummaries.length > 0 ? (
          tagSummaries.map((tag) => (
            <Holds
              position={"row"}
              key={tag.id}
              className="w-full h-[40px] mt-4 first:mt-0 gap-2"
            >
              <Holds background={"lightBlue"} className="w-full cursor-pointer">
                <Titles size="md">{tag.name}</Titles>
              </Holds>
              <Holds className="w-fit h-full justify-center items-center relative">
                <CheckBox
                  id={`tag-${tag.id}`}
                  name={`tag-${tag.id}`}
                  checked={isTagSelected(tag.id)}
                  onChange={() => handleTagToggle(tag.id, tag.name)}
                  width={35}
                  height={35}
                  shadow={false}
                />
              </Holds>
            </Holds>
          ))
        ) : (
          <Holds className="w-full h-full flex justify-center items-center">
            <Texts size="p6" className="text-gray-500 italic">
              No cost code groups available
            </Texts>
          </Holds>
        )}
      </Holds>
    </Holds>
  );
}
