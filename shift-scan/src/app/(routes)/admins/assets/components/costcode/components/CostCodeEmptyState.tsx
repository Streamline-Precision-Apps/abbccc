"use client";
import React, { useCallback } from "react";
import { Buttons } from "@/components/(reusable)/buttons";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Texts } from "@/components/(reusable)/texts";
import { CostCodeEmptyStateProps } from "../types";

/**
 * Empty state view when no cost code is selected
 *
 * @param props Component props from CostCodeEmptyStateProps interface
 * @returns An empty state component with action buttons
 */
function CostCodeEmptyState({
  onRegisterNew,
  onRegisterNewGroup,
  successMessage,
  error,
}: CostCodeEmptyStateProps) {
  // Memoize click handlers to prevent unnecessary re-renders
  const handleRegisterNew = useCallback(() => {
    onRegisterNew();
  }, [onRegisterNew]);

  const handleRegisterNewGroup = useCallback(() => {
    onRegisterNewGroup();
  }, [onRegisterNewGroup]);

  return (
    <Holds className="w-full h-full flex flex-col justify-center items-center">
      <Grids className="w-full h-full grid-rows-[40px_1fr]">
        <Holds
          background={"white"}
          position={"row"}
          className="w-full h-full gap-4 px-2 relative"
        >
          <Buttons
            background={"none"}
            shadow={"none"}
            onClick={handleRegisterNew}
            className="w-fit px-2"
          >
            <Texts size="sm" text="link">
              Create New Cost Code
            </Texts>
          </Buttons>
          <Buttons
            background={"none"}
            shadow={"none"}
            onClick={handleRegisterNewGroup}
            className="w-fit px-2"
          >
            <Texts size="sm" text="link">
              Create New Group
            </Texts>
          </Buttons>
          {/* Success and error messages */}
          {successMessage && (
            <Holds
              background={"green"}
              className="w-full h-full absolute top-0 left-0 justify-center items-center rounded-[10px] z-50"
            >
              <Texts size="sm">{successMessage}</Texts>
            </Holds>
          )}
          {error && (
            <Holds
              background={"red"}
              className="w-full h-full absolute top-0 left-0 justify-center items-center rounded-[10px] z-50"
            >
              <Texts size="sm" className=" flex-1 text-center">
                {error}
              </Texts>
            </Holds>
          )}
        </Holds>
      </Grids>
    </Holds>
  );
}

// Memoize the component to prevent unnecessary re-renders
export default React.memo(CostCodeEmptyState);
