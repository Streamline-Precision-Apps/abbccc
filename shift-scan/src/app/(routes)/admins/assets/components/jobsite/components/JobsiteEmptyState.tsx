"use client";
import { Holds } from "@/components/(reusable)/holds";
import { Titles } from "@/components/(reusable)/titles";
import { Texts } from "@/components/(reusable)/texts";
import React from "react";
import { Grids } from "@/components/(reusable)/grids";
import { Buttons } from "@/components/(reusable)/buttons";

/**
 * Empty state component for when no jobsite is selected
 * Displays a message prompting user to select a jobsite
 */
export default function JobsiteEmptyState({
  onRegisterNew,
  successMessage,
  errorMessage,
}: {
  onRegisterNew: () => void;
  successMessage: string | null;
  errorMessage: string | null;
}) {
  return (
    <Holds className="w-full h-full col-span-8">
      <Grids className="w-full h-full grid-rows-[40px_1fr] gap-4">
        <Holds
          background={"white"}
          position={"row"}
          className="w-full h-full rounded-[10px] items-center justify-between relative px-4"
        >
          {successMessage && (
            <Holds
              background={"green"}
              className="w-full h-full absolute top-0 left-0 rounded-[10px] "
            >
              <Texts size="sm">{successMessage}</Texts>
            </Holds>
          )}
          {errorMessage && (
            <Holds
              background={"red"}
              className="w-full h-full absolute top-0 left-0 rounded-[10px]"
            >
              <Texts size="sm">{errorMessage}</Texts>
            </Holds>
          )}
          <Buttons
            background={"none"}
            shadow={"none"}
            onClick={onRegisterNew}
            className="w-fit h-auto"
          >
            <Texts position={"left"} size={"sm"} text={"link"}>
              Register New Jobsite
            </Texts>
          </Buttons>
        </Holds>
      </Grids>
    </Holds>
  );
}
