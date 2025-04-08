"use client";
import { FormInput } from "./formInput";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { updateFormApproval } from "@/actions/hamburgerActions";
import { useRouter } from "next/navigation";
import { Buttons } from "@/components/(reusable)/buttons";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Images } from "@/components/(reusable)/images";
import { Labels } from "@/components/(reusable)/labels";
import { TextAreas } from "@/components/(reusable)/textareas";
import { Texts } from "@/components/(reusable)/texts";
import { Titles } from "@/components/(reusable)/titles";
import { Contents } from "@/components/(reusable)/contents";
import { Selects } from "@/components/(reusable)/selects";
import { useAutoSave } from "@/hooks/(inbox)/useAutoSave";
import { format } from "date-fns";

interface FormField {
  id: string;
  label: string;
  name: string;
  type: string;
  required: boolean;
  order: number;
  defaultValue?: string;
  placeholder?: string;
  maxLength?: number;
  helperText?: string;
  options?: string[];
}

interface FormGrouping {
  id: string;
  title: string;
  order: number;
  fields: FormField[];
}

interface FormTemplate {
  id: string;
  name: string;
  formType: string;
  isActive: boolean;
  isSignatureRequired: boolean;
  groupings: FormGrouping[];
}

type ManagerFormApprovalSchema = {
  id: string;
  title: string;
  formTemplateId: string;
  userId: string;
  formType: string | null;
  data: {
    comments: string;
    request_type: string;
    request_end_date: string;
    request_start_date: string;
  };
  createdAt: string;
  updatedAt: string;
  submittedAt: string;
  status: FormStatus;
  approvals: Array<{
    id: string;
    formSubmissionId: string;
    signedBy: string;
    submittedAt: string;
    updatedAt: string;
    signature: string;
    comment: string;
    approver: {
      firstName: string;
      lastName: string;
    };
  }>;
};

enum FormStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  DENIED = "DENIED",
  DRAFT = "DRAFT",
}

export default function ManagerFormEditApproval({
  formData,
  formTitle,
  formValues,
  submissionStatus,
  signature,
  submittedForm,
  submissionId,
  managerFormApproval,
  setFormTitle,
  updateFormValues,
}: {
  formData: FormTemplate;
  formValues: Record<string, string>;
  formTitle: string;
  submissionStatus: string | null;
  signature: string | null;
  submittedForm: string | null;
  submissionId: string | null;
  managerFormApproval: ManagerFormApprovalSchema | null;
  setFormTitle: Dispatch<SetStateAction<string>>;
  updateFormValues: (newValues: Record<string, string>) => void;
}) {
  const router = useRouter();
  const [comment, setComment] = useState<string>(
    managerFormApproval?.approvals?.[0]?.comment || ""
  );
  const [approvalStatus, setApprovalStatus] = useState<FormStatus>(
    managerFormApproval?.status || FormStatus.PENDING
  );

  // Handle comment change
  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newComment = e.target.value;
    setComment(newComment);
  };

  // Handle approval status change
  const handleApprovalStatusChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newStatus = e.target.value as FormStatus;
    setApprovalStatus(newStatus);
  };

  // Handle updating approval
  const handleAutoSave = async (data: {
    comment: string;
    approvalStatus: FormStatus;
  }) => {
    if (!submissionId || !managerFormApproval) return;

    const updatedData = new FormData();
    updatedData.append("id", managerFormApproval.approvals[0].id);
    updatedData.append("formSubmissionId", submissionId);
    updatedData.append("comment", data.comment);

    // Map approvalStatus to isApproved (boolean)
    const isApproved = data.approvalStatus === FormStatus.APPROVED;
    updatedData.append("isApproved", isApproved.toString()); // Convert boolean to string

    try {
      await updateFormApproval(updatedData);
    } catch (error) {
      console.error("Error during auto-save:", error);
    }
  };

  const debouncedAutoSave = useAutoSave(handleAutoSave, 1000);

  useEffect(() => {
    debouncedAutoSave({ comment, approvalStatus });
  }, [comment, approvalStatus, debouncedAutoSave]);

  return (
    <>
      <Holds
        background={"white"}
        className="row-start-1 row-end-2 h-full justify-center px-3 "
      >
        <Grids cols={"5"} rows={"2"} className="w-full h-full p-2">
          <Holds className="col-span-1 row-span-2 flex items-center justify-center">
            <Buttons
              onClick={() => router.back()}
              background={"none"}
              position={"left"}
            >
              <Images
                titleImg="/turnBack.svg"
                titleImgAlt={"Turn Back"}
                className="max-w-8 h-auto object-contain"
              />
            </Buttons>
          </Holds>

          <Holds className="col-start-2 col-end-5 row-start-1 row-end-3 flex items-center justify-center">
            <Titles size={"h4"}>{formTitle}</Titles>
            <Titles size={"h6"}>{formData.name}</Titles>
          </Holds>
        </Grids>
      </Holds>

      <Holds
        background={"white"}
        className="w-full h-full row-start-2 row-end-5 px-5 "
      >
        <Holds className="overflow-y-auto no-scrollbar ">
          {formData?.groupings?.map((group) => (
            <Holds key={group.id} className="">
              {group.title && <h3>{group.title || ""}</h3>}
              {group.fields.map((field) => {
                return (
                  <Holds key={field.id} className="pb-1">
                    <FormInput
                      key={field.name}
                      field={field}
                      formValues={formValues}
                      setFormValues={() => {}}
                      readOnly={true}
                    />
                  </Holds>
                );
              })}
            </Holds>
          ))}
          <Holds position={"row"} className="pb-3 w-full justify-between">
            <Texts size={"p7"}>
              {`Originally Submitted: ${format(
                managerFormApproval?.submittedAt?.toString() ||
                  new Date().toISOString(),
                "M/dd/yy"
              )}`}
            </Texts>
            <Texts size={"p7"}>
              {`Last Edited: ${format(
                managerFormApproval?.approvals?.[0]?.updatedAt?.toString() ||
                  new Date().toISOString(),
                "M/dd/yy"
              )}`}
            </Texts>
          </Holds>
        </Holds>
      </Holds>

      <Holds
        background={"white"}
        className="w-full h-full row-start-5 row-end-9 "
      >
        <Contents width={"section"}>
          <Grids rows={"5"} gap={"5"} className="w-full h-full py-3 ">
            <Holds className="row-start-1 row-end-2 h-full relative">
              <Labels size={"p5"} htmlFor="approvalStatus">
                Approval Status
              </Labels>
              <Selects
                id="approvalStatus"
                value={approvalStatus}
                onChange={handleApprovalStatusChange}
              >
                <option value="APPROVED">Approved</option>
                <option value="DENIED">Denied</option>
              </Selects>
            </Holds>
            <Holds className="row-start-2 row-end-3 h-full relative">
              <Labels size={"p5"} htmlFor="comment">
                Manager Comments
              </Labels>
              <Holds className="w-full relative">
                <TextAreas
                  name="comment"
                  id="comment"
                  value={comment}
                  onChange={handleCommentChange}
                  maxLength={40}
                />
                <Texts className="absolute right-1 bottom-3 px-2 py-1 rounded text-sm text-gray-500">
                  {comment.length} / 40
                </Texts>
              </Holds>
              <Texts position={"right"} size={"p7"}>
                {`Approval Status Last Updated:  ${format(
                  managerFormApproval?.updatedAt?.toString() ||
                    new Date().toISOString(),
                  "M/dd/yy"
                )}`}
              </Texts>
            </Holds>
          </Grids>
        </Contents>
      </Holds>
    </>
  );
}
