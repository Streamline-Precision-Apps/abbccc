import { Buttons } from "@/components/(reusable)/buttons";
import { Holds } from "@/components/(reusable)/holds";
import { NModals } from "@/components/(reusable)/newmodals";
import { Texts } from "@/components/(reusable)/texts";
import { Titles } from "@/components/(reusable)/titles";

interface DiscardChangesModalProps {
  isOpen: boolean;
  confirmDiscardChanges: () => void;
  cancelDiscard: () => void;
  message?: string;
}

const DiscardChangesModal: React.FC<DiscardChangesModalProps> = ({
  isOpen,
  confirmDiscardChanges,
  cancelDiscard,
  message = "You have unsaved equipment changes. Are you sure you want to discard them?",
}) => {
  return (
    <NModals
      isOpen={isOpen}
      handleClose={cancelDiscard}
      size="sm"
      background="noOpacity"
    >
      <Holds className="w-full h-full items-center justify-center text-center px-4">
        <Holds className="w-[90%] flex h-1/2">
          <Texts size="p5">{message}</Texts>
        </Holds>
        <Holds className="w-[80%] flex justify-center items-center gap-4 h-1/2">
          <Buttons
            shadow="none"
            background="lightBlue"
            className="w-full p-1"
            onClick={confirmDiscardChanges}
          >
            <Titles size="sm">Yes, continue.</Titles>
          </Buttons>
          <Buttons
            background="red"
            shadow="none"
            className="w-full p-1"
            onClick={cancelDiscard}
          >
            <Titles size="sm">No, go back!</Titles>
          </Buttons>
        </Holds>
      </Holds>
    </NModals>
  );
};

export default DiscardChangesModal;
