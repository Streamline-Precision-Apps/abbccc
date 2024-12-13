"use client";
import { ReusableViewLayout } from "@/app/(routes)/admins/personnel/@view/[employee]/_components/reusableViewLayout";
import { Holds } from "@/components/(reusable)/holds";
import { useEffect, useState } from "react";
import { Inputs } from "@/components/(reusable)/inputs";
import { changeCostCodeTags, deleteCostCodeById } from "@/actions/adminActions";
import { useRouter } from "next/navigation";
import { CostCodeRight } from "./_components/CostCodeRight";
import { CostCodeLeft } from "./_components/CostCodeLeft";
import { CCTags } from "@/lib/types";
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
  const t = useTranslations("Admins");
  const [initialCostcodeName, setInitialCostCodeName] = useState<string>("");
  const [initialDescription, setInitialDescription] = useState<string>("");
  const [costcodeId, setCostCodeId] = useState<number>(0);
  const [costcodeName, setCostCodeName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [initialSelectedTags, setinitialSelectedTags] = useState<CCTags[]>([]);
  const [selectedTags, setSelectedTags] = useState<CCTags[]>([]);
  const [initalTags, setInitialTags] = useState<CCTags[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchCostcode = async () => {
      try {
        const res = await fetch(`/api/getCostCodeById/${id}`);
        const data = await res.json();
        setCostCodeId(data.id);
        setCostCodeName(data.name);
        setDescription(data.description);

        setInitialCostCodeName(data.name);
        setInitialDescription(data.description);
      } catch (error) {
        console.log(error);
      }
    };
    fetchCostcode();
  }, [id, t]);

  useEffect(() => {
    // Fix other parameter types
    const fetchTags = async () => {
      try {
        // Fetch all tags
        const allTagsRes = await fetch(`/api/getAllTags`);
        const allTagsData = await allTagsRes.json();
        setInitialTags(allTagsData);
        // Fetch connected tags for the current costCode
        const connectedTagsRes = await fetch(
          `/api/getCostCodeTags/${costcodeId}`
        );
        const connectedTagsData = await connectedTagsRes.json();

        // Extract the connected CCTags
        const connectedTags = connectedTagsData[0]?.CCTags || [];

        // Mark tags as selected only if they are part of the connected tags
        setSelectedTags(
          allTagsData.filter((tag: CCTags) =>
            connectedTags.some((ct: CCTags) => ct.id === tag.id)
          )
        );
        setinitialSelectedTags(
          allTagsData.filter((tag: CCTags) =>
            connectedTags.some((ct: CCTags) => ct.id === tag.id)
          )
        );
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    };

    fetchTags();
  }, [costcodeId, t]);

  const toggleTagSelection = (tag: CCTags) => {
    setSelectedTags(
      (prev) =>
        prev.some((t) => t.id === tag.id)
          ? prev.filter((t) => t.id !== tag.id) // Remove if already selected
          : [...prev, tag] // Add if not selected
    );
  };
  const handleEditForm = async () => {
    try {
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

      // Call the API
      const response = await changeCostCodeTags(formData);
      if (response) {
        setInitialCostCodeName(costcodeName);
        setInitialDescription(description);
      }

      // Optionally: Add user feedback (e.g., success notification)
    } catch (error) {
      console.error("Error updating cost code tags:", error);
      // Optionally: Add error notification
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
