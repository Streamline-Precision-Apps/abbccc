import React from "react";
import { Holds } from "@/components/(reusable)/holds";
import { Texts } from "@/components/(reusable)/texts";
import { CheckBox } from "@/components/(inputs)/checkBox";
import { BaseUser } from "./types/personnel";

interface EmployeeRowProps {
  employee: BaseUser; // Use BaseUser type directly
  isSelected: boolean;
  isCrew: boolean;
  isManager: boolean;
  isCrewMember: boolean;
  isCurrentLead: boolean;
  onEmployeeClick: (employee: BaseUser) => void; // Accept employee as argument
  onCrewLeadToggle: (employeeId: string) => void; // Accept employeeId as argument
  onEmployeeCheck: (employee: BaseUser) => void; // Accept employee as argument
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
}) => {
  return (
    <Holds position={"row"} className="w-full gap-2">
      <Holds
        onClick={() => onEmployeeClick(employee)} // Pass employee to handler
        background={isCrewMember ? "lightBlue" : isCrew ? "lightGray" : "white"}
        className={`w-full p-2 ${!isCrew && "hover:bg-gray-100"} relative ${
          isSelected && "w-full py-4 border-[3px] border-black"
        } rounded-[10px]`}
      >
        <Texts position="left" size="xs">
          {`${employee.firstName} ${employee.lastName}`}
        </Texts>
      </Holds>
      {isCrew && (
        <>
          {isManager && (
            <Holds className="w-fit min-w-[35px] h-full flex items-center">
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
                className={`w-[35px] h-[35px] ${
                  isCrewMember
                    ? "cursor-pointer hover:opacity-80"
                    : "cursor-not-allowed opacity-50"
                } transition-opacity`}
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
          <Holds className="w-fit min-w-[35px] h-full flex items-center">
            <CheckBox
              shadow={false}
              checked={isCrewMember}
              onChange={() => onEmployeeCheck(employee)} // Pass employee to handler
              id={`crew-member-${employee.id}`}
              name={`crew-member-${employee.id}`}
              width={30}
              height={30}
            />
          </Holds>
        </>
      )}
    </Holds>
  );
};

export default EmployeeRow;
