import React from "react";
import { Holds } from "@/components/(reusable)/holds";
import { Texts } from "@/components/(reusable)/texts";
import { CheckBox } from "@/components/(inputs)/checkBox";
import { PersonnelView, UserData } from "../types/personnel";
import DiscardChangesModal from "./DiscardChangesModal";

interface EmployeeRowProps {
  employee: UserData; // Use BaseUser type directly
  isSelected: boolean;
  isCrew: boolean;
  isManager: boolean;
  isCrewMember: boolean;
  isCurrentLead: boolean;
  onEmployeeClick: (employee: UserData) => void; // Accept employee as argument
  onCrewLeadToggle: (employeeId: string) => void; // Accept employeeId as argument
  onEmployeeCheck: (employee: UserData) => void; // Accept employee as argument
  hasUnsavedChanges?: boolean; // Flag to check if there are unsaved changes
  view: PersonnelView; // Current view to determine what's being edited
}

const EmployeeRow: React.FC<EmployeeRowProps> = ({
  employee,
  isSelected,
  isCrew,
  isManager,
  isCrewMember,
  isCurrentLead,
  onEmployeeClick,
  onCrewLeadToggle,
  onEmployeeCheck,
  hasUnsavedChanges = false, // Default to false
  view,
}) => {
  const [showConfirmModal, setShowConfirmModal] = React.useState(false);

  // Handler for employee click with unsaved changes check
  const handleEmployeeClick = () => {
    if (hasUnsavedChanges) {
      // If there are unsaved changes, show confirmation modal
      setShowConfirmModal(true);
    } else {
      // Otherwise process click normally
      onEmployeeClick(employee);
    }
  };

  // Handle confirmation to discard changes and continue
  const handleConfirmNavigation = () => {
    setShowConfirmModal(false);
    onEmployeeClick(employee); // Process the click after confirmation
  };

  // Handle cancellation - stay on current view
  const handleCancelNavigation = () => {
    setShowConfirmModal(false);
  };

  return (
    <>
      <Holds
        position={"row"}
        className="w-full h-[30px] mt-2 items-center gap-2"
      >
        <Holds
          onClick={handleEmployeeClick} // Use our custom handler
          background={
            isCrewMember ? "lightBlue" : isCrew ? "lightGray" : "lightGray"
          }
          className={`w-full h-full flex   ${
            !isCrew && "hover:opacity-80"
          } relative ${
            isSelected &&
            "w-full h-full outline-solid outline-2 outline-black justify-center"
          } rounded-[10px]`}
        >
          <Texts position="left" size="xs">
            {`${employee.firstName} ${employee.lastName}`}
          </Texts>
        </Holds>
        {isCrew && isCrewMember && isManager && (
          <Holds className="flex items-center justify-center w-fit h-full rounded-md ">
            <img
              onClick={() => onCrewLeadToggle(employee.id)} // Pass employeeId to handler
              src={
                isCurrentLead
                  ? "/starFilled.svg"
                  : isCrewMember
                  ? "/star.svg"
                  : "/star.svg"
              }
              alt={
                isCurrentLead
                  ? "Current Crew Lead"
                  : isCrewMember
                  ? "Make Crew Lead"
                  : "Add to crew first"
              }
              className="w-[30px] h-[30px] cursor-pointer hover:opacity-80 transition-opacity"
              title={
                isCurrentLead
                  ? "Current Crew Lead"
                  : isCrewMember
                  ? "Make Crew Lead"
                  : "Add to crew first"
              }
            />
          </Holds>
        )}
        {isCrew && (
          <Holds className="w-fit min-w-[35px] h-full flex justify-center relative">
            <CheckBox
              shadow={false}
              checked={isCrewMember}
              onChange={() => onEmployeeCheck(employee)} // Pass employee to handler
              id={`crew-member-${employee.id}`}
              name={`crew-member-${employee.id}`}
              width={28}
              height={28}
            />
          </Holds>
        )}
      </Holds>

      {/* Confirmation Modal for Unsaved Changes */}
      <DiscardChangesModal
        isOpen={showConfirmModal}
        confirmDiscardChanges={handleConfirmNavigation}
        cancelDiscard={handleCancelNavigation}
        view={view}
      />
    </>
  );
};

export default EmployeeRow;
