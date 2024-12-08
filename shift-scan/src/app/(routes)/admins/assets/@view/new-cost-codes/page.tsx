"use client";
import { ReusableViewLayout } from "@/app/(routes)/admins/personnel/@view/[employee]/_components/reusableViewLayout";
import { useEffect, useRef, useState } from "react";
import { NewCostCodeForm } from "./_components/NewCostCodeForm";
import { CostCodeLeft } from "./_components/CostCodeLeft";
import { CostCodeRight } from "./_components/CostCodeRight";
import { NewCostCodeFooter } from "./_components/NewCostCodeFooter";
export default function NewCostCodes() {
  const [isFormFilled, setIsFormFilled] = useState(false);
  const [tagsAttach, setTagsAttach] = useState(true); // Tracks if tags are attached
  const [canSubmit, setCanSubmit] = useState(false);
  const createCostCode = useRef<HTMLFormElement>(null);

  const handleSubmitClick = () => {
    createCostCode.current?.dispatchEvent(
      new Event("submit", { bubbles: true, cancelable: true })
    );
  };

  useEffect(() => {
    setCanSubmit(isFormFilled && tagsAttach);
  }, [isFormFilled, tagsAttach]);
  return (
    <ReusableViewLayout
      custom={true}
      header={
        <NewCostCodeForm
          placeholder="New Cost Code"
          createCostCode={createCostCode}
          setIsFormFilled={setIsFormFilled}
        />
      }
      mainHolds="h-full w-full flex flex-row row-span-6 col-span-2 bg-app-dark-blue px-4 py-2 rounded-[10px] gap-4"
      mainLeft={<CostCodeLeft setTagsAttach={setTagsAttach} />}
      mainRight={<CostCodeRight />}
      footer={
        <NewCostCodeFooter
          canSubmit={canSubmit}
          handleSubmitClick={handleSubmitClick}
        />
      }
    />
  );
}
