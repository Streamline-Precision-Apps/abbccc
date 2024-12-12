"use client";
import { ReusableViewLayout } from "@/app/(routes)/admins/personnel/@view/[employee]/_components/reusableViewLayout";
import { Holds } from "@/components/(reusable)/holds";
import { Texts } from "@/components/(reusable)/texts";
import { SetStateAction, useState } from "react";
import { Inputs } from "@/components/(reusable)/inputs";
import { Grids } from "@/components/(reusable)/grids";
import { TextAreas } from "@/components/(reusable)/textareas";
import { Contents } from "@/components/(reusable)/contents";
import { Images } from "@/components/(reusable)/images";
import { Buttons } from "@/components/(reusable)/buttons";
import { Titles } from "@/components/(reusable)/titles";
import { createAdminJobsite } from "@/actions/adminActions";
import { Labels } from "@/components/(reusable)/labels";
import { z } from "zod";
import { useNotification } from "@/app/context/NotificationContext";

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

export default function NewJobsite() {
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
        setNotification("Validation errors.", "error");
        return;
      }

      const formData = new FormData();
      formData.append("name", formState.name);
      formData.append("streetName", formState.streetName);
      formData.append("streetNumber", formState.streetNumber);
      formData.append("city", formState.city);
      formData.append("state", formState.state);
      formData.append("country", formState.country);
      formData.append("description", formState.description);
      formData.append("comment", formState.comment);

      const response = await createAdminJobsite(formData);
      if (response) {
        console.log("Changes saved successfully.");
        setFormState({
          name: "",
          streetName: "",
          streetNumber: "",
          city: "",
          state: "",
          country: "",
          description: "",
          comment: "",
        });
      } else {
        console.log("Failed to save changes.");
      }
    } catch (error) {
      console.error(error);
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
            editFunction={(value) => handleFieldChange("name", value as string)}
            editCommentFunction={(value) =>
              handleFieldChange("comment", value as string)
            }
          />
        }
        main={
          <Holds className="w-full h-full overflow-y-auto no-scrollbar gap-5">
            <Holds className="w-full h-full">
              <EditJobsitesMain
                formState={formState}
                handleFieldChange={handleFieldChange}
              />
            </Holds>
            <Holds background={"white"} className="w-full h-full">
              <EditTags />
            </Holds>
          </Holds>
        }
        footer={<EditJobsitesFooter handleEditForm={saveEdits} />}
      />
    </Holds>
  );
}

export function EditTags() {
  return (
    <Holds background={"white"} className="w-full h-full col-span-2">
      <Texts className="text-black font-bold text-2xl">Edit Tag</Texts>
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
  editFunction: (value: SetStateAction<string>) => void;
  editCommentFunction: (value: SetStateAction<string>) => void;
}) {
  const [isCommentSectionOpen, setIsCommentSectionOpen] = useState(false);

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
                  editFunction?.(e.target.value); // Pass the input value to editFunction
                }}
                placeholder={"Enter Jobsite Name"}
                variant={"titleFont"}
                className=" my-auto"
              />
            </Holds>
            <Holds
              position={"row"}
              className="h-full w-full my-1 row-start-2 row-end-3 col-start-1 col-end-2 "
            >
              <Texts size={"p6"} className="mr-2">
                {"Comment"}
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
                placeholder="Enter your comment"
                value={commentText ? commentText : ""}
                onChange={(e) => {
                  editCommentFunction?.(e.target.value); // Pass the input value to editCommentFunction
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
              placeholder={"Enter Jobsite Name"}
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
              Comment
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
}) {
  return (
    <Holds background={"white"} className="w-full h-full ">
      <Grids cols={"3"} rows={"3"} gap={"5"} className="w-full h-full p-4  ">
        {/* Input */}
        <Holds className="h-full w-full ">
          <Labels size={"p6"}>Street Number</Labels>
          <Inputs
            type="text"
            value={formState.streetNumber}
            onChange={(e) => handleFieldChange("streetNumber", e.target.value)}
          />
        </Holds>
        <Holds className="h-full w-full">
          <Labels size={"p6"}>Street Name</Labels>
          <Inputs
            type="text"
            value={formState.streetName}
            onChange={(e) => handleFieldChange("streetName", e.target.value)}
          />
        </Holds>
        <Holds className="h-full w-full">
          <Labels size={"p6"}>City</Labels>
          <Inputs
            type="text"
            value={formState.city}
            onChange={(e) => handleFieldChange("city", e.target.value)}
          />
        </Holds>
        <Holds className="h-full w-full">
          <Labels size={"p6"}>State</Labels>
          <Inputs
            type="text"
            value={formState.state}
            onChange={(e) => handleFieldChange("state", e.target.value)}
          />
        </Holds>
        <Holds className="h-full w-full">
          <Labels size={"p6"}>Country</Labels>
          <Inputs
            type="text"
            value={formState.country}
            onChange={(e) => handleFieldChange("country", e.target.value)}
          />
        </Holds>
        <Holds className="h-full w-full col-start-1 col-end-4 row-start-3 row-end-4 ">
          <Labels size={"p6"}>Description</Labels>
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
}: {
  handleEditForm: () => void;
}) {
  return (
    <Holds
      background={"white"}
      className="w-full h-full row-span-1 col-span-2 "
    >
      <Grids cols={"4"} gap={"4"} className="w-full h-full p-4">
        <Holds className="col-start-4 col-end-5 ">
          <Buttons
            className={"py-2 bg-app-green"}
            onClick={() => handleEditForm()}
          >
            <Titles size={"h4"}>Create Jobsite</Titles>
          </Buttons>
        </Holds>
      </Grids>
    </Holds>
  );
}
