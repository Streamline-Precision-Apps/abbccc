"use client";
import { Holds } from "@/components/(reusable)/holds";
import { Titles } from "@/components/(reusable)/titles";
import { Texts } from "@/components/(reusable)/texts";
import React from "react";

/**
 * Empty state component for when no jobsite is selected
 * Displays a message prompting user to select a jobsite
 */
export default function JobsiteEmptyState() {
  return (
    <Holds className="w-full h-full col-start-3 col-end-11 flex items-center justify-center">
      <Holds className="text-center space-y-4">
        <Titles size="h2" className="text-gray-400">
          No Jobsite Selected
        </Titles>
        <Texts size="p3" className="text-gray-500">
          Select a jobsite from the sidebar to view and edit details,
          <br />
          or register a new jobsite to get started.
        </Texts>
      </Holds>
    </Holds>
  );
}
