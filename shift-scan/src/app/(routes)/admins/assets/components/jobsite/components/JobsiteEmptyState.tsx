"use client";
import { Holds } from "@/components/(reusable)/holds";
import { Titles } from "@/components/(reusable)/titles";
import { Texts } from "@/components/(reusable)/texts";
import React from "react";
import { Grids } from "@/components/(reusable)/grids";

/**
 * Empty state component for when no jobsite is selected
 * Displays a message prompting user to select a jobsite
 */
export default function JobsiteEmptyState({
  onRegisterNew,
}: {
  onRegisterNew: () => void;
}) {
  return (
    <Holds className="w-full h-full col-span-8">
      <Grids className="w-full h-full grid-rows-[40px_1fr] gap-4">
        <Holds
          background={"white"}
          className="w-full h-full rounded-[10px]  flex flex-col items-center justify-center"
        >
          <Holds className="px-4">
            <Texts
              position={"left"}
              size={"sm"}
              text={"link"}
              className="cursor-pointer hover:underline font-semibold"
              onClick={onRegisterNew}
            >
              Register New Jobsite
            </Texts>
          </Holds>
        </Holds>
      </Grids>
    </Holds>
  );
}
