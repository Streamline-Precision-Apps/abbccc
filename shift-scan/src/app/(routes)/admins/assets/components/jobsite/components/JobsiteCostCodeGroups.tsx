"use client";
import { useState, useEffect, useMemo } from "react";
import { Holds } from "@/components/(reusable)/holds";
import { Texts } from "@/components/(reusable)/texts";
import { CheckBox } from "@/components/(inputs)/checkBox";
import { Jobsite } from "../../../types";
import { TagSummary } from "../../../types";
import Spinner from "@/components/(animations)/spinner";
import { Titles } from "@/components/(reusable)/titles";

interface JobsiteCostCodeGroupsProps {
  formData: {
    CCTags?: Array<{ id: string; name: string }>;
    [key: string]: any;
  };
  tagSummaries: TagSummary[];
  handleCCTagsChange: (
    tags: Array<{
      id: string;
      name: string;
    }>
  ) => void;
  isTagSelected: (tagId: string) => boolean;
  handleTagToggle: (tagId: string, tagName: string) => void;
  changedFields?: Set<string>;
}

/**
 * Component for managing cost code groups (CCTags) associated with a jobsite
 * Allows users to select or deselect cost code groups for the current jobsite
 */
export default function JobsiteCostCodeGroups({
  formData,
  tagSummaries,
  handleCCTagsChange,
  isTagSelected,
  handleTagToggle,
  changedFields,
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
