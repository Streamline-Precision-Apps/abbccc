"use client";

import { changeTags, deleteTagById } from "@/actions/adminActions";
import { ReusableViewLayout } from "@/app/(routes)/admins/personnel/@view/[employee]/_components/reusableViewLayout";
import { Holds } from "@/components/(reusable)/holds";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { z } from "zod";
import { useTranslations } from "next-intl";
import EditTagHeader from "./_Component/EditTagHeader";
import EditTagMainLeft from "./_Component/EditTagLeftMain";
import EditTagMainRight from "./_Component/EditTagRightMain";
import EditTagFooter from "./_Component/EditTagFooter";
import { useNotification } from "@/app/context/NotificationContext";

// Validation schema for CostCode
const costCodeSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Cost code name is required"),
  description: z.string().min(1, "Cost code description is required"), // Description must be present
  createdAt: z.string().datetime(), // Validate datetime string
  updatedAt: z.string().datetime(), // Validate datetime string
});

// Validation schema for CCTag
const ccTagSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Tag name is required"),
  description: z.string().optional(),
  jobsites: z.array(
    z.object({
      id: z.string(),
      qrId: z.string().min(1, "QR ID is required"),
      name: z.string().min(1, "Jobsite name is required"),
      description: z.string().min(1, "Jobsite description is required"),
      isActive: z.boolean(),
      address: z.string().min(1, "Address is required"),
      city: z.string().min(1, "City is required"),
      state: z.string().min(1, "State is required"),
      zipCode: z.string().min(1, "Zip code is required"),
      country: z.string().min(1, "Country is required"),
      createdAt: z.string().datetime(), // Validate datetime string
      updatedAt: z.string().datetime(), // Validate datetime string
      archiveDate: z.string().datetime().optional(), // Optional datetime
    })
  ),
  costCodes: z.array(costCodeSchema),
});

// Validation schema for Jobsite
const jobsiteSchema = z.object({
  id: z.string(),
  qrId: z.string().min(1, "QR ID is required"),
  name: z.string().min(1, "Jobsite name is required"),
  description: z.string().min(1, "Description is required"),
  isActive: z.boolean(),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zipCode: z.string().min(1, "Zip code is required"),
  country: z.string().min(1, "Country is required"),
  comment: z.string().optional(),
  createdAt: z.string().datetime(), // Validate datetime string
  updatedAt: z.string().datetime(), // Validate datetime string
  archiveDate: z.string().datetime().optional(), // Optional datetime
  costCodes: z.array(ccTagSchema),
});

// Combined validation schema for a Tag
const tagSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Tag name is required"),
  description: z.string().optional(),
  jobsites: z.array(jobsiteSchema),
  costCodes: z.array(costCodeSchema),
});

export default function TagView({ params }: { params: { id: string } }) {
  const tagId = params.id;
  const router = useRouter();
  const [editedItem, setEditedItem] = useState<string>("");
  const [commentText, setCommentText] = useState<string>("");
  const [jobs, setJobs] = useState<JobTags[]>([]);
  const [costCodes, setCostCodes] = useState<costCodesTag[]>([]);
  const [initialSelectedJobs, setInitialSelectedJobs] = useState<JobTags[]>([]);
  const [selectedJobs, setSelectedJobs] = useState<JobTags[]>([]);
  const [initialSelectedCostCodes, setInitialSelectedCostCodes] = useState<
    costCodesTag[]
  >([]);
  const [selectedCostCodes, setSelectedCostCodes] = useState<costCodesTag[]>(
    []
  );
  const t = useTranslations("Admins");
  const { setNotification } = useNotification();

  useEffect(() => {
    const fetchTag = async () => {
      try {
        const response = await fetch(`/api/getTagById/${tagId}`);
        const tagData = await response.json();

        const validatedTag = tagSchema.parse(tagData);

        setEditedItem(validatedTag.name);
        setCommentText(validatedTag.description ?? "");
        setSelectedJobs(validatedTag.jobsites ?? []);
        setInitialSelectedJobs(validatedTag.jobsites ?? []);
        setSelectedCostCodes(validatedTag.costCodes ?? []);
        setInitialSelectedCostCodes(validatedTag.costCodes ?? []);
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
        const validatedJobs = jobsiteSchema.parse(jobsData);
        console.log("validatedJobs", validatedJobs);
        setJobs([validatedJobs]);

        const costCodesResponse = await fetch("/api/getAllCostCodes");
        const costCodesData = await costCodesResponse.json();
        const validatedCostCodes = costCodeSchema.parse(costCodesData);
        console.log("validatedCostCodes", validatedCostCodes);
        setCostCodes([validatedCostCodes]);
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
            (costCode) => !selectedCostCodes.some((cc) => cc.id === costCode.id)
          )
          .map((costCode) => costCode.id),
      };

      const response = await changeTags(payload);
      if (response) {
        setEditedItem(payload.name);
        setCommentText(payload.description);
        setNotification(t("TagUpdatedSuccessfully"), "success");
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
