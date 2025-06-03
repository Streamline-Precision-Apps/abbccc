import { Buttons } from "@/components/(reusable)/buttons";
import { Holds } from "@/components/(reusable)/holds";
import { NModals } from "@/components/(reusable)/newmodals";
import { Texts } from "@/components/(reusable)/texts";
import { Titles } from "@/components/(reusable)/titles";
import { Contents } from "@/components/(reusable)/contents";
import React from "react";

interface DeleteCostCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
  costCodeName?: string;
  isDeleting?: boolean;
}

const DeleteCostCodeModal: React.FC<DeleteCostCodeModalProps> = ({
  isOpen,
  onClose,
  onDelete,
  costCodeName,
  isDeleting = false,
}) => {
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
              Are you sure you want to delete the cost code{" "}
              {costCodeName && (
                <span className="font-bold">"{costCodeName}"</span>
              )}
              ? This action cannot be undone.
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
              onClick={onDelete}
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
              onClick={onClose}
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

export default DeleteCostCodeModal;
