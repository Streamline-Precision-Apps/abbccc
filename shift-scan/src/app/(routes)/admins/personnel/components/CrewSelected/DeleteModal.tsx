import { Buttons } from "@/components/(reusable)/buttons";
import { Holds } from "@/components/(reusable)/holds";
import { NModals } from "@/components/(reusable)/newmodals";
import { Texts } from "@/components/(reusable)/texts";
import { Titles } from "@/components/(reusable)/titles";
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
      size="xs"
      background={"noOpacity"}
    >
      <Holds className="w-full h-full justify-center items-center px-6">
        <Holds className="w-full h-full justify-center items-center">
          <Texts size={"p7"}>
            Are you sure you want to delete this Crew? This cannot be undone.
          </Texts>
        </Holds>
        <Holds className="mt-4 gap-2">
          <Buttons
            shadow={"none"}
            background={"lightBlue"}
            onClick={onDelete}
            className="py-2 border-none"
          >
            <Titles size="h6" className="">
              Yes, continue.
            </Titles>
          </Buttons>
          <Buttons
            shadow={"none"}
            background={"red"}
            onClick={onClose}
            className="py-2 border-none"
          >
            <Titles size="h6" className="">
              No, go back!
            </Titles>
          </Buttons>
        </Holds>
      </Holds>
    </NModals>
  );
};

export default DeleteModal;
