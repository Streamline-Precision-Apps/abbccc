"use client";
import { FormInput } from "./formInput";
import { FormFieldRenderer } from "@/app/(routes)/hamburger/inbox/_components/FormFieldRenderer";
import { Dispatch, SetStateAction } from "react";
import { useRouter } from "next/navigation";
import { Holds } from "@/components/(reusable)/holds";
import { Images } from "@/components/(reusable)/images";
import { Labels } from "@/components/(reusable)/labels";
import { TextAreas } from "@/components/(reusable)/textareas";
import { Texts } from "@/components/(reusable)/texts";
import { Titles } from "@/components/(reusable)/titles";
import { Contents } from "@/components/(reusable)/contents";
import { format } from "date-fns";
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";
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
  Approvals: Array<{
    id: string;
    formSubmissionId: string;
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

export default function SubmittedFormsApproval({
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
  const t = useTranslations("Hamburger-Inbox");
  const router = useRouter();
  const managerName =
    managerFormApproval?.Approvals[0].Approver.firstName +
    " " +
    managerFormApproval?.Approvals[0].Approver.lastName;

  const status = managerFormApproval?.status;

  const comment = managerFormApproval?.Approvals[0].comment;
  return (
    <>
      <Holds
        background={"white"}
        className="row-span-1 h-full w-full justify-center "
      >
        <TitleBoxes onClick={() => router.back()}>
          <Holds className="px-8 h-full justify-center items-center">
            <Titles size={"h3"}>
              {formTitle
                ? formTitle.charAt(0).toUpperCase() +
                  formTitle.slice(1).slice(0, 24)
                : formData.name.charAt(0).toUpperCase() +
                  formData.name.slice(1).slice(0, 24)}
            </Titles>
            {formTitle !== "" && <Titles size={"h6"}>{formData.name}</Titles>}

            <Holds className=" w-12 h-12 absolute right-1 top-0 justify-center">
              <Images
                titleImgAlt={"form Status"}
                titleImg={
                  submissionStatus === "PENDING"
                    ? "/statusOngoingFilled.svg"
                    : submissionStatus === "APPROVED"
                    ? "/statusApprovedFilled.svg"
                    : "/statusDeniedFilled.svg"
                }
                className="max-w-10 h-auto object-contain"
              />
            </Holds>
          </Holds>
        </TitleBoxes>
      </Holds>

      <Holds
        background={"white"}
        className="w-full h-full row-start-2 row-end-8"
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
              className="pb-3 w-full justify-between border-black border-opacity-5 border-b-2"
            >
              <Texts size={"p7"}>
                {`${t("OriginallySubmitted")} ${format(
                  managerFormApproval?.submittedAt?.toString() ||
                    new Date().toISOString(),
                  "M/dd/yy"
                )}`}
              </Texts>
            </Holds>
            <Holds position={"row"} className="h-full py-3 gap-1">
              <Texts position={"left"} size={"p5"} className="italic">{`${
                status === FormStatus.APPROVED ? t("ApprovedBy") : t("DeniedBy")
              }`}</Texts>
              <Texts
                position={"left"}
                size={"p5"}
                className="italic"
              >{`${managerName}`}</Texts>
            </Holds>
            <Holds className="h-full pb-3">
              <Holds>
                <Labels size={"p5"}>{t("ManagerComments")}</Labels>
                <TextAreas value={comment} disabled className="w-full" />
              </Holds>
              <Texts size={"p7"} position={"left"}>
                {`${t("ApprovalStatusLastUpdated")} ${format(
                  managerFormApproval?.updatedAt?.toString() ||
                    new Date().toISOString(),
                  "M/dd/yy"
                )}`}
              </Texts>
            </Holds>
          </Holds>
        </Contents>
      </Holds>
    </>
  );
}
