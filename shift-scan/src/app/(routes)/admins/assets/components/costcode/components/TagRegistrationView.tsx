"use client";

import React, { useEffect } from "react";
import { Buttons } from "@/components/(reusable)/buttons";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Inputs } from "@/components/(reusable)/inputs";
import { TextAreas } from "@/components/(reusable)/textareas";
import { Texts } from "@/components/(reusable)/texts";
import { useTagCreation } from "../hooks/useTagCreation";
import { CostCodeSummary } from "../../../types";
import Spinner from "@/components/(animations)/spinner";

interface TagsRegistrationViewProps {
  /** Function to refresh the list of tags after creation */
  refreshTags?: () => Promise<void>;
  /** Function to exit creation mode */
  onCancel: () => void;
  /** Function to expose the creation hook handlers to parent */
  onCreationHookReady?: (handlers: {
    handleCostCodeToggle: (costCodeId: string, costCodeName: string) => void;
    handleCostCodeToggleAll: (
      costCodes: CostCodeSummary[],
      selectAll: boolean
    ) => void;
    formData: { costCodes: Array<{ id: string; name: string }> };
  }) => void;
}

export default function TagsRegistrationView({
  refreshTags,
  onCancel,
  onCreationHookReady,
}: TagsRegistrationViewProps) {
  const tagCreation = useTagCreation({
    refreshTags,
    onCancel,
  });

  // Expose the creation hook handlers to parent component
  useEffect(() => {
    if (onCreationHookReady) {
      onCreationHookReady({
        handleCostCodeToggle: tagCreation.handleCostCodeToggle,
        handleCostCodeToggleAll: tagCreation.handleCostCodeToggleAll,
        formData: { costCodes: tagCreation.formData.costCodes },
      });
    }
  }, [
    onCreationHookReady,
    tagCreation.handleCostCodeToggle,
    tagCreation.handleCostCodeToggleAll,
    tagCreation.formData.costCodes,
  ]);

  const numberOfCostCodes = tagCreation.formData.costCodes.length;

  return (
    <Holds className="w-full h-full">
      <Grids className="w-full h-full grid-rows-[40px_200px_1fr] gap-4">
        {/* Header with buttons */}
        <Holds
          position={"row"}
          background="white"
          className="w-full h-full flex justify-between px-4"
        >
          <Buttons
            shadow="none"
            background={"none"}
            className="w-fit h-auto"
            onClick={tagCreation.handleSubmit}
            disabled={
              tagCreation.isSubmitting || !tagCreation.hasUnsavedChanges
            }
          >
            {tagCreation.isSubmitting ? (
              <Holds position="row" className="gap-2 items-center">
                <Spinner />
                <Texts size="sm" text={"link"}>
                  Creating...
                </Texts>
              </Holds>
            ) : (
              <Texts size="sm" text={"link"}>
                Submit New Group
              </Texts>
            )}
          </Buttons>
          <Buttons
            shadow="none"
            background={"none"}
            className="w-fit h-auto"
            onClick={tagCreation.handleCancel}
            disabled={tagCreation.isSubmitting}
          >
            <Texts size="sm" text={"link"}>
              Cancel Creation
            </Texts>
          </Buttons>
        </Holds>

        {/* Form fields section */}
        <Holds
          background="white"
          className="w-full h-full flex flex-col p-4 gap-4"
        >
          <Holds className="flex flex-col gap-2">
            <label htmlFor="name" className="text-sm font-medium">
              Group Name *
            </label>
            <Inputs
              id="name"
              name="name"
              value={tagCreation.formData.name}
              onChange={(e) => tagCreation.handleNameChange(e.target.value)}
              placeholder="Enter group name"
              disabled={tagCreation.isSubmitting}
            />
          </Holds>

          <Holds className="flex flex-col gap-2">
            <label htmlFor="description" className="text-sm font-medium">
              Group Description *
            </label>
            <TextAreas
              id="description"
              name="description"
              value={tagCreation.formData.description}
              onChange={(e) =>
                tagCreation.handleDescriptionChange(e.target.value)
              }
              placeholder="Enter group description"
              disabled={tagCreation.isSubmitting}
            />
          </Holds>

          {/* Success/Error Messages */}
          {tagCreation.successMessage && (
            <Holds className="p-3 bg-green-100 border border-green-400 text-green-700 rounded">
              <Texts size="sm">{tagCreation.successMessage}</Texts>
            </Holds>
          )}

          {tagCreation.error && (
            <Holds className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              <Texts size="sm">{tagCreation.error}</Texts>
            </Holds>
          )}
        </Holds>

        {/* Cost codes section */}
        <Holds background="white" className="w-full h-full p-4">
          <Holds className="flex justify-between items-center mb-4">
            <Texts position={"left"} size="md">
              Cost Codes ({numberOfCostCodes} selected)
            </Texts>
            {numberOfCostCodes > 0 && (
              <Buttons
                shadow="none"
                background="none"
                className="w-fit h-auto"
                onClick={() => tagCreation.handleCostCodeToggleAll([], false)}
                disabled={tagCreation.isSubmitting}
              >
                <Texts size="sm" text="link">
                  Clear All
                </Texts>
              </Buttons>
            )}
          </Holds>

          <Holds className="w-full h-full flex justify-center items-center border-[3px] border-gray-300 rounded-[10px] p-4">
            {numberOfCostCodes === 0 ? (
              <Holds className="text-center">
                <Texts size="md" className="text-gray-500">
                  No cost codes selected
                </Texts>
                <Texts size="sm" className="text-gray-400 mt-2">
                  Use the sidebar to select cost codes for this group
                </Texts>
              </Holds>
            ) : (
              <Holds className="w-full h-full overflow-y-auto">
                <Grids className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {tagCreation.formData.costCodes.map((costCode) => (
                    <Holds
                      key={costCode.id}
                      className="p-2 bg-blue-50 border border-blue-200 rounded flex justify-between items-center"
                    >
                      <Texts size="sm" className="text-blue-800">
                        {costCode.name}
                      </Texts>
                      <Buttons
                        shadow="none"
                        background="none"
                        className="w-fit h-auto p-1"
                        onClick={() =>
                          tagCreation.handleCostCodeToggle(
                            costCode.id,
                            costCode.name
                          )
                        }
                        disabled={tagCreation.isSubmitting}
                      >
                        <Texts size="xs" text="link">
                          ×
                        </Texts>
                      </Buttons>
                    </Holds>
                  ))}
                </Grids>
              </Holds>
            )}
          </Holds>
        </Holds>
      </Grids>
    </Holds>
  );
}
