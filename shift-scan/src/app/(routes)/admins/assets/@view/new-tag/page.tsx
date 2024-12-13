"use client";
import { createTag } from "@/actions/adminActions";
import { ReusableViewLayout } from "@/app/(routes)/admins/personnel/@view/[employee]/_components/reusableViewLayout";
import { Holds } from "@/components/(reusable)/holds";
import { costCodesTag, JobTags } from "@/lib/types";
import { useEffect, useState } from "react";
import { z } from "zod";
import { useNotification } from "@/app/context/NotificationContext";
import NewTagHeader from "./_Components/NewTagHeader";
import { NewTagMainRight } from "./_Components/NewTagRightMain";
import NewTagFooter from "./_Components/NewTagFooter";
import NewTagMainLeft from "./_Components/NewTagLeftMain";

// Zod schema for validation
const tagPayloadSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  jobs: z.array(z.string()).nonempty("At least one job must be selected"),
  costCodes: z
    .array(z.string())
    .nonempty("At least one cost code must be selected"),
});

export default function NewTagView() {
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
  const { setNotification } = useNotification();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch("/api/getAllJobsites");
        const jobs = (await response.json()) as JobTags[];
        setInitialSelectedJobs(jobs ?? []);
        setJobs(jobs ?? []);
        // Fetch cost codes
        const response2 = await fetch("/api/getAllCostCodes");
        const costCodes = (await response2.json()) as costCodesTag[];
        setInitialSelectedCostCodes(costCodes ?? []);
        setCostCodes(costCodes ?? []);
      } catch (error) {
        console.log(error);
      }
    };
    fetchJobs();
  }, []);

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
  const handleCreateTag = async () => {
    try {
      const payload = {
        name: editedItem,
        description: commentText,
        jobs: selectedJobs
          .filter(
            (job) =>
              !initialSelectedJobs.some((initJob) => initJob.id === job.id)
          )
          .map((job) => job.id), // IDs of jobs to add

        costCodes: selectedCostCodes
          .filter(
            (costCode) =>
              !initialSelectedCostCodes.some((c) => c.id === costCode.id)
          )
          .map((cc) => cc.id), // IDs of cost codes to add
      };

      // Validate the payload with Zod
      const validation = tagPayloadSchema.safeParse(payload);

      if (!validation.success) {
        console.error("Validation failed:", validation.error.format());
        setNotification("Data Validation Error", "error");
        return; // Exit if validation fails
      }

      // Call createTag with the validated payload
      const response = await createTag(payload);
      if (response) {
        setEditedItem("");
        setCommentText("");
        setSelectedJobs([]);
        setSelectedCostCodes([]);
        setNotification("Tag created successfully", "success");
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
          <NewTagHeader
            editedItem={editedItem}
            commentText={commentText}
            editFunction={setEditedItem}
            editCommentFunction={setCommentText}
          />
        }
        mainHolds="h-full w-full flex flex-row row-span-6 col-span-2 bg-app-dark-blue px-4 py-2 rounded-[10px] gap-4"
        mainLeft={
          <NewTagMainLeft
            toggleJobSelection={toggleJobSelection}
            toggleCostCodeSelection={toggleCostCodeSelection}
            jobs={jobs ?? []}
            costCodes={costCodes ?? []}
            selectedJobs={selectedJobs}
            selectedCostCodes={selectedCostCodes}
          />
        }
        mainRight={
          <NewTagMainRight
            selectedJobs={selectedJobs}
            selectedCostCodes={selectedCostCodes}
          />
        }
        footer={<NewTagFooter handleEditForm={handleCreateTag} />}
      />
    </Holds>
  );
}
