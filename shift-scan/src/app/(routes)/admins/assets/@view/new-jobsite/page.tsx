"use client";
import { ReusableViewLayout } from "@/app/(routes)/admins/personnel/@view/[employee]/_components/reusableViewLayout";
import { Holds } from "@/components/(reusable)/holds";
import { useState } from "react";
import { createAdminJobsite } from "@/actions/adminActions";
import { z } from "zod";
import { useNotification } from "@/app/context/NotificationContext";
import { useTranslations } from "next-intl";
import { NewJobsitesHeader } from "./_components/NewJobsiteHeader";
import NewJobsitesFooter from "./_components/NewJobsiteFooter";
import NewJobsitesMain from "./_components/NewJobsiteMain";

// Define the Zod schema for Jobsites
const JobsiteSchema = z.object({
  name: z.string().min(1, "Name is required"),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  country: z.string().optional(),
  description: z.string().min(1, "Description is required"),
  comment: z.string().optional(),
});

export default function NewJobsite() {
  const t = useTranslations("Admins");
  const { setNotification } = useNotification();
  const [formState, setFormState] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "US",
    description: "",
    comment: "",
  });

  // Generic handler for field changes
  const handleFieldChange = (field: string, value: string) => {
    setFormState((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const saveEdits = async () => {
    try {
      const parsedData = JobsiteSchema.safeParse(formState);

      if (!parsedData.success) {
        console.error("Validation errors:", parsedData.error.errors);
        setNotification(t("ValidationFields"), "error");
        return;
      }
      const formData = new FormData();
      formData.append("name", formState.name);
      formData.append("address", formState.address);
      formData.append("city", formState.city);
      formData.append("state", formState.state);
      formData.append("zipCode", formState.zipCode);
      formData.append("country", formState.country);
      formData.append("description", formState.description);
      formData.append("comment", formState.comment);

      const response = await createAdminJobsite(formData);
      if (response) {
        setNotification(t("ChangesSavedSuccessfully"), "success");
        setFormState({
          name: "",
          address: "",
          city: "",
          state: "",
          zipCode: "",
          country: "",
          description: "",
          comment: "",
        });
      } else {
        setNotification(t("FailedToSaveChanges"), "error");
      }
    } catch (error) {
      console.error(error);
      setNotification(t("FailedToSaveChanges"), "error");
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
          <NewJobsitesHeader
            editedItem={formState.name}
            commentText={formState.comment}
            editFunction={(value) => handleFieldChange("name", value as string)}
            editCommentFunction={(value) =>
              handleFieldChange("comment", value as string)
            }
          />
        }
        main={
          <Holds className="w-full h-full overflow-y-auto no-scrollbar gap-5">
            <Holds className="w-full h-full">
              <NewJobsitesMain
                formState={formState}
                handleFieldChange={handleFieldChange}
              />
            </Holds>
            {/* <Holds background={"white"} className="w-full h-full">
              <EditTags />
            </Holds> */}
          </Holds>
        }
        footer={<NewJobsitesFooter handleEditForm={saveEdits} />}
      />
    </Holds>
  );
}
