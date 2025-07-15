"use client";
import { FormInput } from "./formInput";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { createFormApproval } from "@/actions/hamburgerActions";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Buttons } from "@/components/(reusable)/buttons";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Labels } from "@/components/(reusable)/labels";
import { TextAreas } from "@/components/(reusable)/textareas";
import { Texts } from "@/components/(reusable)/texts";
import { Titles } from "@/components/(reusable)/titles";
import { Contents } from "@/components/(reusable)/contents";
import { format } from "date-fns";
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";
import { useTranslations } from "next-intl";
import { Images } from "@/components/(reusable)/images";

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

export default function ManagerFormApproval({
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
  const { data: session } = useSession();
  const managerName = session?.user.id;
  const [isSignatureShowing, setIsSignatureShowing] = useState<boolean>(false);
  const [managerSignature, setManagerSignature] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [comment, setComment] = useState<string>(
    managerFormApproval?.Approvals?.[0]?.comment || ""
  );
  useEffect(() => {
    const fetchSignature = async () => {
      try {
        const response = await fetch("/api/getUserSignature");
        if (!response.ok) {
          throw new Error("Failed to fetch signature");
        }
        const signature = await response.json();
        console.log("Fetched Signature:", signature);
        setManagerSignature(signature.signature);
      } catch (error) {
        console.error("Error fetching signature:", error);
      }
    };

    fetchSignature();
  }, []);

  // Handle comment change
  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newComment = e.target.value;
    setComment(newComment);
  };

  // Handle final approval or denial
  const handleApproveOrDeny = async (
    approval: FormStatus.APPROVED | FormStatus.DENIED
  ) => {
    if (!isSignatureShowing) {
      setErrorMessage(t("PleaseProvideASignatureBeforeApproving"));
      return;
    }

    if (!comment || comment.length === 0) {
      setErrorMessage(t("PleaseAddACommentBeforeApproving"));
      return;
    }

    const formData = new FormData();
    formData.append("formSubmissionId", submissionId || "");
    formData.append("signedBy", managerName || "");
    formData.append("signature", managerSignature || "");
    formData.append("comment", comment);

    try {
      await createFormApproval(formData, approval);
      router.back();
    } catch (error) {
      console.error("Error during final approval:", error);
      setErrorMessage(t("FailedToSubmitApprovalPleaseTryAgain"));
    }
  };

  return (
    <>
      <Holds
        background={"white"}
        className="row-start-1 row-end-2 w-full h-full"
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
              <Texts size={"p7"}>
                {`${t("LastEdited")} ${format(
                  managerFormApproval?.Approvals?.[0]?.updatedAt?.toString() ||
                    new Date().toISOString(),
                  "M/dd/yy"
                )}`}
              </Texts>
            </Holds>

            <Holds className="py-3 w-full relative">
              <Labels size={"p5"} htmlFor="comment">
                {t("ManagerComments")}
              </Labels>
              <Holds position={"row"} className="w-full relative">
                <TextAreas
                  name="comment"
                  id="comment"
                  value={comment}
                  onChange={handleCommentChange}
                  maxLength={40}
                  rows={4}
                  className="text-sm"
                />
                <Texts className="absolute right-1 bottom-3 px-2 py-1 rounded-sm text-sm text-gray-500">
                  {comment.length} / 40
                </Texts>
              </Holds>
            </Holds>

            {!isSignatureShowing ? (
              <Holds className=" h-full pb-3 justify-center items-center">
                <Buttons
                  className="py-3 shadow-none"
                  onClick={() => setIsSignatureShowing(true)}
                >
                  <Texts size={"p4"}>{t("TapToSign")}</Texts>
                </Buttons>
              </Holds>
            ) : (
              <Holds className="pb-3">
                <Holds className=" w-full relative  border-[3px] border-black rounded-[10px] justify-center items-center ">
                  <img
                    className="w-1/2 h-auto object-contain"
                    src={managerSignature || ""}
                    alt="Signature"
                  />
                  <Holds
                    onClick={() => setIsSignatureShowing(false)}
                    background={"orange"}
                    className="w-10 h-10 p-1 border-[3px] border-black rounded-full absolute justify-center items-center top-1 right-1"
                  >
                    <Images
                      className="max-w-8 h-auto object-contain"
                      titleImg="/eraser.svg"
                      titleImgAlt="eraser Icon"
                    />
                  </Holds>
                </Holds>
              </Holds>
            )}

            <Holds className="pt-3 w-full h-full">
              <Holds position={"row"} className="gap-x-3">
                <Buttons
                  shadow={"none"}
                  background={
                    isSignatureShowing && comment.length > 0
                      ? "red"
                      : "darkGray"
                  }
                  disabled={!isSignatureShowing || comment.length === 0}
                  className="py-2"
                  onClick={() => handleApproveOrDeny(FormStatus.DENIED)}
                >
                  <Titles size={"h4"}>{t("Deny")}</Titles>
                </Buttons>
                <Buttons
                  shadow={"none"}
                  background={
                    isSignatureShowing && comment.length > 0
                      ? "green"
                      : "darkGray"
                  }
                  disabled={!isSignatureShowing || comment.length === 0}
                  onClick={() => handleApproveOrDeny(FormStatus.APPROVED)}
                  className="py-2"
                >
                  <Titles size={"h4"}>{t("Approve")}</Titles>
                </Buttons>
              </Holds>
              {errorMessage && (
                <Texts className="text-red-500 text-sm mt-2">
                  {errorMessage}
                </Texts>
              )}
            </Holds>
          </Holds>
        </Contents>
      </Holds>
    </>
  );
}
