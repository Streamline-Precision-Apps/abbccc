"use client";
import { Buttons } from "@/components/(reusable)/buttons";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Labels } from "@/components/(reusable)/labels";
import { FormInput } from "./formInput";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { updateFormApproval } from "@/actions/hamburgerActions";
import { Titles } from "@/components/(reusable)/titles";
import { useRouter, useSearchParams } from "next/navigation";
import { Images } from "@/components/(reusable)/images";
import { Texts } from "@/components/(reusable)/texts";
import { TextAreas } from "@/components/(reusable)/textareas";
import { useSession } from "next-auth/react";
import { Selects } from "@/components/(reusable)/selects";
import { debounce } from "lodash";

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
  signature: string;
  comment: string;
};

export default function ManagerFormEditApproval({
  formData,
  formTitle,
  formValues,
  submissionStatus,
  signature,
  submittedForm,
  submissionId,
  managerFormApproval,
}: {
  formData: FormTemplate;
  formValues: Record<string, string>;
  formTitle: string;
  submissionStatus: string | null;
  signature: string | null;
  submittedForm: string | null;
  submissionId: string | null;
  managerFormApproval: ManagerFormApprovalSchema | null;
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

  // Fetch manager's signature on component mount
  useEffect(() => {
    const fetchSignature = async () => {
      const response = await fetch("/api/getUserSignature");
      const signature = await response.json();
      setManagerSignature(signature.signature);
    };

    fetchSignature();
  }, []);

  // Autosave function with debounce
  const autoSave = useCallback(
    debounce(async (newComment: string, newIsApproved: boolean) => {
      const formData = new FormData();
      formData.append("id", managerFormApproval?.id || "");
      formData.append("formSubmissionId", submissionId || "");
      formData.append("signedBy", managerName || "");
      formData.append("comment", newComment);
      formData.append("isApproved", newIsApproved.toString());
      formData.append("isFinalApproval", "false"); // Indicates this is an autosave

      try {
        await updateFormApproval(formData);
        console.log("Autosave successful");
      } catch (error) {
        console.error("Error during autosave:", error);
        setErrorMessage("Failed to save changes. Please try again.");
      }
    }, 2000), // 2-second debounce
    [managerFormApproval?.id, submissionId, managerName]
  );

  // Handle comment change
  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newComment = e.target.value;
    setComment(newComment);
    autoSave(newComment, isApproved);
  };

  // Handle approval change
  const handleApprovalChange = (newIsApproved: boolean) => {
    setIsApproved(newIsApproved);
    autoSave(comment, newIsApproved);
  };

  // Handle final approval or denial
  const handleApproveOrDeny = async (approval: boolean) => {
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
    formData.append("formSubmissionId", submissionId || "");
    formData.append("signedBy", managerName || "");
    formData.append("signature", managerSignature || "");
    formData.append("comment", comment);
    formData.append("isApproved", approval.toString());
    formData.append("isFinalApproval", "true"); // Indicates this is a final approval

    try {
      await updateFormApproval(formData);
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
        <Grids rows={"5"} className="w-full h-full py-3">
          <Holds className="px-4 row-start-1 row-end-2">
            <Labels size={"p5"}>Approval Signature</Labels>
            <Selects
              value={isApproved ? "true" : "false"}
              onChange={(e) => handleApprovalChange(e.target.value === "true")}
              className="text-center"
            >
              <option value="true">Approved</option>
              <option value="false">Denied</option>
            </Selects>
          </Holds>
          <Holds className="row-start-2 row-end-5 py-1 px-4 relative">
            <Labels size={"p5"} htmlFor="comment">
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
        </Grids>
      </Holds>
    </>
  );
}
