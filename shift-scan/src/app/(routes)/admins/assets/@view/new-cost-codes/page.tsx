"use client";
import { useEffect, useRef, useState } from "react";
import { NewCostCodeForm } from "./_components/NewCostCodeForm";
import { CostCodeLeft } from "@/app/(routes)/admins/assets/@view/cost-code/[id]/_components/CostCodeLeft";
import { CostCodeRight } from "@/app/(routes)/admins/assets/@view/cost-code/[id]/_components/CostCodeRight";
import { NewCostCodeFooter } from "./_components/NewCostCodeFooter";
import { z } from "zod";
import { useNotification } from "@/app/context/NotificationContext";
import { ReusableViewLayout } from "../../../personnel/@view/[employee]/_components/reusableViewLayout";
import { useTranslations } from "next-intl";

// Zod schemas
const CCTagSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Tag name is required"),
});

const NewCostCodeSchema = z.object({
  name: z.string().min(1, "Cost code name is required"),
  description: z.string().optional(),
  CCTags: z.array(CCTagSchema),
});

export default function NewCostCodes() {
  const { setNotification } = useNotification(); // Access notification context
  const [isFormFilled, setIsFormFilled] = useState(false);
  const [initalTags, setInitialTags] = useState<z.infer<typeof CCTagSchema>[]>(
    []
  );
  const [initialSelectedTags, setinitialSelectedTags] = useState<
    z.infer<typeof CCTagSchema>[]
  >([]);
  const [selectedTags, setSelectedTags] = useState<
    z.infer<typeof CCTagSchema>[]
  >([]);
  const [tagsAttach, setTagsAttach] = useState(false); // Tracks if tags are attached
  const [canSubmit, setCanSubmit] = useState(false);
  const createCostCode = useRef<HTMLFormElement>(null);
  const t = useTranslations("Admins");
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const allTagsRes = await fetch(`/api/getAllTags`);
        const allTagsData = await allTagsRes.json();

        // Validate and set tags
        const validatedTags = allTagsData.map(
          (tag: z.infer<typeof CCTagSchema>) => CCTagSchema.parse(tag)
        );
        setInitialTags(validatedTags);
        setinitialSelectedTags([]);
      } catch (error) {
        console.error(t("ErrorFetchingCostCodeData"), error);
        setNotification(t("ErrorFetchingCostCodeData"));
      }
    };

    fetchTags();
  }, [setNotification, t]);

  const handleSubmitClick = () => {
    // Trigger form submission
    createCostCode.current?.dispatchEvent(
      new Event("submit", { bubbles: true, cancelable: true })
    );

    // Validate the form data
    try {
      const formData = {
        name: createCostCode.current?.["costCodeName"]?.value || "",
        description: createCostCode.current?.["description"]?.value || "",
        CCTags: selectedTags,
      };

      NewCostCodeSchema.parse(formData);

      // Proceed with form submission
      setNotification(t("NewCostCodeCreatedSuccessfully"));
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessages = error.errors.map((err) => err.message).join(", ");
        setNotification(`${t("ValidationFailed")}: ${errorMessages}`);
      } else {
        console.error("Unexpected error:", error);
        setNotification(t("AnUnexpectedErrorOccurred"));
      }
    }
  };

  const toggleTagSelection = (tag: z.infer<typeof CCTagSchema>) => {
    setSelectedTags(
      (prev) =>
        prev.some((t) => t.id === tag.id)
          ? prev.filter((t) => t.id !== tag.id) // Remove if already selected
          : [...prev, tag] // Add if not selected
    );
  };

  useEffect(() => {
    setTagsAttach(selectedTags.length > 0);
    setCanSubmit(isFormFilled && tagsAttach);
  }, [isFormFilled, selectedTags.length, tagsAttach]);

  return (
    <ReusableViewLayout
      custom={true}
      header={
        <NewCostCodeForm
          placeholder={t("NewCostCode")}
          createCostCode={createCostCode}
          setIsFormFilled={setIsFormFilled}
          selectedTags={selectedTags}
          initialSelectedTags={initialSelectedTags}
        />
      }
      mainHolds="h-full w-full flex flex-row row-span-6 col-span-2 bg-app-dark-blue px-4 py-2 rounded-[10px] gap-4"
      mainLeft={
        <CostCodeLeft
          initalTags={initalTags}
          selectedTags={selectedTags}
          toggleTagSelection={toggleTagSelection}
        />
      }
      mainRight={<CostCodeRight selectedTags={selectedTags} />}
      footer={
        <NewCostCodeFooter
          canSubmit={canSubmit}
          handleSubmitClick={handleSubmitClick}
        />
      }
    />
  );
}
