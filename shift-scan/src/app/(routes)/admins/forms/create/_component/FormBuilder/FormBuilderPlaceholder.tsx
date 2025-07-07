import React from "react";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/(animations)/spinner";

export default function FormBuilderPlaceholder({
  loading,
  addField,
}: {
  loading?: boolean;
  addField: (fieldType: string) => void;
}) {
  return (
    <div className="h-full flex flex-col items-center justify-center absolute inset-0">
      {loading ? (
        <Spinner size={40} color="border-app-dark-blue" />
      ) : (
        <>
          <img
            src="/formDuplicate.svg"
            alt="Form Builder Placeholder"
            className="w-12 h-12 mb-2 select-none"
            draggable="false"
          />
          <h2 className="text-lg font-semibold mb-2 select-none">
            Start Building Your Form
          </h2>
          <p className="text-xs text-gray-500 select-none">
            Add fields using the field type buttons on the right, or click below
            to add a text field.
          </p>
          <Button
            variant={"outline"}
            className="mt-4"
            onClick={() => addField("text")}
          >
            <div className="flex flex-row items-center ">
              <img
                src="/plus.svg"
                alt="Add Field Icon"
                className="w-4 h-4 mr-2 select-none "
                draggable="false"
              />
              <p className="text-xs select-none">Add Text Field</p>
            </div>
          </Button>
        </>
      )}
    </div>
  );
}
