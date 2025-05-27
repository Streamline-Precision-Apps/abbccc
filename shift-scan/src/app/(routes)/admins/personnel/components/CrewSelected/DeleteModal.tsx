import { Buttons } from "@/components/(reusable)/buttons";
import { Holds } from "@/components/(reusable)/holds";
import { NModals } from "@/components/(reusable)/newmodals";
import { Texts } from "@/components/(reusable)/texts";
import { Titles } from "@/components/(reusable)/titles";
import { Contents } from "@/components/(reusable)/contents";
import React from "react";

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
}

const DeleteModal: React.FC<DeleteModalProps> = ({
  isOpen,
  onClose,
  onDelete,
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
              Are you sure you want to delete this Crew? This cannot be undone.
            </Texts>
          </Holds>
          <Holds className="flex justify-center items-center gap-4 h-1/2">
            <Buttons
              shadow="none"
              background="lightBlue"
              className="w-full p-2"
              onClick={onDelete}
            >
              <Titles size="h5">Yes, continue.</Titles>
            </Buttons>
            <Buttons
              background="red"
              shadow="none"
              className="w-full p-2"
              onClick={onClose}
            >
              <Titles size="h5">No, go back!</Titles>
            </Buttons>
          </Holds>
        </Contents>
      </Holds>
    </NModals>
  );
};

export default DeleteModal;
