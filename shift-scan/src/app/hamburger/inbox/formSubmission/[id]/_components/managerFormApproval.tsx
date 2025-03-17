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
  formSubmissionId: string;
  approvedBy: string;
  approver: {
    firstName: string;
    lastName: string;
  };
  status: FormStatus;
  signature: string;
  comment: string;
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
  updateFormValues: (newValues: Record<string, any>) => void;
}) {
  const router = useRouter();
  const { data: session } = useSession();
  const managerName = session?.user.id;
  const [isSignatureShowing, setIsSignatureShowing] = useState<boolean>(false);
  const [managerSignature, setManagerSignature] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [comment, setComment] = useState<string>(
    managerFormApproval?.comment || ""
  );
  const [formStatus, setFormStatus] = useState<FormStatus>(
    managerFormApproval?.status || FormStatus.PENDING
  );

  // Debug managerFormApproval prop
  useEffect(() => {
    console.log("Manager Form Approval Data:", managerFormApproval);
  }, [managerFormApproval]);

  // Fetch manager's signature on component mount
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

  // Define the auto-save function
  const saveApprovalData = async (data: {
    comment: string;
    formStatus: FormStatus;
  }) => {
    const formData = new FormData();
    formData.append("id", managerFormApproval?.id || "");
    formData.append("formSubmissionId", submissionId || "");
    formData.append("signedBy", managerName || "");
    formData.append("comment", data.comment);
    formData.append("status", data.formStatus); // Use FormStatus enum value
    formData.append("isFinalApproval", "false"); // Indicates this is an autosave

    try {
      console.log("Auto-saving data:", data);
      await updateFormApproval(formData);
      console.log("Autosave successful");
    } catch (error) {
      console.error("Error during autosave:", error);
      setErrorMessage("Failed to save changes. Please try again.");
    }
  };

  // Use the auto-save hook
  const autoSave = useAutoSave<{ comment: string; formStatus: FormStatus }>(
    async (data) => {
      console.log("Auto-saving data:", data);
      saveApprovalData(data);
    },
    2000 // Debounce delay of 2 seconds
  );

  // Trigger auto-save when comment or formStatus changes
  useEffect(() => {
    autoSave({ comment, formStatus });
  }, [comment, formStatus, autoSave]);

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
      setErrorMessage("Please provide a signature before approving.");
      return;
    }

    if (!comment || comment.length === 0) {
      setErrorMessage("Please add a comment before approving.");
      return;
    }

    const formData = new FormData();
    formData.append("formSubmissionId", submissionId || "");
    formData.append("signedBy", managerName || "");
    formData.append("signature", managerSignature || "");
    formData.append("comment", comment);
    formData.append("status", approval); // Use FormStatus enum value
    formData.append("isFinalApproval", "true"); // Indicates this is a final approval

    try {
      console.log("Submitting final approval with data:", {
        formSubmissionId: submissionId,
        signedBy: managerName,
        signature: managerSignature,
        comment,
        status: approval,
      });
      await createFormApproval(formData);
      router.push("/hamburger/inbox");
    } catch (error) {
      console.error("Error during final approval:", error);
      setErrorMessage("Failed to submit approval. Please try again.");
    }
  };

  return (
    <>
      <Holds
        background={"white"}
        className="row-start-1 row-end-2 h-full justify-center px-3 "
      >
        <Grids cols={"5"} rows={"2"} className="w-full h-full p-2">
          <Holds className="col-span-1 row-span-2 flex items-center justify-center">
            <Buttons
              onClick={() => router.push("/hamburger/inbox")}
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
        className="w-full h-full row-start-2 row-end-6 px-5 "
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
        </Holds>
      </Holds>
      <Holds
        background={"white"}
        className="w-full h-full row-start-6 row-end-9 "
      >
        <Contents width={"section"}>
          <Grids rows={"5"} gap={"3"} className="w-full h-full py-5 ">
            <Holds className="row-start-1 row-end-3 relative">
              <Labels size={"p5"} htmlFor="comment">
                Manager Comments
              </Labels>
              <Holds position={"row"} className="w-full relative">
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
            </Holds>

            {!isSignatureShowing ? (
              <Holds className="row-start-3 row-end-5 justify-center items-center">
                <Buttons
                  className="h-full py-3"
                  onClick={() => setIsSignatureShowing(true)}
                >
                  <Texts size={"p6"}>Tap to Sign</Texts>
                </Buttons>
              </Holds>
            ) : (
              <Holds className="h-full row-start-3 row-end-5 justify-center items-center">
                <Holds
                  onClick={() => setIsSignatureShowing(false)}
                  className="h-3/4 w-full border-[3px] border-black rounded-[10px] justify-center items-center "
                >
                  <img
                    className="w-full h-full object-contain"
                    src={managerSignature || ""}
                    alt="Signature"
                  />
                </Holds>
              </Holds>
            )}

            <Holds className="row-start-5 row-end-7 h-full">
              <Holds position={"row"} className="gap-5">
                <Buttons
                  background={
                    isSignatureShowing && comment.length > 0
                      ? "red"
                      : "darkGray"
                  }
                  disabled={!isSignatureShowing || comment.length === 0}
                  className="py-2"
                  onClick={() => handleApproveOrDeny(FormStatus.DENIED)}
                >
                  <Titles size={"h6"}>Deny</Titles>
                </Buttons>
                <Buttons
                  background={
                    isSignatureShowing && comment.length > 0
                      ? "green"
                      : "darkGray"
                  }
                  disabled={!isSignatureShowing || comment.length === 0}
                  onClick={() => handleApproveOrDeny(FormStatus.APPROVED)}
                  className="py-2"
                >
                  <Titles size={"h6"}>Approve</Titles>
                </Buttons>
              </Holds>
              {errorMessage && (
                <Texts className="text-red-500 text-sm mt-2">
                  {errorMessage}
                </Texts>
              )}
            </Holds>
          </Grids>
        </Contents>
      </Holds>
    </>
  );
}
