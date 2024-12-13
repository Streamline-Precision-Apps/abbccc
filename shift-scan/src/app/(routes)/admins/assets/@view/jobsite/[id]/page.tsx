"use client";
import { ReusableViewLayout } from "@/app/(routes)/admins/personnel/@view/[employee]/_components/reusableViewLayout";
import { Holds } from "@/components/(reusable)/holds";
import { Texts } from "@/components/(reusable)/texts";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Inputs } from "@/components/(reusable)/inputs";
import { Grids } from "@/components/(reusable)/grids";
import { TextAreas } from "@/components/(reusable)/textareas";
import { Contents } from "@/components/(reusable)/contents";
import { Images } from "@/components/(reusable)/images";
import { Buttons } from "@/components/(reusable)/buttons";
import { Titles } from "@/components/(reusable)/titles";
import { EditableFields } from "@/components/(reusable)/EditableField";
import { deleteAdminJobsite, savejobsiteChanges } from "@/actions/adminActions";
import { useRouter } from "next/navigation";
import { Labels } from "@/components/(reusable)/labels";
import { z } from "zod";
import { useNotification } from "@/app/context/NotificationContext";
import { useTranslations } from "next-intl";

// Define the Zod schema for Jobsites
const JobsiteSchema = z.object({
  name: z.string().min(1, "Name is required"),
  streetNumber: z.string().optional(),
  streetName: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  description: z.string().min(1, "Description is required"),
  comment: z.string().optional(),
});

