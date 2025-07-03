import React from "react";
import { Button } from "@/components/ui/button";

export default function ActionButtons({
  onCancel,
  saveForm,
  isSaveDisabled,
}: {
  onCancel: (() => void) | undefined;
  saveForm: () => void;
  isSaveDisabled: boolean;
}) {
  return (
    <div className="h-[3vh] flex flex-row items-center w-full gap-4 px-2 mb-4">
      <Button
        variant={"outline"}
        size={"sm"}
        className="bg-red-300 border-none"
        onClick={onCancel}
      >
        <div className="flex flex-row items-center">
          <img
            src="/statusDenied.svg"
            alt="Cancel Icon"
            className="w-3 h-3 mr-2"
          />
          <p className="text-xs">Cancel</p>
        </div>
      </Button>
      <Button
        variant={"outline"}
        size={"sm"}
        className="bg-sky-400 border-none"
        onClick={saveForm}
        disabled={isSaveDisabled}
      >
        <div className="flex flex-row items-center">
          <img src="/formSave.svg" alt="Save Icon" className="w-3 h-3 mr-2 " />
          <p className="text-xs">Save</p>
        </div>
      </Button>
      {isSaveDisabled && (
        <p className="text-xs text-red-500 flex items-start">
          Please enter a form name to save
        </p>
      )}
    </div>
  );
}
