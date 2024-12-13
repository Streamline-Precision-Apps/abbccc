"use client";
import { ReusableViewLayout } from "@/app/(routes)/admins/personnel/@view/[employee]/_components/reusableViewLayout";
import { Holds } from "@/components/(reusable)/holds";
import { useEffect, useState } from "react";
import { Inputs } from "@/components/(reusable)/inputs";
import { changeCostCodeTags, deleteCostCodeById } from "@/actions/adminActions";
import { useRouter } from "next/navigation";
import { CostCodeRight } from "./_components/CostCodeRight";
import { CostCodeLeft } from "./_components/CostCodeLeft";
import { EditCostCodeForm } from "./_components/EditCostCodeForm";
import { EditCostCodeFooter } from "./_components/CostCodeFooter";
import { z } from "zod";
import { useNotification } from "@/app/context/NotificationContext";
import { useTranslations } from "next-intl";

// Define Zod schemas
const CCTagSchema = z.object({
  id: z.number().int(),
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  jobsite: z.array(z.object({ id: z.number(), name: z.string() })).optional(),
  costCode: z.array(z.object({ id: z.number(), name: z.string() })).optional(),
});

const CostCodeSchema = z.object({
  id: z.number().int(),
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  type: z.string().min(1, "Type is required"),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export default function UpdateCostCodes({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const { setNotification } = useNotification();
  const [initialCostcodeName, setInitialCostCodeName] = useState<string>("");
  const [initialDescription, setInitialDescription] = useState<string>("");
  const [costcodeId, setCostCodeId] = useState<number>(Number(id));
  const [costcodeName, setCostCodeName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [initialSelectedTags, setinitialSelectedTags] = useState<
    z.infer<typeof CCTagSchema>[]
  >([]);
  const [selectedTags, setSelectedTags] = useState<
    z.infer<typeof CCTagSchema>[]
  >([]);
  const [initalTags, setInitialTags] = useState<z.infer<typeof CCTagSchema>[]>(
    []
  );
  const router = useRouter();
  const t = useTranslations("Admins");

  useEffect(() => {
    const fetchCostcode = async () => {
      try {
        const res = await fetch(`/api/getCostCodeById/${id}`);
        const data = await res.json();

        // Validate fetched cost code data
        const validatedData = CostCodeSchema.parse(data);

        setCostCodeId(validatedData.id);
        setCostCodeName(validatedData.name);
        setDescription(validatedData.description);

        setInitialCostCodeName(validatedData.name);
        setInitialDescription(validatedData.description);
      } catch (error) {
        console.error(t("ErrorFetchingCostCodeData"), error);
      }
    };
    fetchCostcode();
  }, [id]);

  useEffect(() => {
    const toggleTagSelection = (tag: z.infer<typeof CCTagSchema>) => {
      setSelectedTags(
        (prev) =>
          prev.some((t) => t.id === tag.id)
            ? prev.filter((t) => t.id !== tag.id) // Remove if already selected
            : [...prev, tag] // Add if not selected
      );
    };

    // Fix other parameter types
    const fetchTags = async () => {
      try {
        // Fetch all tags
        const allTagsRes = await fetch(`/api/getAllTags`);
        const allTagsData: z.infer<typeof CCTagSchema>[] =
          await allTagsRes.json(); // Use correct type
        setInitialTags(allTagsData);

        // Fetch connected tags for the current costCode
        const connectedTagsRes = await fetch(
          `/api/getCostCodeTags/${costcodeId}`
        );
        const connectedTagsData: { CCTags: z.infer<typeof CCTagSchema>[] }[] =
          await connectedTagsRes.json();
        const connectedTags = connectedTagsData[0]?.CCTags || [];

        // Mark tags as selected only if they are part of the connected tags
        const selected = allTagsData.filter(
          (tag: z.infer<typeof CCTagSchema>) =>
            connectedTags.some(
              (ct: z.infer<typeof CCTagSchema>) => ct.id === tag.id
            )
        );
        setSelectedTags(selected);
        setinitialSelectedTags(selected);
      } catch (error) {
        console.error(t("ErrorFetchingCostCodeData"), error);
      }
    };

    fetchTags();
  }, [costcodeId]);

  const toggleTagSelection = (tag: z.infer<typeof CCTagSchema>) => {
    setSelectedTags(
      (prev) =>
        prev.some((t) => t.id === tag.id)
          ? prev.filter((t) => t.id !== tag.id) // Remove if already selected
          : [...prev, tag] // Add if not selected
    );
  };

  const handleEditForm = async () => {
    try {
      // Prepare form data
      const formData = new FormData();
      formData.append("costcodeId", costcodeId.toString());
      formData.append("name", costcodeName);
      formData.append("description", description);

      // Separate selected tags into add and remove
      const tagsToAdd = selectedTags.filter(
        (tag) => !initialSelectedTags.some((initTag) => initTag.id === tag.id)
      );
      const tagsToRemove = initialSelectedTags.filter(
        (initTag) => !selectedTags.some((tag) => tag.id === initTag.id)
      );

      // Append tags to add
      tagsToAdd.forEach((tag) => formData.append("tags", tag.id.toString()));

      // Append tags to remove
      tagsToRemove.forEach((tag) =>
        formData.append("removeTags", tag.id.toString())
      );

      // Validate data
      try {
        CostCodeSchema.parse({
          id: costcodeId,
          name: costcodeName,
          description,
          CCTags: selectedTags,
        });
      } catch (validationError) {
        if (validationError instanceof z.ZodError) {
          // Collect validation errors
          const errorMessages = validationError.errors
            .map((err) => err.message)
            .join(", ");
          setNotification(`Validation failed: ${errorMessages}`); // Set notification
          return; // Stop further processing
        }
        throw validationError; // Rethrow unexpected errors
      }

      // Call the API
      const response = await changeCostCodeTags(formData);
      if (response) {
        setInitialCostCodeName(costcodeName);
        setInitialDescription(description);
        setNotification("Cost code updated successfully!"); // Success notification
      }
    } catch (error) {
      console.error("Error updating cost code tags:", error);
      setNotification("An error occurred while updating the cost code."); // Error notification
    }
  };

  const deleteCostCode = async () => {
    try {
      const res = await deleteCostCodeById(costcodeId);
      if (res) {
        setCostCodeName("");
        setDescription("");
        router.push("/admins/assets/cost-code");
      }
    } catch (error) {
      console.error("Error deleting cost code:", error);
    }
  };

  return (
    <Holds className="w-full h-full ">
      <Inputs hidden={true} value={costcodeId} />
      <ReusableViewLayout
        custom={true}
        header={
          <EditCostCodeForm
            initialCostcodeName={initialCostcodeName}
            initialDescription={initialDescription}
            costcodeName={costcodeName}
            description={description}
            setCostCodeName={setCostCodeName}
            setDescription={setDescription}
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
          <EditCostCodeFooter
            handleEditForm={handleEditForm}
            deleteCostCode={deleteCostCode}
          />
        }
      />
    </Holds>
  );
}
