"use client";
import { createNewCostCode } from "@/actions/adminActions";
import { useNotification } from "@/app/context/NotificationContext";
import { Holds } from "@/components/(reusable)/holds";
import { Inputs } from "@/components/(reusable)/inputs";
import { CCTags } from "@/lib/types";
import { useTranslations } from "next-intl";
import { FormEvent, RefObject, useEffect, useState } from "react";
import { z } from "zod";

const CostCodeSchema = z.object({
  name: z
    .string()
    .min(1, "Cost Code must Have only numbers, #, and .")
    .regex(
      /^[0-9#\\.]+$/,
      "Only numbers, #, and . are allowed in Cost Code Name."
    ),
  description: z
    .string()
    .min(1, "Description is required")
    .regex(
      /^[a-zA-Z0-9\\]+$/,
      "Only letters and numbers are allowed in Cost Code Description."
    ),
});

export function NewCostCodeForm({
  createCostCode,
  placeholder,
  setIsFormFilled,
  selectedTags,
  initialSelectedTags,
}: {
  createCostCode: RefObject<HTMLFormElement>;
  placeholder: string;
  setIsFormFilled?: React.Dispatch<React.SetStateAction<boolean>>;
  selectedTags: CCTags[];
  initialSelectedTags: CCTags[];
}) {
  const t = useTranslations("Admins");
  const { setNotification } = useNotification();
  const [ccName, setCcName] = useState<string>("");
  const [ccDescription, setCcDescription] = useState<string>("");

  const CreateCostCode = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent the page from reloading
    const costcodeData = {
      name: ccName,
      description: ccDescription,
    };
    const validationResult = CostCodeSchema.safeParse(costcodeData);

    if (!validationResult.success) {
      const errorMessages = validationResult.error.errors
        .map((error) => `${error.path.join(" -> ")} ${error.message}`)
        .join(", ");

      // Set notification with detailed validation errors
      setNotification(`${t("ValidationFailed")} ${errorMessages}`, "error");
      return;
    }

    try {
      const formData = new FormData(createCostCode.current!);

      const tagsToAdd = selectedTags.filter(
        (tag) => !initialSelectedTags.some((initTag) => initTag.id === tag.id)
      );
      tagsToAdd.forEach((tag) => formData.append("tags", tag.id.toString()));

      const response = await createNewCostCode(formData);
      if (response) {
        console.log("Cost Code created successfully");
        setNotification(t("CostCodeCreated"), "success");
        if (createCostCode.current) {
          createCostCode.current?.reset();
        }
      } else {
        console.error("Failed to create Cost Code");
        setNotification(t("CostCodeFailedCreation"), "error");
      }
    } catch (error) {
      console.error("Error submitting the form:", error);
      setNotification(t("CostCodeFailedCreation"), "error");
    }
  };

  useEffect(() => {
    if (setIsFormFilled)
      setIsFormFilled(
        ccName.trim().length > 0 && ccDescription.trim().length > 0
      );
  }, [ccName, ccDescription, setIsFormFilled]);

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
          <Inputs
            name="name"
            placeholder={placeholder}
            className="p-2"
            onChange={(e) => {
              setCcName(e.target.value);
            }}
            pattern={"^[0-9#\\.]+$"}
            required
          />
        </Holds>
        <Holds className="w-1/2">
          <Inputs
            type="text"
            name="description"
            className="p-2"
            placeholder={t("CostCodeDescription")}
            onChange={(e) => {
              setCcDescription(e.target.value);
            }}
            pattern={"^[0-9#\\.]+$"}
            required
          />
        </Holds>
      </form>
    </Holds>
  );
}
