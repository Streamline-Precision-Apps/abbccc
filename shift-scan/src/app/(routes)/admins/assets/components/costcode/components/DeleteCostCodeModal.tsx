import { Buttons } from "@/components/(reusable)/buttons";
import { Holds } from "@/components/(reusable)/holds";
import { NModals } from "@/components/(reusable)/newmodals";
import { Texts } from "@/components/(reusable)/texts";
import { Titles } from "@/components/(reusable)/titles";
import { Contents } from "@/components/(reusable)/contents";
import React, { useCallback } from "react";
import { DeleteCostCodeModalProps } from "../types";

/**
 * Modal for confirming cost code deletion
 *
 * @param props DeleteCostCodeModalProps interface from types.ts
 * @returns A modal component for confirming deletion of a cost code
 */
const DeleteCostCodeModal: React.FC<DeleteCostCodeModalProps> = ({
  isOpen,
  onClose,
  onDelete,
  costCodeName,
  isDeleting = false,
}) => {
  // Use memoized handlers for callbacks
  const handleDelete = useCallback(() => {
    onDelete();
  }, [onDelete]);

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  const deleteQuestion = {
    text: "Are you sure you want to delete the cost code ",
    itemDeleting: <span className="font-semibold">{`${costCodeName}?`}</span>,
    text2: <span className="font-bold">This action cannot be undone.</span>,
  };

  return (
    <NModals
      isOpen={isOpen}
      handleClose={onClose}
      size="sm"
      background={"noOpacity"}
    >
      <Holds className="w-full h-full items-center justify-center text-center pt-3">
        <Contents width="section" className="h-full">
          <Holds className="flex h-1/2">
            <Texts size="p5">
              {`
              ${deleteQuestion.text}
              ${deleteQuestion.itemDeleting}
              ${deleteQuestion.text2}
              `}
            </Texts>
            <Texts size="xs" className="text-gray-500 mt-2">
              This will only work if the cost code is not being used in any
              timesheets.
            </Texts>
          </Holds>
          <Holds className="flex justify-center items-center gap-4 h-1/2">
            <Buttons
              shadow="none"
              background="red"
              className="w-full p-2"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              <Titles size="h5">
                {isDeleting ? "Deleting..." : "Yes, delete it!"}
              </Titles>
            </Buttons>
            <Buttons
              background="lightBlue"
              shadow="none"
              className="w-full p-2"
              onClick={handleClose}
              disabled={isDeleting}
            >
              <Titles size="h5">No, keep it</Titles>
            </Buttons>
          </Holds>
        </Contents>
      </Holds>
    </NModals>
  );
};

// Memoize the modal component to prevent unnecessary re-renders
export default React.memo(DeleteCostCodeModal);
