import { Buttons } from "@/components/(reusable)/buttons";
import { Holds } from "@/components/(reusable)/holds";
import { NModals } from "@/components/(reusable)/newmodals";
import { Texts } from "@/components/(reusable)/texts";
import { Titles } from "@/components/(reusable)/titles";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  itemName: string;
  itemType: string;
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * A modal to confirm deletion of an item
 * Used for confirming equipment and jobsite deletions
 */
const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  itemName,
  itemType,
  onConfirm,
  onCancel,
}) => {
  return (
    <NModals
      isOpen={isOpen}
      handleClose={onCancel}
      size="sm"
      background="noOpacity"
    >
      <Holds className="w-full h-full items-center justify-center text-center px-4">
        <Holds className="w-[90%] flex h-1/2">
          <Texts size="p5">
            Are you sure you want to delete {itemType}{" "}
            <strong>{itemName}</strong>?
            <br />
            <br />
            <span className="text-red-500">This action cannot be undone.</span>
          </Texts>
        </Holds>
        <Holds className="w-[80%] flex justify-center items-center gap-4 h-1/2">
          <Buttons
            background="red"
            shadow="none"
            className="w-full p-1"
            onClick={onConfirm}
          >
            <Titles size="sm">Yes, delete it</Titles>
          </Buttons>
          <Buttons
            background="lightBlue"
            shadow="none"
            className="w-full p-1"
            onClick={onCancel}
          >
            <Titles size="sm">Cancel</Titles>
          </Buttons>
        </Holds>
      </Holds>
    </NModals>
  );
};

export default DeleteConfirmationModal;
