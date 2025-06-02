"use client";
import { Buttons } from "@/components/(reusable)/buttons";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Texts } from "@/components/(reusable)/texts";

interface CostCodeEmptyStateProps {
  onRegisterNew: () => void;
  onRegisterNewGroup: () => void;
}

/**
 * Empty state view when no cost code is selected
 */
export default function CostCodeEmptyState({
  onRegisterNew,
  onRegisterNewGroup,
}: CostCodeEmptyStateProps) {
  return (
    <Holds className="w-full h-full flex flex-col justify-center items-center">
      <Grids className="w-full h-full grid-rows-[40px_1fr]">
        <Holds
          background={"white"}
          position={"row"}
          className="w-full h-full gap-4 px-2 "
        >
          <Buttons
            background={"none"}
            shadow={"none"}
            onClick={onRegisterNew}
            className="w-fit px-2"
          >
            <Texts size="xs" text="link">
              Register New Cost Code
            </Texts>
          </Buttons>
          <Buttons
            background={"none"}
            shadow={"none"}
            onClick={onRegisterNewGroup}
            className="w-fit px-2"
          >
            <Texts size="xs" text="link">
              Create New Group
            </Texts>
          </Buttons>
        </Holds>
      </Grids>
    </Holds>
  );
}
