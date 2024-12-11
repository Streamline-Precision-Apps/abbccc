"use client";
import { ReusableViewLayout } from "@/app/(routes)/admins/personnel/@view/[employee]/_components/reusableViewLayout";
import { useEffect, useRef, useState } from "react";
import { NewCostCodeForm } from "./_components/NewCostCodeForm";
import { CostCodeLeft } from "@/app/(routes)/admins/assets/@view/cost-code/[id]/_components/CostCodeLeft";
import { CostCodeRight } from "@/app/(routes)/admins/assets/@view/cost-code/[id]/_components/CostCodeRight";
import { NewCostCodeFooter } from "./_components/NewCostCodeFooter";
import { CCTags } from "@/lib/types";
export default function NewCostCodes() {
  const [isFormFilled, setIsFormFilled] = useState(false);
  const [initalTags, setInitialTags] = useState<CCTags[]>([]);
  const [initialSelectedTags, setinitialSelectedTags] = useState<CCTags[]>([]);
  const [selectedTags, setSelectedTags] = useState<CCTags[]>([]);
  const [tagsAttach, setTagsAttach] = useState(false); // Tracks if tags are attached
  const [canSubmit, setCanSubmit] = useState(false);
  const createCostCode = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        // Fetch all tags
        const allTagsRes = await fetch(`/api/getAllTags`);
        const allTagsData = await allTagsRes.json();
        setInitialTags(allTagsData);
        setinitialSelectedTags([]);
        // Fetch connected tags for the current costCode
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    };

    fetchTags();
  }, []);

  const handleSubmitClick = () => {
    createCostCode.current?.dispatchEvent(
      new Event("submit", { bubbles: true, cancelable: true })
    );
  };
  const toggleTagSelection = (tag: CCTags) => {
    setSelectedTags(
      (prev) =>
        prev.some((t) => t.id === tag.id)
          ? prev.filter((t) => t.id !== tag.id) // Remove if already selected
          : [...prev, tag] // Add if not selected
    );
  };
  useEffect(() => {
    if (selectedTags.length > 0) {
      setTagsAttach(true);
    } else {
      setTagsAttach(false);
    }
    setCanSubmit(isFormFilled && tagsAttach);
  }, [isFormFilled, selectedTags.length, tagsAttach]);

  return (
    <ReusableViewLayout
      custom={true}
      header={
        <NewCostCodeForm
          placeholder="New Cost Code"
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
