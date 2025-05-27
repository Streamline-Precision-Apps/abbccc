import { Buttons } from "@/components/(reusable)/buttons";
import { Contents } from "@/components/(reusable)/contents";
import { Holds } from "@/components/(reusable)/holds";
import { NModals } from "@/components/(reusable)/newmodals";
import { Texts } from "@/components/(reusable)/texts";
import { Titles } from "@/components/(reusable)/titles";
import { PersonnelView } from "../types/personnel";

interface DiscardChangesModalProps {
  isOpen: boolean;
  confirmDiscardChanges: () => void;
  cancelDiscard: () => void;
  view?: PersonnelView; // Current view to determine what's being edited
}

const DiscardChangesModal: React.FC<DiscardChangesModalProps> = ({
  isOpen,
  confirmDiscardChanges,
  cancelDiscard,
  view,
}) => {
  // Determine what's being edited based on the view
  let changeType = "changes";
  if (view) {
    if (view.mode === "user") {
      changeType = "user changes";
    } else if (view.mode === "crew") {
      changeType = "crew changes";
    } else if (view.mode === "user+crew") {
      changeType = "user and crew changes";
    } else if (
      view.mode === "registerUser" ||
      view.mode === "registerUser+crew" ||
      view.mode === "registerBoth"
    ) {
      changeType = "registration form changes";
    }
  }

  return (
    <NModals
      isOpen={isOpen}
      handleClose={cancelDiscard}
      size="sm"
      background="noOpacity"
    >
      <Holds className="w-full h-full items-center justify-center text-center pt-3">
        <Contents width="section" className="h-full">
          <Holds className="flex h-1/2">
            <Texts size="p5">
              You have unsaved {changeType}. Are you sure you want to discard
              them?
            </Texts>
          </Holds>
          <Holds className="flex justify-center items-center gap-4 h-1/2">
            <Buttons
              shadow="none"
              background="lightBlue"
              className="w-full p-2"
              onClick={confirmDiscardChanges}
            >
              <Titles size="h5">Yes, continue.</Titles>
            </Buttons>
            <Buttons
              background="red"
              shadow="none"
              className="w-full p-2"
              onClick={cancelDiscard}
            >
              <Titles size="h5">No, go back!</Titles>
            </Buttons>
          </Holds>
        </Contents>
      </Holds>
    </NModals>
  );
};

export default DiscardChangesModal;
