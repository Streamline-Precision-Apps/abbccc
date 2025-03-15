"use client";
import { FormEvent, useEffect, useState, useCallback } from "react";
import { Bases } from "@/components/(reusable)/bases";
import { Contents } from "@/components/(reusable)/contents";
import { Holds } from "@/components/(reusable)/holds";
import { Buttons } from "@/components/(reusable)/buttons";
import { Grids } from "@/components/(reusable)/grids";
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";
import Spinner from "@/components/(animations)/spinner";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { saveDraft, submitForm } from "@/actions/hamburgerActions";
import FormDraft from "./_components/formDraft";
import ManagerFormApproval from "./_components/managerFormApproval";
import SubmittedForms from "./_components/submittedForms";
import { title } from "process";

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

export default function DynamicForm({ params }: { params: { id: string } }) {
  const formSubmissions = useSearchParams();
  const submissionId = formSubmissions.get("submissionId");
  const submissionStatus = formSubmissions.get("status"); // url search params for form submission
  const submissionApprovingStatus = formSubmissions.get("approvingStatus"); // url for form submission
  const [formData, setFormData] = useState<FormTemplate | null>(null);
  const [initialDraftData, setInitialDraftData] = useState<
    Record<string, string>
  >({});
  const [formTitle, setFormTitle] = useState<string>("");
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [signature, setSignature] = useState<string | null>(null);
  const [submittedForm, setSubmittedForm] = useState<string | null>(null);
  const [managerFormApproval, SetManagerFormApproval] =
    useState<ManagerFormApprovalSchema | null>(null);
  const [managerSignature, setManagerSignature] = useState<string | null>(null);
  const { data: session } = useSession();
  const userId = session?.user.id;
  const router = useRouter();

  // Fetch form template and draft data on page load
  useEffect(() => {
    setLoading(true);

    async function fetchForm() {
      try {
        const res = await fetch(`/api/form/` + params.id);
        const data = await res.json();
        setFormData(data);

        if (submissionId && submissionStatus === "DRAFT") {
          const draftRes = await fetch(`/api/formDraft/` + submissionId);
          const draftData = await draftRes.json();

          setFormValues(draftData.data);
          setFormTitle(draftData.title || ""); // Set the title from draft data
          setInitialDraftData(draftData.data); // Store the initial draft data
        } else if (
          submissionId &&
          submissionStatus === "PENDING" &&
          submissionApprovingStatus === null
        ) {
          const submissionRes = await fetch(
            `/api/formSubmission/` + submissionId
          );
          const submissionData = await submissionRes.json();
          setFormValues(submissionData.data);
          setFormTitle(submissionData.title || ""); // Set the title from draft data
          setInitialDraftData(submissionData.data); // Store the initial draft data
          setSignature(submissionData.user.signature);
          setSubmittedForm(submissionData.submittedAt);
        } else if (
          submissionId &&
          submissionStatus === "PENDING" &&
          submissionApprovingStatus === "true"
        ) {
          const submissionRes = await fetch(
            `/api/teamSubmission/` + submissionId
          );
          const submissionData = await submissionRes.json();
          console.log("the correct data", submissionData);
          setFormValues(submissionData.data);
          setFormTitle(
            submissionData.user.firstName +
              " " +
              submissionData.user.lastName || ""
          ); // Set the title from draft data
          setInitialDraftData(submissionData.data); // Store the initial draft data
          setSignature(submissionData.user.signature);
          setSubmittedForm(submissionData.submittedAt);

          const managerFormApprovalRes = await fetch(
            `/api/managerFormApproval/` + submissionId
          );
          const managerFormApprovalData = await managerFormApprovalRes.json();
          SetManagerFormApproval(managerFormApprovalData);
        }
      } catch (error) {
        console.error("error", error);
      } finally {
        setLoading(false);
      }
    }

    fetchForm();
  }, [params.id, submissionId]);

  const getChangedFields = (
    currentValues: Record<string, string>,
    initialValues: Record<string, string>
  ) => {
    const changedFields: Record<string, string> = {};

    for (const key in currentValues) {
      if (currentValues[key] !== initialValues[key]) {
        changedFields[key] = currentValues[key];
      }
    }

    return changedFields;
  };

  // Debounce function
  const debounce = (func: Function, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeoutId); // Clear the previous timeout
      timeoutId = setTimeout(() => func(...args), delay); // Set a new timeout
    };
  };

  // Memoized auto-save function
  const autoSave = useCallback(
    debounce(async (values: Record<string, any>, title: string) => {
      if ((Object.keys(values).length > 0 || title) && formData) {
        setIsSaving(true);
        try {
          // Ensure initialDraftData is not null
          if (!initialDraftData) {
            throw new Error("Initial draft data is not available");
          }

          const changedFields = getChangedFields(values, initialDraftData); // Get only changed fields

          // Check if the form is in "PENDING" status
          if (submissionStatus === "PENDING") {
            // For pending forms, exclude certain fields from being overwritten
            const updatedValues = {
              ...changedFields,
            };

            await saveDraft(
              updatedValues,
              formData.id,
              title,
              userId || "",
              formData.formType,
              submissionId || undefined
            );
          } else {
            // For drafts or other statuses, save as usual
            await saveDraft(
              { ...changedFields },
              formData.id,
              title,
              userId || "",
              formData.formType,
              submissionId || undefined
            );
          }

          console.log("Draft saved successfully");
        } catch (error) {
          console.error("Error saving draft:", error);
        } finally {
          setIsSaving(false);
        }
      }
    }, 2000), // Save every 2 seconds after the user stops typing
    [
      formData,
      userId,
      submissionId,
      initialDraftData,
      submissionStatus,
      signature,
      submittedForm,
      title,
    ] // Dependencies
  );

  const updateFormValues = useCallback(
    (newValues: Record<string, any>) => {
      if (submissionStatus === "PENDING") {
        // For "PENDING" forms, preserve certain fields
        const updatedValues = {
          ...formValues, // Preserve existing values
          ...newValues, // Overwrite with new values
        };
        setFormValues(updatedValues);
        autoSave(updatedValues, formTitle);
      } else {
        // For drafts or other statuses, merge new values with existing formValues
        const updatedValues = {
          ...formValues,
          ...newValues,
        };
        setFormValues(updatedValues);
        autoSave(updatedValues, formTitle);
      }
    },
    [
      autoSave,
      formTitle,
      submissionStatus,
      signature,
      submittedForm,
      formValues,
    ]
  );

  // Handle form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData) {
      console.error("Form data is not available");
      return;
    }

    try {
      const result = await submitForm(
        { ...formValues }, // Include the title in the submission
        formData.id,
        userId || "",
        formData.formType,
        formTitle,
        submissionId || undefined
      );

      if (result) {
        router.push("/hamburger/inbox"); // Redirect to a success page
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  if (loading || !formData) {
    return (
      <Bases>
        <Contents>
          <Grids className="grid-rows-8 gap-5">
            <Holds
              background={"white"}
              className="row-span-1 h-full justify-center animate-pulse px-2 "
            >
              <TitleBoxes
                title={"loading..."}
                type="noIcon"
                titleImg={""}
                titleImgAlt={""}
              />
            </Holds>

            <Holds
              background={"white"}
              className="w-full h-full row-span-7 animate-pulse"
            >
              <Contents width={"section"}>
                <form className="h-full">
                  <Grids rows={"6"} gap={"3"} className="h-full w-full my-5">
                    <Holds className="row-start-1 row-end-6 h-full w-full justify-center">
                      <Spinner />
                    </Holds>

                    <Holds className="row-start-6 row-end-7 h-full w-full">
                      <Buttons
                        background={"lightGray"}
                        type="submit"
                        className="w-full h-[50px]"
                      ></Buttons>
                    </Holds>
                  </Grids>
                </form>
              </Contents>
            </Holds>
          </Grids>
        </Contents>
      </Bases>
    );
  }

  return (
    <Bases>
      <Contents>
        <Grids rows={"8"} gap={"5"} className="w-full h-full">
          {submissionStatus === "DRAFT" && (
            <FormDraft
              formData={formData}
              handleSubmit={handleSubmit}
              formTitle={formTitle}
              setFormTitle={setFormTitle}
              formValues={formValues}
              updateFormValues={updateFormValues}
            />
          )}
          {submissionApprovingStatus === null &&
            submissionStatus !== "DRAFT" && (
              <SubmittedForms
                formData={formData}
                formTitle={formTitle}
                setFormTitle={setFormTitle}
                formValues={formValues}
                updateFormValues={updateFormValues}
                submissionStatus={submissionStatus}
                signature={signature}
                submittedForm={submittedForm}
                submissionId={submissionId}
              />
            )}

          {submissionApprovingStatus === "true" &&
            submissionStatus === "PENDING" && (
              <ManagerFormApproval
                formData={formData}
                handleSubmit={handleSubmit}
                formTitle={formTitle}
                setFormTitle={setFormTitle}
                formValues={formValues}
                updateFormValues={updateFormValues}
                submissionStatus={submissionStatus}
                signature={signature}
                submittedForm={submittedForm}
                submissionId={submissionId}
                managerFormApproval={managerFormApproval}
              />
            )}
        </Grids>
      </Contents>
    </Bases>
  );
}