export default function Jobsites({ params }: { params: { id: string } }) {
  const JobsitesId = params.id;
  const router = useRouter();
  const { setNotification } = useNotification();
  const [formState, setFormState] = useState({
    name: "",
    streetName: "",
    streetNumber: "",
    city: "",
    state: "",
    country: "",
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
          streetName: data.streetName,
          streetNumber: data.streetNumber,
          city: data.city,
          state: data.state,
          country: data.country,
          description: data.description,
          comment: data.comment,
        });
        setOriginalState({
          name: data.name,
          streetName: data.streetName,
          streetNumber: data.streetNumber,
          city: data.city,
          state: data.state,
          country: data.country,
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
        formData.append("streetName", formState.streetName);
        formData.append("streetNumber", formState.streetNumber);
        formData.append("city", formState.city);
        formData.append("state", formState.state);
        formData.append("country", formState.country);
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

//TODO: create edit tags section
export function EditTags() {
  const t = useTranslations("Admins");
  return (
    <Holds background={"white"} className="w-full h-full col-span-2">
      <Texts className="text-black font-bold text-2xl">{t("EditTag")}</Texts>
    </Holds>
  );
}

export function EditJobsitesHeader({
  editedItem,
  commentText,
  editFunction,
  editCommentFunction,
}: {
  editedItem: string;
  commentText: string;
  editFunction?: Dispatch<SetStateAction<string>>;
  editCommentFunction?: Dispatch<SetStateAction<string>>;
}) {
  const [isCommentSectionOpen, setIsCommentSectionOpen] = useState(false);
  const t = useTranslations("Admins");
  const openComment = () => {
    setIsCommentSectionOpen(!isCommentSectionOpen);
  };
  return (
    <Holds
      background={"white"}
      className={`w-full h-full col-span-2 ${
        isCommentSectionOpen ? "row-span-3" : "row-span-1"
      }`}
    >
      {isCommentSectionOpen ? (
        <Contents width={"95"} position={"row"}>
          <Grids
            rows={"5"}
            cols={"5"}
            gap={"2"}
            className=" h-full w-full py-4"
          >
            <Holds className="w-full row-start-1 row-end-2 col-start-1 col-end-4">
              <Inputs
                type="text"
                value={editedItem}
                onChange={(e) => {
                  editFunction?.(e.target.value);
                }}
                placeholder={t("EditTagName")}
                variant={"titleFont"}
                className=" my-auto"
              />
            </Holds>
            <Holds
              position={"row"}
              className="h-full w-full my-1 row-start-2 row-end-3 col-start-1 col-end-2 "
            >
              <Texts size={"p6"} className="mr-2">
                {t("Comment")}
              </Texts>
              <Images
                titleImg="/comment.svg"
                titleImgAlt="comment"
                size={"30"}
                onClick={openComment}
                className="cursor-pointer hover:shadow-black hover:shadow-md"
              />
            </Holds>

            <Holds className="w-full h-full row-start-3 row-end-6 col-start-1 col-end-6">
              <TextAreas
                placeholder={t("EnterYourComment")}
                value={commentText ? commentText : ""}
                onChange={(e) => {
                  editCommentFunction?.(e.target.value);
                }}
                maxLength={40}
                rows={4}
                style={{ resize: "none" }}
              />
            </Holds>
          </Grids>
        </Contents>
      ) : (
        <Grids rows={"2"} cols={"5"} className=" h-full w-full p-4">
          <Holds className="w-full row-start-1 row-end-3 col-start-1 col-end-4 ">
            <Inputs
              type="text"
              value={editedItem}
              placeholder={t("EditTagName")}
              onChange={(e) => {
                editFunction?.(e.target.value);
              }}
              variant={"titleFont"}
              className=" my-auto"
            />
          </Holds>
          <Holds
            position={"row"}
            className="h-full w-full row-start-2 row-end-3 col-start-6 col-end-7 "
          >
            <Texts size={"p6"} className="mr-2">
              {t("Comment")}
            </Texts>
            <Images
              titleImg="/comment.svg"
              titleImgAlt="comment"
              size={"40"}
              onClick={openComment}
              className="cursor-pointer hover:shadow-black hover:shadow-md"
            />
          </Holds>
        </Grids>
      )}
    </Holds>
  );
}
export function EditJobsitesMain({
  formState,
  handleFieldChange,
  hasChanged,
  originalState,
}: {
  formState: {
    name: string;
    streetName: string;
    streetNumber: string;
    city: string;
    state: string;
    country: string;
    description: string;
    comment: string;
  };
  handleFieldChange: (field: string, value: string) => void;
  hasChanged: (
    field:
      | "name"
      | "streetName"
      | "streetNumber"
      | "city"
      | "state"
      | "country"
      | "description"
      | "comment"
  ) => boolean;
  originalState: {
    name: string;
    streetName: string;
    streetNumber: string;
    city: string;
    state: string;
    country: string;
    description: string;
    comment: string;
  };
}) {
  const t = useTranslations("Admins");
  return (
    <Holds background={"white"} className="w-full h-full ">
      <Grids cols={"3"} rows={"3"} gap={"5"} className="w-full h-full p-4  ">
        {/* Input */}
        <Holds className="h-full w-full ">
          <Labels size={"p6"}>
            {t("StreetName")} <span className="text-red-500">*</span>
          </Labels>
          <EditableFields
            value={formState.streetName}
            isChanged={hasChanged("streetName")}
            onChange={(e) => handleFieldChange("streetName", e.target.value)}
            onRevert={() =>
              handleFieldChange("streetName", originalState.streetName)
            }
            variant="default"
            size="default"
          />
        </Holds>
        <Holds className="h-full w-full">
          <Labels size={"p6"}>
            {t("StreetNumber")} <span className="text-red-500">*</span>
          </Labels>
          <EditableFields
            value={formState.streetNumber}
            isChanged={hasChanged("streetNumber")}
            onChange={(e) => handleFieldChange("streetNumber", e.target.value)}
            onRevert={() =>
              handleFieldChange("streetNumber", originalState.streetNumber)
            }
            variant="default"
            size="default"
          />
        </Holds>
        <Holds className="h-full w-full">
          <Labels size={"p6"}>
            {t("City")} <span className="text-red-500">*</span>
          </Labels>
          <EditableFields
            value={formState.city}
            isChanged={hasChanged("city")}
            onChange={(e) => handleFieldChange("city", e.target.value)}
            onRevert={() => handleFieldChange("city", originalState.city)}
            variant="default"
            size="default"
          />
        </Holds>
        <Holds className="h-full w-full">
          <Labels size={"p6"}>
            {t("State")} <span className="text-red-500">*</span>
          </Labels>
          <EditableFields
            value={formState.state}
            isChanged={hasChanged("state")}
            onChange={(e) => handleFieldChange("state", e.target.value)}
            onRevert={() => handleFieldChange("state", originalState.state)}
            variant="default"
            size="default"
          />
        </Holds>
        <Holds className="h-full w-full">
          <Labels size={"p6"}>
            {t("Country")} <span className="text-red-500">*</span>
          </Labels>
          <EditableFields
            value={formState.country}
            isChanged={hasChanged("country")}
            onChange={(e) => handleFieldChange("country", e.target.value)}
            onRevert={() => handleFieldChange("country", originalState.country)}
            variant="default"
            size="default"
          />
        </Holds>
        <Holds className="h-full w-full col-start-1 col-end-4 row-start-3 row-end-4 ">
          <Labels size={"p6"}>
            {t("Description")} <span className="text-red-500">*</span>
          </Labels>
          <TextAreas
            value={formState.description}
            onChange={(e) => handleFieldChange("description", e.target.value)}
          />
        </Holds>
      </Grids>
    </Holds>
  );
}

export function EditJobsitesFooter({
  handleEditForm,
  deleteTag,
}: {
  handleEditForm: () => void;
  deleteTag: () => void;
}) {
  const t = useTranslations("Admins");
  return (
    <Holds
      background={"white"}
      className="w-full h-full row-span-1 col-span-2 "
    >
      <Grids cols={"4"} gap={"4"} className="w-full h-full p-4">
        <Holds className=" col-start-1 col-end-2  ">
          <Buttons
            background={"red"}
            className="py-2"
            onClick={() => {
              deleteTag();
            }}
          >
            <Titles size={"h4"}>{t("DeleteJobsite")}</Titles>
          </Buttons>
        </Holds>

        <Holds className="col-start-4 col-end-5 ">
          <Buttons
            className={"py-2 bg-app-green"}
            onClick={() => handleEditForm()}
          >
            <Titles size={"h4"}>{t("SubmitEdit")}</Titles>
          </Buttons>
        </Holds>
      </Grids>
    </Holds>
  );
}
