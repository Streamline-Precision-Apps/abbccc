"use client";
import { useState, useEffect, useMemo } from "react";
import { Holds } from "@/components/(reusable)/holds";
import { Texts } from "@/components/(reusable)/texts";
import { CheckBox } from "@/components/(inputs)/checkBox";
import { Jobsite } from "../../../types";
import { TagSummary } from "../../../types";
import Spinner from "@/components/(animations)/spinner";
import { Titles } from "@/components/(reusable)/titles";
import { useJobsiteRegistrationForm } from "../hooks/useJobsiteRegistrationForm";

interface JobsiteCostCodeGroupsProps {
  formData: {
    CCTags?: Array<{ id: string; name: string }>;
    [key: string]: any;
  };
  tagSummaries: TagSummary[];
  onInputChange: (
    fieldName: string,
    value:
      | string
      | boolean
      | Array<{
          id: string;
          name: string;
        }>
  ) => void;
  changedFields?: Set<string>;
}

/**
 * Component for managing cost code groups (CCTags) associated with a jobsite
 * Allows users to select or deselect cost code groups for the current jobsite
 */
export default function JobsiteCostCodeGroups({
  formData,
  tagSummaries,
  onInputChange,
  changedFields,
}: JobsiteCostCodeGroupsProps) {
  const { handleCCTagsChange } = useJobsiteRegistrationForm({
    onSubmit: async () => {},
  });
  const [loading, setLoading] = useState(false);

  // Handle selecting/deselecting all tags
  const allTagsSelected = useMemo(() => {
    if (!tagSummaries.length || !formData.CCTags) return false;
    return tagSummaries.every((tag) =>
      formData.CCTags?.some((ccTag) => ccTag.id === tag.id)
    );
  }, [formData.CCTags, tagSummaries]);

  /**
   * Toggle a single cost code group for the jobsite
   */
  const handleTagToggle = (tagId: string, tagName: string) => {
    const currentTags = formData.CCTags || [];
    const tagIndex = currentTags.findIndex((tag) => tag.id === tagId);
    const newTags =
      tagIndex >= 0
        ? [
            ...currentTags.slice(0, tagIndex),
            ...currentTags.slice(tagIndex + 1),
          ] // Remove
        : [...currentTags, { id: tagId, name: tagName }]; // Add

    handleCCTagsChange(newTags);
  };

  // Is a particular tag selected?
  const isTagSelected = (tagId: string) => {
    return formData.CCTags?.some((tag) => tag.id === tagId) || false;
  };

  // Is the CCTags field changed?
  const isFieldChanged = changedFields?.has("CCTags") || false;

  if (loading) {
    return (
      <Holds className="w-full h-full flex justify-center items-center">
        <Spinner size={40} />
      </Holds>
    );
  }

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
              <Holds
                background={"lightBlue"}
                className="w-full cursor-pointer"
                onClick={() => handleTagToggle(tag.id, tag.name)}
              >
                <Titles size="md">{tag.name}</Titles>
              </Holds>
              <Holds className="w-fit h-full justify-center items-center relative">
                <CheckBox
                  id={`tag-${tag.id}`}
                  name={`tag-${tag.id}`}
                  checked={formData.CCTags?.some((tag) => tag.id === tag.id)}
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
