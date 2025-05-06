"use client";
import { FormInput } from "./formInput";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  createFormApproval,
  updateFormApproval,
} from "@/actions/hamburgerActions";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useAutoSave } from "@/hooks/(inbox)/useAutoSave";
import { Buttons } from "@/components/(reusable)/buttons";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Images } from "@/components/(reusable)/images";
import { Labels } from "@/components/(reusable)/labels";
import { TextAreas } from "@/components/(reusable)/textareas";
import { Texts } from "@/components/(reusable)/texts";
import { Titles } from "@/components/(reusable)/titles";
import { Contents } from "@/components/(reusable)/contents";
import { Inputs } from "@/components/(reusable)/inputs";
import { Select } from "@nextui-org/react";
import { Selects } from "@/components/(reusable)/selects";
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
  updateFormValues: (newValues: Record<string, any>) => void;
}) {
  const router = useRouter();
  const managerName =
    managerFormApproval?.approvals[0].approver.firstName +
    " " +
    managerFormApproval?.approvals[0].approver.lastName;

  const status = managerFormApproval?.status;

  const comment = managerFormApproval?.approvals[0].comment;
  return (
    <>
      <Holds
        background={"white"}
        className="row-span-1 h-full justify-center px-3 "
      >
        <Grids cols={"5"} rows={"2"} className="w-full h-full p-2">
          <Holds className="col-span-1 row-span-2 flex items-center justify-center">
            <Buttons
              onClick={() => router.back()}
              background={"none"}
              position={"left"}
            >
              <Images
                titleImg="/arrowBack.svg"
                titleImgAlt={"Turn Back"}
                className="max-w-8 h-auto object-contain"
              />
            </Buttons>
          </Holds>

          <Holds className="col-start-2 col-end-5 row-start-1 row-end-3 flex items-center justify-center">
            <Titles size={"h4"}>
              {formTitle === "" ? formData.name : formTitle}
            </Titles>
            <Titles size={"h6"}>{formData.name}</Titles>
          </Holds>
          <Holds className="col-start-5 col-end-6 row-start-1 row-end-3">
            <Holds
              background={
                submissionStatus === "PENDING"
                  ? "orange"
                  : submissionStatus === "APPROVED"
                  ? "green"
                  : "red"
              }
              className="flex items-center justify-center w-10 h-auto rounded-full"
            >
              <Images
                titleImgAlt={"form Status"}
                titleImg={
                  submissionStatus === "PENDING"
                    ? "/OrangestatusOngoing.svg"
                    : submissionStatus === "APPROVED"
                    ? "/statusApproved.svg"
                    : "/statusReject.svg"
                }
                className=" w-10 h-auto object-contain"
              />
            </Holds>
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
                  <Holds key={field.id} className="pb-3">
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
          </Holds>
        </Holds>
      </Holds>
      <Holds
        background={"white"}
        className="w-full h-full row-start-5 row-end-9 "
      >
        <Contents width={"section"}>
          <Grids rows={"5"} gap={"5"} className="w-full h-full py-5">
            <Holds className="row-start-1 row-end-2 h-full">
              <Labels size={"p5"}>Manager</Labels>
              <Inputs
                type="text"
                value={managerName}
                disabled
                className="w-full text-center"
              />
            </Holds>
            <Holds className="row-start-2 row-end-3 h-full">
              <Labels size={"p5"}>Approval Status</Labels>
              <Selects value={status} disabled className="w-full text-center">
                <option value="APPROVED">Approved</option>
                <option value="DENIED">Denied</option>
              </Selects>
            </Holds>
            <Holds className="row-start-3 row-end-5 h-full">
              <Holds>
                <Labels size={"p5"}>Manager Comment</Labels>
                <TextAreas value={comment} disabled className="w-full" />
              </Holds>
              <Texts size={"p7"} position={"right"}>
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
