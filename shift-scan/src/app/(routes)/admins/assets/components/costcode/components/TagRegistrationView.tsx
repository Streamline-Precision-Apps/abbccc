"use client";

import React, { useEffect, useState } from "react";
import { Buttons } from "@/components/(reusable)/buttons";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Inputs } from "@/components/(reusable)/inputs";
import { TextAreas } from "@/components/(reusable)/textareas";
import { Texts } from "@/components/(reusable)/texts";
import { UseTagCreationReturn } from "../hooks/useTagCreation";
import { CostCodeSummary } from "../../../types";
import Spinner from "@/components/(animations)/spinner";
import DiscardChangesModal from "../../shared/DiscardChangesModal";

interface TagsRegistrationViewProps {
  /** Function to expose the creation hook handlers to parent */
  onCreationHookReady?: (handlers: {
    handleCostCodeToggle: (costCodeId: string, costCodeName: string) => void;
    handleCostCodeToggleAll: (
      costCodes: CostCodeSummary[],
      selectAll: boolean
    ) => void;
    formData: { costCodes: Array<{ id: string; name: string }> };
  }) => void;
  tagCreation: UseTagCreationReturn;
  closeForm: () => void;
}

export default function TagsRegistrationView({
  onCreationHookReady,
  tagCreation,
  closeForm,
}: TagsRegistrationViewProps) {
  // Expose the creation hook handlers to parent component
  const [closeTagModal, setCloseTagModal] = useState(false);

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

  const handleCancel = () => {
    if (tagCreation.hasUnsavedChanges) {
      setCloseTagModal(true);
      return;
    }
    handleConfirmCancel();
  };

  const handleConfirmCancel = () => {
    tagCreation.clearForm();
    closeForm();
    setCloseTagModal(false);
  };

  return (
    <Holds className="w-full h-full col-span-4">
      <Grids className="w-full h-full grid-rows-[40px_200px_1fr] gap-4">
        {/* Header with buttons */}
        <Holds
          position={"row"}
          background="white"
          className="w-full h-full flex justify-between px-4 relative"
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
                <Spinner size={10} />
                <Texts size="sm" text={"link"}>
                  Creating New Group...
                </Texts>
              </Holds>
            ) : (
              <Texts
                size="sm"
                text={"link"}
                className={
                  !tagCreation.hasUnsavedChanges ? "text-app-dark-gray" : ""
                }
              >
                Submit New Group
              </Texts>
            )}
          </Buttons>
          <Buttons
            shadow="none"
            background={"none"}
            className="w-fit h-auto"
            onClick={handleCancel}
            disabled={tagCreation.isSubmitting}
          >
            <img src="/statusDenied.svg" alt="Close" className="w-4 h-4" />
          </Buttons>
          {/* Success/Error Messages */}
          {tagCreation.successMessage && (
            <Holds
              background="green"
              className="absolute top-0 left-0 w-full h-full rounded-[10px] flex items-center justify-center z-10"
            >
              <Texts size="sm" className="text-white ">
                {tagCreation.successMessage}
              </Texts>
            </Holds>
          )}

          {tagCreation.errorMessage && (
            <Holds
              background="red"
              className="absolute top-0 left-0 w-full h-full rounded-[10px] flex items-center justify-center z-10"
            >
              <Texts size="sm" className="text-white ">
                {tagCreation.errorMessage}
              </Texts>
            </Holds>
          )}
        </Holds>

        {/* Form fields section */}
        <Holds
          background="white"
          className="w-full h-full flex flex-col p-4 gap-4"
        >
          <Holds className="">
            <label
              htmlFor="name"
              className={`text-xs ${
                tagCreation.showError("name") ? "text-red-500" : ""
              }`}
            >
              Group Name<span className="pl-0.5 text-red-500">*</span>
            </label>
            <Inputs
              id="name"
              name="name"
              value={tagCreation.formData.name}
              onChange={(e) => tagCreation.handleNameChange(e.target.value)}
              onBlur={() => tagCreation.updateFieldTouched("name")}
              placeholder="Enter group name"
              disabled={tagCreation.isSubmitting}
              className="w-1/2 text-sm"
            />
          </Holds>

          <Holds className="">
            <label
              htmlFor="description"
              className={`text-xs ${
                tagCreation.showError("name") ? "text-red-500" : ""
              }`}
            >
              Group Description<span className="pl-0.5 text-red-500">*</span>
            </label>
            <TextAreas
              id="description"
              name="description"
              value={tagCreation.formData.description}
              onChange={(e) =>
                tagCreation.handleDescriptionChange(e.target.value)
              }
              onBlur={() => tagCreation.updateFieldTouched("description")}
              placeholder="Enter group description"
              disabled={tagCreation.isSubmitting}
              style={{ resize: "none" }}
              className="w-full text-sm"
            />
          </Holds>
        </Holds>

        {/* Cost codes section */}
        <Holds
          background="white"
          className="w-full h-full p-4 overflow-auto no-scrollbar"
        >
          <Grids className="w-full h-full grid-rows-[30px_1fr] gap-1">
            <Holds position={"row"} className="w-full h-full justify-between">
              <Texts position={"left"} size="md" className="">
                Cost Codes in Group
              </Texts>
              <Texts position={"right"} size="md">
                Cost Codes Count: <span>{numberOfCostCodes}</span>
              </Texts>
            </Holds>
            <Holds className="w-full h-full rounded-[10px] border-black border-[3px] p-4 overflow-auto no-scrollbar">
              {numberOfCostCodes === 0 ? (
                <Holds className="text-center justify-center items-center w-full h-full">
                  <Texts size="md" className="text-gray-500">
                    No cost codes selected
                  </Texts>
                  <Texts size="sm" className="text-gray-400 mt-2">
                    Use the sidebar to select cost codes for this group
                  </Texts>
                </Holds>
              ) : (
                <Holds
                  position={"row"}
                  className="w-full h-auto overflow-y-auto no-scrollbar flex-wrap"
                >
                  {tagCreation.formData.costCodes.map((costCode) => {
                    const [firstWord, ...restWords] = costCode.name.split(" ");
                    const remainingText = restWords.join(" "); // Combine remaining words

                    return (
                      <Holds
                        key={costCode.id}
                        className="flex w-1/3 sm:w-full md:w-1/2 lg:w-1/3  h-fit p-1"
                      >
                        <Holds
                          background="lightBlue"
                          className="w-full h-full rounded-[10px] p-1 justify-center gap-1"
                        >
                          <Texts size="xs">{`${firstWord} `}</Texts>
                          <Texts size="xs">{remainingText}</Texts>
                        </Holds>
                      </Holds>
                    );
                  })}
                </Holds>
              )}
            </Holds>
          </Grids>
        </Holds>
      </Grids>
      <DiscardChangesModal
        isOpen={closeTagModal}
        confirmDiscardChanges={handleConfirmCancel}
        cancelDiscard={() => setCloseTagModal(false)}
        message="Are you sure you want to cancel creation? This will discard all unsaved changes."
        confirmationText="Yes, cancel creation"
        cancelText="No, go back"
      />
    </Holds>
  );
}
