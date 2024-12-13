"use client";
import { changeTags, deleteTagById } from "@/actions/adminActions";
import { ReusableViewLayout } from "@/app/(routes)/admins/personnel/@view/[employee]/_components/reusableViewLayout";
import { useNotification } from "@/app/context/NotificationContext";
import { Holds } from "@/components/(reusable)/holds";
import { costCodesTag, JobTags } from "@/lib/types";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { z } from "zod";
import EditTagHeader from "./_Component/EditTagHeader";
import EditTagMainLeft from "./_Component/EditTagLeftMain";
import EditTagMainRight from "./_Component/EditTagRightMain";
import EditTagFooter from "./_Component/EditTagFooter";

// Define Zod schemas
const TagSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  jobs: z.array(z.string().uuid()),
  removeJobs: z.array(z.string().uuid()),
  costCodes: z.array(z.string().uuid()),
  removeCostCodes: z.array(z.string().uuid()),
});

const JobTagsSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
});

const CostCodesTagSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string(),
});

export default function TagView({ params }: { params: { id: string } }) {
  const t = useTranslations("Admins");
  const { setNotification } = useNotification();
  const tagId = params.id;
  const router = useRouter();
  const [editedItem, setEditedItem] = useState<string>("");
  const [commentText, setCommentText] = useState<string>("");
  const [jobs, setJobs] = useState<JobTags[]>();
  const [costCodes, setCostCodes] = useState<costCodesTag[]>();
  const [initialSelectedJobs, setInitialSelectedJobs] = useState<JobTags[]>([]);
  const [selectedJobs, setSelectedJobs] = useState<JobTags[]>([]);
  const [initialSelectedCostCodes, setInitialSelectedCostCodes] = useState<
    costCodesTag[]
  >([]);
  const [selectedCostCodes, setSelectedCostCodes] = useState<costCodesTag[]>(
    []
  );

  useEffect(() => {
    const fetchTag = async () => {
      try {
        const response = await fetch(`/api/getTagById/${tagId}`);
        const tagData = await response.json();
        TagSchema.parse(tagData); // Validate tag data

        setEditedItem(tagData.name);
        setCommentText(tagData.description ?? "");
        setSelectedJobs(tagData.jobsite ?? []);
        setInitialSelectedCostCodes(tagData.costCode ?? []);
        setSelectedCostCodes(tagData.costCode ?? []);
        setInitialSelectedJobs(tagData.jobsite ?? []);
      } catch (error) {
        console.error(error);
        setNotification(t("FailedToFetchTagData"), "error");
      }
    };

    fetchTag();
  }, [tagId, setNotification, t]);

  useEffect(() => {
    const fetchJobsAndCostCodes = async () => {
      try {
        const jobsResponse = await fetch("/api/getAllJobsites");
        const jobsData = await jobsResponse.json();
        setJobs(jobsData.map((job: unknown) => JobTagsSchema.parse(job)));

        const costCodesResponse = await fetch("/api/getAllCostCodes");
        const costCodesData = await costCodesResponse.json();
        setCostCodes(
          costCodesData.map((costCode: unknown) =>
            CostCodesTagSchema.parse(costCode)
          )
        );
      } catch (error) {
        console.error(error);
        setNotification(t("FailedToFetchJobData"), "error");
      }
    };

    fetchJobsAndCostCodes();
  }, [setNotification, t]);

  const toggleJobSelection = (job: JobTags) => {
    setSelectedJobs((prev) => {
      if (prev.some((j) => j.id === job.id)) {
        return prev.filter((j) => j.id !== job.id); // Remove if already selected
      } else {
        return [...prev, job]; // Add if not selected
      }
    });
  };

  const toggleCostCodeSelection = (costCode: costCodesTag) => {
    setSelectedCostCodes((prev) => {
      if (prev.some((cc) => cc.id === costCode.id)) {
        return prev.filter((cc) => cc.id !== costCode.id); // Remove if already selected
      } else {
        return [...prev, costCode]; // Add if not selected
      }
    });
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
          .map((job) => job.id), // IDs of jobs to add
        removeJobs: initialSelectedJobs
          .filter((job) => !selectedJobs.some((j) => j.id === job.id))
          .map((job) => job.id), // IDs of jobs to remove
        costCodes: selectedCostCodes
          .filter(
            (costCodes) =>
              !initialSelectedCostCodes.some((c) => c.id === costCodes.id)
          )
          .map((cc) => cc.id), // IDs of costCodes to add
        removeCostCodes: initialSelectedCostCodes
          .filter(
            (costCodes) => !selectedCostCodes.some((c) => c.id === costCodes.id)
          )
          .map((cc) => cc.id), // IDs of costCodes to remove
      };

      // Call changeTags with JSON payload
      const response = await changeTags(payload);
      if (response) {
        setEditedItem(editedItem);
        setCommentText(commentText);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deleteTag = async () => {
    try {
      const response = await deleteTagById(tagId);
      if (response) {
        router.push("/admins/assets/tags");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Holds className="w-full h-full ">
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
            jobs={jobs ?? []}
            costCodes={costCodes ?? []}
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
