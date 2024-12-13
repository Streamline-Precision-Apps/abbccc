"use client";
import { createTag } from "@/actions/adminActions";
import { ReusableViewLayout } from "@/app/(routes)/admins/personnel/@view/[employee]/_components/reusableViewLayout";
import { Holds } from "@/components/(reusable)/holds";
import { costCodesTag, JobTags } from "@/lib/types";
import { useEffect, useState } from "react";
// import { z } from "zod";
import { useNotification } from "@/app/context/NotificationContext";
import NewTagHeader from "./_Components/NewTagHeader";
import { NewTagMainRight } from "./_Components/NewTagRightMain";
import NewTagFooter from "./_Components/NewTagFooter";
import NewTagMainLeft from "./_Components/NewTagLeftMain";
import { useTranslations } from "next-intl";

// // Zod schema for validation
// export const costCodesTagSchema = z.object({
//   id: z.number(),
//   name: z.string(),
//   description: z.string(),
// });

// export const jobTagsSchema = z.object({
//   id: z.string(),
//   qrId: z.string(),
//   name: z.string(),
// });

// export const tagPayloadSchema = z.object({
//   name: z.string(),
//   description: z.string(),
//   jobs: z.array(jobTagsSchema),
//   costCodes: z.array(costCodesTagSchema),
// });

export default function NewTagView() {
  const [editedItem, setEditedItem] = useState<string>("");
  const [commentText, setCommentText] = useState<string>("");
  const [jobs, setJobs] = useState<JobTags[]>();
  const [costCodes, setCostCodes] = useState<costCodesTag[]>();
  const [selectedJobs, setSelectedJobs] = useState<JobTags[]>([]);
  const { setNotification } = useNotification();
  const [selectedCostCodes, setSelectedCostCodes] = useState<costCodesTag[]>(
    []
  );
  const t = useTranslations("Admins");

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch("/api/getAllJobsites");
        const jobs = (await response.json()) as JobTags[];
        setJobs(jobs ?? []);
        //cost codes
        const response2 = await fetch("/api/getAllCostCodes");
        const costCodes = (await response2.json()) as costCodesTag[];
        setCostCodes(costCodes ?? []);
      } catch (error) {
        console.log(error);
        setNotification(t("FailedToFetchTagData"), "error");
      }
    };
    fetchJobs();
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
  const handleCreateTag = async () => {
    try {
      console.log("selected jobs:", selectedJobs);
      console.log("selected cost codes:", selectedCostCodes);
      const payload = {
        name: editedItem,
        description: commentText,
        jobs: selectedJobs.map((job) => job.id), // IDs of jobs to add

        costCodes: selectedCostCodes.map((cc) => cc.id), // IDs of costCodes to add
      };

      // Call changeTags with JSON payload
      const response = await createTag(payload);
      if (response) {
        setEditedItem(editedItem);
        setCommentText(commentText);
        setSelectedJobs([]);
        setSelectedCostCodes([]);
        setNotification(t("TagCreatedSuccessfully"), "success");
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
