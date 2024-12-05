"use client";
import { createNewCostCode } from "@/actions/adminActions";
import { Holds } from "@/components/(reusable)/holds";
import { Inputs } from "@/components/(reusable)/inputs";
import { FormEvent, RefObject } from "react";

export function NewCostCodeForm({
  createCostCode,
}: {
  createCostCode: RefObject<HTMLFormElement>;
}) {
  const CreateCostCode = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent the page from reloading
    const formData = new FormData(createCostCode.current!);

    try {
      const response = await createNewCostCode(formData);
      if (response) {
        console.log("Cost Code created successfully");
        console.log(response);
      } else {
        console.error("Failed to create Cost Code");
      }
    } catch (error) {
      console.error("Error submitting the form:", error);
    }
  };

  return (
    <Holds
      background={"white"}
      className="w-full h-full row-span-1 col-span-2  "
    >
      <form
        ref={createCostCode}
        onSubmit={(e) => CreateCostCode(e)}
        className="flex flex-row size-full gap-4 py-2 px-10"
      >
        <Holds className="w-1/2 py-4">
          <Inputs name="name" placeholder="Cost Code" className="p-2" />
        </Holds>
        <Holds className="w-1/2">
          <Inputs
            type="text"
            name="description"
            className="p-2"
            placeholder="Cost Code Description"
          />
        </Holds>
      </form>
    </Holds>
  );
}
