"use client";

import { changeTags, deleteTagById } from "@/actions/adminActions";
import { ReusableViewLayout } from "@/app/(routes)/admins/personnel/@view/[employee]/_components/reusableViewLayout";
import { Holds } from "@/components/(reusable)/holds";
import { costCodesTag, JobTags } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { z } from "zod";
import { useTranslations } from "next-intl";
import EditTagHeader from "./_Component/EditTagHeader";
import EditTagMainLeft from "./_Component/EditTagLeftMain";
import EditTagMainRight from "./_Component/EditTagRightMain";
import EditTagFooter from "./_Component/EditTagFooter";

const tagSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Tag name is required"),
  description: z.string().optional(),
  jobsite: z.array(
    z.object({
      id: z.string(),
      name: z.string().min(1, "Job name is required"),
      qrId: z.string(), // Ensure qrId is included
    })
  ),
  costCode: z.array(
    z.object({
      id: z.number(),
      name: z.string().min(1, "Cost code name is required"),
      description: z.string(), // Ensure description is required if needed
    })
  ),
});

const jobsSchema = z.array(
  z.object({
    id: z.string(),
    name: z.string().min(1, "Job name is required"),
    qrId: z.string(), // Include qrId as required by JobTags type
  })
);

const costCodesSchema = z.array(
  z.object({
    id: z.number(),
    name: z.string().min(1, "Cost code name is required"),
    description: z.string(), // Ensure description matches type requirement
  })
);

export default function TagView({ params }: { params: { id: string } }) {
  const tagId = params.id;
  const router = useRouter();
  const [editedItem, setEditedItem] = useState<string>("");
  const [commentText, setCommentText] = useState<string>("");
  const [jobs, setJobs] = useState<JobTags[]>([]);
  const [costCodes, setCostCodes] = useState<costCodesTag[]>([]);
  const [initialSelectedJobs, setInitialSelectedJobs] = useState<JobTags[]>([]);
  const [selectedJobs, setSelectedJobs] = useState<JobTags[]>([]);
  const [initialSelectedCostCodes, setInitialSelectedCostCodes] =
    useState<costCodesTag[]>([]);
  const [selectedCostCodes, setSelectedCostCodes] = useState<costCodesTag[]>(
    []
  );
  const t = useTranslations("Admins");

  useEffect(() => {
    const fetchTag = async () => {
      try {
        const response = await fetch(`/api/getTagById/${tagId}`);
        const tagData = await response.json();
        
        setEditedItem(tagData.name);
        setCommentText(tagData.description ?? "");
        setSelectedJobs(tagData.jobsite ?? []);
        setInitialSelectedJobs(tagData.jobsite ?? []);
        setSelectedCostCodes(tagData.costCode ?? []);
        setInitialSelectedCostCodes(tagData.costCode ?? []);
        
        // TODO: Fix this validation.
        // const validatedTag = tagSchema.parse(tagData);

        // setEditedItem(validatedTag.name);
        // setCommentText(validatedTag.description ?? "");
        // setSelectedJobs(validatedTag.jobsite ?? []);
        // setInitialSelectedJobs(validatedTag.jobsite ?? []);
        // setSelectedCostCodes(validatedTag.costCode ?? []);
        // setInitialSelectedCostCodes(validatedTag.costCode ?? []);
        
      } catch (error) {
        console.error("Error fetching or validating tag data:", error);
      }
    };

    fetchTag();
  }, [tagId, t]);

  useEffect(() => {
    const fetchJobsAndCostCodes = async () => {
      try {
        const jobsResponse = await fetch("/api/getAllJobsites");
        const jobsData = await jobsResponse.json();
        const validatedJobs = jobsSchema.parse(jobsData);

        const costCodesResponse = await fetch("/api/getAllCostCodes");
        const costCodesData = await costCodesResponse.json();
        const validatedCostCodes = costCodesSchema.parse(costCodesData);

        setJobs(validatedJobs);
        setCostCodes(validatedCostCodes);
      } catch (error) {
        console.error("Error fetching or validating jobs/cost codes:", error);
      }
    };

    fetchJobsAndCostCodes();
  }, []);

  const toggleJobSelection = (job: JobTags) => {
    setSelectedJobs((prev) =>
      prev.some((j) => j.id === job.id)
        ? prev.filter((j) => j.id !== job.id)
        : [...prev, job]
    );
  };

  const toggleCostCodeSelection = (costCode: costCodesTag) => {
    setSelectedCostCodes((prev) =>
      prev.some((cc) => cc.id === costCode.id)
        ? prev.filter((cc) => cc.id !== costCode.id)
        : [...prev, costCode]
    );
  };

  const handleEditForm = async () => {
    try {
      const payload = {
        id: tagId,
        name: editedItem,
        description: commentText,
        jobs: selectedJobs
          .filter(
            (job) =>
              !initialSelectedJobs.some((initJob) => initJob.id === job.id)
          )
          .map((job) => job.id),
        removeJobs: initialSelectedJobs
          .filter((job) => !selectedJobs.some((j) => j.id === job.id))
          .map((job) => job.id),
        costCodes: selectedCostCodes
          .filter(
            (costCode) =>
              !initialSelectedCostCodes.some(
                (initCostCode) => initCostCode.id === costCode.id
              )
          )
          .map((costCode) => costCode.id),
        removeCostCodes: initialSelectedCostCodes
          .filter(
            (costCode) =>
              !selectedCostCodes.some((cc) => cc.id === costCode.id)
          )
          .map((costCode) => costCode.id),
      };

      const response = await changeTags(payload);
      if (response) {
        setEditedItem(payload.name);
        setCommentText(payload.description);
      }
    } catch (error) {
      console.error("Error updating tag:", error);
    }
  };

  const deleteTag = async () => {
    try {
      const response = await deleteTagById(tagId);
      if (response) {
        router.push("/admins/assets/tags");
      }
    } catch (error) {
      console.error("Error deleting tag:", error);
    }
  };

  return (
    <Holds className="w-full h-full">
      <ReusableViewLayout
        custom={true}
        header={
          <EditTagHeader
            editedItem={editedItem}
            commentText={commentText}
            editFunction={setEditedItem}
            editCommentFunction={setCommentText}
          />
        }
        mainHolds="h-full w-full flex flex-row row-span-6 col-span-2 bg-app-dark-blue px-4 py-2 rounded-[10px] gap-4"
        mainLeft={
          <EditTagMainLeft
            toggleJobSelection={toggleJobSelection}
            toggleCostCodeSelection={toggleCostCodeSelection}
            jobs={jobs}
            costCodes={costCodes}
            selectedJobs={selectedJobs}
            selectedCostCodes={selectedCostCodes}
          />
        }
        mainRight={
          <EditTagMainRight
            selectedJobs={selectedJobs}
            selectedCostCodes={selectedCostCodes}
          />
        }
        footer={
          <EditTagFooter
            handleEditForm={handleEditForm}
            deleteTag={deleteTag}
          />
        }
      />
    </Holds>
  );
}
