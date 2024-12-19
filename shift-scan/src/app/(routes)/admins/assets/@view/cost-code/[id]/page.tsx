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
import { useTranslations } from "next-intl";

const costCodeSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
});

const tagsSchema = z.array(
  z.object({
    id: z.string(),
    name: z.string().min(1, "Tag name is required"),
  })
);

export default function UpdateCostCodes({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const t = useTranslations("Admins");
  const [initialCostcodeName, setInitialCostCodeName] = useState<string>("");
  const [initialDescription, setInitialDescription] = useState<string>("");
  const [costcodeId, setCostCodeId] = useState<string>("");
  const [costcodeName, setCostCodeName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [initialSelectedTags, setinitialSelectedTags] = useState<CCTags[]>([]);
  const [selectedTags, setSelectedTags] = useState<CCTags[]>([]);
  const [initialTags, setInitialTags] = useState<CCTags[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchCostcode = async () => {
      try {
        const res = await fetch(`/api/getCostCodeById/${id}`);
        const data = await res.json();

        const parsedData = costCodeSchema.parse(data);

        setCostCodeId(parsedData.id);
        setCostCodeName(parsedData.name);
        setDescription(parsedData.description || "");

        setInitialCostCodeName(parsedData.name);
        setInitialDescription(parsedData.description || "");
      } catch (error) {
        console.error("Error fetching cost code or validation failed:", error);
      }
    };
    fetchCostcode();
  }, [id, t]);

  useEffect(() => {
    // Fix other parameter types
    const fetchTags = async () => {
      try {
        const allTagsRes = await fetch(`/api/getAllTags`);
        const allTagsData = await allTagsRes.json();
        const parsedTags = tagsSchema.parse(allTagsData);

        setInitialTags(parsedTags);

        const connectedTagsRes = await fetch(
          `/api/getCostCodeTags/${costcodeId}`
        );
        const connectedTagsData = await connectedTagsRes.json();
        const connectedTags = connectedTagsData[0]?.CCTags || [];

        setSelectedTags(
          parsedTags.filter((tag) =>
            connectedTags.some((ct: CCTags) => ct.id === tag.id)
          )
        );
        setinitialSelectedTags(
          parsedTags.filter((tag) =>
            connectedTags.some((ct: CCTags) => ct.id === tag.id)
          )
        );
      } catch (error) {
        console.error("Error fetching tags or validation failed:", error);
      }
    };

    fetchTags();
  }, [costcodeId, t]);

  const toggleTagSelection = (tag: CCTags) => {
    setSelectedTags((prev) =>
      prev.some((t) => t.id === tag.id)
        ? prev.filter((t) => t.id !== tag.id)
        : [...prev, tag]
    );
  };

  const handleEditForm = async () => {
    try {
      const formData = costCodeSchema.parse({
        id: costcodeId,
        name: costcodeName,
        description,
      });

      const tagsToAdd = selectedTags.filter(
        (tag) => !initialSelectedTags.some((initTag) => initTag.id === tag.id)
      );
      const tagsToRemove = initialSelectedTags.filter(
        (initTag) => !selectedTags.some((tag) => tag.id === initTag.id)
      );

      const requestData = new FormData();
      requestData.append("costcodeId", formData.id);
      requestData.append("name", formData.name);
      requestData.append("description", formData.description || "");

      tagsToAdd.forEach((tag) => requestData.append("tags", tag.id));
      tagsToRemove.forEach((tag) => requestData.append("removeTags", tag.id));

      const response = await changeCostCodeTags(requestData);
      if (response) {
        setInitialCostCodeName(costcodeName);
        setInitialDescription(description);
      }
    } catch (error) {
      console.error("Error validating or updating cost code:", error);
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
            initalTags={initialTags}
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
