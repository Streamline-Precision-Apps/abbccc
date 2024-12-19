"use client";
import { ReusableViewLayout } from "@/app/(routes)/admins/personnel/@view/[employee]/_components/reusableViewLayout";
import { Holds } from "@/components/(reusable)/holds";
import { useEffect, useState } from "react";

import { deleteAdminJobsite, savejobsiteChanges } from "@/actions/adminActions";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useNotification } from "@/app/context/NotificationContext";
import { useTranslations } from "next-intl";
import EditJobsitesHeader from "./_component/jobsiteHeader";
import { EditJobsitesMain } from "./_component/JobsiteMain";
import { EditJobsitesFooter } from "./_component/jobsiteFooter";

// Define the Zod schema for Jobsites
const JobsiteSchema = z.object({
  name: z.string().min(1, "Name is required"),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  zipCode: z.string().optional(),
  description: z.string().min(1, "Description is required"),
  comment: z.string().optional(),
});

export default function Jobsites({ params }: { params: { id: string } }) {
  const JobsitesId = params.id;
  const router = useRouter();
  const { setNotification } = useNotification();
  const [formState, setFormState] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    country: "",
    zipCode: "",
    description: "",
    comment: "",
  });

  const [originalState, setOriginalState] = useState(formState);
  const t = useTranslations("Admins");
  useEffect(() => {
    const fetchJobsites = async () => {
      try {
        const response = await fetch(`/api/getJobsiteById/${JobsitesId}`);
        const data = await response.json();
        setFormState({
          name: data.name,
          address: data.address,
          city: data.city,
          state: data.state,
          country: data.country,
          zipCode: data.zipCode,
          description: data.description,
          comment: data.comment,
        });
        setOriginalState({
          name: data.name,
          address: data.address,
          city: data.city,
          state: data.state,
          country: data.country,
          zipCode: data.zipCode,
          description: data.description,
          comment: data.comment,
        });
      } catch (error) {
        console.error(error);
      }
    };
    fetchJobsites();
  }, [JobsitesId]);

  // Generic handler for field changes
  const handleFieldChange = (field: string, value: string) => {
    setFormState((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Determine if a field has changed
  const hasChanged = (field: keyof typeof originalState) =>
    formState[field] !== originalState[field];

  const saveEdits = async () => {
    try {
      const parsedData = JobsiteSchema.safeParse(formState);

      if (!parsedData.success) {
        console.error(t("ValidationError"), parsedData.error.errors);
        setNotification(t("ValidationError"), "error");
        return;
      }
      if (formState !== originalState) {
        const formData = new FormData();
        formData.append("id", JobsitesId);
        formData.append("name", formState.name);
        formData.append("address", formState.address);
        formData.append("city", formState.city);
        formData.append("state", formState.state);
        formData.append("country", formState.country);
        formData.append("zipCode", formState.zipCode);
        formData.append("description", formState.description);
        formData.append("comment", formState.comment);

        const response = await savejobsiteChanges(formData);
        if (response) {
          setOriginalState(formState);
          setNotification(t("ChangesSavedSuccessfully"), "success");
        } else {
          throw new Error(t("APIErrorSaveChanges"));
        }
      }
    } catch (error) {
      console.error(error);
      setNotification(t("FailedToSaveChanges"), "error");
    }
  };
  const removeJobsite = async () => {
    try {
      const response = await deleteAdminJobsite(JobsitesId);
      if (response.success) {
        router.push("/admins/assets/jobsite");
        setNotification(t("JobsiteDeletedSuccessfully"), "success");
      } else {
        throw new Error(t("APIErrorDeleteJobsite"));
      }
    } catch (error) {
      console.error(error);
      setNotification(t("FailedToDeleteJobsite"), "error");
    }
  };

  return (
    <Holds className="w-full h-full ">
      <ReusableViewLayout
        custom={true}
        mainHolds={
          "h-full w-full flex flex-col col-span-2 row-span-6 px-5 py-2"
        }
        header={
          <EditJobsitesHeader
            editedItem={formState.name}
            commentText={formState.comment}
            editFunction={() => {
              handleFieldChange("name", formState.name);
            }}
            editCommentFunction={() => {
              handleFieldChange("comment", formState.comment);
            }}
          />
        }
        main={
          <Holds className="w-full h-full overflow-y-auto no-scrollbar gap-5">
            <Holds className="w-full h-full">
              <EditJobsitesMain
                formState={formState}
                handleFieldChange={handleFieldChange}
                hasChanged={hasChanged}
                originalState={originalState}
              />
            </Holds>
            {/* <Holds background={"white"} className="w-full h-full">
              <EditTags />
            </Holds> */}
          </Holds>
        }
        footer={
          <EditJobsitesFooter
            handleEditForm={saveEdits}
            deleteTag={removeJobsite}
          />
        }
      />
    </Holds>
  );
}

// //TODO: create edit tags section
// export function EditTags() {
//   const t = useTranslations("Admins");
//   return (
//     <Holds background={"white"} className="w-full h-full col-span-2">
//       <Texts className="text-black font-bold text-2xl">{t("EditTag")}</Texts>
//     </Holds>
//   );
// }
