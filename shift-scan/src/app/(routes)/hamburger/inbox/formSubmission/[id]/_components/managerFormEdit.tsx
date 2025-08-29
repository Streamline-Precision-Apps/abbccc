"use client";
import { FormInput } from "./formInput";
import { FormFieldRenderer } from "@/app/(routes)/hamburger/inbox/_components/FormFieldRenderer";
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
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";
import { Inputs } from "@/components/(reusable)/inputs";
import { useTranslations } from "next-intl";

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
  id: number;
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
  Approvals: Array<{
    id: string;
    formSubmissionId: number;
    signedBy: string;
    submittedAt: string;
    updatedAt: string;
    signature: string;
    comment: string;
    Approver: {
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
  submissionId: number | null;
  managerFormApproval: ManagerFormApprovalSchema | null;
  setFormTitle: Dispatch<SetStateAction<string>>;
  updateFormValues: (newValues: Record<string, string>) => void;
}) {
  const t = useTranslations("Hamburger-Inbox");
  const router = useRouter();
  const [comment, setComment] = useState<string>(
    managerFormApproval?.Approvals?.[0]?.comment || "",
  );
  const [approvalStatus, setApprovalStatus] = useState<FormStatus>(
    managerFormApproval?.status || FormStatus.PENDING,
  );
  // Handle comment change
  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newComment = e.target.value;
    setComment(newComment);
  };
  // Handle approval status change
  const handleApprovalStatusChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
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
    updatedData.append("id", managerFormApproval.Approvals[0].id);
    updatedData.append("formSubmissionId", submissionId.toString());
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

  const { autoSave: debouncedAutoSave } = useAutoSave(handleAutoSave, 500);
  useEffect(() => {
    debouncedAutoSave({ comment, approvalStatus });
  }, [comment, approvalStatus, debouncedAutoSave]);

  return (
    <>
      <Holds
        background={"white"}
        className="row-start-1 row-end-2 h-full justify-center"
      >
        <TitleBoxes onClick={() => router.back()}>
          <Titles size={"h3"}>{formData.name}</Titles>
        </TitleBoxes>
      </Holds>

      <Holds
        background={"white"}
        className="w-full h-full row-start-2 row-end-8 "
      >
        <Contents width={"section"}>
          <Holds className="overflow-y-auto no-scrollbar pt-3 pb-5 ">
            <FormFieldRenderer
              formData={formData}
              formValues={formValues}
              setFormValues={() => {}}
              readOnly={true}
            />
            <Holds
              position={"row"}
              className="py-3 w-full justify-between border-black border-opacity-5 border-b-2"
            >
              <Texts size={"p7"}>
                {`${t("OriginallySubmitted")} ${format(
                  managerFormApproval?.submittedAt?.toString() ||
                    new Date().toISOString(),
                  "M/dd/yy",
                )}`}
              </Texts>
              <Texts size={"p7"}>
                {`${t("LastEdited")} ${format(
                  managerFormApproval?.Approvals?.[0]?.updatedAt?.toString() ||
                    new Date().toISOString(),
                  "M/dd/yy",
                )}`}
              </Texts>
            </Holds>
            <Holds className="relative pb-3">
              <Labels size={"p5"} htmlFor="managerName">
                {t("Manager")}
              </Labels>
              <Inputs
                id="managerName"
                name="managerName"
                type="text"
                value={`${managerFormApproval?.Approvals?.[0]?.Approver?.firstName} ${managerFormApproval?.Approvals?.[0]?.Approver?.lastName}`}
                disabled
                className="text-center text-base"
              />
            </Holds>
            <Holds className="relative pb-3">
              <Labels size={"p5"} htmlFor="approvalStatus">
                {t("ApprovalStatus")}
              </Labels>
              <Selects
                id="approvalStatus"
                value={approvalStatus}
                onChange={handleApprovalStatusChange}
              >
                <option value="APPROVED">{t("Approved")}</option>
                <option value="DENIED">{t("Denied")}</option>
              </Selects>
            </Holds>
            <Holds className="relative">
              <Labels size={"p5"} htmlFor="comment">
                {t("ManagerComments")}
              </Labels>
              <Holds className="w-full relative">
                <TextAreas
                  name="comment"
                  id="comment"
                  value={comment}
                  onChange={handleCommentChange}
                  maxLength={40}
                />
                <Texts className="absolute right-1 bottom-3 px-2 py-1 rounded-sm text-sm text-gray-500">
                  {comment.length} / 40
                </Texts>
              </Holds>
              <Texts position={"right"} size={"p7"}>
                {`${t("ApprovalStatusLastUpdated")} ${format(
                  managerFormApproval?.updatedAt?.toString() ||
                    new Date().toISOString(),
                  "M/dd/yy",
                )}`}
              </Texts>
            </Holds>
          </Holds>
        </Contents>
      </Holds>
    </>
  );
}
