"use client";
import { Buttons } from "@/components/(reusable)/buttons";
import { Contents } from "@/components/(reusable)/contents";
import { Forms } from "@/components/(reusable)/forms";
import { Inputs } from "@/components/(reusable)/inputs";
import { Labels } from "@/components/(reusable)/labels";
import { Holds } from "@/components/(reusable)/holds";
import { Selects } from "@/components/(reusable)/selects";
import { TextAreas } from "@/components/(reusable)/textareas";
import { Titles } from "@/components/(reusable)/titles";
import { z } from "zod";
import React, { useState } from "react";

// Zod schema for form validation
const haulingRequestSchema = z.object({
  jobsiteId: z.string().nonempty({ message: "Site number is required" }),
  vehicleId: z.string().nonempty({ message: "Equipment operated is required" }),
  costcode: z.string().nonempty({ message: "Cost code is required" }),
  notes: z.string().max(200, { message: "Max 200 characters" }),
  materialHauled: z.string().nonempty({ message: "Material hauled is required" }),
  quantity: z.number().int().positive({ message: "Quantity must be a positive integer" }),
  userId: z.string().nonempty({ message: "User ID is required" }),
});

type HaulingFormProps = {
  user: string | undefined;
}

export default function HaulingForm({ user }: HaulingFormProps) {
  const [quantity, setQuantity] = useState(1);
  const [errorMessage, setErrorMessage] = useState("");

  // Handle form submission
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.target as HTMLFormElement);
    const formValues = {
      employeeId: user,
      equipmentId: formData.get("vehicleId") as string,
      jobsiteId: formData.get("jobsiteId") as string,
      costcode: formData.get("costcode") as string,
      notes: formData.get("notes") as string,
      materialHauled: formData.get("materialHauled") as string,
      quantity,
    };

    // Validate form data using Zod
    try {
      haulingRequestSchema.parse(formValues);
      // TODO This is where you were working:
      // CreateEmployeeEquipmentLog()
      alert("Hauling request submitted successfully!");
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrorMessage(error.errors[0].message);
      } else {
        console.error("Error submitting hauling request:", error);
      }
    }
  };

  return (
    <>
      {/* Display error message if validation fails */}
      {errorMessage && <Titles>{errorMessage}</Titles>}

      <Forms onSubmit={handleSubmit}>
        <Holds background={"white"} className="mb-3">
          <Contents width="section">
            <Holds>
              <Labels>Site Number</Labels>
              <Inputs type="text" name="jobsiteId" required />
            </Holds>
            <Holds>
              <Labels>Equipment Operated</Labels>
              <Inputs type="text" name="vehicleId" required />
            </Holds>
            <Holds>
              <Labels>Cost Code</Labels>
              <Inputs type="text" name="costcode" required />
            </Holds>
            <Holds>
              <Labels>Notes</Labels>
              <TextAreas name="notes" rows={5} maxLength={200} />
            </Holds>
            <Holds>
              <Labels>Material Hauled</Labels>
              <Selects name="materialHauled" required>
                <option value="">Select One</option>
                <option value="Steel">Steel</option>
                <option value="Wood">Wood</option>
                <option value="Concrete">Concrete</option>
                {/* Add more options as needed */}
              </Selects>
            </Holds>

            {/* Quantity Control */}
            <Holds className="flex justify-between items-center mt-4">
              <Buttons
                type="button"
                onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                className="bg-red-500"
              >
                <Titles size="h2">-</Titles>
              </Buttons>
              <Titles size="h2">{quantity}</Titles>
              <Buttons
                type="button"
                onClick={() => setQuantity((prev) => prev + 1)}
                className="bg-green-500"
              >
                <Titles size="h2">+</Titles>
              </Buttons>
            </Holds>

            {/* Submit Section */}
            <Holds className="mt-4">
              <Buttons type="submit" background={"green"}>
                <Titles size="h2">Submit</Titles>
              </Buttons>
            </Holds>
          </Contents>
        </Holds>
      </Forms>
    </>
  );
}
