"use client";
import { Buttons } from "@/components/(reusable)/buttons";
import { Contents } from "@/components/(reusable)/contents";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Inputs } from "@/components/(reusable)/inputs";
import { Labels } from "@/components/(reusable)/labels";
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";
import { FormInput } from "./formInput";
import { FormEvent, useEffect, useState } from "react";
import { deleteFormSubmission } from "@/actions/hamburgerActions";
import { Titles } from "@/components/(reusable)/titles";
import { useRouter } from "next/navigation";
import { Images } from "@/components/(reusable)/images";
import { Texts } from "@/components/(reusable)/texts";
import { format } from "date-fns";
import { TextAreas } from "@/components/(reusable)/textareas";

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
  signature: string;
  comment: string;
};

export default function ManagerFormApproval({
  formData,
  handleSubmit,
  formTitle,
  setFormTitle,
  formValues,
  updateFormValues,
  submissionStatus,
  signature,
  submittedForm,
  submissionId,
  managerFormApproval,
}: {
  formData: FormTemplate;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => Promise<void>;
  formValues: Record<string, string>;
  formTitle: string;
  setFormTitle: (title: string) => void;
  updateFormValues: (values: Record<string, string>) => void;
  submissionStatus: string | null;
  signature: string | null;
  submittedForm: string | null;
  submissionId: string | null;
  managerFormApproval: ManagerFormApprovalSchema | null;
}) {
  const router = useRouter();
  const [isSignatureShowing, setIsSignatureShowing] = useState<boolean>(false);
  const [managerSignature, setManagerSignature] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [comment, setComment] = useState<string>(
    managerFormApproval?.comment || ""
  );

  useEffect(() => {
    const fetchSignature = async () => {
      const getUserSignature = await fetch("/api/getUserSignature");
      const signature = await getUserSignature.json();
      setManagerSignature(signature.signature);
      console.log("Manager Signature:", signature);
    };

    fetchSignature();
  }, [managerFormApproval]);

  const handleApproveOrDeny = async (approval: Boolean) => {
    if (!isSignatureShowing) {
      setErrorMessage("Please provide a signature before approving.");
      return;
    }

    if (!comment || comment.length === 0) {
      setErrorMessage("Please add a comment before approving.");
      return;
    }
    const formData = new FormData();
    formData.append("id", managerFormApproval?.id || "");
    formData.append("approvedBy", managerFormApproval?.approvedBy || "");
    formData.append("signature", managerSignature);
    formData.append("comment", comment);
    if (!approval) {
    } else {
    }
  };
  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComment(e.target.value);
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
                      key={field.name} // Use field.name as the key
                      field={field}
                      formValues={formValues}
                      setFormValues={updateFormValues}
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
        <Grids rows={"5"} className="w-full h-full py-3 ">
          <Holds className="row-start-1 row-end-3 py-1 px-4 relative">
            <Labels size={"p4"} htmlFor="comment">
              Manager Comments
            </Labels>
            <Holds position={"row"} className="w-full relative">
              <TextAreas
                name="comment"
                id="comment"
                value={comment}
                onChange={handleCommentChange}
                maxLength={40} // Optional: Add a character limit
              />
              {/* Overlay the character count */}
              <Texts className="absolute right-1 bottom-3 px-2 py-1 rounded text-sm text-gray-500">
                {comment.length} / 40
              </Texts>
            </Holds>
          </Holds>

          <Holds className="row-start-3 row-end-5 p-4 h-full justify-center items-center">
            {!isSignatureShowing ? (
              <Buttons
                className="h-full py-3"
                onClick={() => {
                  setIsSignatureShowing(true);
                }}
              >
                <Texts>Tap to Sign</Texts>
              </Buttons>
            ) : (
              <Holds
                onClick={() => setIsSignatureShowing(false)}
                className="h-full border-[3px] border-black rounded-[10px] justify-center items-center "
              >
                <img
                  className="w-full h-full object-contain"
                  src={managerSignature || ""}
                  alt="Signature"
                />
              </Holds>
            )}
          </Holds>

          <Holds className="row-start-5 row-end-7">
            <Holds position={"row"} className="gap-5 px-5">
              <Buttons
                background={
                  isSignatureShowing && comment.length > 0 ? "red" : "darkGray"
                }
                disabled={!isSignatureShowing || comment.length === 0}
                className="py-2"
                onClick={() => handleApproveOrDeny(false)}
              >
                <Titles size={"h4"}>Deny</Titles>
              </Buttons>
              <Buttons
                background={
                  isSignatureShowing && comment.length > 0
                    ? "green"
                    : "darkGray"
                }
                disabled={!isSignatureShowing || comment.length === 0}
                onClick={() => handleApproveOrDeny(true)}
                className="py-2"
              >
                <Titles size={"h4"}>Approve</Titles>
              </Buttons>
            </Holds>
            {/* Display error message */}
            {errorMessage && (
              <Texts className="text-red-500 text-sm mt-2">
                {errorMessage}
              </Texts>
            )}
          </Holds>
        </Grids>
      </Holds>
    </>
  );
}
